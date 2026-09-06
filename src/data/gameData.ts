import { BlockType, PickaxeTier, ThemeBackground, PlayerSkin, StrataLayer, MarketInflationEvent, ShopSupplyItem, FestivalEvent } from '../types';

// Blocks with 20% reduced base sell value and newly added strata blocks
export const BLOCK_TYPES: BlockType[] = [
  // --- Layer 0: Surface Layer (地表表層) ---
  {
    id: 'dirt',
    nameZh: '泥土',
    nameEn: 'Dirt',
    category: 'surface',
    hardness: 0.5,
    sellPrice: 1, // reduced from 2
    color: '#866043',
    borderColor: '#5c3e28',
    iconText: '🟫',
    description: '最基礎的表層土壤，挖掘迅速。',
    pixelType: 'dirt'
  },
  {
    id: 'wood',
    nameZh: '橡木原木',
    nameEn: 'Oak Log',
    category: 'surface',
    hardness: 0.8,
    sellPrice: 3, // reduced from 4
    color: '#9a6b43',
    borderColor: '#6b4928',
    iconText: '🪵',
    description: '用途廣泛的木質材料，手感扎實。',
    pixelType: 'wood'
  },
  {
    id: 'cobblestone',
    nameZh: '圓石',
    nameEn: 'Cobblestone',
    category: 'surface',
    hardness: 1.0,
    sellPrice: 4, // reduced from 5
    color: '#737373',
    borderColor: '#4d4d4d',
    iconText: '🪨',
    description: '堅硬的常見石材，建築的核心基底。',
    pixelType: 'cobblestone'
  },
  {
    id: 'sand',
    nameZh: '細沙',
    nameEn: 'Sand',
    category: 'surface',
    hardness: 0.5,
    sellPrice: 2,
    color: '#d6c589',
    borderColor: '#b5a15d',
    iconText: '⏳',
    description: '河流與海灘的鬆軟沙粒，燒製玻璃的必備原料。',
    pixelType: 'sand'
  },
  {
    id: 'gravel',
    nameZh: '礫石',
    nameEn: 'Gravel',
    category: 'surface',
    hardness: 0.7,
    sellPrice: 3,
    color: '#857f7d',
    borderColor: '#5e5a59',
    iconText: '⚪',
    description: '沉積在河道與地表下的碎石礫，偶爾能篩出燧石。',
    pixelType: 'gravel'
  },

  // --- Layer 1: Shallow Vein (淺層沉積礦脈) ---
  {
    id: 'coal_ore',
    nameZh: '煤炭礦石',
    nameEn: 'Coal Ore',
    category: 'ore',
    hardness: 1.2,
    sellPrice: 6, // reduced from 8
    color: '#2a2a2a',
    borderColor: '#151515',
    iconText: '⬛',
    description: '黑色的燃燒礦物，初期主要收入。',
    pixelType: 'coal_ore'
  },
  {
    id: 'copper_ore',
    nameZh: '銅礦石',
    nameEn: 'Copper Ore',
    category: 'ore',
    hardness: 1.3,
    sellPrice: 8, // reduced from 10
    color: '#b87333',
    borderColor: '#804c1a',
    iconText: '🟤',
    description: '帶有綠鏽斑點的青銅金屬。',
    pixelType: 'copper_ore'
  },
  {
    id: 'iron_ore',
    nameZh: '鐵礦石',
    nameEn: 'Iron Ore',
    category: 'ore',
    hardness: 1.5,
    sellPrice: 12, // reduced from 15
    color: '#d4af37',
    borderColor: '#9e8125',
    iconText: '🪙',
    description: '工業時代的骨幹，價值穩定。',
    pixelType: 'iron_ore'
  },
  {
    id: 'lapis_ore',
    nameZh: '青金石礦石',
    nameEn: 'Lapis Lazuli',
    category: 'ore',
    hardness: 1.7,
    sellPrice: 20, // reduced from 25
    color: '#2563eb',
    borderColor: '#1d4ed8',
    iconText: '🔷',
    description: '深邃純淨的湛藍色魔法礦物。',
    pixelType: 'lapis_ore'
  },

  // --- Layer 2: Crystalline Deep (深層金石結晶層) ---
  {
    id: 'gold_ore',
    nameZh: '金礦石',
    nameEn: 'Gold Ore',
    category: 'ore',
    hardness: 1.6,
    sellPrice: 22, // reduced from 28
    color: '#facc15',
    borderColor: '#ca8a04',
    iconText: '👑',
    description: '閃爍著璀璨金光的珍貴金屬。',
    pixelType: 'gold_ore'
  },
  {
    id: 'redstone_ore',
    nameZh: '紅石礦石',
    nameEn: 'Redstone Ore',
    category: 'ore',
    hardness: 1.6,
    sellPrice: 18, // reduced from 22
    color: '#ef4444',
    borderColor: '#991b1b',
    iconText: '🔴',
    description: '散發微弱紅光的能源晶體。',
    pixelType: 'redstone_ore'
  },
  {
    id: 'diamond_ore',
    nameZh: '鑽石礦石',
    nameEn: 'Diamond Ore',
    category: 'gem',
    hardness: 2.2,
    sellPrice: 52, // reduced from 65
    color: '#38bdf8',
    borderColor: '#0284c7',
    iconText: '💎',
    description: '礦工最渴望的閃耀寶石，價值連城！',
    pixelType: 'diamond_ore'
  },
  {
    id: 'emerald_ore',
    nameZh: '綠寶石礦石',
    nameEn: 'Emerald Ore',
    category: 'gem',
    hardness: 2.4,
    sellPrice: 68, // reduced from 85
    color: '#10b981',
    borderColor: '#047857',
    iconText: '❇️',
    description: '村民交易的最佳硬通貨，翠綠奪目。',
    pixelType: 'emerald_ore'
  },
  {
    id: 'amethyst',
    nameZh: '紫水晶塊',
    nameEn: 'Amethyst Block',
    category: 'gem',
    hardness: 2.0,
    sellPrice: 38,
    color: '#a855f7',
    borderColor: '#7e22ce',
    iconText: '🔮',
    description: '地底晶洞伴生的魔幻紫晶，敲擊時發出清脆鈴聲。',
    pixelType: 'amethyst'
  },

  // --- Layer 3: Deepslate Abyss (深板岩暗黑裂谷層) ---
  {
    id: 'cobbled_deepslate',
    nameZh: '深板岩圓石',
    nameEn: 'Cobbled Deepslate',
    category: 'deepslate',
    hardness: 1.8,
    sellPrice: 12,
    color: '#334155',
    borderColor: '#1e293b',
    iconText: '🧱',
    description: '負座標層的高密度深黑基底石材。',
    pixelType: 'cobbled_deepslate'
  },
  {
    id: 'deepslate_iron',
    nameZh: '深板岩鐵礦',
    nameEn: 'Deepslate Iron',
    category: 'deepslate',
    hardness: 2.2,
    sellPrice: 20,
    color: '#b45309',
    borderColor: '#78350f',
    iconText: '🔩',
    description: '深板岩中的鐵礦脈，硬度更加緻密。',
    pixelType: 'deepslate_iron'
  },
  {
    id: 'deepslate_diamond',
    nameZh: '深板岩鑽石',
    nameEn: 'Deepslate Diamond',
    category: 'deepslate',
    hardness: 3.0,
    sellPrice: 88, // reduced from 110
    color: '#1e293b',
    borderColor: '#0f172a',
    iconText: '💠',
    description: '深層地底最堅硬岩層中的頂級鑽石。',
    pixelType: 'deepslate_diamond'
  },
  {
    id: 'deepslate_emerald',
    nameZh: '深板岩綠寶石',
    nameEn: 'Deepslate Emerald',
    category: 'deepslate',
    hardness: 3.2,
    sellPrice: 105,
    color: '#064e3b',
    borderColor: '#022c22',
    iconText: '✨',
    description: '極罕見的深板岩原生綠寶石，極具收藏價值。',
    pixelType: 'deepslate_emerald'
  },
  {
    id: 'calcite',
    nameZh: '方解石',
    nameEn: 'Calcite',
    category: 'deepslate',
    hardness: 1.5,
    sellPrice: 24,
    color: '#e2e8f0',
    borderColor: '#94a3b8',
    iconText: '🪨',
    description: '環繞在晶洞外層的乳白高貴石層。',
    pixelType: 'calcite'
  },

  // --- Layer 4: Nether Core (地獄熾熱熔岩地心) ---
  {
    id: 'netherrack',
    nameZh: '地獄岩磚',
    nameEn: 'Nether Bricks',
    category: 'nether',
    hardness: 1.1,
    sellPrice: 14, // reduced from 18
    color: '#7f1d1d',
    borderColor: '#450a0a',
    iconText: '🧱',
    description: '永恆燃燒維度的暗紅熔火磚石。',
    pixelType: 'netherrack'
  },
  {
    id: 'soul_sand',
    nameZh: '靈魂沙',
    nameEn: 'Soul Sand',
    category: 'nether',
    hardness: 1.0,
    sellPrice: 15,
    color: '#523d32',
    borderColor: '#36241b',
    iconText: '👻',
    description: '蘊含哀嚎靈魂的幽冥沙土，可釋放靈魂疾行。',
    pixelType: 'soul_sand'
  },
  {
    id: 'quartz_ore',
    nameZh: '地獄石英礦',
    nameEn: 'Nether Quartz Ore',
    category: 'nether',
    hardness: 1.4,
    sellPrice: 22,
    color: '#f8fafc',
    borderColor: '#991b1b',
    iconText: '⚪',
    description: '火光中結晶的白淨石英，紅石科技核心材料。',
    pixelType: 'quartz_ore'
  },
  {
    id: 'glowstone',
    nameZh: '螢石燈',
    nameEn: 'Glowstone',
    category: 'nether',
    hardness: 0.9,
    sellPrice: 28, // reduced from 35
    color: '#fef08a',
    borderColor: '#eab308',
    iconText: '✨',
    description: '自帶耀眼金光的奇異地獄晶粉磚。',
    pixelType: 'glowstone'
  },
  {
    id: 'ancient_debris',
    nameZh: '遠古遺骸',
    nameEn: 'Ancient Debris',
    category: 'nether',
    hardness: 4.5,
    sellPrice: 192, // reduced from 240
    color: '#5c4538',
    borderColor: '#38251b',
    iconText: '☄️',
    description: '熔岩深層極其稀有的遠古獄髓殘骸，極度耐高溫！',
    pixelType: 'ancient_debris'
  },

  // --- Layer 5: End Void (終界外島虛空星環) ---
  {
    id: 'end_stone',
    nameZh: '終界石磚',
    nameEn: 'End Stone Bricks',
    category: 'end',
    hardness: 1.8,
    sellPrice: 32, // reduced from 40
    color: '#d4d4aa',
    borderColor: '#999977',
    iconText: '🪐',
    description: '虛空漂浮島嶼上的淡黃色奇特異星石材。',
    pixelType: 'end_stone'
  },
  {
    id: 'purpur',
    nameZh: '紫珀塊',
    nameEn: 'Purpur Block',
    category: 'end',
    hardness: 1.6,
    sellPrice: 38, // reduced from 48
    color: '#a855f7',
    borderColor: '#6b21a8',
    iconText: '🔮',
    description: '終界城獨有的紫頌植物提煉裝飾磚。',
    pixelType: 'purpur'
  },
  {
    id: 'obsidian',
    nameZh: '黑曜石',
    nameEn: 'Obsidian',
    category: 'end',
    hardness: 3.8,
    sellPrice: 104, // reduced from 130
    color: '#1a102f',
    borderColor: '#090514',
    iconText: '🌌',
    description: '水與熔岩冷卻凝聚的高強度黑紫色神石。',
    pixelType: 'obsidian'
  },
  {
    id: 'crying_obsidian',
    nameZh: '哭泣黑曜石',
    nameEn: 'Crying Obsidian',
    category: 'end',
    hardness: 4.0,
    sellPrice: 135,
    color: '#3b0764',
    borderColor: '#581c87',
    iconText: '💧',
    description: '滲透著紫色淚光能量的重生神石。',
    pixelType: 'crying_obsidian'
  },
  {
    id: 'end_crystal_ore',
    nameZh: '末地水晶礦',
    nameEn: 'End Crystal Ore',
    category: 'end',
    hardness: 4.2,
    sellPrice: 180,
    color: '#ec4899',
    borderColor: '#be185d',
    iconText: '💎',
    description: '吸收末影龍力量凝結的虛空粉紅晶礦。',
    pixelType: 'end_crystal_ore'
  },

  // --- Layer 6: Deep Dark Realm (伏守幽匿深暗異域) ---
  {
    id: 'sculk_block',
    nameZh: '伏守幽匿塊',
    nameEn: 'Sculk Block',
    category: 'deep_dark',
    hardness: 2.0,
    sellPrice: 120,
    color: '#082f49',
    borderColor: '#0284c7',
    iconText: '👁️',
    description: '地底深暗繁衍的生命感應有機石塊，散發幽幽藍光。',
    pixelType: 'sculk_block'
  },
  {
    id: 'sculk_catalyst',
    nameZh: '幽匿催化體',
    nameEn: 'Sculk Catalyst',
    category: 'deep_dark',
    hardness: 3.0,
    sellPrice: 220,
    color: '#0369a1',
    borderColor: '#082f49',
    iconText: '🌀',
    description: '能吸收靈魂轉化幽匿菌毯的古老核心。',
    pixelType: 'sculk_catalyst'
  },
  {
    id: 'echo_shard_ore',
    nameZh: '迴響碎屑礦',
    nameEn: 'Echo Shard Ore',
    category: 'deep_dark',
    hardness: 4.8,
    sellPrice: 340,
    color: '#0284c7',
    borderColor: '#0f172a',
    iconText: '🔊',
    description: '記錄遠古音波迴響的珍稀共鳴礦物。',
    pixelType: 'echo_shard_ore'
  },
  {
    id: 'reinforced_deepslate',
    nameZh: '強化深板岩',
    nameEn: 'Reinforced Deepslate',
    category: 'deep_dark',
    hardness: 5.5,
    sellPrice: 280,
    color: '#0f172a',
    borderColor: '#020617',
    iconText: '🛡️',
    description: '遠古中心祭壇不可撼動的絕對防禦方塊。',
    pixelType: 'reinforced_deepslate'
  },

  // --- Layer 7: Aether Celestial Realm (天界以太星輝神域) ---
  {
    id: 'starlight_stone',
    nameZh: '星光聖石',
    nameEn: 'Starlight Stone',
    category: 'aether',
    hardness: 3.5,
    sellPrice: 240,
    color: '#e0f2fe',
    borderColor: '#7dd3fc',
    iconText: '⭐',
    description: '高懸於雲海之上沐浴恆星光芒的耀白聖石。',
    pixelType: 'starlight_stone'
  },
  {
    id: 'sunstone',
    nameZh: '耀陽晶石',
    nameEn: 'Sunstone Ore',
    category: 'aether',
    hardness: 4.2,
    sellPrice: 380,
    color: '#fde047',
    borderColor: '#eab308',
    iconText: '☀️',
    description: '燃燒純粹日光熱能的天界金黃晶簇。',
    pixelType: 'sunstone'
  },
  {
    id: 'celestial_crystal',
    nameZh: '天界神聖水晶',
    nameEn: 'Celestial Crystal',
    category: 'aether',
    hardness: 5.2,
    sellPrice: 590,
    color: '#38bdf8',
    borderColor: '#818cf8',
    iconText: '💠',
    description: '眾神宮殿鍛造的極光晶石，具備浩瀚神力。',
    pixelType: 'celestial_crystal'
  },
  {
    id: 'cosmic_nebula_ore',
    nameZh: '宇宙星雲神礦',
    nameEn: 'Cosmic Nebula Ore',
    category: 'aether',
    hardness: 6.0,
    sellPrice: 960,
    color: '#6366f1',
    borderColor: '#312e81',
    iconText: '🌌',
    description: '蘊含創世星辰爆炸威能的最頂級神秘神礦！',
    pixelType: 'cosmic_nebula_ore'
  }
];

