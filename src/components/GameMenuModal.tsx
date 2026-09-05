import React, { useState } from 'react';
import {
  Pickaxe,
  Box,
  Coins,
  ShoppingCart,
  Award,
  Users,
  Scroll,
  Cloud,
  ExternalLink,
  X,
  Volume2,
  VolumeX,
  Play,
  Github,
  AlertTriangle,
  Flame,
  RotateCcw
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

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
  onResetProgress,
  currentUser,
  soundEnabled,
  onToggleSound
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

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
                遊戲主選單 (Game Menu)
              </h2>
              <p className="text-[11px] text-zinc-400">快速切換功能分頁與系統設定</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
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
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">開發作者</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">PizzaCowMC</span>
                  </div>
                  <div className="text-xs text-zinc-300 font-medium group-hover:text-emerald-200 transition-colors flex items-center gap-1 mt-0.5">
                    <span>前往 GitHub 官方專頁</span>
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
                  ? 'bg-amber-950/50 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-[#282828] border-[#383838] hover:bg-[#303030] text-zinc-200'
              }`}
            >
              <Pickaxe className="w-5 h-5 text-amber-400" />
              <span>⛏️ 挖掘場</span>
            </button>

            <button
              onClick={() => handleAction(() => onSelectTab('building'))}
              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                activeTab === 'building'
                  ? 'bg-blue-950/50 border-blue-500 text-blue-300 shadow-md'
                  : 'bg-[#282828] border-[#383838] hover:bg-[#303030] text-zinc-200'
              }`}
            >
              <Box className="w-5 h-5 text-blue-400" />
              <span>🧱 100格建築區</span>
            </button>
          </div>

          {/* Feature List */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => handleAction(onOpenMarket)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>方塊交易市場 (資源變現金)</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Market →</span>
            </button>

            <button
              onClick={() => handleAction(onOpenShop)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>道具與外觀商店 (鎬子升級/主題/外觀)</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Shop →</span>
            </button>

            <button
              onClick={() => handleAction(onOpenAchievements)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-purple-400" />
                <span>成就系統 (1,000 個挑戰與獎金)</span>
              </div>
              <span className="text-zinc-500 text-[10px]">1,000 個 →</span>
            </button>

            <button
              onClick={() => handleAction(onOpenFriends)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span>好友名單與邀請獎勵 (+100金幣)</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Social →</span>
            </button>

            <button
              onClick={() => handleAction(onOpenAuth)}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-[#2a241b] to-[#282828] hover:from-[#352c1e] hover:to-[#333] border border-amber-600/40 rounded-xl flex items-center justify-between text-xs font-bold text-amber-200 transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-amber-400" />
                <span>Firebase 帳號登入與雲端存檔</span>
              </div>
              <span className="text-amber-400 font-mono text-[11px]">
                {currentUser ? '已登入 ✔' : '未登入'}
              </span>
            </button>

            <button
              onClick={() => handleAction(onOpenChangelog)}
              className="w-full px-4 py-2.5 bg-[#282828] hover:bg-[#323232] border border-[#383838] rounded-xl flex items-center justify-between text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Scroll className="w-4 h-4 text-amber-300" />
                <span>📜 版本更新日誌 (Changelog v2.0.0)</span>
              </div>
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">NEW</span>
            </button>
          </div>

          {/* 藏在選單底部的紅色重製進度危險專區 */}
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
                  <span className="tracking-wide">危險專區：重製全部進度 (Reset Progress)</span>
                </div>
                <span className="text-[10px] bg-red-900/80 text-red-200 px-2 py-0.5 rounded border border-red-600 font-mono font-bold">
                  重置
                </span>
              </button>
            ) : (
              <div className="p-3.5 bg-gradient-to-b from-red-950/95 to-red-900/90 border-2 border-red-500 rounded-xl text-left space-y-3 animate-in fade-in zoom-in-95 shadow-xl shadow-red-950/80">
                <div className="flex items-center gap-2 text-red-200 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span>確定重置所有遊戲進度？</span>
                </div>
                <div className="text-[11px] text-red-100/90 space-y-1 bg-black/40 p-2 rounded-lg border border-red-800/60">
                  <p className="font-bold text-red-300">⚠️ 此操作不可撤回，重置後將清空：</p>
                  <ul className="list-disc list-inside space-y-0.5 text-zinc-300 pl-1">
                    <li>所有金幣與庫存方塊</li>
                    <li>所有鎬具階級、耐久與附魔強化</li>
                    <li>8 大礦脈層 50,000 格拓荒與挖掘紀錄</li>
                    <li>1,000 個成就與歷史挖掘統計</li>
                    <li>100 格建築作品</li>
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
                    取消返回
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
                    <span>確認永久重置</span>
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
              className="px-3 py-2 bg-[#282828] hover:bg-[#333] border border-[#3c3c3c] rounded-lg text-xs font-bold text-zinc-300 flex items-center gap-2 transition-all"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>音效：已開啟</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                  <span>音效：已靜音</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 font-minecraft"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>返回遊戲</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
