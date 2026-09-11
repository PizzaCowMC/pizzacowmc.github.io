import React from 'react';
import { CafeFacility, StarRank } from '../types';
import {
  STAR_RANKS,
  STAR_RANKS_ORDER,
  getRankInfo,
  getNextRank,
  CAFE_FLOORS
} from '../data/cafeFacilitiesData';
import { sound } from '../utils/soundEffects';
import {
  Sparkles,
  Award,
  TrendingUp,
  Coins,
  Clock,
  CheckCircle,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';

interface FacilityUpgradeModalProps {
  facility: CafeFacility | null;
  currentRank: StarRank;
  coins: number;
  onUpgrade: (facilityId: string) => void;
  onClose: () => void;
  isEn: boolean;
}

export const FacilityUpgradeModal: React.FC<FacilityUpgradeModalProps> = ({
  facility,
  currentRank,
  coins,
  onUpgrade,
  onClose,
  isEn
}) => {
  if (!facility) return null;

  const currentInfo = getRankInfo(currentRank);
  const nextInfo = getNextRank(currentRank);
  const floor = CAFE_FLOORS.find(f => f.id === facility.floorId);
  const rankIndex = STAR_RANKS_ORDER.indexOf(currentRank);
  const progressPct = Math.round(((rankIndex + 1) / STAR_RANKS_ORDER.length) * 100);

  const canAfford = nextInfo ? coins >= nextInfo.upgradeCost : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f1d1a] border-4 border-amber-800/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-white font-sans flex flex-col">
        {/* Header */}
        <div className="bg-[#141210] px-5 py-3.5 border-b-2 border-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border-2 border-amber-600 flex items-center justify-center text-2xl shadow-inner">
              {facility.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold">
                  {floor ? (isEn ? floor.badgeEn : floor.badgeZh) : facility.floorId}
                </span>
                <span className={`text-xs font-black font-minecraft px-2 py-0.5 rounded border ${currentInfo.badgeBg} ${currentInfo.badgeBorder}`}>
                  ★ {currentRank}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-minecraft mt-0.5">
                {isEn ? facility.nameEn : facility.nameZh}
              </h3>
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

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Lore Description */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
            "{isEn ? facility.descEn : facility.descZh}"
          </div>

          {/* Star Rank Track Bar */}
          <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-zinc-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Star Level Progression' : '星級晉升進度'}</span>
              </span>
              <span className="font-mono text-amber-300 font-bold">
                {rankIndex + 1} / {STAR_RANKS_ORDER.length} ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {/* Quick ranks chips */}
            <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-zinc-400 px-1">
              <span className={rankIndex >= 0 ? 'text-zinc-200 font-bold' : ''}>F1</span>
              <span className={rankIndex >= 3 ? 'text-amber-400 font-bold' : ''}>E1</span>
              <span className={rankIndex >= 6 ? 'text-emerald-400 font-bold' : ''}>D1</span>
              <span className={rankIndex >= 9 ? 'text-cyan-400 font-bold' : ''}>C1</span>
              <span className={rankIndex >= 12 ? 'text-blue-400 font-bold' : ''}>B1</span>
              <span className={rankIndex >= 15 ? 'text-purple-400 font-bold' : ''}>A1</span>
              <span className={rankIndex >= 18 ? 'text-yellow-300 font-black' : ''}>S1</span>
              <span className={rankIndex === 20 ? 'text-yellow-200 font-black animate-pulse' : ''}>S3(MAX)</span>
            </div>
          </div>

          {/* Current vs Next Stats Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Current Level Box */}
            <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{isEn ? 'Current Rating' : '當前星級'}</span>
                <span className={`px-2 py-0.5 rounded font-minecraft font-black text-xs ${currentInfo.badgeBg} ${currentInfo.badgeBorder}`}>
                  {currentRank}
                </span>
              </div>
              <div className="text-sm font-black text-amber-200 mb-2">
                {isEn ? currentInfo.titleEn : currentInfo.titleZh}
              </div>
              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{isEn ? 'Price Bonus:' : '餐點售價加成:'}</span>
                  <span className="font-bold text-emerald-400">+{currentInfo.sellPriceBonusPct}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{isEn ? 'Tip Multiplier:' : '額外小費乘數:'}</span>
                  <span className="font-bold text-amber-400">+{currentInfo.tipMultiplierBonus}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{isEn ? 'Extra Patience:' : '延長顧客耐心:'}</span>
                  <span className="font-bold text-cyan-400">+{currentInfo.patienceBonusSec}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{isEn ? 'Passive Yield:' : '被動分紅金幣:'}</span>
                  <span className="font-bold text-yellow-400">+{currentInfo.passiveCoinsPerInterval} 🪙 / 週期</span>
                </div>
              </div>
            </div>

            {/* Next Level Box */}
            <div className={`p-3.5 rounded-xl border ${
              nextInfo ? 'bg-amber-950/30 border-amber-600/50' : 'bg-zinc-900/40 border-zinc-800'
            }`}>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{isEn ? 'Next Star Upgrade' : '晉升星級'}</span>
                {nextInfo ? (
                  <span className={`px-2 py-0.5 rounded font-minecraft font-black text-xs ${nextInfo.badgeBg} ${nextInfo.badgeBorder}`}>
                    ★ {nextInfo.rank}
                  </span>
                ) : (
                  <span className="text-xs text-yellow-400 font-bold">{isEn ? 'MAX RANK' : '最高等級'}</span>
                )}
              </div>

              {nextInfo ? (
                <>
                  <div className="text-sm font-black text-amber-200 mb-2">
                    {isEn ? nextInfo.titleEn : nextInfo.titleZh}
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">{isEn ? 'Price Bonus:' : '餐點售價加成:'}</span>
                      <span className="font-bold text-emerald-300 flex items-center gap-1">
                        <span>+{nextInfo.sellPriceBonusPct}%</span>
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">{isEn ? 'Tip Multiplier:' : '額外小費乘數:'}</span>
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <span>+{nextInfo.tipMultiplierBonus}x</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">{isEn ? 'Extra Patience:' : '延長顧客耐心:'}</span>
                      <span className="font-bold text-cyan-300 flex items-center gap-1">
                        <span>+{nextInfo.patienceBonusSec}s</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">{isEn ? 'Passive Yield:' : '被動分紅金幣:'}</span>
                      <span className="font-bold text-yellow-300 flex items-center gap-1">
                        <span>+{nextInfo.passiveCoinsPerInterval} 🪙</span>
                        <ArrowRight className="w-3 h-3 text-yellow-400" />
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-zinc-400">
                  <CheckCircle className="w-8 h-8 text-yellow-400 mb-2" />
                  <p className="text-xs font-bold text-amber-300">
                    {isEn ? 'Facility is at Supreme S3 Rank!' : '此設施已達至尊 S3 終極星級！'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Upgrade CTA */}
        <div className="bg-[#141210] p-4 border-t-2 border-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-zinc-400">{isEn ? 'Your Balance:' : '目前金幣:'}</span>
            <span className="text-sm font-black font-mono text-yellow-400">{coins.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {isEn ? 'Close' : '關閉'}
            </button>

            {nextInfo ? (
              <button
                onClick={() => {
                  if (canAfford) {
                    sound.playUpgradeSound();
                    onUpgrade(facility.id);
                  } else {
                    sound.playHitSound(1);
                  }
                }}
                disabled={!canAfford}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm font-minecraft border-2 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  canAfford
                    ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-300 shadow-amber-500/30'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isEn
                    ? `Upgrade to ${nextInfo.rank} (${nextInfo.upgradeCost.toLocaleString()} Coins)`
                    : `晉升至 ${nextInfo.rank} 星級 (${nextInfo.upgradeCost.toLocaleString()} 金幣)`}
                </span>
              </button>
            ) : (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm font-minecraft bg-yellow-950 text-yellow-300 border-2 border-yellow-600/50 flex items-center gap-1.5 cursor-default"
              >
                <Award className="w-4 h-4 text-yellow-400" />
                <span>{isEn ? 'MAX S3 RANK REACHED' : '已達 S3 極致星級'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
