/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Haptics } from './haptics';

export { Haptics };

let audioCtx: AudioContext | null = null;

// Scale frequencies for multi-touch placement (C Major Pentatonic across 2 octaves fallback)
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
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

// Global one-time unlocker for mobile browsers
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Start preloading high-bitrate files immediately on first user interaction or load
    SoundEngine.preloadSounds();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}

interface PlaySampleOptions {
  volume?: number;
  playbackRate?: number;
  detuneCents?: number;
}

export class SoundEngine {
  private static masterVolume: number = 0.8;
  private static soundEnabled: boolean = true;
  private static hapticsEnabled: boolean = true;

  // Cache for decoded 44.1kHz 16-bit uncompressed audio buffers
  private static audioBufferCache: Map<string, AudioBuffer> = new Map();
  private static pendingLoads: Map<string, Promise<AudioBuffer | null>> = new Map();
  private static isPreloaded: boolean = false;
  private static tickVariantCounter: number = 0;

  public static updateConfig(soundEnabled: boolean, volume: number, hapticsEnabled: boolean) {
    this.soundEnabled = soundEnabled;
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.hapticsEnabled = hapticsEnabled;
    Haptics.setEnabled(hapticsEnabled);
  }

  /**
   * Preload all high-bitrate studio audio files into decoded AudioBuffers
   */
  public static preloadSounds(): void {
    if (this.isPreloaded || typeof window === 'undefined') return;
    this.isPreloaded = true;

    const files = [
      'button_click.wav',
      'touch_up.wav',
      'countdown_tick.wav',
      'countdown_tick_urgent.wav',
      'target_impact.wav',
      'team_division.wav',
      'bottle_flick.wav',
      'bottle_settle.wav',
      'touch_down_0.wav',
      'touch_down_1.wav',
      'touch_down_2.wav',
      'touch_down_3.wav',
      'touch_down_4.wav',
      'touch_down_5.wav',
      'touch_down_6.wav',
      'touch_down_7.wav',
      'bottle_tick_0.wav',
      'bottle_tick_1.wav',
      'bottle_tick_2.wav',
      'bottle_tick_3.wav',
    ];

    files.forEach((file) => {
      this.loadAudioBuffer(file).catch(() => {});
    });
  }

