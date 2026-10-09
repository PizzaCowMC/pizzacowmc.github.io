import React, { useState } from 'react';
import {
  Hotel,
  X,
  Coffee,
  Pickaxe,
  Globe,
  Bot,
  Compass,
  Sparkles,
  Waves,
  Bed,
  Music,
  Flame,
  ChevronRight,
  ShieldCheck,
  Check,
  Clock,
  Zap,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface LeisureHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  coins: number;
  playerName: string;
  playerLevel: number;
  onOpenCoffeeLounge: () => void;
  onOpenPickaxeEvolution: () => void;
  onOpenServerStatus: () => void;
  onOpenAIBrista: () => void;
  onOpenAIBlueprint: () => void;
  onApplyBuff?: (
    buffType: 'haste' | 'fortune' | 'double_coins' | 'overclock',
    durationSec: number,
    nameZh: string,
    nameEn: string,
    cost: number
  ) => void;
  activeBuffTimers?: {
    hasteSec: number;
    doubleCoinsSec: number;
    extremeHasteSec: number;
  };
  onOpenMusicPlayer?: () => void;
  onGoToMap?: () => void;
}

type HotelFacility = 'overview' | 'lounge' | 'forge' | 'guild' | 'barista' | 'blueprint' | 'hotspring' | 'suite';

