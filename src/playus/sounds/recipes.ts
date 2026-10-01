// Sound definitions extracted from Cuelume; no upstream runtime code.
// https://github.com/danielwh2/cuelume/tree/caf15480081da9432a4a982446ce44c9daf3a288/src/sounds
// Helper-generated layers are expanded so this file contains only settings.

// This string travels with the sound manager even when bundlers strip comments.
export const synthSoundLicense = `MIT License

Copyright (c) 2026 Daniel Belyi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export const synthSoundIds = ['tap', 'type', 'select', 'toggle', 'open', 'close', 'success', 'error', 'navigate', 'warning', 'loading', 'ready', 'attention', 'count'] as const;
export const soundThemes = ['default', 'mech', 'bubble', 'press'] as const;
export type SynthSoundId = typeof synthSoundIds[number];
export type SoundTheme = typeof soundThemes[number];
export type SoundEmphasis = 'subtle' | 'normal' | 'strong';

type BaseLayer = {
  offset?: number;
  attack: number;
  decay: number;
  peak: number;
  glideTo?: number;
  glideTime?: number;
  from?: 'normal' | 'strong';
  stretch?: true;
};

export type SoundLayer = BaseLayer & (
  | { kind: 'tone'; waveform: OscillatorType; frequency: number; detune?: number }
  | { kind: 'noise'; filterType: BiquadFilterType; filterFrequency: number; filterQ?: number }
);

export type SoundRecipe = {
  masterGain: number;
  layers: SoundLayer[];
  room?: number;
  vary?: { pitch: number; level: number };
};

export const emphasisSettings = {
  subtle: { rank: 0, pitch: 1, level: 0.8, length: 0.85, bright: 0.75 },
  normal: { rank: 1, pitch: 1, level: 1, length: 1, bright: 1 },
  strong: { rank: 2, pitch: 0.98, level: 1.08, length: 1.2, bright: 1.1 },
};

export const soundRecipes: Record<SoundTheme, Record<SynthSoundId, SoundRecipe>> = {
  default: {
    tap: {
      masterGain: 0.39,
      layers: [
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 4500, filterQ: 1.2, attack: 0.001, decay: 0.002, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 1174.66, attack: 0.001, decay: 0.128, peak: 0.0135 },
        { kind: 'tone', waveform: 'sine', frequency: 1180, attack: 0.001, decay: 0.104, peak: 0.008 },
        { kind: 'tone', waveform: 'sine', frequency: 3242, attack: 0.001, decay: 0.048, peak: 0.0055 },
        { kind: 'tone', waveform: 'sine', frequency: 480, glideTo: 300, glideTime: 0.018, attack: 0.001, decay: 0.02, peak: 0.02, from: 'normal' },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 587.33, attack: 0.002, decay: 0.16, peak: 0.009 },
        { kind: 'tone', waveform: 'sine', frequency: 240, glideTo: 150, glideTime: 0.018, attack: 0.001, decay: 0.035, peak: 0.014, from: 'strong' },
      ],
      vary: { pitch: 0.012, level: 0.12 },
    },
    type: {
      masterGain: 0.375,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 3900, filterQ: 0.8, attack: 0.001, decay: 0.005, peak: 0.08 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 1550, filterQ: 3.5, attack: 0.001, decay: 0.016, peak: 0.22 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 310, filterQ: 2.5, attack: 0.002, decay: 0.03, peak: 0.35 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 140, filterQ: 2, attack: 0.002, decay: 0.045, peak: 0.45 },
      ],
      vary: { pitch: 0.07, level: 0.2 },
    },
    select: {
      masterGain: 0.306,
      layers: [
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 2800, filterQ: 2.2, attack: 0.001, decay: 0.008, peak: 0.16 },
        { kind: 'tone', waveform: 'sine', frequency: 664, glideTo: 415, glideTime: 0.018, attack: 0.001, decay: 0.016, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 332.8, glideTo: 208, glideTime: 0.018, attack: 0.001, decay: 0.025, peak: 0.025, from: 'strong' },
      ],
    },
    toggle: {
      masterGain: 0.24,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1830, filterQ: 1.6, attack: 0.001, decay: 0.016, peak: 0.12 },
        { kind: 'tone', waveform: 'sine', frequency: 528, glideTo: 330, glideTime: 0.018, attack: 0.001, decay: 0.03, peak: 0.045 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 3150, filterQ: 1.6, attack: 0.001, decay: 0.012, peak: 0.08 },
        { kind: 'tone', waveform: 'sine', frequency: 264, glideTo: 165, glideTime: 0.018, attack: 0.001, decay: 0.03, peak: 0.025, from: 'strong' },
      ],
    },
    open: {
      masterGain: 0.335,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 600, glideTo: 1500, glideTime: 0.1, filterQ: 1.4, attack: 0.05, decay: 0.06, peak: 0.168 },
        { kind: 'tone', waveform: 'sine', frequency: 659.25, attack: 0.05, decay: 0.12, peak: 0.015 },
        { from: 'normal', kind: 'tone', waveform: 'sine', frequency: 1318.51, attack: 0.05, decay: 0.05, peak: 0.005 },
        { from: 'strong', kind: 'noise', filterType: 'lowpass', filterFrequency: 250, filterQ: 0.7, attack: 0.04, decay: 0.08, peak: 0.12 },
      ],
    },
    close: {
      masterGain: 0.258,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1400, glideTo: 540, glideTime: 0.07, filterQ: 1.4, attack: 0.02, decay: 0.06, peak: 0.216 },
        { kind: 'tone', waveform: 'sine', frequency: 261.63, attack: 0.003, decay: 0.08, peak: 0.02 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 350, filterQ: 2, attack: 0.001, decay: 0.03, peak: 0.2 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 165, filterQ: 2, attack: 0.001, decay: 0.04, peak: 0.3 },
      ],
    },
    success: {
      masterGain: 0.566,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 1500, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 523.25, attack: 0.003, decay: 0.26, peak: 0.022 },
        { kind: 'tone', waveform: 'sine', frequency: 2087.7675, attack: 0.003, decay: 0.06516290726817042, peak: 0.0044, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 783.99, attack: 0.003, decay: 0.3, peak: 0.02 },
        { kind: 'tone', waveform: 'sine', frequency: 3128.1201, attack: 0.003, decay: 0.07518796992481203, peak: 0.004, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1318.51, attack: 0.003, decay: 0.24, peak: 0.014 },
        { kind: 'tone', waveform: 'sine', frequency: 261.63, attack: 0.003, decay: 0.36, peak: 0.02, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 1043.9037, attack: 0.003, decay: 0.09022556390977443, peak: 0.004, from: 'strong' },
      ],
      room: 2,
    },
    error: {
      masterGain: 0.501,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 900, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.05 },
        { kind: 'tone', waveform: 'sine', frequency: 293.66, attack: 0.003, decay: 0.12, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 1171.7034, attack: 0.003, decay: 0.03007518796992481, peak: 0.008, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 698.46, attack: 0.003, decay: 0.08, peak: 0.018 },
        { kind: 'tone', waveform: 'sine', frequency: 2786.8554000000004, attack: 0.003, decay: 0.020050125313283207, peak: 0.0036, from: 'normal' },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 250, filterQ: 1.5, attack: 0.001, decay: 0.03, peak: 0.2 },
      ],
    },
    navigate: {
      masterGain: 0.322,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 400, glideTo: 1100, glideTime: 0.21, filterQ: 1.2, attack: 0.12, decay: 0.12, peak: 0.18 },
        { from: 'normal', kind: 'noise', filterType: 'lowpass', filterFrequency: 540, filterQ: 0.7, attack: 0.09, decay: 0.096, peak: 0.045 },
        { from: 'strong', kind: 'noise', filterType: 'lowpass', filterFrequency: 230, filterQ: 0.7, attack: 0.1, decay: 0.144, peak: 0.1 },
      ],
    },
    warning: {
      masterGain: 0.437,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 1200, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 440, attack: 0.003, decay: 0.14, peak: 0.038 },
        { kind: 'tone', waveform: 'sine', frequency: 1755.6000000000001, attack: 0.003, decay: 0.03508771929824561, peak: 0.0076, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 659.25, attack: 0.003, decay: 0.12, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 2630.4075000000003, attack: 0.003, decay: 0.03007518796992481, peak: 0.006, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 220, attack: 0.003, decay: 0.2, peak: 0.02, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 877.8000000000001, attack: 0.003, decay: 0.05012531328320802, peak: 0.004, from: 'strong' },
      ],
    },
    loading: {
      masterGain: 0.106,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 196, attack: 0.35, decay: 0.8, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 392, attack: 0.35, decay: 0.6, peak: 0.01 },
        { from: 'normal', kind: 'noise', filterType: 'lowpass', filterFrequency: 500, filterQ: 0.7, attack: 0.35, decay: 0.5, peak: 0.006 },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 98, attack: 0.35, decay: 0.8, peak: 0.02 },
      ],
    },
    ready: {
      masterGain: 0.467,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 1500, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.02 },
        { kind: 'tone', waveform: 'sine', frequency: 392, attack: 0.003, decay: 0.4, peak: 0.026 },
        { kind: 'tone', waveform: 'sine', frequency: 1081.9199999999998, attack: 0.003, decay: 0.1449275362318841, peak: 0.0078, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 2116.8, attack: 0.003, decay: 0.07407407407407407, peak: 0.0026, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 393.2, attack: 0.003, decay: 0.32, peak: 0.012 },
        { kind: 'tone', waveform: 'sine', frequency: 196, attack: 0.003, decay: 0.45, peak: 0.016, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 540.9599999999999, attack: 0.003, decay: 0.1630434782608696, peak: 0.0048, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 1058.4, attack: 0.003, decay: 0.08333333333333333, peak: 0.0016, from: 'strong' },
      ],
      room: 2,
    },
    attention: {
      masterGain: 0.551,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2500, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.02 },
        { kind: 'tone', waveform: 'sine', frequency: 880, attack: 0.003, decay: 0.45, peak: 0.018 },
        { kind: 'tone', waveform: 'sine', frequency: 2428.7999999999997, attack: 0.003, decay: 0.1630434782608696, peak: 0.005399999999999999, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 4752, attack: 0.003, decay: 0.08333333333333333, peak: 0.0018, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 882, attack: 0.003, decay: 0.38, peak: 0.01 },
        { kind: 'tone', waveform: 'sine', frequency: 1318.51, attack: 0.003, decay: 0.4, peak: 0.014 },
        { kind: 'tone', waveform: 'sine', frequency: 3639.0876, attack: 0.003, decay: 0.1449275362318841, peak: 0.0042, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 440, attack: 0.003, decay: 0.45, peak: 0.012, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 1214.3999999999999, attack: 0.003, decay: 0.1630434782608696, peak: 0.0036, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 2376, attack: 0.003, decay: 0.08333333333333333, peak: 0.0012000000000000001, from: 'strong' },
      ],
    },
    count: {
      masterGain: 0.336,
      layers: [
        { stretch: true, kind: 'noise', filterType: 'bandpass', filterFrequency: 700, glideTo: 1400, glideTime: 0.6, filterQ: 1.2, attack: 0.15, decay: 0.55, peak: 0.05 },
        { stretch: true, kind: 'tone', waveform: 'sine', frequency: 1046.5, attack: 0.15, decay: 0.5, peak: 0.012 },
        { stretch: true, from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 2000, glideTo: 3200, glideTime: 0.6, filterQ: 2, attack: 0.15, decay: 0.5, peak: 0.02 },
        { stretch: true, from: 'strong', kind: 'tone', waveform: 'sine', frequency: 261.63, attack: 0.15, decay: 0.55, peak: 0.015 },
      ],
      vary: { pitch: 0.02, level: 0.12 },
    },
  },
  mech: {
    tap: {
      masterGain: 0.661,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 2650, filterQ: 1.5, attack: 0.001, decay: 0.004, peak: 0.08 },
        { kind: 'tone', waveform: 'sine', frequency: 728, glideTo: 455, glideTime: 0.018, attack: 0.001, decay: 0.012, peak: 0.02 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 4600, filterQ: 2, attack: 0.001, decay: 0.002, peak: 0.05 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 215, filterQ: 2, attack: 0.001, decay: 0.025, peak: 0.3 },
      ],
      vary: { pitch: 0.02, level: 0.1 },
    },
    type: {
      masterGain: 0.421,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 3000, filterQ: 1.2, attack: 0.001, decay: 0.003, peak: 0.1 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 2150, filterQ: 5, attack: 0.001, decay: 0.008, peak: 0.18 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 750, filterQ: 3, attack: 0.001, decay: 0.01, peak: 0.22 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 330, filterQ: 2.5, attack: 0.001, decay: 0.02, peak: 0.3 },
      ],
      vary: { pitch: 0.05, level: 0.15 },
    },
    select: {
      masterGain: 0.495,
      layers: [
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 3650, filterQ: 3, attack: 0.001, decay: 0.003, peak: 0.2 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1500, filterQ: 8, attack: 0.001, decay: 0.009, peak: 0.35 },
        { kind: 'tone', waveform: 'sine', frequency: 1480, attack: 0.001, decay: 0.03, peak: 0.012 },
        { kind: 'tone', waveform: 'sine', frequency: 400, glideTo: 250, glideTime: 0.018, attack: 0.001, decay: 0.015, peak: 0.025, from: 'strong' },
      ],
    },
    toggle: {
      masterGain: 0.294,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1650, filterQ: 2, attack: 0.001, decay: 0.004, peak: 0.14 },
        { kind: 'tone', waveform: 'sine', frequency: 528, glideTo: 330, glideTime: 0.018, attack: 0.001, decay: 0.025, peak: 0.04 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 2650, filterQ: 3, attack: 0.001, decay: 0.006, peak: 0.18 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 250, filterQ: 2, attack: 0.001, decay: 0.03, peak: 0.3 },
      ],
    },
    open: {
      masterGain: 0.854,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 2150, filterQ: 3, attack: 0.001, decay: 0.004, peak: 0.16 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1160, glideTo: 2150, glideTime: 0.05, filterQ: 2, attack: 0.02, decay: 0.03, peak: 0.08 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 1330, filterQ: 5, attack: 0.001, decay: 0.008, peak: 0.14 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 290, filterQ: 2, attack: 0.001, decay: 0.03, peak: 0.25 },
      ],
    },
    close: {
      masterGain: 0.627,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 2150, glideTo: 1080, glideTime: 0.04, filterQ: 2, attack: 0.015, decay: 0.025, peak: 0.04 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1000, filterQ: 4, attack: 0.001, decay: 0.01, peak: 0.22 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 3300, filterQ: 2, attack: 0.001, decay: 0.003, peak: 0.1 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 180, filterQ: 2, attack: 0.001, decay: 0.035, peak: 0.3 },
      ],
    },
    success: {
      masterGain: 0.597,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2200, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.05 },
        { kind: 'tone', waveform: 'sine', frequency: 698.46, attack: 0.003, decay: 0.1, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 1927.7495999999999, attack: 0.003, decay: 0.03623188405797102, peak: 0.009, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 3771.6840000000007, attack: 0.003, decay: 0.018518518518518517, peak: 0.003, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1046.5, attack: 0.003, decay: 0.12, peak: 0.026 },
        { kind: 'tone', waveform: 'sine', frequency: 2888.3399999999997, attack: 0.003, decay: 0.043478260869565216, peak: 0.0078, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1760, attack: 0.003, decay: 0.08, peak: 0.018 },
        { kind: 'tone', waveform: 'sine', frequency: 4857.599999999999, attack: 0.003, decay: 0.028985507246376815, peak: 0.005399999999999999, from: 'normal' },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 4150, filterQ: 2, attack: 0.001, decay: 0.003, peak: 0.06 },
      ],
    },
    error: {
      masterGain: 0.553,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 430, filterQ: 4, attack: 0.001, decay: 0.02, peak: 0.3 },
        { kind: 'tone', waveform: 'sine', frequency: 293.66, attack: 0.003, decay: 0.06, peak: 0.045 },
        { kind: 'tone', waveform: 'sine', frequency: 810.5016, attack: 0.003, decay: 0.021739130434782608, peak: 0.0135, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1585.7640000000004, attack: 0.003, decay: 0.015, peak: 0.0045, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 698.46, attack: 0.003, decay: 0.04, peak: 0.02 },
        { kind: 'tone', waveform: 'sine', frequency: 1927.7495999999999, attack: 0.003, decay: 0.015, peak: 0.006, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 3771.6840000000007, attack: 0.003, decay: 0.015, peak: 0.002, from: 'normal' },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 1830, filterQ: 3, attack: 0.001, decay: 0.006, peak: 0.1 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 150, filterQ: 2, attack: 0.001, decay: 0.04, peak: 0.3 },
      ],
    },
    navigate: {
      masterGain: 0.723,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 750, glideTo: 1400, glideTime: 0.13, filterQ: 1.8, attack: 0.05, decay: 0.096, peak: 0.1 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 2500, filterQ: 4, attack: 0.001, decay: 0.003, peak: 0.1 },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 250, filterQ: 1.5, attack: 0.04, decay: 0.112, peak: 0.12 },
      ],
    },
    warning: {
      masterGain: 0.504,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2000, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.05 },
        { kind: 'tone', waveform: 'sine', frequency: 587.33, attack: 0.003, decay: 0.08, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 1621.0308, attack: 0.003, decay: 0.028985507246376815, peak: 0.012, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 3171.5820000000003, attack: 0.003, decay: 0.015, peak: 0.004, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 880, attack: 0.003, decay: 0.08, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 2428.7999999999997, attack: 0.003, decay: 0.028985507246376815, peak: 0.009, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 4752, attack: 0.003, decay: 0.015, peak: 0.003, from: 'normal' },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 300, filterQ: 2, attack: 0.001, decay: 0.03, peak: 0.25 },
      ],
    },
    loading: {
      masterGain: 0.212,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 500, filterQ: 1, attack: 0.35, decay: 0.7, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 233.08, attack: 0.35, decay: 0.7, peak: 0.015 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 1000, filterQ: 2, attack: 0.35, decay: 0.5, peak: 0.005 },
        { from: 'strong', kind: 'noise', filterType: 'lowpass', filterFrequency: 250, filterQ: 0.7, attack: 0.35, decay: 0.7, peak: 0.04 },
      ],
    },
    ready: {
      masterGain: 0.434,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2000, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.05 },
        { kind: 'tone', waveform: 'sine', frequency: 523.25, attack: 0.003, decay: 0.16, peak: 0.05 },
        { kind: 'tone', waveform: 'sine', frequency: 1444.1699999999998, attack: 0.003, decay: 0.05797101449275363, peak: 0.015, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 2825.55, attack: 0.003, decay: 0.029629629629629627, peak: 0.005000000000000001, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 261.63, attack: 0.003, decay: 0.2, peak: 0.03, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 722.0988, attack: 0.003, decay: 0.07246376811594205, peak: 0.009, from: 'strong' },
        { kind: 'tone', waveform: 'sine', frequency: 1412.8020000000001, attack: 0.003, decay: 0.037037037037037035, peak: 0.003, from: 'strong' },
      ],
    },
    attention: {
      masterGain: 0.414,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2500, filterQ: -3, attack: 0.001, decay: 0.003, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 880, attack: 0.003, decay: 0.2, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 2428.7999999999997, attack: 0.003, decay: 0.07246376811594205, peak: 0.012, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 4752, attack: 0.003, decay: 0.037037037037037035, peak: 0.004, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1318.51, attack: 0.003, decay: 0.2, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 3639.0876, attack: 0.003, decay: 0.07246376811594205, peak: 0.009, from: 'normal' },
        { from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 300, filterQ: 2, attack: 0.001, decay: 0.03, peak: 0.25 },
      ],
    },
    count: {
      masterGain: 0.72,
      layers: [
        { stretch: true, kind: 'noise', filterType: 'bandpass', filterFrequency: 500, glideTo: 900, glideTime: 0.6, filterQ: 2, attack: 0.1, decay: 0.6, peak: 0.06 },
        { stretch: true, from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 1900, glideTo: 3300, glideTime: 0.6, filterQ: 4, attack: 0.1, decay: 0.5, peak: 0.03 },
        { stretch: true, from: 'strong', kind: 'noise', filterType: 'bandpass', filterFrequency: 220, filterQ: 2, attack: 0.1, decay: 0.5, peak: 0.1 },
      ],
      vary: { pitch: 0.03, level: 0.1 },
    },
  },
  bubble: {
    tap: {
      masterGain: 0.349,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 480, glideTo: 300, glideTime: 0.018, attack: 0.001, decay: 0.02, peak: 0.06 },
        { kind: 'tone', waveform: 'sine', frequency: 600, glideTo: 900, glideTime: 0.04, attack: 0.012, decay: 0.035, peak: 0.014 },
        { kind: 'tone', waveform: 'sine', frequency: 960, glideTo: 600, glideTime: 0.018, attack: 0.001, decay: 0.012, peak: 0.015, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 240, glideTo: 150, glideTime: 0.018, attack: 0.001, decay: 0.035, peak: 0.05, from: 'strong' },
      ],
      vary: { pitch: 0.08, level: 0.1 },
    },
    type: {
      masterGain: 0.281,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 664, glideTo: 415, glideTime: 0.018, attack: 0.001, decay: 0.014, peak: 0.06 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2500, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.03, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 332.8, glideTo: 208, glideTime: 0.018, attack: 0.001, decay: 0.025, peak: 0.05, from: 'strong' },
      ],
      vary: { pitch: 0.1, level: 0.2 },
    },
    select: {
      masterGain: 0.278,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 700, glideTo: 1050, glideTime: 0.012, attack: 0.001, decay: 0.025, peak: 0.05 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 3000, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.075, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 350, glideTo: 525, glideTime: 0.04, attack: 0.002, decay: 0.05, peak: 0.03, from: 'strong' },
      ],
      vary: { pitch: 0.03, level: 0.1 },
    },
    toggle: {
      masterGain: 0.153,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 900, filterQ: 0.9, attack: 0.001, decay: 0.008, peak: 0.12 },
        { kind: 'tone', waveform: 'sine', frequency: 330, glideTo: 660, glideTime: 0.06, attack: 0.003, decay: 0.07, peak: 0.045 },
        { kind: 'tone', waveform: 'sine', frequency: 990, glideTo: 1485, glideTime: 0.02, attack: 0.03, decay: 0.03, peak: 0.01, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 165, glideTo: 330, glideTime: 0.06, attack: 0.002, decay: 0.08, peak: 0.03, from: 'strong' },
      ],
      vary: { pitch: 0.04, level: 0.1 },
    },
    open: {
      masterGain: 0.211,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 220, glideTo: 520, glideTime: 0.14, attack: 0.1, decay: 0.06, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 330, glideTo: 780, glideTime: 0.14, attack: 0.1, decay: 0.06, peak: 0.012, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 110, glideTo: 260, glideTime: 0.14, attack: 0.1, decay: 0.08, peak: 0.03, from: 'strong' },
      ],
      vary: { pitch: 0.06, level: 0.1 },
    },
    close: {
      masterGain: 0.28,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 700, glideTo: 220, glideTime: 0.07, attack: 0.004, decay: 0.08, peak: 0.045 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 1200, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.06, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 350, glideTo: 110, glideTime: 0.07, attack: 0.004, decay: 0.1, peak: 0.03, from: 'strong' },
      ],
      vary: { pitch: 0.06, level: 0.1 },
    },
    success: {
      masterGain: 0.48,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 523.25, glideTo: 783.99, glideTime: 0.08, attack: 0.003, decay: 0.28, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 1046.5, glideTo: 1567.98, glideTime: 0.08, attack: 0.003, decay: 0.08, peak: 0.01, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 261.63, glideTo: 392, glideTime: 0.08, attack: 0.003, decay: 0.3, peak: 0.02, from: 'strong' },
      ],
      room: 2,
      vary: { pitch: 0, level: 0.08 },
    },
    error: {
      masterGain: 0.42,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 349.23, glideTo: 261.63, glideTime: 0.14, attack: 0.004, decay: 0.2, peak: 0.045 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 900, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.12, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 235.20000000000002, glideTo: 147, glideTime: 0.018, attack: 0.001, decay: 0.05, peak: 0.05, from: 'strong' },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    navigate: {
      masterGain: 0.406,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 300, glideTo: 1500, glideTime: 0.09, attack: 0.01, decay: 0.08, peak: 0.035 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 1500, glideTo: 3000, glideTime: 0.09, filterQ: 1, attack: 0.02, decay: 0.07, peak: 0.05 },
        { kind: 'tone', waveform: 'sine', frequency: 150, glideTo: 600, glideTime: 0.1, attack: 0.01, decay: 0.1, peak: 0.025, from: 'strong' },
      ],
      vary: { pitch: 0.06, level: 0.1 },
    },
    warning: {
      masterGain: 0.468,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 500, glideTo: 440, glideTime: 0.05, attack: 0.002, decay: 0.16, peak: 0.045 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 1800, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.09, from: 'normal' },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 220, attack: 0.003, decay: 0.18, peak: 0.025 },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    loading: {
      masterGain: 0.191,
      layers: [
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 900, filterQ: 0.7, attack: 0.35, decay: 0.6, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 400, glideTo: 600, glideTime: 0.35, attack: 0.35, decay: 0.7, peak: 0.016 },
        { from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 1800, filterQ: 1.5, attack: 0.35, decay: 0.4, peak: 0.004 },
        { from: 'strong', kind: 'noise', filterType: 'lowpass', filterFrequency: 400, filterQ: 0.7, attack: 0.35, decay: 0.7, peak: 0.04 },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    ready: {
      masterGain: 0.477,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 1400, glideTo: 700, glideTime: 0.012, attack: 0.001, decay: 0.02, peak: 0.03 },
        { kind: 'tone', waveform: 'sine', frequency: 392, glideTo: 587.33, glideTime: 0.06, attack: 0.012, decay: 0.25, peak: 0.04 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2000, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.03, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 196, glideTo: 294, glideTime: 0.08, attack: 0.012, decay: 0.3, peak: 0.02, from: 'strong' },
      ],
      room: 2,
      vary: { pitch: 0, level: 0.08 },
    },
    attention: {
      masterGain: 0.561,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 659.25, glideTo: 880, glideTime: 0.14, attack: 0.003, decay: 0.25, peak: 0.035 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 2200, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.12, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 329.63, glideTo: 494.445, glideTime: 0.04, attack: 0.002, decay: 0.2, peak: 0.02, from: 'strong' },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    count: {
      masterGain: 0.238,
      layers: [
        { stretch: true, kind: 'noise', filterType: 'lowpass', filterFrequency: 900, glideTo: 1800, glideTime: 0.6, filterQ: 0.7, attack: 0.15, decay: 0.55, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 587.33, glideTo: 880, glideTime: 0.6, attack: 0.15, decay: 0.55, peak: 0.02, stretch: true },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 1600, filterQ: 0.9, attack: 0.001, decay: 0.003, peak: 0.05, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 293.66, glideTo: 440, glideTime: 0.6, attack: 0.15, decay: 0.55, peak: 0.02, from: 'strong', stretch: true },
      ],
      vary: { pitch: 0.06, level: 0.1 },
    },
  },
  press: {
    tap: {
      masterGain: 0.05,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 4000, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.245 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 2700, filterQ: 2, attack: 0.001, decay: 0.006, peak: 0.1225 },
        { kind: 'tone', waveform: 'sine', frequency: 142.58290000000002, glideTo: 130.81, glideTime: 0.015, attack: 0.06, decay: 0.6, peak: 0.12 },
        { kind: 'tone', waveform: 'sine', frequency: 285.16580000000005, glideTo: 261.62, glideTime: 0.015, attack: 0.06, decay: 0.48, peak: 0.048 },
        { kind: 'tone', waveform: 'sine', frequency: 427.74870000000004, glideTo: 392.43, glideTime: 0.015, attack: 0.06, decay: 0.3, peak: 0.006, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 570.3316000000001, glideTo: 523.24, glideTime: 0.015, attack: 0.06, decay: 0.24, peak: 0.0096, from: 'normal' },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 65.405, attack: 0.06, decay: 0.65, peak: 0.06 },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    type: {
      masterGain: 0.452,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 4000, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.245 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 2700, filterQ: 2, attack: 0.001, decay: 0.006, peak: 0.1225 },
        { kind: 'tone', waveform: 'sine', frequency: 418.608, glideTo: 261.63, glideTime: 0.018, attack: 0.001, decay: 0.02, peak: 0.02 },
        { kind: 'tone', waveform: 'sine', frequency: 209.29600000000002, glideTo: 130.81, glideTime: 0.018, attack: 0.001, decay: 0.03, peak: 0.03, from: 'strong' },
      ],
      vary: { pitch: 0.08, level: 0.15 },
    },
    select: {
      masterGain: 0.499,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 4800, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.12 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 3240, filterQ: 2, attack: 0.001, decay: 0.006, peak: 0.06 },
        { kind: 'tone', waveform: 'sine', frequency: 1120, glideTo: 700, glideTime: 0.018, attack: 0.001, decay: 0.015, peak: 0.02 },
        { kind: 'tone', waveform: 'sine', frequency: 560, glideTo: 350, glideTime: 0.018, attack: 0.001, decay: 0.025, peak: 0.02, from: 'strong' },
      ],
      vary: { pitch: 0.02, level: 0.1 },
    },
    toggle: {
      masterGain: 0.201,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 4000, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.245 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 2700, filterQ: 2, attack: 0.001, decay: 0.006, peak: 0.1225 },
        { kind: 'tone', waveform: 'sine', frequency: 528, glideTo: 330, glideTime: 0.018, attack: 0.001, decay: 0.035, peak: 0.05 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 4800, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.1, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 264, glideTo: 165, glideTime: 0.018, attack: 0.001, decay: 0.045, peak: 0.05, from: 'strong' },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    open: {
      masterGain: 0.525,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 4800, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.15 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 3240, filterQ: 2, attack: 0.001, decay: 0.006, peak: 0.075 },
        { kind: 'tone', waveform: 'sine', frequency: 704, glideTo: 440, glideTime: 0.018, attack: 0.001, decay: 0.03, peak: 0.03 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1600, glideTo: 3200, glideTime: 0.035, filterQ: 1.5, attack: 0.008, decay: 0.035, peak: 0.1 },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 260, filterQ: 0.7, attack: 0.001, decay: 0.04, peak: 0.12, from: 'strong' },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    close: {
      masterGain: 0.281,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 3200, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.204 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 2160, filterQ: 2, attack: 0.001, decay: 0.006, peak: 0.102 },
        { kind: 'tone', waveform: 'sine', frequency: 209.29600000000002, glideTo: 130.81, glideTime: 0.018, attack: 0.001, decay: 0.04, peak: 0.06 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 1800, glideTo: 700, glideTime: 0.04, filterQ: 1.5, attack: 0.008, decay: 0.04, peak: 0.1, from: 'normal' },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 180, filterQ: 0.7, attack: 0.001, decay: 0.04, peak: 0.2, from: 'strong' },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    success: {
      masterGain: 0.139,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 285.17670000000004, glideTo: 261.63, glideTime: 0.015, attack: 0.06, decay: 0.6, peak: 0.072 },
        { kind: 'tone', waveform: 'sine', frequency: 570.3534000000001, glideTo: 523.26, glideTime: 0.015, attack: 0.06, decay: 0.48, peak: 0.0288 },
        { kind: 'tone', waveform: 'sine', frequency: 855.5301000000001, glideTo: 784.89, glideTime: 0.015, attack: 0.06, decay: 0.3, peak: 0.0036, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1140.7068000000002, glideTo: 1046.52, glideTime: 0.015, attack: 0.06, decay: 0.24, peak: 0.0057599999999999995, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 427.28000000000003, glideTo: 392, glideTime: 0.015, attack: 0.06, decay: 0.6, peak: 0.06 },
        { kind: 'tone', waveform: 'sine', frequency: 854.5600000000001, glideTo: 784, glideTime: 0.015, attack: 0.06, decay: 0.48, peak: 0.024 },
        { kind: 'tone', waveform: 'sine', frequency: 1281.8400000000001, glideTo: 1176, glideTime: 0.015, attack: 0.06, decay: 0.3, peak: 0.003, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1709.1200000000001, glideTo: 1568, glideTime: 0.015, attack: 0.06, decay: 0.24, peak: 0.0048, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 718.5825000000001, glideTo: 659.25, glideTime: 0.015, attack: 0.06, decay: 0.55, peak: 0.045 },
        { kind: 'tone', waveform: 'sine', frequency: 1437.1650000000002, glideTo: 1318.5, glideTime: 0.015, attack: 0.06, decay: 0.44000000000000006, peak: 0.018 },
        { kind: 'tone', waveform: 'sine', frequency: 2155.7475, glideTo: 1977.75, glideTime: 0.015, attack: 0.06, decay: 0.275, peak: 0.00225, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 2874.3300000000004, glideTo: 2637, glideTime: 0.015, attack: 0.06, decay: 0.22000000000000003, peak: 0.0036, from: 'normal' },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 130.815, attack: 0.06, decay: 0.65, peak: 0.036 },
      ],
      room: 2,
      vary: { pitch: 0, level: 0.08 },
    },
    error: {
      masterGain: 0.109,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 119.9, glideTo: 110, glideTime: 0.015, attack: 0.06, decay: 0.24, peak: 0.12 },
        { kind: 'tone', waveform: 'sine', frequency: 239.8, glideTo: 220, glideTime: 0.015, attack: 0.06, decay: 0.192, peak: 0.048 },
        { kind: 'tone', waveform: 'sine', frequency: 359.70000000000005, glideTo: 330, glideTime: 0.015, attack: 0.06, decay: 0.12, peak: 0.006, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 479.6, glideTo: 440, glideTime: 0.015, attack: 0.06, decay: 0.096, peak: 0.0096, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 570.3425000000001, glideTo: 523.25, glideTime: 0.015, attack: 0.06, decay: 0.2, peak: 0.04 },
        { kind: 'tone', waveform: 'sine', frequency: 1140.6850000000002, glideTo: 1046.5, glideTime: 0.015, attack: 0.06, decay: 0.16000000000000003, peak: 0.016 },
        { kind: 'tone', waveform: 'sine', frequency: 1711.0275000000001, glideTo: 1569.75, glideTime: 0.015, attack: 0.06, decay: 0.1, peak: 0.002, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 2281.3700000000003, glideTo: 2093, glideTime: 0.015, attack: 0.06, decay: 0.08000000000000002, peak: 0.0032, from: 'normal' },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 200, filterQ: 0.7, attack: 0.01, decay: 0.06, peak: 0.2 },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 110, attack: 0.06, decay: 0.26, peak: 0.06 },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    navigate: {
      masterGain: 0.75,
      layers: [
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 4800, filterQ: 8, attack: 0.001, decay: 0.006, peak: 0.15 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 3240, filterQ: 2, attack: 0.001, decay: 0.006, peak: 0.075 },
        { kind: 'noise', filterType: 'bandpass', filterFrequency: 600, glideTo: 1400, glideTime: 0.09, filterQ: 1, attack: 0.008, decay: 0.09, peak: 0.12 },
        { kind: 'tone', waveform: 'sine', frequency: 939.7280000000001, glideTo: 587.33, glideTime: 0.018, attack: 0.001, decay: 0.015, peak: 0.015, from: 'normal' },
        { kind: 'noise', filterType: 'lowpass', filterFrequency: 300, filterQ: 0.7, attack: 0.001, decay: 0.05, peak: 0.12, from: 'strong' },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    warning: {
      masterGain: 0.114,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 239.8, glideTo: 220, glideTime: 0.015, attack: 0.06, decay: 0.26, peak: 0.096 },
        { kind: 'tone', waveform: 'sine', frequency: 479.6, glideTo: 440, glideTime: 0.015, attack: 0.06, decay: 0.20800000000000002, peak: 0.038400000000000004 },
        { kind: 'tone', waveform: 'sine', frequency: 719.4000000000001, glideTo: 660, glideTime: 0.015, attack: 0.06, decay: 0.13, peak: 0.0048000000000000004, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 959.2, glideTo: 880, glideTime: 0.015, attack: 0.06, decay: 0.10400000000000001, peak: 0.00768, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 359.29670000000004, glideTo: 329.63, glideTime: 0.015, attack: 0.06, decay: 0.24, peak: 0.072 },
        { kind: 'tone', waveform: 'sine', frequency: 718.5934000000001, glideTo: 659.26, glideTime: 0.015, attack: 0.06, decay: 0.192, peak: 0.0288 },
        { kind: 'tone', waveform: 'sine', frequency: 1077.8901, glideTo: 988.89, glideTime: 0.015, attack: 0.06, decay: 0.12, peak: 0.0036, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1437.1868000000002, glideTo: 1318.52, glideTime: 0.015, attack: 0.06, decay: 0.096, peak: 0.0057599999999999995, from: 'normal' },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 110, attack: 0.06, decay: 0.28, peak: 0.048 },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    loading: {
      masterGain: 0.066,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 196, attack: 0.35, decay: 0.8, peak: 0.05 },
        { from: 'normal', kind: 'tone', waveform: 'sine', frequency: 392, attack: 0.35, decay: 0.6, peak: 0.01 },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 98, attack: 0.35, decay: 0.8, peak: 0.03 },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    ready: {
      masterGain: 0.131,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 213.64000000000001, glideTo: 196, glideTime: 0.015, attack: 0.06, decay: 0.7, peak: 0.108 },
        { kind: 'tone', waveform: 'sine', frequency: 427.28000000000003, glideTo: 392, glideTime: 0.015, attack: 0.06, decay: 0.5599999999999999, peak: 0.0432 },
        { kind: 'tone', waveform: 'sine', frequency: 640.9200000000001, glideTo: 588, glideTime: 0.015, attack: 0.06, decay: 0.35, peak: 0.0054, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 854.5600000000001, glideTo: 784, glideTime: 0.015, attack: 0.06, decay: 0.27999999999999997, peak: 0.00864, from: 'normal' },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 98, attack: 0.06, decay: 0.75, peak: 0.054 },
      ],
      room: 2,
      vary: { pitch: 0, level: 0.08 },
    },
    attention: {
      masterGain: 0.153,
      layers: [
        { kind: 'tone', waveform: 'sine', frequency: 479.6, glideTo: 440, glideTime: 0.015, attack: 0.06, decay: 0.9, peak: 0.067 },
        { kind: 'tone', waveform: 'sine', frequency: 959.2, glideTo: 880, glideTime: 0.015, attack: 0.06, decay: 0.7200000000000001, peak: 0.026800000000000004 },
        { kind: 'tone', waveform: 'sine', frequency: 1438.8000000000002, glideTo: 1320, glideTime: 0.015, attack: 0.06, decay: 0.45, peak: 0.0033500000000000005, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 1918.4, glideTo: 1760, glideTime: 0.015, attack: 0.06, decay: 0.36000000000000004, peak: 0.00536, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 718.5825000000001, glideTo: 659.25, glideTime: 0.015, attack: 0.06, decay: 0.8, peak: 0.048 },
        { kind: 'tone', waveform: 'sine', frequency: 1437.1650000000002, glideTo: 1318.5, glideTime: 0.015, attack: 0.06, decay: 0.6400000000000001, peak: 0.019200000000000002 },
        { kind: 'tone', waveform: 'sine', frequency: 2155.7475, glideTo: 1977.75, glideTime: 0.015, attack: 0.06, decay: 0.4, peak: 0.0024000000000000002, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 2874.3300000000004, glideTo: 2637, glideTime: 0.015, attack: 0.06, decay: 0.32000000000000006, peak: 0.00384, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 959.2, glideTo: 880, glideTime: 0.015, attack: 0.06, decay: 0.6, peak: 0.024 },
        { kind: 'tone', waveform: 'sine', frequency: 1918.4, glideTo: 1760, glideTime: 0.015, attack: 0.06, decay: 0.48, peak: 0.009600000000000001 },
        { kind: 'tone', waveform: 'sine', frequency: 2877.6000000000004, glideTo: 2640, glideTime: 0.015, attack: 0.06, decay: 0.3, peak: 0.0012000000000000001, from: 'normal' },
        { kind: 'tone', waveform: 'sine', frequency: 3836.8, glideTo: 3520, glideTime: 0.015, attack: 0.06, decay: 0.24, peak: 0.00192, from: 'normal' },
        { from: 'strong', kind: 'tone', waveform: 'sine', frequency: 220, attack: 0.06, decay: 0.9, peak: 0.0335 },
      ],
      vary: { pitch: 0, level: 0.08 },
    },
    count: {
      masterGain: 0.366,
      layers: [
        { stretch: true, kind: 'noise', filterType: 'bandpass', filterFrequency: 900, glideTo: 1800, glideTime: 0.6, filterQ: 2, attack: 0.15, decay: 0.55, peak: 0.08 },
        { stretch: true, kind: 'noise', filterType: 'lowpass', filterFrequency: 200, glideTo: 500, glideTime: 0.6, filterQ: 0.7, attack: 0.15, decay: 0.55, peak: 0.06 },
        { stretch: true, from: 'normal', kind: 'noise', filterType: 'bandpass', filterFrequency: 2600, glideTo: 3600, glideTime: 0.6, filterQ: 4, attack: 0.15, decay: 0.45, peak: 0.02 },
        { stretch: true, from: 'strong', kind: 'noise', filterType: 'lowpass', filterFrequency: 150, glideTo: 300, glideTime: 0.6, filterQ: 0.7, attack: 0.15, decay: 0.55, peak: 0.08 },
      ],
      vary: { pitch: 0.02, level: 0.1 },
    },
  },
};
