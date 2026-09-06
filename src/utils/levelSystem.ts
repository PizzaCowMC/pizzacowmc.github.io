import { LevelQuest } from '../types';

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
    requiredXp: 500,
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
    requiredXp: 850,
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
    descZh: '擁有鐵鎬或更高工具，且累計開採達 350 顆方塊。',
    descEn: 'Own Iron Pickaxe or better and mine at least 350 blocks total.',
    requiredXp: 1400,
    coinReward: 1000,
    rewardDescZh: '+1,000 金幣、極速採礦團子 x1',
    rewardDescEn: '+1,000 Coins, Haste Dango x1',
    targetType: 'mine_blocks',
    targetValue: 350
  },
  {
    id: 'quest_lvl_6',
    level: 6,
    titleZh: '裂谷與深層地脈',
    titleEn: 'Rift Stratum Explorer',
    descZh: '解鎖並切換至淺層岩石或水晶裂谷地層進行探索。',
    descEn: 'Unlock and switch to Sedimentary or Crystalline Rift layer.',
    requiredXp: 2200,
    coinReward: 1500,
    rewardDescZh: '+1,500 金幣、萬能修復油 x2',
    rewardDescEn: '+1,500 Coins, Repair Oil x2',
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
    requiredXp: 3500,
    coinReward: 2200,
    rewardDescZh: '+2,200 金幣、連鎖 TNT x2',
    rewardDescEn: '+2,200 Coins, Chain TNT x2',
    targetType: 'auto_miner',
    targetValue: 1
  },
  {
    id: 'quest_lvl_8',
    level: 8,
    titleZh: '璀璨鑽石巨匠',
    titleEn: 'Diamond Grandmaster',
    descZh: '購買並裝備鑽石鎬，且隨身金幣持有超過 2,500 幣。',
    descEn: 'Equip a Diamond Pickaxe and hold at least 2,500 coins.',
    requiredXp: 5200,
    coinReward: 3200,
    rewardDescZh: '+3,200 金幣、鎬具耐久鎖定冰晶 x1',
    rewardDescEn: '+3,200 Coins, Durability Lock Crystal x1',
    targetType: 'coins_held',
    targetValue: 2500
  },
  {
    id: 'quest_lvl_9',
    level: 9,
    titleZh: '深淵與下界地心',
    titleEn: 'Nether Core Vanquisher',
    descZh: '探索並解鎖下界地心層，深入地心熾熱礦脈。',
    descEn: 'Reach and unlock the Nether Core stratum.',
    requiredXp: 7500,
    coinReward: 4500,
    rewardDescZh: '+4,500 金幣、新春開運大紅包 x1',
    rewardDescEn: '+4,500 Coins, Red Packet x1',
    targetType: 'strata_layer',
    targetValue: 4
  },
  {
    id: 'quest_lvl_10',
    level: 10,
    titleZh: '百格宏偉建築巨作',
    titleEn: 'Master of Construction',
    descZh: '在建築區放置累計 60 塊方塊，並在採石場開採 1,500 顆方塊。',
    descEn: 'Place at least 60 blocks in building zone and mine 1,500 blocks total.',
    requiredXp: 11000,
    coinReward: 6500,
    rewardDescZh: '+6,500 金幣、稱號「幽匿探險領主」',
    rewardDescEn: '+6,500 Coins, Title: Deep Dark Sovereign',
    targetType: 'place_blocks',
    targetValue: 60
  },
  {
    id: 'quest_lvl_11',
    level: 11,
    titleZh: '幽匿深穴傳奇神工',
    titleEn: 'Deep Dark Legend Artificer',
    descZh: '鎬具附魔總等級達 12 級以上，且累計完成超過 25 項成就。',
    descEn: 'Reach total pickaxe enchantment level of 12 and 25 achievements.',
    requiredXp: 16000,
    coinReward: 9000,
    rewardDescZh: '+9,000 金幣、全套神話戰略包',
    rewardDescEn: '+9,000 Coins, Mythic Supply Pack',
    targetType: 'achievements',
    targetValue: 25
  },
  {
    id: 'quest_lvl_12',
    level: 12,
    titleZh: '天界創世霸主',
    titleEn: 'Celestial Realm Overlord',
    descZh: '開採達 5,000 顆方塊，並持有超過 10,000 金幣。',
    descEn: 'Mine at least 5,000 blocks and hold at least 10,000 coins.',
    requiredXp: 24000,
    coinReward: 15000,
    rewardDescZh: '+15,000 金幣、頂級至尊尊爵稱號',
    rewardDescEn: '+15,000 Coins, Supreme Title',
    targetType: 'mine_blocks',
    targetValue: 5000
  }
];