// Progression layers: Each layer requires 100,000 mined blocks in the previous layer to unlock!
export const STRATA_LAYERS: StrataLayer[] = [
  {
    id: 'surface',
    nameZh: '第 1 層：地表與表層泥岩',
    nameEn: 'Layer 1: Surface & Topsoil',
    order: 0,
    requiredMinedToUnlock: 0, // Unlocked by default
    icon: '🌱',
    accentColor: '#22c55e',
    borderGlow: 'border-emerald-500',
    descZh: '綠意盎然的大地表層，豐富的泥土、原木與各類沉積石料。',
    blockIds: ['dirt', 'wood', 'cobblestone', 'sand', 'gravel']
  },
  {
    id: 'shallow',
    nameZh: '第 2 層：淺層沉積礦脈帶',
    nameEn: 'Layer 2: Shallow Sedimentary Vein',
    order: 1,
    requiredMinedToUnlock: 100000,
    icon: '🪙',
    accentColor: '#eab308',
    borderGlow: 'border-amber-500',
    descZh: '地表之下的富礦層，蘊藏大量煤炭、銅礦、鐵礦與青金石。',
    blockIds: ['coal_ore', 'copper_ore', 'iron_ore', 'lapis_ore']
  },
  {
    id: 'crystalline',
    nameZh: '第 3 層：深層金石結晶地帶',
    nameEn: 'Layer 3: Crystalline Deep Belt',
    order: 2,
    requiredMinedToUnlock: 100000,
    icon: '💎',
    accentColor: '#38bdf8',
    borderGlow: 'border-sky-500',
    descZh: '熾熱地殼上方的高壓晶洞，耀眼黃金、紅石能源與璀璨鑽石綠寶石。',
    blockIds: ['gold_ore', 'redstone_ore', 'diamond_ore', 'emerald_ore', 'amethyst']
  },
  {
    id: 'deepslate_abyss',
    nameZh: '第 4 層：深板岩暗黑裂谷',
    nameEn: 'Layer 4: Deepslate Abyss Chasm',
    order: 3,
    requiredMinedToUnlock: 100000,
    icon: '🪨',
    accentColor: '#94a3b8',
    borderGlow: 'border-slate-500',
    descZh: '負Y軸極度緻密的玄黑岩層，硬度劇增，蘊藏高純度深板岩寶石。',
    blockIds: ['cobbled_deepslate', 'deepslate_iron', 'deepslate_diamond', 'deepslate_emerald', 'calcite']
  },
  {
    id: 'nether_core',
    nameZh: '第 5 層：地獄熾熱熔岩地心',
    nameEn: 'Layer 5: Nether Molten Core',
    order: 4,
    requiredMinedToUnlock: 100000,
    icon: '🔥',
    accentColor: '#ef4444',
    borderGlow: 'border-red-600',
    descZh: '高溫炙熱的熔岩煉獄，烈火不滅的地獄岩、靈魂沙與傳奇遠古遺骸。',
    blockIds: ['netherrack', 'soul_sand', 'quartz_ore', 'glowstone', 'ancient_debris']
  },
  {
    id: 'end_void',
    nameZh: '第 6 層：終界外島虛空星環',
    nameEn: 'Layer 6: The End Void Islands',
    order: 5,
    requiredMinedToUnlock: 100000,
    icon: '🌌',
    accentColor: '#a855f7',
    borderGlow: 'border-purple-500',
    descZh: '漂浮在無垠宇宙虛空之中的黃色隕石島，黑曜石與末地水晶的寂靜領域。',
    blockIds: ['end_stone', 'purpur', 'obsidian', 'crying_obsidian', 'end_crystal_ore']
  },
  {
    id: 'deep_dark',
    nameZh: '第 7 層：伏守幽匿深暗異域',
    nameEn: 'Layer 7: Ancient Deep Dark Realm',
    order: 6,
    requiredMinedToUnlock: 100000,
    icon: '👁️',
    accentColor: '#06b6d4',
    borderGlow: 'border-cyan-500',
    descZh: '幽匿菌群滋生、迴響古老生息的禁忌暗域，深藏強化深板岩與迴響碎屑。',
    blockIds: ['sculk_block', 'sculk_catalyst', 'echo_shard_ore', 'reinforced_deepslate']
  },
  {
    id: 'aether_celestial',
    nameZh: '第 8 層：天界以太星輝神域',
    nameEn: 'Layer 8: Aether Celestial Heaven',
    order: 7,
    requiredMinedToUnlock: 100000,
    icon: '☀️',
    accentColor: '#facc15',
    borderGlow: 'border-yellow-400',
    descZh: '超越凡俗的宇宙星辰之巔，純淨日光、天界水晶與創世宇宙星雲神礦！',
    blockIds: ['starlight_stone', 'sunstone', 'celestial_crystal', 'cosmic_nebula_ore']
  }
];

