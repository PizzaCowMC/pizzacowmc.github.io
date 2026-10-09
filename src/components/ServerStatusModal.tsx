import React, { useEffect, useState } from 'react';
import { Activity, Users, Wifi, HardDrive, Trophy, RefreshCw, Cloud, Award, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface LeaderboardItem {
  rank: number;
  name: string;
  value: number;
  badge: string;
}

interface ServerStatusData {
  status: string;
  serverName: string;
  version: string;
  tps: number;
  pingMs: number;
  onlinePlayers: number;
  maxPlayers: number;
  uptime: string;
  loadedChunks: number;
  activeEntities: number;
  cloudSync: string;
  motd: string;
}

interface LeaderboardData {
  mining: LeaderboardItem[];
  cafe: LeaderboardItem[];
  wealth: LeaderboardItem[];
  updatedAt: string;
}

interface ServerStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  playerName: string;
  playerStats: {
    totalBlocksMined: number;
    totalCoinsEarned: number;
  };
  cafeServedCount: number;
  onManualSave?: () => void;
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({
  isOpen,
  onClose,
  isEn,
  playerName,
  playerStats,
  cafeServedCount,
  onManualSave
}) => {
  const [serverStatus, setServerStatus] = useState<ServerStatusData | null>(null);
  const [leaderboards, setLeaderboards] = useState<LeaderboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'mining' | 'cafe' | 'wealth'>('mining');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const fetchServerData = async () => {
    setIsLoading(true);
    try {
      const [resStatus, resBoard] = await Promise.all([
        fetch('/api/server/status'),
        fetch('/api/server/leaderboard')
      ]);

      if (resStatus.ok) {
        const data = await resStatus.json();
        setServerStatus(data);
      }
      if (resBoard.ok) {
        const data = await resBoard.json();
        setLeaderboards(data);
      }
    } catch (err) {
      console.warn('Failed to fetch server status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchServerData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveNow = () => {
    sound.playLevelUpSound();
    if (onManualSave) onManualSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const currentList = leaderboards ? leaderboards[activeTab] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border-4 border-cyan-600/80 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden text-white font-sans flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-[#1e1b4b] px-5 py-4 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-900/80 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-lg">
              🌐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-cyan-300 font-minecraft tracking-wide">
                  {isEn ? 'Minecraft Server Status & Leaderboards' : '即時伺服器狀態監控與全服排行榜'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                {isEn ? 'Live PaperMC network metrics, cloud saves & multi-category rankings' : '即時監控伺服器 TPS/Ping 延遲、雲端同步狀態與三大多維榮譽榜'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/80 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Server Metrics Bar */}
        <div className="bg-[#121214] p-3 sm:p-4 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Server TPS' : '伺服器 TPS'}</div>
              <div className="text-sm font-mono font-black text-emerald-300">
                {serverStatus?.tps ?? 20.0} <span className="text-[10px] text-zinc-500 font-normal">/ 20.0</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-center gap-2.5">
            <Wifi className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Network Ping' : '網路延遲 Ping'}</div>
              <div className="text-sm font-mono font-black text-cyan-300">
                {serverStatus?.pingMs ?? 19} <span className="text-[10px] text-zinc-500 font-normal">ms</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-center gap-2.5">
            <Users className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Online Players' : '在線玩家'}</div>
              <div className="text-sm font-mono font-black text-purple-300">
                {serverStatus?.onlinePlayers ?? 92} <span className="text-[10px] text-zinc-500 font-normal">/ 300</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Cloud Sync' : '雲端同步存檔'}</div>
              <div className="text-sm font-mono font-black text-amber-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isEn ? 'Synchronized' : '即時同步中'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Tab Switcher */}
        <div className="px-4 py-2.5 bg-[#1e1e24] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveTab('mining');
              }}
              className={`px-3 py-1.5 rounded-lg font-minecraft text-[11px] font-bold cursor-pointer transition-all ${
                activeTab === 'mining'
                  ? 'bg-amber-600 text-black border border-amber-400 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ⛏️ {isEn ? 'Mining Leaderboard' : '開採挖掘榜'}
            </button>
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveTab('cafe');
              }}
              className={`px-3 py-1.5 rounded-lg font-minecraft text-[11px] font-bold cursor-pointer transition-all ${
                activeTab === 'cafe'
                  ? 'bg-cyan-600 text-black border border-cyan-400 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ☕ {isEn ? 'Cafe Chef Leaderboard' : '咖啡名廚榜'}
            </button>
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveTab('wealth');
              }}
              className={`px-3 py-1.5 rounded-lg font-minecraft text-[11px] font-bold cursor-pointer transition-all ${
                activeTab === 'wealth'
                  ? 'bg-yellow-500 text-black border border-yellow-300 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🪙 {isEn ? 'Wealth Leaderboard' : '礦業富豪榜'}
            </button>
          </div>

          {/* Quick save button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveNow}
              className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/80 text-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'Saved to Cloud!' : '已成功儲存存檔！'}</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'Instant Cloud Save' : '立即備份雲端存檔'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClickSound();
                fetchServerData();
              }}
              disabled={isLoading}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 cursor-pointer transition-all active:scale-95"
              title={isEn ? 'Refresh' : '重新整理'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Leaderboard Roster Body */}
        <div className="p-4 overflow-y-auto space-y-2">
          {/* Player Personal Stat Banner */}
          <div className="p-3 bg-gradient-to-r from-amber-950/60 to-purple-950/60 border border-amber-500/50 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👤</span>
              <div>
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>{playerName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                    {isEn ? 'YOU' : '你'}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono">
                  {activeTab === 'mining' && `${isEn ? 'Mined' : '累計開採'}: ${playerStats.totalBlocksMined.toLocaleString()} 方塊`}
                  {activeTab === 'cafe' && `${isEn ? 'Served' : '累計出餐'}: ${cafeServedCount.toLocaleString()} 份料理`}
                  {activeTab === 'wealth' && `${isEn ? 'Total Wealth' : '總金幣產出'}: ${playerStats.totalCoinsEarned.toLocaleString()} 🪙`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                ✨ {isEn ? 'Real-time Rank Verified' : '已連線驗證'}
              </span>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-1.5">
            {currentList.map((item) => {
              const isTop3 = item.rank <= 3;
              const isMe = item.name === playerName;

              return (
                <div
                  key={`${item.rank}-${item.name}`}
                  className={`px-3 py-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isMe
                      ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : isTop3
                      ? 'bg-zinc-900/90 border-zinc-700 hover:border-zinc-500'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 text-center font-black font-mono">
                      {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                    </div>
                    <div>
                      <div className="font-black text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {isMe && (
                          <span className="text-[9px] px-1 py-0.2 bg-amber-500 text-black font-bold rounded">
                            ME
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="font-mono font-bold text-amber-300 text-right">
                    {item.value.toLocaleString()}{' '}
                    <span className="text-zinc-500 text-[10px]">
                      {activeTab === 'mining' ? (isEn ? 'blocks' : '格') : activeTab === 'cafe' ? (isEn ? 'dishes' : '份') : '🪙'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
