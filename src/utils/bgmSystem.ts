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
  isTheme?: boolean;
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
    descZh: '官方遊戲主題曲：精巧的馬林巴木琴琶音與紅石齒輪機械跳動，如紅石電梯塔與咖啡廳運轉般充滿秩序與生機。玩家遊玩時自動奏響！',
    discColor: '#eab308',
    ringColor: '#ca8a04',
    discLabel: 'THEME',
    bpm: 96,
    isTheme: true
  },
  {
    id: 'starlight_cafe',
    nameEn: 'Starlight Cafe (Cozy Piano & Lo-Fi Lounge)',
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
  },
  {
    id: 'subterranean_echoes',
    nameEn: 'Subterranean Echoes (Deepslate & Amethyst)',
    nameZh: '深板岩幽谷・水晶洞窟回響 (地下採礦)',
    discName: 'Music Disc Otherside - Amethyst Echo',
    composer: 'Deepslate Caverns',
    descEn: 'Atmospheric mining rhythm with deep resonant subbass, echoing mineral water droplets, and mystical amethyst crystal bells.',
    descZh: '深入地底岩層的採礦空靈旋律：深邃的重低音共鳴、如水晶洞窟水滴般清脆的晶洞泛音與神祕礦脈琴聲。',
    discColor: '#a855f7',
    ringColor: '#7e22ce',
    discLabel: 'MINES',
    bpm: 74,
    suitableArea: 'quarry'
  },
  {
    id: 'minecraft_dawn',
    nameEn: 'Minecraft Dawn (Peaceful Overworld & Piano)',
    nameZh: '黎明方塊・晨曦旅程 (經典悠揚抒情)',
    discName: 'Music Disc Mellohi - Morning Dew',
    composer: 'Overworld Wilderness',
    descEn: 'Authentic C418-inspired melancholic piano chords, soft warm Rhodes wash, and peaceful morning exploration melodies.',
    descZh: '致敬 C418 經典空靈感傷鋼琴：晨霧初開的草原、微風掠過的方塊世界與寧靜溫暖的和弦。',
    discColor: '#22c55e',
    ringColor: '#15803d',
    discLabel: 'DAWN',
    bpm: 68,
    suitableArea: 'overworld'
  },
  {
    id: 'celestial_sky',
    nameEn: 'Celestial Heights (Sky Island Starlight Flight)',
    nameZh: '浮空之境・星空島嶼漫步 (天界雲海)',
    discName: 'Music Disc Relic - Sky Sanctuary',
    composer: 'Celestial Skyrealm',
    descEn: 'Dreamy floating arpeggios, shimmering cosmic chime bells, and uplifting ethereal pads high above the clouds.',
    descZh: '空島專屬天界神曲：高懸於雲海之上的璀璨星光鐘鳴、如羽毛般輕盈的琶音與浩瀚宇宙光輝。',
    discColor: '#f43f5e',
    ringColor: '#be123c',
    discLabel: 'SKY',
    bpm: 92
  },
  {
    id: 'festive_village',
    nameEn: 'Village Jubilee (Music Box & Minuet)',
    nameZh: '村莊慶典・快樂八音盒小步舞曲 (節慶小調)',
    discName: 'Music Disc Blocks - Village Fair',
    composer: 'Emerald Village Festival',
    descEn: 'Joyful music box bells and playful chiptune dance steps celebrating harvest days, promotions, and friendly gatherings.',
    descZh: '歡樂無比的慶典圓舞曲：叮咚作響的發條八音盒與輕快跳躍的音階，充滿慶祝豐收與晉級的喜悅。',
    discColor: '#f97316',
    ringColor: '#c2410c',
    discLabel: 'FEST',
    bpm: 114
  },
  {
    id: 'steampunk_factory',
    nameEn: 'Industrial Assembly (Redstone Foundry & Cogs)',
    nameZh: '齒輪巨構・紅石自動化工廠 (蒸氣引擎)',
    discName: 'Music Disc Far - Redstone Forge',
    composer: 'Clockwork Automation Guild',
    descEn: 'High-energy rhythmic clockwork pulses, syncopated square bass, and driving industrial mechanical percussion for builders.',
    descZh: '充滿建設動能的重工業節奏：密集的紅石脈衝滴答、強勁的低音貝斯與蒸氣活塞推動感。',
    discColor: '#ef4444',
    ringColor: '#b91c1c',
    discLabel: 'FORGE',
    bpm: 108,
    suitableArea: 'building'
  }
];