// Pickaxe Shop Tiers (+50% increased prices for balanced resource sinks)
export const PICKAXE_TIERS: PickaxeTier[] = [
  {
    id: 'bare_hand',
    nameZh: '徒手挖掘',
    nameEn: 'Bare Hands',
    tier: 0,
    cost: 0,
    speedMultiplier: 1.0,
    maxDurability: 999999,
    color: '#e5e5e5',
    bgGradient: 'from-zinc-700 to-zinc-900',
    desc: '用雙手徒手鑿石，雖然無限耐久，但挖掘緩慢。'
  },
  {
    id: 'wood_pick',
    nameZh: '木鎬',
    nameEn: 'Wooden Pickaxe',
    tier: 1,
    cost: 75, // +50% from 50
    speedMultiplier: 1.8,
    maxDurability: 60,
    color: '#b47846',
    bgGradient: 'from-amber-900 to-amber-950',
    desc: '入門級工具，挖掘速度提高 80%，耐久度 60。'
  },
  {
    id: 'stone_pick',
    nameZh: '石鎬',
    nameEn: 'Stone Pickaxe',
    tier: 2,
    cost: 270, // +50% from 180
    speedMultiplier: 3.2,
    maxDurability: 140,
    color: '#9e9e9e',
    bgGradient: 'from-stone-600 to-stone-800',
    desc: '結實石刃，挖掘速度比徒手快 3.2 倍，耐久度 140。'
  },
  {
    id: 'iron_pick',
    nameZh: '鐵鎬',
    nameEn: 'Iron Pickaxe',
    tier: 3,
    cost: 750, // +50% from 500
    speedMultiplier: 5.5,
    maxDurability: 320,
    color: '#e2e8f0',
    bgGradient: 'from-slate-400 to-slate-700',
    desc: '標準專業礦鎬，挖掘速度 5.5 倍，耐久度 320。'
  },
  {
    id: 'gold_pick',
    nameZh: '金鎬',
    nameEn: 'Golden Pickaxe',
    tier: 4,
    cost: 1500, // +50% from 1000
    speedMultiplier: 10.0,
    maxDurability: 110,
    color: '#facc15',
    bgGradient: 'from-yellow-500 to-amber-700',
    desc: '極速破岩！速度高達 10 倍，但金質較軟耐久僅 110。'
  },
  {
    id: 'diamond_pick',
    nameZh: '鑽石鎬',
    nameEn: 'Diamond Pickaxe',
    tier: 5,
    cost: 3750, // +50% from 2500
    speedMultiplier: 8.5,
    maxDurability: 850,
    color: '#38bdf8',
    bgGradient: 'from-cyan-500 to-blue-700',
    desc: '傳奇鎬具，集超高速 8.5 倍與超長 850 耐久於一身。'
  },
  {
    id: 'netherite_pick',
    nameZh: '獄髓鎬',
    nameEn: 'Netherite Pickaxe',
    tier: 6,
    cost: 9000, // +50% from 6000
    speedMultiplier: 13.0,
    maxDurability: 2200,
    color: '#64748b',
    bgGradient: 'from-neutral-800 to-violet-950',
    desc: '終極採礦神器！狂暴 13 倍採掘速度，高達 2200 耐久度！'
  },
  {
    id: 'sculk_pick',
    nameZh: '幽匿靈魂音波鎬',
    nameEn: 'Sculk Sonic Pickaxe',
    tier: 7,
    cost: 24000,
    speedMultiplier: 19.0,
    maxDurability: 4500,
    color: '#06b6d4',
    bgGradient: 'from-cyan-900 to-slate-950',
    desc: '灌注幽匿震波與靈魂碎屑，粉碎深暗岩石如探囊取物！'
  },
  {
    id: 'celestial_pick',
    nameZh: '天界星神造物鎬',
    nameEn: 'Celestial God Pickaxe',
    tier: 8,
    cost: 55000,
    speedMultiplier: 30.0,
    maxDurability: 9999,
    color: '#fde047',
    bgGradient: 'from-amber-400 via-yellow-600 to-amber-950',
    desc: '創世神遺留的天界聖器！狂暴 30 倍極速，近乎無限的 9999 耐久！'
  },
  {
    id: 'rainbow_prism_pick',
    nameZh: '七彩稜鏡破界鎬',
    nameEn: 'Prismatic Rainbow Pickaxe',
    tier: 9,
    cost: 95000,
    speedMultiplier: 45.0,
    maxDurability: 18000,
    color: '#f43f5e',
    bgGradient: 'from-pink-500 via-purple-600 to-indigo-800',
    desc: '七彩極光匯聚的破界神鎬，狂暴 45 倍超光速崩解方塊！'
  },
  {
    id: 'tnt_dynamite_pick',
    nameZh: '烈性 TNT 破岩神鎬',
    nameEn: 'Explosive TNT Breaker',
    tier: 10,
    cost: 180000,
    speedMultiplier: 65.0,
    maxDurability: 35000,
    color: '#ef4444',
    bgGradient: 'from-red-600 via-orange-600 to-amber-900',
    desc: '每次揮擊宛如連鎖 TNT 爆破！狂暴 65 倍粉碎，採礦神話之頂！'
  },
  // --- 節日限定神鎬 (Festival Limited Pickaxes) ---
  {
    id: 'halloween_pickaxe',
    nameZh: '🎃 萬聖南瓜魅影神鎬',
    nameEn: 'Pumpkin Shadow Pickaxe',
    tier: 8,
    cost: 48000,
    speedMultiplier: 45.0,
    maxDurability: 26000,
    color: '#f97316',
    bgGradient: 'from-orange-600 via-purple-700 to-zinc-950',
    desc: '【萬聖節限定】幽靈南瓜火花四濺，狂暴 45 倍暗夜開採速！'
  },
  {
    id: 'christmas_pickaxe',
    nameZh: '🎄 聖誕薄荷冰晶拐杖鎬',
    nameEn: 'Peppermint Crystal Pickaxe',
    tier: 9,
    cost: 78000,
    speedMultiplier: 55.0,
    maxDurability: 35000,
    color: '#38bdf8',
    bgGradient: 'from-sky-400 via-emerald-600 to-red-600',
    desc: '【聖誕節限定】極光與霜雪交織的甜蜜神兵，狂飆 55 倍破冰極速！'
  },
  {
    id: 'cny_pickaxe',
    nameZh: '🧧 新春乾坤開運爆竹鎬',
    nameEn: 'Firecracker Fortune Pickaxe',
    tier: 10,
    cost: 128888,
    speedMultiplier: 68.0,
    maxDurability: 50000,
    color: '#fbbf24',
    bgGradient: 'from-red-600 via-amber-500 to-yellow-300',
    desc: '【新春慶典限定】祥龍吐焰、爆竹齊鳴！狂暴 68 倍超神速崩石！'
  },
  {
    id: 'sakura_pickaxe',
    nameZh: '🌸 春日落櫻花見靈木鎬',
    nameEn: 'Cherry Blossom Spirit Pickaxe',
    tier: 7,
    cost: 32000,
    speedMultiplier: 38.0,
    maxDurability: 20000,
    color: '#f472b6',
    bgGradient: 'from-pink-500 via-rose-400 to-pink-900',
    desc: '【春季櫻花限定】花瓣紛飛，輕巧靈動的 38 倍風雅開採！'
  },
  {
    id: 'summer_pickaxe',
    nameZh: '🌊 盛夏海神熔岩三叉鎬',
    nameEn: 'Poseidon Summer Magma Pickaxe',
    tier: 8,
    cost: 58000,
    speedMultiplier: 50.0,
    maxDurability: 28000,
    color: '#06b6d4',
    bgGradient: 'from-cyan-500 via-blue-600 to-amber-500',
    desc: '【盛夏慶典限定】深海巨浪與熱帶驕陽合一，極致 50 倍破岩！'
  }
];

