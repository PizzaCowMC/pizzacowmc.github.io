import React, { useState } from 'react';
import {
  CafeVenueId,
  CustomerOrder,
  CafeState,
  CafeDish,
  StaffMember,
  CafeFloorId
} from '../types';
import { getDishById } from '../data/cafeDishesData';
import { CAFE_ROLES } from '../data/cafeStaffAndPromotionData';
import { CharacterModelRenderer } from './CharacterModelRenderer';
import { sound } from '../utils/soundEffects';
import {
  Users,
  Sparkles,
  Trophy,
  Coffee,
  Coins,
  Clock,
  Zap,
  ArrowRightLeft,
  Building2,
  ChevronRight,
  ShieldCheck,
  Crown,
  Compass,
  Utensils,
  DoorOpen
} from 'lucide-react';

interface CafeFloorBlueprintMapProps {
  cafeState: CafeState;
  onUpdateCafeState: (updater: (prev: CafeState) => CafeState) => void;
  coins: number;
  orders: CustomerOrder[];
  inventory: Record<string, number>;
  onServeOrder: (order: CustomerOrder) => void;
  canCraftDish: (dish: CafeDish, multiplier?: number) => boolean;
  onOpenStaffModal: () => void;
  onOpenPromotionModal: () => void;
  onGoToKitchen: () => void;
  onGoToQuarry: () => void;
  isEn: boolean;
}

