import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

// Test the public built SDK with browser audio/network boundaries controlled.
class Param {
  value = 0;
  events = [];
  setValueAtTime(value, time) { this.record('set', value, time); }
  linearRampToValueAtTime(value, time) { this.record('linear', value, time); }
  exponentialRampToValueAtTime(value, time) {
    assert.ok(value > 0, 'Exponential ramps need positive values');
    this.record('exponential', value, time);
  }
  cancelScheduledValues() {}
  record(kind, value, time) {
    assert.ok(Number.isFinite(value) && Number.isFinite(time), 'Finite audio parameters');
    this.value = value;
    this.events.push({ kind, value, time });
  }
}

class AudioNode {
  connections = [];
  listeners = [];
  gain = new Param();
  frequency = new Param();
  detune = new Param();
  playbackRate = new Param();
  Q = new Param();
  threshold = new Param();
  knee = new Param();
  ratio = new Param();
  attack = new Param();
  release = new Param();
  connect(node) { this.connections.push(node); return node; }
  disconnect() { this.connections = []; }
  start(time, offset) { this.started = time; this.offset = offset; }
  stop(time) { assert.ok(time > this.started); this.stopped = time; }
  addEventListener(_name, listener) { this.listeners.push(listener); }
  end() { this.listeners.forEach((listener) => listener()); this.onended?.(); }
}

const contexts = [];
class AudioContext {
  state = 'running';
  currentTime = 0;
  sampleRate = 24000;
  destination = new AudioNode();
  nodes = [];
  sources = [];
  buffers = [];
  constructor() { contexts.push(this); }
  node(kind) {
    const node = new AudioNode();
    node.kind = kind;
    this.nodes.push(node);
    if (kind === 'oscillator' || kind === 'source') this.sources.push(node);
    return node;
  }
  createGain() { return this.node('gain'); }
  createOscillator() { return this.node('oscillator'); }
  createBufferSource() { return this.node('source'); }
  createBiquadFilter() { return this.node('filter'); }
  createDynamicsCompressor() { return this.node('compressor'); }
  createConvolver() { return this.node('convolver'); }
  createBuffer(channels, length, rate) {
    const data = Array.from({ length: channels }, () => new Float32Array(length));
    const buffer = { duration: length / rate, getChannelData: (channel) => data[channel] };
    this.buffers.push(buffer);
    return buffer;
  }
  async decodeAudioData() { return this.createBuffer(1, 24, this.sampleRate); }
  async resume() { this.state = 'running'; }
  async close() { this.state = 'closed'; }
}

test('bundled palette, sample compatibility, mute and AudioContext lifecycle', async () => {
  globalThis.window = { AudioContext, crypto, location: { search: '?playusNoMobilePolicy=1' } };
  const audioSession = { type: 'auto' };
  Object.defineProperty(globalThis, 'navigator', { value: { audioSession }, configurable: true });
  const requests = [];
  globalThis.fetch = async (url) => {
    requests.push(url);
    return { ok: true, arrayBuffer: async () => new ArrayBuffer(24) };
  };
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args);
  const { sound, synthSoundIds, soundThemes } = await import('../dist/sdk/index.js');
  const tick = () => new Promise((resolve) => setImmediate(resolve));

  try {
    assert.equal(audioSession.type, 'transient');
    assert.equal(synthSoundIds.length, 14);
    assert.equal(soundThemes.length, 4);
    await sound.preload([...synthSoundIds]);
    assert.equal(contexts.length, 0, 'Synth preload stays lazy');
    assert.equal(requests.length, 0, 'Synth preload has no network');

    for (const theme of soundThemes) {
      for (const id of synthSoundIds) {
        for (const emphasis of ['subtle', 'normal', 'strong']) {
          sound.play(id, { theme, emphasis, direction: 'back', duration: 2000, semitones: 7 });
          const context = contexts[0];
          const sources = context.sources.splice(0);
          assert.ok(sources.length > 0, `${theme}/${id}/${emphasis} renders`);
          sources.forEach((source) => {
            assert.ok(Number.isFinite(source.stopped) && source.stopped <= 4);
            source.end();
            assert.equal(source.connections.length, 0, 'Ended source disconnects');
          });
        }
      }
    }
    assert.equal(contexts.length, 1, 'One shared context');
    assert.equal(contexts[0].buffers.length, 2, 'Noise and room buffers are reused');
    assert.equal(requests.length, 0, 'All recipes work offline');

    const context = contexts[0];
    sound.play('tap');
    sound.play('tap');
    assert.ok(context.nodes.some((node) => node.gain.events.some((event) => event.kind === 'linear' && event.value === 0)), 'Rapid repeats release old voices');
    const sourceCount = context.sources.length;
    window.gameAPI.setMuted(true);
    assert.equal(context.nodes[0].gain.value, 0, 'Host mute silences active output');
    sound.play('success');
    assert.equal(context.sources.length, sourceCount);
    window.gameAPI.setMuted(false);
    assert.equal(context.nodes[0].gain.value, 1);

    await sound.preload(['tap', 'positive-input']);
    assert.deepEqual(requests, ['native://sounds/positive-input.mp3']);
    sound.play('positive-input', { volume: 0.4, semitones: 7 });
    await tick();
    assert.equal(context.sources.at(-1).playbackRate.value, 2 ** (7 / 12));
    sound.playUrl('bundled.mp3');
    await tick();
    assert.equal(requests.at(-1), 'bundled.mp3');
    assert.equal(contexts.length, 1, 'Samples and custom files share synth context');

    let finishFetch;
    globalThis.fetch = () => new Promise((resolve) => { finishFetch = resolve; });
    const beforeLoading = context.sources.length;
    sound.playUrl('pending.mp3');
    sound.setEnabled(false);
    finishFetch({ ok: true, arrayBuffer: async () => new ArrayBuffer(24) });
    await tick();
    assert.equal(context.sources.length, beforeLoading, 'Mute while loading prevents late sample playback');
    sound.setEnabled(true);

    sound.play('count', { volume: NaN, semitones: Infinity, duration: Infinity, theme: 'invalid', emphasis: 'invalid' });
    context.sources.splice(0).forEach((source) => source.end());
    assert.equal(warnings.length, 0, 'Invalid options use safe defaults');

    context.state = 'suspended';
    let resume;
    context.resume = () => new Promise((resolve) => { resume = resolve; });
    sound.play('success');
    sound.setEnabled(false);
    context.state = 'running';
    resume();
    await tick();
    assert.equal(context.sources.length, 0, 'Mute while resuming prevents queued sounds');
    sound.setEnabled(true);

    context.state = 'suspended';
    sound.play('success');
    sound.dispose();
    resume();
    await tick();
    assert.equal(context.sources.length, 0, 'Dispose cancels queued sounds');
    sound.play('tap');
    assert.equal(contexts.length, 2, 'Playback after dispose uses a fresh context');
    assert.equal(contexts[1].buffers.length, 2, 'Synth resources are recreated');
    contexts[1].state = 'suspended';
    contexts[1].resume = () => Promise.reject(new Error('Autoplay blocked'));
    const beforeBlocked = contexts[1].sources.length;
    sound.play('success');
    await tick();
    assert.equal(contexts[1].sources.length, beforeBlocked);
    assert.equal(warnings.length, 0);

    const bundle = readFileSync(new URL('../dist/sdk/index.js', import.meta.url), 'utf8');
    assert.match(bundle, /Copyright \(c\) 2026 Daniel Belyi/);
    assert.match(bundle, /Permission is hereby granted/);
  } finally {
    sound.dispose();
    console.warn = originalWarn;
  }
});