// Theme Backgrounds (+50% increased prices)
export const THEME_BACKGROUNDS: ThemeBackground[] = [
  {
    id: 'overworld',
    nameZh: '🌲 經典主世界',
    nameEn: 'Classic Overworld',
    cost: 0,
    bgCss: 'bg-[#152a18]',
    accentColor: '#4ade80',
    previewColor: '#166534',
    desc: '青翠草原與和煦微風的初始冒險天地。'
  },
  {
    id: 'nether',
    nameZh: '🔥 熔岩地獄堡壘',
    nameEn: 'Nether Fortress',
    cost: 450, // +50% from 300
    bgCss: 'bg-[#2a0e0e]',
    accentColor: '#ef4444',
    previewColor: '#991b1b',
    desc: '地獄岩與滾燙熔漿翻騰的炙熱領域。'
  },
  {
    id: 'end',
    nameZh: '🌌 終界虛空星海',
    nameEn: 'The End Void',
    cost: 900, // +50% from 600
    bgCss: 'bg-[#150d24]',
    accentColor: '#c084fc',
    previewColor: '#581c87',
    desc: '無盡虛空與星塵環繞的終界巨龍領域。'
  },
  {
    id: 'deepslate',
    nameZh: '🪨 深板岩幽暗巨洞',
    nameEn: 'Deepslate Caverns',
    cost: 675, // +50% from 450
    bgCss: 'bg-[#12161c]',
    accentColor: '#38bdf8',
    previewColor: '#1e293b',
    desc: '深層地殼幽暗古樸的深板岩礦坑。'
  },
  {
    id: 'lush_caves',
    nameZh: '🌿 繁茂發光洞穴',
    nameEn: 'Lush Caves',
    cost: 750, // +50% from 500
    bgCss: 'bg-[#0f241a]',
    accentColor: '#86efac',
    previewColor: '#065f46',
    desc: '杜鵑花與發光漿果垂掛的靜謐秘境。'
  },
  {
    id: 'cyberpunk',
    nameZh: '⚡ 賽博霓虹 Minecraft',
    nameEn: 'Cyberpunk Neon',
    cost: 1800, // +50% from 1200
    bgCss: 'bg-[#0b0c16]',
    accentColor: '#ec4899',
    previewColor: '#be185d',
    desc: '未來霓虹光束與像素交錯的高科技未來風格。'
  },
  {
    id: 'deep_dark_theme',
    nameZh: '👁️ 幽匿伏守古城',
    nameEn: 'Ancient Deep Dark City',
    cost: 2700,
    bgCss: 'bg-[#040e17]',
    accentColor: '#06b6d4',
    previewColor: '#082f49',
    desc: '深暗古城回盪的遠古呢喃，神聖而神秘。'
  },
  {
    id: 'golden_vault',
    nameZh: '👑 純金藏寶庫',
    nameEn: 'Golden Treasury',
    cost: 3750, // +50% from 2500
    bgCss: 'bg-[#261d08]',
    accentColor: '#facc15',
    previewColor: '#a16207',
    desc: '金磚堆砌、熠熠生輝的巨額財富殿堂！'
  },
  {
    id: 'celestial_realm',
    nameZh: '☀️ 天界神聖以太領域',
    nameEn: 'Celestial Aether Realm',
    cost: 6000,
    bgCss: 'bg-[#0c192c]',
    accentColor: '#fde047',
    previewColor: '#1d4ed8',
    desc: '眾神俯瞰大地的聖潔雲頂，金光璀璨萬丈。'
  },
  {
    id: 'cherry_grove',
    nameZh: '🌸 浪漫粉櫻花林',
    nameEn: 'Cherry Blossom Grove',
    cost: 1350,
    bgCss: 'bg-[#261019]',
    accentColor: '#f472b6',
    previewColor: '#db2777',
    desc: '微風輕拂、落英繽紛的日系櫻花樹海。'
  },
  {
    id: 'magma_volcano',
    nameZh: '🌋 活火山赤紅地幔',
    nameEn: 'Active Volcano Mantle',
    cost: 3450,
    bgCss: 'bg-[#200904]',
    accentColor: '#fb923c',
    previewColor: '#c2410c',
    desc: '地底深處翻滾的高溫地幔岩漿海。'
  },
  {
    id: 'matrix_code',
    nameZh: '💻 賽博綠幕代碼流',
    nameEn: 'Matrix Cyber Terminal',
    cost: 5100,
    bgCss: 'bg-[#021808]',
    accentColor: '#22c55e',
    previewColor: '#15803d',
    desc: '向下流淌的駭客代碼瀑布與極客界面。'
  },
  {
    id: 'galaxy_nebula',
    nameZh: '🌌 宇宙深空星雲',
    nameEn: 'Deep Space Nebula',
    cost: 9900,
    bgCss: 'bg-[#0b0826]',
    accentColor: '#818cf8',
    previewColor: '#4338ca',
    desc: '萬千恆星誕生、紫藍光芒交織的宇宙深空。'
  },
  // --- 節慶專屬主題背景 (Holiday Festival Themes) ---
  {
    id: 'halloween',
    nameZh: '🎃 萬聖南瓜幽魂魅夜',
    nameEn: 'Halloween Pumpkin Night',
    cost: 1500,
    bgCss: 'bg-[#180824]',
    accentColor: '#f97316',
    previewColor: '#7e22ce',
    desc: '【萬聖活動限定】暗夜南瓜燈幽火閃爍、紫霧瀰漫的南瓜古堡。'
  },
  {
    id: 'christmas',
    nameZh: '❄️ 聖誕極光冰雪冬日',
    nameEn: 'Christmas Aurora Winter',
    cost: 1500,
    bgCss: 'bg-[#061826]',
    accentColor: '#38bdf8',
    previewColor: '#0284c7',
    desc: '【聖誕活動限定】銀白飄雪漫天覆蓋、極光彩帶耀眼的冰雪世界。'
  },
  {
    id: 'lunar_new_year',
    nameZh: '🏮 新春除夕赤金迎祥殿',
    nameEn: 'Lunar New Year Grand Palace',
    cost: 1500,
    bgCss: 'bg-[#290508]',
    accentColor: '#fbbf24',
    previewColor: '#b91c1c',
    desc: '【新春盛典限定】大紅燈籠高掛、金龍獻瑞的除夕賀歲盛堂。'
  },
  {
    id: 'cherry_blossom_festival',
    nameZh: '🌸 春季花見櫻吹雪夜',
    nameEn: 'Sakura Night Bloom',
    cost: 1500,
    bgCss: 'bg-[#250d18]',
    accentColor: '#f472b6',
    previewColor: '#db2777',
    desc: '【春季盛會限定】落英繽紛、粉嫩落櫻隨風漫舞的浪漫秘境。'
  },
  {
    id: 'summer_solstice',
    nameZh: '🌴 盛夏熱帶碧浪烈陽',
    nameEn: 'Tropical Summer Solstice',
    cost: 1500,
    bgCss: 'bg-[#081a28]',
    accentColor: '#38bdf8',
    previewColor: '#0369a1',
    desc: '【盛夏狂歡限定】蔚藍海浪拍岸、陽光沙灘與椰影搖曳的熱帶樂園。'
  }
];

