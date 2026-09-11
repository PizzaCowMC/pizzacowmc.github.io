import React from 'react';
import { CafePromotionTier, CafePromotionQuest, CafeState } from '../types';
import {
  CAFE_PROMOTION_TIERS,
  getPromotionTier,
  getNextPromotionTier
} from '../data/cafeStaffAndPromotionData';
import { sound } from '../utils/soundEffects';
import {
  Trophy,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Coins,
  Award,
  Crown,
  TrendingUp,
  Clock,
  Zap,
  Building,
  Target
} from 'lucide-react';

interface CafePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeState: CafeState;
  onUpdateCafeState: (updater: (prev: CafeState) => CafeState) => void;
  totalBlocksMined: number;
  coins: number;
  onAddCoins: (amount: number) => void;
  isEn: boolean;
}

export const CafePromotionModal: React.FC<CafePromotionModalProps> = ({
  isOpen,
  onClose,
  cafeState,
  onUpdateCafeState,
  totalBlocksMined,
  coins,
  onAddCoins,
  isEn
}) => {
  if (!isOpen) return null;

  const currentRank = cafeState.promotionRank || 1;
  const currentTier = getPromotionTier(currentRank);
  const nextTier = getNextPromotionTier(currentRank);
  const completedMap = cafeState.completedPromotionQuests || {};

  // Compute live progress for a specific quest
  const getQuestProgress = (quest: CafePromotionQuest): { current: number; max: number; isReady: boolean } => {
    let currentVal = 0;
    const maxVal = quest.targetValue;

    switch (quest.targetType) {
      case 'dishes_served':
        currentVal = cafeState.totalDishesServed || 0;
        break;
      case 'mined_blocks':
        currentVal = totalBlocksMined || 0;
        break;
      case 'staff_count':
        currentVal = (cafeState.staffMembers || []).filter(s => s.isHired).length;
        break;
      case 'master_staff':
        currentVal = (cafeState.staffMembers || []).filter(
          s => s.isHired && (s.rank === 'Master' || s.rank === 'Grandmaster' || s.rank === 'Mythic' || s.isGuestLegend)
        ).length;
        break;
      case 'coins_earned':
        currentVal = coins;
        break;
      case 'cross_dispatch':
        currentVal = cafeState.crossDispatchHistoryCount || 0;
        break;
      case 'branch2_served':
        currentVal = (cafeState.branch2Reputation || 0) + (cafeState.totalDishesServed > 50 ? 50 : cafeState.totalDishesServed);
        break;
      case 'facility_stars':
        currentVal = Object.keys(cafeState.facilityStars || {}).length;
        break;
      default:
        currentVal = 0;
    }

    const isReady = currentVal >= maxVal;
    return { current: currentVal, max: maxVal, isReady };
  };

  // Claim single quest reward
  const handleClaimQuest = (quest: CafePromotionQuest) => {
    const { isReady } = getQuestProgress(quest);
    if (!isReady || completedMap[quest.id]) return;

    sound.playUpgradeSound();
    onAddCoins(quest.rewardCoins);

    onUpdateCafeState(prev => ({
      ...prev,
      reputation: Math.min(100, (prev.reputation || 0) + quest.rewardReputation),
      completedPromotionQuests: {
        ...(prev.completedPromotionQuests || {}),
        [quest.id]: true
      }
    }));
  };

  // Check if ALL quests for current tier are completed
  const allCurrentQuestsDone =
    currentTier.requiredQuests.length > 0 &&
    currentTier.requiredQuests.every(q => completedMap[q.id]);

  // Execute Grand Ascension / Promotion
  const handlePromoteCafe = () => {
    if (!allCurrentQuestsDone || !nextTier) {
      sound.playHitSound(1);
      return;
    }

    sound.playUpgradeSound();
    onUpdateCafeState(prev => ({
      ...prev,
      promotionRank: (prev.promotionRank || 1) + 1,
      reputation: 100,
      branch2Unlocked: true
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans text-white">
      <div className="bg-[#1e1b17] border-4 border-[#523e2b] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-[#362617] to-stone-900 px-6 py-4 border-b-2 border-[#543e2b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-2xl shadow-inner">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-300 font-minecraft">
                  {isEn ? 'Cafe Promotion & Hardcore Ascension' : '咖啡廳超級晉級大典・極限考驗'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentTier.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isEn
                  ? 'Conquer super hard trial quests to ascend your cafe rank, unlocking massive tip multipliers and cosmic honors.'
                  : '完成超級難的晉級考驗任務，晉升咖啡廳星級殿堂，解鎖巨額小費加成與神域榮耀！'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-zinc-400 hover:text-white border border-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current & Next Rank Overview Banner */}
        <div className="p-5 bg-[#26211c] border-b border-[#443324] grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Current Rank Card */}
          <div className="p-3.5 bg-[#181614] rounded-xl border border-amber-500/40 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1">
              <span>{isEn ? 'Current Cafe Tier' : '目前所屬段位'}</span>
              <span>•</span>
              <span>{currentTier.badge}</span>
            </div>
            <div className="text-base font-black text-white font-minecraft flex items-center gap-2">
              <span className="text-2xl">{currentTier.icon}</span>
              <span>{isEn ? currentTier.nameEn : currentTier.nameZh}</span>
            </div>
            <div className="text-xs text-amber-300 font-bold">
              {isEn ? currentTier.titleHonorEn : currentTier.titleHonorZh}
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-2 pt-1 border-t border-[#3d2e20]">
              <span>小費加成: <strong className="text-amber-400">+{Math.round(currentTier.tipMultiplierBonus * 100)}%</strong></span>
              <span>•</span>
              <span>分紅: <strong className="text-yellow-400">+{currentTier.passiveDividendBonus} 🪙</strong></span>
            </div>
          </div>

          {/* Next Target Rank Card */}
          {nextTier ? (
            <div className="p-3.5 bg-gradient-to-r from-amber-950/40 to-[#2a2219] rounded-xl border border-dashed border-amber-600/60 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-yellow-400 flex items-center gap-1">
                <span>{isEn ? 'Next Promotion Goal' : '晉級目標殿堂'}</span>
                <span>•</span>
                <span>{nextTier.badge}</span>
              </div>
              <div className="text-base font-black text-yellow-200 font-minecraft flex items-center gap-2">
                <span className="text-2xl">{nextTier.icon}</span>
                <span>{isEn ? nextTier.nameEn : nextTier.nameZh}</span>
              </div>
              <div className="text-xs text-yellow-400 font-bold">
                {isEn ? nextTier.titleHonorEn : nextTier.titleHonorZh}
              </div>
              <div className="text-[11px] text-zinc-300 flex items-center gap-2 pt-1 border-t border-amber-900/40">
                <span>小費飛躍: <strong className="text-emerald-400">+{Math.round(nextTier.tipMultiplierBonus * 100)}%</strong></span>
                <span>•</span>
                <span>分紅提升: <strong className="text-yellow-400">+{nextTier.passiveDividendBonus} 🪙</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-950/30 rounded-xl border border-yellow-500/60 text-center text-xs text-yellow-300 font-bold font-minecraft flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>{isEn ? 'Reached Apex Rank 7 Genesis God!' : '已登頂 Rank VII 創世神殿！全知全能！'}</span>
            </div>
          )}
        </div>

        {/* Quests List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-white font-minecraft uppercase tracking-wider">
              <Target className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Rank Promotion Hardcore Quests' : '超級難的晉級任務清單'}</span>
            </div>
            <span className="text-xs text-zinc-400">
              {currentTier.requiredQuests.filter(q => completedMap[q.id]).length} /{' '}
              {currentTier.requiredQuests.length} {isEn ? 'Completed' : '項已完成'}
            </span>
          </div>

          <div className="space-y-3">
            {currentTier.requiredQuests.map((quest, idx) => {
              const { current, max, isReady } = getQuestProgress(quest);
              const isClaimed = Boolean(completedMap[quest.id]);
              const percent = Math.min(100, Math.round((current / max) * 100));

              return (
                <div
                  key={quest.id}
                  className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                    isClaimed
                      ? 'bg-[#181614] border-emerald-600/40 opacity-85'
                      : isReady
                      ? 'bg-amber-950/20 border-amber-500'
                      : 'bg-[#25211d] border-[#443324]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black/40 text-amber-400 rounded border border-[#443324]">
                          #{idx + 1}
                        </span>
                        <h3 className="text-sm font-black text-white font-minecraft">
                          {isEn ? quest.titleEn : quest.titleZh}
                        </h3>
                        {quest.titleZh.includes('超級難') && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
                            🔥 極限考驗
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        {isEn ? quest.descEn : quest.descZh}
                      </p>
                    </div>

                    {/* Claim Button */}
                    <div className="shrink-0">
                      {isClaimed ? (
                        <span className="px-3 py-1.5 bg-emerald-950/80 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Passed' : '已通過'}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaimQuest(quest)}
                          disabled={!isReady}
                          className={`px-4 py-2 rounded-xl text-xs font-bold font-minecraft flex items-center gap-1.5 transition-all cursor-pointer ${
                            isReady
                              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg animate-bounce'
                              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>
                            {isReady
                              ? isEn
                                ? 'Claim Reward'
                                : '領取驗收獎勵'
                              : isEn
                              ? 'In Progress'
                              : '進行中...'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-400">{isEn ? 'Current Progress:' : '目前進度：'}</span>
                      <span className={isReady ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                        {current.toLocaleString()} / {max.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-zinc-700">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isClaimed
                            ? 'bg-emerald-500'
                            : isReady
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-amber-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Rewards Preview */}
                  <div className="mt-2.5 pt-2 border-t border-[#3d2e20] flex items-center justify-between text-[11px] text-zinc-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-yellow-400 font-bold">
                        <Coins className="w-3 h-3" />
                        <span>+{quest.rewardCoins.toLocaleString()} 🪙</span>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        ✨ +{quest.rewardReputation}% {isEn ? 'Reputation' : '知名度'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Promotion Ascension Footer Action */}
        <div className="bg-[#181614] px-6 py-4 border-t-2 border-[#443324] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 text-center sm:text-left">
            {allCurrentQuestsDone ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>{isEn ? 'All hardcore tasks completed! Ready for Ascension!' : '所有超級難任務全數達成！已獲准晉級大典！'}</span>
              </span>
            ) : (
              <span>
                {isEn
                  ? 'Complete all hardcore tasks above to unlock Cafe Promotion.'
                  : '需完成上述所有超級難任務，方可舉行咖啡廳晉級大典。'}
              </span>
            )}
          </div>

          <button
            onClick={handlePromoteCafe}
            disabled={!allCurrentQuestsDone || !nextTier}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-minecraft font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              allCurrentQuestsDone && nextTier
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:brightness-110 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>
              {nextTier
                ? isEn
                  ? `Ascend to ${nextTier.nameEn}!`
                  : `舉行超級晉級大典：晉升至【${nextTier.nameZh}】！`
                : isEn
                ? 'Apex God Rank Reached'
                : '已達最高創世神殿'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
