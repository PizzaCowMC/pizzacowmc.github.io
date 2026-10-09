// 建築工地:地圖左側的 5 塊施工用地,每一塊都是獨立的 10×10 畫布,
// 並且有各自獨特的外觀、主題色與藍圖提示。

export type BuildingLotId = 'cabin' | 'castle' | 'lighthouse' | 'windmill' | 'temple';

export interface BuildingLot {
  id: BuildingLotId;
  emoji: string;
  nameZh: string;
  nameEn: string;
  taglineZh: string;
  taglineEn: string;
  /** 主題色 (邊框、按鈕、進度條) */
  accent: string;
  accentDark: string;
  /** 卡片 / 畫布背景的漸層 */
  bgFrom: string;
  bgTo: string;
  /** 建造畫布的天空背景 */
  skyFrom: string;
  skyTo: string;
  /** 藍圖提示中「屋頂」的顏色 */
  roofTint: string;
  /**
   * 10 行 × 10 字元的藍圖提示 (空格子上顯示淡淡的色塊,不會消耗任何方塊):
   * # 牆面  R 屋頂  W 窗戶  D 門  F 旗幟/裝飾  G 地基  . 留白
   */
  guide: string[];
}

export const BUILDING_LOTS: BuildingLot[] = [
  {
    id: 'cabin',
    emoji: '🏠',
    nameZh: '森林小木屋',
    nameEn: 'Forest Cabin',
    taglineZh: '紅屋頂、小煙囪的溫馨木屋',
    taglineEn: 'A cozy red-roofed log cabin',
    accent: '#d97706',
    accentDark: '#78350f',
    bgFrom: '#3b2a1a',
    bgTo: '#1f1710',
    skyFrom: '#7dd3fc',
    skyTo: '#dcfce7',
    roofTint: 'rgba(220,38,38,0.38)',
    guide: [
      '....RR....',
      '...RRRR...',
      '..RRRRRR..',
      '.RRRRRRRR.',
      '..######..',
      '..#W##W#..',
      '..######..',
      '..##DD##..',
      '..##DD##..',
      'GGGGGGGGGG'
    ]
  },
  {
    id: 'castle',
    emoji: '🏰',
    nameZh: '石磚城堡',
    nameEn: 'Stone Castle',
    taglineZh: '雙塔、垛口與厚重城門',
    taglineEn: 'Twin towers, battlements and a heavy gate',
    accent: '#94a3b8',
    accentDark: '#334155',
    bgFrom: '#272b33',
    bgTo: '#14161b',
    skyFrom: '#a5b4fc',
    skyTo: '#e0e7ff',
    roofTint: 'rgba(148,163,184,0.45)',
    guide: [
      '#.#.FF.#.#',
      '###.##.###',
      '##########',
      '#W#WWWW#W#',
      '##########',
      '##########',
      '####DD####',
      '###DDDD###',
      '###DDDD###',
      'GGGGGGGGGG'
    ]
  },
  {
    id: 'lighthouse',
    emoji: '🗼',
    nameZh: '海風燈塔',
    nameEn: 'Seaside Lighthouse',
    taglineZh: '紅白條紋,為礦工指引方向',
    taglineEn: 'Red-and-white stripes guiding miners home',
    accent: '#ef4444',
    accentDark: '#7f1d1d',
    bgFrom: '#13303d',
    bgTo: '#0a1a22',
    skyFrom: '#38bdf8',
    skyTo: '#e0f2fe',
    roofTint: 'rgba(239,68,68,0.42)',
    guide: [
      '....RR....',
      '...RRRR...',
      '...FWWF...',
      '...####...',
      '...#WW#...',
      '..######..',
      '..######..',
      '..##DD##..',
      '.########.',
      'GGGGGGGGGG'
    ]
  },
  {
    id: 'windmill',
    emoji: '🌾',
    nameZh: '麥田風車',
    nameEn: 'Wheat Windmill',
    taglineZh: '四片大風扇,慢慢轉呀轉',
    taglineEn: 'Four big sails turning slowly in the breeze',
    accent: '#eab308',
    accentDark: '#713f12',
    bgFrom: '#3a3216',
    bgTo: '#1d190a',
    skyFrom: '#fde68a',
    skyTo: '#fef9c3',
    roofTint: 'rgba(180,83,9,0.42)',
    guide: [
      '....RR....',
      '..FRRRRF..',
      'F..####..F',
      '.F.#WW#.F.',
      '..F####F..',
      '.F.####.F.',
      'F..####..F',
      '..##DD##..',
      '..######..',
      'GGGGGGGGGG'
    ]
  },
  {
    id: 'temple',
    emoji: '🏯',
    nameZh: '紅石神殿',
    nameEn: 'Redstone Pagoda',
    taglineZh: '三層飛簷、金色塔尖的東方神殿',
    taglineEn: 'A tiered pagoda crowned with a golden spire',
    accent: '#e11d48',
    accentDark: '#4c0519',
    bgFrom: '#3a1420',
    bgTo: '#1c0a10',
    skyFrom: '#c4b5fd',
    skyTo: '#fce7f3',
    roofTint: 'rgba(30,41,59,0.55)',
    guide: [
      '....FF....',
      '...RRRR...',
      '..RRRRRR..',
      '...#WW#...',
      '.RRRRRRRR.',
      '..#W##W#..',
      '..######..',
      'RRRRRRRRRR',
      '..##DD##..',
      'GGGGGGGGGG'
    ]
  }
];

