import React from 'react';
import { Award, CheckCircle2, ChevronRight, Sparkles, X, ShieldAlert, Zap, Gift, Trophy } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { sound } from '../utils/soundEffects';
import { getLevelQuest, getLevelTitle, checkQuestProgress, PlayerStatsForQuest } from '../utils/levelSystem';

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerLevel: number;
  playerXp: number;
  stats: PlayerStatsForQuest;
  onLevelUp: () => void;
}

export const LevelModal: React.FC<LevelModalProps> = ({
  isOpen,
  onClose,
  playerLevel,
  playerXp,
  stats,
  onLevelUp
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  if (!isOpen) return null;

  const currentQuest = getLevelQuest(playerLevel);
  const nextQuest = getLevelQuest(playerLevel + 1);
  const currentTitle = getLevelTitle(playerLevel, isEn);
  const nextTitle = getLevelTitle(playerLevel + 1, isEn);

  const questStatus = checkQuestProgress(currentQuest, stats);
  const hasEnoughXp = playerXp >= currentQuest.requiredXp;
  const canLevelUp = hasEnoughXp && questStatus.isCompleted;

  const xpPercent = Math.min(100, Math.round((playerXp / currentQuest.requiredXp) * 100));

  const handleLevelUpClick = () => {
    if (!canLevelUp) return;
    sound.playAchievementSound();
    onLevelUp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#202020] border-6 border-black rounded-lg w-full max-w-xl max-h-[92vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_35px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border-2 border-emerald-400 rounded-lg text-emerald-300 shadow-[inset_0_0_8px_rgba(16,185,129,0.3)]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                  {isEn ? 'Player Level & Promotion' : '玩家等級與晉升突破'}
                </h3>
                <span className="px-2 py-0.5 bg-emerald-900/80 border border-emerald-500 text-emerald-300 font-mono text-xs font-black rounded">
                  Lv. {playerLevel}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium">
                {isEn ? `Current Rank: ${currentTitle}` : `當前階位：${currentTitle}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Current Level Overview Card */}
          <div className="p-4 bg-zinc-950 border-2 border-black rounded-lg relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎖️</span>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {isEn ? 'Current Status' : '當前等級階位'}
                  </span>
                  <div className="text-base font-black text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-mono">Lv. {playerLevel}</span>
                    <span>{currentTitle}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 font-bold">
                  {isEn ? 'Next Target' : '晉升目標'}
                </span>
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <span>Lv. {playerLevel + 1}</span>
                  <span>{nextTitle}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Minecraft Style XP Bar */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  {isEn ? 'Experience Points (XP)' : '經驗值進度 (XP)'}
                </span>
                <span className="font-bold text-emerald-400">
                  {playerXp.toLocaleString()} / {currentQuest.requiredXp.toLocaleString()} XP ({xpPercent}%)
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-4 bg-zinc-900 border-2 border-black rounded overflow-hidden p-0.5 relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 transition-all duration-300 rounded-xs shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Special Promotion Quest Box (每個等級除了經驗值還需要特殊任務) */}
          <div className="p-4 bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border-3 border-amber-500/80 rounded-lg space-y-3 shadow-[inset_1px_1px_0_#fde047]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/20 border border-amber-400 rounded text-amber-300">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-amber-300 flex items-center gap-1.5">
                    <span>{isEn ? 'Level Promotion Special Quest' : '升等晉升特殊任務'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-black font-black rounded-xs">
                      {isEn ? `Required for Lv.${playerLevel + 1}` : `晉升 Lv.${playerLevel + 1} 必備`}
                    </span>
                  </h4>
                  <div className="text-xs text-white font-bold mt-0.5">
                    {isEn ? currentQuest.titleEn : currentQuest.titleZh}
                  </div>
                </div>
              </div>

              {questStatus.isCompleted ? (
                <div className="px-2.5 py-1 bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-black rounded flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isEn ? 'Completed' : '已達成'}
                </div>
              ) : (
                <div className="px-2.5 py-1 bg-zinc-800 border border-amber-500/60 text-amber-300 text-xs font-bold rounded flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  {isEn ? 'In Progress' : '進行中'}
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-300 bg-black/40 p-2.5 rounded border border-zinc-800 leading-relaxed">
              {isEn ? currentQuest.descEn : currentQuest.descZh}
            </p>

            {/* Quest Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">{isEn ? 'Task Requirement Progress' : '任務條件進度'}</span>
                <span className={`font-bold ${questStatus.isCompleted ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {questStatus.displayText} ({questStatus.progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-900 border border-black rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    questStatus.isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-amber-600 to-yellow-400'
                  }`}
                  style={{ width: `${questStatus.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Rewards */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Gift className="w-3.5 h-3.5" />
                {isEn ? 'Ascension Rewards:' : '晉升獎勵：'}
              </span>
              <span className="font-mono text-amber-200 font-bold">
                {isEn ? currentQuest.rewardDescEn : currentQuest.rewardDescZh}
              </span>
            </div>
          </div>

          {/* Action Level Up Button */}
          <div>
            {canLevelUp ? (
              <button
                onClick={handleLevelUpClick}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-black font-black text-sm rounded-lg border-3 border-black shadow-[inset_-2px_-2px_0_#14532d,inset_2px_2px_0_#86efac,0_0_15px_rgba(34,197,94,0.6)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-5 h-5 text-black" />
                <span>
                  {isEn
                    ? `🏆 Break Through & Ascend to Lv. ${playerLevel + 1}!`
                    : `🏆 條件達成！點擊突破晉升至 Lv. ${playerLevel + 1}！`}
                </span>
              </button>
            ) : (
              <div className="p-3 bg-zinc-900/80 border-2 border-zinc-800 rounded-lg text-center space-y-1 text-xs">
                <div className="font-bold text-zinc-400 flex items-center justify-center gap-2">
                  <span>
                    {!hasEnoughXp
                      ? (isEn
                          ? `⚠️ XP insufficient (Need ${(currentQuest.requiredXp - playerXp).toLocaleString()} more XP)`
                          : `⚠️ 經驗值未達標（尚差 ${(currentQuest.requiredXp - playerXp).toLocaleString()} XP）`)
                      : (isEn ? '⏳ Special Quest not completed yet' : '⏳ 升等特殊任務尚未完成')}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {isEn
                    ? 'Both full XP and completion of the promotion quest are required to level up.'
                    : '每個等級皆須同時滿足「經驗值全滿」與「特殊晉升任務」方可突破升等。'}
                </p>
              </div>
            )}
          </div>

          {/* XP Acquisition Guide */}
          <div className="bg-zinc-950 p-3.5 border-2 border-black rounded-lg space-y-2">
            <div className="text-xs font-black text-zinc-300 flex items-center gap-1.5">
              <span>💡</span>
              <span>{isEn ? 'How to Earn Experience Points (XP)' : '如何累積經驗值 (XP) 途徑'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded flex items-center gap-2">
                <span className="text-base">⛏️</span>
                <div>
                  <div className="font-bold text-zinc-200">{isEn ? 'Quarry Mining' : '採石場開採'}</div>
                  <div className="text-[10px] text-zinc-400">{isEn ? '+1~35 XP per block mined' : '每開採 1 顆方塊 +1~35 XP'}</div>
                </div>
              </div>

              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded flex items-center gap-2">
                <span className="text-base">🧱</span>
                <div>
                  <div className="font-bold text-zinc-200">{isEn ? 'Building Workshop' : '建築工坊創作'}</div>
                  <div className="text-[10px] text-zinc-400">{isEn ? '+3 XP per placed block' : '每放置 1 顆方塊 +3 XP'}</div>
                </div>
              </div>

              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded flex items-center gap-2">
                <span className="text-base">💰</span>
                <div>
                  <div className="font-bold text-zinc-200">{isEn ? 'Market Trade' : '交易所賣出'}</div>
                  <div className="text-[10px] text-zinc-400">{isEn ? '+1 XP per 20 coins earned' : '販賣礦石每 20 幣 +1 XP'}</div>
                </div>
              </div>

              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded flex items-center gap-2">
                <span className="text-base">🏆</span>
                <div>
                  <div className="font-bold text-zinc-200">{isEn ? 'Achievements' : '解鎖榮耀成就'}</div>
                  <div className="text-[10px] text-zinc-400">{isEn ? '+50 XP per achievement reward' : '每次領取成就獎勵 +50 XP'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-900 border-t-2 border-black flex items-center justify-between text-xs text-zinc-400">
          <span>{isEn ? 'Keep mining and completing quests to become a Legend!' : '持續開採並完成突破任務，晉升為伺服器傳奇巨匠！'}</span>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded font-bold cursor-pointer transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
