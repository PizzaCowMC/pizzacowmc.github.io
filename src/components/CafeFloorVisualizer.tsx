import React from 'react';
import { CafeFloorId, CafeFacility, StarRank, CustomerOrder, CafeState, CafeDish } from '../types';
import {
  CAFE_FLOORS,
  CAFE_FACILITIES,
  getRankInfo,
  getNextRank,
  FloorData
} from '../data/cafeFacilitiesData';
import { sound } from '../utils/soundEffects';
import {
  Sparkles,
  Award,
  Zap,
  Clock,
  Coins,
  Heart,
  ChevronRight,
  TrendingUp,
  ArrowUpCircle,
  Eye
} from 'lucide-react';
import { getDishById } from '../data/cafeDishesData';

interface CafeFloorVisualizerProps {
  currentFloor: CafeFloorId;
  onChangeFloor: (floorId: CafeFloorId) => void;
  cafeState: CafeState;
  coins: number;
  orders: CustomerOrder[];
  inventory: Record<string, number>;
  onServeOrder: (order: CustomerOrder) => void;
  canCraftDish: (dish: CafeDish, multiplier?: number) => boolean;
  onSelectFacility: (facility: CafeFacility) => void;
  onQuickUpgradeFacility: (facilityId: string) => void;
  isEn: boolean;
}