// Player Skins (+50% increased prices)
export const PLAYER_SKINS: PlayerSkin[] = [
  {
    id: 'steve',
    nameZh: '經典礦工 史蒂夫',
    nameEn: 'Steve',
    cost: 0,
    avatarEmoji: '⛏️',
    badge: '經典冒險家',
    desc: '最受歡迎的青色襯衫經典傳奇礦工。'
  },
  {
    id: 'alex',
    nameZh: '荒野探險家 艾莉絲',
    nameEn: 'Alex',
    cost: 225, // +50% from 150
    avatarEmoji: '🏹',
    badge: '叢林獵手',
    desc: '綠色束腰、靈巧敏捷的荒野生存大師。'
  },
  {
    id: 'nether_knight',
    nameZh: '黑石地獄騎士',
    nameEn: 'Nether Knight',
    cost: 750, // +50% from 500
    avatarEmoji: '🛡️',
    badge: '火抗護甲',
    desc: '身披熾熱玄武岩與地獄火淬鍊的重裝騎士。'
  },
  {
    id: 'end_mage',
    nameZh: '終界穿梭法師',
    nameEn: 'Ender Mage',
    cost: 1200, // +50% from 800
    avatarEmoji: '🔮',
    badge: '空間使徒',
    desc: '能夠瞬移並洞悉虛空秘辛的紫色奧術師。'
  },
  {
    id: 'diamond_tycoon',
    nameZh: '鑽石大亨',
    nameEn: 'Diamond Tycoon',
    cost: 2250, // +50% from 1500
    avatarEmoji: '💎',
    badge: '礦業首富',
    desc: '全身鑲滿純淨無瑕鑽石的頂級礦場巨頭。'
  },
  {
    id: 'god_creator',
    nameZh: '創世神領主',
    nameEn: 'God of Blocks',
    cost: 4500, // +50% from 3000
    avatarEmoji: '👑',
    badge: '最高主宰',
    desc: '掌控方塊世界造物權能的金色神明。'
  },
  {
    id: 'warden_avatar',
    nameZh: '幽匿伏守巨神',
    nameEn: 'Sculk Warden God',
    cost: 7500,
    avatarEmoji: '👁️',
    badge: '深暗支配者',
    desc: '以遠古幽匿核心鑄就，感應大地萬物震顫之主。'
  },
  {
    id: 'celestial_overlord',
    nameZh: '天界星輝大帝',
    nameEn: 'Celestial Sovereign',
    cost: 12000,
    avatarEmoji: '☀️',
    badge: '星穹之尊',
    desc: '身披璀璨恆星光冕，執掌宇宙萬千星系的最高主宰。'
  },
  {
    id: 'creeper_suit',
    nameZh: '苦力怕偽裝服',
    nameEn: 'Creeper Mascot',
    cost: 1650,
    avatarEmoji: '💥',
    badge: '滋滋滋...',
    desc: '穿戴經典綠色苦力怕花紋的特約搞怪偽裝服。'
  },
  {
    id: 'redstone_engineer',
    nameZh: '紅石首席工程師',
    nameEn: 'Redstone Chief Engineer',
    cost: 3300,
    avatarEmoji: '⚙️',
    badge: '機關大師',
    desc: '精通百萬紅石線路、全自動採礦機械的設計宗師。'
  },
  {
    id: 'void_shadow',
    nameZh: '虛空影武者',
    nameEn: 'Void Shadow Assassin',
    cost: 4200,
    avatarEmoji: '🥷',
    badge: '匿影絕殺',
    desc: '穿梭在陰影與虛空縫隙中的幽靈武士。'
  },
  {
    id: 'pizza_cow_hero',
    nameZh: '披薩乳牛特製版',
    nameEn: 'PizzaCow Legend',
    cost: 7777,
    avatarEmoji: '🍕',
    badge: '官方特製',
    desc: '手捧熱騰騰香濃披薩的傳奇特約乳牛礦神！'
  }
];

