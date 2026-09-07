import { LevelQuest } from '../types';

export const MAX_PLAYER_LEVEL = 100;

export const LEVEL_QUESTS: LevelQuest[] = [
  {
    id: 'quest_lvl_0',
    level: 0,
    titleZh: '實習生初探採石場',
    titleEn: 'Novice Mine Exploration',
    descZh: '於挖掘場累計開採至少 20 顆方塊。',
    descEn: 'Mine at least 20 blocks in the Quarry.',
    requiredXp: 40,
    coinReward: 80,
    rewardDescZh: '+80 金幣、解鎖稱號「碎石開拓者」',
    rewardDescEn: '+80 Coins, Title: Stone Delver',
    targetType: 'mine_blocks',
    targetValue: 20
  },
  {
    id: 'quest_lvl_1',
    level: 1,
    titleZh: '工欲善其事',
    titleEn: 'Arming the Miner',
    descZh: '在商店購買並升級至石鎬（或更高階鎬具）。',
    descEn: 'Purchase and equip a Stone Pickaxe (or higher tier).',
    requiredXp: 120,
    coinReward: 150,
    rewardDescZh: '+150 金幣、鎬具修復油 x1',
    rewardDescEn: '+150 Coins, Repair Oil x1',
    targetType: 'pickaxe_tier',
    targetValue: 2 // Stone pickaxe is tier 2
  },
  {
    id: 'quest_lvl_2',
    level: 2,
    titleZh: '建築工藝第一步',
    titleEn: 'First Steps of Architecture',
    descZh: '在建築區的 100 格創作畫布上放置至少 10 塊方塊。',
    descEn: 'Place at least 10 blocks on the 100-grid building board.',
    requiredXp: 260,
    coinReward: 250,
    rewardDescZh: '+250 金幣、急迫能量飲料 x1',
    rewardDescEn: '+250 Coins, Haste Drink x1',
    targetType: 'place_blocks',
    targetValue: 10
  },
  {
    id: 'quest_lvl_3',
    level: 3,
    titleZh: '交易所黃金商人',
    titleEn: 'Prosperity Trading Wave',
    descZh: '在交易所賣出礦物，累積獲得至少 300 金幣。',
    descEn: 'Sell minerals on the market to earn at least 300 coins.',
    requiredXp: 480,
    coinReward: 400,
    rewardDescZh: '+400 金幣、連鎖 TNT 炸藥包 x1',
    rewardDescEn: '+400 Coins, Chain TNT x1',
    targetType: 'market_coins',
    targetValue: 300
  },
  {
    id: 'quest_lvl_4',
    level: 4,
    titleZh: '符文附魔之力',
    titleEn: 'Arcane Enchantment',
    descZh: '升級鎬具附魔（效率、耐久或幸運），總等級達到 3 級。',
    descEn: 'Upgrade pickaxe enchantments (Efficiency/Unbreaking/Fortune) to total level 3.',
    requiredXp: 800,
    coinReward: 600,
    rewardDescZh: '+600 金幣、雙倍金幣糖果 x1',
    rewardDescEn: '+600 Coins, Double Coins Candy x1',
    targetType: 'enchant_levels',
    targetValue: 3
  },
  {
    id: 'quest_lvl_5',
    level: 5,
    titleZh: '深層鐵血工匠',
    titleEn: 'Iron Deep Delver',
    descZh: '在商店升級裝備鐵鎬或更高工具，且累計開採達 250 顆方塊。',
    descEn: 'Own Iron Pickaxe or better and mine at least 250 blocks total.',
    requiredXp: 1250,
    coinReward: 900,
    rewardDescZh: '+900 金幣、極速採礦團子 x1',
    rewardDescEn: '+900 Coins, Haste Dango x1',
    targetType: 'mine_blocks',
    targetValue: 250
  },
  {
    id: 'quest_lvl_6',
    level: 6,
    titleZh: '裂谷與深層地脈',
    titleEn: 'Rift Stratum Explorer',
    descZh: '切換並探索淺層沉積礦脈帶（第 2 層或以上地層）。',
    descEn: 'Unlock and switch to Layer 2 (Shallow Vein) or deeper.',
    requiredXp: 1800,
    coinReward: 1300,
    rewardDescZh: '+1,300 金幣、萬能修復油 x2',
    rewardDescEn: '+1,300 Coins, Repair Oil x2',
    targetType: 'strata_layer',
    targetValue: 1 // Layer index 1 or above
  },
  {
    id: 'quest_lvl_7',
    level: 7,
    titleZh: '蒸氣紅石自動化',
    titleEn: 'Redstone Automation Pioneer',
    descZh: '解鎖商店的蒸氣採礦魔像機器人（自動開採）。',
    descEn: 'Unlock the Steam Auto-Miner Golem from the shop.',
    requiredXp: 2600,
    coinReward: 1800,
    rewardDescZh: '+1,800 金幣、連鎖 TNT x2',
    rewardDescEn: '+1,800 Coins, Chain TNT x2',
    targetType: 'auto_miner',
    targetValue: 1
  },
  {
    id: 'quest_lvl_8',
    level: 8,
    titleZh: '黃金盛宴財富',
    titleEn: 'Golden Treasury Hoarder',
    descZh: '隨身金幣持有量達到 1,500 枚金幣以上。',
    descEn: 'Hold at least 1,500 coins simultaneously.',
    requiredXp: 3600,
    coinReward: 2400,
    rewardDescZh: '+2,400 金幣、神話幸運金幣 x1',
    rewardDescEn: '+2,400 Coins, Lucky Coin x1',
    targetType: 'coins_held',
    targetValue: 1500
  },
  {
    id: 'quest_lvl_9',
    level: 9,
    titleZh: '璀璨鑽石巨匠',
    titleEn: 'Diamond Grandmaster',
    descZh: '購買並裝備鑽石鎬（鎬具第 5 階）。',
    descEn: 'Equip Diamond Pickaxe (Pickaxe Tier 5).',
    requiredXp: 4800,
    coinReward: 3200,
    rewardDescZh: '+3,200 金幣、鎬具耐久鎖定冰晶 x1',
    rewardDescEn: '+3,200 Coins, Durability Lock Crystal x1',
    targetType: 'pickaxe_tier',
    targetValue: 5
  },
  {
    id: 'quest_lvl_10',
    level: 10,
    titleZh: '百格宏偉建築巨作',
    titleEn: 'Master of Construction',
    descZh: '在建築區放置累計 40 塊方塊，構築您的宏偉藍圖。',
    descEn: 'Place at least 40 blocks on the building board.',
    requiredXp: 6200,
    coinReward: 4200,
    rewardDescZh: '+4,200 金幣、稱號「百格宏偉建築巨匠」',
    rewardDescEn: '+4,200 Coins, Title: Grand Architect',
    targetType: 'place_blocks',
    targetValue: 40
  },
  {
    id: 'quest_lvl_11',
    level: 11,
    titleZh: '深層玄黑暗壑',
    titleEn: 'Deepslate Abyss Chasm',
    descZh: '深入至第 4 層深板岩暗黑裂谷或更深層地脈。',
    descEn: 'Descend to Layer 4 (Deepslate Abyss) or deeper.',
    requiredXp: 7800,
    coinReward: 5200,
    rewardDescZh: '+5,200 金幣、防禦晶岩石盾 x1',
    rewardDescEn: '+5,200 Coins, Shield Crystal x1',
    targetType: 'strata_layer',
    targetValue: 3
  },
  {
    id: 'quest_lvl_12',
    level: 12,
    titleZh: '地底熔岩征服者',
    titleEn: 'Nether Core Vanquisher',
    descZh: '解鎖並切換至第 5 層地獄熾熱熔岩地心進行開採。',
    descEn: 'Unlock and mine in Layer 5 (Nether Core).',
    requiredXp: 9600,
    coinReward: 6400,
    rewardDescZh: '+6,400 金幣、火神熔岩神符 x1',
    rewardDescEn: '+6,400 Coins, Lava Talisman x1',
    targetType: 'strata_layer',
    targetValue: 4
  },
  {
    id: 'quest_lvl_13',
    level: 13,
    titleZh: '鎬具附魔宗師',
    titleEn: 'Enchantment High Master',
    descZh: '鎬具附魔總等級（效率+耐久+幸運）達到 8 級。',
    descEn: 'Achieve total pickaxe enchantment level of 8.',
    requiredXp: 11800,
    coinReward: 7800,
    rewardDescZh: '+7,800 金幣、全屬性附魔大禮包',
    rewardDescEn: '+7,800 Coins, Grand Enchant Bundle',
    targetType: 'enchant_levels',
    targetValue: 8
  },
  {
    id: 'quest_lvl_14',
    level: 14,
    titleZh: '終界虛空星環漫步',
    titleEn: 'Void Ring Pilgrim',
    descZh: '前往第 6 層終界外島虛空星環展開探勘。',
    descEn: 'Explore Layer 6 (The End Void Islands).',
    requiredXp: 14200,
    coinReward: 9500,
    rewardDescZh: '+9,500 金幣、末影珍珠護符 x1',
    rewardDescEn: '+9,500 Coins, Ender Charm x1',
    targetType: 'strata_layer',
    targetValue: 5
  },
  {
    id: 'quest_lvl_15',
    level: 15,
    titleZh: '富可敵國的金幣霸主',
    titleEn: 'Treasure Empire Hegemon',
    descZh: '隨身金幣持有量累積突破 8,000 枚金幣。',
    descEn: 'Hold at least 8,000 coins in your wallet.',
    requiredXp: 17000,
    coinReward: 11500,
    rewardDescZh: '+11,500 金幣、黃金巨富榮譽獎章',
    rewardDescEn: '+11,500 Coins, Wealth Medal',
    targetType: 'coins_held',
    targetValue: 8000
  },
  {
    id: 'quest_lvl_16',
    level: 16,
    titleZh: '幽匿深穴禁忌神工',
    titleEn: 'Ancient Deep Dark Artificer',
    descZh: '深入至第 7 層伏守幽匿深暗異域採集古老菌毯。',
    descEn: 'Descend to Layer 7 (Deep Dark Realm).',
    requiredXp: 20200,
    coinReward: 14000,
    rewardDescZh: '+14,000 金幣、幽匿迴響寶匣 x1',
    rewardDescEn: '+14,000 Coins, Sculk Cache x1',
    targetType: 'strata_layer',
    targetValue: 6
  },
  {
    id: 'quest_lvl_17',
    level: 17,
    titleZh: '榮譽成就收藏家',
    titleEn: 'Achievement Luminary',
    descZh: '累積解鎖達成 18 項以上的冒險成就徽章。',
    descEn: 'Unlock at least 18 achievement badges.',
    requiredXp: 23800,
    coinReward: 17000,
    rewardDescZh: '+17,000 金幣、至尊成就冠冕',
    rewardDescEn: '+17,000 Coins, Achievement Crown',
    targetType: 'achievements',
    targetValue: 18
  },
  {
    id: 'quest_lvl_18',
    level: 18,
    titleZh: '天界以太聖域開拓',
    titleEn: 'Aether Celestial Vanguard',
    descZh: '解鎖並切換至第 8 層天界以太星輝神域採掘星光聖石。',
    descEn: 'Reach and explore Layer 8 (Aether Celestial Heaven).',
    requiredXp: 27800,
    coinReward: 20500,
    rewardDescZh: '+20,500 金幣、天界極光羽翼',
    rewardDescEn: '+20,500 Coins, Celestial Wings',
    targetType: 'strata_layer',
    targetValue: 7
  },
  {
    id: 'quest_lvl_19',
    level: 19,
    titleZh: '時空裂隙超弦探險',
    titleEn: 'Chrono Rift Continuum',
    descZh: '深入探勘第 9 層時空裂隙・奇點維度（第 9 層地層）。',
    descEn: 'Explore Layer 9 (Chrono Rift & Singularity).',
    requiredXp: 32200,
    coinReward: 24500,
    rewardDescZh: '+24,500 金幣、時空暗能量碎片 x3',
    rewardDescEn: '+24,500 Coins, Dark Matter x3',
    targetType: 'strata_layer',
    targetValue: 8
  },
  {
    id: 'quest_lvl_20',
    level: 20,
    titleZh: '創世神域・終極宇宙母核',
    titleEn: 'Genesis Omniverse Core Pioneer',
    descZh: '成功抵達第 10 層創世神域・終極宇宙母核（第 10 層地層）！',
    descEn: 'Reach and unlock the ultimate Layer 10 (Genesis Omniverse Core)!',
    requiredXp: 37000,
    coinReward: 30000,
    rewardDescZh: '+30,000 金幣、解鎖榮譽神座與全新高階稱號',
    rewardDescEn: '+30,000 Coins, Divine Throne & Epic Titles',
    targetType: 'strata_layer',
    targetValue: 9
  }
];

