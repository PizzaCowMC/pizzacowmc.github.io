import { StarRank, CafeFloorId, CafeFacility } from '../types';

export interface StarRankInfo {
  rank: StarRank;
  grade: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  sub: 1 | 2 | 3;
  upgradeCost: number; // Cost to upgrade to this rank
  sellPriceBonusPct: number; // +X% dish sell price
  tipMultiplierBonus: number; // +X tip multiplier
  patienceBonusSec: number; // +X seconds patience
  passiveCoinsPerInterval: number; // Coins earned every 3 seconds while visiting cafe
  colorClass: string;
  badgeBg: string;
  badgeBorder: string;
  titleZh: string;
  titleEn: string;
}

export const STAR_RANKS_ORDER: StarRank[] = [
  'F1', 'F2', 'F3',
  'E1', 'E2', 'E3',
  'D1', 'D2', 'D3',
  'C1', 'C2', 'C3',
  'B1', 'B2', 'B3',
  'A1', 'A2', 'A3',
  'S1', 'S2', 'S3'
];

export const STAR_RANKS: Record<StarRank, StarRankInfo> = {
  F1: {
    rank: 'F1',
    grade: 'F',
    sub: 1,
    upgradeCost: 0,
    sellPriceBonusPct: 0,
    tipMultiplierBonus: 0,
    patienceBonusSec: 0,
    passiveCoinsPerInterval: 1,
    colorClass: 'text-zinc-400',
    badgeBg: 'bg-zinc-800/90',
    badgeBorder: 'border-zinc-600',
    titleZh: '初心設施 I',
    titleEn: 'Rustic Base I'
  },
  F2: {
    rank: 'F2',
    grade: 'F',
    sub: 2,
    upgradeCost: 150,
    sellPriceBonusPct: 3,
    tipMultiplierBonus: 0.05,
    patienceBonusSec: 2,
    passiveCoinsPerInterval: 2,
    colorClass: 'text-zinc-300',
    badgeBg: 'bg-zinc-800/90',
    badgeBorder: 'border-zinc-500',
    titleZh: '初心設施 II',
    titleEn: 'Rustic Base II'
  },
  F3: {
    rank: 'F3',
    grade: 'F',
    sub: 3,
    upgradeCost: 350,
    sellPriceBonusPct: 6,
    tipMultiplierBonus: 0.1,
    patienceBonusSec: 4,
    passiveCoinsPerInterval: 3,
    colorClass: 'text-zinc-200',
    badgeBg: 'bg-zinc-800/90',
    badgeBorder: 'border-zinc-400',
    titleZh: '初心設施 III',
    titleEn: 'Rustic Base III'
  },
  E1: {
    rank: 'E1',
    grade: 'E',
    sub: 1,
    upgradeCost: 800,
    sellPriceBonusPct: 10,
    tipMultiplierBonus: 0.15,
    patienceBonusSec: 6,
    passiveCoinsPerInterval: 5,
    colorClass: 'text-amber-700',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-800',
    titleZh: '原木工藝 I',
    titleEn: 'Oak Crafted I'
  },
  E2: {
    rank: 'E2',
    grade: 'E',
    sub: 2,
    upgradeCost: 1600,
    sellPriceBonusPct: 14,
    tipMultiplierBonus: 0.2,
    patienceBonusSec: 8,
    passiveCoinsPerInterval: 8,
    colorClass: 'text-amber-600',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-700',
    titleZh: '原木工藝 II',
    titleEn: 'Oak Crafted II'
  },
  E3: {
    rank: 'E3',
    grade: 'E',
    sub: 3,
    upgradeCost: 3000,
    sellPriceBonusPct: 18,
    tipMultiplierBonus: 0.25,
    patienceBonusSec: 10,
    passiveCoinsPerInterval: 12,
    colorClass: 'text-amber-500',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-600',
    titleZh: '原木工藝 III',
    titleEn: 'Oak Crafted III'
  },
  D1: {
    rank: 'D1',
    grade: 'D',
    sub: 1,
    upgradeCost: 5500,
    sellPriceBonusPct: 23,
    tipMultiplierBonus: 0.3,
    patienceBonusSec: 12,
    passiveCoinsPerInterval: 18,
    colorClass: 'text-emerald-500',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-700',
    titleZh: '綠意生機 I',
    titleEn: 'Verdant I'
  },
  D2: {
    rank: 'D2',
    grade: 'D',
    sub: 2,
    upgradeCost: 9500,
    sellPriceBonusPct: 28,
    tipMultiplierBonus: 0.35,
    patienceBonusSec: 14,
    passiveCoinsPerInterval: 25,
    colorClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-600',
    titleZh: '綠意生機 II',
    titleEn: 'Verdant II'
  },
  D3: {
    rank: 'D3',
    grade: 'D',
    sub: 3,
    upgradeCost: 15000,
    sellPriceBonusPct: 33,
    tipMultiplierBonus: 0.4,
    patienceBonusSec: 16,
    passiveCoinsPerInterval: 35,
    colorClass: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500',
    titleZh: '綠意生機 III',
    titleEn: 'Verdant III'
  },
  C1: {
    rank: 'C1',
    grade: 'C',
    sub: 1,
    upgradeCost: 24000,
    sellPriceBonusPct: 39,
    tipMultiplierBonus: 0.45,
    patienceBonusSec: 18,
    passiveCoinsPerInterval: 48,
    colorClass: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/80',
    badgeBorder: 'border-cyan-700',
    titleZh: '水凝結晶 I',
    titleEn: 'Glacial Prism I'
  },
  C2: {
    rank: 'C2',
    grade: 'C',
    sub: 2,
    upgradeCost: 38000,
    sellPriceBonusPct: 45,
    tipMultiplierBonus: 0.5,
    patienceBonusSec: 20,
    passiveCoinsPerInterval: 65,
    colorClass: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/80',
    badgeBorder: 'border-cyan-600',
    titleZh: '水凝結晶 II',
    titleEn: 'Glacial Prism II'
  },
  C3: {
    rank: 'C3',
    grade: 'C',
    sub: 3,
    upgradeCost: 60000,
    sellPriceBonusPct: 52,
    tipMultiplierBonus: 0.55,
    patienceBonusSec: 22,
    passiveCoinsPerInterval: 85,
    colorClass: 'text-cyan-200',
    badgeBg: 'bg-cyan-950/80',
    badgeBorder: 'border-cyan-500',
    titleZh: '水凝結晶 III',
    titleEn: 'Glacial Prism III'
  },
  B1: {
    rank: 'B1',
    grade: 'B',
    sub: 1,
    upgradeCost: 95000,
    sellPriceBonusPct: 60,
    tipMultiplierBonus: 0.65,
    patienceBonusSec: 25,
    passiveCoinsPerInterval: 120,
    colorClass: 'text-blue-400',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-600',
    titleZh: '深海青金 I',
    titleEn: 'Lapis Ocean I'
  },
  B2: {
    rank: 'B2',
    grade: 'B',
    sub: 2,
    upgradeCost: 150000,
    sellPriceBonusPct: 68,
    tipMultiplierBonus: 0.75,
    patienceBonusSec: 28,
    passiveCoinsPerInterval: 165,
    colorClass: 'text-blue-300',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-500',
    titleZh: '深海青金 II',
    titleEn: 'Lapis Ocean II'
  },
  B3: {
    rank: 'B3',
    grade: 'B',
    sub: 3,
    upgradeCost: 240000,
    sellPriceBonusPct: 77,
    tipMultiplierBonus: 0.85,
    patienceBonusSec: 32,
    passiveCoinsPerInterval: 220,
    colorClass: 'text-blue-200',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-400',
    titleZh: '深海青金 III',
    titleEn: 'Lapis Ocean III'
  },
  A1: {
    rank: 'A1',
    grade: 'A',
    sub: 1,
    upgradeCost: 380000,
    sellPriceBonusPct: 88,
    tipMultiplierBonus: 1.0,
    patienceBonusSec: 36,
    passiveCoinsPerInterval: 300,
    colorClass: 'text-purple-400',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-600',
    titleZh: '紫晶幻象 I',
    titleEn: 'Amethyst Aura I'
  },
  A2: {
    rank: 'A2',
    grade: 'A',
    sub: 2,
    upgradeCost: 600000,
    sellPriceBonusPct: 100,
    tipMultiplierBonus: 1.2,
    patienceBonusSec: 40,
    passiveCoinsPerInterval: 400,
    colorClass: 'text-purple-300',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-500',
    titleZh: '紫晶幻象 II',
    titleEn: 'Amethyst Aura II'
  },
  A3: {
    rank: 'A3',
    grade: 'A',
    sub: 3,
    upgradeCost: 950000,
    sellPriceBonusPct: 115,
    tipMultiplierBonus: 1.4,
    patienceBonusSec: 45,
    passiveCoinsPerInterval: 550,
    colorClass: 'text-purple-200',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-400',
    titleZh: '紫晶幻象 III',
    titleEn: 'Amethyst Aura III'
  },
  S1: {
    rank: 'S1',
    grade: 'S',
    sub: 1,
    upgradeCost: 1500000,
    sellPriceBonusPct: 135,
    tipMultiplierBonus: 1.7,
    patienceBonusSec: 52,
    passiveCoinsPerInterval: 750,
    colorClass: 'text-amber-300',
    badgeBg: 'bg-gradient-to-r from-amber-950 to-yellow-950',
    badgeBorder: 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]',
    titleZh: '傳奇神域 S1',
    titleEn: 'Mythic Apex S1'
  },
  S2: {
    rank: 'S2',
    grade: 'S',
    sub: 2,
    upgradeCost: 2500000,
    sellPriceBonusPct: 160,
    tipMultiplierBonus: 2.1,
    patienceBonusSec: 60,
    passiveCoinsPerInterval: 1050,
    colorClass: 'text-amber-200',
    badgeBg: 'bg-gradient-to-r from-amber-900 to-orange-950',
    badgeBorder: 'border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.6)]',
    titleZh: '傳奇神域 S2',
    titleEn: 'Mythic Apex S2'
  },
  S3: {
    rank: 'S3',
    grade: 'S',
    sub: 3,
    upgradeCost: 4000000,
    sellPriceBonusPct: 200,
    tipMultiplierBonus: 2.6,
    patienceBonusSec: 75,
    passiveCoinsPerInterval: 1500,
    colorClass: 'text-amber-100',
    badgeBg: 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400 text-black',
    badgeBorder: 'border-yellow-200 shadow-[0_0_22px_rgba(253,224,71,0.9)] animate-pulse',
    titleZh: '極致至尊 S3 (MAX)',
    titleEn: 'Cosmic Pinnacle S3 (MAX)'
  }
};