// Supplies and Consumable Commodities
export const SHOP_SUPPLIES: ShopSupplyItem[] = [
  {
    id: 'repair_oil',
    nameZh: '萬能合金修復油',
    nameEn: 'Universal Repair Oil',
    cost: 450,
    iconEmoji: '🛢️',
    badge: '滿血修復',
    descZh: '立即將當前手持鎬具耐久度完全回復至 100%（不限磨損量）！',
    type: 'repair_oil'
  },
  {
    id: 'haste_drink',
    nameZh: '急迫採礦能量飲料',
    nameEn: 'Haste Energy Drink',
    cost: 600,
    iconEmoji: '⚡',
    badge: '速度翻倍',
    descZh: '飲用後 60 秒內開採時間縮減 50%，享受極致狂飆掘石手感！',
    type: 'haste_drink'
  },
  {
    id: 'tnt_blast',
    nameZh: '連鎖採礦 TNT 炸藥包',
    nameEn: 'Chain Mining TNT Pack',
    cost: 1200,
    iconEmoji: '🧨',
    badge: '瞬間炸收 30 塊',
    descZh: '立即在當前選中礦脈層引爆，直接將 30 個該層方塊炸入背包！',
    type: 'tnt_blast'
  },
  {
    id: 'fortune_bag',
    nameZh: '招財貓幸運金幣福袋',
    nameEn: 'Lucky Fortune Pouch',
    cost: 800,
    iconEmoji: '🍀',
    badge: '開出 1,000~2,500 幣',
    descZh: '純金絲織成的聚寶福袋，打開必定開出 1,000 ~ 2,500 隨機遊戲幣！',
    type: 'fortune_bag'
  },
  {
    id: 'auto_miner',
    nameZh: '蒸氣紅石自動採礦機',
    nameEn: 'Steam Auto-Miner Robot',
    cost: 4500,
    iconEmoji: '🤖',
    badge: '永久自動挖掘',
    descZh: '永久解鎖自動採礦魔像！每 3 秒自動為您在當前層級開採 1 個方塊！',
    type: 'auto_miner'
  },
  // --- 節日限定特殊道具 (Festival Limited Supplies) ---
  {
    id: 'halloween_ghost_candy',
    nameZh: '🍬 萬聖幽靈狂歡糖果',
    nameEn: 'Halloween Ghost Candy',
    cost: 750,
    iconEmoji: '🍬',
    badge: '90秒雙倍萬聖金幣',
    descZh: '【萬聖節限定】食用幽靈糖果，90 秒內在任何地層採礦獲得 2 倍額外金幣加乘！',
    type: 'halloween_ghost_candy',
    festivalTag: '萬聖節限定'
  },
  {
    id: 'christmas_zero_elixir',
    nameZh: '❄️ 絕對零度冰凍靈藥',
    nameEn: 'Absolute Zero Elixir',
    cost: 1500,
    iconEmoji: '❄️',
    badge: '120秒耐久鎖死不扣',
    descZh: '【聖誕節限定】極寒冰霜凝固工具！120 秒內開採「完全不耗損耐久度」，安心猛挖！',
    type: 'christmas_zero_elixir',
    festivalTag: '聖誕節限定'
  },
  {
    id: 'cny_lucky_packet',
    nameZh: '🧧 大吉大利迎春紅包',
    nameEn: 'Prosperity Red Packet',
    cost: 2000,
    iconEmoji: '🧧',
    badge: '隨機開 3,888~9,999幣',
    descZh: '【新春慶典限定】燙金除夕壓歲紅包！拆開保底獲得 3,888 ~ 9,999 巨額新年大金幣！',
    type: 'cny_lucky_packet',
    festivalTag: '新春慶典限定'
  },
  {
    id: 'santa_gift_box',
    nameZh: '🎁 聖誕老人神秘禮盒',
    nameEn: "Santa's Secret Gift",
    cost: 1800,
    iconEmoji: '🎁',
    badge: '2500~5500幣+稀有礦',
    descZh: '【聖誕節限定】聖誕雪橇驚喜盒！隨機開出 2,500 ~ 5,500 幣與 20 個稀有建材！',
    type: 'santa_gift_box',
    festivalTag: '聖誕節限定'
  },
  {
    id: 'hanami_dango',
    nameZh: '🍡 春日花見三色糰子',
    nameEn: 'Hanami Dango Treat',
    cost: 950,
    iconEmoji: '🍡',
    badge: '60秒採掘速+100%',
    descZh: '【春季限定】糯米清香的甜蜜糰子，60 秒內開採速度直接飆升 +100%！',
    type: 'hanami_dango',
    festivalTag: '春季限定'
  },
  {
    id: 'summer_coconut',
    nameZh: '🥥 盛夏冰鎮清涼椰子',
    nameEn: 'Chilled Tropical Coconut',
    cost: 1100,
    iconEmoji: '🥥',
    badge: '回1000耐久+炸30塊',
    descZh: '【盛夏限定】暢飲甘甜椰汁，瞬間回復 1,000 耐久並炸出 30 個地層方塊！',
    type: 'summer_coconut',
    festivalTag: '盛夏限定'
  }
];

