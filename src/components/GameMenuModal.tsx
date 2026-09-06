import React, { useState } from 'react';
import {
  X,
  Pickaxe,
  Box,
  Coins,
  ShoppingBag,
  Trophy,
  Users,
  Scroll,
  Cloud,
  Github,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  AlertTriangle,
  Flame,
  ExternalLink,
  Languages
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';

interface GameMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'quarry' | 'building';
  onSelectTab: (tab: 'quarry' | 'building') => void;
  onOpenMarket: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenFriends: () => void;
  onOpenChangelog: () => void;
  onOpenAuth: () => void;
  onOpenFestivals?: () => void;
  onOpenLevel?: () => void;
  playerLevel?: number;
  onResetProgress?: () => void;
  currentUser: { email: string | null; displayName: string | null } | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameMenuModal: React.FC<GameMenuModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenMarket,
  onOpenShop,
  onOpenAchievements,
  onOpenFriends,
  onOpenChangelog,
  onOpenAuth,
  onOpenFestivals,
  onOpenLevel,
  playerLevel = 0,
  onResetProgress,
  currentUser,
  soundEnabled,
  onToggleSound
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const isEn = language === 'en';

  const handleAction = (callback: () => void) => {
    sound.playClickSound();
    onClose();
    callback();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#212121] border-4 border-[#3f3f3f] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white font-sans flex flex-col">
        {/* Header Title */}
        <div className="bg-[#181818] px-6 py-4 border-b-4 border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <div>
              <h2 className="text-lg font-black text-amber-400 font-minecraft tracking-wider">
                {t('menu.title')}
              </h2>
              <p className="text-[11px] text-zinc-400">{t('menu.subtitle')}</p>
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

        {/* Content Navigation */}
        <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
          {/* PizzaCowMC Developer Banner Card */}
          <a
            href="https://github.com/PizzaCowMC"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClickSound()}
            className="block bg-gradient-to-r from-emerald-950/70 via-[#1f2d24] to-zinc-900 border-2 border-emerald-500/50 hover:border-emerald-400 rounded-xl p-3.5 shadow-lg group transition-all transform hover:-translate-y-0.5 active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      {isEn ? 'Developer' : '開發作者'}
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      PizzaCowMC
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 font-medium group-hover:text-emerald-200 transition-colors flex items-center gap-1 mt-0.5">
                    <span>{isEn ? 'Visit Official GitHub' : '前往 GitHub 官方專頁'}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
              <span className="text-xl">🐮</span>
            </div>
          </a>

          {/* Quick Core Zones */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleAction(() => onSelectTab('quarry'))}
              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                activeTab === 'quarry'
                  ? 'bg-amber-950/70 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-[#282828] hover:bg-[#323232] border-[#383838] text-zinc-300'
              } active:scale-95`}
            >
              <Pickaxe className="w-5 h-5 text-amber-400" />
              <span>{isEn ? 'Excavation Quarry' : '礦脈挖掘場'}</span>
            </button>

            <button
              onClick={() => handleAction(() => onSelectTab('building'))}
              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                activeTab === 'building'
                  ? 'bg-blue-950/70 border-blue-500 text-blue-300 shadow-md'
                  : 'bg-[#282828] hover:bg-[#323232] border-[#383838] text-zinc-300'
              } active:scale-95`}
            >
              <Box className="w-5 h-5 text-blue-400" />
              <span>{isEn ? '100-Block Studio' : '100格建築工坊'}</span>
            </button>
          </div>

          {/* Functional Navigation Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => handleAction(onOpenMarket)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Mineral Market (Sell Blocks)' : '礦產資源交易所 (賣方塊)'}</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Market →</span>
            </button>

            <button
              onClick={() => handleAction(onOpenShop)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Workshop Emporium (Pickaxes & Upgrades)' : '工坊裝備商店 (鎬具與附魔)'}</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Shop →</span>
            </button>

            {onOpenFestivals && (
              <button
                onClick={() => handleAction(onOpenFestivals)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-red-950/70 via-amber-950/50 to-zinc-900 hover:from-red-900/80 hover:to-zinc-800 border border-amber-500/50 rounded-xl flex items-center justify-between text-xs font-bold text-amber-200 hover:text-white transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🎉</span>
                  <span>{isEn ? 'Festivals Hall (Halloween, Christmas & Sakura)' : '節慶狂歡大廳 (萬聖節/聖誕/櫻花/春節限定)'}</span>
                </div>
                <span className="text-amber-400 text-[10px] font-mono font-bold">Festivals →</span>
              </button>
            )}

            {onOpenLevel && (
              <button
                onClick={() => handleAction(onOpenLevel)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-950/60 to-[#282828] hover:from-emerald-900/70 hover:to-[#323232] border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-200 hover:text-white transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? `Player Level (Lv.${playerLevel}) & Promotion Quests` : `玩家等級 (Lv.${playerLevel}) 與晉升特殊任務`}</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-mono font-bold">Lv.{playerLevel} →</span>
              </button>
            )}

            <button
              onClick={() => handleAction(onOpenAchievements)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span>{isEn ? 'Trophy & Milestones (1,000 Achievements)' : '成就榮耀殿堂 (1,000 項里程碑)'}</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Trophies →</span>
            </button>

            <button
              onClick={() => handleAction(onOpenFriends)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span>{isEn ? 'Friends & Referral Bonus (+100 Coins)' : '好友名單與邀請獎勵 (+100金幣)'}</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Social →</span>
            </button>

            <button
              onClick={() => handleAction(onOpenAuth)}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-[#2a241b] to-[#282828] hover:from-[#352c1e] hover:to-[#333] border border-amber-600/40 rounded-xl flex items-center justify-between text-xs font-bold text-amber-200 transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Account & Cloud Sync' : '帳號登入與雲端存檔'}</span>
              </div>
              <span className="text-amber-400 font-mono text-[11px]">
                {currentUser ? (isEn ? 'Logged In ✔' : '已登入 ✔') : (isEn ? 'Guest' : '未登入')}
              </span>
            </button>

            <button
              onClick={() => handleAction(onOpenChangelog)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Scroll className="w-4 h-4 text-amber-300" />
                <span>{isEn ? '📜 Release Notes (Changelog v2.2.7)' : '📜 版本更新日誌 (Changelog v2.2.7)'}</span>
              </div>
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                v2.2.7
              </span>
            </button>
          </div>

          {/* Language Switcher Setting */}
          <div className="pt-2 border-t border-[#333]">
            <button
              onClick={() => {
                sound.playClickSound();
                toggleLanguage();
              }}
              className="w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Languages className="w-4 h-4 text-cyan-400" />
                <span>{t('lang.label')}</span>
              </div>
              <span className="px-2.5 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-700 rounded-lg text-xs font-bold font-mono">
                {isEn ? 'Switch to 中文' : '切換為 English'}
              </span>
            </button>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="pt-2 border-t border-red-950/60">
            {!showResetConfirm ? (
              <button
                onClick={() => {
                  sound.playClickSound();
                  setShowResetConfirm(true);
                }}
                className="w-full px-3.5 py-2.5 bg-red-950/40 hover:bg-red-900/50 border-2 border-red-700/60 hover:border-red-500 rounded-xl flex items-center justify-between text-xs font-black text-red-400 hover:text-red-200 transition-all group active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="tracking-wide">{t('menu.dangerZone')}</span>
                </div>
                <span className="text-[10px] bg-red-900/80 text-red-200 px-2 py-0.5 rounded border border-red-600 font-mono font-bold">
                  {isEn ? 'RESET' : '重置'}
                </span>
              </button>
            ) : (
              <div className="p-3.5 bg-gradient-to-b from-red-950/95 to-red-900/90 border-2 border-red-500 rounded-xl text-left space-y-3 animate-in fade-in zoom-in-95 shadow-xl shadow-red-950/80">
                <div className="flex items-center gap-2 text-red-200 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span>{t('menu.resetPrompt')}</span>
                </div>
                <div className="text-[11px] text-red-100/90 space-y-1 bg-black/40 p-2 rounded-lg border border-red-800/60">
                  <p className="font-bold text-red-300">
                    {isEn ? '⚠️ Irreversible action! The following will be wiped:' : '⚠️ 此操作不可撤回，重置後將清空：'}
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-zinc-300 pl-1">
                    <li>{isEn ? 'All coins and inventory blocks' : '所有金幣與庫存方塊'}</li>
                    <li>{isEn ? 'All pickaxe tiers, durability and enchantments' : '所有鎬具階級、耐久與附魔強化'}</li>
                    <li>{isEn ? '8 stratum layers progress and excavation stats' : '8 大礦脈層 100,000 格拓荒與挖掘紀錄'}</li>
                    <li>{isEn ? '1,000 achievements & progression rewards' : '1,000 個成就與歷史挖掘統計'}</li>
                    <li>{isEn ? '100-block creative building canvas' : '100 格建築作品'}</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      sound.playClickSound();
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all border border-zinc-600 active:scale-95 cursor-pointer"
                  >
                    {t('menu.cancel')}
                  </button>
                  <button
                    onClick={() => {
                      sound.playExplosionSound();
                      setShowResetConfirm(false);
                      onClose();
                      if (onResetProgress) {
                        onResetProgress();
                      }
                    }}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-black transition-all border-2 border-black shadow-[inset_1px_1px_0_#fca5a5,inset_-1px_-1px_0_#7f1d1d] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span>{t('menu.confirmReset')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sound Toggle & Controls */}
          <div className="pt-2 flex items-center justify-between border-t border-[#333]">
            <button
              onClick={() => {
                onToggleSound();
                sound.playClickSound();
              }}
              className="px-3 py-2 bg-[#282828] hover:bg-[#333] border border-[#3c3c3c] rounded-lg text-xs font-bold text-zinc-300 flex items-center gap-2 transition-all cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('menu.soundOn')}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                  <span>{t('menu.soundOff')}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 font-minecraft cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('menu.resume')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