export const LEVEL_TITLES_ZH: string[] = [
  // 0 - 9
  '實習礦工', '碎石開拓者', '鐵器工匠', '黃金採掘者', '青金石占星家',
  '紅石電路師', '黑曜石破壞者', '鑽石獵人', '幽谷行者', '晶簇學士',
  // 10 - 19
  '深板岩守護者', '熔岩鍛造師', '地獄先鋒', '石英雕刻大師', '烈焰征服者',
  '遠古殘骸探索者', '獄髓金工大師', '終界開拓先驅', '末影星環觀測者', '紫珀要塞領主',
  // 20 - 29
  '蒸氣工坊總督', '自動化機械巨擎', '百格宏偉建築巨匠', '附魔奧術導師', '幸運聚寶仙靈',
  '耐久神鋼精煉師', '極速風暴礦王', '交易所金融巨鱷', '傳奇採石領主', '地下城屠龍者',
  // 30 - 39
  '幽匿聽音者', '暗域潛行者', '迴響靈魂引渡者', '催化暗核操縱者', '強化深板岩衛士',
  '地底禁忌守望者', '遠古神廟守護者', '深淵呼喚者', '無光深穴征服者', '幽暗界域大領主',
  // 40 - 49
  '以太雲海行者', '日光結晶使者', '星光聖殿騎士', '極光水晶魔導師', '天界神殿建築師',
  '彗星軌道探勘家', '超新星核能熔煉師', '恆星烈陽領主', '星空漫遊者', '宇宙星雲大主宰',
  // 50 - 59
  '時空行者', '時間裂痕探險家', '相對論力場師', '空間折疊大師', '暗物質收集者',
  '反重力工程總師', '事件視界觀測員', '微中子風暴獵人', '量子糾纏矩陣師', '時空奇點主宰者',
  // 60 - 69
  '虛無裂變者', '源生基岩破壞者', '原初混沌使徒', '以太弦論操縱者', '宇宙微波守望者',
  '萬有引力大公爵', '暗能量汲取巨神', '維度錨定守護者', '混沌熔爐神工', '太初創世先驅',
  // 70 - 79
  '多維宇宙探索者', '星系巡航艦長', '超星系團之眼', '創世矩陣構築者', '宇宙源質神官',
  '光年穿梭至尊', '神性火種守護者', '星辰萬象導師', '寰宇星圖繪製者', '寰宇神殿大宗師',
  // 80 - 89
  '法則編織者', '概念裁決者', '因果律掌控者', '永恆星靈大聖', '無極神能至尊',
  '維度超脫者', '造物神權秉持者', '無窮無限領主', '萬界核心統禦者', '至高神域王座',
  // 90 - 99
  '半神超凡巨擘', '超維度創世真神', '全星系造物神尊', '時空宇宙織夢者', '無盡維度至尊',
  '原初萬物主宰', '終極太一至尊', '終焉與起源之神', '超神性宇宙之王', '萬界創世原點',
  // 100
  '全知全能終極造物主'
];

