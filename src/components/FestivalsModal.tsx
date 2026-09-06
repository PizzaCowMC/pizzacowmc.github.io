import React, { useState } from 'react';
import { FESTIVAL_EVENTS } from '../data/gameData';
import { FestivalEvent, PickaxeState, ThemeBackground, ShopSupplyItem } from '../types';
import { sound } from '../utils/soundEffects';
import { Sparkles, X, Gift, Check, Coins, Wand2, Zap } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface FestivalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFestivalId: string;
  onSelectActiveFestival: (festivalId: string) => void;
  coins: number;
  currentThemeId: string;
  ownedThemes: string[];
  onBuyTheme: (theme: ThemeBackground) => void;
  onEquipTheme: (themeId: string) => void;
  pickaxeState: PickaxeState;
  ownedPickaxes: string[];
  onBuyPickaxe: (tierId: string, cost: number) => void;
  onEquipPickaxe: (tierId: string) => void;
  onBuySupply: (supply: ShopSupplyItem) => void;
  onClaimDailyFestivalGift: (coinsAmount: number) => void;
  dailyGiftClaimedToday: boolean;
  activeBuffs: {
    hasteSeconds: number;
    zeroDurabilitySeconds: number;
    doubleCoinsSeconds: number;
    extremeHasteSeconds: number;
  };
}