export const LeisureHotelModal: React.FC<LeisureHotelModalProps> = ({
  isOpen,
  onClose,
  isEn,
  coins,
  playerName,
  playerLevel,
  onOpenCoffeeLounge,
  onOpenPickaxeEvolution,
  onOpenServerStatus,
  onOpenAIBrista,
  onOpenAIBlueprint,
  onApplyBuff,
  activeBuffTimers = { hasteSec: 0, doubleCoinsSec: 0, extremeHasteSec: 0 },
  onOpenMusicPlayer,
  onGoToMap
}) => {
  const [activeFacility, setActiveFacility] = useState<HotelFacility>('overview');
  const [spaSoakActive, setSpaSoakActive] = useState<boolean>(false);
  const [spaCountdown, setSpaCountdown] = useState<number>(0);

  if (!isOpen) return null;

  const handleHotSpringSoak = () => {
    if (spaSoakActive) return;
    sound.playUpgradeSound ? sound.playUpgradeSound() : sound.playClickSound();
    setSpaSoakActive(true);
    setSpaCountdown(300); // 5 min hot spring buff

    // Apply hot spring revitalization buff: haste + fortune bonus
    if (onApplyBuff) {
      onApplyBuff(
        'haste',
        300,
        '♨️ 天然地熱溫泉水療 (Hot Spring Spa)',
        '♨️ Subterranean Geothermal Hot Spring Spa',
        0
      );
    }
  };

  const facilities = [
    {
      id: 'lounge' as HotelFacility,
      nameZh: '☕ 邊喝咖啡邊掛機吧台',
      nameEn: '☕ Coffee Lounge & AFK Bar',
      badgeZh: '掛機增益',
      badgeEn: 'AFK Buffs',
      badgeColor: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
      icon: Coffee,
      iconColor: 'text-amber-400',
      descZh: '享用深層特調咖啡（黑曜石濃縮、金蘋果摩卡等），啟動雙倍開採速與金幣Buff，沉浸Lo-Fi音樂放鬆。',
      descEn: 'Order artisanal Minecraft coffees for mining haste & coin multipliers while relaxing to lo-fi beats.',
      actionZh: '進入掛機吧台',
      actionEn: 'Open Coffee Lounge',
      onAction: onOpenCoffeeLounge
    },
    {
      id: 'forge' as HotelFacility,
      nameZh: '⛏️ 經典鎬具合成進化樹',
      nameEn: '⛏️ Pickaxe Evolution Tree',
      badgeZh: '神兵鍛造',
      badgeEn: 'Evolution',
      badgeColor: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50',
      icon: Pickaxe,
      iconColor: 'text-yellow-400',
      descZh: '正統五階鎬具科技樹：木鎬 ➔ 石鎬 ➔ 鐵鎬 ➔ 鑽石鎬 ➔ 獄髓鎬，全面提升耐久、傷害與暴擊率。',
      descEn: 'Classic 5-tier Minecraft evolution: Wooden, Stone, Iron, Diamond, up to Netherite with massive mining damage.',
      actionZh: '開啟鎬具進化樹',
      actionEn: 'Open Pickaxe Tree',
      onAction: onOpenPickaxeEvolution
    },
    {
      id: 'guild' as HotelFacility,
      nameZh: '🌐 冒險者公會・即時伺服器',
      nameEn: '🌐 Adventurer Guild & Server Monitor',
      badgeZh: '即時聯網',
      badgeEn: 'Live Status',
      badgeColor: 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50',
      icon: Globe,
      iconColor: 'text-cyan-400',
      descZh: '實時監控 Minecraft 伺服器健康狀態、20.0 TPS 穩定度指標、毫秒延遲 Ping 與全球挖礦天梯榜。',
      descEn: 'Live server metrics, 20.0 TPS meter, latency ping test, active online player rosters & excavation leaderboards.',
      actionZh: '檢視伺服器狀態',
      actionEn: 'View Server Status',
      onAction: onOpenServerStatus
    },
    {
      id: 'barista' as HotelFacility,
      nameZh: '👨‍🌾 老鐵店長接待前台 (AI)',
      nameEn: '👨‍🌾 AI Villager Barista Desk',
      badgeZh: 'Gemini 驅動',
      badgeEn: 'Gemini AI',
      badgeColor: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50',
      icon: Bot,
      iconColor: 'text-emerald-400',
      descZh: '由 Gemini 驅動的村民形象智慧店長！與老鐵交談、點特調飲品、詢問礦坑八卦與解鎖神秘折扣彩蛋。',
      descEn: 'Chat with "Old Iron", the legendary villager barista. Order drinks, hear gossip and unlock easter eggs.',
      actionZh: '與老鐵店長對話',
      actionEn: 'Chat with Old Iron',
      onAction: onOpenAIBrista
    },
    {
      id: 'blueprint' as HotelFacility,
      nameZh: '📐 建築師事務所 (AI 藍圖工坊)',
      nameEn: '📐 Architectural Studio (AI Blueprints)',
      badgeZh: '指令匯出',
      badgeEn: 'Command Gen',
      badgeColor: 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50',
      icon: Compass,
      iconColor: 'text-indigo-400',
      descZh: '輸入任意風格關鍵字，AI 自動生成 Minecraft 咖啡廳與旅館建築藍圖、方塊清單與 /fill /setblock 指令！',
      descEn: 'Input any theme to generate Minecraft blueprints, block bills of materials, and in-game /fill commands.',
      actionZh: '開啟藍圖設計工坊',
      actionEn: 'Open Blueprint Studio',
      onAction: onOpenAIBlueprint
    },
    {
      id: 'hotspring' as HotelFacility,
      nameZh: '♨️ 天然地熱露天溫泉水療',
      nameEn: '♨️ Geothermal Hot Spring Spa',
      badgeZh: '溫泉活血',
      badgeEn: 'Spa Boost',
      badgeColor: 'bg-rose-600/30 text-rose-300 border-rose-500/50',
      icon: Waves,
      iconColor: 'text-rose-400',
      descZh: '引流地底深處熔岩地熱天然泉水，浸泡可解除疲勞，獲得「溫泉水療 Buff」（急迫挖礦速度顯著提升）！',
      descEn: 'Subterranean mineral hot springs. Soaking washes away fatigue and grants pickaxe Haste regeneration!',
      actionZh: spaSoakActive ? '已在享受溫泉中 ♨️' : '浸泡溫泉 (獲得5分鐘急迫Buff)',
      actionEn: spaSoakActive ? 'Soaking in Spa ♨️' : 'Soak in Hot Spring (+5min Haste)',
      onAction: handleHotSpringSoak
    },
    {
      id: 'suite' as HotelFacility,
      nameZh: '🛏️ 景觀觀星套房 (掛機休憩室)',
      nameEn: '🛏️ Starlight Resort Suites (Rest Lounge)',
      badgeZh: '舒適休憩',
      badgeEn: 'Suites',
      badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
      icon: Bed,
      iconColor: 'text-purple-400',
      descZh: '配置羊毛軟床、紅石音階盒唱片機與落地玻璃窗，俯瞰大地圖綠色森林與地底採礦升降梯。',
      descEn: 'Luxury wool beds, redstone jukeboxes, and panoramic views of the overworld forest and mine shafts.',
      actionZh: '開啟唱片機休閒',
      actionEn: 'Play Jukebox',
      onAction: onOpenMusicPlayer || (() => {})
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#1c1917] border-4 border-[#854d0e] rounded-2xl w-full max-w-4xl shadow-[0_0_60px_rgba(202,138,4,0.35)] overflow-hidden text-white font-sans flex flex-col max-h-[92vh]">
        
        {/* HOTEL HEADER */}
        <div className="bg-gradient-to-r from-[#291b12] via-[#3d2716] to-[#291b12] px-4 sm:px-6 py-4 border-b-4 border-[#1c1917] flex items-center justify-between relative shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-700 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xl">
                🏨
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border border-black" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-amber-300 font-minecraft tracking-wide drop-shadow-[1px_1px_0_#000]">
                  {isEn ? '🏨 Minecraft Leisure Resort Hotel' : '🏨 Minecraft 休閒渡假旅館'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono font-bold">
                  ★ ★ ★ ★ ★ RESORT
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5 font-medium flex items-center gap-2">
                <span>{isEn ? 'Lodge Bar • Tech Tree • Server Status • AI Barista • Hot Springs Spa' : '掛機吧台 • 鎬具進化樹 • 伺服器狀態 • 老鐵AI店長 • 露天溫泉水療'}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-amber-400 font-bold">{playerName} (Lv.{playerLevel})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onGoToMap && (
              <button
                onClick={() => {
                  sound.playClickSound();
                  onClose();
                  onGoToMap();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs font-bold transition-all cursor-pointer shadow active:scale-95"
                title={isEn ? 'Return to Overworld Map' : '返回大地圖'}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEn ? 'Overworld Map' : '大地圖'}</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-2 hover:bg-amber-950/80 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STATUS & BUFF TICKER */}
        <div className="bg-[#141210] px-4 sm:px-6 py-2 border-b border-amber-950/60 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 font-medium flex items-center gap-1">
              <span>🪙</span>
              <span>{isEn ? 'Wallet Balance:' : '當前錢包：'}</span>
              <strong className="text-amber-300 font-mono font-bold text-sm">{coins.toLocaleString()}</strong>
            </span>

            {/* Active Buff Badges */}
            {(activeBuffTimers.hasteSec > 0 || spaSoakActive) && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{isEn ? 'Haste Buff' : '急迫挖掘中'}</span>
              </span>
            )}

            {activeBuffTimers.doubleCoinsSec > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{isEn ? '2x Coins' : '雙倍金幣中'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenMusicPlayer && (
              <button
                onClick={() => {
                  sound.playClickSound();
                  onOpenMusicPlayer();
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/50 rounded-lg text-amber-200 text-[11px] font-bold cursor-pointer transition-all"
              >
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Lounge Music' : '旅館輕音樂'}</span>
              </button>
            )}
          </div>
        </div>

        {/* HOTEL CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] space-y-4 custom-scrollbar">
          
          {/* Welcome Banner */}
          <div className="p-4 bg-gradient-to-r from-[#2c1d11] via-[#3a2516] to-[#2c1d11] border-2 border-amber-700/60 rounded-xl shadow-inner relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 bg-black/40 rounded-xl border border-amber-800">
                ♨️
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-amber-300 font-minecraft">
                  {isEn ? 'Welcome to the Travelers\' Sanctuary' : '歡迎來到冒險者休閒渡假旅館'}
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {isEn
                    ? 'All high-level services consolidated here: Coffee Lounge, Pickaxe Evolution, Server Network, AI Staff & Blueprints.'
                    : '將頂部導航之高階機能整合於此：掛機吧台、鎬具樹、伺服器聯網、老鐵店長前台、建築藍圖工坊與地熱溫泉！'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleHotSpringSoak}
                disabled={spaSoakActive}
                className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
                  spaSoakActive
                    ? 'bg-rose-950 text-rose-300 border-rose-700 opacity-90'
                    : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white border-amber-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                }`}
              >
                <span>♨️</span>
                <span>{spaSoakActive ? (isEn ? 'Spa Active (Haste)' : '已泡溫泉 (急迫中)') : (isEn ? 'Soak in Spa' : '享受溫泉水療')}</span>
              </button>
            </div>
          </div>

          {/* FACILITY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {facilities.map((fac) => {
              const IconComp = fac.icon;
              return (
                <div
                  key={fac.id}
                  className="bg-[#24201c] hover:bg-[#2c2722] border-2 border-amber-900/60 hover:border-amber-500/80 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 group shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg bg-black/40 border border-zinc-700 ${fac.iconColor}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-amber-200 font-minecraft text-sm group-hover:text-amber-100">
                          {isEn ? fac.nameEn : fac.nameZh}
                        </h4>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${fac.badgeColor}`}>
                        {isEn ? fac.badgeEn : fac.badgeZh}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed pl-0.5">
                      {isEn ? fac.descEn : fac.descZh}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {isEn ? 'Instant Access' : '即刻啟動'}
                    </span>
                    <button
                      onClick={() => {
                        sound.playClickSound();
                        fac.onAction();
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-black text-xs rounded-lg border-2 border-amber-300 shadow active:scale-95 transition-all flex items-center gap-1 cursor-pointer font-minecraft"
                    >
                      <span>{isEn ? fac.actionEn : fac.actionZh}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* HOTEL FOOTER */}
        <div className="bg-[#141210] px-6 py-3.5 border-t-2 border-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">📍</span>
            <span>{isEn ? 'Location: Overworld Map Northeast Resort Sector' : '座落地點：大地圖東北區・溫泉森林休閒特區'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-lg border border-zinc-600 transition-all cursor-pointer"
            >
              {isEn ? 'Close Hotel' : '關閉旅館介面'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