// Market Inflation Event Presets
export const MARKET_INFLATION_TEMPLATES: Omit<MarketInflationEvent, 'remainingSeconds'>[] = [
  {
    id: 'normal',
    title: '⚖️ 市場平穩期',
    description: '市場交易秩序正常，供需平衡。',
    multiplier: 1.0,
    type: 'normal',
    durationSeconds: 60
  },
  {
    id: 'hyper_inflation',
    title: '🔥 全球性惡性通貨膨脹爆發！',
    description: '貨幣急遽貶值！所有方塊收購價格狂飆 +80%！趕緊獲利了結！',
    multiplier: 1.8,
    type: 'hyper_inflation',
    durationSeconds: 45
  },
  {
    id: 'mega_hyper_inflation',
    title: '💥 世紀超級通膨海嘯！',
    description: '全市場陷入史詩級狂暴通膨！所有方塊售出價格翻倍 (+120%)！',
    multiplier: 2.2,
    type: 'hyper_inflation',
    durationSeconds: 35
  },
  {
    id: 'ore_boom',
    title: '💎 稀有礦石特約收購熱潮',
    description: '工業巨頭重金收購金屬與寶石，礦物與寶石類方塊售價暴漲 150%！',
    multiplier: 2.5,
    type: 'ore_boom',
    durationSeconds: 40,
    affectedCategories: ['ore', 'gem', 'deepslate']
  },
  {
    id: 'construction_rush',
    title: '🚀 王國宏大工程：建材大搶購！',
    description: '主世界大規模擴建！泥土、木材、圓石等基礎建材價格暴漲 +100%！',
    multiplier: 2.0,
    type: 'construction_rush',
    durationSeconds: 45,
    affectedCategories: ['surface']
  },
  {
    id: 'cosmic_surge',
    title: '⚡ 異次元秘境能量狂潮',
    description: '地獄、終界、幽匿與天界物料引發神秘學狂潮，售價暴漲 +180%！',
    multiplier: 2.8,
    type: 'cosmic_surge',
    durationSeconds: 35,
    affectedCategories: ['nether', 'end', 'deep_dark', 'aether']
  },
  {
    id: 'deflation',
    title: '📉 原物料市場短暫寒冬 (緊縮)',
    description: '市場流動性暫時收縮，方塊收購價微幅下降 25%，可囤積方塊靜待通膨！',
    multiplier: 0.75,
    type: 'deflation',
    durationSeconds: 30
  }
];

