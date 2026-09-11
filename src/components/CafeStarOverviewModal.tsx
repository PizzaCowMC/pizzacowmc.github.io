import React, { useState } from 'react';
import { CafeFacility, StarRank, CafeFloorId, CafeState } from '../types';
import {
  CAFE_FACILITIES,
  CAFE_FLOORS,
  STAR_RANKS_ORDER,
  getRankInfo,
  getNextRank,
  calculateTotalCafeStarBonuses
} from '../data/cafeFacilitiesData';
import { sound } from '../utils/soundEffects';
import {
  Award,
  Sparkles,
  TrendingUp,
  Coins,
  Clock,
  Zap,
  X,
  CheckCircle,
  Filter,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CafeStarOverviewModalProps {
  cafeState: CafeState;
  coins: number;
  onUpgradeFacility: (facilityId: string) => void;
  onClose: () => void;
  isEn: boolean;
}

export const CafeStarOverviewModal: React.FC<CafeStarOverviewModalProps> = ({
  cafeState,
  coins,
  onUpgradeFacility,
  onClose,
  isEn
}) => {
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<CafeFloorId | 'all'>('all');

  const facilityStars = cafeState.facilityStars || {};
  const totalBonuses = calculateTotalCafeStarBonuses(facilityStars);

  const filteredFacilities = CAFE_FACILITIES.filter(
    f => selectedFloorFilter === 'all' || f.floorId === selectedFloorFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#1c1a17] border-4 border-amber-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden text-white font-sans flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#141210] px-6 py-4 border-b-2 border-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 font-minecraft tracking-wider">
                  {isEn ? 'Cafe Facilities Star Rating System (F1 ~ S3)' : '全咖啡廳設施星級總覽系統 (F1 ~ S3)'}
                </h2>
                <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded font-minecraft">
                  21 RANKS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {isEn
                  ? 'Upgrade all 16 facilities across 4 floors to unlock astronomical profit multipliers & perks!'
                  : '升級 1F、2F、3F 與露天酒吧共 16 大核心設施，全面提升售價、小費與被動分紅！'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Cafe Star Bonuses Banner */}
        <div className="bg-gradient-to-r from-amber-950/60 via-[#271b12] to-amber-950/60 p-4 border-b-2 border-amber-900/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 bg-black/50 rounded-xl border border-amber-900/60 text-center">
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>{isEn ? 'Dish Price Multiplier' : '料理售價總加成'}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-0.5">
                +{totalBonuses.totalSellPriceBonusPct}%
              </div>
            </div>

            <div className="p-2.5 bg-black/50 rounded-xl border border-amber-900/60 text-center">
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isEn ? 'Tip Multiplier Bonus' : '額外小費總加成'}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono mt-0.5">
                +{totalBonuses.totalTipMultiplierBonus.toFixed(2)}x
              </div>
            </div>

            <div className="p-2.5 bg-black/50 rounded-xl border border-amber-900/60 text-center">
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{isEn ? 'Extra Guest Patience' : '顧客耐心總延長'}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-cyan-300 font-mono mt-0.5">
                +{totalBonuses.totalPatienceBonusSec}s
              </div>
            </div>

            <div className="p-2.5 bg-black/50 rounded-xl border border-amber-900/60 text-center">
              <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span>{isEn ? 'Passive Dividend' : '被動分紅金幣'}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-yellow-400 font-mono mt-0.5">
                +{totalBonuses.totalPassiveCoins} 🪙 / 3s
              </div>
            </div>
          </div>
        </div>

        {/* Floor Filter Tabs */}
        <div className="px-5 py-2.5 bg-[#171513] border-b border-zinc-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-zinc-500 font-bold shrink-0">{isEn ? 'Filter Floor:' : '篩選樓層:'}</span>
          <button
            onClick={() => setSelectedFloorFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-minecraft font-black shrink-0 transition-colors cursor-pointer ${
              selectedFloorFilter === 'all'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {isEn ? 'All Floors (16)' : '全部樓層 (16)'}
          </button>
          {CAFE_FLOORS.map(fl => {
            const isSelected = selectedFloorFilter === fl.id;
            return (
              <button
                key={fl.id}
                onClick={() => setSelectedFloorFilter(fl.id)}
                className={`px-3 py-1 rounded-lg text-xs font-minecraft font-black flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span>{fl.icon}</span>
                <span>{isEn ? fl.badgeEn : fl.badgeZh}</span>
              </button>
            );
          })}
        </div>

        {/* Facilities List Grid */}
        <div className="p-5 overflow-y-auto space-y-3 custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFacilities.map(fac => {
              const currentRank: StarRank = facilityStars[fac.id] || 'F1';
              const rankInfo = getRankInfo(currentRank);
              const nextInfo = getNextRank(currentRank);
              const floor = CAFE_FLOORS.find(f => f.id === fac.floorId);
              const canAfford = nextInfo ? coins >= nextInfo.upgradeCost : false;
              const rankIndex = STAR_RANKS_ORDER.indexOf(currentRank);
              const progressPct = Math.round(((rankIndex + 1) / STAR_RANKS_ORDER.length) * 100);

              return (
                <div
                  key={fac.id}
                  className="p-3.5 bg-zinc-900/90 rounded-2xl border-2 border-zinc-800 hover:border-amber-700/60 transition-all flex flex-col justify-between gap-3 shadow-lg"
                >
                  <div>
                    {/* Top Facility info & star badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-600/60 flex items-center justify-center text-xl shadow-inner">
                          {fac.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">
                              {floor ? (isEn ? floor.badgeEn : floor.badgeZh) : fac.floorId}
                            </span>
                            <span className="text-[11px] font-bold text-amber-200">
                              {isEn ? rankInfo.titleEn : rankInfo.titleZh}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-white font-minecraft">
                            {isEn ? fac.nameEn : fac.nameZh}
                          </h4>
                        </div>
                      </div>

                      {/* Rank Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-black font-minecraft border shadow ${rankInfo.badgeBg} ${rankInfo.badgeBorder}`}
                      >
                        ★ {currentRank}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Current Stats */}
                    <div className="grid grid-cols-4 gap-1 text-[10px] text-center p-2 bg-black/40 rounded-xl border border-zinc-800">
                      <div>
                        <div className="text-zinc-500">{isEn ? 'Sell' : '售價'}</div>
                        <div className="font-bold text-emerald-400">+{rankInfo.sellPriceBonusPct}%</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">{isEn ? 'Tip' : '小費'}</div>
                        <div className="font-bold text-amber-400">+{rankInfo.tipMultiplierBonus}x</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">{isEn ? 'Patience' : '耐心'}</div>
                        <div className="font-bold text-cyan-400">+{rankInfo.patienceBonusSec}s</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">{isEn ? 'Dividends' : '分紅'}</div>
                        <div className="font-bold text-yellow-400">+{rankInfo.passiveCoinsPerInterval}🪙</div>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade CTA */}
                  {nextInfo ? (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          sound.playUpgradeSound();
                          onUpgradeFacility(fac.id);
                        } else {
                          sound.playHitSound(1);
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2 px-3 rounded-xl font-minecraft font-black text-xs border flex items-center justify-between transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-300 shadow-md active:scale-95'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isEn ? `Upgrade to ${nextInfo.rank}` : `晉升至 ${nextInfo.rank} 星級`}</span>
                      </span>
                      <span className="font-mono font-bold">
                        {nextInfo.upgradeCost.toLocaleString()} 🪙
                      </span>
                    </button>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-xl font-minecraft font-black text-xs bg-yellow-950/70 text-yellow-300 border border-yellow-600/50 text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-yellow-400" />
                      <span>{isEn ? 'MAX S3 SUPREME RANK' : '已登頂 S3 極致至尊星級'}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#141210] p-4 border-t-2 border-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-zinc-400">{isEn ? 'Current Coins:' : '當前持有金幣:'}</span>
            <span className="text-sm font-black font-mono text-yellow-400">{coins.toLocaleString()}</span>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-minecraft font-bold cursor-pointer"
          >
            {isEn ? 'Close' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
};
