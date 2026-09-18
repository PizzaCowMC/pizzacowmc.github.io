// Procedural Minecraft-Themed BGM Synthesizer System
// Utilizes Web Audio API to create authentic, zero-dependency ambient & chiptune background music tracks.

export interface BgmTrack {
  id: string;
  nameEn: string;
  nameZh: string;
  discName: string;
  composer: string;
  descEn: string;
  descZh: string;
  discColor: string;
  ringColor: string;
  discLabel: string;
  bpm: number;
  suitableArea?: 'overworld' | 'cafe' | 'quarry' | 'building' | 'elevator';
}

// Standard Note frequency mapping helper
const NOTE_SEMITONES: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
  'A#': 10, 'Bb': 10, 'B': 11
};

export function noteToFreq(note: string): number {
  if (!note || note === 'REST') return 0;
  const match = note.match(/^([A-G][#b]?)(-?\d+)$/);
  if (!match) return 440;
  const name = match[1];
  const oct = parseInt(match[2], 10);
  const semi = NOTE_SEMITONES[name] ?? 0;
  const midi = 12 * (oct + 1) + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export const BGM_TRACKS: BgmTrack[] = [
  {
    id: 'clockwork_steam',
    nameEn: 'Redstone Clockwork (Official Theme Song)',
    nameZh: '紅石蒸氣工坊 (官方遊戲主題曲)',
    discName: 'Theme Disc Chirp - Redstone Brass',
    composer: 'Redstone Steam Workshop',
    descEn: 'Official Minecraft Cafe Theme Song: Rhythmic marimba pulses, mechanical clockwork ticks & steady industrial redstone syncopation.',
    descZh: '遊戲官方主題曲：精巧的馬林巴木琴琶音與紅石齒輪機械跳動，如紅石電梯塔與咖啡廳運轉般充滿秩序與生機。',
    discColor: '#eab308',
    ringColor: '#ca8a04',
    discLabel: 'THEME',
    bpm: 96,
    suitableArea: 'elevator'
  },
  {
    id: 'starlight_cafe',
    nameEn: 'Starlight Cafe (Cozy Piano & Lo-Fi Beats)',
    nameZh: '星空咖啡館 (暖心鋼琴與慵懶爵士)',
    discName: 'Music Disc Cat - Starlight Roast',
    composer: 'Starlight Cafe Lounge',
    descEn: 'Cozy Lo-Fi cafe melody with warm Rhodes keys, gentle bell tinkles, relaxing walking subbass & acoustic brush ticks.',
    descZh: '為咖啡廳出餐與分館時光打造：溫暖的電鋼琴和弦、悠揚的星空音鈴、舒適的爵士低音與輕快節奏，陪伴悠閒時光。',
    discColor: '#38bdf8',
    ringColor: '#0284c7',
    discLabel: 'CAFE',
    bpm: 84,
    suitableArea: 'cafe'
  }
];

interface NoteEvent {
  time: number; // in 16th steps or beats
  duration: number; // in beats
  note: string; // e.g. "C4"
  instrument: 'piano' | 'bell' | 'epiano' | 'subbass' | 'chiptune' | 'pad' | 'tick';
  velocity: number; // 0.0 to 1.0
}

// Musical score generator for BGM tracks
function getTrackEvents(trackId: string): { totalBeats: number; events: NoteEvent[] } {
  const events: NoteEvent[] = [];

  if (trackId === 'starlight_cafe') {
    // 16 beats of warm Lo-Fi cafe lounge
    // Gentle drum brush ticks on every beat with swing on offbeats
    for (let i = 0; i < 16; i++) {
      events.push({ time: i, duration: 0.07, note: i % 2 === 0 ? 'F3' : 'C4', instrument: 'tick', velocity: 0.18 });
      if (i % 2 === 1) {
        events.push({ time: i + 0.66, duration: 0.05, note: 'G3', instrument: 'tick', velocity: 0.12 });
      }
    }

    // Warm Rhodes electric piano chords (Cmaj7 -> Am7 -> Dm7 -> G7)
    // Beat 0..4: Cmaj7 (C4, E4, G4, B4)
    events.push({ time: 0, duration: 3.6, note: 'C4', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 0, duration: 3.6, note: 'E4', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 0, duration: 3.6, note: 'G4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 0, duration: 3.6, note: 'B4', instrument: 'epiano', velocity: 0.25 });

    // Beat 4..8: Am7 (A3, C4, E4, G4)
    events.push({ time: 4, duration: 3.6, note: 'A3', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 4, duration: 3.6, note: 'C4', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 4, duration: 3.6, note: 'E4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 4, duration: 3.6, note: 'G4', instrument: 'epiano', velocity: 0.25 });

    // Beat 8..12: Dm7 (D4, F4, A4, C5)
    events.push({ time: 8, duration: 3.6, note: 'D4', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 8, duration: 3.6, note: 'F4', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 8, duration: 3.6, note: 'A4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 8, duration: 3.6, note: 'C5', instrument: 'epiano', velocity: 0.25 });

    // Beat 12..16: G7 (G3, B3, D4, F4)
    events.push({ time: 12, duration: 3.6, note: 'G3', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 12, duration: 3.6, note: 'B3', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 12, duration: 3.6, note: 'D4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 12, duration: 3.6, note: 'F4', instrument: 'epiano', velocity: 0.25 });

    // Melodic bell/piano touches (sweet coffee shop melody)
    const melody = [
      { t: 0.5, n: 'E5' }, { t: 1.5, n: 'D5' }, { t: 2.0, n: 'C5' }, { t: 3.0, n: 'G4' },
      { t: 4.5, n: 'C5' }, { t: 5.5, n: 'B4' }, { t: 6.0, n: 'A4' }, { t: 7.0, n: 'E4' },
      { t: 8.5, n: 'F4' }, { t: 9.0, n: 'A4' }, { t: 9.5, n: 'C5' }, { t: 10.5, n: 'E5' }, { t: 11.0, n: 'D5' },
      { t: 12.5, n: 'B4' }, { t: 13.5, n: 'A4' }, { t: 14.0, n: 'G4' }, { t: 15.0, n: 'D4' }
    ];
    melody.forEach(m => {
      events.push({ time: m.t, duration: 0.75, note: m.n, instrument: 'piano', velocity: 0.35 });
      // Sparkle bell harmonic accompaniment
      if (m.t % 2 === 0.5) {
        events.push({ time: m.t, duration: 0.6, note: m.n, instrument: 'bell', velocity: 0.22 });
      }
    });

    // Walking acoustic subbass
    events.push({ time: 0, duration: 1.8, note: 'C3', instrument: 'subbass', velocity: 0.38 });
    events.push({ time: 2, duration: 1.8, note: 'E3', instrument: 'subbass', velocity: 0.34 });
    events.push({ time: 4, duration: 1.8, note: 'A2', instrument: 'subbass', velocity: 0.38 });
    events.push({ time: 6, duration: 1.8, note: 'C3', instrument: 'subbass', velocity: 0.34 });
    events.push({ time: 8, duration: 1.8, note: 'D3', instrument: 'subbass', velocity: 0.38 });
    events.push({ time: 10, duration: 1.8, note: 'F3', instrument: 'subbass', velocity: 0.34 });
    events.push({ time: 12, duration: 1.8, note: 'G2', instrument: 'subbass', velocity: 0.38 });
    events.push({ time: 14, duration: 1.8, note: 'B2', instrument: 'subbass', velocity: 0.34 });

    return { totalBeats: 16, events };
  }

  // Default track: Redstone Clockwork (紅石蒸氣工坊)
  // 16 beats of clockwork pulses, marimba arpeggios, steady subbass & mechanical ticks
  for (let i = 0; i < 16; i++) {
    events.push({ time: i, duration: 0.08, note: i % 4 === 0 ? 'G3' : 'D4', instrument: 'tick', velocity: 0.25 });
    if (i % 2 === 1) {
      events.push({ time: i + 0.5, duration: 0.06, note: 'B3', instrument: 'tick', velocity: 0.16 });
    }
  }

  // Marimba clockwork melody (G - B - D - E - G - D - B - A / C - E - G - C - B - G - E - D)
  const marimba = [
    { t: 0, n: 'G3' }, { t: 0.5, n: 'B3' }, { t: 1.0, n: 'D4' }, { t: 1.5, n: 'G4' },
    { t: 2.0, n: 'E4' }, { t: 2.5, n: 'D4' }, { t: 3.0, n: 'B3' }, { t: 3.5, n: 'A3' },
    { t: 4.0, n: 'C4' }, { t: 4.5, n: 'E4' }, { t: 5.0, n: 'G4' }, { t: 5.5, n: 'C5' },
    { t: 6.0, n: 'B4' }, { t: 6.5, n: 'G4' }, { t: 7.0, n: 'E4' }, { t: 7.5, n: 'D4' },
    { t: 8.0, n: 'E4' }, { t: 8.5, n: 'G4' }, { t: 9.0, n: 'B4' }, { t: 9.5, n: 'E5' },
    { t: 10.0, n: 'D5' }, { t: 10.5, n: 'B4' }, { t: 11.0, n: 'G4' }, { t: 11.5, n: 'E4' },
    { t: 12.0, n: 'D4' }, { t: 12.5, n: 'F#4' }, { t: 13.0, n: 'A4' }, { t: 13.5, n: 'D5' },
    { t: 14.0, n: 'C5' }, { t: 14.5, n: 'A4' }, { t: 15.0, n: 'F#4' }, { t: 15.5, n: 'D4' }
  ];

  marimba.forEach(m => {
    events.push({ time: m.t, duration: 0.38, note: m.n, instrument: 'bell', velocity: 0.38 });
  });

  // Soft clockwork organ/piano chords for steam engine harmony
  events.push({ time: 0, duration: 3.8, note: 'B3', instrument: 'epiano', velocity: 0.22 });
  events.push({ time: 4, duration: 3.8, note: 'C4', instrument: 'epiano', velocity: 0.22 });
  events.push({ time: 8, duration: 3.8, note: 'G3', instrument: 'epiano', velocity: 0.22 });
  events.push({ time: 12, duration: 3.8, note: 'A3', instrument: 'epiano', velocity: 0.22 });

  // Industrial Subbass foundation
  events.push({ time: 0, duration: 3.5, note: 'G2', instrument: 'subbass', velocity: 0.42 });
  events.push({ time: 4, duration: 3.5, note: 'C2', instrument: 'subbass', velocity: 0.42 });
  events.push({ time: 8, duration: 3.5, note: 'E2', instrument: 'subbass', velocity: 0.42 });
  events.push({ time: 12, duration: 3.5, note: 'D2', instrument: 'subbass', velocity: 0.42 });

  return { totalBeats: 16, events };
}

class BgmEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  private currentTrackId: string = 'clockwork_steam';
  private isPlayingState: boolean = false;
  private volume: number = 0.5; // 0.0 to 1.0
  private autoAreaMode: boolean = true; // Auto-switch according to zone

  private activeNodes: { osc?: OscillatorNode; gain?: GainNode; stopTime?: number }[] = [];
  private loopTimer: number | null = null;
  private loopStartTime: number = 0;
  private listeners: Set<(track: BgmTrack, isPlaying: boolean) => void> = new Set();

  constructor() {
    try {
      const savedTrack = localStorage.getItem('minecraft_bgm_track');
      if (savedTrack && BGM_TRACKS.some(t => t.id === savedTrack)) {
        this.currentTrackId = savedTrack;
      }
      const savedVol = localStorage.getItem('minecraft_bgm_volume');
      if (savedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      }
      const savedAuto = localStorage.getItem('minecraft_bgm_auto_area');
      if (savedAuto !== null) {
        this.autoAreaMode = savedAuto === 'true';
      }
    } catch {}
  }

  public getContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private initAudioChain(ctx: AudioContext) {
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);

      // Lowpass warmth filter
      this.filterNode = ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(2600, ctx.currentTime);

      // Simple ambient delay feedback for authentic C418 spaciousness
      this.delayNode = ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.36, ctx.currentTime);
      this.delayGain = ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.18, ctx.currentTime);

      // Feedback loop
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.delayNode);

      // Compressor to avoid digital clipping
      this.compressor = ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.01, ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, ctx.currentTime);

      // Wire: sources -> filter -> masterGain -> destination
      // Also filter -> delay -> masterGain
      this.filterNode.connect(this.masterGain);
      this.filterNode.connect(this.delayNode);
      this.delayGain.connect(this.masterGain);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(ctx.destination);
    }
  }

  public subscribe(cb: (track: BgmTrack, isPlaying: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.getCurrentTrack(), this.isPlayingState);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    const track = this.getCurrentTrack();
    this.listeners.forEach(cb => cb(track, this.isPlayingState));
  }

  public getCurrentTrack(): BgmTrack {
    return BGM_TRACKS.find(t => t.id === this.currentTrackId) || BGM_TRACKS[0];
  }

  public isPlaying(): boolean {
    return this.isPlayingState;
  }

  public getVolume(): number {
    return this.volume;
  }

  public isAutoAreaMode(): boolean {
    return this.autoAreaMode;
  }

  public setAutoAreaMode(enabled: boolean) {
    this.autoAreaMode = enabled;
    try {
      localStorage.setItem('minecraft_bgm_auto_area', String(enabled));
    } catch {}
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('minecraft_bgm_volume', this.volume.toFixed(2));
    } catch {}
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public playTrack(trackId: string) {
    const track = BGM_TRACKS.find(t => t.id === trackId);
    if (!track) return;

    this.currentTrackId = trackId;
    try {
      localStorage.setItem('minecraft_bgm_track', trackId);
    } catch {}

    this.stopCurrentLoop();
    this.startLoop();
    this.isPlayingState = true;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlayingState) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public pause() {
    this.stopCurrentLoop();
    this.isPlayingState = false;
    this.notify();
  }

  public resume() {
    this.startLoop();
    this.isPlayingState = true;
    this.notify();
  }

  public nextTrack() {
    const currentIndex = BGM_TRACKS.findIndex(t => t.id === this.currentTrackId);
    const nextIndex = (currentIndex + 1) % BGM_TRACKS.length;
    this.playTrack(BGM_TRACKS[nextIndex].id);
  }

  public prevTrack() {
    const currentIndex = BGM_TRACKS.findIndex(t => t.id === this.currentTrackId);
    const prevIndex = (currentIndex - 1 + BGM_TRACKS.length) % BGM_TRACKS.length;
    this.playTrack(BGM_TRACKS[prevIndex].id);
  }

  // Adaptive area detection: switch track when entering new zones if autoAreaMode is active
  public onZoneChange(zone: 'overworld' | 'cafe' | 'quarry' | 'elevator' | 'building') {
    if (!this.autoAreaMode) return;
    const matched = BGM_TRACKS.find(t => t.suitableArea === zone);
    if (matched && matched.id !== this.currentTrackId) {
      this.playTrack(matched.id);
    }
  }

  private stopCurrentLoop() {
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    // Fade out active nodes gracefully
    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.activeNodes.forEach(node => {
        try {
          if (node.gain) {
            node.gain.gain.cancelScheduledValues(now);
            node.gain.gain.setValueAtTime(node.gain.gain.value, now);
            node.gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
          }
          if (node.osc) {
            node.osc.stop(now + 0.16);
          }
        } catch {}
      });
    }
    this.activeNodes = [];
  }

  private scheduleNote(
    ctx: AudioContext,
    targetGain: AudioNode,
    startTime: number,
    duration: number,
    freq: number,
    instrument: NoteEvent['instrument'],
    velocity: number
  ) {
    if (freq <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    switch (instrument) {
      case 'piano': {
        // Warm triangle/sine blend with natural piano decay
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        const attack = 0.012;
        const decay = 0.35;
        const sustain = velocity * 0.45;
        const release = Math.max(0.6, duration * 0.8);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(velocity * 0.7, startTime + attack);
        gain.gain.exponentialRampToValueAtTime(sustain, startTime + attack + decay);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

        osc.connect(gain);
        gain.connect(targetGain);
        osc.start(startTime);
        osc.stop(startTime + duration + release + 0.05);
        this.activeNodes.push({ osc, gain, stopTime: startTime + duration + release + 0.05 });
        break;
      }

      case 'epiano': {
        // Smooth mellow Rhodes style sine
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const attack = 0.015;
        const release = Math.max(0.5, duration * 0.7);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(velocity * 0.65, startTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

        osc.connect(gain);
        gain.connect(targetGain);
        osc.start(startTime);
        osc.stop(startTime + duration + release + 0.05);
        this.activeNodes.push({ osc, gain, stopTime: startTime + duration + release + 0.05 });
        break;
      }

      case 'bell': {
        // Bright crystal chime with long ring
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(velocity * 0.6, startTime + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(0.8, duration * 1.6));

        osc.connect(gain);
        gain.connect(targetGain);
        osc.start(startTime);
        osc.stop(startTime + Math.max(0.8, duration * 1.6) + 0.05);
        this.activeNodes.push({ osc, gain });
        break;
      }

      case 'subbass': {
        // Deep warm foundation sine/triangle
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(velocity * 0.8, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.3);

        osc.connect(gain);
        gain.connect(targetGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.35);
        this.activeNodes.push({ osc, gain });
        break;
      }

      case 'chiptune': {
        // 8-bit retro square wave
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(velocity * 0.45, startTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(targetGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
        this.activeNodes.push({ osc, gain });
        break;
      }

      case 'pad': {
        // Slow attack ambient pad
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const attack = 0.8;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(velocity * 0.5, startTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 1.2);

        osc.connect(gain);
        gain.connect(targetGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 1.3);
        this.activeNodes.push({ osc, gain });
        break;
      }

      case 'tick': {
        // Clockwork mechanical tick
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(60, startTime + 0.04);

        gain.gain.setValueAtTime(velocity * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.05);

        osc.connect(gain);
        gain.connect(targetGain);
        osc.start(startTime);
        osc.stop(startTime + 0.06);
        this.activeNodes.push({ osc, gain });
        break;
      }
    }
  }

  private startLoop() {
    const ctx = this.getContext();
    if (!ctx) return;
    this.initAudioChain(ctx);

    const track = this.getCurrentTrack();
    const { totalBeats, events } = getTrackEvents(track.id);
    const beatSeconds = 60 / track.bpm;
    const loopDurationSeconds = totalBeats * beatSeconds;

    const scheduleWindow = () => {
      if (!this.isPlayingState || !this.ctx || !this.filterNode) return;

      const now = this.ctx.currentTime;
      const baseTime = now + 0.05;

      // Schedule all events in this loop cycle
      events.forEach(ev => {
        const eventStartTime = baseTime + ev.time * beatSeconds;
        const durationSec = ev.duration * beatSeconds;
        const freq = noteToFreq(ev.note);
        this.scheduleNote(this.ctx!, this.filterNode!, eventStartTime, durationSec, freq, ev.instrument, ev.velocity);
      });

      // Schedule next loop cycle
      const timeoutMs = Math.max(1000, (loopDurationSeconds - 0.2) * 1000);
      this.loopTimer = window.setTimeout(scheduleWindow, timeoutMs);
    };

    scheduleWindow();
  }
}

export const bgmSystem = new BgmEngine();