export const BUILDING_LOT_IDS: BuildingLotId[] = BUILDING_LOTS.map(l => l.id);

export const getBuildingLot = (id: string): BuildingLot =>
  BUILDING_LOTS.find(l => l.id === id) || BUILDING_LOTS[0];

export const GRID_SIZE = 100;

export const makeEmptyGrid = (): (string | null)[] => Array(GRID_SIZE).fill(null);

export const makeEmptyLotGrids = (): Record<string, (string | null)[]> => {
  const out: Record<string, (string | null)[]> = {};
  BUILDING_LOTS.forEach(l => {
    out[l.id] = makeEmptyGrid();
  });
  return out;
};

/** 把存檔裡讀到的資料整理成「每塊工地一個長度 100 的格子陣列」 */
export const normalizeLotGrids = (raw: unknown): Record<string, (string | null)[]> => {
  const out = makeEmptyLotGrids();
  if (raw && typeof raw === 'object') {
    BUILDING_LOTS.forEach(l => {
      const g = (raw as Record<string, unknown>)[l.id];
      if (Array.isArray(g) && g.length === GRID_SIZE) {
        out[l.id] = g as (string | null)[];
      }
    });
  }
  return out;
};

export const countPlaced = (grid: (string | null)[] | undefined): number =>
  grid ? grid.filter(c => c !== null).length : 0;

/** 藍圖提示的圖例 */
export const GUIDE_LEGEND: Record<string, { zh: string; en: string; tint: string }> = {
  '#': { zh: '牆面', en: 'Wall', tint: 'rgba(226,232,240,0.16)' },
  R: { zh: '屋頂', en: 'Roof', tint: '' }, // 依各建築 roofTint
  W: { zh: '窗戶', en: 'Window', tint: 'rgba(103,232,249,0.34)' },
  D: { zh: '門', en: 'Door', tint: 'rgba(180,110,60,0.42)' },
  F: { zh: '裝飾', en: 'Accent', tint: 'rgba(250,204,21,0.38)' },
  G: { zh: '地基', en: 'Base', tint: 'rgba(34,197,94,0.24)' }
};

/** 離開施工畫面時,玩家回到工地主幹道上、對應工地前方的位置 (地圖百分比) */
export const LOT_SPAWN_POS: Record<BuildingLotId, { x: number; y: number }> = {
  cabin: { x: 17, y: 47 },
  castle: { x: 49, y: 47 },
  lighthouse: { x: 81, y: 47 },
  windmill: { x: 17, y: 47 },
  temple: { x: 49, y: 47 }
};
