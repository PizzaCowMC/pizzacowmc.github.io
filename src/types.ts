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
  requiredMinedToUnlock: number; // e.g., 50000 for layer > 0
  icon: string;
  accentColor: string;
  borderGlow: string;
  descZh: string;
  blockIds: string[];
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

export type ToolType = 'pickaxe' | 'axe' | 'shovel' | 'sword';

export interface AxeTier {
  id: string;
  nameZh: string;
  nameEn: string;
  tier: number;
  cost: number;
  speedMultiplier: number; // For chopping wood/logs
  attackDamage: number;
  maxDurability: number;
  color: string;
  bgGradient: string;
  desc: string;
}

export interface ShovelTier {
  id: string;
  nameZh: string;
  nameEn: string;
  tier: number;
  cost: number;
  speedMultiplier: number; // For digging dirt/sand/gravel
  maxDurability: number;
  color: string;
  bgGradient: string;
  desc: string;
}

export interface SwordTier {
  id: string;
  nameZh: string;
  nameEn: string;
  tier: number;
  cost: number;
  attackDamage: number;
  critChance: number; // e.g. 0.15 = 15%
  maxDurability: number;
  color: string;
  bgGradient: string;
  desc: string;
}

export interface MonsterData {
  id: string;
  nameZh: string;
  nameEn: string;
  iconEmoji: string;
  maxHp: number;
  currentHp: number;
  coinReward: number;
  dropItemId?: string;
  dropItemNameZh?: string;
  dropItemNameEn?: string;
  dropAmount?: number;
  descZh: string;
  descEn: string;
  bgGradient: string;
  rarity: 'common' | 'rare' | 'elite' | 'boss';
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
  descEn?: string;
  type: string;
  festivalTag?: string;
}

export interface FestivalEvent {
  id: string;
  nameZh: string;
  nameEn: string;
  icon: string;
  bannerTitle: string;
  bannerTitleEn?: string;
  descZh: string;
  descEn?: string;
  themeId: string;
  specialPickaxeId: string;
  activePeriodZh: string;
  activePeriodEn?: string;
  particleType: 'snow' | 'pumpkin' | 'firecracker' | 'sakura' | 'summer';
  themeBg: ThemeBackground;
  specialPickaxe: PickaxeTier;
  specialItems: ShopSupplyItem[];
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
