/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Synthesized 8-Bit Web Audio API Engine for "Shaily's Midnight Matsuri"
// Features an authentic, spooky NES/GameBoy chiptune rendition of "Happy Birthday" in C Harmonic Minor.

interface NoteEvent {
  freq: number;
  duration: number; // in beats
  vibrato?: boolean;
}

interface ChordEvent {
  freqs: number[];
  duration: number;
}

interface BeatPattern {
  lead?: NoteEvent[];
  chords?: ChordEvent[];
  bass?: number; // bass freq
  noise?: 'tick' | 'ghost' | 'roll';
}

// 48-Beat Soothing Lofi 8-Bit Japanese Happy Birthday & Sakura Chill Loop
// Key: G Major / E Hirajoshi Japanese Pentatonic Blend (84 BPM Lofi Beat)
const C1 = 32.70;
const G1 = 49.00;
const A1 = 55.00;
const B1 = 61.74;
const C2 = 65.41;
const D2 = 73.42;
const E2 = 82.41;
const F2 = 87.31;
const Fs2 = 92.50;
const G2 = 98.00;
const Ab2 = 103.83;
const A2 = 110.00;
const B2 = 123.47;
const C3 = 130.81;
const D3 = 146.83;
const Eb3 = 155.56;
const E3 = 164.81;
const G3 = 196.00;
const Ab3 = 207.65;
const A3 = 220.00;
const B3 = 246.94;
const C4 = 261.63;
const D4 = 293.66;
const Eb4 = 311.13;
const E4 = 329.63;
const F4 = 349.23;
const Fs4 = 369.99;
const G4 = 392.00;
const Ab4 = 415.30;
const A4 = 440.00;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const Eb5 = 622.25;
const E5 = 659.25;
const F5 = 698.46;
const Fs5 = 739.99;
const G5 = 783.99;
const Ab5 = 830.61;
const A5 = 880.00;
const B5 = 987.77;
const C6 = 1046.50;
const D6 = 1174.66;
const E6 = 1318.51;