export const FestivalsModal: React.FC<FestivalsModalProps> = ({
  isOpen,
  onClose,
  activeFestivalId,
  onSelectActiveFestival,
  coins,
  currentThemeId,
  ownedThemes,
  onBuyTheme,
  onEquipTheme,
  pickaxeState,
  ownedPickaxes,
  onBuyPickaxe,
  onEquipPickaxe,
  onBuySupply,
  onClaimDailyFestivalGift,
  dailyGiftClaimedToday,
  activeBuffs
}) => {
  const { language, getName, getDesc, t } = useLanguage();
  const [selectedFestivalTab, setSelectedFestivalTab] = useState<string>(activeFestivalId || 'halloween');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = language === 'en';
  const currentFestival = FESTIVAL_EVENTS.find(f => f.id === selectedFestivalTab) || FESTIVAL_EVENTS[0];
  const isThisFestivalActive = activeFestivalId === currentFestival.id;
  const festName = getName(currentFestival);

  const showMsg = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleApplyFestival = (fest: FestivalEvent) => {
    sound.playAchievementSound();
    onSelectActiveFestival(fest.id);
    if (!ownedThemes.includes(fest.themeId)) {
      onBuyTheme(fest.themeBg);
    }
    onEquipTheme(fest.themeId);
    showMsg(
      isEn
        ? `🎉 Switched to ${getName(fest)}! Exclusive festival theme & particles activated!`
        : `🎉 已成功切換至【${getName(fest)}】！專屬節慶背景與限時特效已套用！`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1f1a24] border-6 border-amber-500/80 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_40px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950 via-zinc-900 to-amber-950 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border-2 border-amber-400 rounded-lg text-amber-300 text-2xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              🎉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                  {t('festivals.title')}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold animate-pulse">
                  LIMITED EVENT
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                {t('festivals.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-black/70 border-2 border-amber-400 rounded flex items-center gap-1.5 text-amber-300 font-mono font-black text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins.toLocaleString()} {isEn ? 'Coins' : '幣'}</span>
            </div>
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border-2 border-black rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback notification toast */}
        {feedbackMsg && (
          <div className="bg-amber-500 text-zinc-950 px-4 py-2 text-xs font-black text-center animate-bounce shadow-md">
            {feedbackMsg}
          </div>
        )}

        {/* Active Buffs Bar */}
        {(activeBuffs.doubleCoinsSeconds > 0 || activeBuffs.zeroDurabilitySeconds > 0 || activeBuffs.extremeHasteSeconds > 0) && (
          <div className="bg-zinc-950 px-4 py-2 border-b-2 border-amber-500/40 flex items-center gap-3 flex-wrap text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> {isEn ? 'Active Festival Buffs:' : '當前節日增益效果：'}
            </span>
            {activeBuffs.doubleCoinsSeconds > 0 && (
              <span className="px-2 py-0.5 rounded bg-amber-900/60 border border-amber-500 text-amber-200 font-mono font-bold">
                🍬 {isEn ? 'Halloween Double Coins:' : '萬聖雙倍金幣：'} {activeBuffs.doubleCoinsSeconds}s
              </span>
            )}
            {activeBuffs.zeroDurabilitySeconds > 0 && (
              <span className="px-2 py-0.5 rounded bg-sky-900/60 border border-sky-400 text-sky-200 font-mono font-bold">
                ❄️ {isEn ? 'Christmas Frost Lock:' : '聖誕零度鎖耐久：'} {activeBuffs.zeroDurabilitySeconds}s
              </span>
            )}
            {activeBuffs.extremeHasteSeconds > 0 && (
              <span className="px-2 py-0.5 rounded bg-pink-900/60 border border-pink-400 text-pink-200 font-mono font-bold">
                🍡 {isEn ? 'Spring Haste +100%:' : '春日極速採礦+100%：'} {activeBuffs.extremeHasteSeconds}s
              </span>
            )}
          </div>
        )}

        {/* Festival Navigation Tabs */}
        <div className="flex bg-zinc-950/80 border-b-2 border-zinc-800 overflow-x-auto p-2 gap-2 shrink-0">
          {FESTIVAL_EVENTS.map(fest => {
            const isSelected = selectedFestivalTab === fest.id;
            const isCurrentlyActive = activeFestivalId === fest.id;

            return (
              <button
                key={fest.id}
                onClick={() => {
                  sound.playClickSound();
                  setSelectedFestivalTab(fest.id);
                }}
                className={`px-3 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] font-black'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500'
                }`}
              >
                <span className="text-base">{fest.icon}</span>
                <span>{getName(fest)}</span>
                {isCurrentlyActive && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-amber-300 border border-amber-400/50">
                    {isEn ? 'ACTIVE' : '慶典中'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Festival Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Festival Banner Card */}
          <div className="relative p-5 rounded-xl border-4 border-amber-500/70 bg-gradient-to-br from-zinc-900 via-purple-950/50 to-zinc-900 shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-black/60 border-2 border-amber-400 flex items-center justify-center text-3xl shrink-0 shadow-lg">
                  {currentFestival.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                      {festName}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-amber-500/40 font-mono">
                      {isEn ? (currentFestival.activePeriodEn || currentFestival.activePeriodZh) : currentFestival.activePeriodZh}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mt-1">
                    {isEn ? (currentFestival.bannerTitleEn || currentFestival.bannerTitle) : currentFestival.bannerTitle}
                  </p>
                  <p className="text-xs text-zinc-300 mt-1 max-w-xl">
                    {isEn ? (currentFestival.descEn || currentFestival.descZh) : currentFestival.descZh}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {isThisFestivalActive ? (
                  <div className="px-4 py-2 bg-emerald-950/80 border-2 border-emerald-500 rounded-lg text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? 'Currently Celebrating (Active)' : '當前正在慶祝中（背景已套用）'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyFestival(currentFestival)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs border-2 border-amber-300 rounded-lg shadow-[inset_-2px_-2px_0_#92400e,inset_2px_2px_0_#fde68a,0_0_15px_rgba(245,158,11,0.5)] transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{isEn ? 'Activate Festival & Theme' : '切換並套用節慶專屬背景'}</span>
                  </button>
                )}

                {/* Free Daily Festival Gift */}
                <button
                  disabled={dailyGiftClaimedToday}
                  onClick={() => {
                    if (!dailyGiftClaimedToday) {
                      sound.playAchievementSound();
                      onClaimDailyFestivalGift(888);
                      showMsg(isEn ? `🎁 Claimed ${festName} holiday gift: +888 Coins!` : `🎁 成功領取【${festName}】節日賀禮 888 金幣！`);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    dailyGiftClaimedToday
                      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-500 cursor-not-allowed'
                      : 'bg-red-950 hover:bg-red-900 border-red-500 text-amber-200 shadow-md animate-pulse active:scale-95'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dailyGiftClaimedToday ? (isEn ? 'Holiday Gift Claimed' : '今日節慶賀禮已領取') : (isEn ? 'Claim Free Gift (888 Coins)' : '免費領取節日賀禮 (888幣)')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: 節慶專屬背景 (Holiday Background) */}
          <div>
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>🖼️ {isEn ? 'Festival Background Theme' : '節慶專屬主題背景'}</span>
              <span className="text-[10px] text-zinc-400 normal-case">{isEn ? '(Atmospheric holiday aesthetic)' : '（營造沉浸式節日大廳氣氛）'}</span>
            </h4>

            {(() => {
              const bg = currentFestival.themeBg;
              const isOwned = ownedThemes.includes(bg.id);
              const isEquipped = currentThemeId === bg.id;
              const bgName = getName(bg);

              return (
                <div className="bg-zinc-900 border-2 border-black p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-black flex items-center justify-center text-2xl shadow-inner shrink-0"
                      style={{ backgroundColor: bg.previewColor }}
                    >
                      {currentFestival.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-base">{bgName}</span>
                        {isEquipped && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold">
                            {isEn ? 'In Use' : '使用中'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{getDesc(bg)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isEquipped ? (
                      <button disabled className="px-4 py-2 bg-emerald-950 border-2 border-emerald-600 rounded text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> {isEn ? 'Active' : '已套用背景'}
                      </button>
                    ) : isOwned ? (
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          onEquipTheme(bg.id);
                          showMsg(isEn ? `Applied ${bgName} background!` : `已套用【${bgName}】背景！`);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs border-2 border-black rounded shadow transition-all active:scale-95 cursor-pointer"
                      >
                        {isEn ? 'Apply Theme' : '立即更換背景'}
                      </button>
                    ) : (
                      <button
                        disabled={coins < bg.cost}
                        onClick={() => {
                          if (coins >= bg.cost) {
                            sound.playCoinSound();
                            onBuyTheme(bg);
                            onEquipTheme(bg.id);
                            showMsg(isEn ? `Unlocked and applied ${bgName}!` : `成功解鎖並套用【${bgName}】背景！`);
                          }
                        }}
                        className={`px-4 py-2 font-black text-xs border-2 border-black rounded transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                          coins >= bg.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-[inset_-2px_-2px_0_#92400e,inset_2px_2px_0_#fde68a]'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{isEn ? `Buy (${bg.cost} Coins)` : `購買解鎖 (${bg.cost} 幣)`}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section 2: 節慶專屬神鎬 (Festival Limited Pickaxe) */}
          <div>
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>⛏️ {isEn ? 'Festival Limited Pickaxe' : '節慶限定神鎬'}</span>
              <span className="text-[10px] text-zinc-400 normal-case">{isEn ? '(Limited edition • Extreme excavation power)' : '（節慶限時鍛造 • 超高採掘威力）'}</span>
            </h4>

            {(() => {
              const pick = currentFestival.specialPickaxe;
              const isOwned = ownedPickaxes.includes(pick.id);
              const isEquipped = pickaxeState.currentTierId === pick.id;
              const pickName = getName(pick);

              return (
                <div className="bg-zinc-900 border-2 border-black p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-lg border-2 border-black flex items-center justify-center text-3xl shadow-inner shrink-0 bg-gradient-to-br ${pick.bgGradient}`}>
                      ⛏️
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white text-base">{pickName}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700 font-mono">
                          {pick.speedMultiplier}x {isEn ? 'Speed' : '採礦速'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700 font-mono">
                          {isEn ? 'Durability:' : '耐久:'} {pick.maxDurability.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1">{getDesc(pick)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isEquipped ? (
                      <button disabled className="px-4 py-2 bg-emerald-950 border-2 border-emerald-600 rounded text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> {isEn ? 'Equipped' : '裝備中'}
                      </button>
                    ) : isOwned ? (
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          onEquipPickaxe(pick.id);
                          showMsg(isEn ? `Equipped ${pickName}!` : `已裝備【${pickName}】！`);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs border-2 border-black rounded shadow transition-all active:scale-95 cursor-pointer"
                      >
                        {isEn ? 'Equip Pickaxe' : '裝備神鎬出征'}
                      </button>
                    ) : (
                      <button
                        disabled={coins < pick.cost}
                        onClick={() => {
                          if (coins >= pick.cost) {
                            sound.playCoinSound();
                            onBuyPickaxe(pick.id, pick.cost);
                            showMsg(isEn ? `Acquired festival pickaxe ${pickName}!` : `恭喜獲得節日限定神鎬【${pickName}】！`);
                          }
                        }}
                        className={`px-4 py-2 font-black text-xs border-2 border-black rounded transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                          coins >= pick.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-[inset_-2px_-2px_0_#92400e,inset_2px_2px_0_#fde68a]'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{isEn ? `Forge (${pick.cost.toLocaleString()} Coins)` : `鍛造購買 (${pick.cost.toLocaleString()} 幣)`}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section 3: 節慶特殊限時道具 (Limited Consumables) */}
          <div>
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>🎁 {isEn ? 'Festival Consumables & Lucky Packs' : '節慶限時消耗道具與福袋'}</span>
              <span className="text-[10px] text-zinc-400 normal-case">{isEn ? '(Instant activation for super bonuses)' : '（限時特效 • 即買即用享受超強效果）'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentFestival.specialItems.map(item => {
                const itemName = getName(item);
                const itemDesc = isEn ? (item.descEn || item.descZh) : item.descZh;

                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border-2 border-black p-3.5 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-950 border-2 border-black flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {item.iconEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{itemName}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                          {itemDesc}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        disabled={coins < item.cost}
                        onClick={() => {
                          if (coins >= item.cost) {
                            sound.playCoinSound();
                            onBuySupply(item);
                            showMsg(isEn ? `Purchased and used ${itemName}!` : `成功購買並使用【${itemName}】！`);
                          }
                        }}
                        className={`px-3 py-1.5 font-black text-xs border-2 border-black rounded transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
                          coins >= item.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-[inset_-2px_-2px_0_#92400e,inset_2px_2px_0_#fde68a]'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.cost} {isEn ? 'Coins' : '幣'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-zinc-950 border-t-2 border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">💡 {isEn ? 'Tip:' : '提示：'}</span>
            <span>{isEn ? 'Switching festival theme instantly updates the background atmosphere and seasonal particles!' : '切換節慶主題會即刻更換全場景專屬節日背景與特效微粒！'}</span>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded border border-zinc-700 cursor-pointer"
          >
            {isEn ? 'Close' : '關閉視窗'}
          </button>
        </div>
      </div>
    </div>
  );
};