  /**
   * Loads and decodes an audio file into an AudioBuffer with promise deduplication
   */
  private static async loadAudioBuffer(fileName: string): Promise<AudioBuffer | null> {
    if (this.audioBufferCache.has(fileName)) {
      return this.audioBufferCache.get(fileName)!;
    }

    if (this.pendingLoads.has(fileName)) {
      return this.pendingLoads.get(fileName)!;
    }

    const loadPromise = (async () => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return null;

        const response = await fetch(`/sounds/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch /sounds/${fileName}: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        this.audioBufferCache.set(fileName, decoded);
        return decoded;
      } catch (err) {
        console.warn(`[SoundEngine] Could not load audio file /sounds/${fileName}:`, err);
        return null;
      } finally {
        this.pendingLoads.delete(fileName);
      }
    })();

    this.pendingLoads.set(fileName, loadPromise);
    return loadPromise;
  }

  /**
   * Plays a pre-decoded high-bitrate AudioBuffer instantly with zero latency
   */
  private static playSample(fileName: string, options: PlaySampleOptions = {}): boolean {
    if (!this.soundEnabled) return false;
    const ctx = getAudioContext();
    if (!ctx) return false;

    const buffer = this.audioBufferCache.get(fileName);
    if (!buffer) {
      // Trigger lazy load in background for next time
      this.loadAudioBuffer(fileName);
      return false;
    }

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      const baseVol = options.volume !== undefined ? options.volume : 1.0;
      gain.gain.setValueAtTime(Math.max(0.001, baseVol * this.masterVolume), ctx.currentTime);

      if (options.playbackRate !== undefined) {
        source.playbackRate.setValueAtTime(options.playbackRate, ctx.currentTime);
      }

      if (options.detuneCents !== undefined && source.detune) {
        source.detune.setValueAtTime(options.detuneCents, ctx.currentTime);
      }

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      return true;
    } catch (e) {
      return false;
    }
  }

  // =========================================================================
  // 1. Touch Placed: High-bitrate studio glass chime + harmonic spread
  // =========================================================================
  public static playTouchDown(touchIndex: number = 0) {
    Haptics.touchDown();
    if (!this.soundEnabled) return;

    const fileIndex = Math.abs(touchIndex) % 8;
    const fileName = `touch_down_${fileIndex}.wav`;

    const played = this.playSample(fileName, {
      volume: 0.85,
    });

    if (!played) {
      // High-quality fallback synthesis
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const freq = PENTATONIC_SCALE[touchIndex % PENTATONIC_SCALE.length];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.12);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        const highOsc = ctx.createOscillator();
        const highGain = ctx.createGain();
        highOsc.type = 'triangle';
        highOsc.frequency.setValueAtTime(freq * 2.76, now);
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
  }

  // =========================================================================
  // 2. Touch Released: Delicate high-fidelity release transient
  // =========================================================================
  public static playTouchUp() {
    Haptics.touchUp();
    if (!this.soundEnabled) return;

    const played = this.playSample('touch_up.wav', { volume: 0.75 });
    if (!played) {
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
  }

  // =========================================================================
  // 3. Countdown Tick: High-bitrate sonar suspense pulse
  // =========================================================================
  public static playCountdownTick(remainingSeconds: number, totalSeconds: number) {
    Haptics.countdownTick(remainingSeconds, totalSeconds);
    if (!this.soundEnabled) return;

    const urgency = 1 - Math.max(0, remainingSeconds / (totalSeconds || 5));
    const isUrgent = remainingSeconds <= 1;
    const fileName = isUrgent ? 'countdown_tick_urgent.wav' : 'countdown_tick.wav';
    const rate = 0.95 + urgency * 0.35;

    const played = this.playSample(fileName, {
      volume: 0.9 + urgency * 0.2,
      playbackRate: rate,
    });

    if (!played) {
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const baseFreq = 400 + urgency * 450;
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
  }

  // =========================================================================
  // 4. Decision Drop / Loser Impact: Thunderous 808 Sub + Shockwave Crackle
  // =========================================================================
  public static playTargetImpact() {
    Haptics.targetSelected();
    if (!this.soundEnabled) return;

    const played = this.playSample('target_impact.wav', { volume: 1.0 });
    if (!played) {
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
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
      } catch (e) {}
    }
  }

  // =========================================================================
  // 5. Team Division Complete: Lush studio arpeggiated glass fanfare
  // =========================================================================
  public static playTeamDivisionChime() {
    Haptics.teamDivision();
    if (!this.soundEnabled) return;

    const played = this.playSample('team_division.wav', { volume: 0.95 });
    if (!played) {
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
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
  }

  // =========================================================================
  // 6. Bottle Flick / Launch: Realistic air whoosh + glass sliding resonance
  // =========================================================================
  public static playBottleFlick(velocity: number) {
    Haptics.bottleFlick(velocity);
    if (!this.soundEnabled) return;

    const intensity = Math.min(1.4, Math.max(0.7, Math.abs(velocity) / 12));
    const rate = 0.85 + intensity * 0.35;

    const played = this.playSample('bottle_flick.wav', {
      volume: 0.9 * intensity,
      playbackRate: rate,
    });

    if (!played) {
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
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
  }

  // =========================================================================
  // 7. Bottle Spin Ratchet / Bearing Tick: Authentic glass-on-table clicks
  // =========================================================================
  public static playBottleTick(angularVelocity: number) {
    Haptics.bottleTick(angularVelocity);
    if (!this.soundEnabled) return;

    // Cycle through 4 natural acoustic contact variations
    const variant = this.tickVariantCounter % 4;
    this.tickVariantCounter++;

    const speedFactor = Math.min(1.5, Math.max(0.8, Math.abs(angularVelocity) / 8));
    const rate = 0.9 + speedFactor * 0.25;

    const played = this.playSample(`bottle_tick_${variant}.wav`, {
      volume: 0.85 * Math.min(1.2, speedFactor),
      playbackRate: rate,
    });

    if (!played) {
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
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
  }

  // =========================================================================
  // 8. Bottle Settled: Resonant crystal glass bell ring-out
  // =========================================================================
  public static playBottleSettle() {
    Haptics.bottleSettled();
    if (!this.soundEnabled) return;

    const played = this.playSample('bottle_settle.wav', { volume: 0.95 });
    if (!played) {
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
  }

  // =========================================================================
  // 9. UI Button Click: Ultra-crisp modern glass tap
  // =========================================================================
  public static playButtonClick() {
    Haptics.buttonClick();
    if (!this.soundEnabled) return;

    // Subtle micro-pitch variation (0.97 - 1.03) gives natural, organic feel
    const randomRate = 0.97 + Math.random() * 0.06;

    const played = this.playSample('button_click.wav', {
      volume: 0.85,
      playbackRate: randomRate,
    });

    if (!played) {
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
}