export const LEVEL_TITLES_EN: string[] = [
  // 0 - 9
  'Novice Miner', 'Stone Delver', 'Iron Craftsman', 'Gold Prospector', 'Lapis Diviner',
  'Redstone Engineer', 'Obsidian Breaker', 'Diamond Hunter', 'Ravine Wanderer', 'Amethyst Scholar',
  // 10 - 19
  'Deepslate Warden', 'Lava Smith', 'Nether Vanguard', 'Quartz Sculptor', 'Blaze Conqueror',
  'Debris Scavenger', 'Netherite Metalsmith', 'End Pioneer', 'Void Watcher', 'Purpur Lord',
  // 20 - 29
  'Steam Overseer', 'Automata Titan', 'Grand Architect', 'Arcane Enchanter', 'Fortune Weaver',
  'Steel Purifier', 'Tempest Digger', 'Market Baron', 'Quarry Sovereign', 'Dungeon Dragon Slayer',
  // 30 - 39
  'Sculk Listener', 'Shadow Infiltrator', 'Echo Harvester', 'Catalyst Weaver', 'Bastion Guardian',
  'Forbidden Watcher', 'Temple Protector', 'Abyss Caller', 'Pitch Black Conqueror', 'Deep Realm Overlord',
  // 40 - 49
  'Cloud Walker', 'Sunstone Emissary', 'Starlight Knight', 'Aurora Wizard', 'Celestial Architect',
  'Comet Prospector', 'Supernova Smelter', 'Solar Lord', 'Starfarer', 'Cosmic Nebula Sovereign',
  // 50 - 59
  'Chrono Nomad', 'Rift Pioneer', 'Relativity Adept', 'Space Bender', 'Dark Matter Gatherer',
  'Antigravity Chief', 'Event Horizon Scout', 'Neutrino Hunter', 'Quantum Weaver', 'Singularity Master',
  // 60 - 69
  'Void Fissioner', 'Bedrock Sunderer', 'Primordial Herald', 'String Manipulator', 'Cosmic Echo Sentry',
  'Graviton Duke', 'Dark Energy Titan', 'Dimensional Anchor', 'Chaos Forgemaster', 'Genesis Pioneer',
  // 70 - 79
  'Multiverse Seeker', 'Galaxy Captain', 'Supercluster Eye', 'Matrix Builder', 'Essence Hierophant',
  'Lightyear Sovereign', 'Divine Spark Keeper', 'Constellation Sage', 'Cosmic Cartographer', 'Omniverse Grandmaster',
  // 80 - 89
  'Law Weaver', 'Concept Arbiter', 'Causality Dominator', 'Eternal Seraph', 'Absolute Powerhouse',
  'Ascendant Transcendent', 'Divine Authority', 'Infinity Lord', 'Nexus Ruler', 'Supreme Throne',
  // 90 - 99
  'Demigod Ascendant', 'Hyperdimensional God', 'Galactic Demiurge', 'Cosmic Dreamweaver', 'Endless Sovereign',
  'All-Father Sovereign', 'Ultimate One', 'God of Alpha & Omega', 'Omnipotent King', 'Genesis Prime',
  // 100
  'Omniscient Omnipotent Ultimate Creator'
];