// 5大節慶與特殊活動系統 (Seasonal Festival & Special Events)
export const FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: 'halloween',
    nameZh: '🎃 萬聖南瓜狂歡魅夜',
    nameEn: 'Halloween Pumpkin Gala',
    icon: '🎃',
    bannerTitle: '萬聖狂歡夜 • 幽靈糖果與南瓜神鎬',
    descZh: '深秋南瓜成熟、紫霧繚繞！享受雙倍萬聖狂歡金幣與專屬南瓜魅影神鎬！',
    themeId: 'halloween',
    specialPickaxeId: 'halloween_pickaxe',
    activePeriodZh: '秋季 • 萬聖節夜影慶典',
    particleType: 'pumpkin',
    themeBg: THEME_BACKGROUNDS.find(t => t.id === 'halloween') || THEME_BACKGROUNDS[0],
    specialPickaxe: PICKAXE_TIERS.find(p => p.id === 'halloween_pickaxe') || PICKAXE_TIERS[0],
    specialItems: SHOP_SUPPLIES.filter(s => s.id === 'halloween_ghost_candy')
  },
  {
    id: 'christmas',
    nameZh: '🎄 聖誕極光冰雪盛典',
    nameEn: 'Christmas Aurora Wonderland',
    icon: '🎄',
    bannerTitle: '聖誕冰雪節 • 零度耐久靈藥與薄荷冰晶鎬',
    descZh: '極光劃過冬夜，銀裝素裹！聖誕老人神秘禮盒與 120 秒無限耐久零度靈藥熱烈降臨！',
    themeId: 'christmas',
    specialPickaxeId: 'christmas_pickaxe',
    activePeriodZh: '冬季 • 聖誕新年狂歡',
    particleType: 'snow',
    themeBg: THEME_BACKGROUNDS.find(t => t.id === 'christmas') || THEME_BACKGROUNDS[0],
    specialPickaxe: PICKAXE_TIERS.find(p => p.id === 'christmas_pickaxe') || PICKAXE_TIERS[0],
    specialItems: SHOP_SUPPLIES.filter(s => s.id === 'christmas_zero_elixir' || s.id === 'santa_gift_box')
  },
  {
    id: 'lunar_new_year',
    nameZh: '🧧 新春除夕赤金大吉',
    nameEn: 'Lunar New Year Golden Festival',
    icon: '🧧',
    bannerTitle: '除夕迎春 • 巨額壓歲紅包與乾坤爆竹鎬',
    descZh: '大紅燈籠高掛，爆竹破空！拆開隨機最高 9,999 巨額壓歲紅包，迎財神走大運！',
    themeId: 'lunar_new_year',
    specialPickaxeId: 'cny_pickaxe',
    activePeriodZh: '初春 • 新春賀歲盛典',
    particleType: 'firecracker',
    themeBg: THEME_BACKGROUNDS.find(t => t.id === 'lunar_new_year') || THEME_BACKGROUNDS[0],
    specialPickaxe: PICKAXE_TIERS.find(p => p.id === 'cny_pickaxe') || PICKAXE_TIERS[0],
    specialItems: SHOP_SUPPLIES.filter(s => s.id === 'cny_lucky_packet')
  },
  {
    id: 'cherry_blossom',
    nameZh: '🌸 春季花見櫻吹雪祭',
    nameEn: 'Spring Sakura Blossom Festival',
    icon: '🌸',
    bannerTitle: '春日花見 • 三色糰子採礦極速+100%',
    descZh: '粉嫩落櫻隨風漫舞，輕巧靈木鎬伴隨三色糰子，享受翻倍採礦急行極速！',
    themeId: 'cherry_blossom_festival',
    specialPickaxeId: 'sakura_pickaxe',
    activePeriodZh: '春季 • 櫻花花見祭典',
    particleType: 'sakura',
    themeBg: THEME_BACKGROUNDS.find(t => t.id === 'cherry_blossom_festival') || THEME_BACKGROUNDS[0],
    specialPickaxe: PICKAXE_TIERS.find(p => p.id === 'sakura_pickaxe') || PICKAXE_TIERS[0],
    specialItems: SHOP_SUPPLIES.filter(s => s.id === 'hanami_dango')
  },
  {
    id: 'summer_solstice',
    nameZh: '☀️ 盛夏蔚藍熱帶海灘',
    nameEn: 'Tropical Summer Solstice',
    icon: '🌊',
    bannerTitle: '熱帶盛夏 • 冰鎮椰子回耐久炸礦脈',
    descZh: '陽光金沙碧浪，海神三叉鎬破岩斬浪，暢飲冰鎮椰汁瞬間回血並炸碎礦脈！',
    themeId: 'summer_solstice',
    specialPickaxeId: 'summer_pickaxe',
    activePeriodZh: '盛夏 • 熱帶浪花狂歡',
    particleType: 'summer',
    themeBg: THEME_BACKGROUNDS.find(t => t.id === 'summer_solstice') || THEME_BACKGROUNDS[0],
    specialPickaxe: PICKAXE_TIERS.find(p => p.id === 'summer_pickaxe') || PICKAXE_TIERS[0],
    specialItems: SHOP_SUPPLIES.filter(s => s.id === 'summer_coconut')
  }
];
