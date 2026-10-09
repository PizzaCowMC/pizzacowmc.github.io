import React, { useState } from 'react';
import { Coffee, Flame, Sparkles, Zap, Shield, Music, Bot, Clock, Check, Volume2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export interface CoffeeBuffOption {
  id: 'lava_espresso' | 'emerald_latte' | 'golden_mocha' | 'redstone_coldbrew' | 'peaceful_milk';
  nameZh: string;
  nameEn: string;
  icon: string;
  descZh: string;
  descEn: string;
  buffType: 'haste' | 'fortune' | 'double_coins' | 'overclock';
  durationSec: number;
  costCoins: number;
  badgeZh: string;
  badgeEn: string;
  accentColor: string;
}

export const COFFEE_BUFF_MENU: CoffeeBuffOption[] = [
  {
    id: 'lava_espresso',
    nameZh: '🌋 熔岩黑咖啡 (Obsidian Espresso)',
    nameEn: '🌋 Obsidian Lava Espresso',
    icon: '☕',
    descZh: '以深層黑曜石高壓萃取的熔岩濃縮咖啡，熱力直沖四肢，急迫挖礦速度翻倍！',
    descEn: 'High-pressure extraction through subterranean obsidian. Grants pickaxe Haste +100%!',
    buffType: 'haste',
    durationSec: 180,
    costCoins: 80,
    badgeZh: '⛏️ 挖礦速度 +100%',
    badgeEn: '⛏️ Mining Speed +100%',
    accentColor: '#f97316'
  },
  {
    id: 'emerald_latte',
    nameZh: '💎 綠寶石幸運拿鐵 (Emerald Fortune Latte)',
    nameEn: '💎 Emerald Fortune Latte',
    icon: '🍵',
    descZh: '加入高純度綠寶石精粹奶泡的香醇特調，幸運掉落率大幅激增，礦石噴發！',
    descEn: 'Silky microfoam infused with emerald essence. Boosts Fortune double block drop chance!',
    buffType: 'fortune',
    durationSec: 180,
    costCoins: 120,
    badgeZh: '🍀 幸運掉落雙倍率',
    badgeEn: '🍀 Double Fortune Drops',
    accentColor: '#10b981'
  },
  {
    id: 'golden_mocha',
    nameZh: '🍯 金蘋果蜂蜜摩卡 (Golden Honey Mocha)',
    nameEn: '🍯 Golden Honey Mocha',
    icon: '🍫',
    descZh: '濃郁純黑可可融合附魔金蘋果糖漿，市集賣出與開採分紅金幣全面雙倍！',
    descEn: 'Rich dark cocoa swirled with enchanted golden apple syrup. All coin yields +100%!',
    buffType: 'double_coins',
    durationSec: 150,
    costCoins: 150,
    badgeZh: '🪙 金幣收益 +100%',
    badgeEn: '🪙 Double Coins Yield',
    accentColor: '#f59e0b'
  },
  {
    id: 'redstone_coldbrew',
    nameZh: '⚡ 紅石冷萃超頻咖啡 (Redstone Cold Brew)',
    nameEn: '⚡ Redstone Cold Brew',
    icon: '🥤',
    descZh: '低溫慢速冷萃 24 小時的紅石高能咖啡，為自動採礦魔像動力核心極限超頻！',
    descEn: 'Slow cold-dripped with energetic redstone powder. Overclocks Auto-Miner golem cycles!',
    buffType: 'overclock',
    durationSec: 240,
    costCoins: 160,
    badgeZh: '🤖 自動魔像超頻',
    badgeEn: '🤖 Overclock Auto-Miner',
    accentColor: '#ef4444'
  }
];

interface CoffeeLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  coins: number;
  onApplyBuff: (buffType: 'haste' | 'fortune' | 'double_coins' | 'overclock', durationSec: number, nameZh: string, nameEn: string, cost: number) => void;
  activeBuffTimers: {
    hasteSec: number;
    doubleCoinsSec: number;
    extremeHasteSec: number;
  };
  onOpenMusicPlayer?: () => void;
  onOpenAIBrista?: () => void;
}

