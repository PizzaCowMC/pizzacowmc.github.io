export interface BlockType {
  id: string;
  nameZh: string;
  nameEn: string;
  category: 'surface' | 'ore' | 'nether' | 'end' | 'deepslate' | 'gem' | 'deep_dark' | 'aether';
  hardness: number; // in seconds (base time to mine with bare hands)
  sellPrice: number; // in coins
  color: string;
  borderColor: string;
  iconText: string;
  description: string;
  // Visual styling or pixel map identifier
  pixelType: string;
}

export interface StrataLayer {
  id: string;
  nameZh: string;
  nameEn: string;
  order: number;
  requiredMinedToUnlock: number; // e.g., 100000 for layer > 0
  icon: string;
  accentColor: string;
  borderGlow: string;
  descZh: string;
  blockIds: string[];
}

export interface FestivalSupplyItem {
  id: string;
  festivalId: string;
  nameZh: string;
  nameEn: string;
  cost: number;
  iconEmoji: string;
  badge: string;
  descZh: string;
  effectType:
    | 'red_envelope'
    | 'firecracker'
    | 'fortune_dumpling'
    | 'halloween_candy'
    | 'jack_lantern'
    | 'phantom_cloak'
    | 'christmas_gift'
    | 'blizzard_core'
    | 'candy_cane'
    | 'mooncake'
    | 'rabbit_charm'
    | 'coconut_drink'
    | 'trident_surge';
}

export interface FestivalEvent {
  id: string;
  nameZh: string;
  nameEn: string;
  seasonEmoji: string;
  badge: string;
  periodDesc: string;
  bannerTitle: string;
  bannerDesc: string;
  accentColor: string;
  borderGlow: string;
  bgThemeId: string; // references ThemeBackground id
  particleType: 'snow' | 'lanterns' | 'sparks' | 'bats' | 'bubbles' | 'petals';
  bonusDesc: string;
  coinMultiplier: number;
  speedBonusPct: number;
  limitedSupplies: FestivalSupplyItem[];
}

export interface MarketInflationEvent {
  id: string;
  title: string;
  description: string;
  multiplier: number; // e.g., 1.5 = +50%, 2.2 = +120%, etc.
  type: 'hyper_inflation' | 'ore_boom' | 'construction_rush' | 'cosmic_surge' | 'deflation' | 'normal';
  durationSeconds: number;
  remainingSeconds: number;
  affectedCategories?: string[];
}

export interface PickaxeTier {
  id: string;
  nameZh: string;
  nameEn: string;
  tier: number;
  cost: number;
  speedMultiplier: number;
  maxDurability: number;
  color: string;
  bgGradient: string;
  desc: string;
}

export interface PickaxeState {
  currentTierId: string;
  currentDurability: number;
  efficiencyLevel: number; // +20% speed per level
  unbreakingLevel: number; // durability loss reduction
  fortuneLevel: number; // bonus yield chance
  isBroken: boolean;
}

export interface ThemeBackground {
  id: string;
  nameZh: string;
  nameEn: string;
  cost: number;
  bgCss: string;
  accentColor: string;
  previewColor: string;
  desc: string;
}

export interface ShopSupplyItem {
  id: string;
  nameZh: string;
  nameEn: string;
  cost: number;
  iconEmoji: string;
  badge: string;
  descZh: string;
  type: 'repair_oil' | 'haste_drink' | 'tnt_blast' | 'fortune_bag' | 'auto_miner';
}

export interface PlayerSkin {
  id: string;
  nameZh: string;
  nameEn: string;
  cost: number;
  avatarEmoji: string;
  badge: string;
  desc: string;
}

export type AchievementCategory = 'mining' | 'economy' | 'equipment' | 'building' | 'social' | 'collection';

export interface Achievement {
  id: string;
  category: AchievementCategory;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  icon: string;
  coinReward: number; // 0 if none, else > 0
  unlocked: boolean;
  rewardClaimed: boolean;
}

export interface Friend {
  code: string;
  username: string;
  isOnline: boolean;
  addedAt: number;
  level?: number;
}

export interface GameStats {
  totalClicks: number;
  totalBlocksMined: number;
  totalCoinsEarned: number;
  totalBlocksPlaced: number;
  totalBlocksSold: number;
  pickaxesPurchased: number;
  pickaxesRepaired: number;
  upgradesPurchased: number;
  themesUnlocked: number;
  friendsCount: number;
}
