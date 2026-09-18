import React, { useState, useEffect, useMemo, useCallback } from "react";
import { sound } from "../utils/soundEffects";
import { CafeDish, CustomerOrder, CafeState, DishCategory, DishRarity, CafeFloorId, CafeFacility, StarRank, ActiveCookingTask, CafeReceipt } from "../types";
import { ALL_CAFE_DISHES, CUSTOMER_ARCHETYPES, CustomerArchetype, getDishById } from "../data/cafeDishesData";
import { BLOCK_TYPES, STRATA_LAYERS } from "../data/gameData";
import {
  CAFE_FLOORS,
  CAFE_FACILITIES,
  getRankInfo,
  getNextRank,
  calculateTotalCafeStarBonuses
} from "../data/cafeFacilitiesData";
import { CafeFloorVisualizer } from "./CafeFloorVisualizer";
import { FacilityUpgradeModal } from "./FacilityUpgradeModal";
import { CafeStarOverviewModal } from "./CafeStarOverviewModal";
import { CafeFloorBlueprintMap } from "./CafeFloorBlueprintMap";
import { CafeStaffModal } from "./CafeStaffModal";
import { CafePromotionModal } from "./CafePromotionModal";
import { ReceiptsModal } from "./ReceiptsModal";
import {
  calculateCookingDuration,
  formatCookingDuration,
  DEFAULT_STOVE_SLOTS,
  EXPANDED_STOVE_SLOTS,
  createCookingTask,
  refreshActiveCookingTasks
} from "../utils/cookingSystem";
import {
  getStoredReceipts,
  saveStoredReceipt,
  createCafeReceipt
} from "../utils/receiptSystem";
import { INITIAL_STAFF_MEMBERS, getPromotionTier } from "../data/cafeStaffAndPromotionData";
import {
  Coffee,
  Utensils,
  Search,
  Sparkles,
  Heart,
  Coins,
  Clock,
  Check,
  TrendingUp,
  Flame,
  Award,
  BookOpen,
  Filter,
  Plus,
  Zap,
  ChevronRight,
  Smile,
  ShieldCheck,
  Layers,
  Map as MapIcon,
  Users,
  Trophy,
  Crown,
  Receipt
} from "lucide-react";

interface CafeInteriorProps {
  cafeState: CafeState;
  onUpdateCafeState: (updater: (prev: CafeState) => CafeState) => void;
  inventory: Record<string, number>;
  onConsumeIngredients: (ingredients: { blockId: string; count: number }[]) => boolean;
  coins: number;
  onAddCoins: (amount: number) => void;
  isEn: boolean;
  onGoToQuarry: () => void;
  onGoToMap: () => void;
  layerMinedCounts?: Record<string, number>;
  onOpenEncyclopedia?: () => void;
  onOpenMusicPlayer?: () => void;
  totalBlocksMined?: number;
  ownedOutfits?: string[];
}

const CATEGORY_TABS: { id: DishCategory | "all"; nameZh: string; nameEn: string; icon: string; count: number }[] = [
  { id: "all", nameZh: "全部 1,000 道餐點", nameEn: "All 1,000 Dishes", icon: "🍽️", count: 1000 },
  { id: "coffee", nameZh: "濃縮與調和咖啡", nameEn: "Coffee & Brews", icon: "☕", count: 100 },
  { id: "tea_beverage", nameZh: "礦物果茶與特調", nameEn: "Mineral Teas", icon: "🍹", count: 100 },
  { id: "pastry", nameZh: "手工烘焙與甜點", nameEn: "Pastries & Sweets", icon: "🍰", count: 100 },
  { id: "hot_meal", nameZh: "地底熱食主餐", nameEn: "Hot Meals", icon: "🍜", count: 100 },
  { id: "void", nameZh: "終界虛空幻境", nameEn: "Void Delicacies", icon: "🌌", count: 100 },
  { id: "deep_dark", nameZh: "幽匿深穴秘境", nameEn: "Deep Dark Echoes", icon: "🍄", count: 100 },
  { id: "celestial", nameZh: "天界以太盛宴", nameEn: "Celestial Aether", icon: "⭐", count: 100 },
  { id: "singularity", nameZh: "時空奇點未來料理", nameEn: "Chrono Singularity", icon: "⏳", count: 100 },
  { id: "genesis", nameZh: "創世神域御膳", nameEn: "Genesis Core", icon: "🪐", count: 100 },
  { id: "mythic", nameZh: "全知全能神話特盛", nameEn: "Apex Mythic", icon: "👑", count: 100 }
];