export const CoffeeLoungeModal: React.FC<CoffeeLoungeModalProps> = ({
  isOpen,
  onClose,
  isEn,
  coins,
  onApplyBuff,
  activeBuffTimers,
  onOpenMusicPlayer,
  onOpenAIBrista
}) => {
  const [justSippedId, setJustSippedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOrderCoffee = (item: CoffeeBuffOption) => {
    if (coins < item.costCoins) {
      sound.playFailSound();
      return;
    }

    sound.playSipCoffeeSound();
    setJustSippedId(item.id);
    setTimeout(() => setJustSippedId(null), 1200);

    onApplyBuff(item.buffType, item.durationSec, item.nameZh, item.nameEn, item.costCoins);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#1c1917] border-4 border-amber-700/80 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(217,119,6,0.35)] overflow-hidden text-white font-sans flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-[#261e19] to-amber-900 px-5 py-4 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-900/90 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-lg">
                ☕
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 font-minecraft tracking-wide">
                  {isEn ? '☕ Idle Coffee Lounge & Bar' : '☕ 邊喝咖啡邊掛機・特調吧台'}
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  BUFF BAR
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                {isEn
                  ? 'Sip specialty coffee to activate powerful mining buffs while enjoying Lo-Fi vibes'
                  : '在咖啡廳悠閒品味特調咖啡，獲得雙倍挖礦速度與幸運 Buff，放鬆掛機享受時光'}
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

        {/* Ambient Steam Banner & Quick Actions */}
        <div className="bg-[#241c16] px-5 py-2.5 border-b border-amber-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-zinc-400 flex items-center gap-1">
              <span>🪙 {isEn ? 'Balance:' : '持有金幣：'}</span>
              <strong className="text-amber-300">{coins.toLocaleString()}</strong>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {isEn ? 'Active Haste:' : '當前急迫：'}
              <strong className={activeBuffTimers.hasteSec > 0 ? "text-emerald-400" : "text-zinc-500"}>
                {activeBuffTimers.hasteSec > 0 ? `${activeBuffTimers.hasteSec}s` : (isEn ? 'None' : '無')}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMusicPlayer && (
              <button
                onClick={() => {
                  sound.playClickSound();
                  onOpenMusicPlayer();
                }}
                className="px-2.5 py-1 bg-sky-950/80 hover:bg-sky-900 border border-sky-500/60 text-sky-200 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <Music className="w-3 h-3 text-sky-400" />
                <span>{isEn ? 'Lo-Fi BGM' : '🎵 咖啡廳音樂'}</span>
              </button>
            )}

            {onOpenAIBrista && (
              <button
                onClick={() => {
                  sound.playClickSound();
                  onOpenAIBrista();
                }}
                className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <Bot className="w-3 h-3 text-emerald-400" />
                <span>{isEn ? 'Chat Barista' : '🤖 與店員老鐵聊天'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Coffee Menu Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <div className="text-xs font-bold text-amber-200/90 font-minecraft uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Specialty Artisan Brews (Click to Sip & Buff)' : '工坊手沖特調咖啡單（點擊享用並獲得強效 Buff）'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COFFEE_BUFF_MENU.map((item) => {
              const affordable = coins >= item.costCoins;
              const isJustSipped = justSippedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isJustSipped
                      ? 'bg-amber-950/80 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-[1.02]'
                      : 'bg-[#29221b] border-amber-900/70 hover:border-amber-600/90'
                  }`}
                >
                  <div>
                    {/* Item header */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl filter drop-shadow">{item.icon}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-white font-minecraft">
                            {isEn ? item.nameEn : item.nameZh}
                          </div>
                          <span
                            className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full mt-0.5"
                            style={{ backgroundColor: `${item.accentColor}25`, color: item.accentColor, border: `1px solid ${item.accentColor}50` }}
                          >
                            {isEn ? item.badgeEn : item.badgeZh}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 leading-relaxed">
                      {isEn ? item.descEn : item.descZh}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-amber-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-mono text-xs">
                      <span className="text-amber-400 font-bold">🪙 {item.costCoins}</span>
                      <span className="text-zinc-500 text-[10px]">• {item.durationSec}s</span>
                    </div>

                    <button
                      disabled={!affordable}
                      onClick={() => handleOrderCoffee(item)}
                      className={`px-3 py-1.5 rounded-lg font-minecraft text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                        affordable
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black border border-amber-300 shadow-md'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isJustSipped ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Sipped!' : '享用中!'}</span>
                        </>
                      ) : (
                        <>
                          <Coffee className="w-3.5 h-3.5" />
                          <span>{isEn ? `Sip (${item.costCoins}🪙)` : `點咖啡 (${item.costCoins}幣)`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cozy Idle Atmosphere Tip */}
          <div className="p-3 bg-amber-950/40 border border-amber-700/40 rounded-xl text-xs text-amber-200/90 flex items-center gap-2.5">
            <span className="text-xl">☕</span>
            <span>
              {isEn
                ? 'Tip: Coffee buffs remain active even when returning to the quarry or overworld! Enjoy relaxing moments between mining runs.'
                : '溫馨提示：點餐後獲得的咖啡 Buff 將隨身生效（採礦場與大地圖皆享有加成）！一邊喝咖啡一邊掛機，效率倍增！'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