export const CafeFloorBlueprintMap: React.FC<CafeFloorBlueprintMapProps> = ({
  cafeState,
  onUpdateCafeState,
  coins,
  orders,
  inventory,
  onServeOrder,
  canCraftDish,
  onOpenStaffModal,
  onOpenPromotionModal,
  onGoToKitchen,
  onGoToQuarry,
  isEn
}) => {
  const currentVenue: CafeVenueId = cafeState.currentVenue || 'main';
  const isMain = currentVenue === 'main';

  const staffMembers = cafeState.staffMembers || [];
  const hiredStaff = staffMembers.filter(s => s.isHired);

  // Active staff on counter for current venue
  const counterStaff = hiredStaff.filter(s =>
    isMain
      ? s.assignedVenue === 'main' || !s.isCrossDispatched
      : s.assignedVenue === 'branch_2' || s.crossDispatchTarget?.includes('二號分館')
  );

  // Active orders mapped to 12 blueprint tables (0 to 11 for Main, 4 to 15 for Branch 2)
  const tableIndices = isMain ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const handleSwitchVenue = (venue: CafeVenueId) => {
    sound.playClickSound();
    onUpdateCafeState(prev => ({
      ...prev,
      currentVenue: venue,
      branch2Unlocked: true
    }));
  };

  return (
    <div className="space-y-4 font-sans text-white">
      {/* 1. TOP VENUE SWITCHER (加入另一個: 本館旗艦大廳 ⇄ 二號分館・星空祕境) */}
      <div className="bg-[#181614] p-3 rounded-2xl border-3 border-[#4d3a2a] flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border-2 border-amber-600 flex items-center justify-center text-xl shadow-inner">
            🗺️
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider flex items-center gap-1.5">
              <span>{isEn ? 'Cafe Blueprint Map' : '咖啡廳實景俯視平面地圖'}</span>
              <span className="text-zinc-400">•</span>
              <span className="text-emerald-400 font-minecraft">
                {isEn ? 'Hand-drawn Layout Replicated' : '依照原創藍圖完美構建'}
              </span>
            </div>
            <div className="text-sm font-black text-white font-minecraft flex items-center gap-2">
              <span>{isMain ? (isEn ? 'Main Flagship Hall' : '本館・旗艦出餐大廳') : (isEn ? 'Branch #2 Celestial Starlight' : '二號分館・星空祕境露天店')}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                12 {isEn ? 'Tables' : '張客席餐桌'}
              </span>
            </div>
          </div>
        </div>

        {/* Venue Switch Buttons (加入另一個) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSwitchVenue('main')}
            className={`px-3.5 py-2 rounded-xl text-xs font-minecraft font-black flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
              isMain
                ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            <span>🏛️</span>
            <span>{isEn ? 'Main Flagship Hall' : '🏛️ 本館旗艦大廳'}</span>
          </button>

          <button
            onClick={() => handleSwitchVenue('branch_2')}
            className={`px-3.5 py-2 rounded-xl text-xs font-minecraft font-black flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
              !isMain
                ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105'
                : 'bg-zinc-900 text-purple-300 hover:text-white border-purple-900/60'
            }`}
          >
            <span>🌌</span>
            <span>{isEn ? 'Branch #2 Celestial' : '🌌 二號分館・星空祕境 (另一個)'}</span>
          </button>

          {/* Quick Action: Staff Roles & Cross-Hire */}
          <button
            onClick={() => {
              sound.playClickSound();
              onOpenStaffModal();
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white text-xs font-minecraft font-black rounded-xl border-2 border-amber-400/80 shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-200" />
            <span>{isEn ? 'Staff Roles & Cross-Hire' : '👥 職位與跨請管理'}</span>
          </button>

          {/* Quick Action: Hardcore Promotion */}
          <button
            onClick={() => {
              sound.playClickSound();
              onOpenPromotionModal();
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-yellow-600 to-amber-500 hover:brightness-110 text-black text-xs font-minecraft font-black rounded-xl border-2 border-yellow-300 shadow flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <Trophy className="w-4 h-4 text-black" />
            <span>{isEn ? 'Hardcore Promotion Trials' : '🏆 超級晉級考驗'}</span>
          </button>
        </div>
      </div>

      {/* 2. THE BLUEPRINT MAP CANVAS (MATCHING USER DRAWING) */}
      <div
        className={`p-5 rounded-3xl border-4 shadow-2xl relative overflow-hidden transition-all ${
          isMain
            ? 'bg-[#2b221a] border-[#5a432f] bg-[radial-gradient(#3a2e22_1px,transparent_1px)] [background-size:16px_16px]'
            : 'bg-[#18112b] border-[#57398b] bg-[radial-gradient(#2d1e4e_1px,transparent_1px)] [background-size:16px_16px]'
        }`}
      >
        {/* Atmosphere Watermark & Indicators */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-zinc-300">
              {isMain
                ? (isEn ? 'FLOOR BLUEPRINT: SECTOR 1F ~ 2F' : '全場實景藍圖：1F 橡木石砌服務區')
                : (isEn ? 'FLOOR BLUEPRINT: CELESTIAL SKY' : '全場實景藍圖：二號分館・星空浮島')}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>持現金幣: <strong className="text-amber-400 font-mono">{coins.toLocaleString()} 🪙</strong></span>
            <span>•</span>
            <span>送餐累計: <strong className="text-emerald-400 font-mono">{cafeState.totalDishesServed}</strong></span>
          </div>
        </div>

        {/* TOP SERVICE COUNTER BAR (櫃檯長桌 + 員工工位) */}
        <div className="mb-8 relative">
          {/* Label banner above the counter */}
          <div className="flex items-center justify-between mb-1.5 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black font-minecraft text-amber-300 uppercase tracking-wider bg-black/50 px-2.5 py-0.5 rounded-lg border border-amber-600/40">
                [ {isEn ? 'SERVICE COUNTER & BARISTA PASS' : '點餐出餐吧檯長桌（櫃檯）'} ]
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">
                {isEn ? 'Behind Counter: Staff stations & Bar' : '櫃檯後方：員工當值工位、專業咖啡機與取餐口'}
              </span>
            </div>

            <button
              onClick={onOpenStaffModal}
              className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-black/40 px-2 py-0.5 rounded border border-zinc-700"
            >
              <Zap className="w-3 h-3" />
              <span>{isEn ? 'Manage Staff & Roles' : '管理職位與調度'}</span>
            </button>
          </div>

          {/* Counter Behind Area: The Staff ("員工" boxes from the drawing) */}
          <div className="flex items-end justify-between gap-3 px-4 pb-2">
            {/* Staff Workstations ("員工" cards matching the drawing) */}
            <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
              {counterStaff.length > 0 ? (
                counterStaff.map((staff, idx) => (
                  <div
                    key={staff.id}
                    onClick={() => {
                      sound.playClickSound();
                      onOpenStaffModal();
                    }}
                    title={isEn ? 'Click to inspect or cross-dispatch' : '點擊查看職位或執行跨請'}
                    className="p-2.5 rounded-xl bg-zinc-900/90 border-2 border-amber-500/80 shadow-lg hover:border-amber-400 hover:scale-105 transition-all cursor-pointer flex flex-col items-center gap-1 min-w-[90px] relative group"
                  >
                    {/* Top Pill: "員工" (Matches user drawing text!) */}
                    <span className="text-[9px] font-black font-minecraft text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-600">
                      {isEn ? 'STAFF' : '員工'}
                    </span>

                    {/* Enhanced Animated Staff Model */}
                    <div className="my-0.5 pointer-events-none">
                      <CharacterModelRenderer
                        outfitId={
                          staff.outfitId ||
                          (staff.roleId === 'manager'
                            ? 'royal_tuxedo'
                            : staff.roleId === 'barista'
                            ? 'barista_uniform'
                            : staff.roleId === 'chef'
                            ? 'executive_chef'
                            : staff.roleId === 'waiter'
                            ? 'maid_cafe_elegance'
                            : staff.roleId === 'mixologist'
                            ? 'mixologist_neon'
                            : staff.roleId === 'sommelier'
                            ? 'sommelier_noble'
                            : staff.roleId === 'procurement'
                            ? 'netherite_hazard'
                            : 'classic_miner')
                        }
                        size="xs"
                        animation="idle"
                        showShadow={false}
                      />
                    </div>

                    {/* Staff Name & Role */}
                    <div className="text-center">
                      <div className="text-[10px] font-black text-zinc-200 truncate max-w-[80px]">
                        {isEn ? staff.nameEn.split(' ')[0] : staff.nameZh.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-amber-400 font-bold">
                        {staff.roleId === 'manager' && (isEn ? '👔 Manager' : '👔 店長')}
                        {staff.roleId === 'barista' && (isEn ? '☕ Barista' : '☕ 咖啡師')}
                        {staff.roleId === 'chef' && (isEn ? '👨‍🍳 Chef' : '👨‍🍳 主廚')}
                        {staff.roleId === 'waiter' && (isEn ? '🏃 Waiter' : '🏃‍♂️ 領班')}
                        {staff.roleId === 'mixologist' && (isEn ? '🍸 Mixologist' : '🍸 調酒師')}
                        {staff.roleId === 'sommelier' && (isEn ? '🎩 Sommelier' : '🎩 品鑑官')}
                        {staff.roleId === 'procurement' && (isEn ? '⛏️ Buyer' : '⛏️ 採購')}
                      </div>
                    </div>

                    {/* Status beacon */}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse absolute -top-1 -right-1 border border-black" />
                  </div>
                ))
              ) : (
                <div
                  onClick={onOpenStaffModal}
                  className="p-3 rounded-xl border-2 border-dashed border-amber-500/60 bg-amber-950/20 text-center cursor-pointer hover:bg-amber-900/30 transition-colors"
                >
                  <span className="text-xs text-amber-300 font-bold font-minecraft">
                    + {isEn ? 'Assign Staff (員工)' : '配置員工當值'}
                  </span>
                </div>
              )}

              {/* Station 2: Redstone Espresso Machine & Pastry Warmer */}
              <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-700 text-center min-w-[80px] hidden sm:flex flex-col items-center justify-center gap-1 shadow">
                <span className="text-xl">☕</span>
                <span className="text-[9px] text-zinc-400 font-bold">
                  {isEn ? 'Espresso Bar' : '極品義式機'}
                </span>
              </div>

              {/* Station 3: Cashier Register */}
              <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-700 text-center min-w-[80px] hidden sm:flex flex-col items-center justify-center gap-1 shadow">
                <span className="text-xl">💰</span>
                <span className="text-[9px] text-zinc-400 font-bold">
                  {isEn ? 'Cash Register' : '紅石收銀台'}
                </span>
              </div>
            </div>

            {/* Right Door / Elevator passage */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  sound.playClickSound();
                  onGoToKitchen();
                }}
                className="p-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-2 border-amber-600 flex flex-col items-center gap-1 cursor-pointer transition-all shadow hover:scale-105"
              >
                <Utensils className="w-4 h-4 text-amber-300" />
                <span className="text-[10px] font-black font-minecraft">
                  {isEn ? 'Kitchen' : '後廚'}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playUpgradeSound();
                  onGoToQuarry();
                }}
                className="p-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border-2 border-cyan-600 flex flex-col items-center gap-1 cursor-pointer transition-all shadow hover:scale-105"
              >
                <DoorOpen className="w-4 h-4 text-cyan-300" />
                <span className="text-[10px] font-black font-minecraft">
                  {isEn ? 'Elevator' : '礦坑電梯'}
                </span>
              </button>
            </div>
          </div>

          {/* THE LONG HORIZONTAL COUNTER BAR (The thick long rectangle in the drawing) */}
          <div className="w-full h-11 bg-gradient-to-r from-[#6b4728] via-[#855933] to-[#6b4728] border-4 border-[#3d2715] rounded-xl shadow-2xl flex items-center justify-between px-6 relative">
            {/* Wood planks grain lines */}
            <div className="flex items-center gap-8 text-[11px] font-black font-minecraft text-amber-200/90 uppercase tracking-wider select-none">
              <span>☕ {isEn ? 'ORDER HERE' : '點餐出餐口'}</span>
              <span className="hidden md:inline">✨ {isEn ? 'REDSTONE BAR' : '紅石溫控吧台長桌'}</span>
              <span className="hidden sm:inline">🍰 {isEn ? 'PASTRY PASS' : '烘焙取餐台'}</span>
            </div>

            {/* Serving tray animated indicators */}
            <div className="flex items-center gap-3">
              <span className="text-base animate-bounce">🍽️</span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {isEn ? 'Orders Ready' : '現成備餐中'}
              </span>
            </div>
          </div>
        </div>

        {/* DINING TABLES AREA (THE RECTANGULAR BOXES IN THE SKETCH) */}
        {/* Arranged in 3 rows with 4 tables each = 12 dining tables */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="text-xs font-black font-minecraft text-white flex items-center gap-2 uppercase tracking-wider">
              <span>🍽️</span>
              <span>
                {isMain
                  ? (isEn ? 'Patron Dining Tables (Rows 1 ~ 3)' : '客席用餐區（原圖 12 張方桌格局）')
                  : (isEn ? 'Celestial Annex Tables' : '二號分館・星空浮石餐席')}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">
              {isEn ? 'Click table to serve or interact' : '點擊餐桌可即時送餐或檢視客人評價'}
            </span>
          </div>

          {/* The 3x4 Grid of Dining Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tableIndices.map((tableIdx, localIdx) => {
              const order = orders.find(o => o.tableIndex === tableIdx);
              const dish = order ? getDishById(order.dishId) : null;
              const inStock = dish ? (cafeState.dishInventory[dish.id] || 0) > 0 : false;
              const canInstantCook = dish ? canCraftDish(dish, 1) : false;

              const patiencePercent = order
                ? Math.round((order.patienceRemaining / order.patienceTotal) * 100)
                : 100;

              return (
                <div
                  key={tableIdx}
                  className={`p-4 rounded-2xl border-3 flex flex-col justify-between gap-3 shadow-xl transition-all relative overflow-hidden ${
                    order?.status === 'eating'
                      ? 'bg-emerald-950/40 border-emerald-500/70 shadow-emerald-950/50'
                      : isMain
                      ? 'bg-[#1e1a16] border-[#443324] hover:border-amber-500/60'
                      : 'bg-[#1f1738] border-[#4f3183] hover:border-purple-400'
                  }`}
                >
                  {/* Table header & seat number */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-amber-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-700">
                      {isMain ? `桌號 #${localIdx + 1}` : `星空桌 #${localIdx + 1}`}
                    </span>

                    {order && order.status === 'waiting' && (
                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className={patiencePercent < 30 ? 'text-rose-400 animate-pulse' : 'text-zinc-300'}>
                          {order.patienceRemaining}s
                        </span>
                      </div>
                    )}

                    {order && order.status === 'eating' && (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600 animate-pulse">
                        💖 享用中
                      </span>
                    )}

                    {!order && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {isEn ? 'Empty' : '空席待客'}
                      </span>
                    )}
                  </div>

                  {/* Customer Information if seated */}
                  {order && dish ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-black/50 border-2 border-amber-600/50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {order.customerAvatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-amber-200 truncate font-minecraft">
                            {isEn ? order.customerNameEn : order.customerNameZh}
                          </div>
                          {/* Dialogue Bubble */}
                          <div className="text-[10px] text-zinc-300 bg-black/70 p-1.5 rounded-lg border border-zinc-800 mt-0.5 italic truncate">
                            "{isEn ? order.dialogueEn : order.dialogueZh}"
                          </div>
                        </div>
                      </div>

                      {/* Ordered Dish Box */}
                      <div className="p-2 bg-black/40 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl shrink-0">{dish.icon}</span>
                          <div className="min-w-0">
                            <div className="text-[11px] font-black text-amber-300 truncate">
                              {isEn ? dish.nameEn : dish.nameZh}
                            </div>
                            <div className="text-[9px] text-zinc-400 flex items-center gap-1 font-mono">
                              <span className="text-amber-400 font-bold">+{dish.sellPrice} 🪙</span>
                              <span>•</span>
                              <span className="text-emerald-400">x{order.tipMultiplier} 小費</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                            inStock
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : canInstantCook
                              ? 'bg-amber-950 text-amber-300 border-amber-600'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {inStock ? '現貨' : canInstantCook ? '可即煮' : '缺料'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-20 flex flex-col items-center justify-center text-zinc-500 text-xs">
                      <span className="text-2xl mb-1 opacity-40">🪑</span>
                      <span>{isEn ? 'Waiting for guests...' : '等待客人入座...'}</span>
                    </div>
                  )}

                  {/* Table Action Button */}
                  {order && order.status === 'waiting' && (
                    <button
                      onClick={() => onServeOrder(order)}
                      disabled={!inStock && !canInstantCook}
                      className={`w-full py-2 rounded-xl text-xs font-minecraft font-black flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer ${
                        inStock
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400 active:scale-95'
                          : canInstantCook
                          ? 'bg-amber-500 hover:bg-amber-400 text-black border-2 border-amber-300 active:scale-95'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>
                        {inStock
                          ? isEn
                            ? 'Serve Dish'
                            : '即刻上菜'
                          : canInstantCook
                          ? isEn
                            ? 'Instant Cook & Serve'
                            : '現場料理並送餐'
                          : isEn
                          ? 'Need Ingredients'
                          : '缺少食材'}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
