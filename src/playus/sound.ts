import { SoundSynth, isSynthSoundId } from './sounds/synth';
import { synthSoundLicense, type SoundEmphasis, type SoundTheme, type SynthSoundId } from './sounds/recipes';

export { synthSoundIds, soundThemes } from './sounds/recipes';
export type { SoundEmphasis, SoundTheme, SynthSoundId } from './sounds/recipes';

export type SampleSoundId =
  | 'ball-hole'
  | 'game-info'
  | 'game-warning'
  | 'hit-analog'
  | 'jump'
  | 'knife-throw'
  | 'level-complete'
  | 'level-up'
  | 'negative-input'
  | 'piano1'
  | 'piano2'
  | 'piano3'
  | 'piano4'
  | 'pop-bubble'
  | 'pop-happy'
  | 'pop-sharp'
  | 'pop-multi-up'
  | 'pop-multi-down'
  | 'positive-input'
  | 'ring-down'
  | 'ring-up'
  | 'wall-hit-2'
  | 'wall-hit';

export type SoundId = SampleSoundId | SynthSoundId;

export type SoundPlayOptions = {
  volume?: number;
  /**
   * Pitch shift in semitones (e.g. `7` = a fifth up, `-12` = an octave down).
   * Samples change playback speed; synthesized sounds keep their duration.
   * Roughly ±12 semitones before it sounds artificial.
   */
  semitones?: number;
  /** Synthesized sounds only. Defaults to 'default'. */
  theme?: SoundTheme;
  /** Synthesized sounds only. Changes the arrangement, not just volume. */
  emphasis?: SoundEmphasis;
  /** Synthesized select/sweep cues only. */
  direction?: 'forward' | 'back';
  /** Count cue only: animation length in milliseconds, clamped to 300–2000. */
  duration?: number;
};

type NavigatorAudioSession = {
  type: 'transient';
};

const CDN_BASE = 'https://pub-f2838cca4376431f9c696446d4a3e503.r2.dev';

function configureTransientAudioSession(): void {
  const audioSession = (
    navigator as Navigator & { audioSession?: NavigatorAudioSession }
  ).audioSession;

  if (!audioSession) return;

  try {
    audioSession.type = 'transient';
  } catch (error) {
    console.warn('SoundManager: Could not configure transient audio session:', error);
  }
}

function sharedSoundUrls(id: SampleSoundId): string[] {
  const filename = `${id}.mp3`;
  return [
    `native://sounds/${filename}`,
    `/__native__/sounds/${filename}`,
    `${CDN_BASE}/sounds/${filename}`,
  ];
}

class SoundManager {
  /** MIT notice retained in compiled bundles even when comments are stripped. */
  readonly thirdPartyNotices = synthSoundLicense;
  private audioContext: AudioContext | null = null;
  private output: GainNode | null = null;
  private synth: SoundSynth | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private loading: Map<string, Promise<AudioBuffer | null>> = new Map();
  private enabled = true;
  private enabledListeners: Array<(enabled: boolean) => void> = [];

  constructor() {
    configureTransientAudioSession();
  }

  async preload(ids: SoundId | SoundId[]): Promise<void> {
    const idArray = Array.isArray(ids) ? ids : [ids];
    // Synthesized recipes are bundled and ready without fetching or decoding.
    await Promise.all(idArray.map((id) => isSynthSoundId(id) ? undefined : this.load(id, sharedSoundUrls(id))));
  }

  /** Preload custom sound files bundled with the game. */
  async preloadUrl(sources: string | URL | Array<string | URL>): Promise<void> {
    const list = Array.isArray(sources) ? sources : [sources];
    await Promise.all(list.map((source) => this.load(String(source), [String(source)])));
  }

  play(id: SoundId, options: SoundPlayOptions = {}): void {
    if (isSynthSoundId(id)) {
      this.playSynth(id, options);
      return;
    }
    this.playFrom(id, sharedSoundUrls(id), options);
  }

  /**
   * Play a custom sound file bundled with the game. Goes through the same
   * manager as shared sounds, so the host mute state applies automatically.
   */
  playUrl(source: string | URL, options: SoundPlayOptions = {}): void {
    this.playFrom(String(source), [String(source)], options);
  }

