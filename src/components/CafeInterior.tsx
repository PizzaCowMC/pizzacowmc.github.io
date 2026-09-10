import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { sound } from '../utils/soundEffects';
import { CafeDish, CustomerOrder, CafeState, DishCategory, DishRarity } from '../types';
import { ALL_CAFE_DISHES, CUSTOMER_ARCHETYPES, CustomerArchetype, getDishById } from '../data/cafeDishesData';
import { BLOCK_TYPES, STRATA_LAYERS } from '../data/gameData';
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
  Smile
} from 'lucide-react';

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
}

const CATEGORY_TABS: { id: DishCategory | 'all'; nameZh: string; nameEn: string; icon: string; count: number }[] = [
  { id: 'all', nameZh: '全部 1,000 道餐點', nameEn: 'All 1,000 Dishes', icon: '🍽️', count: 1000 },
  { id: 'coffee', nameZh: '濃縮與調和咖啡', nameEn: 'Coffee & Brews', icon: '☕', count: 100 },
  { id: 'tea_beverage', nameZh: '礦物果茶與特調', nameEn: 'Mineral Teas', icon: '🍹', count: 100 },
  { id: 'pastry', nameZh: '手工烘焙與甜點', nameEn: 'Pastries & Sweets', icon: '🍰', count: 100 },
  { id: 'hot_meal', nameZh: '地底熱食主餐', nameEn: 'Hot Meals', icon: '🍜', count: 100 },
  { id: 'void', nameZh: '終界虛空幻境', nameEn: 'Void Delicacies', icon: '🌌', count: 100 },
  { id: 'deep_dark', nameZh: '幽匿深穴秘境', nameEn: 'Deep Dark Echoes', icon: '🍄', count: 100 },
  { id: 'celestial', nameZh: '天界以太盛宴', nameEn: 'Celestial Aether', icon: '⭐', count: 100 },
  { id: 'singularity', nameZh: '時空奇點未來料理', nameEn: 'Chrono Singularity', icon: '⏳', count: 100 },
  { id: 'genesis', nameZh: '創世神域御膳', nameEn: 'Genesis Core', icon: '🪐', count: 100 },
  { id: 'mythic', nameZh: '全知全能神話特盛', nameEn: 'Apex Mythic', icon: '👑', count: 100 }
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
  onOpenEncyclopedia
}) => {
  const [activeTab, setActiveTab] = useState<'dining' | 'kitchen' | 'upgrades'>('dining');
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyCraftable, setOnlyCraftable] = useState<boolean>(false);
  const [cookingToast, setCookingToast] = useState<string | null>(null);

  // Customer Orders per Table
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  // Block map for ingredient info
  const blockMap = useMemo(() => new Map(BLOCK_TYPES.map(b => [b.id, b])), []);

  // Compute set of block IDs from currently unlocked strata
  const unlockedBlockIds = useMemo(() => {
    const ids = new Set<string>();
    STRATA_LAYERS.forEach((layer, index) => {
      const prevLayer = STRATA_LAYERS[index - 1];
      const isUnlocked = index === 0 || (prevLayer && (layerMinedCounts[prevLayer.id] || 0) >= 100000);
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

    const dialogueZh = archetype.dialoguesZh[Math.floor(Math.random() * archetype.dialoguesZh.length)];
    const dialogueEn = archetype.dialoguesEn[Math.floor(Math.random() * archetype.dialoguesEn.length)];

    const basePatience = cafeState.hasAromaDiffuser ? 90 : 60;

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
      status: 'waiting',
      dialogueZh,
      dialogueEn
    };
  }, [cafeState.cafeLevel, cafeState.hasAromaDiffuser, unlockedStrataDishes]);

  // Initial customer population
  useEffect(() => {
    setOrders(prev => {
      const newOrders = [...prev];
      for (let i = 0; i < cafeState.unlockedTables; i++) {
        if (!newOrders.some(o => o.tableIndex === i)) {
          newOrders.push(generateCustomerForTable(i));
        }
      }
      return newOrders.slice(0, cafeState.unlockedTables);
    });
  }, [cafeState.unlockedTables, generateCustomerForTable]);

  // Check if player has all ingredients for a dish
  const canCraftDish = useCallback((dish: CafeDish, multiplier: number = 1): boolean => {
    return dish.requiredIngredients.every(req => {
      const owned = inventory[req.blockId] || 0;
      return owned >= req.count * multiplier;
    });
  }, [inventory]);

  // Cook a dish
  const handleCookDish = useCallback((dish: CafeDish, count: number = 1) => {
    const totalIngredients = dish.requiredIngredients.map(r => ({
      blockId: r.blockId,
      count: r.count * count
    }));

    const success = onConsumeIngredients(totalIngredients);
    if (!success) {
      sound.playHitSound(1);
      return;
    }

    sound.playUpgradeSound();

    onUpdateCafeState(prev => {
      const currentStock = prev.dishInventory[dish.id] || 0;
      const currentHistory = prev.dishesCookedHistory[dish.id] || 0;
      const nextXp = prev.cafeXp + dish.xpReward * count;
      const nextLevel = Math.min(100, Math.floor(nextXp / 150) + 1);

      return {
        ...prev,
        cafeLevel: nextLevel,
        cafeXp: nextXp,
        dishInventory: {
          ...prev.dishInventory,
          [dish.id]: currentStock + count
        },
        dishesCookedHistory: {
          ...prev.dishesCookedHistory,
          [dish.id]: currentHistory + count
        }
      };
    });

    setCookingToast(
      isEn
        ? `✨ Prepared ${count}x ${dish.nameEn}! (+${dish.xpReward * count} XP)`
        : `✨ 成功製作 ${count} 份【${dish.nameZh}】！(+${dish.xpReward * count} 經驗)`
    );
    setTimeout(() => setCookingToast(null), 2500);
  }, [onConsumeIngredients, onUpdateCafeState, isEn]);

  // Serve meal to customer
  const handleServeOrder = useCallback((order: CustomerOrder) => {
    const dish = getDishById(order.dishId);
    if (!dish) return;

    const inStock = (cafeState.dishInventory[order.dishId] || 0) > 0;

    // If not in stock, check if we can instant-cook
    if (!inStock) {
      if (!canCraftDish(dish, 1)) {
        sound.playHitSound(1);
        setCookingToast(isEn ? '❌ Missing required quarry ingredients to prepare this dish!' : '❌ 缺少礦坑食材，無法即刻烹飪！');
        setTimeout(() => setCookingToast(null), 2000);
        return;
      }
      // Consume ingredients directly
      onConsumeIngredients(dish.requiredIngredients);
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

    // Calculate Payment + Speed Bonus Tip
    const patienceRatio = order.patienceRemaining / order.patienceTotal;
    const speedBonus = patienceRatio > 0.6 ? 1.5 : patienceRatio > 0.3 ? 1.2 : 1.0;
    const totalEarnings = Math.round(dish.sellPrice * order.tipMultiplier * speedBonus);

    sound.playAchievementSound();
    onAddCoins(totalEarnings);

    // Update Customer State to eating
    setOrders(prev =>
      prev.map(o => (o.id === order.id ? { ...o, status: 'eating', patienceRemaining: 0 } : o))
    );

    onUpdateCafeState(prev => ({
      ...prev,
      totalDishesServed: prev.totalDishesServed + 1,
      reputation: Math.min(100, prev.reputation + 1),
      cafeXp: prev.cafeXp + dish.xpReward
    }));

    setCookingToast(
      isEn
        ? `💖 Customer satisfied! Earned +${totalEarnings} Coins (Tip: x${(order.tipMultiplier * speedBonus).toFixed(1)})`
        : `💖 顧客大加讚賞！獲得 +${totalEarnings} 金幣（小費加成: x${(order.tipMultiplier * speedBonus).toFixed(1)}）`
    );
    setTimeout(() => setCookingToast(null), 3000);

    // Customer leaves after 2.5 seconds and a new customer arrives
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o => (o.id === order.id ? generateCustomerForTable(order.tableIndex) : o))
      );
    }, 2500);
  }, [cafeState.dishInventory, canCraftDish, onConsumeIngredients, onUpdateCafeState, onAddCoins, isEn, generateCustomerForTable]);

  // Patience tick down & Auto-Waiter automation
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev =>
        prev.map(order => {
          if (order.status !== 'waiting') return order;

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
            // Customer leaves impatiently, new customer comes
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

    if (selectedCategory !== 'all') {
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

  // Rarity color helper
  const getRarityBadge = (rarity: DishRarity) => {
    switch (rarity) {
      case 'mythic':
        return 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]';
      case 'legendary':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black shadow-sm';
      case 'epic':
        return 'bg-purple-900 text-purple-200 border border-purple-500';
      case 'rare':
        return 'bg-blue-950 text-blue-300 border border-blue-600';
      case 'uncommon':
        return 'bg-emerald-950 text-emerald-300 border border-emerald-600';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
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
                {isEn ? 'Minecraft Mining Cafe & Roastery' : 'Minecraft 礦業咖啡廳・千味殿堂'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-black text-xs font-mono">
                Lv.{cafeState.cafeLevel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-300/90 font-bold mt-0.5">
              <span>{isEn ? 'Reputation:' : '知名滿意度：'} <strong className="text-emerald-400 font-mono">{cafeState.reputation}%</strong></span>
              <span>•</span>
              <span>{isEn ? 'Total Meals Served:' : '累計款待顧客：'} <strong className="text-amber-200 font-mono">{cafeState.totalDishesServed.toLocaleString()}</strong></span>
              <span>•</span>
              <span>{isEn ? 'Cooked Recipes:' : '已研發料理：'} <strong className="text-cyan-300 font-mono">{Object.keys(cafeState.dishesCookedHistory).length} / 1000</strong></span>
            </div>
          </div>
        </div>

        {/* Navigation & Exit Buttons */}
        <div className="flex items-center gap-2">
          {onOpenEncyclopedia && (
            <button
              onClick={() => {
                sound.playClickSound();
                onOpenEncyclopedia();
              }}
              className="px-3 py-2 bg-amber-800/90 hover:bg-amber-700 text-amber-100 font-bold text-xs sm:text-sm rounded-xl border-2 border-black shadow active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-110 font-minecraft"
              title={isEn ? 'Open Minecraft Encyclopedia' : '開啟 Minecraft 百科全書'}
            >
              <span className="text-base">📖</span>
              <span>{isEn ? 'Encyclopedia' : '百科全書'}</span>
            </button>
          )}
          <button
            onClick={() => {
              sound.playDoorSound ? sound.playDoorSound() : sound.playClickSound();
              onGoToMap();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#6ee7b7] active:scale-95 flex items-center gap-2 cursor-pointer transition-all hover:brightness-110"
            title={isEn ? 'Leave Cafe and return to the overworld map' : '離開咖啡廳，返回大地圖步道'}
          >
            <span className="text-base">🚪</span>
            <span>{isEn ? 'Exit Cafe (Return to Map)' : '離開咖啡廳 (返回大地圖)'}</span>
          </button>
          <button
            onClick={() => {
              sound.playUpgradeSound();
              onGoToQuarry();
            }}
            className="px-3.5 py-2 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 font-bold text-xs sm:text-sm rounded-xl border-2 border-black shadow active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-110"
            title={isEn ? 'Take the steam elevator down to the deep mining strata' : '搭乘蒸氣電梯直達地下採掘礦坑'}
          >
            <span className="text-base">🛗</span>
            <span>{isEn ? 'Elevator to Mine' : '搭電梯前往礦坑'}</span>
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
      <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-2">
        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab('dining');
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'dining'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <span>🍽️</span>
          <span>{isEn ? `Dining Tables (${orders.length})` : `客席座席服務 (${orders.length})`}</span>
        </button>

        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab('kitchen');
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'kitchen'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <span>🍳</span>
          <span>{isEn ? 'Kitchen & 1,000 Recipes' : '料理工坊與 1,000 道菜單'}</span>
        </button>

        <button
          onClick={() => {
            sound.playClickSound();
            setActiveTab('upgrades');
          }}
          className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'upgrades'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <span>✨</span>
          <span>{isEn ? 'Cafe Upgrades' : '咖啡廳擴建與店員'}</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: DINING HALL (SERVE CUSTOMERS) */}
      {activeTab === 'dining' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span>{isEn ? 'Customers visit your tables. Prepare requested dishes from mined minerals and serve!' : '客人會絡繹不絕地入座。用採掘的礦石料理出對應餐點並送餐，賺取豐厚金幣與小費！'}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono font-bold text-[11px]">
                {isEn ? `🌱 Menu Pool: ${unlockedStrataDishes.length} Dishes (Unlocked Strata Only)` : `🌱 點餐聯動：僅點已解鎖地層食材 (共 ${unlockedStrataDishes.length} 道料理)`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">{isEn ? 'Cafe is Open' : '營業中'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order, idx) => {
              const dish = getDishById(order.dishId);
              if (!dish) return null;

              const inStock = (cafeState.dishInventory[order.dishId] || 0) > 0;
              const canInstantCook = canCraftDish(dish, 1);
              const patiencePercent = Math.max(0, Math.min(100, (order.patienceRemaining / order.patienceTotal) * 100));

              return (
                <div
                  key={order.id}
                  className={`p-4 rounded-2xl border-3 flex flex-col justify-between gap-3 relative overflow-hidden transition-all shadow-lg ${
                    order.status === 'eating'
                      ? 'bg-emerald-950/50 border-emerald-500'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500/50'
                  }`}
                >
                  {/* Table Label & Patience Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                        {isEn ? `Table #${idx + 1}` : `座席 #${idx + 1}`}
                      </span>
                      {order.status === 'waiting' && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span className={patiencePercent < 30 ? 'text-rose-400 animate-pulse' : 'text-zinc-300'}>
                            {order.patienceRemaining}s
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Customer Info & Dialogue */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {order.customerAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs font-black text-amber-200 truncate">
                            {isEn ? order.customerNameEn : order.customerNameZh}
                          </strong>
                        </div>
                        {/* Speech Bubble */}
                        <div className="text-[11px] text-zinc-300 bg-zinc-950/70 p-2 rounded-lg border border-zinc-800 mt-1 italic leading-tight">
                          "{isEn ? order.dialogueEn : order.dialogueZh}"
                        </div>
                      </div>
                    </div>

                    {/* Ordered Dish Box */}
                    <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl">{dish.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-black text-amber-300 truncate font-minecraft">
                            {isEn ? dish.nameEn : dish.nameZh}
                          </div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono font-bold">+{dish.sellPrice} {isEn ? 'Coins' : '金幣'}</span>
                            <span>•</span>
                            <span className="text-emerald-400">{isEn ? 'Tip' : '小費'} x{order.tipMultiplier}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock status indicator */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                        inStock
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                          : canInstantCook
                          ? 'bg-amber-950 text-amber-300 border-amber-600'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        {inStock
                          ? (isEn ? `Ready (${cafeState.dishInventory[order.dishId]})` : `現成庫存 (${cafeState.dishInventory[order.dishId]})`)
                          : canInstantCook
                          ? (isEn ? 'Can Quick-Cook' : '可現做現送')
                          : (isEn ? 'Missing Ore' : '缺礦石')}
                      </span>
                    </div>

                    {/* Required Ingredients Preview */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-zinc-500">{isEn ? 'Ingredients:' : '所需礦石:'}</span>
                      {dish.requiredIngredients.map(r => {
                        const b = blockMap.get(r.blockId);
                        const owned = inventory[r.blockId] || 0;
                        const hasEnough = owned >= r.count;
                        return (
                          <span
                            key={r.blockId}
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                              hasEnough
                                ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700'
                                : 'bg-rose-950/60 text-rose-300 border-rose-800'
                            }`}
                          >
                            {b ? (isEn ? b.nameEn : b.nameZh) : r.blockId} x{r.count} ({owned})
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Patience Meter Progress Bar */}
                  {order.status === 'waiting' && (
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden my-1">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          patiencePercent > 50
                            ? 'bg-emerald-500'
                            : patiencePercent > 25
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${patiencePercent}%` }}
                      />
                    </div>
                  )}

                  {/* Action Button: Serve or Eating Animation */}
                  {order.status === 'eating' ? (
                    <div className="w-full py-2 bg-emerald-900/60 border border-emerald-500/60 rounded-xl flex items-center justify-center gap-2 text-emerald-200 text-xs font-bold animate-pulse">
                      <span>😋</span>
                      <span>{isEn ? 'Customer enjoying meal...' : '顧客大快朵頤中...'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleServeOrder(order)}
                      disabled={!inStock && !canInstantCook}
                      className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                        inStock
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-98 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : canInstantCook
                          ? 'bg-amber-500 hover:bg-amber-400 text-black active:scale-98'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                      }`}
                    >
                      <Utensils className="w-4 h-4" />
                      <span>
                        {inStock
                          ? (isEn ? '🍽️ Serve Meal Now' : '🍽️ 立即送餐')
                          : canInstantCook
                          ? (isEn ? '🍳 Quick-Cook & Serve' : '🍳 快速現做現送')
                          : (isEn ? '❌ Need Quarry Mining' : '❌ 缺少食材（前往採礦）')}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KITCHEN & 1,000 RECIPE WORKSHOP */}
      {activeTab === 'kitchen' && (
        <div className="space-y-4">
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
                  placeholder={isEn ? 'Search by dish name, ID, or #1~1000...' : '搜尋料理名稱、編號 #1~1000...'}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Craftable Filter Checkbox */}
              <button
                onClick={() => setOnlyCraftable(!onlyCraftable)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  onlyCraftable
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${onlyCraftable ? 'text-black' : 'text-zinc-500'}`} />
                <span>{isEn ? 'Craftable Only' : '只顯示材料充足'}</span>
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
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
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

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2">
                      {isEn ? dish.descEn : dish.descZh}
                    </p>

                    {/* Required Ingredients */}
                    <div className="space-y-1 bg-black/40 p-2 rounded-xl border border-zinc-800/80">
                      <div className="text-[10px] text-zinc-500 font-semibold">{isEn ? 'Required Ore Ingredients:' : '所需礦石原料：'}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {dish.requiredIngredients.map(r => {
                          const b = blockMap.get(r.blockId);
                          const owned = inventory[r.blockId] || 0;
                          const hasEnough = owned >= r.count;
                          return (
                            <span
                              key={r.blockId}
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                hasEnough
                                  ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                  : 'bg-rose-950/60 text-rose-300 border-rose-800'
                              }`}
                            >
                              {b ? (isEn ? b.nameEn : b.nameZh) : r.blockId} x{r.count} ({owned})
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Sell Price, XP, and Craft Buttons */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div className="text-[11px] font-mono">
                      <div className="text-amber-400 font-bold">+{dish.sellPrice} {isEn ? 'Coins' : '金幣'}</div>
                      <div className="text-[10px] text-zinc-500">+{dish.xpReward} XP</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCookDish(dish, 1)}
                        disabled={!canCook1}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          canCook1
                            ? 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95 shadow'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {isEn ? 'Cook x1' : '製作 x1'}
                      </button>

                      <button
                        onClick={() => handleCookDish(dish, 5)}
                        disabled={!canCook5}
                        className={`px-2 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          canCook5
                            ? 'bg-zinc-700 hover:bg-zinc-600 text-amber-200 active:scale-95'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        x5
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDishes.length > 120 && (
            <div className="text-center text-xs text-zinc-500">
              {isEn
                ? `Use search bar or category filters to explore all 1,000 gourmet recipes!`
                : `使用上方搜尋框或分類篩選標籤，即可探索完整的 1,000 道傳奇料理！`}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CAFE UPGRADES & WAITSTAFF */}
      {activeTab === 'upgrades' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upgrade 1: Unlock Tables (2 to 8) */}
            <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪑</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 font-minecraft">
                      {isEn ? 'Dining Tables Expansion' : '客席桌位擴建'}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {isEn
                        ? `Currently ${cafeState.unlockedTables} / 8 tables. More tables bring more concurrent customers!`
                        : `目前已解鎖 ${cafeState.unlockedTables} / 8 張桌位。更多桌位吸引更多顧客同時入座！`}
                    </p>
                  </div>
                </div>
              </div>

              {cafeState.unlockedTables < 8 ? (
                <button
                  onClick={() => {
                    const cost = cafeState.unlockedTables * 150;
                    if (coins < cost) {
                      sound.playHitSound(1);
                      return;
                    }
                    sound.playUpgradeSound();
                    onAddCoins(-cost);
                    onUpdateCafeState(prev => ({
                      ...prev,
                      unlockedTables: prev.unlockedTables + 1
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer ${
                    coins >= cafeState.unlockedTables * 150
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {isEn ? `Unlock Table #${cafeState.unlockedTables + 1} (${cafeState.unlockedTables * 150} Coins)` : `解鎖第 ${cafeState.unlockedTables + 1} 桌 (${cafeState.unlockedTables * 150} 幣)`}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-700">
                  {isEn ? 'Max Tables' : '已達上限'}
                </span>
              )}
            </div>

            {/* Upgrade 2: Auto-Waiter Cat */}
            <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐱</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 font-minecraft">
                      {isEn ? 'Hire Auto-Waiter Kitten' : '聘請自動送餐三花貓店員'}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {isEn
                        ? 'Automatically serves waiting customers if the requested dish is in your prepared stock!'
                        : '當備餐庫存有現成料理時，貓咪店員會自動幫忙端給顧客！'}
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
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {isEn ? 'Hire (500 Coins)' : '聘請 (500 金幣)'}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-700">
                  {isEn ? 'Active' : '已聘請工作中'}
                </span>
              )}
            </div>

            {/* Upgrade 3: Golden Espresso Machine */}
            <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 font-minecraft">
                      {isEn ? 'Golden Roaster & Espresso Machine' : '黃金高壓義式咖啡萃取機'}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {isEn
                        ? '+20% Extra Coin Tips on all served dishes!'
                        : '萃取頂級風味！所有送出餐點的小費金幣永久 +20%！'}
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
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {isEn ? 'Upgrade (800 Coins)' : '升級 (800 金幣)'}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-700">
                  {isEn ? 'Installed' : '已安裝'}
                </span>
              )}
            </div>

            {/* Upgrade 4: Lavender Aroma Diffuser */}
            <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <h4 className="text-sm font-black text-amber-200 font-minecraft">
                      {isEn ? 'Cozy Lavender Aroma Diffuser' : '舒緩薰衣草氛香儀'}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {isEn
                        ? 'Customer patience increased by +50% (from 60s to 90s)!'
                        : '散發怡人芳香，所有客人的等候耐心大幅延長 +50% (從 60 秒至 90 秒)！'}
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
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {isEn ? 'Purchase (600 Coins)' : '購買 (600 金幣)'}
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-700">
                  {isEn ? 'Installed' : '已安裝'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

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
          <span>{isEn ? 'Exit Cafe (Return to Overworld Map)' : '離開咖啡廳 (返回大地圖步道)'}</span>
        </button>
        <button
          onClick={() => {
            sound.playUpgradeSound();
            onGoToQuarry();
          }}
          className="px-5 py-2.5 bg-cyan-900/90 hover:bg-cyan-800 text-cyan-200 font-bold text-sm rounded-xl border-2 border-black shadow active:scale-95 flex items-center gap-2 cursor-pointer transition-all hover:brightness-110"
        >
          <span className="text-lg">🛗</span>
          <span>{isEn ? 'Take Elevator to Mine' : '搭乘電梯前往採掘礦坑'}</span>
        </button>
      </div>
    </div>
  );
};
