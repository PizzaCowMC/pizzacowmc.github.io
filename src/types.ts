export interface BlockType {
  id: string;
  nameZh: string;
  nameEn: string;
  category: 'surface' | 'ore' | 'nether' | 'end' | 'deepslate' | 'gem' | 'deep_dark' | 'aether' | 'singularity' | 'genesis';
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

export interface LevelQuest {
  id: string;
  level: number;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  requiredXp: number;
  coinReward: number;
  rewardDescZh: string;
  rewardDescEn: string;
  targetType: 'mine_blocks' | 'place_blocks' | 'pickaxe_tier' | 'enchant_levels' | 'market_coins' | 'strata_layer' | 'auto_miner' | 'coins_held' | 'achievements';
  targetValue: number;
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

export type DishCategory =
  | 'coffee'
  | 'tea_beverage'
  | 'pastry'
  | 'hot_meal'
  | 'void'
  | 'deep_dark'
  | 'celestial'
  | 'singularity'
  | 'genesis'
  | 'mythic';

export type DishRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface CafeDish {
  id: string; // 'dish_1' ~ 'dish_1000'
  number: number; // 1 ~ 1000
  nameZh: string;
  nameEn: string;
  category: DishCategory;
  rarity: DishRarity;
  sellPrice: number;
  xpReward: number;
  icon: string;
  requiredIngredients: { blockId: string; count: number }[];
  descZh: string;
  descEn: string;
}

export interface CustomerOrder {
  id: string;
  customerNameZh: string;
  customerNameEn: string;
  customerAvatar: string;
  customerType: string;
  tableIndex: number;
  dishId: string;
  patienceTotal: number;
  patienceRemaining: number;
  tipMultiplier: number;
  status: 'waiting' | 'eating' | 'finished';
  dialogueZh: string;
  dialogueEn: string;
}

export type StarRank =
  | 'F1' | 'F2' | 'F3'
  | 'E1' | 'E2' | 'E3'
  | 'D1' | 'D2' | 'D3'
  | 'C1' | 'C2' | 'C3'
  | 'B1' | 'B2' | 'B3'
  | 'A1' | 'A2' | 'A3'
  | 'S1' | 'S2' | 'S3';

export type CafeFloorId = '1F' | '2F' | '3F' | 'rooftop';
export type CafeVenueId = 'main' | 'branch_2';

export type CafeRoleId =
  | 'manager'       // 店長
  | 'barista'       // 首席咖啡師
  | 'chef'          // 紅石主廚
  | 'waiter'        // 外場領班
  | 'mixologist'    // 蒸氣調酒師
  | 'sommelier'     // 神域品鑑官
  | 'procurement';   // 地底採購專員

export type StaffRank = 'Junior' | 'Senior' | 'Master' | 'Grandmaster' | 'Mythic';

export interface StaffMember {
  id: string;
  nameZh: string;
  nameEn: string;
  avatar: string;
  roleId: CafeRoleId;
  level: number;
  rank: StaffRank;
  assignedVenue: CafeVenueId;
  assignedStation: string;
  isCrossDispatched: boolean; // 是否正在跨請/跨樓調度支援
  crossDispatchTarget?: string; // 跨請目的地 (例如: '2F 閣樓' 或 '二號分館・星空祕境')
  hireCost: number;
  isHired: boolean;
  isGuestLegend?: boolean; // 異次元/跨界特聘傳奇顧問
  legendTitleZh?: string;
  legendTitleEn?: string;
  efficiencyBonus: number; // % bonus
}

export interface CafePromotionQuest {
  id: string;
  rankLevel: number;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  targetType:
    | 'dishes_served'
    | 'mined_blocks'
    | 'staff_count'
    | 'master_staff'
    | 'coins_earned'
    | 'facility_stars'
    | 'cross_dispatch'
    | 'branch2_served';
  targetValue: number;
  rewardCoins: number;
  rewardReputation: number;
}

export interface CafePromotionTier {
  rank: number;
  nameZh: string;
  nameEn: string;
  badge: string;
  icon: string;
  titleHonorZh: string;
  titleHonorEn: string;
  tipMultiplierBonus: number;
  passiveDividendBonus: number;
  requiredQuests: CafePromotionQuest[];
}

export interface CafeFacility {
  id: string;
  floorId: CafeFloorId;
  nameZh: string;
  nameEn: string;
  icon: string;
  descZh: string;
  descEn: string;
  category: 'espresso' | 'dining' | 'pastry' | 'brew' | 'bakery' | 'lounge' | 'tea' | 'vip' | 'bar' | 'stage';
  decorEmoji: string;
  gridArea: string; // CSS position
}

export interface CafeState {
  cafeLevel: number;
  cafeXp: number;
  reputation: number;
  totalDishesServed: number;
  unlockedTables: number;
  dishInventory: Record<string, number>;
  dishesCookedHistory: Record<string, number>;
  hasAutoWaiter: boolean;
  hasGoldenStove: boolean;
  hasAromaDiffuser: boolean;
  facilityStars?: Record<string, StarRank>;
  currentFloorView?: CafeFloorId;
  // v2.5.40 Promotions, Roles, Map & Cross-Hire
  promotionRank?: number; // 1 to 7
  completedPromotionQuests?: Record<string, boolean>;
  staffMembers?: StaffMember[];
  crossDispatchHistoryCount?: number;
  currentVenue?: CafeVenueId;
  branch2Unlocked?: boolean;
  branch2Reputation?: number;
}

export type OverworldZone = 'overworld' | 'cafe' | 'quarry' | 'elevator' | 'building';

export interface MapPosition {
  x: number; // 0 to 100 %
  y: number; // 0 to 100 %
  facing: 'left' | 'right' | 'up' | 'down';
  isMoving: boolean;
}