export const CafeFloorVisualizer: React.FC<CafeFloorVisualizerProps> = ({
  currentFloor,
  onChangeFloor,
  cafeState,
  coins,
  orders,
  inventory,
  onServeOrder,
  canCraftDish,
  onSelectFacility,
  onQuickUpgradeFacility,
  isEn
}) => {
  const floorConfig = CAFE_FLOORS.find(f => f.id === currentFloor) || CAFE_FLOORS[0];
  const floorFacilities = CAFE_FACILITIES.filter(f => f.floorId === currentFloor);

  // Filter orders for this floor (each floor handles 4 distinct table indices: 1F: 0-3, 2F: 4-7, 3F: 8-11, Rooftop: 12-15)
  const floorTableOffset = currentFloor === '1F' ? 0 : currentFloor === '2F' ? 4 : currentFloor === '3F' ? 8 : 12;
  const floorOrders = orders.filter(
    o => o.tableIndex >= floorTableOffset && o.tableIndex < floorTableOffset + 4
  );

  return (
    <div className="space-y-4">
      {/* 1. ELEVATOR & FLOOR SWITCHER TABS */}
      <div className="bg-[#181614] p-3 rounded-2xl border-3 border-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-600 flex items-center justify-center text-lg shadow-inner">
            🛗
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
              {isEn ? 'Redstone Steam Elevator' : '紅石蒸氣景觀電梯'}
            </div>
            <div className="text-xs font-black text-white font-minecraft">
              {isEn ? 'Floor Navigator' : '樓層切換導航'}
            </div>
          </div>
        </div>

        {/* 4 Floor Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CAFE_FLOORS.map(fl => {
            const isSelected = fl.id === currentFloor;
            return (
              <button
                key={fl.id}
                onClick={() => {
                  sound.playClickSound();
                  onChangeFloor(fl.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-minecraft font-black flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className="text-sm">{fl.icon}</span>
                <span>{isEn ? fl.badgeEn : fl.badgeZh}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FLOOR ATMOSPHERE BANNER */}
      <div
        className={`p-4 rounded-2xl border-3 border-amber-900/60 bg-gradient-to-r ${floorConfig.bgGradient} shadow-2xl relative overflow-hidden text-white`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{floorConfig.icon}</span>
              <h2 className="text-base sm:text-lg font-black text-amber-300 font-minecraft drop-shadow">
                {isEn ? floorConfig.nameEn : floorConfig.nameZh}
              </h2>
            </div>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              {isEn ? floorConfig.descEn : floorConfig.descZh}
            </p>
          </div>

          {/* Quick Floor Status Tag */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 bg-black/50 backdrop-blur rounded-xl border border-white/10 text-right">
              <div className="text-[10px] text-zinc-400">{isEn ? 'Seated Guests' : '在席客人'}</div>
              <div className="text-xs font-black text-amber-300 font-mono">
                {floorOrders.length} / 4 {isEn ? 'Patrons' : '位貴賓'}
              </div>
            </div>
            <div className="px-3 py-1.5 bg-black/50 backdrop-blur rounded-xl border border-white/10 text-right">
              <div className="text-[10px] text-zinc-400">{isEn ? 'Floor Facilities' : '本層設施'}</div>
              <div className="text-xs font-black text-emerald-400 font-mono">
                4 / 4 {isEn ? 'Active' : '座運轉中'}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div
          className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: floorConfig.themeColor }}
        />
      </div>

      {/* 3. VISIBLE FLOOR FACILITIES (能看到咖啡廳裡的設施) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚙️</span>
            <h3 className="text-xs sm:text-sm font-black text-white font-minecraft uppercase tracking-wider">
              {isEn ? 'Floor Facilities & Star Progression' : '樓層專屬設施與星級運轉'}
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400">
            {isEn ? 'Click facility card to inspect & upgrade' : '點擊設施卡片可檢視詳細數值與星級晉升'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {floorFacilities.map(facility => {
            const currentRank: StarRank = cafeState.facilityStars?.[facility.id] || 'F1';
            const rankInfo = getRankInfo(currentRank);
            const nextInfo = getNextRank(currentRank);
            const canAfford = nextInfo ? coins >= nextInfo.upgradeCost : false;

            return (
              <div
                key={facility.id}
                className="p-3.5 rounded-2xl bg-zinc-900/90 border-2 border-zinc-800 hover:border-amber-600/70 transition-all flex flex-col justify-between gap-3 shadow-lg group relative overflow-hidden"
              >
                {/* Top Facility Title & Rank */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-600/60 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                      {facility.icon}
                    </div>
                    {/* Star Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs font-black font-minecraft border shadow-sm ${rankInfo.badgeBg} ${rankInfo.badgeBorder}`}
                    >
                      ★ {currentRank}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-white font-minecraft group-hover:text-amber-300 transition-colors line-clamp-1">
                    {isEn ? facility.nameEn : facility.nameZh}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-snug">
                    {isEn ? facility.descEn : facility.descZh}
                  </p>
                </div>

                {/* Facility Active Perks Box */}
                <div className="p-2 bg-black/50 rounded-xl border border-zinc-800 text-[10px] space-y-1 text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">{isEn ? 'Sell Price:' : '售價提升:'}</span>
                    <span className="font-bold text-emerald-400">+{rankInfo.sellPriceBonusPct}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">{isEn ? 'Tip Bonus:' : '小費乘數:'}</span>
                    <span className="font-bold text-amber-400">+{rankInfo.tipMultiplierBonus}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">{isEn ? 'Passive Dividend:' : '被動分紅:'}</span>
                    <span className="font-bold text-yellow-400">+{rankInfo.passiveCoinsPerInterval} 🪙</span>
                  </div>
                </div>

                {/* Action Buttons: Inspect & Quick Upgrade */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      sound.playClickSound();
                      onSelectFacility(facility);
                    }}
                    title={isEn ? 'Inspect Facility Details' : '檢視設施詳情'}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {nextInfo ? (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          sound.playUpgradeSound();
                          onQuickUpgradeFacility(facility.id);
                        } else {
                          sound.playHitSound(1);
                        }
                      }}
                      disabled={!canAfford}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl font-minecraft font-black text-[11px] border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-300 shadow-amber-500/20 active:scale-95'
                          : 'bg-zinc-800/80 text-zinc-500 border-zinc-700 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span className="truncate">
                        {isEn
                          ? `★ ${nextInfo.rank} (${nextInfo.upgradeCost.toLocaleString()})`
                          : `★ 晉升 ${nextInfo.rank} (${nextInfo.upgradeCost.toLocaleString()})`}
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

      {/* 4. VISIBLE SEATED PATRONS & TABLES (能看到客人) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">👥</span>
            <h3 className="text-xs sm:text-sm font-black text-white font-minecraft uppercase tracking-wider">
              {isEn ? `${floorConfig.nameEn} • Guests & Dining Tables` : `${floorConfig.nameZh} • 客人座席與即刻點餐`}
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400">
            {isEn ? 'Serve delicious dishes to earn coins & tips' : '送上美味佳餚，賺取豐厚金幣與小費'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {floorOrders.map((order, localIdx) => {
            const dish = getDishById(order.dishId);
            if (!dish) return null;

            const inStock = (cafeState.dishInventory[order.dishId] || 0) > 0;
            const canInstantCook = canCraftDish(dish, 1);
            const patiencePercent = Math.round((order.patienceRemaining / order.patienceTotal) * 100);

            return (
              <div
                key={order.id}
                className={`p-4 rounded-2xl border-3 flex flex-col justify-between gap-3 relative overflow-hidden transition-all shadow-xl ${
                  order.status === 'eating'
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-emerald-950/40'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-amber-600/50'
                }`}
              >
                {/* Table ID & Patience Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      {isEn ? `${floorConfig.badgeEn} - Seat #${localIdx + 1}` : `${floorConfig.badgeZh} - 座位 #${localIdx + 1}`}
                    </span>
                    {order.status === 'waiting' ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className={patiencePercent < 30 ? 'text-rose-400 animate-pulse' : 'text-zinc-300'}>
                          {order.patienceRemaining}s
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black font-minecraft text-emerald-400 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-600 animate-pulse">
                        💖 {isEn ? 'EATING...' : '享用中...'}
                      </span>
                    )}
                  </div>

                  {/* Customer Avatar & Dialogue Speech Bubble */}
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-950/80 border-2 border-amber-600/60 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      {order.customerAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-amber-200 truncate font-minecraft">
                        {isEn ? order.customerNameEn : order.customerNameZh}
                      </div>
                      {/* Speech Bubble */}
                      <div className="text-[11px] text-zinc-300 bg-black/60 p-2 rounded-xl border border-zinc-800 mt-1 italic leading-tight shadow-sm">
                        "{isEn ? order.dialogueEn : order.dialogueZh}"
                      </div>
                    </div>
                  </div>

                  {/* Ordered Dish Box */}
                  <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl">{dish.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-amber-300 truncate font-minecraft">
                          {isEn ? dish.nameEn : dish.nameZh}
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <span className="text-amber-400 font-mono font-bold">
                            +{dish.sellPrice} 🪙
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400">小費 x{order.tipMultiplier}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                        inStock
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                          : canInstantCook
                          ? 'bg-amber-950 text-amber-300 border-amber-600'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {inStock
                        ? (isEn ? `Ready (${cafeState.dishInventory[order.dishId]})` : `現成庫存 (${cafeState.dishInventory[order.dishId]})`)
                        : canInstantCook
                        ? (isEn ? 'Quick-Cook' : '可現做現送')
                        : (isEn ? 'Missing Ore' : '缺食材')}
                    </span>
                  </div>
                </div>

                {/* Patience Progress Bar */}
                {order.status === 'waiting' && (
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        patiencePercent > 50
                          ? 'bg-emerald-500'
                          : patiencePercent > 25
                          ? 'bg-amber-500'
                          : 'bg-rose-500 animate-pulse'
                      }`}
                      style={{ width: `${patiencePercent}%` }}
                    />
                  </div>
                )}

                {/* Serve Button */}
                {order.status === 'waiting' ? (
                  <button
                    onClick={() => {
                      sound.playClickSound();
                      onServeOrder(order);
                    }}
                    disabled={!inStock && !canInstantCook}
                    className={`w-full py-2 px-3 rounded-xl font-minecraft font-black text-xs border-2 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                      inStock
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30'
                        : canInstantCook
                        ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-300 shadow-amber-500/30'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    <span>🍽️</span>
                    <span>
                      {inStock
                        ? (isEn ? 'Serve from Stock' : '立即送上現成料理')
                        : canInstantCook
                        ? (isEn ? 'Quick Cook & Serve' : '現做現送顧客')
                        : (isEn ? 'Ingredients Needed' : '食材不足 (需採掘)')}
                    </span>
                  </button>
                ) : (
                  <div className="py-2 px-3 rounded-xl bg-emerald-950/70 text-emerald-300 text-center font-minecraft text-xs border border-emerald-600 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>{isEn ? 'Savoring Delicacy...' : '客人正在陶醉享用...'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
