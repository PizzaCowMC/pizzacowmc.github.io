import React, { useState, useMemo } from 'react';
import { Achievement } from '../types';
import {
  ACHIEVEMENT_GROUPS,
  buildDisplayAchievement,
  DisplayAchievement,
  makeAchievementId
} from '../data/achievementEngine';
import { sound } from '../utils/soundEffects';
import { Trophy, Check, Gift, Search, X, Sparkles, Coins, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  oneOffAchievements: Achievement[];
  unlockedCounts: Record<string, number>;
  claimedProceduralIds: Set<string>;
  totalAchievementCount: number;
  onClaimReward: (achId: string) => void;
  onClaimAllRewards: () => void;
}

const PAGE_SIZE = 50;
// Bounded window per group: recent unlocked tiers + a few upcoming locked
// ones. This keeps rendering cheap no matter how large unlockedCount gets —
// we never materialize all 100,000 tiers of a group.
const RECENT_UNLOCKED_PER_GROUP = 30;
const UPCOMING_LOCKED_PER_GROUP = 5;

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  oneOffAchievements,
  unlockedCounts,
  claimedProceduralIds,
  totalAchievementCount,
  onClaimReward,
  onClaimAllRewards
}) => {
  const { language, t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const isEn = language === 'en';

  const visibleProcedural: DisplayAchievement[] = useMemo(() => {
    const out: DisplayAchievement[] = [];
    for (const group of ACHIEVEMENT_GROUPS) {
      const unlockedCount = unlockedCounts[group.groupId] || 0;
      const recentStart = Math.max(1, unlockedCount - RECENT_UNLOCKED_PER_GROUP + 1);
      for (let idx = unlockedCount; idx >= recentStart; idx--) {
        out.push(buildDisplayAchievement(group, idx, true, claimedProceduralIds));
      }
      const upcomingEnd = Math.min(group.count, unlockedCount + UPCOMING_LOCKED_PER_GROUP);
      for (let idx = unlockedCount + 1; idx <= upcomingEnd; idx++) {
        out.push(buildDisplayAchievement(group, idx, false, claimedProceduralIds));
      }
    }
    return out;
  }, [unlockedCounts, claimedProceduralIds]);

  const totalUnlockedCount = useMemo(() => {
    let procTotal = 0;
    for (const key in unlockedCounts) {
      procTotal += unlockedCounts[key];
    }
    return oneOffAchievements.filter(a => a.unlocked).length + procTotal;
  }, [oneOffAchievements, unlockedCounts]);

  const { unclaimedOneOff, totalUnclaimedCoins, unclaimedProceduralCount } = useMemo(() => {
    const oneOff = oneOffAchievements.filter(a => a.unlocked && a.coinReward > 0 && !a.rewardClaimed);
    let coinSum = oneOff.reduce((s, a) => s + a.coinReward, 0);
    let procCount = 0;
    for (const group of ACHIEVEMENT_GROUPS) {
      const unlockedCount = unlockedCounts[group.groupId] || 0;
      for (let idx = 1; idx <= unlockedCount; idx++) {
        const id = makeAchievementId(group.groupId, idx);
        if (claimedProceduralIds.has(id)) continue;
        const target = group.target(idx);
        const reward = group.reward(idx, target);
        if (reward > 0) {
          coinSum += reward;
          procCount++;
        }
      }
    }
    return { unclaimedOneOff: oneOff, totalUnclaimedCoins: coinSum, unclaimedProceduralCount: procCount };
  }, [oneOffAchievements, unlockedCounts, claimedProceduralIds]);

  const allVisible: DisplayAchievement[] = useMemo(
    () => [...oneOffAchievements.map(a => ({ ...a, target: 0 } as DisplayAchievement)), ...visibleProcedural],
    [oneOffAchievements, visibleProcedural]
  );

  const filteredList = useMemo(() => {
    return allVisible.filter(a => {
      if (selectedCat === 'unclaimed') {
        if (!a.unlocked || a.coinReward === 0 || a.rewardClaimed) return false;
      } else if (selectedCat === 'unlocked') {
        if (!a.unlocked) return false;
      } else if (selectedCat === 'locked') {
        if (a.unlocked) return false;
      } else if (selectedCat !== 'all') {
        if (a.category !== selectedCat) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.nameZh.toLowerCase().includes(q) ||
          a.nameEn.toLowerCase().includes(q) ||
          a.descZh.toLowerCase().includes(q) ||
          (a.descEn && a.descEn.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allVisible, selectedCat, searchQuery]);

  if (!isOpen) return null;

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedList = filteredList.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const totalClaimableNow = unclaimedOneOff.length + unclaimedProceduralCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#242424] border-6 border-black rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 border-2 border-amber-500 rounded text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                  {t('achievements.title')}
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {totalUnlockedCount.toLocaleString()} / {totalAchievementCount.toLocaleString()} {t('achievements.unlocked')}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {t('achievements.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {totalUnclaimedCoins > 0 && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-b-2 border-amber-500 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>
                {isEn ? (
                  <>You have <strong className="text-amber-300 font-mono font-black">{totalUnclaimedCoins.toLocaleString()}</strong> Coins waiting across <strong className="text-amber-300 font-mono font-black">{totalClaimableNow.toLocaleString()}</strong> achievements!</>
                ) : (
                  <>尚有 <strong className="text-amber-300 font-mono font-black">{totalUnclaimedCoins.toLocaleString()}</strong> 遊戲幣成就獎勵（共 <strong className="text-amber-300 font-mono font-black">{totalClaimableNow.toLocaleString()}</strong> 項）等待領取！</>
                )}
              </span>
            </div>
            <button
              onClick={() => { sound.playAchievementSound(); onClaimAllRewards(); }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded border-2 border-black shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              {isEn ? `Claim All (${totalUnclaimedCoins.toLocaleString()} Coins)` : `一鍵領取全部 (${totalUnclaimedCoins.toLocaleString()} 幣)`}
            </button>
          </div>
        )}

        <div className="p-3 bg-zinc-950 border-b-2 border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: isEn ? `Recent (${allVisible.length})` : `最近 (${allVisible.length})` },
              { id: 'unclaimed', label: isEn ? `Claimable (${totalClaimableNow})` : `可領取 (${totalClaimableNow})` },
              { id: 'unlocked', label: isEn ? `Unlocked` : `已解鎖` },
              { id: 'mining', label: isEn ? '⛏️ Mining' : '⛏️ 採礦先鋒' },
              { id: 'economy', label: isEn ? '💰 Economy' : '💰 財富經濟' },
              { id: 'equipment', label: isEn ? '🛠️ Gear' : '🛠️ 鎬具裝備' },
              { id: 'building', label: isEn ? '🏗️ Building' : '🏗️ 建築大師' },
              { id: 'combat', label: isEn ? '⚔️ Combat' : '⚔️ 戰鬥' },
              { id: 'collection', label: isEn ? '🎨 Collection' : '🎨 收藏與探索' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setSelectedCat(tab.id); setCurrentPage(1); sound.playClickSound(); }}
                className={`px-2.5 py-1 text-xs font-bold rounded whitespace-nowrap border border-black transition-colors cursor-pointer ${
                  selectedCat === tab.id
                    ? 'bg-amber-600 text-amber-100 shadow-[inset_-1px_-1px_0_#78350f,inset_1px_1px_0_#fde047]'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={isEn ? 'Search achievements...' : '搜尋成就...'}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="bg-zinc-900 border border-zinc-700 pl-8 pr-3 py-1 text-xs text-zinc-200 rounded focus:outline-none focus:border-amber-400 w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        <div className="px-4 pt-2 text-[11px] text-zinc-500">
          {isEn
            ? `Showing your most recent progress per category — with ${totalAchievementCount.toLocaleString()} total achievements, only nearby tiers are ever loaded.`
            : `顯示每個分類最近的進度 — 全部共 ${totalAchievementCount.toLocaleString()} 項成就，僅載入鄰近的項目以維持流暢度。`}
        </div>

        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          {paginatedList.map(ach => {
            const isClaimable = ach.unlocked && ach.coinReward > 0 && !ach.rewardClaimed;
            const title = isEn ? ach.nameEn : ach.nameZh;
            const desc = isEn ? (ach.descEn || ach.descZh) : ach.descZh;

            return (
              <div
                key={ach.id}
                className={`p-3 border-2 border-black rounded-lg flex items-center justify-between gap-3 transition-colors ${
                  ach.unlocked ? 'bg-zinc-900/90 shadow-[inset_1px_1px_0_#3f3f46]' : 'bg-zinc-950/40 opacity-55'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded border-2 border-black flex items-center justify-center text-xl shrink-0 ${
                      ach.unlocked ? 'bg-amber-950/60 text-amber-300' : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    {ach.unlocked ? ach.icon : '🔒'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-sm ${ach.unlocked ? 'text-amber-200' : 'text-zinc-500'}`}>
                        {title}
                      </span>
                      {ach.coinReward > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-400 border border-amber-800 rounded font-mono font-bold flex items-center gap-0.5">
                          <Coins className="w-2.5 h-2.5" />+{ach.coinReward}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{desc}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isClaimable ? (
                    <button
                      onClick={() => { sound.playAchievementSound(); onClaimReward(ach.id); }}
                      className="px-2.5 py-1 text-xs font-black bg-amber-500 hover:bg-amber-400 text-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 flex items-center gap-1 animate-pulse cursor-pointer"
                    >
                      <Gift className="w-3 h-3" />
                      {t('achievements.claim')}
                    </button>
                  ) : ach.unlocked ? (
                    <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" /> {isEn ? 'Completed' : '已達成'}
                    </div>
                  ) : (
                    <span className="text-[11px] text-zinc-600 font-mono">{isEn ? 'Locked' : '未解鎖'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-zinc-900 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-zinc-400 font-mono">
            {filteredList.length === 0
              ? (isEn ? 'No achievements match' : '沒有符合的成就')
              : isEn
              ? `Showing ${(safePage - 1) * PAGE_SIZE + 1} ~ ${Math.min(safePage * PAGE_SIZE, filteredList.length)} of ${filteredList.length}`
              : `顯示第 ${(safePage - 1) * PAGE_SIZE + 1} ~ ${Math.min(safePage * PAGE_SIZE, filteredList.length)} 項 (共 ${filteredList.length} 項)`}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={safePage <= 1}
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); sound.playClickSound(); }}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed border border-black rounded text-zinc-200 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {isEn ? 'Previous' : '上一頁'}
            </button>
            <span className="font-mono text-amber-300 font-bold px-2">
              {safePage} / {totalPages}
            </span>
            <button
              disabled={safePage >= totalPages}
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); sound.playClickSound(); }}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed border border-black rounded text-zinc-200 flex items-center gap-1 cursor-pointer"
            >
              {isEn ? 'Next' : '下一頁'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