  setEnabled(enabled: boolean): void {
    if (enabled === this.enabled) return;

    this.enabled = enabled;
    if (this.output && this.audioContext) {
      this.output.gain.setValueAtTime(enabled ? 1 : 0, this.audioContext.currentTime);
    }
    for (const listener of this.enabledListeners) listener(enabled);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Subscribe to the host mute state, e.g. to mute your own audio engine.
   * Calls the listener immediately with the current state and again on every
   * change. Returns an unsubscribe function.
   */
  onEnabledChange(listener: (enabled: boolean) => void): () => void {
    this.enabledListeners.push(listener);
    listener(this.enabled);

    return () => {
      this.enabledListeners = this.enabledListeners.filter((candidate) => candidate !== listener);
    };
  }

  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.buffers.clear();
    this.loading.clear();
    this.enabledListeners = [];
    this.output = null;
    this.synth = null;
  }

  private playSynth(id: SynthSoundId, options: SoundPlayOptions): void {
    if (!this.enabled || options.volume === 0) return;
    const context = this.getContext();
    if (!context) return;

    const play = () => {
      if (!this.enabled || this.audioContext !== context || context.state !== 'running') return;
      try {
        this.synth ??= new SoundSynth(context, this.output!);
        this.synth.play(id, {
          ...options,
          volume: Number.isFinite(options.volume) ? Math.max(0, Math.min(1, options.volume!)) : 1,
          semitones: Number.isFinite(options.semitones) ? options.semitones : 0,
        });
      } catch (error) {
        console.warn(`SoundManager: Failed to synthesize ${id}:`, error);
      }
    };
    if (context.state === 'running') play();
    else context.resume().then(play).catch(() => {});
  }

  private playFrom(key: string, urls: string[], options: SoundPlayOptions): void {
    if (!this.enabled) return;

    const context = this.getContext();
    if (!context) return;

    this.load(key, urls).then(async (buffer) => {
      if (!buffer || !this.enabled || this.audioContext !== context) return;
      if (context.state !== 'running') {
        try { await context.resume(); } catch { return; }
      }
      if (!this.enabled || this.audioContext !== context || context.state !== 'running') return;

      try {
        const source = context.createBufferSource();
        source.buffer = buffer;

        if (options.semitones && Number.isFinite(options.semitones)) {
          source.playbackRate.value = 2 ** (options.semitones / 12);
        }

        if (options.volume !== undefined && options.volume !== 1) {
          const gainNode = context.createGain();
          gainNode.gain.value = Number.isFinite(options.volume) ? Math.max(0, Math.min(1, options.volume)) : 1;
          source.connect(gainNode);
          gainNode.connect(this.output!);
        } else {
          source.connect(this.output!);
        }

        source.start(0);
      } catch (error) {
        console.warn(`SoundManager: Failed to play ${key}:`, error);
      }
    });
  }

  private getContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
        const context: AudioContext = new AudioContextCtor();
        const output = context.createGain();
        output.gain.value = this.enabled ? 1 : 0;
        output.connect(context.destination);
        this.audioContext = context;
        this.output = output;
      } catch {
        console.warn('SoundManager: Web Audio API not supported');
        return null;
      }
    }

    return this.audioContext;
  }

  private async load(key: string, urls: string[]): Promise<AudioBuffer | null> {
    if (this.buffers.has(key)) return this.buffers.get(key)!;
    if (this.loading.has(key)) return this.loading.get(key)!;

    const context = this.getContext();
    if (!context) return null;
    // Preloading from a user gesture also unlocks sample playback, as before.
    if (context.state === 'suspended') context.resume().catch(() => {});

    const loadPromise = this.fetchAndDecode(context, key, urls);
    this.loading.set(key, loadPromise);

    return loadPromise.finally(() => this.loading.delete(key));
  }

  private async fetchAndDecode(context: AudioContext, key: string, urls: string[]): Promise<AudioBuffer | null> {
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        if (this.audioContext === context) this.buffers.set(key, audioBuffer);
        return audioBuffer;
      } catch {
        continue;
      }
    }

    console.warn(`SoundManager: Could not load ${key}`);
    return null;
  }
}

export const sound = new SoundManager();