export const CafeInterior: React.FC<CafeInteriorProps> = ({
  cafeState,
  onUpdateCafeState,
  inventory,
  onConsumeIngredients,
  coins,
  onAddCoins,
  isEn,
  onGoToQuarry,
  onGoToMap,
  layerMinedCounts = {},
  onOpenEncyclopedia,
  onOpenMusicPlayer,
  totalBlocksMined = 0,
  ownedOutfits = ['classic_miner']
}) => {
  const [activeTab, setActiveTab] = useState<"map" | "dining" | "kitchen" | "facilities_stars" | "upgrades">("map");
  const [currentFloor, setCurrentFloor] = useState<CafeFloorId>(cafeState.currentFloorView || "1F");
  const [selectedFacility, setSelectedFacility] = useState<CafeFacility | null>(null);
  const [showStarOverviewModal, setShowStarOverviewModal] = useState<boolean>(false);
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<DishCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyCraftable, setOnlyCraftable] = useState<boolean>(false);
  const [cookingToast, setCookingToast] = useState<string | null>(null);

  // 2.5.40 Receipts System & Live Cooking Stoves
  const [receipts, setReceipts] = useState<CafeReceipt[]>(() => getStoredReceipts());
  const [showReceiptsModal, setShowReceiptsModal] = useState<boolean>(false);
  const [nowTime, setNowTime] = useState<number>(Date.now());

  // Customer Orders per Table (16 total: 4 per floor, or 12 for blueprint map)
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  // 1-second cooking ticker to update countdowns and stove progress
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
      onUpdateCafeState(prev => {
        const tasks = prev.activeCookingTasks || [];
        if (tasks.length === 0) return prev;
        const { updatedTasks, hasNewlyCompleted } = refreshActiveCookingTasks(tasks);
        if (hasNewlyCompleted) {
          sound.playAchievementSound();
        }
        return {
          ...prev,
          activeCookingTasks: updatedTasks
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onUpdateCafeState]);

  // Calculate Cafe Total Bonuses from Facility Star Ratings (F1 ~ S3)
  const totalBonuses = useMemo(() => {
    return calculateTotalCafeStarBonuses(cafeState.facilityStars || {});
  }, [cafeState.facilityStars]);

  // Current Promotion Rank & Tier
  const currentPromotionTier = useMemo(() => {
    return getPromotionTier(cafeState.promotionRank || 1);
  }, [cafeState.promotionRank]);

  // Block map for ingredient info
  const blockMap = useMemo(() => new Map(BLOCK_TYPES.map(b => [b.id, b])), []);

  // Compute set of block IDs from currently unlocked strata
  const unlockedBlockIds = useMemo(() => {
    const ids = new Set<string>();
    STRATA_LAYERS.forEach((layer, index) => {
      const prevLayer = STRATA_LAYERS[index - 1];
      const requiredMined = layer.requiredMinedToUnlock || 0;
      const isUnlocked = index === 0 || (prevLayer && (layerMinedCounts[prevLayer.id] || 0) >= requiredMined);
      if (isUnlocked) {
        layer.blockIds.forEach(id => ids.add(id));
      }
    });
    return ids;
  }, [layerMinedCounts]);

  // Filter dishes strictly based on ingredients from unlocked strata
  const unlockedStrataDishes = useMemo(() => {
    const matched = ALL_CAFE_DISHES.filter(d =>
      d.requiredIngredients.every(req => unlockedBlockIds.has(req.blockId))
    );
    return matched.length > 0 ? matched : ALL_CAFE_DISHES;
  }, [unlockedBlockIds]);

  // Passive Dividend Coins Accumulation (Runs every 3 seconds from Facility Star Ratings)
  useEffect(() => {
    if (totalBonuses.totalPassiveCoins <= 0) return;
    const interval = setInterval(() => {
      onAddCoins(totalBonuses.totalPassiveCoins);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalBonuses.totalPassiveCoins, onAddCoins]);

  // Generate a random customer order for a specific table
  const generateCustomerForTable = useCallback((tableIndex: number): CustomerOrder => {
    const archetype = CUSTOMER_ARCHETYPES[Math.floor(Math.random() * CUSTOMER_ARCHETYPES.length)];
    // Filter dishes based on cafe level and strictly from unlocked strata ingredients
    const maxNumber = Math.min(1000, Math.max(100, cafeState.cafeLevel * 45 + 50));
    let candidateDishes = unlockedStrataDishes.filter(d => d.number <= maxNumber);
    if (candidateDishes.length === 0) {
      candidateDishes = unlockedStrataDishes;
    }
    const chosenDish = candidateDishes[Math.floor(Math.random() * candidateDishes.length)] || unlockedStrataDishes[0];

    // Floor-specific dialogues customization
    let dialogueZh = archetype.dialoguesZh[Math.floor(Math.random() * archetype.dialoguesZh.length)];
    let dialogueEn = archetype.dialoguesEn[Math.floor(Math.random() * archetype.dialoguesEn.length)];

    if (tableIndex >= 4 && tableIndex < 8) {
      // 2F Loft
      const loftZh = ["2樓閣樓的烘焙香氣太誘人了！", "在絲絨沙發上看附魔古籍，邊吃下午茶真享受！", "水耕花園的微光讓整個人都放鬆了。"];
      const loftEn = ["The 2F loft bakery aroma is heavenly!", "Relaxing on velvet couches reading enchanting books.", "The hydroponic flora glows so warmly."];
      dialogueZh = loftZh[Math.floor(Math.random() * loftZh.length)];
      dialogueEn = loftEn[Math.floor(Math.random() * loftEn.length)];
    } else if (tableIndex >= 8 && tableIndex < 12) {
      // 3F VIP
      const vipZh = ["黑曜石茶道台沖泡的高山茶回甘無窮！", "紫晶天窗灑落的星光格外優雅璀璨。", "幽匿風鈴的共鳴頻率真讓人心神寧靜。"];
      const vipEn = ["Obsidian tea ceremony brew has exquisite depth!", "Starlight pouring through amethyst skylights is pure royalty.", "Sculk harmonic chimes soothe the soul."];
      dialogueZh = vipZh[Math.floor(Math.random() * vipZh.length)];
      dialogueEn = vipEn[Math.floor(Math.random() * vipEn.length)];
    } else if (tableIndex >= 12) {
      // Rooftop Bar
      const skyZh = ["在高空露天酒吧吹風喝特調發光雞尾酒，太讚了！", "坐在地獄岩營火旁聽現場爵士樂，超有氛圍！", "這是全服最棒的星空觀景台，乾杯！"];
      const skyEn = ["Sipping glowing cocktails under the open sky!", "Warm netherrack fire pit and skyline live jazz!", "Best rooftop view in the entire server, cheers!"];
      dialogueZh = skyZh[Math.floor(Math.random() * skyZh.length)];
      dialogueEn = skyEn[Math.floor(Math.random() * skyEn.length)];
    }

    const basePatience = (cafeState.hasAromaDiffuser ? 90 : 60) + totalBonuses.totalPatienceBonusSec;

    return {
      id: `order_${Date.now()}_${tableIndex}_${Math.random()}`,
      customerNameZh: archetype.nameZh,
      customerNameEn: archetype.nameEn,
      customerAvatar: archetype.avatar,
      customerType: archetype.type,
      tableIndex,
      dishId: chosenDish.id,
      patienceTotal: basePatience,
      patienceRemaining: basePatience,
      tipMultiplier: archetype.generosity,
      status: "waiting",
      dialogueZh,
      dialogueEn
    };
  }, [cafeState.cafeLevel, cafeState.hasAromaDiffuser, totalBonuses.totalPatienceBonusSec, unlockedStrataDishes]);

  // Initial customer population: 16 tables across 4 floors
  useEffect(() => {
    setOrders(prev => {
      const newOrders = [...prev];
      for (let i = 0; i < 16; i++) {
        if (!newOrders.some(o => o.tableIndex === i)) {
          newOrders.push(generateCustomerForTable(i));
        }
      }
      return newOrders.slice(0, 16);
    });
  }, [generateCustomerForTable]);

  // Check if player has all ingredients for a dish
  const canCraftDish = useCallback((dish: CafeDish, multiplier: number = 1): boolean => {
    return dish.requiredIngredients.every(req => {
      const owned = inventory[req.blockId] || 0;
      return owned >= req.count * multiplier;
    });
  }, [inventory]);

  // 2.5.40 Start Cooking on Stove (Cooking Duration 5s ~ 600s / 10 mins based on complexity)
  const handleStartCooking = useCallback((dish: CafeDish, count: number = 1) => {
    const maxStoveSlots = cafeState.hasGoldenStove ? EXPANDED_STOVE_SLOTS : DEFAULT_STOVE_SLOTS;
    const currentTasks = cafeState.activeCookingTasks || [];

    if (currentTasks.length >= maxStoveSlots) {
      sound.playHitSound(1);
      setCookingToast(
        isEn
          ? `⚠️ All ${maxStoveSlots} cooking stoves are busy! Collect finished dishes first.`
          : `⚠️ 所有 ${maxStoveSlots} 口烹飪灶台都在使用中！請先收取已完成的料理。`
      );
      setTimeout(() => setCookingToast(null), 2500);
      return;
    }

    const totalIngredients = dish.requiredIngredients.map(r => ({
      blockId: r.blockId,
      count: r.count * count
    }));

    const success = onConsumeIngredients(totalIngredients);
    if (!success) {
      sound.playHitSound(1);
      setCookingToast(isEn ? "❌ Missing required quarry ingredients!" : "❌ 缺少材料，無法開火烹飪！");
      setTimeout(() => setCookingToast(null), 2000);
      return;
    }

    sound.playPlaceBlockSound();
    const newTask = createCookingTask(dish, count);

    onUpdateCafeState(prev => ({
      ...prev,
      activeCookingTasks: [...(prev.activeCookingTasks || []), newTask]
    }));

    const durationText = formatCookingDuration(newTask.totalDurationSeconds, isEn);
    setCookingToast(
      isEn
        ? `🔥 Cooking ${count}x ${dish.nameEn} on Stove! Duration: ${durationText}`
        : `🔥 已放入灶台烹飪【${dish.nameZh}】x${count}！耗時: ${durationText}`
    );
    setTimeout(() => setCookingToast(null), 3000);
  }, [cafeState.hasGoldenStove, cafeState.activeCookingTasks, onConsumeIngredients, onUpdateCafeState, isEn]);

  // Collect a finished dish from stove
  const handleClaimCookingTask = useCallback((task: ActiveCookingTask) => {
    const dish = getDishById(task.dishId);
    if (!dish) return;

    sound.playUpgradeSound();

    onUpdateCafeState(prev => {
      const currentStock = prev.dishInventory[dish.id] || 0;
      const currentHistory = prev.dishesCookedHistory[dish.id] || 0;
      const nextXp = prev.cafeXp + dish.xpReward * task.count;
      const nextLevel = Math.min(100, Math.floor(nextXp / 150) + 1);
      const remaining = (prev.activeCookingTasks || []).filter(t => t.id !== task.id);

      return {
        ...prev,
        cafeLevel: nextLevel,
        cafeXp: nextXp,
        activeCookingTasks: remaining,
        dishInventory: {
          ...prev.dishInventory,
          [dish.id]: currentStock + task.count
        },
        dishesCookedHistory: {
          ...prev.dishesCookedHistory,
          [dish.id]: currentHistory + task.count
        }
      };
    });

    setCookingToast(
      isEn
        ? `🍲 Cooked & collected ${task.count}x ${dish.nameEn}! (+${dish.xpReward * task.count} XP)`
        : `🍲 烹飪出爐！成功收取 ${task.count} 份【${dish.nameZh}】！(+${dish.xpReward * task.count} 經驗)`
    );
    setTimeout(() => setCookingToast(null), 3000);
  }, [onUpdateCafeState, isEn]);

  // Collect all ready dishes from stoves
  const handleClaimAllReadyTasks = useCallback(() => {
    const tasks = cafeState.activeCookingTasks || [];
    const readyTasks = tasks.filter(t => t.status === 'ready' || Date.now() >= t.finishAt);
    if (readyTasks.length === 0) return;

    sound.playUpgradeSound();

    onUpdateCafeState(prev => {
      let nextXp = prev.cafeXp;
      const newInventory = { ...prev.dishInventory };
      const newHistory = { ...prev.dishesCookedHistory };

      for (const t of readyTasks) {
        const d = getDishById(t.dishId);
        if (d) {
          nextXp += d.xpReward * t.count;
          newInventory[d.id] = (newInventory[d.id] || 0) + t.count;
          newHistory[d.id] = (newHistory[d.id] || 0) + t.count;
        }
      }

      const nextLevel = Math.min(100, Math.floor(nextXp / 150) + 1);
      const remaining = (prev.activeCookingTasks || []).filter(
        t => !(t.status === 'ready' || Date.now() >= t.finishAt)
      );

      return {
        ...prev,
        cafeLevel: nextLevel,
        cafeXp: nextXp,
        activeCookingTasks: remaining,
        dishInventory: newInventory,
        dishesCookedHistory: newHistory
      };
    });

    setCookingToast(
      isEn
        ? `🍲 Collected all ${readyTasks.length} finished dishes from stoves!`
        : `🍲 已一鍵收取所有 ${readyTasks.length} 道已完成烹飪的料理！`
    );
    setTimeout(() => setCookingToast(null), 3000);
  }, [cafeState.activeCookingTasks, onUpdateCafeState, isEn]);

  // Cook a dish directly (or instant rush)
  const handleCookDish = useCallback((dish: CafeDish, count: number = 1) => {
    handleStartCooking(dish, count);
  }, [handleStartCooking]);

  // Serve meal to customer (includes facility star price, staff roles, promotion bonuses, and 2.5.40 receipt generation!)
  const handleServeOrder = useCallback((order: CustomerOrder) => {
    const dish = getDishById(order.dishId);
    if (!dish) return;

    const staffList = cafeState.staffMembers || INITIAL_STAFF_MEMBERS;
    const hiredStaff = staffList.filter(s => s.isHired);
    const hasManager = hiredStaff.some(s => s.roleId === 'manager');
    const hasBarista = hiredStaff.some(s => s.roleId === 'barista');
    const hasSommelier = hiredStaff.some(s => s.roleId === 'sommelier');
    const hasMixologist = hiredStaff.some(s => s.roleId === 'mixologist');
    const hasEnderDuke = hiredStaff.some(s => s.id === 'legend_ender_duke');
    const hasMagmaBaker = hiredStaff.some(s => s.id === 'legend_dwarf_baker');
    const hasAetherChef = hiredStaff.some(s => s.id === 'legend_aether_chef');

    const inStock = (cafeState.dishInventory[order.dishId] || 0) > 0;

    // If not in stock, check if we can instant-cook
    if (!inStock) {
      if (!canCraftDish(dish, 1)) {
        sound.playHitSound(1);
        setCookingToast(isEn ? "❌ Missing required quarry ingredients to prepare this dish!" : "❌ 缺少礦坑食材，無法即刻烹飪！");
        setTimeout(() => setCookingToast(null), 2000);
        return;
      }
      // Aether Chef perk: 40% chance free ingredients
      if (!hasAetherChef || Math.random() >= 0.4) {
        onConsumeIngredients(dish.requiredIngredients);
      }
    } else {
      // Consume from ready stock
      onUpdateCafeState(prev => ({
        ...prev,
        dishInventory: {
          ...prev.dishInventory,
          [order.dishId]: Math.max(0, (prev.dishInventory[order.dishId] || 1) - 1)
        }
      }));
    }

    // Calculate Base Price & Magma Baker pastry perk (+150%)
    let basePrice = dish.sellPrice;
    if (hasMagmaBaker && dish.category === 'pastry') {
      basePrice = Math.round(basePrice * 2.5);
    }

    // Calculate Payment + Star Rating Bonuses + Speed Bonus Tip + Promotion Rank Tip
    const patienceRatio = order.patienceRemaining / order.patienceTotal;
    const speedBonus = patienceRatio > 0.6 ? 1.5 : patienceRatio > 0.3 ? 1.2 : 1.0;

    const priceWithStarBonus = Math.round(basePrice * (1 + totalBonuses.totalSellPriceBonusPct / 100));

    // Staff tip bonuses
    const staffTipBonus =
      (hasBarista && (dish.category === 'coffee' || dish.category === 'tea_beverage') ? 1.0 : 0) +
      (hasMixologist && (dish.category === 'void' || dish.category === 'deep_dark') ? 1.2 : 0) +
      (hasEnderDuke ? 1.5 : 0);

    const promotionTipBonus = currentPromotionTier.tipMultiplierBonus || 0;

    const effectiveTipMultiplier =
      order.tipMultiplier +
      totalBonuses.totalTipMultiplierBonus +
      promotionTipBonus +
      staffTipBonus;

    // Staff revenue multipliers
    const managerMultiplier = hasManager ? 1.25 : 1.0;
    const sommelierMultiplier = hasSommelier ? 1.35 : 1.0;

    const totalEarnings = Math.round(
      priceWithStarBonus * effectiveTipMultiplier * speedBonus * managerMultiplier * sommelierMultiplier
    );

    sound.playAchievementSound();
    onAddCoins(totalEarnings);

    // 2.5.40 Generate & Save Official Dining Receipt
    const receipt = createCafeReceipt({
      order,
      dish,
      venue: cafeState.currentVenue || 'main',
      basePrice,
      starRank: cafeState.facilityStars?.['counter_1'] || 'F1',
      starPriceBonusPct: totalBonuses.totalSellPriceBonusPct,
      tipMultiplier: effectiveTipMultiplier,
      speedBonus,
      staffBonusMultiplier: managerMultiplier * sommelierMultiplier,
      totalEarnings,
      patienceRemaining: order.patienceRemaining,
      patienceTotal: order.patienceTotal
    });
    const updatedReceipts = saveStoredReceipt(receipt);
    setReceipts(updatedReceipts);

    // Update Customer State to eating
    setOrders(prev =>
      prev.map(o => (o.id === order.id ? { ...o, status: "eating", patienceRemaining: 0 } : o))
    );

    const isBranch2 = cafeState.currentVenue === 'branch_2';

    onUpdateCafeState(prev => ({
      ...prev,
      totalDishesServed: prev.totalDishesServed + 1,
      reputation: Math.min(100, prev.reputation + 1),
      cafeXp: prev.cafeXp + dish.xpReward,
      branch2Reputation: isBranch2
        ? Math.min(100, (prev.branch2Reputation || 10) + 2)
        : prev.branch2Reputation
    }));

    setCookingToast(
      isEn
        ? `🧾 Order served! Receipt #${receipt.receiptNumber} (+${totalEarnings} Coins)`
        : `🧾 結帳完成！點餐收據 #${receipt.receiptNumber} 已開立（+${totalEarnings} 金幣）`
    );
    setTimeout(() => setCookingToast(null), 3500);

    // Customer leaves after 2.5 seconds and a new customer arrives
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o => (o.id === order.id ? generateCustomerForTable(order.tableIndex) : o))
      );
    }, 2500);
  }, [
    cafeState.dishInventory,
    cafeState.staffMembers,
    cafeState.currentVenue,
    cafeState.facilityStars,
    canCraftDish,
    onConsumeIngredients,
    onUpdateCafeState,
    totalBonuses,
    currentPromotionTier,
    onAddCoins,
    isEn,
    generateCustomerForTable
  ]);

  // Upgrade Facility Star Rating (F1 ~ S3)
  const handleUpgradeFacility = useCallback((facilityId: string) => {
    const currentRank: StarRank = cafeState.facilityStars?.[facilityId] || "F1";
    const nextInfo = getNextRank(currentRank);
    if (!nextInfo) return;

    if (coins < nextInfo.upgradeCost) {
      sound.playHitSound(1);
      setCookingToast(isEn ? "❌ Not enough coins to upgrade this facility!" : "❌ 金幣不足，無法升級此設施！");
      setTimeout(() => setCookingToast(null), 2000);
      return;
    }

    onAddCoins(-nextInfo.upgradeCost);
    sound.playUpgradeSound();

    onUpdateCafeState(prev => ({
      ...prev,
      facilityStars: {
        ...(prev.facilityStars || {}),
        [facilityId]: nextInfo.rank
      }
    }));

    const fac = CAFE_FACILITIES.find(f => f.id === facilityId);
    const facName = fac ? (isEn ? fac.nameEn : fac.nameZh) : facilityId;
    setCookingToast(
      isEn
        ? `🌟 ${facName} upgraded to ★ ${nextInfo.rank}! (+${nextInfo.sellPriceBonusPct}% Price, +${nextInfo.tipMultiplierBonus}x Tip)`
        : `🌟 【${facName}】成功晉升至 ★ ${nextInfo.rank} 星級！（售價+${nextInfo.sellPriceBonusPct}%，小費+${nextInfo.tipMultiplierBonus}x）`
    );
    setTimeout(() => setCookingToast(null), 3000);
  }, [cafeState.facilityStars, coins, onAddCoins, onUpdateCafeState, isEn]);

  // Patience tick down & Auto-Waiter automation
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev =>
        prev.map(order => {
          if (order.status !== "waiting") return order;

          // Auto-waiter check
          if (cafeState.hasAutoWaiter) {
            const inStock = (cafeState.dishInventory[order.dishId] || 0) > 0;
            if (inStock) {
              handleServeOrder(order);
              return order;
            }
          }

          const nextPatience = order.patienceRemaining - 1;
          if (nextPatience <= 0) {
            return generateCustomerForTable(order.tableIndex);
          }
          return { ...order, patienceRemaining: nextPatience };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [cafeState.hasAutoWaiter, cafeState.dishInventory, handleServeOrder, generateCustomerForTable]);

  // Filter 1000 dishes for kitchen catalog
  const filteredDishes = useMemo(() => {
    let list = ALL_CAFE_DISHES;

    if (selectedCategory !== "all") {
      list = list.filter(d => d.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        d =>
          d.nameZh.toLowerCase().includes(q) ||
          d.nameEn.toLowerCase().includes(q) ||
          d.number.toString() === q ||
          d.id.includes(q)
      );
    }

    if (onlyCraftable) {
      list = list.filter(d => canCraftDish(d, 1));
    }

    return list;
  }, [selectedCategory, searchQuery, onlyCraftable, canCraftDish]);

  const getRarityBadge = (rarity: DishRarity) => {
    switch (rarity) {
      case "mythic":
        return "bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]";
      case "legendary":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black shadow-sm";
      case "epic":
        return "bg-purple-900 text-purple-200 border border-purple-500";
      case "rare":
        return "bg-blue-950 text-blue-300 border border-blue-600";
      case "uncommon":
        return "bg-emerald-950 text-emerald-300 border border-emerald-600";
      default:
        return "bg-zinc-800 text-zinc-300 border border-zinc-700";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. CAFE STATS & STATUS HEADER */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/80 border-3 border-amber-600/70 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-200 font-minecraft">
                {isEn ? "Minecraft Mining Cafe & 4-Floor Roastery" : "Minecraft 礦業四層景觀咖啡廳・露天酒吧"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-black text-xs font-mono">
                Lv.{cafeState.cafeLevel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-300/90 font-bold mt-0.5">
              <span>{isEn ? "Reputation:" : "知名度："} <strong className="text-emerald-400 font-mono">{cafeState.reputation}%</strong></span>
              <span>•</span>
              <span>{isEn ? "Meals Served:" : "款待顧客："} <strong className="text-amber-200 font-mono">{cafeState.totalDishesServed.toLocaleString()}</strong></span>
              <span>•</span>
              <span>{isEn ? "Dishes:" : "研發菜單："} <strong className="text-cyan-300 font-mono">{Object.keys(cafeState.dishesCookedHistory).length} / 1000</strong></span>
              <span>•</span>
              <button
                onClick={() => {
                  sound.playClickSound();
                  setShowStarOverviewModal(true);
                }}
                className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/50 flex items-center gap-1 cursor-pointer transition-colors"
                title={isEn ? "Click to view full 16-facility star rankings" : "點擊檢視 16 大設施全星級矩陣"}
              >
                <span>🌟</span>
                <span>{isEn ? `Star Bonus: +${totalBonuses.totalSellPriceBonusPct}% Price` : `星級加成: 售價+${totalBonuses.totalSellPriceBonusPct}% • 小費+${totalBonuses.totalTipMultiplierBonus.toFixed(1)}x`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenEncyclopedia && (
            <button
              onClick={() => {
                sound.playClickSound();
                onOpenEncyclopedia();
              }}
              className="px-3 py-2 bg-amber-800/90 hover:bg-amber-700 text-amber-100 font-bold text-xs sm:text-sm rounded-xl border-2 border-black shadow active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-110 font-minecraft"
              title={isEn ? "Open Minecraft Encyclopedia" : "開啟 Minecraft 百科全書"}
            >
              <span className="text-base">📖</span>
              <span>{isEn ? "Encyclopedia" : "百科全書"}</span>
            </button>
          )}
          {onOpenMusicPlayer && (
            <button
              onClick={() => {
                sound.playClickSound();
                onOpenMusicPlayer();
              }}
              className="px-3 py-2 bg-gradient-to-r from-amber-950 to-[#2c2214] hover:from-amber-900 text-amber-200 font-bold text-xs sm:text-sm rounded-xl border-2 border-amber-600/70 shadow active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-110 font-minecraft"
              title={isEn ? "Official Theme Song Jukebox" : "紅石蒸氣工坊 主題曲唱片機"}
            >
              <span className="text-base">💽</span>
              <span>{isEn ? "Theme Jukebox" : "主題唱片機"}</span>
            </button>
          )}
          <button
            onClick={() => {
              sound.playDoorSound ? sound.playDoorSound() : sound.playClickSound();
              onGoToMap();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#6ee7b7] active:scale-95 flex items-center gap-2 cursor-pointer transition-all hover:brightness-110"
          >
            <span className="text-base">🚪</span>
            <span>{isEn ? "Exit to Map" : "離開咖啡廳 (返回大地圖)"}</span>
          </button>
          <button
            onClick={() => {
              sound.playUpgradeSound();
              onGoToQuarry();
            }}
            className="px-3.5 py-2 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 font-bold text-xs sm:text-sm rounded-xl border-2 border-black shadow active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-110"
          >
            <span className="text-base">🛗</span>
            <span>{isEn ? "Elevator to Mine" : "搭電梯前往礦坑"}</span>
          </button>
        </div>
      </div>

      {/* Cooking Toast */}
      {cookingToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-zinc-950/95 border-3 border-amber-400 rounded-2xl shadow-2xl flex items-center gap-3 text-amber-300 font-black text-sm animate-bounce text-center">
          <span>{cookingToast}</span>
        </div>
      )}

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-2 flex-wrap">
        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab("map");
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border-2 ${
            activeTab === "map"
              ? "bg-amber-500 text-black border-amber-300 shadow-lg scale-105"
              : "bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800"
          }`}
        >
          <span className="text-base">🗺️</span>
          <span>{isEn ? "Cafe Blueprint Map" : "實景平面地圖 (原圖格局)"}</span>
          <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-amber-300 font-mono">NEW</span>
        </button>

        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab("dining");
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "dining"
              ? "bg-amber-500 text-black shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <span>🏢</span>
          <span>{isEn ? `Floors & Dining (${orders.length} Guests)` : `4樓層導航・客席點餐 (${orders.length} 位客人)`}</span>
        </button>

        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab("kitchen");
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "kitchen"
              ? "bg-amber-500 text-black shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <span>🍳</span>
          <span>{isEn ? "Kitchen & 1,000 Recipes" : "料理工坊與 1,000 道菜單"}</span>
        </button>

        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab("facilities_stars");
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "facilities_stars"
              ? "bg-amber-500 text-black shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <span>🌟</span>
          <span>{isEn ? "Facility Stars (F1~S3)" : "全設施星級 (F1~S3) 升級矩陣"}</span>
        </button>

        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab("upgrades");
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "upgrades"
              ? "bg-amber-500 text-black shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <span>✨</span>
          <span>{isEn ? "Cafe Staff & Gadgets" : "傳統擴建"}</span>
        </button>

        {/* Quick Launch: Staff Roles & Cross-Hire */}
        <button
          onClick={() => {
            sound.playClickSound();
            setShowStaffModal(true);
          }}
          className="ml-auto px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-amber-400/80 shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Users className="w-4 h-4 text-amber-200" />
          <span>{isEn ? "Staff & Cross-Hire" : "👥 職位與跨請"}</span>
        </button>

        {/* Quick Launch: Hardcore Promotion */}
        <button
          onClick={() => {
            sound.playClickSound();
            setShowPromotionModal(true);
          }}
          className="px-3.5 py-2 bg-gradient-to-r from-yellow-600 to-amber-500 hover:brightness-110 text-black font-black text-xs sm:text-sm rounded-xl border-2 border-yellow-300 shadow flex items-center gap-1.5 cursor-pointer animate-pulse"
        >
          <Trophy className="w-4 h-4 text-black" />
          <span>{isEn ? "Hardcore Promotion" : "🏆 超級晉級考驗"}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/70 text-yellow-300">
            {currentPromotionTier.badge}
          </span>
        </button>

        {/* Quick Launch: 2.5.40 Receipts Ledger */}
        <button
          id="btn_cafe_receipts_system"
          onClick={() => {
            sound.playClickSound();
            setShowReceiptsModal(true);
          }}
          className="px-3.5 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-blue-400/80 shadow flex items-center gap-1.5 cursor-pointer"
          title={isEn ? "Open Receipts & Sales History" : "開啟點餐收據與歷史存根"}
        >
          <Receipt className="w-4 h-4 text-blue-200" />
          <span>{isEn ? "Receipts" : "🧾 收據系統"}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/60 text-blue-200 font-mono">
            {receipts.length}
          </span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 0: BLUEPRINT MAP (依用戶手繪「像圖片一樣」的平面實景藍圖：長吧檯櫃檯、員工當值工位、12張客席桌、另一個分館切換) */}
      {activeTab === "map" && (
        <CafeFloorBlueprintMap
          cafeState={cafeState}
          onUpdateCafeState={onUpdateCafeState}
          coins={coins}
          orders={orders}
          inventory={inventory}
          onServeOrder={handleServeOrder}
          canCraftDish={canCraftDish}
          onOpenStaffModal={() => setShowStaffModal(true)}
          onOpenPromotionModal={() => setShowPromotionModal(true)}
          onGoToKitchen={() => setActiveTab("kitchen")}
          onGoToQuarry={onGoToQuarry}
          isEn={isEn}
        />
      )}

      {/* TAB 1: 4 FLOORS & VISIBLE FACILITIES & GUESTS (能看到咖啡廳裡的設施,客人,加入2、3樓+露天酒吧) */}
      {activeTab === "dining" && (
        <CafeFloorVisualizer
          currentFloor={currentFloor}
          onChangeFloor={(fl) => {
            setCurrentFloor(fl);
            onUpdateCafeState(prev => ({ ...prev, currentFloorView: fl }));
          }}
          cafeState={cafeState}
          coins={coins}
          orders={orders}
          inventory={inventory}
          onServeOrder={handleServeOrder}
          canCraftDish={canCraftDish}
          onSelectFacility={(fac) => setSelectedFacility(fac)}
          onQuickUpgradeFacility={handleUpgradeFacility}
          isEn={isEn}
        />
      )}

      {/* TAB 2: KITCHEN & 1,000 RECIPE WORKSHOP */}
      {activeTab === "kitchen" && (
        <div className="space-y-4">
          {/* 2.5.40 LIVE COOKING STOVES STATION */}
          <div className="p-4 bg-gradient-to-r from-zinc-950 via-[#1c1611] to-zinc-950 border-2 border-amber-600/70 rounded-2xl shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl animate-pulse">🔥</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-amber-300 font-minecraft">
                      {isEn ? "Live Kitchen Cooking Stoves Station" : "料理工坊・即時烹飪灶台工作區"}
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      v2.5.40
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {isEn
                      ? "Cooking takes real time based on recipe complexity (Min 5s, up to 10 mins). Keep stoves busy!"
                      : "依食譜複雜度耗費真實烹調時間（最低5秒，最長可達10分鐘）！合理安排灶台高效出餐。"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Collect all ready dishes button */}
                {(() => {
                  const readyCount = (cafeState.activeCookingTasks || []).filter(
                    t => t.status === 'ready' || nowTime >= t.finishAt
                  ).length;
                  if (readyCount === 0) return null;
                  return (
                    <button
                      onClick={handleClaimAllReadyTasks}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 animate-bounce cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEn ? `Collect All Ready (${readyCount})` : `一鍵收取全部已完成 (${readyCount})`}</span>
                    </button>
                  );
                })()}

                <button
                  onClick={() => setShowReceiptsModal(true)}
                  className="px-3 py-1.5 bg-blue-900/70 hover:bg-blue-800 text-blue-200 font-bold text-xs rounded-xl border border-blue-500/50 shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>{isEn ? `Receipts Ledger (${receipts.length})` : `收據存根 (${receipts.length})`}</span>
                </button>
              </div>
            </div>

            {/* Stoves Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(() => {
                const maxSlots = cafeState.hasGoldenStove ? EXPANDED_STOVE_SLOTS : DEFAULT_STOVE_SLOTS;
                const tasks = cafeState.activeCookingTasks || [];

                return Array.from({ length: maxSlots }).map((_, slotIndex) => {
                  const task = tasks[slotIndex];

                  if (!task) {
                    return (
                      <div
                        key={`stove_slot_${slotIndex}`}
                        className="p-3 bg-black/40 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center min-h-[110px]"
                      >
                        <span className="text-xl opacity-30">🍳</span>
                        <span className="text-xs font-bold text-zinc-500 font-minecraft">
                          {isEn ? `Stove #${slotIndex + 1} Idle` : `灶台 #${slotIndex + 1} 空閒中`}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          {isEn ? "Click 'Cook' on any dish below" : "點選下方料理開始烹調"}
                        </span>
                      </div>
                    );
                  }

                  const dish = getDishById(task.dishId);
                  const isReady = task.status === 'ready' || nowTime >= task.finishAt;
                  const elapsedMs = Math.max(0, nowTime - task.startedAt);
                  const totalMs = task.totalDurationSeconds * 1000;
                  const progressPct = isReady ? 100 : Math.min(99.9, (elapsedMs / totalMs) * 100);
                  const remainingSecs = isReady ? 0 : Math.ceil((task.finishAt - nowTime) / 1000);

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border-2 flex flex-col justify-between gap-2 transition-all relative overflow-hidden ${
                        isReady
                          ? "bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                          : "bg-zinc-900/90 border-amber-500/60 shadow"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{dish ? dish.icon : "🍲"}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-zinc-400">#{slotIndex + 1}</span>
                              <span className="text-xs font-black text-white font-minecraft truncate max-w-[120px]">
                                {dish ? (isEn ? dish.nameEn : dish.nameZh) : task.dishId}
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-400 font-mono font-bold">
                              x{task.count} {isEn ? "servings" : "份"}
                            </span>
                          </div>
                        </div>

                        {isReady ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider animate-pulse">
                            {isEn ? "READY!" : "完成！"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/60 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                            <span>{formatCookingDuration(remainingSecs, isEn)}</span>
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-zinc-700/60">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isReady
                                ? "bg-emerald-400"
                                : "bg-gradient-to-r from-amber-500 to-orange-500"
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                          <span>{isReady ? (isEn ? "100% Done" : "100% 烹調完成") : (isEn ? "Cooking..." : "烹飪進行中...")}</span>
                          <span>{Math.floor(progressPct)}%</span>
                        </div>
                      </div>

                      {/* Action */}
                      {isReady ? (
                        <button
                          onClick={() => handleClaimCookingTask(task)}
                          className="w-full py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-black text-xs rounded-lg shadow cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isEn ? `Claim (+${dish ? dish.xpReward * task.count : 0} XP)` : `收取料理 (+${dish ? dish.xpReward * task.count : 0} 經驗)`}</span>
                        </button>
                      ) : (
                        <div className="text-center text-[10px] text-amber-400/80 font-sans italic">
                          🔥 {isEn ? `Total: ${formatCookingDuration(task.totalDurationSeconds, true)}` : `總耗時: ${formatCookingDuration(task.totalDurationSeconds, false)}`}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Search & Category Filters */}
          <div className="p-4 bg-zinc-950/90 border-2 border-zinc-800 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search by dish name, ID, or #1~1000..." : "搜尋料理名稱、編號 #1~1000..."}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Craftable Filter Checkbox */}
              <button
                onClick={() => setOnlyCraftable(!onlyCraftable)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  onlyCraftable
                    ? "bg-amber-500 text-black border-amber-400"
                    : "bg-zinc-900 text-zinc-300 border-zinc-700"
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${onlyCraftable ? "text-black" : "text-zinc-500"}`} />
                <span>{isEn ? "Craftable Only" : "只顯示材料充足"}</span>
              </button>

              <div className="text-xs text-zinc-400 font-mono">
                {isEn ? `Showing ${filteredDishes.length} / 1,000 Dishes` : `顯示 ${filteredDishes.length} / 1,000 道餐點`}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClickSound();
                    setSelectedCategory(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === tab.id
                      ? "bg-amber-500 text-black shadow-sm"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{isEn ? tab.nameEn : tab.nameZh}</span>
                  <span className="text-[10px] opacity-70 font-mono">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 1,000 Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredDishes.slice(0, 120).map(dish => {
              const canCook1 = canCraftDish(dish, 1);
              const canCook5 = canCraftDish(dish, 5);
              const inStock = cafeState.dishInventory[dish.id] || 0;
              const totalCooked = cafeState.dishesCookedHistory[dish.id] || 0;

              return (
                <div
                  key={dish.id}
                  className="p-3.5 bg-zinc-900/80 border-2 border-zinc-800 hover:border-zinc-700 rounded-2xl flex flex-col justify-between gap-3 shadow-md"
                >
                  <div>
                    {/* Header: Number, Icon, Name, Rarity */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dish.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-amber-400 font-bold">#{dish.number}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${getRarityBadge(dish.rarity)}`}>
                              {dish.rarity}
                            </span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-black text-zinc-100 truncate font-minecraft">
                            {isEn ? dish.nameEn : dish.nameZh}
                          </h3>
                        </div>
                      </div>

                      {inStock > 0 && (
                        <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-600">
                          {isEn ? `Ready: ${inStock}` : `備餐: ${inStock}`}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed italic mb-2.5">
                      "{isEn ? dish.descriptionEn : dish.descriptionZh}"
                    </p>

                    {/* 2.5.40 Cooking Duration Badge (5s ~ 600s / 10 mins) */}
                    {(() => {
                      const durationSecs = calculateCookingDuration(dish, 1);
                      return (
                        <div className="flex items-center justify-between text-[11px] py-1 px-2.5 bg-amber-950/40 border border-amber-500/30 rounded-lg mb-2 text-amber-300">
                          <div className="flex items-center gap-1 font-bold">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isEn ? "Cooking Duration:" : "烹飪耗時:"}</span>
                          </div>
                          <span className="font-mono font-black text-amber-400">
                            {formatCookingDuration(durationSecs, isEn)}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Stats Pill */}
                    <div className="flex items-center justify-between text-[11px] py-1 px-2.5 bg-black/40 rounded-lg mb-2 text-zinc-300">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Coins className="w-3.5 h-3.5" />
                        <span>+{Math.round(dish.sellPrice * (1 + totalBonuses.totalSellPriceBonusPct / 100))} {isEn ? "Coins" : "金幣"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{dish.xpReward} XP</span>
                      </div>
                      <div className="text-zinc-500 font-mono text-[10px]">
                        {isEn ? `Made: ${totalCooked}` : `累計製作: ${totalCooked}`}
                      </div>
                    </div>

                    {/* Required Ingredients */}
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        {isEn ? "Ingredients Needed:" : "所需礦石材料:"}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dish.requiredIngredients.map(req => {
                          const block = blockMap.get(req.blockId);
                          const owned = inventory[req.blockId] || 0;
                          const hasEnough = owned >= req.count;

                          return (
                            <span
                              key={req.blockId}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                hasEnough
                                  ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                                  : "bg-rose-950/60 text-rose-300 border-rose-800"
                              }`}
                            >
                              {block ? (isEn ? block.nameEn : block.nameZh) : req.blockId} x{req.count} ({owned})
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Cook Actions with Stove Duration */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => handleStartCooking(dish, 1)}
                      disabled={!canCook1}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        canCook1
                          ? "bg-amber-500 hover:bg-amber-400 text-black shadow active:scale-95"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>
                        {isEn
                          ? `Cook (${formatCookingDuration(calculateCookingDuration(dish, 1), true)})`
                          : `開火烹調 (${formatCookingDuration(calculateCookingDuration(dish, 1), false)})`}
                      </span>
                    </button>

                    <button
                      onClick={() => handleStartCooking(dish, 5)}
                      disabled={!canCook5}
                      className={`py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        canCook5
                          ? "bg-amber-600 hover:bg-amber-500 text-white shadow active:scale-95"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                      title={isEn ? "Cook 5 in batch on stove" : "在灶台上批量烹調 5 份"}
                    >
                      <span>5x</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FACILITY STARS (F1 ~ S3) OVERVIEW MATRIX */}
      {activeTab === "facilities_stars" && (
        <div className="space-y-4">
          {/* Top Multiplier Overview Banner */}
          <div className="bg-gradient-to-r from-amber-950/80 via-[#221811] to-amber-950/80 p-5 rounded-2xl border-3 border-amber-600/70 shadow-xl text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <h2 className="text-base sm:text-lg font-black text-amber-300 font-minecraft">
                    {isEn ? "Cafe 16 Facilities & 21-Tier Star Rank System" : "咖啡廳 16 大設施與 21 級星級制 (F1 ~ S3)"}
                  </h2>
                </div>
                <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
                  {isEn
                    ? "Upgrade facilities across 1F, 2F, 3F, and Rooftop Bar. Each tier significantly multiplies dish selling price, customer tips, patience, and passive dividend earnings!"
                    : "升級 1F 烘焙大廳、2F 景觀閣樓、3F 星光包廂與露天酒吧共 16 大設施。每個星級皆能大幅提高菜色售價、顧客小費、等候耐心與自動分紅！"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClickSound();
                    setShowStarOverviewModal(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black font-minecraft text-xs rounded-xl shadow cursor-pointer active:scale-95 transition-all"
                >
                  {isEn ? "Open Star Modal" : "彈出總覽彈窗"}
                </button>
              </div>
            </div>

            {/* Total bonuses row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-black/50 rounded-xl border border-amber-900/60 text-center">
                <div className="text-[10px] text-zinc-400 uppercase font-bold">{isEn ? "Total Sell Price Bonus" : "料理售價總加成"}</div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">+{totalBonuses.totalSellPriceBonusPct}%</div>
              </div>
              <div className="p-3 bg-black/50 rounded-xl border border-amber-900/60 text-center">
                <div className="text-[10px] text-zinc-400 uppercase font-bold">{isEn ? "Tip Multiplier Bonus" : "小費乘數總加成"}</div>
                <div className="text-lg font-black text-amber-300 font-mono mt-0.5">+{totalBonuses.totalTipMultiplierBonus.toFixed(2)}x</div>
              </div>
              <div className="p-3 bg-black/50 rounded-xl border border-amber-900/60 text-center">
                <div className="text-[10px] text-zinc-400 uppercase font-bold">{isEn ? "Patience Extension" : "顧客等候耐心延長"}</div>
                <div className="text-lg font-black text-cyan-300 font-mono mt-0.5">+{totalBonuses.totalPatienceBonusSec}s</div>
              </div>
              <div className="p-3 bg-black/50 rounded-xl border border-amber-900/60 text-center">
                <div className="text-[10px] text-zinc-400 uppercase font-bold">{isEn ? "Passive Dividend Rate" : "被動分紅金幣"}</div>
                <div className="text-lg font-black text-yellow-400 font-mono mt-0.5">+{totalBonuses.totalPassiveCoins} 🪙 / 3s</div>
              </div>
            </div>
          </div>

          {/* 16 Facilities Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {CAFE_FACILITIES.map(facility => {
              const currentRank: StarRank = cafeState.facilityStars?.[facility.id] || "F1";
              const rankInfo = getRankInfo(currentRank);
              const nextInfo = getNextRank(currentRank);
              const floor = CAFE_FLOORS.find(f => f.id === facility.floorId);
              const canAfford = nextInfo ? coins >= nextInfo.upgradeCost : false;

              return (
                <div
                  key={facility.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/90 border-2 border-zinc-800 hover:border-amber-600/70 transition-all flex flex-col justify-between gap-3 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-600/60 flex items-center justify-center text-xl shadow-inner">
                        {facility.icon}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-minecraft border ${rankInfo.badgeBg} ${rankInfo.badgeBorder}`}>
                        ★ {currentRank}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-bold">
                        {floor ? (isEn ? floor.badgeEn : floor.badgeZh) : facility.floorId}
                      </span>
                      <span className="text-[11px] font-bold text-amber-200 truncate">
                        {isEn ? rankInfo.titleEn : rankInfo.titleZh}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-white font-minecraft line-clamp-1">
                      {isEn ? facility.nameEn : facility.nameZh}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-snug">
                      {isEn ? facility.descEn : facility.descZh}
                    </p>
                  </div>

                  <div className="p-2 bg-black/50 rounded-xl border border-zinc-800 text-[10px] space-y-1 text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">{isEn ? "Price Bonus:" : "售價加成:"}</span>
                      <span className="font-bold text-emerald-400">+{rankInfo.sellPriceBonusPct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">{isEn ? "Tip Bonus:" : "小費乘數:"}</span>
                      <span className="font-bold text-amber-400">+{rankInfo.tipMultiplierBonus}x</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">{isEn ? "Passive Yield:" : "被動分紅:"}</span>
                      <span className="font-bold text-yellow-400">+{rankInfo.passiveCoinsPerInterval} 🪙</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        sound.playClickSound();
                        setSelectedFacility(facility);
                      }}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title={isEn ? "Inspect Details" : "詳細檢視"}
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>

                    {nextInfo ? (
                      <button
                        onClick={() => handleUpgradeFacility(facility.id)}
                        disabled={!canAfford}
                        className={`flex-1 py-1.5 px-2.5 rounded-xl font-minecraft font-black text-[11px] border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          canAfford
                            ? "bg-amber-500 hover:bg-amber-400 text-black border-amber-300 shadow active:scale-95"
                            : "bg-zinc-800/80 text-zinc-500 border-zinc-700 cursor-not-allowed"
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        <span className="truncate">
                          ★ {nextInfo.rank} ({nextInfo.upgradeCost.toLocaleString()})
                        </span>
                      </button>
                    ) : (
                      <span className="flex-1 py-1.5 px-2 text-center rounded-xl font-minecraft font-black text-[10px] bg-yellow-950 text-yellow-300 border border-yellow-600/40">
                        ★ S3 MAX
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CAFE UPGRADES & GADGETS */}
      {activeTab === "upgrades" && (
        <div className="p-6 bg-zinc-950/90 border-2 border-zinc-800 rounded-2xl space-y-5">
          <div>
            <h3 className="text-base font-black text-amber-300 font-minecraft">
              {isEn ? "Staff, Aroma & Dining Automation" : "店員聘請、氛香儀與自動送餐擴建"}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {isEn
                ? "Enhance your dining hall operations with cozy feline waiters, aroma diffusers, and espresso machinery!"
                : "解鎖三花貓店員、薰衣草氛香儀與黃金萃取機，全面自動化店務營運！"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upgrade 1: Auto-Waiter Cat */}
            <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐱</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 font-minecraft">
                      {isEn ? "Hire Auto-Waiter Kitten" : "聘請自動送餐三花貓店員"}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {isEn
                        ? "Automatically serves waiting customers if the requested dish is in your prepared stock!"
                        : "當備餐庫存有現成料理時，貓咪店員會自動幫忙端給顧客！"}
                    </p>
                  </div>
                </div>
              </div>

              {!cafeState.hasAutoWaiter ? (
                <button
                  onClick={() => {
                    const cost = 500;
                    if (coins < cost) {
                      sound.playHitSound(1);
                      return;
                    }
                    sound.playAchievementSound();
                    onAddCoins(-cost);
                    onUpdateCafeState(prev => ({
                      ...prev,
                      hasAutoWaiter: true
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer ${
                    coins >= 500
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  {isEn ? "Hire (500 Coins)" : "聘請 (500 金幣)"}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-700">
                  {isEn ? "Active" : "已聘請工作中"}
                </span>
              )}
            </div>

            {/* Upgrade 2: Golden Espresso Machine */}
            <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 font-minecraft">
                      {isEn ? "Golden Roaster & Espresso Machine" : "黃金高壓義式咖啡萃取機"}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {isEn
                        ? "+20% Extra Coin Tips on all served dishes!"
                        : "萃取頂級風味！所有送出餐點的小費金幣永久 +20%！"}
                    </p>
                  </div>
                </div>
              </div>

              {!cafeState.hasGoldenStove ? (
                <button
                  onClick={() => {
                    const cost = 800;
                    if (coins < cost) {
                      sound.playHitSound(1);
                      return;
                    }
                    sound.playAchievementSound();
                    onAddCoins(-cost);
                    onUpdateCafeState(prev => ({
                      ...prev,
                      hasGoldenStove: true
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer ${
                    coins >= 800
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  {isEn ? "Upgrade (800 Coins)" : "升級 (800 金幣)"}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-700">
                  {isEn ? "Installed" : "已安裝"}
                </span>
              )}
            </div>

            {/* Upgrade 3: Lavender Aroma Diffuser */}
            <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 font-minecraft">
                      {isEn ? "Cozy Lavender Aroma Diffuser" : "舒緩薰衣草氛香儀"}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {isEn
                        ? "Customer patience increased by +50% (from 60s to 90s)!"
                        : "散發怡人芳香，所有客人的等候耐心大幅延長 +50% (從 60 秒至 90 秒)！"}
                    </p>
                  </div>
                </div>
              </div>

              {!cafeState.hasAromaDiffuser ? (
                <button
                  onClick={() => {
                    const cost = 600;
                    if (coins < cost) {
                      sound.playHitSound(1);
                      return;
                    }
                    sound.playAchievementSound();
                    onAddCoins(-cost);
                    onUpdateCafeState(prev => ({
                      ...prev,
                      hasAromaDiffuser: true
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer ${
                    coins >= 600
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  {isEn ? "Purchase (600 Coins)" : "購買 (600 金幣)"}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-700">
                  {isEn ? "Installed" : "已安裝"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Facility Upgrade Modal */}
      {selectedFacility && (
        <FacilityUpgradeModal
          facility={selectedFacility}
          currentRank={cafeState.facilityStars?.[selectedFacility.id] || "F1"}
          coins={coins}
          onUpgrade={(facilityId) => {
            handleUpgradeFacility(facilityId);
          }}
          onClose={() => setSelectedFacility(null)}
          isEn={isEn}
        />
      )}

      {/* Full Star Overview Matrix Modal */}
      {showStarOverviewModal && (
        <CafeStarOverviewModal
          cafeState={cafeState}
          coins={coins}
          onUpgradeFacility={handleUpgradeFacility}
          onClose={() => setShowStarOverviewModal(false)}
          isEn={isEn}
        />
      )}

      {/* Staff Roles & Cross-Hire Modal (職位與跨請管理) */}
      <CafeStaffModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        staffMembers={cafeState.staffMembers || INITIAL_STAFF_MEMBERS}
        onUpdateStaffMembers={(newStaff) => {
          onUpdateCafeState(prev => ({
            ...prev,
            staffMembers: newStaff,
            crossDispatchHistoryCount: (prev.crossDispatchHistoryCount || 0) + 1
          }));
        }}
        coins={coins}
        onAddCoins={onAddCoins}
        isEn={isEn}
        ownedOutfits={ownedOutfits}
      />

      {/* Hardcore Promotion Ascension Modal (超級難的任務・咖啡廳晉級) */}
      <CafePromotionModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        cafeState={cafeState}
        onUpdateCafeState={onUpdateCafeState}
        totalBlocksMined={totalBlocksMined}
        coins={coins}
        onAddCoins={onAddCoins}
        isEn={isEn}
      />

      {/* 2.5.40 Official Receipts System Modal (收據系統與財務明細) */}
      <ReceiptsModal
        isOpen={showReceiptsModal}
        onClose={() => setShowReceiptsModal(false)}
        receipts={receipts}
        onClearReceipts={() => setReceipts([])}
        isEn={isEn}
      />

      {/* Bottom Navigation & Exit Bar */}
      <div className="py-4 flex flex-wrap items-center justify-center gap-3 border-t-2 border-zinc-800/80 mt-4">
        <button
          onClick={() => {
            sound.playDoorSound ? sound.playDoorSound() : sound.playClickSound();
            onGoToMap();
          }}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#6ee7b7] active:scale-95 flex items-center gap-2 cursor-pointer transition-all hover:brightness-110"
        >
          <span className="text-lg">🚪</span>
          <span>{isEn ? "Exit Cafe (Return to Overworld Map)" : "離開咖啡廳 (返回大地圖步道)"}</span>
        </button>
        <button
          onClick={() => {
            sound.playUpgradeSound();
            onGoToQuarry();
          }}
          className="px-5 py-2.5 bg-cyan-900/90 hover:bg-cyan-800 text-cyan-200 font-bold text-sm rounded-xl border-2 border-black shadow active:scale-95 flex items-center gap-2 cursor-pointer transition-all hover:brightness-110"
        >
          <span className="text-lg">🛗</span>
          <span>{isEn ? "Take Elevator to Mine" : "搭乘電梯前往採掘礦坑"}</span>
        </button>
      </div>
    </div>
  );
};