export interface FloorData {
  id: CafeFloorId;
  nameZh: string;
  nameEn: string;
  badgeZh: string;
  badgeEn: string;
  icon: string;
  themeColor: string;
  bgGradient: string;
  wallTexture: string;
  floorTexture: string;
  descZh: string;
  descEn: string;
}

export const CAFE_FLOORS: FloorData[] = [
  {
    id: '1F',
    nameZh: '1F: 經典咖啡大廳與研磨工坊',
    nameEn: '1F: Main Roastery & Espresso Hall',
    badgeZh: '1樓 大廳',
    badgeEn: '1F Hall',
    icon: '☕',
    themeColor: '#d97706',
    bgGradient: 'from-[#3c2a1a] via-[#261a10] to-[#170e08]',
    wallTexture: 'bg-[radial-gradient(#543310_1px,transparent_1px)] [background-size:16px_16px]',
    floorTexture: 'border-t-4 border-[#5c3a1e] bg-[#2e1d0f]',
    descZh: '以溫潤橡木與紅石蒸氣機具打造，濃郁咖啡香瀰漫四周，是顧客造訪的第一站。',
    descEn: 'Warm oak craftsmanship meets redstone steam boilers, filling the hall with irresistible coffee aromas.'
  },
  {
    id: '2F',
    nameZh: '2F: 景觀烘焙閣樓與休息沙龍',
    nameEn: '2F: Bakery Loft & Relax Lounge',
    badgeZh: '2樓 烘焙閣樓',
    badgeEn: '2F Loft',
    icon: '🥐',
    themeColor: '#ea580c',
    bgGradient: 'from-[#432313] via-[#2b170e] to-[#190c07]',
    wallTexture: 'bg-[radial-gradient(#7c2d12_1px,transparent_1px)] [background-size:16px_16px]',
    floorTexture: 'border-t-4 border-[#78350f] bg-[#381a0b]',
    descZh: '紅石披薩磚爐火光閃爍，絲絨沙發與滿牆附魔藏書，為旅人提供舒適放鬆的空間。',
    descEn: 'Glowing redstone brick ovens, velvet couches, and enchanted books offering cozy comfort for all adventurers.'
  },
  {
    id: '3F',
    nameZh: '3F: 幽靜星光茶藝茶館與包廂',
    nameEn: '3F: VIP Starlight Tea Pavilion',
    badgeZh: '3樓 星光包廂',
    badgeEn: '3F VIP Salon',
    icon: '🍵',
    themeColor: '#9333ea',
    bgGradient: 'from-[#2e1065] via-[#1e0742] to-[#0f0422]',
    wallTexture: 'bg-[radial-gradient(#6b21a8_1px,transparent_1px)] [background-size:16px_16px]',
    floorTexture: 'border-t-4 border-[#581c87] bg-[#220740]',
    descZh: '黑曜石茶道台映照著紫晶星空穹頂，幽匿風鈴輕柔共鳴，專為最尊貴的 VIP 客人而設。',
    descEn: 'Obsidian tea ceremony bars under amethyst crystal skylights with soothing sculk echo chimes for VIP gourmets.'
  },
  {
    id: 'rooftop',
    nameZh: '露天酒吧: 天空調酒露台與星空爵士',
    nameEn: 'Rooftop: Sky Cocktail Terrace & Jazz Bar',
    badgeZh: '露天酒吧',
    badgeEn: 'Sky Rooftop Bar',
    icon: '🍸',
    themeColor: '#06b6d4',
    bgGradient: 'from-[#082f49] via-[#0c1e33] to-[#040d1a]',
    wallTexture: 'bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]',
    floorTexture: 'border-t-4 border-[#0369a1] bg-[#082032]',
    descZh: '涼爽的高空夜風拂面，發光特調吧台、地獄岩營火與現場爵士演奏，眺望整個 Minecraft 世界！',
    descEn: 'Breezy starlight sky deck with neon glow mixology bars, netherrack campfire, and live jazz skyline stage.'
  }
];