export function getLevelQuest(level: number): LevelQuest {
  if (level >= MAX_PLAYER_LEVEL) {
    return {
      id: 'quest_lvl_max',
      level: MAX_PLAYER_LEVEL,
      titleZh: '★ 登峰造極・全知全能終極造物主 ★',
      titleEn: '★ Pinnacle: Omniscient Omnipotent Creator ★',
      descZh: '您已達成 Lv.100 滿級最高巔峰！無上神威貫穿宇宙所有維度，受萬眾生靈敬仰！',
      descEn: 'You have attained Level 100 Apex! Your supreme dominion spans across all dimensions!',
      requiredXp: 999999999,
      coinReward: 1000000,
      rewardDescZh: '+1,000,000 金幣、全知全能終極神環',
      rewardDescEn: '+1,000,000 Coins, Omnipotent Halo',
      targetType: 'mine_blocks',
      targetValue: 1000000
    };
  }

  if (level < LEVEL_QUESTS.length) {
    return LEVEL_QUESTS[level];
  }

  // Dynamic high-level quests for levels 21 to 99
  const cycle = level % 5;
  const lvlOffset = level - 20;
  const requiredXp = Math.round(37000 + lvlOffset * 6500 + Math.pow(lvlOffset, 1.35) * 450);
  const coinReward = Math.round(30000 + lvlOffset * 4800 + Math.pow(lvlOffset, 1.25) * 350);

  if (cycle === 0) {
    // Mine blocks milestone
    const target = 1500 + lvlOffset * 350;
    return {
      id: `quest_lvl_${level}`,
      level,
      titleZh: `深層脈絡開拓修煉 (階級 ${level})`,
      titleEn: `Subterranean Vein Mastery (Tier ${level})`,
      descZh: `在各層挖掘場開採累計達到 ${target.toLocaleString()} 顆方塊。`,
      descEn: `Mine at least ${target.toLocaleString()} blocks across the quarry strata.`,
      requiredXp,
      coinReward,
      rewardDescZh: `+${coinReward.toLocaleString()} 金幣、尊榮破壞神符`,
      rewardDescEn: `+${coinReward.toLocaleString()} Coins, Destroyer Talisman`,
      targetType: 'mine_blocks',
      targetValue: target
    };
  } else if (cycle === 1) {
    // Wealth coins held milestone
    const target = 10000 + lvlOffset * 3000;
    return {
      id: `quest_lvl_${level}`,
      level,
      titleZh: `財富聚寶盆鍛造 (階級 ${level})`,
      titleEn: `Vault of Prosperity (Tier ${level})`,
      descZh: `持有隨身金幣儲備達到 ${target.toLocaleString()} 枚以上。`,
      descEn: `Accumulate at least ${target.toLocaleString()} coins held at once.`,
      requiredXp,
      coinReward,
      rewardDescZh: `+${coinReward.toLocaleString()} 金幣、黃金財閥皇冠`,
      rewardDescEn: `+${coinReward.toLocaleString()} Coins, Tycoon Crown`,
      targetType: 'coins_held',
      targetValue: target
    };
  } else if (cycle === 2) {
    // Enchantment mastery
    const target = Math.min(60, 10 + Math.floor(lvlOffset * 0.6));
    return {
      id: `quest_lvl_${level}`,
      level,
      titleZh: `符文奧術登峰造極 (階級 ${level})`,
      titleEn: `Arcane Rune Transcendence (Tier ${level})`,
      descZh: `提升鎬具附魔（效率、耐久或幸運），總等級達到 ${target} 級。`,
      descEn: `Enhance pickaxe enchantments to total level ${target}.`,
      requiredXp,
      coinReward,
      rewardDescZh: `+${coinReward.toLocaleString()} 金幣、神話奧術核心`,
      rewardDescEn: `+${coinReward.toLocaleString()} Coins, Mythic Arcane Core`,
      targetType: 'enchant_levels',
      targetValue: target
    };
  } else if (cycle === 3) {
    // Architecture blocks placed
    const target = Math.min(100, 30 + Math.floor(lvlOffset * 0.8));
    return {
      id: `quest_lvl_${level}`,
      level,
      titleZh: `神殿建築神工造物 (階級 ${level})`,
      titleEn: `Sanctuary Masterwork (Tier ${level})`,
      descZh: `在建築區 100 格創作藍圖中放置至少 ${target} 塊方塊。`,
      descEn: `Place at least ${target} blocks on the construction board.`,
      requiredXp,
      coinReward,
      rewardDescZh: `+${coinReward.toLocaleString()} 金幣、建築大師藍圖`,
      rewardDescEn: `+${coinReward.toLocaleString()} Coins, Master Blueprint`,
      targetType: 'place_blocks',
      targetValue: target
    };
  } else {
    // Achievements challenge
    const target = Math.min(36, 16 + Math.floor(lvlOffset * 0.3));
    return {
      id: `quest_lvl_${level}`,
      level,
      titleZh: `傳奇成就登神長階 (階級 ${level})`,
      titleEn: `Pantheon of Achievements (Tier ${level})`,
      descZh: `累計解鎖達成 ${target} 項以上的探險成就勳章。`,
      descEn: `Unlock at least ${target} adventure achievements.`,
      requiredXp,
      coinReward,
      rewardDescZh: `+${coinReward.toLocaleString()} 金幣、天界神話冠冕`,
      rewardDescEn: `+${coinReward.toLocaleString()} Coins, Celestial Diadem`,
      targetType: 'achievements',
      targetValue: target
    };
  }
}