interface NoteEvent {
  time: number; // in beats
  duration: number; // in beats
  note: string; // e.g. "C4"
  instrument: 'piano' | 'bell' | 'epiano' | 'subbass' | 'chiptune' | 'pad' | 'tick';
  velocity: number; // 0.0 to 1.0
}

// Musical score generator for BGM tracks
function getTrackEvents(trackId: string): { totalBeats: number; events: NoteEvent[] } {
  const events: NoteEvent[] = [];

  // Track 1: Redstone Clockwork (Official Theme Song) - 16 beats
  if (trackId === 'clockwork_steam') {
    for (let i = 0; i < 16; i++) {
      events.push({ time: i, duration: 0.08, note: i % 4 === 0 ? 'G3' : 'D4', instrument: 'tick', velocity: 0.25 });
      if (i % 2 === 1) {
        events.push({ time: i + 0.5, duration: 0.06, note: 'B3', instrument: 'tick', velocity: 0.16 });
      }
    }

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

    events.push({ time: 0, duration: 3.8, note: 'B3', instrument: 'epiano', velocity: 0.22 });
    events.push({ time: 4, duration: 3.8, note: 'C4', instrument: 'epiano', velocity: 0.22 });
    events.push({ time: 8, duration: 3.8, note: 'G3', instrument: 'epiano', velocity: 0.22 });
    events.push({ time: 12, duration: 3.8, note: 'A3', instrument: 'epiano', velocity: 0.22 });

    events.push({ time: 0, duration: 3.5, note: 'G2', instrument: 'subbass', velocity: 0.42 });
    events.push({ time: 4, duration: 3.5, note: 'C2', instrument: 'subbass', velocity: 0.42 });
    events.push({ time: 8, duration: 3.5, note: 'E2', instrument: 'subbass', velocity: 0.42 });
    events.push({ time: 12, duration: 3.5, note: 'D2', instrument: 'subbass', velocity: 0.42 });

    return { totalBeats: 16, events };
  }

  // Track 2: Starlight Cafe (Cozy Lo-Fi Lounge) - 16 beats
  if (trackId === 'starlight_cafe') {
    for (let i = 0; i < 16; i++) {
      events.push({ time: i, duration: 0.07, note: i % 2 === 0 ? 'F3' : 'C4', instrument: 'tick', velocity: 0.18 });
      if (i % 2 === 1) {
        events.push({ time: i + 0.66, duration: 0.05, note: 'G3', instrument: 'tick', velocity: 0.12 });
      }
    }

    // Warm Rhodes electric piano chords (Cmaj7 -> Am7 -> Dm7 -> G7)
    events.push({ time: 0, duration: 3.6, note: 'C4', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 0, duration: 3.6, note: 'E4', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 0, duration: 3.6, note: 'G4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 0, duration: 3.6, note: 'B4', instrument: 'epiano', velocity: 0.25 });

    events.push({ time: 4, duration: 3.6, note: 'A3', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 4, duration: 3.6, note: 'C4', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 4, duration: 3.6, note: 'E4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 4, duration: 3.6, note: 'G4', instrument: 'epiano', velocity: 0.25 });

    events.push({ time: 8, duration: 3.6, note: 'D4', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 8, duration: 3.6, note: 'F4', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 8, duration: 3.6, note: 'A4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 8, duration: 3.6, note: 'C5', instrument: 'epiano', velocity: 0.25 });

    events.push({ time: 12, duration: 3.6, note: 'G3', instrument: 'epiano', velocity: 0.28 });
    events.push({ time: 12, duration: 3.6, note: 'B3', instrument: 'epiano', velocity: 0.26 });
    events.push({ time: 12, duration: 3.6, note: 'D4', instrument: 'epiano', velocity: 0.24 });
    events.push({ time: 12, duration: 3.6, note: 'F4', instrument: 'epiano', velocity: 0.25 });

    const melody = [
      { t: 0.5, n: 'E5' }, { t: 1.5, n: 'D5' }, { t: 2.0, n: 'C5' }, { t: 3.0, n: 'G4' },
      { t: 4.5, n: 'C5' }, { t: 5.5, n: 'B4' }, { t: 6.0, n: 'A4' }, { t: 7.0, n: 'E4' },
      { t: 8.5, n: 'F4' }, { t: 9.0, n: 'A4' }, { t: 9.5, n: 'C5' }, { t: 10.5, n: 'E5' }, { t: 11.0, n: 'D5' },
      { t: 12.5, n: 'B4' }, { t: 13.5, n: 'A4' }, { t: 14.0, n: 'G4' }, { t: 15.0, n: 'D4' }
    ];
    melody.forEach(m => {
      events.push({ time: m.t, duration: 0.75, note: m.n, instrument: 'piano', velocity: 0.35 });
      if (m.t % 2 === 0.5) {
        events.push({ time: m.t, duration: 0.6, note: m.n, instrument: 'bell', velocity: 0.22 });
      }
    });

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

  // Track 3: Subterranean Echoes (Deepslate & Amethyst) - 16 beats
  if (trackId === 'subterranean_echoes') {
    // Mineral cavern dripping sound & muffled echo clicks
    for (let i = 0; i < 16; i += 2) {
      events.push({ time: i, duration: 0.05, note: 'A2', instrument: 'tick', velocity: 0.16 });
      if (i % 4 === 2) {
        events.push({ time: i + 0.75, duration: 0.04, note: 'E3', instrument: 'tick', velocity: 0.12 });
      }
    }

    // Low resonant subbass drones (D2 -> F2 -> Bb1 -> A1)
    events.push({ time: 0, duration: 3.8, note: 'D2', instrument: 'subbass', velocity: 0.45 });
    events.push({ time: 4, duration: 3.8, note: 'F2', instrument: 'subbass', velocity: 0.42 });
    events.push({ time: 8, duration: 3.8, note: 'Bb1', instrument: 'subbass', velocity: 0.45 });
    events.push({ time: 12, duration: 3.8, note: 'A1', instrument: 'subbass', velocity: 0.42 });

    // Ambient cavern pads
    events.push({ time: 0, duration: 3.9, note: 'D3', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 0, duration: 3.9, note: 'A3', instrument: 'pad', velocity: 0.25 });
    events.push({ time: 4, duration: 3.9, note: 'F3', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 4, duration: 3.9, note: 'C4', instrument: 'pad', velocity: 0.25 });
    events.push({ time: 8, duration: 3.9, note: 'Bb3', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 8, duration: 3.9, note: 'D4', instrument: 'pad', velocity: 0.25 });
    events.push({ time: 12, duration: 3.9, note: 'A3', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 12, duration: 3.9, note: 'C#4', instrument: 'pad', velocity: 0.25 });

    // Shimmering Amethyst Crystal Bells
    const crystalMelody = [
      { t: 0.5, n: 'D5' }, { t: 1.5, n: 'F5' }, { t: 2.0, n: 'A5' }, { t: 3.5, n: 'G5' },
      { t: 4.5, n: 'F5' }, { t: 5.5, n: 'E5' }, { t: 6.0, n: 'D5' }, { t: 7.25, n: 'C5' },
      { t: 8.5, n: 'Bb4' }, { t: 9.5, n: 'D5' }, { t: 10.5, n: 'F5' }, { t: 11.5, n: 'E5' },
      { t: 12.5, n: 'C#5' }, { t: 13.5, n: 'E5' }, { t: 14.5, n: 'D5' }
    ];
    crystalMelody.forEach(m => {
      events.push({ time: m.t, duration: 0.8, note: m.n, instrument: 'bell', velocity: 0.35 });
      events.push({ time: m.t + 0.33, duration: 0.4, note: m.n, instrument: 'epiano', velocity: 0.18 });
    });

    return { totalBeats: 16, events };
  }

  // Track 4: Minecraft Dawn (Peaceful Overworld & Piano) - 16 beats
  if (trackId === 'minecraft_dawn') {
    // Soft morning breeze pad
    events.push({ time: 0, duration: 7.8, note: 'F3', instrument: 'pad', velocity: 0.22 });
    events.push({ time: 0, duration: 7.8, note: 'C4', instrument: 'pad', velocity: 0.20 });
    events.push({ time: 8, duration: 7.8, note: 'D3', instrument: 'pad', velocity: 0.22 });
    events.push({ time: 8, duration: 7.8, note: 'A3', instrument: 'pad', velocity: 0.20 });

    // Nostalgic C418-inspired piano chords (Fmaj7 -> Bbmaj7 -> Dm9 -> C)
    events.push({ time: 0, duration: 3.6, note: 'F3', instrument: 'piano', velocity: 0.32 });
    events.push({ time: 0, duration: 3.6, note: 'A3', instrument: 'piano', velocity: 0.28 });
    events.push({ time: 0, duration: 3.6, note: 'C4', instrument: 'piano', velocity: 0.26 });
    events.push({ time: 0, duration: 3.6, note: 'E4', instrument: 'piano', velocity: 0.24 });

    events.push({ time: 4, duration: 3.6, note: 'Bb3', instrument: 'piano', velocity: 0.32 });
    events.push({ time: 4, duration: 3.6, note: 'D4', instrument: 'piano', velocity: 0.28 });
    events.push({ time: 4, duration: 3.6, note: 'F4', instrument: 'piano', velocity: 0.26 });
    events.push({ time: 4, duration: 3.6, note: 'A4', instrument: 'piano', velocity: 0.24 });

    events.push({ time: 8, duration: 3.6, note: 'D3', instrument: 'piano', velocity: 0.32 });
    events.push({ time: 8, duration: 3.6, note: 'F3', instrument: 'piano', velocity: 0.28 });
    events.push({ time: 8, duration: 3.6, note: 'A3', instrument: 'piano', velocity: 0.26 });
    events.push({ time: 8, duration: 3.6, note: 'C4', instrument: 'piano', velocity: 0.24 });

    events.push({ time: 12, duration: 3.6, note: 'C3', instrument: 'piano', velocity: 0.32 });
    events.push({ time: 12, duration: 3.6, note: 'E3', instrument: 'piano', velocity: 0.28 });
    events.push({ time: 12, duration: 3.6, note: 'G3', instrument: 'piano', velocity: 0.26 });
    events.push({ time: 12, duration: 3.6, note: 'B3', instrument: 'piano', velocity: 0.24 });

    // Melodic contemplative piano lead
    const dawnMelody = [
      { t: 0.5, n: 'C5' }, { t: 2.0, n: 'E5' }, { t: 3.0, n: 'G5' },
      { t: 4.5, n: 'F5' }, { t: 6.0, n: 'D5' }, { t: 7.0, n: 'A4' },
      { t: 8.5, n: 'F4' }, { t: 9.5, n: 'G4' }, { t: 10.5, n: 'C5' },
      { t: 12.0, n: 'D5' }, { t: 13.5, n: 'C5' }, { t: 15.0, n: 'A4' }
    ];
    dawnMelody.forEach(m => {
      events.push({ time: m.t, duration: 1.1, note: m.n, instrument: 'piano', velocity: 0.40 });
      if (m.t === 0.5 || m.t === 4.5 || m.t === 8.5 || m.t === 12.0) {
        events.push({ time: m.t, duration: 0.8, note: m.n, instrument: 'bell', velocity: 0.20 });
      }
    });

    // Warm grounded subbass
    events.push({ time: 0, duration: 3.8, note: 'F2', instrument: 'subbass', velocity: 0.36 });
    events.push({ time: 4, duration: 3.8, note: 'Bb1', instrument: 'subbass', velocity: 0.36 });
    events.push({ time: 8, duration: 3.8, note: 'D2', instrument: 'subbass', velocity: 0.36 });
    events.push({ time: 12, duration: 3.8, note: 'C2', instrument: 'subbass', velocity: 0.36 });

    return { totalBeats: 16, events };
  }

  // Track 5: Celestial Heights (Sky Island Starlight Flight) - 16 beats
  if (trackId === 'celestial_sky') {
    // Ethereal cosmic pads (Gmaj7 -> Em7 -> Cmaj7 -> Dadd9)
    events.push({ time: 0, duration: 3.8, note: 'G3', instrument: 'pad', velocity: 0.32 });
    events.push({ time: 0, duration: 3.8, note: 'B3', instrument: 'pad', velocity: 0.30 });
    events.push({ time: 0, duration: 3.8, note: 'D4', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 0, duration: 3.8, note: 'F#4', instrument: 'pad', velocity: 0.26 });

    events.push({ time: 4, duration: 3.8, note: 'E3', instrument: 'pad', velocity: 0.32 });
    events.push({ time: 4, duration: 3.8, note: 'G3', instrument: 'pad', velocity: 0.30 });
    events.push({ time: 4, duration: 3.8, note: 'B3', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 4, duration: 3.8, note: 'D4', instrument: 'pad', velocity: 0.26 });

    events.push({ time: 8, duration: 3.8, note: 'C3', instrument: 'pad', velocity: 0.32 });
    events.push({ time: 8, duration: 3.8, note: 'E3', instrument: 'pad', velocity: 0.30 });
    events.push({ time: 8, duration: 3.8, note: 'G3', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 8, duration: 3.8, note: 'B3', instrument: 'pad', velocity: 0.26 });

    events.push({ time: 12, duration: 3.8, note: 'D3', instrument: 'pad', velocity: 0.32 });
    events.push({ time: 12, duration: 3.8, note: 'F#3', instrument: 'pad', velocity: 0.30 });
    events.push({ time: 12, duration: 3.8, note: 'A3', instrument: 'pad', velocity: 0.28 });
    events.push({ time: 12, duration: 3.8, note: 'E4', instrument: 'pad', velocity: 0.26 });

    // Floating Starlight Arpeggio Chimes
    const arpNotes = [
      'G4', 'B4', 'D5', 'G5', 'F#5', 'D5', 'B4', 'G4',
      'E4', 'G4', 'B4', 'E5', 'D5', 'B4', 'G4', 'E4',
      'C4', 'E4', 'G4', 'C5', 'B4', 'G4', 'E4', 'C4',
      'D4', 'F#4', 'A4', 'D5', 'E5', 'D5', 'A4', 'F#4'
    ];
    arpNotes.forEach((n, idx) => {
      events.push({ time: idx * 0.5, duration: 0.45, note: n, instrument: 'bell', velocity: 0.30 });
      if (idx % 4 === 0) {
        events.push({ time: idx * 0.5, duration: 0.8, note: n, instrument: 'epiano', velocity: 0.22 });
      }
    });

    // Deep cosmic floating subbass
    events.push({ time: 0, duration: 3.5, note: 'G2', instrument: 'subbass', velocity: 0.40 });
    events.push({ time: 4, duration: 3.5, note: 'E2', instrument: 'subbass', velocity: 0.40 });
    events.push({ time: 8, duration: 3.5, note: 'C2', instrument: 'subbass', velocity: 0.40 });
    events.push({ time: 12, duration: 3.5, note: 'D2', instrument: 'subbass', velocity: 0.40 });

    return { totalBeats: 16, events };
  }

  // Track 6: Village Jubilee (Music Box & Minuet) - 16 beats
  if (trackId === 'festive_village') {
    // Cheerful percussion ticks
    for (let i = 0; i < 16; i++) {
      events.push({ time: i, duration: 0.05, note: 'C4', instrument: 'tick', velocity: i % 2 === 0 ? 0.22 : 0.15 });
    }

    // Bouncing festival bassline (C3 -> G2 -> A2 -> F2)
    for (let i = 0; i < 16; i += 4) {
      const root = i === 0 ? 'C3' : i === 4 ? 'G2' : i === 8 ? 'A2' : 'F2';
      const fifth = i === 0 ? 'G2' : i === 4 ? 'D2' : i === 8 ? 'E2' : 'C2';
      events.push({ time: i, duration: 0.4, note: root, instrument: 'subbass', velocity: 0.42 });
      events.push({ time: i + 1, duration: 0.3, note: fifth, instrument: 'subbass', velocity: 0.35 });
      events.push({ time: i + 2, duration: 0.4, note: root, instrument: 'subbass', velocity: 0.40 });
      events.push({ time: i + 3, duration: 0.3, note: fifth, instrument: 'subbass', velocity: 0.35 });
    }

    // Music Box Bells & Chiptune Minuet
    const festiveMelody = [
      { t: 0, n: 'C5' }, { t: 0.5, n: 'D5' }, { t: 1.0, n: 'E5' }, { t: 1.5, n: 'G5' },
      { t: 2.0, n: 'E5' }, { t: 2.5, n: 'D5' }, { t: 3.0, n: 'C5' }, { t: 3.5, n: 'E5' },
      { t: 4.0, n: 'D5' }, { t: 4.5, n: 'B4' }, { t: 5.0, n: 'G4' }, { t: 5.5, n: 'B4' },
      { t: 6.0, n: 'D5' }, { t: 6.5, n: 'F5' }, { t: 7.0, n: 'E5' }, { t: 7.5, n: 'D5' },
      { t: 8.0, n: 'E5' }, { t: 8.5, n: 'A4' }, { t: 9.0, n: 'C5' }, { t: 9.5, n: 'E5' },
      { t: 10.0, n: 'A5' }, { t: 10.5, n: 'G5' }, { t: 11.0, n: 'E5' }, { t: 11.5, n: 'C5' },
      { t: 12.0, n: 'F5' }, { t: 12.5, n: 'E5' }, { t: 13.0, n: 'D5' }, { t: 13.5, n: 'C5' },
      { t: 14.0, n: 'D5' }, { t: 14.5, n: 'E5' }, { t: 15.0, n: 'C5' }, { t: 15.5, n: 'G4' }
    ];
    festiveMelody.forEach(m => {
      events.push({ time: m.t, duration: 0.35, note: m.n, instrument: 'bell', velocity: 0.38 });
      if (m.t % 1 === 0) {
        events.push({ time: m.t, duration: 0.3, note: m.n, instrument: 'chiptune', velocity: 0.20 });
      }
    });

    return { totalBeats: 16, events };
  }

  // Track 7: Industrial Assembly (Redstone Foundry & Cogs) - 16 beats
  if (trackId === 'steampunk_factory') {
    // Fast mechanical piston ticks (16th notes syncopation)
    for (let i = 0; i < 16; i++) {
      events.push({ time: i, duration: 0.04, note: 'E3', instrument: 'tick', velocity: 0.28 });
      events.push({ time: i + 0.25, duration: 0.03, note: 'B3', instrument: 'tick', velocity: 0.14 });
      events.push({ time: i + 0.5, duration: 0.04, note: 'G3', instrument: 'tick', velocity: 0.20 });
      events.push({ time: i + 0.75, duration: 0.03, note: 'E4', instrument: 'tick', velocity: 0.16 });
    }

    // Heavy Industrial Bassline (E minor)
    for (let i = 0; i < 16; i += 2) {
      const bNote = i < 8 ? 'E2' : i < 12 ? 'C2' : 'D2';
      events.push({ time: i, duration: 0.35, note: bNote, instrument: 'chiptune', velocity: 0.42 });
      events.push({ time: i + 0.75, duration: 0.25, note: bNote, instrument: 'chiptune', velocity: 0.35 });
      events.push({ time: i + 1.25, duration: 0.3, note: bNote, instrument: 'subbass', velocity: 0.45 });
    }

    // Foundry Marimba & Brass Lead
    const factoryMelody = [
      { t: 0, n: 'E4' }, { t: 0.5, n: 'G4' }, { t: 1.0, n: 'B4' }, { t: 1.5, n: 'E5' },
      { t: 2.0, n: 'D5' }, { t: 2.5, n: 'B4' }, { t: 3.0, n: 'G4' }, { t: 3.5, n: 'F#4' },
      { t: 4.0, n: 'E4' }, { t: 4.5, n: 'B4' }, { t: 5.0, n: 'G4' }, { t: 5.5, n: 'B4' },
      { t: 6.0, n: 'D5' }, { t: 6.5, n: 'E5' }, { t: 7.0, n: 'B4' }, { t: 7.5, n: 'G4' },
      { t: 8.0, n: 'C4' }, { t: 8.5, n: 'E4' }, { t: 9.0, n: 'G4' }, { t: 9.5, n: 'C5' },
      { t: 10.0, n: 'B4' }, { t: 10.5, n: 'G4' }, { t: 11.0, n: 'E4' }, { t: 11.5, n: 'D4' },
      { t: 12.0, n: 'D4' }, { t: 12.5, n: 'F#4' }, { t: 13.0, n: 'A4' }, { t: 13.5, n: 'D5' },
      { t: 14.0, n: 'B4' }, { t: 14.5, n: 'A4' }, { t: 15.0, n: 'F#4' }, { t: 15.5, n: 'D4' }
    ];
    factoryMelody.forEach(m => {
      events.push({ time: m.t, duration: 0.32, note: m.n, instrument: 'bell', velocity: 0.40 });
      events.push({ time: m.t, duration: 0.25, note: m.n, instrument: 'chiptune', velocity: 0.22 });
    });

    return { totalBeats: 16, events };
  }

  // Fallback to clockwork theme
  return getTrackEvents('clockwork_steam');
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
  private autoAreaMode: boolean = false; // Default to false so theme song is NOT overridden
  private userMuted: boolean = false;
  private autoPlaySetupDone: boolean = false;

  private activeNodes: { osc?: OscillatorNode; gain?: GainNode; stopTime?: number }[] = [];
  private loopTimer: number | null = null;
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
      const savedMute = localStorage.getItem('minecraft_bgm_muted');
      if (savedMute === 'true') {
        this.userMuted = true;
      }
    } catch {}

    this.setupAutoPlayOnFirstAction();
  }

  public getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
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
      this.filterNode.connect(this.masterGain);
      this.filterNode.connect(this.delayNode);
      this.delayGain.connect(this.masterGain);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(ctx.destination);
    }
  }

  /**
   * Automatically play the official theme song when the user takes their first action in the game.
   * Complies with all browser Autoplay policies (unlocks AudioContext on user gesture).
   */
  public setupAutoPlayOnFirstAction() {
    if (typeof window === 'undefined' || this.autoPlaySetupDone) return;
    this.autoPlaySetupDone = true;

    const onUserGesture = () => {
      if (this.userMuted) {
        cleanup();
        return;
      }

      if (!this.isPlayingState) {
        const ctx = this.getContext();
        if (ctx) {
          ctx.resume().then(() => {
            if (!this.isPlayingState && !this.userMuted) {
              // Play theme song as requested: "讓主題曲自動於玩家玩的時候播放"
              this.playTrack(this.currentTrackId || 'clockwork_steam');
            }
          }).catch(() => {
            if (!this.isPlayingState && !this.userMuted) {
              this.playTrack(this.currentTrackId || 'clockwork_steam');
            }
          });
        }
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', onUserGesture);
      window.removeEventListener('click', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
    };

    window.addEventListener('pointerdown', onUserGesture, { once: true, passive: true });
    window.addEventListener('click', onUserGesture, { once: true, passive: true });
    window.addEventListener('keydown', onUserGesture, { once: true, passive: true });
    window.addEventListener('touchstart', onUserGesture, { once: true, passive: true });
  }

  /**
   * Explicit hook to auto-trigger the theme song on game actions
   */
  public triggerPlayIfIdle() {
    if (this.isPlayingState || this.userMuted) return;
    const ctx = this.getContext();
    if (ctx) {
      ctx.resume().then(() => {
        if (!this.isPlayingState && !this.userMuted) {
          this.playTrack(this.currentTrackId || 'clockwork_steam');
        }
      }).catch(() => {});
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

  public isMuted(): boolean {
    return this.userMuted;
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

    this.userMuted = false;
    try {
      localStorage.removeItem('minecraft_bgm_muted');
    } catch {}

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
    this.userMuted = true;
    try {
      localStorage.setItem('minecraft_bgm_muted', 'true');
    } catch {}
    this.stopCurrentLoop();
    this.isPlayingState = false;
    this.notify();
  }

  public resume() {
    this.userMuted = false;
    try {
      localStorage.removeItem('minecraft_bgm_muted');
    } catch {}
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

  // Adaptive area detection: switch track when entering new zones ONLY if autoAreaMode is active
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
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
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
