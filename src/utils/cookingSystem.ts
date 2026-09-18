import { CafeDish, DishCategory, DishRarity, ActiveCookingTask } from '../types';

/**
 * 2.5.40 Cooking Duration & Kitchen Stove System
 * Rule: 越複雜越久(最低的也要等5秒, 最高可到10分鐘 = 600秒)
 */
export const MIN_COOKING_SECONDS = 5;       // 最低 5 秒
export const MAX_COOKING_SECONDS = 600;     // 最高 10 分鐘 (600 秒)
export const DEFAULT_STOVE_SLOTS = 4;       // 預設 4 口烹飪灶台
export const EXPANDED_STOVE_SLOTS = 6;      // 擴建後 6 口灶台

// Base complexity weights per culinary category (seconds)
const CATEGORY_BASE_SECONDS: Record<DishCategory, number> = {
  coffee: 5,           // 輕量飲品: 5s ~ 15s
  tea_beverage: 8,     // 茶飲泡製: 8s ~ 25s
  pastry: 18,          // 甜點烘焙: 18s ~ 60s
  hot_meal: 40,        // 地底熱食主餐: 40s ~ 120s
  void: 85,            // 終界虛空凝縮: 85s ~ 200s
  deep_dark: 150,      // 幽匿共振燉煮: 150s ~ 300s
  celestial: 240,      // 天界以太結晶: 240s ~ 420s
  singularity: 350,    // 時空奇點引力: 350s ~ 500s
  genesis: 450,        // 創世神域烹調: 450s ~ 560s
  mythic: 520          // 全知神話御膳: 520s ~ 600s (滿載達 10 分鐘)
};

// Rarity complexity multiplier
const RARITY_MULTIPLIERS: Record<DishRarity, number> = {
  common: 1.0,
  uncommon: 1.15,
  rare: 1.35,
  epic: 1.6,
  legendary: 1.85,
  mythic: 2.1
};

/**
 * Calculates exact cooking duration based on dish complexity, tier, ingredient counts, and batch size.
 * Guarantees result is clamped strictly between 5 seconds and 600 seconds (10 minutes).
 */
export function calculateCookingDuration(dish: CafeDish, count: number = 1): number {
  const baseCategorySeconds = CATEGORY_BASE_SECONDS[dish.category] || 10;
  const rarityMultiplier = RARITY_MULTIPLIERS[dish.rarity] || 1.0;

  // Mineral & ingredient complexity bonus (dishes with more ingredients take longer)
  const ingredientCount = dish.requiredIngredients.reduce((sum, r) => sum + r.count, 0);
  const ingredientBonus = ingredientCount * 2.5;

  // Recipe index progression bonus (#1 to #1000)
  const indexBonus = (dish.number / 1000) * 45;

  // Base duration for 1 serving
  let calculated = baseCategorySeconds * rarityMultiplier + ingredientBonus + indexBonus;

  // For batches (e.g. 5x), add slight parallel/batch duration
  if (count > 1) {
    calculated = calculated * (1 + (count - 1) * 0.12);
  }

  // Strictly clamp between 5 seconds and 600 seconds
  const rounded = Math.round(calculated);
  return Math.max(MIN_COOKING_SECONDS, Math.min(MAX_COOKING_SECONDS, rounded));
}

/**
 * Formats cooking duration into friendly human-readable string.
 * e.g. 5s -> "5秒" / "5s", 135s -> "2分15秒" / "2m 15s", 600s -> "10分鐘" / "10m 00s"
 */
export function formatCookingDuration(seconds: number, isEn: boolean = false): string {
  if (seconds < 60) {
    return isEn ? `${seconds}s` : `${seconds}秒`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return isEn ? `${minutes}m` : `${minutes}分鐘`;
  }
  return isEn
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}分${remainingSeconds}秒`;
}

/**
 * Checks and updates active cooking tasks status based on current timestamp
 */
export function refreshActiveCookingTasks(tasks: ActiveCookingTask[]): {
  updatedTasks: ActiveCookingTask[];
  hasNewlyCompleted: boolean;
} {
  const now = Date.now();
  let hasNewlyCompleted = false;

  const updatedTasks = tasks.map(task => {
    if (task.status === 'cooking' && now >= task.finishAt) {
      hasNewlyCompleted = true;
      return { ...task, status: 'ready' as const };
    }
    return task;
  });

  return { updatedTasks, hasNewlyCompleted };
}

/**
 * Generates an active cooking task
 */
export function createCookingTask(dish: CafeDish, count: number = 1): ActiveCookingTask {
  const durationSeconds = calculateCookingDuration(dish, count);
  const now = Date.now();
  return {
    id: `cook_${now}_${Math.random().toString(36).substring(2, 7)}`,
    dishId: dish.id,
    count,
    totalDurationSeconds: durationSeconds,
    startedAt: now,
    finishAt: now + durationSeconds * 1000,
    status: 'cooking'
  };
}
