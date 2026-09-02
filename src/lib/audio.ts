/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Haptics } from './haptics';

export { Haptics };

// Procedural Web Audio API sound synthesizer
let audioCtx: AudioContext | null = null;

// Scale frequencies for multi-touch placement (C Major Pentatonic across 2 octaves)
const PENTATONIC_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50 // C6
];

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function triggerHaptic(pattern: number | number[], enabled: boolean = true) {
  if (!enabled) return;
  Haptics.vibrate(pattern);
}

export class SoundEngine {
  private static masterVolume: number = 0.8;
  private static soundEnabled: boolean = true;
  private static hapticsEnabled: boolean = true;

  public static updateConfig(soundEnabled: boolean, volume: number, hapticsEnabled: boolean) {
    this.soundEnabled = soundEnabled;
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.hapticsEnabled = hapticsEnabled;
    Haptics.setEnabled(hapticsEnabled);
  }

  // 1. Touch Placed: Musical rising note + sub-harmonic tap
  public static playTouchDown(touchIndex: number = 0) {
    Haptics.touchDown();
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freq = PENTATONIC_SCALE[touchIndex % PENTATONIC_SCALE.length];

      // Primary chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      // Subtle high sparkle overtone
      const highOsc = ctx.createOscillator();
      const highGain = ctx.createGain();
      highOsc.type = 'triangle';
      highOsc.frequency.setValueAtTime(freq * 2, now);
      highGain.gain.setValueAtTime(0.06 * this.masterVolume, now);
      highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      highOsc.connect(highGain);
      gain.connect(ctx.destination);
      highGain.connect(ctx.destination);

      osc.start(now);
      highOsc.start(now);
      osc.stop(now + 0.25);
      highOsc.stop(now + 0.1);
    } catch (e) {}
  }

  // 2. Touch Released: Soft release blip
  public static playTouchUp() {
    Haptics.touchUp();
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

      gain.gain.setValueAtTime(0.08 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // 3. Countdown Tick: Tension builder ramping in pitch and brightness
  public static playCountdownTick(remainingSeconds: number, totalSeconds: number) {
    Haptics.countdownTick(remainingSeconds, totalSeconds);
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const urgency = 1 - Math.max(0, remainingSeconds / (totalSeconds || 5));
      const now = ctx.currentTime;
      const baseFreq = 400 + urgency * 450; // Pitch rises from 400Hz to 850Hz

      // Punchy pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.5, now);
      filter.Q.setValueAtTime(4 + urgency * 4, now);

      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.1);

      gain.gain.setValueAtTime(0.35 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // 4. Decision Drop / Loser Impact: Deep 808 sub kick + shockwave sweep
  public static playTargetImpact() {
    Haptics.targetSelected();
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 808 Sub Drop
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

      subGain.gain.setValueAtTime(0.65 * this.masterVolume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.7);

      // Electric Zap / Laser chord
      [587.33, 880.0, 1174.66].forEach((freq, i) => {
        const chordOsc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        chordOsc.type = 'sawtooth';
        chordOsc.frequency.setValueAtTime(freq, now + i * 0.03);
        chordGain.gain.setValueAtTime(0.15 * this.masterVolume, now + i * 0.03);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.03);

        const chordFilter = ctx.createBiquadFilter();
        chordFilter.type = 'lowpass';
        chordFilter.frequency.setValueAtTime(2400, now);

        chordOsc.connect(chordFilter);
        chordFilter.connect(chordGain);
        chordGain.connect(ctx.destination);

        chordOsc.start(now + i * 0.03);
        chordOsc.stop(now + 0.45);
      });
    } catch (e) {}
  }

  // 5. Team Division Complete: Harmonic futuristic synth fanfare
  public static playTeamDivisionChime() {
    Haptics.teamDivision();
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.06);

        gain.gain.setValueAtTime(0.001, now + index * 0.06);
        gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, now + index * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.06);
        osc.stop(now + index * 0.06 + 0.5);
      });
    } catch (e) {}
  }

  // 6. Bottle Flick / Launch: Wind whoosh & momentum whoosh
  public static playBottleFlick(velocity: number) {
    Haptics.bottleFlick(velocity);
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const intensity = Math.min(1.5, Math.max(0.4, Math.abs(velocity) / 15));
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(500 * intensity, now + 0.18);

      gain.gain.setValueAtTime(0.25 * intensity * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // 7. Bottle Spin Ratchet / Bearing Tick: Subtle mechanical tick per revolution slice
  public static playBottleTick(angularVelocity: number) {
    Haptics.bottleTick(angularVelocity);
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const speedFactor = Math.min(2, Math.max(0.6, Math.abs(angularVelocity) / 10));

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + speedFactor * 400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);

      gain.gain.setValueAtTime(0.06 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  }

  // 8. Bottle Settled: Final landing bell chime
  public static playBottleSettle() {
    Haptics.bottleSettled();
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

      gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // 9. UI Button Click
  public static playButtonClick() {
    Haptics.buttonClick();
    if (!this.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.12 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }
}