export function getLevelQuest(level: number): LevelQuest {
  if (level < LEVEL_QUESTS.length) {
    return LEVEL_QUESTS[level];
  }

  // Dynamic procedural scaling for Level > 12
  const extraLevels = level - 12;
  const baseReqXp = 24000 + extraLevels * 12000;
  const baseReward = 15000 + extraLevels * 6000;
  const targetBlocks = 5000 + extraLevels * 2000;

  return {
    id: `quest_lvl_${level}`,
    level,
    titleZh: `傳奇造物者 第 ${level} 階修煉`,
    titleEn: `Legendary Creator Tier ${level}`,
    descZh: `累計開採達 ${targetBlocks.toLocaleString()} 顆方塊，展現無盡耐心與毅力。`,
    descEn: `Mine at least ${targetBlocks.toLocaleString()} blocks total.`,
    requiredXp: baseReqXp,
    coinReward: baseReward,
    rewardDescZh: `+${baseReward.toLocaleString()} 金幣、傳奇榮耀加護`,
    rewardDescEn: `+${baseReward.toLocaleString()} Coins, Legendary Glory`,
    targetType: 'mine_blocks',
    targetValue: targetBlocks
  };
}

export function getLevelTitle(level: number, isEn: boolean): string {
  const titlesZh = [
    '實習礦工',
    '碎石開拓者',
    '建築學徒',
    '繁榮行商',
    '附魔學士',
    '鐵血工程師',
    '蒸氣自動化先鋒',
    '熔岩地心征服者',
    '鑽石鍛造大師',
    '虛空建築巨匠',
    '幽匿探險領主',
    '天界神域神工',
    '天界創世霸主'
  ];

  const titlesEn = [
    'Novice Miner',
    'Stone Delver',
    'Apprentice Builder',
    'Prosperity Merchant',
    'Enchantment Scholar',
    'Ironclad Engineer',
    'Steam Automator',
    'Nether Core Vanquisher',
    'Diamond Grandmaster',
    'Void Master Architect',
    'Deep Dark Sovereign',
    'Celestial Artificer',
    'Celestial Overlord'
  ];

  if (level < titlesZh.length) {
    return isEn ? titlesEn[level] : titlesZh[level];
  }
  return isEn ? `Mythic Creator Lv.${level}` : `神話造物者 Lv.${level}`;
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
  let current = 0;
  const max = quest.targetValue;

  switch (quest.targetType) {
    case 'mine_blocks':
      current = stats.totalBlocksMined;
      break;
    case 'place_blocks':
      current = stats.totalBlocksPlaced;
      break;
    case 'pickaxe_tier':
      current = stats.pickaxeTier;
      break;
    case 'enchant_levels':
      current = stats.totalEnchants;
      break;
    case 'market_coins':
      current = stats.totalCoinsEarned;
      break;
    case 'strata_layer':
      current = stats.currentStrataIndex;
      break;
    case 'auto_miner':
      current = stats.hasAutoMiner ? 1 : 0;
      break;
    case 'coins_held':
      current = stats.coins;
      break;
    case 'achievements':
      current = stats.achievementsCount;
      break;
    default:
      current = stats.totalBlocksMined;
  }

  const isCompleted = current >= max;
  const progressPercent = Math.min(100, Math.round((Math.max(0, current) / Math.max(1, max)) * 100));
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
    default:
      return 2;
  }
}