export const CAFE_FACILITIES: CafeFacility[] = [
  // 1F Facilities
  {
    id: 'fac_1f_espresso',
    floorId: '1F',
    nameZh: '雙頭紅石萃取濃縮咖啡機',
    nameEn: 'Dual-Head Redstone Espresso Machine',
    icon: '☕',
    descZh: '利用紅石蒸氣活塞高壓萃取深邃咖啡油脂，大幅提升所有咖啡類飲品售價！',
    descEn: 'Piston-powered high-pressure steam extraction that supercharges all coffee selling prices!',
    category: 'espresso',
    decorEmoji: '♨️',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_1f_tables',
    floorId: '1F',
    nameZh: '原木舒適四人客席區',
    nameEn: 'Oak Dining Table Area',
    icon: '🍽️',
    descZh: '精選金合歡木與雲杉原木打造的用餐座席，讓客人倍感放鬆，延長等待耐心！',
    descEn: 'Comfortable acacia and spruce dining booths that give customers prolonged patience!',
    category: 'dining',
    decorEmoji: '🪑',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_1f_pastry',
    floorId: '1F',
    nameZh: '水晶恆溫甜點冷藏展示櫃',
    nameEn: 'Crystal Cold Pastry Showcase',
    icon: '🍰',
    descZh: '以冰晶石與玻璃組裝的高級展示櫃，甜點格外誘人，顯著增加客人給予小費的機率！',
    descEn: 'Chilled glass showcase displaying artisanal cakes that entices generous customer tips!',
    category: 'pastry',
    decorEmoji: '✨',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_1f_cold_drip',
    floorId: '1F',
    nameZh: '高塔冰滴冷萃萃取柱',
    nameEn: 'Tower Cold Drip Extractor',
    icon: '🧊',
    descZh: '慢速滴濾 12 小時的頂級礦物冷萃，產生穩定的被動金幣收益！',
    descEn: 'Slow 12-hour mineral cold drip apparatus that continuously generates passive coin dividends!',
    category: 'brew',
    decorEmoji: '💧',
    gridArea: 'col-span-1'
  },

  // 2F Facilities
  {
    id: 'fac_2f_oven',
    floorId: '2F',
    nameZh: '磚造紅石披薩烘焙烤爐',
    nameEn: 'Redstone Brick Bakery Oven',
    icon: '🥐',
    descZh: '以地獄岩永恆高溫鍛造的烘焙大爐，剛出爐的麵包與披薩香氣吸引大量客潮！',
    descEn: 'Nether-fueled stone oven churning out oven-fresh pastries and pizzas for gourmet visitors.',
    category: 'bakery',
    decorEmoji: '🔥',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_2f_couches',
    floorId: '2F',
    nameZh: '典雅絲絨雙人沙發休閒座',
    nameEn: 'Velvet Lounge Couches',
    icon: '🛋️',
    descZh: '柔軟厚實的羊毛絲絨沙發，讓在礦坑奮鬥歸來的冒險者得到極致撫慰與休息。',
    descEn: 'Plush wool velvet couches where tired miners unwind with premium relaxation.',
    category: 'lounge',
    decorEmoji: '🛋️',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_2f_library',
    floorId: '2F',
    nameZh: '附魔藏書閱讀交流沙龍',
    nameEn: 'Enchanted Reading Library',
    icon: '📚',
    descZh: '收藏古老礦業食譜與建築藍圖的書架，點燃客人的智慧靈感，額外增加料理經驗！',
    descEn: 'Ancient mining recipes and blueprints that inspire customers, granting bonus XP rewards.',
    category: 'lounge',
    decorEmoji: '📖',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_2f_planters',
    floorId: '2F',
    nameZh: '螢石水耕垂吊景觀花園',
    nameEn: 'Hanging Glowstone Hydroponics',
    icon: '🪴',
    descZh: '懸掛在天花板上的自體發光水耕植物，淨化空氣並持續帶來穩定的被動賞金！',
    descEn: 'Bioluminescent hanging hydroponics that purify air and shower steady passive gold.',
    category: 'lounge',
    decorEmoji: '🌿',
    gridArea: 'col-span-1'
  },

  // 3F Facilities
  {
    id: 'fac_3f_tea_bar',
    floorId: '3F',
    nameZh: '東方曜石茶道鑑賞台',
    nameEn: 'Obsidian Tea Ceremony Bar',
    icon: '🍵',
    descZh: '以黑曜石精雕細琢的茶道吧台，萃取百種茶品精華，倍增高級茶飲售價！',
    descEn: 'Hand-carved obsidian tea bar unlocking exquisite tea aromas and doubling tea profits!',
    category: 'tea',
    decorEmoji: '🍶',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_3f_vip_booths',
    floorId: '3F',
    nameZh: '尊爵金邊隱密私人包廂',
    nameEn: 'VIP Royal Gilded Booths',
    icon: '👑',
    descZh: '純金金箔鑲邊的高級隔間，招待各路村莊長老與富商，給出超慷慨的巨額小費！',
    descEn: 'Gold-leaf inlaid private rooms welcoming wealthy merchants and elite patrons for massive tips.',
    category: 'vip',
    decorEmoji: '💎',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_3f_amethyst_skylight',
    floorId: '3F',
    nameZh: '紫晶星空觀景全景天窗',
    nameEn: 'Amethyst Starlight Skylight',
    icon: '🌌',
    descZh: '清澈透亮的紫水晶穹頂天窗，夜晚閃爍星辰光芒，大幅提升客人的耐心與停留時間！',
    descEn: 'Crystal-clear amethyst skylight gazing upon constellations, captivating all guests.',
    category: 'vip',
    decorEmoji: '⭐',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_3f_echo_chimes',
    floorId: '3F',
    nameZh: '幽匿共鳴舒緩風鈴',
    nameEn: 'Echo Sculk Resonance Chimes',
    icon: '🎐',
    descZh: '深穴幽匿材質共振出的空靈和弦，使整個樓層籠罩在靜謐安詳的氛圍中。',
    descEn: 'Sculk resonance harmonics creating tranquil serenity and steady passive coin generation.',
    category: 'vip',
    decorEmoji: '🔔',
    gridArea: 'col-span-1'
  },

  // Rooftop Facilities
  {
    id: 'fac_rf_bar',
    floorId: 'rooftop',
    nameZh: '霓虹星光特調發光酒吧台',
    nameEn: 'Neon Mixology Luminous Bar',
    icon: '🍸',
    descZh: '配備螢石導光板與藥水蒸餾調酒壺的露天吧台，所有特調雞尾酒售價提升 100%！',
    descEn: 'Glowstone illuminated bar counter with potion shakers, maximizing cocktail revenues!',
    category: 'bar',
    decorEmoji: '🍹',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_rf_high_tables',
    floorId: 'rooftop',
    nameZh: '露天星空高腳全景桌',
    nameEn: 'Open-Air Stargazing High Tables',
    icon: '🍹',
    descZh: '坐落在露台邊緣的高腳桌，可俯瞰整個方塊大地圖，令每位客人驚嘆不已！',
    descEn: 'Edge terrace high tables overlooking the entire voxel realm with breathtaking panoramas.',
    category: 'bar',
    decorEmoji: '🥂',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_rf_fire_pit',
    floorId: 'rooftop',
    nameZh: '地獄岩永恆暖心營火爐',
    nameEn: 'Netherrack Eternal Fire Pit',
    icon: '🔥',
    descZh: '驅散夜空寒風的永恆篝火，客人圍坐在火堆邊歡笑聊天，停留時間翻倍！',
    descEn: 'Ever-burning nether campfire warming the breezy night air and boosting guest dwell time.',
    category: 'bar',
    decorEmoji: '🪵',
    gridArea: 'col-span-1'
  },
  {
    id: 'fac_rf_stage',
    floorId: 'rooftop',
    nameZh: '天空爵士現場演奏舞台',
    nameEn: 'Skyline Acoustic Jazz Stage',
    icon: '🎷',
    descZh: '紅石音階盒與現場樂手演奏的浪漫音樂，吸引全地圖最豪邁的貴賓客人造訪！',
    descEn: 'Live note-block acoustic jazz and trumpet stage summoning highest-paying patron orders!',
    category: 'stage',
    decorEmoji: '🎵',
    gridArea: 'col-span-1'
  }
];

