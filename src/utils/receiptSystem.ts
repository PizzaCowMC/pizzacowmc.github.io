import { CafeReceipt, CafeDish, CustomerOrder, StarRank, CafeVenueId } from '../types';
import { calculateCookingDuration, formatCookingDuration } from './cookingSystem';

const RECEIPTS_STORAGE_KEY = 'minecraft_cafe_receipts_v2540';
const MAX_STORED_RECEIPTS = 200;

export interface ReceiptsSummary {
  totalGrossCoins: number;
  totalReceiptsCount: number;
  totalDishesCount: number;
  averageTicketCoins: number;
  totalTipsEarned: number;
  totalXpEarned: number;
  topCategoryZh: string;
  topCategoryEn: string;
}

/**
 * Load all receipts from localStorage
 */
export function getStoredReceipts(): CafeReceipt[] {
  try {
    const raw = localStorage.getItem(RECEIPTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to load receipts:', err);
    return [];
  }
}

/**
 * Save a new receipt to localStorage with FIFO limit
 */
export function saveStoredReceipt(receipt: CafeReceipt): CafeReceipt[] {
  try {
    const current = getStoredReceipts();
    const updated = [receipt, ...current].slice(0, MAX_STORED_RECEIPTS);
    localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save receipt:', err);
    return [];
  }
}

/**
 * Clear all receipts
 */
export function clearStoredReceipts(): void {
  try {
    localStorage.removeItem(RECEIPTS_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear receipts:', err);
  }
}

/**
 * Generates an official sequential or stamped receipt number
 */
export function generateReceiptNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `RCP-${y}${m}${d}-${randomSuffix}`;
}

/**
 * Constructs a comprehensive CafeReceipt from order fulfillment data
 */
export function createCafeReceipt(params: {
  order: CustomerOrder;
  dish: CafeDish;
  venue: CafeVenueId;
  basePrice: number;
  starRank: StarRank;
  starPriceBonusPct: number;
  tipMultiplier: number;
  speedBonus: number;
  staffBonusMultiplier: number;
  totalEarnings: number;
  patienceRemaining: number;
  patienceTotal: number;
}): CafeReceipt {
  const {
    order,
    dish,
    venue,
    basePrice,
    starRank,
    starPriceBonusPct,
    tipMultiplier,
    speedBonus,
    staffBonusMultiplier,
    totalEarnings,
    patienceRemaining,
    patienceTotal
  } = params;

  const cookingSecs = calculateCookingDuration(dish, 1);
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateFormatted = now.toLocaleDateString();

  const tableNum = order.tableIndex + 1;
  const tableLabelZh = venue === 'branch_2' ? `二號分館・星空席 #${tableNum}` : `${Math.ceil(tableNum / 4)}F 客席 #${tableNum}`;
  const tableLabelEn = venue === 'branch_2' ? `Branch #2 Table #${tableNum}` : `Floor ${Math.ceil(tableNum / 4)} Table #${tableNum}`;

  const patiencePct = Math.round((patienceRemaining / Math.max(1, patienceTotal)) * 100);

  return {
    id: `rcp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    receiptNumber: generateReceiptNumber(),
    timestamp: `${dateFormatted} ${timeFormatted}`,
    orderId: order.id,
    customerNameZh: order.customerNameZh,
    customerNameEn: order.customerNameEn,
    customerAvatar: order.customerAvatar,
    customerType: order.customerType,
    tableIndex: order.tableIndex,
    tableLabelZh,
    tableLabelEn,
    venue,
    dishId: dish.id,
    dishNameZh: dish.nameZh,
    dishNameEn: dish.nameEn,
    dishIcon: dish.icon,
    dishNumber: dish.number,
    dishCategory: dish.category,
    dishRarity: dish.rarity,
    quantity: 1,
    cookingDurationSeconds: cookingSecs,
    cookingDurationFormattedZh: formatCookingDuration(cookingSecs, false),
    cookingDurationFormattedEn: formatCookingDuration(cookingSecs, true),
    ingredients: dish.requiredIngredients,
    basePrice,
    starPriceBonusPct,
    starRank,
    tipMultiplier,
    speedBonus,
    staffBonusMultiplier,
    totalEarnings,
    xpEarned: dish.xpReward,
    patienceAtServe: patiencePct,
    status: 'PAID'
  };
}

/**
 * Calculates aggregate summary metrics from receipt logs
 */
export function calculateReceiptsSummary(receipts: CafeReceipt[]): ReceiptsSummary {
  if (receipts.length === 0) {
    return {
      totalGrossCoins: 0,
      totalReceiptsCount: 0,
      totalDishesCount: 0,
      averageTicketCoins: 0,
      totalTipsEarned: 0,
      totalXpEarned: 0,
      topCategoryZh: '尚無資料',
      topCategoryEn: 'None'
    };
  }

  let totalGross = 0;
  let totalDishes = 0;
  let totalTips = 0;
  let totalXp = 0;
  const categoryCounts: Record<string, number> = {};

  for (const r of receipts) {
    totalGross += r.totalEarnings;
    totalDishes += r.quantity;
    totalXp += r.xpEarned;
    // Estimated tips = totalEarnings - basePrice * (1 + bonus)
    const baseWithStar = Math.round(r.basePrice * (1 + r.starPriceBonusPct / 100));
    const tips = Math.max(0, r.totalEarnings - baseWithStar);
    totalTips += tips;

    categoryCounts[r.dishCategory] = (categoryCounts[r.dishCategory] || 0) + 1;
  }

  // Find top category
  let topCat = 'coffee';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topCat = cat;
    }
  }

  const categoryNameMap: Record<string, { zh: string; en: string }> = {
    coffee: { zh: '咖啡工坊', en: 'Coffee Roastery' },
    tea_beverage: { zh: '特調茶飲', en: 'Tea Beverage' },
    pastry: { zh: '精緻烘焙', en: 'Pastry & Bakery' },
    hot_meal: { zh: '地底熱食', en: 'Hot Kitchen' },
    void: { zh: '終界虛空', en: 'Void Realm' },
    deep_dark: { zh: '幽匿深穴', en: 'Deep Dark' },
    celestial: { zh: '天界以太', en: 'Celestial Aether' },
    singularity: { zh: '時空奇點', en: 'Singularity' },
    genesis: { zh: '創世神域', en: 'Genesis Core' },
    mythic: { zh: '全知神話', en: 'Apex Mythic' }
  };

  return {
    totalGrossCoins: totalGross,
    totalReceiptsCount: receipts.length,
    totalDishesCount: totalDishes,
    averageTicketCoins: Math.round(totalGross / receipts.length),
    totalTipsEarned: totalTips,
    totalXpEarned: totalXp,
    topCategoryZh: categoryNameMap[topCat]?.zh || topCat,
    topCategoryEn: categoryNameMap[topCat]?.en || topCat
  };
}