export function getLevelTitle(level: number, isEn: boolean): string {
  const safeLevel = Math.max(0, Math.min(MAX_PLAYER_LEVEL, Math.floor(level || 0)));
  if (isEn) {
    return LEVEL_TITLES_EN[safeLevel] || `Mythic Creator Lv.${safeLevel}`;
  }
  return LEVEL_TITLES_ZH[safeLevel] || `神話造物者 Lv.${safeLevel}`;
}

export interface PlayerStatsForQuest {
  totalBlocksMined: number;
  totalBlocksPlaced: number;
  totalCoinsEarned: number;
  coins: number;
  pickaxeTier: number;
  totalEnchants: number;
  currentStrataIndex: number;
  hasAutoMiner: boolean;
  achievementsCount: number;
}

export function checkQuestProgress(quest: LevelQuest, stats: PlayerStatsForQuest): {
  isCompleted: boolean;
  current: number;
  max: number;
  progressPercent: number;
  displayText: string;
} {
  let rawCurrent = 0;
  const max = Math.max(1, quest?.targetValue || 1);

  if (stats) {
    switch (quest?.targetType) {
      case 'mine_blocks':
        rawCurrent = stats.totalBlocksMined;
        break;
      case 'place_blocks':
        rawCurrent = stats.totalBlocksPlaced;
        break;
      case 'pickaxe_tier':
        rawCurrent = stats.pickaxeTier;
        break;
      case 'enchant_levels':
        rawCurrent = stats.totalEnchants;
        break;
      case 'market_coins':
        rawCurrent = stats.totalCoinsEarned;
        break;
      case 'strata_layer':
        rawCurrent = stats.currentStrataIndex;
        break;
      case 'auto_miner':
        rawCurrent = stats.hasAutoMiner ? 1 : 0;
        break;
      case 'coins_held':
        rawCurrent = stats.coins;
        break;
      case 'achievements':
        rawCurrent = stats.achievementsCount;
        break;
      default:
        rawCurrent = stats.totalBlocksMined;
    }
  }

  // Strictly enforce finite positive number to avoid NaN / 2 (NaN%)
  const current = (typeof rawCurrent === 'number' && Number.isFinite(rawCurrent)) ? Math.max(0, rawCurrent) : 0;
  const isCompleted = current >= max;
  const progressPercent = Math.min(100, Math.round((current / max) * 100));
  const displayText = `${Math.min(current, max).toLocaleString()} / ${max.toLocaleString()}`;

  return { isCompleted, current, max, progressPercent, displayText };
}

/**
 * Calculates XP earned from mining a specific block
 */
export function calculateBlockXp(category: string, hardness: number): number {
  switch (category) {
    case 'surface':
      return Math.max(1, Math.round(hardness * 2));
    case 'ore':
      return 4;
    case 'gem':
      return 12;
    case 'deepslate':
      return 8;
    case 'nether':
      return 15;
    case 'end':
      return 20;
    case 'deep_dark':
      return 25;
    case 'aether':
      return 35;
    case 'singularity':
      return 45;
    case 'genesis':
      return 60;
    default:
      return 2;
  }
}