export function getRankInfo(rank: StarRank = 'F1'): StarRankInfo {
  return STAR_RANKS[rank] || STAR_RANKS.F1;
}

export function getNextRank(currentRank: StarRank = 'F1'): StarRankInfo | null {
  const currentIndex = STAR_RANKS_ORDER.indexOf(currentRank);
  if (currentIndex === -1 || currentIndex >= STAR_RANKS_ORDER.length - 1) {
    return null; // Max rank reached (S3)
  }
  const nextRank = STAR_RANKS_ORDER[currentIndex + 1];
  return STAR_RANKS[nextRank];
}

export function calculateTotalCafeStarBonuses(facilityStars: Record<string, StarRank> = {}) {
  let totalSellPriceBonusPct = 0;
  let totalTipMultiplierBonus = 0;
  let totalPatienceBonusSec = 0;
  let totalPassiveCoins = 0;
  let highestGrade: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' = 'F';

  CAFE_FACILITIES.forEach(fac => {
    const rank = facilityStars[fac.id] || 'F1';
    const info = getRankInfo(rank);
    totalSellPriceBonusPct += info.sellPriceBonusPct;
    totalTipMultiplierBonus += info.tipMultiplierBonus;
    totalPatienceBonusSec += info.patienceBonusSec;
    totalPassiveCoins += info.passiveCoinsPerInterval;

    const gradeOrder = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
    if (gradeOrder.indexOf(info.grade) > gradeOrder.indexOf(highestGrade)) {
      highestGrade = info.grade;
    }
  });

  return {
    totalSellPriceBonusPct,
    totalTipMultiplierBonus,
    totalPatienceBonusSec,
    totalPassiveCoins,
    highestGrade
  };
}
