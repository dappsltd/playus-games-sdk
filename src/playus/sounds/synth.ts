import type { SoundPlayOptions } from '../sound';
import { emphasisSettings, soundRecipes, type SoundLayer, type SynthSoundId } from './recipes';

export function isSynthSoundId(id: string): id is SynthSoundId {
  return Object.prototype.hasOwnProperty.call(soundRecipes.default, id);
}

const randomFactor = (amount: number) => 1 + (Math.random() * 2 - 1) * amount;

/** Renders bundled recipes on the SoundManager's AudioContext and mute output. */
export class SoundSynth {
  private readonly output: GainNode;
  private readonly room: BiquadFilterNode;
  private readonly noise: AudioBuffer;
  private readonly voices = new Map<SynthSoundId, GainNode>();

  constructor(private readonly context: AudioContext, destination: AudioNode) {
    this.output = context.createGain();
    this.output.gain.value = 4;
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -8;
    limiter.knee.value = 6;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.08;
    this.output.connect(limiter).connect(destination);

    // Reuse two seconds of noise; each strike starts at a different offset.
    this.noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noise = this.noise.getChannelData(0);
    for (let i = 0; i < noise.length; i++) noise[i] = Math.random() * 2 - 1;

    const impulse = context.createBuffer(2, Math.ceil(context.sampleRate * 0.25), context.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      let energy = 0;
      for (let i = 0; i < data.length; i++) {
        const seconds = i / context.sampleRate;
        data[i] = seconds < 0.008 ? 0 : (Math.random() * 2 - 1) * Math.exp(-Math.log(1000) * seconds / 0.25);
        energy += data[i] ** 2;
      }
      const scale = energy > 0 ? 1 / Math.sqrt(energy) : 0;
      for (let i = 0; i < data.length; i++) data[i] *= scale;
    }
    const convolver = context.createConvolver();
    convolver.normalize = false;
    convolver.buffer = impulse;
    this.room = context.createBiquadFilter();
    this.room.type = 'lowpass';
    this.room.frequency.value = 3500;
    this.room.Q.value = -3;
    this.room.connect(convolver).connect(this.output);
  }

  play(id: SynthSoundId, options: SoundPlayOptions): void {
    const theme = options.theme && Object.prototype.hasOwnProperty.call(soundRecipes, options.theme)
      ? options.theme : 'default';
    const emphasis = options.emphasis && Object.prototype.hasOwnProperty.call(emphasisSettings, options.emphasis)
      ? options.emphasis : 'normal';
    const settings = emphasisSettings[emphasis];
    const recipe = soundRecipes[theme][id];
    const now = this.context.currentTime;
    const master = this.context.createGain();
    master.gain.value = recipe.masterGain * (options.volume ?? 1);
    master.connect(this.output);
    const send = this.context.createGain();
    send.gain.value = 0.08 * (recipe.room ?? 1);
    master.connect(send).connect(this.room);

    // Repeated taps release the previous voice instead of piling up its volume.
    const previous = this.voices.get(id);
    if (previous) {
      previous.gain.cancelScheduledValues(now);
      previous.gain.setValueAtTime(previous.gain.value, now);
      previous.gain.linearRampToValueAtTime(0, now + 0.08);
    }
    this.voices.set(id, master);

    const pitch = settings.pitch * 2 ** (Math.max(-48, Math.min(48, options.semitones ?? 0)) / 12)
      * randomFactor(recipe.vary?.pitch ?? 0)
      * (id === 'select' && options.direction ? (options.direction === 'back' ? 0.95 : 1.05) : 1);
    const force = randomFactor(recipe.vary?.level ?? 0);
    const duration = Number.isFinite(options.duration) ? options.duration! : 800;
    const time = id === 'count' ? Math.max(300, Math.min(2000, duration)) / 800 : 1;
    const reverse = options.direction === 'back' && (id === 'navigate' || id === 'toggle' || id === 'count');
    let remaining = 0;

    for (const layer of recipe.layers) {
      if (layer.from && emphasisSettings[layer.from].rank > settings.rank) continue;
      remaining += 1;
      const source = this.renderLayer(layer, master, now, pitch, force, settings, time, reverse, !!recipe.vary);
      source.onended = () => {
        remaining -= 1;
        source.disconnect();
        if (remaining !== 0) return;
        master.disconnect();
        send.disconnect();
        if (this.voices.get(id) === master) this.voices.delete(id);
      };
    }
  }

  private renderLayer(
    layer: SoundLayer,
    destination: AudioNode,
    now: number,
    pitch: number,
    force: number,
    emphasis: typeof emphasisSettings.normal,
    time: number,
    reverse: boolean,
    vary: boolean,
  ): AudioScheduledSourceNode {
    const start = now + (layer.offset ?? 0) * time;
    const stretch = layer.stretch ? time : 1;
    const attack = layer.attack * stretch;
    const decay = layer.decay * emphasis.length * stretch * (vary ? randomFactor(0.1) : 1);
    const frequency = layer.kind === 'tone' ? layer.frequency : layer.filterFrequency;
    const tune = pitch * (layer.kind === 'tone' ? (vary ? randomFactor(0.005) : 1) : force);
    const from = reverse && layer.glideTo !== undefined ? layer.glideTo : frequency;
    const to = reverse && layer.glideTo !== undefined ? frequency : layer.glideTo;
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(
      layer.peak * force * emphasis.level * (frequency >= 2500 ? emphasis.bright : 1), start + attack,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
    gain.connect(destination);

    let source: OscillatorNode | AudioBufferSourceNode;
    let param: AudioParam;
    let filter: BiquadFilterNode | undefined;
    if (layer.kind === 'tone') {
      const oscillator = this.context.createOscillator();
      oscillator.type = layer.waveform;
      oscillator.detune.value = layer.detune ?? 0;
      oscillator.connect(gain);
      param = oscillator.frequency;
      source = oscillator;
    } else {
      const noise = this.context.createBufferSource();
      noise.buffer = this.noise;
      noise.loop = true;
      filter = this.context.createBiquadFilter();
      filter.type = layer.filterType;
      filter.Q.value = layer.filterQ ?? 1;
      noise.connect(filter).connect(gain);
      param = filter.frequency;
      source = noise;
    }
    const limitFrequency = (value: number) => Math.max(0.001, Math.min(this.context.sampleRate / 2, value * tune));
    param.setValueAtTime(limitFrequency(from), start);
    if (to !== undefined) {
      param.exponentialRampToValueAtTime(limitFrequency(to), start + (layer.glideTime ?? layer.attack + layer.decay) * stretch);
    }
    if (layer.kind === 'noise') (source as AudioBufferSourceNode).start(start, Math.random() * 2);
    else source.start(start);
    source.stop(start + attack + decay + 0.05);
    source.addEventListener('ended', () => {
      gain.disconnect();
      filter?.disconnect();
    }, { once: true });
    return source;
  }
}