// 48-Beat Spooky NES/GameBoy Chiptune Rendition of "Happy Birthday" in C Harmonic Minor
function generateHauntedBirthdayBeatMap(): BeatPattern[] {
  const pattern: BeatPattern[] = [];

  // Measure 0 (Beat 0): Soft pickup "Hap-py"
  pattern.push({
    lead: [
      { freq: G4, duration: 0.6 },
      { freq: G4, duration: 0.4 },
    ],
    noise: 'ghost',
  });

  // Measure 1 (Beats 1, 2, 3): "Birth - day - to"
  pattern.push({
    lead: [{ freq: Ab4, duration: 1.0 }],
    bass: C2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: G4, duration: 1.0 }],
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: C5, duration: 1.0 }],
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 2 (Beats 4, 5, 6): "you..." (Spooky B4 leading tone tension)
  pattern.push({
    lead: [{ freq: B4, duration: 1.8, vibrato: true }],
    bass: G2,
    noise: 'tick',
  });
  pattern.push({
    chords: [{ freqs: [B3, D4, G4], duration: 0.8 }],
    lead: [{ freq: Eb5, duration: 0.5 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [
      { freq: G4, duration: 0.6 },
      { freq: G4, duration: 0.4 },
    ],
    chords: [{ freqs: [B3, D4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 3 (Beats 7, 8, 9): "Birth - day - to"
  pattern.push({
    lead: [{ freq: Ab4, duration: 1.0 }],
    bass: G2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: G4, duration: 1.0 }],
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: D5, duration: 1.0 }],
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 4 (Beats 10, 11, 12): "you..." (Resolving to C Minor)
  pattern.push({
    lead: [{ freq: C5, duration: 1.8, vibrato: true }],
    bass: C2,
    noise: 'tick',
  });
  pattern.push({
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    lead: [{ freq: Ab4, duration: 0.5 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [
      { freq: G4, duration: 0.6 },
      { freq: G4, duration: 0.4 },
    ],
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 5 (Beats 13, 14, 15): "Birth - day - dear" (High octave G5 -> Eb5 -> C5)
  pattern.push({
    lead: [{ freq: G5, duration: 1.0 }],
    bass: C2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: Eb5, duration: 1.0 }],
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: C5, duration: 1.0 }],
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 6 (Beats 16, 17, 18): "Shai - ly..." (Haunted minor descent B4 -> Ab4)
  pattern.push({
    lead: [{ freq: B4, duration: 1.0 }],
    bass: F2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: Ab4, duration: 1.8, vibrato: true }],
    chords: [{ freqs: [C4, F4, Ab4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [
      { freq: F5, duration: 0.6 },
      { freq: F5, duration: 0.4 },
    ],
    chords: [{ freqs: [C4, F4, Ab4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 7 (Beats 19, 20, 21): "Birth - day - to"
  pattern.push({
    lead: [{ freq: Eb5, duration: 1.0 }],
    bass: G2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: C5, duration: 1.0 }],
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: D5, duration: 1.0 }],
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 8 (Beats 22, 23, 24): "you...!" (Gothic organ minor resolution)
  pattern.push({
    lead: [{ freq: C5, duration: 2.7, vibrato: true }],
    bass: C2,
    chords: [{ freqs: [C4, Eb4, G4, C5], duration: 1.2 }],
    noise: 'roll',
  });
  pattern.push({
    bass: G2,
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    bass: C3,
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // === SPOOKY HALLOWEEN / HARMONIC MINOR CHILL INTERLUDE ===
  // Measure 9 (Beats 25, 26, 27): C Minor Arpeggio Cascade
  pattern.push({
    lead: [{ freq: C5, duration: 0.5 }, { freq: Eb5, duration: 0.5 }],
    bass: C2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: G5, duration: 0.5 }, { freq: B5, duration: 0.5 }],
    bass: C3,
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: C6, duration: 0.5 }, { freq: G5, duration: 0.5 }],
    bass: Eb3,
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 10 (Beats 28, 29, 30): G Harmonic Minor Organ Tremolo
  pattern.push({
    lead: [{ freq: Ab5, duration: 0.5 }, { freq: G5, duration: 0.5 }],
    bass: G2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: Eb5, duration: 0.5 }, { freq: D5, duration: 0.5 }],
    bass: B2,
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: C5, duration: 0.5 }, { freq: B4, duration: 0.5 }],
    bass: D3,
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 11 (Beats 31, 32, 33): Ab Major Spooky Waltz Strum
  pattern.push({
    lead: [{ freq: C5, duration: 0.5 }, { freq: Eb5, duration: 0.5 }],
    bass: Ab2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: Ab5, duration: 0.5 }, { freq: G5, duration: 0.5 }],
    bass: C3,
    chords: [{ freqs: [C4, Eb4, Ab4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: F5, duration: 0.5 }, { freq: Eb5, duration: 0.5 }],
    bass: Eb3,
    chords: [{ freqs: [C4, Eb4, Ab4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 12 (Beats 34, 35, 36): G7 Diminished Tension
  pattern.push({
    lead: [{ freq: D5, duration: 0.5 }, { freq: F5, duration: 0.5 }],
    bass: G2,
    noise: 'tick',
  });
  pattern.push({
    lead: [{ freq: Ab5, duration: 0.5 }, { freq: B5, duration: 0.5 }],
    bass: B2,
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [{ freq: C6, duration: 0.5 }, { freq: B5, duration: 0.5 }],
    bass: D3,
    chords: [{ freqs: [B3, D4, F4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  // Measure 13 (Beats 37, 38, 39): Eerie Clock Chime & Loop Preparation
  pattern.push({
    lead: [{ freq: C6, duration: 1.8, vibrato: true }],
    bass: C1,
    chords: [{ freqs: [C4, Eb4, G4], duration: 1.0 }],
    noise: 'roll',
  });
  pattern.push({
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });
  pattern.push({
    lead: [
      { freq: G4, duration: 0.6 },
      { freq: G4, duration: 0.4 },
    ],
    chords: [{ freqs: [C4, Eb4, G4], duration: 0.8 }],
    noise: 'ghost',
  });

  return pattern;
}

const HAUNTED_BIRTHDAY_BEATS = generateHauntedBirthdayBeatMap();

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmActive: boolean = false;

  // Master and sub-bus gain nodes
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private crtFilter: BiquadFilterNode | null = null;

  // Chiptune noise buffer cache
  private noiseBuffer: AudioBuffer | null = null;

  // Precise Web Audio clock scheduler
  private currentBeatIndex: number = 0;
  private nextBeatTime: number = 0;
  private schedulerTimerId: number | null = null;
  private isScheduling: boolean = false;
  private lastStepTime: number = 0;

  public ensureContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Soothing vintage lofi lowpass filter at 3.6 kHz for warm, cozy chiptune sound
        this.crtFilter = this.ctx.createBiquadFilter();
        this.crtFilter.type = 'lowpass';
        this.crtFilter.frequency.setValueAtTime(3600, this.ctx.currentTime);
        this.crtFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.70, this.ctx.currentTime);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

        this.bgmGain.connect(this.crtFilter);
        this.sfxGain.connect(this.crtFilter);
        this.crtFilter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        // Pre-generate 1 second of white noise for soft lofi vinyl/percussion
        const bufferSize = this.ctx.sampleRate;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBgm();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      }
      if (this.bgmActive) {
        this.startBgm();
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Toggles the Soothing Lofi Japanese Happy Birthday BGM
  public toggleDrone(active: boolean) {
    this.bgmActive = active;
    if (active && !this.isMuted) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  private startBgm() {
    this.stopBgm();
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.currentBeatIndex = 0;
    this.nextBeatTime = ctx.currentTime + 0.05;
    this.isScheduling = true;

    const beatDur = 60 / 84; // 84 BPM relaxing lofi tempo (0.714s per beat)
    const scheduleAheadTime = 0.12; // Lookahead window

    const scheduler = () => {
      if (!this.isScheduling || !this.bgmActive || this.isMuted) return;
      const audioCtx = this.ensureContext();
      if (!audioCtx) return;

      while (this.nextBeatTime < audioCtx.currentTime + scheduleAheadTime) {
        this.scheduleBeat(this.currentBeatIndex, this.nextBeatTime, beatDur);
        this.nextBeatTime += beatDur;
        this.currentBeatIndex = (this.currentBeatIndex + 1) % HAUNTED_BIRTHDAY_BEATS.length;
      }

      this.schedulerTimerId = window.setTimeout(scheduler, 25);
    };

    scheduler();
  }

  private stopBgm() {
    this.isScheduling = false;
    if (this.schedulerTimerId !== null) {
      clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }
  }

  // Schedules all multi-channel 8-bit sound voices for a single beat
  private scheduleBeat(beatIndex: number, time: number, beatDur: number) {
    const ctx = this.ensureContext();
    if (!ctx || !this.bgmGain) return;

    const pattern = HAUNTED_BIRTHDAY_BEATS[beatIndex];
    if (!pattern) return;

    // 1. Channel 1: Pulse 1 - Soothing Lofi Lead Melody
    if (pattern.lead) {
      let offset = 0;
      for (const note of pattern.lead) {
        const noteStartTime = time + offset * beatDur;
        const noteDurationSec = note.duration * beatDur;
        this.play8BitLead(note.freq, noteStartTime, noteDurationSec, note.vibrato);
        offset += note.duration;
      }
    }

    // 2. Channel 2: Pulse 2 - Japanese Koto / Music Box Chimes
    if (pattern.chords) {
      for (const chord of pattern.chords) {
        const durSec = chord.duration * beatDur;
        for (const freq of chord.freqs) {
          this.play8BitChordNote(freq, time, durSec);
        }
      }
    }

    // 3. Channel 3: Triangle - Warm Sub-Bass
    if (pattern.bass) {
      this.play8BitBass(pattern.bass, time, beatDur * 0.88);
    }

    // 4. Channel 4: Noise - Soft Lofi Vinyl/Arcade Beat
    if (pattern.noise) {
      this.play8BitNoise(pattern.noise, time);
    }
  }

  // Soothing Soft Sine/Triangle Hybrid Lead with Gentle LFO Vibrato
  private play8BitLead(freq: number, start: number, dur: number, hasVibrato?: boolean) {
    if (!this.ctx || !this.bgmGain || freq <= 0) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft sine/triangle hybrid tone for warm lofi melody
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.95);

      // Relaxing Japanese flute LFO Vibrato
      if (hasVibrato && dur > 0.4) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4.5, start); // 4.5 Hz smooth vibrato

        lfoGain.gain.setValueAtTime(0, start);
        lfoGain.gain.linearRampToValueAtTime(6.0, start + 0.2); // 6 Hz gentle pitch bend

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        lfo.start(start + 0.1);
        lfo.stop(start + dur);
      }

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(start);
      osc.stop(start + dur * 0.96);
    } catch {}
  }

  // Warm Koto-like 8-Bit Chime Chords
  private play8BitChordNote(freq: number, start: number, dur: number) {
    if (!this.ctx || !this.bgmGain || freq <= 0) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.001, start); // subtle warmth detune

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.028, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.88);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(start);
      osc.stop(start + dur * 0.92);
    } catch {}
  }

  // Deep Warm Lofi Triangle Sub-Bass
  private play8BitBass(freq: number, start: number, dur: number) {
    if (!this.ctx || !this.bgmGain || freq <= 0) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.075, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.9);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(start);
      osc.stop(start + dur);
    } catch {}
  }

  // Soft Lofi Percussion & Vinyl Texture
  private play8BitNoise(type: 'tick' | 'ghost' | 'roll', start: number) {
    if (!this.ctx || !this.bgmGain || !this.noiseBuffer) return;

    try {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      if (type === 'tick') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, start);

        gain.gain.setValueAtTime(0.018, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        noiseSource.start(start);
        noiseSource.stop(start + 0.055);
      } else if (type === 'ghost') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, start);
        filter.Q.setValueAtTime(1.5, start);

        gain.gain.setValueAtTime(0.012, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.06);
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        noiseSource.start(start);
        noiseSource.stop(start + 0.065);
      } else if (type === 'roll') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, start);

        gain.gain.setValueAtTime(0.022, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        noiseSource.start(start);
        noiseSource.stop(start + 0.2);
      }
    } catch {}
  }

  // Gentle low-frequency footstep tap clicks
  public playFootstep() {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastStepTime < 190) return;
    this.lastStepTime = nowMs;

    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(135, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.045);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Uplifting diminished-7th Halloween discovery fanfare (A4, C5, Eb5, F#5, A5)
  public playNoteFanfare() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const notes = [440.0, 523.25, 622.25, 739.99, 880.0];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.085;
        const duration = idx === notes.length - 1 ? 0.38 : 0.11;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.08, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(start);
        osc.stop(start + duration + 0.02);
      } catch {}
    });
  }

  // Grand Spooky Baroque Victory Fanfare upon finding all 10 notes:
  // Haunted Happy Birthday Triumph phrase in C minor resolving to high radiant C6!
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const sequence = [
      { freq: 392.00, delay: 0.0, dur: 0.12 },   // G4
      { freq: 415.30, delay: 0.12, dur: 0.12 },  // Ab4
      { freq: 523.25, delay: 0.24, dur: 0.14 },  // C5
      { freq: 622.25, delay: 0.38, dur: 0.14 },  // Eb5
      { freq: 783.99, delay: 0.52, dur: 0.18 },  // G5
      { freq: 987.77, delay: 0.70, dur: 0.18 },  // B5 (harmonic tension!)
      { freq: 1046.50, delay: 0.88, dur: 0.75 }, // C6 (radiant 8-bit resolution!)
    ];

    const now = ctx.currentTime;
    sequence.forEach((item) => {
      try {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + item.delay;

        osc.type = 'square';
        osc.frequency.setValueAtTime(item.freq, start);

        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(item.freq / 2, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.09, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.dur);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(start);
        subOsc.start(start);
        osc.stop(start + item.dur + 0.03);
        subOsc.stop(start + item.dur + 0.03);
      } catch {}
    });
  }

  // Cute 8-bit kitten chirp sound on inspecting the Black Witch Cat box
  public playCatChirp() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(1120, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.22);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.075, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Comical 8-bit spooky vampire wobble & minor organ riff
  public playVampireSound() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [587.33, 554.37, 440.00];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.12;
        const dur = idx === 2 ? 0.35 : 0.1;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);
        if (idx === 2) {
          osc.frequency.exponentialRampToValueAtTime(329.63, start + dur);
        }

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.08, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch {}
  }

  // Festive 8-bit party fanfare on greeting the chilling park friends
  public playCheerSound() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;
        const dur = idx === 3 ? 0.38 : 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.09, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
