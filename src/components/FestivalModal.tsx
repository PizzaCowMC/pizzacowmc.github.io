import React, { useState } from 'react';
import { FESTIVAL_EVENTS, THEME_BACKGROUNDS } from '../data/gameData';
import { FestivalEvent, FestivalSupplyItem } from '../types';
import { sound } from '../utils/soundEffects';
import {
  X,
  Sparkles,
  Coins,
  PartyPopper,
  CheckCircle2,
  Calendar,
  Flame,
  Zap,
  ShoppingBag,
  Palette
} from 'lucide-react';

interface FestivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFestivalId: string;
  onSelectFestival: (festivalId: string) => void;
  isFestivalBgActive: boolean;
  onToggleFestivalBg: (active: boolean) => void;
  coins: number;
  onBuyFestivalSupply: (supply: FestivalSupplyItem) => void;
}

export const FestivalModal: React.FC<FestivalModalProps> = ({
  isOpen,
  onClose,
  currentFestivalId,
  onSelectFestival,
  isFestivalBgActive,
  onToggleFestivalBg,
  coins,
  onBuyFestivalSupply
}) => {
  const [selectedFestivalTab, setSelectedFestivalTab] = useState<string>(currentFestivalId);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentFestival = FESTIVAL_EVENTS.find(f => f.id === currentFestivalId) || FESTIVAL_EVENTS[0];
  const viewingFestival = FESTIVAL_EVENTS.find(f => f.id === selectedFestivalTab) || currentFestival;
  const festivalTheme = THEME_BACKGROUNDS.find(t => t.id === viewingFestival.bgThemeId);
  const isViewingCurrent = viewingFestival.id === currentFestivalId;

  const handleSwitchFestival = (fId: string) => {
    sound.playAchievementSound();
    onSelectFestival(fId);
    setFeedbackMsg(`🎉 已成功切換為【${FESTIVAL_EVENTS.find(f => f.id === fId)?.nameZh}】慶典！`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handlePurchase = (supply: FestivalSupplyItem) => {
    if (coins < supply.cost) {
      sound.playHitSound(2);
      return;
    }
    onBuyFestivalSupply(supply);
    setFeedbackMsg(`✨ 成功購買並使用了【${supply.nameZh}】！`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#1c1c1c] border-4 border-black w-full max-w-4xl max-h-[92vh] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.95),inset_-4px_-4px_0_#111,inset_4px_4px_0_#444] flex flex-col overflow-hidden text-white font-sans relative">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-red-950 via-zinc-900 to-amber-950 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600/30 border-2 border-rose-400 rounded-lg shadow-[inset_0_0_8px_rgba(244,63,94,0.5)]">
              <PartyPopper className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 drop-shadow-[2px_2px_0_#000] flex items-center gap-2 font-minecraft">
                <span>🎪 特殊節慶與限時活動中心</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-600 font-sans font-bold">
                  {currentFestival.badge}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                探索特定節日專屬背景、特殊氛圍與限時珍稀神物道具
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Player Coins display */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/80 border-2 border-amber-400/80 rounded-lg text-amber-300 font-mono font-black text-xs sm:text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins.toLocaleString()} 幣</span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-400 hover:text-white rounded-lg border-2 border-black transition-transform"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Message Bar */}
        {feedbackMsg && (
          <div className="bg-amber-950/90 border-b-2 border-amber-600 px-4 py-2 text-xs text-amber-200 font-bold flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Festival Selection Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-0 bg-zinc-950/70 border-b-2 border-black overflow-x-auto">
          {FESTIVAL_EVENTS.map(fest => {
            const isSelected = fest.id === selectedFestivalTab;
            const isLive = fest.id === currentFestivalId;
            return (
              <button
                key={fest.id}
                onClick={() => {
                  sound.playClickSound();
                  setSelectedFestivalTab(fest.id);
                }}
                className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border-b-2'
                }`}
              >
                <span className="text-base">{fest.seasonEmoji}</span>
                <span>{fest.nameZh}</span>
                {isLive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
          {/* Active / Selected Festival Hero Showcase Banner */}
          <div
            className={`p-4 sm:p-5 rounded-xl border-3 border-black shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
            style={{
              backgroundColor: viewingFestival.accentColor + '15',
              borderColor: viewingFestival.accentColor
            }}
          >
            <div className="flex items-start gap-3.5 max-w-xl">
              <div
                className="w-14 h-14 rounded-xl border-3 border-black flex items-center justify-center text-3xl shadow-[0_4px_12px_rgba(0,0,0,0.6)] shrink-0"
                style={{ backgroundColor: viewingFestival.accentColor + '30' }}
              >
                {viewingFestival.seasonEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-black text-amber-300 drop-shadow-[1px_1px_0_#000] font-minecraft">
                    {viewingFestival.bannerTitle}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-black/60 border border-zinc-700 font-mono text-zinc-300">
                    {viewingFestival.periodDesc}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {viewingFestival.bannerDesc}
                </p>

                {/* Festival Perks Pills */}
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  <span className="text-[11px] px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-700 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    {viewingFestival.bonusDesc}
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    挖掘加速 +{viewingFestival.speedBonusPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for this festival */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
              {!isViewingCurrent ? (
                <button
                  onClick={() => handleSwitchFestival(viewingFestival.id)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#78350f,inset_2px_2px_0_#fde047] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>🎉 慶祝並切換為此節日</span>
                </button>
              ) : (
                <div className="px-3 py-1.5 bg-emerald-950 border-2 border-emerald-600 rounded-lg text-emerald-300 font-black text-xs flex items-center justify-center gap-1.5 shadow">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>目前正在慶祝此節慶！</span>
                </div>
              )}

              {/* Background Theme Toggle */}
              {isViewingCurrent && (
                <button
                  onClick={() => {
                    sound.playClickSound();
                    onToggleFestivalBg(!isFestivalBgActive);
                  }}
                  className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isFestivalBgActive
                      ? 'bg-purple-900 hover:bg-purple-800 text-purple-200 shadow-[inset_-1px_-1px_0_#3b0764,inset_1px_1px_0_#c084fc]'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                  }`}
                  title="切換是否在遊戲主界面顯示該節日的限定背景與氛圍效果"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>
                    {isFestivalBgActive ? '🎨 節慶專屬背景：已開啟' : '🎨 節慶專屬背景：已關閉'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Festival Theme Background Info Card */}
          {festivalTheme && (
            <div className="p-3.5 bg-zinc-950/80 border-2 border-zinc-800 rounded-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-black shadow flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: festivalTheme.previewColor }}
                >
                  🎨
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                    <span>專屬節日限定背景：</span>
                    <span className="text-amber-300 font-black">{festivalTheme.nameZh}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {festivalTheme.desc} • 氛圍粒子：
                    <span className="text-emerald-400 font-bold ml-1 font-mono">
                      {viewingFestival.particleType === 'snow'
                        ? '❄️ 漫天飄雪'
                        : viewingFestival.particleType === 'bats'
                        ? '🦇 幽夜蝙蝠'
                        : viewingFestival.particleType === 'sparks'
                        ? '✨ 金彩火花'
                        : viewingFestival.particleType === 'petals'
                        ? '🌸 桂花花瓣'
                        : '🫧 蔚藍海浪泡泡'}
                    </span>
                  </p>
                </div>
              </div>

              <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-amber-300 border border-zinc-700 font-bold shrink-0">
                🎁 節日限定免費解鎖
              </span>
            </div>
          )}

          {/* SECTION: LIMITED-TIME HOLIDAY COMMODITIES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-zinc-700">
              <h3 className="text-sm font-black text-amber-300 flex items-center gap-2 font-minecraft">
                <ShoppingBag className="w-4 h-4 text-rose-400" />
                <span>【{viewingFestival.nameZh}】限時特殊道具專櫃</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-mono">
                  {viewingFestival.limitedSupplies.length} 款限時神器
                </span>
              </h3>
              <span className="text-[11px] text-zinc-400">
                點擊立即購買並直接生效
              </span>
            </div>

            {/* Grid of limited supplies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {viewingFestival.limitedSupplies.map(supply => {
                const canAfford = coins >= supply.cost;
                return (
                  <div
                    key={supply.id}
                    className="p-3.5 bg-zinc-900/95 border-2 border-black rounded-xl shadow-[inset_-2px_-2px_0_#111,inset_2px_2px_0_#333] flex flex-col justify-between gap-3 hover:border-amber-500/50 transition-colors"
                  >
                    <div>
                      {/* Top icon and badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl p-1 bg-black/50 border border-zinc-800 rounded-lg">
                          {supply.iconEmoji}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold font-mono">
                          {supply.badge}
                        </span>
                      </div>

                      {/* Name & description */}
                      <h4 className="text-sm font-black text-white font-minecraft">
                        {supply.nameZh}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        {supply.descZh}
                      </p>
                    </div>

                    {/* Cost and Buy Button */}
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 font-mono font-black text-amber-300 text-xs">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>{supply.cost.toLocaleString()} 幣</span>
                      </div>

                      <button
                        onClick={() => handlePurchase(supply)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-lg border-2 border-black font-black text-xs flex items-center gap-1 transition-transform active:scale-95 ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-amber-100 shadow-[inset_-2px_-2px_0_#78350f,inset_2px_2px_0_#fde047]'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-700'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{canAfford ? '購買並使用' : '金幣不足'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-zinc-950 border-t-2 border-black flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>節慶活動隨時自由切換，限時道具將永久保存在背包或直接賦予強大增益！</span>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 active:scale-95 text-zinc-200 font-black rounded-lg border-2 border-black"
          >
            關閉中心
          </button>
        </div>
      </div>
    </div>
  );
};
