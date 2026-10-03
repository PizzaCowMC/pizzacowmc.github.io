import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Zap,
  Coins,
  Package,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export interface DailyDataPoint {
  date: string;
  label: string;
  blocks: number;
  coins: number;
}

interface AutoMinerAnalyticsChartProps {
  isEn: boolean;
  unlockedCount: number;
  totalModules: number;
  speedReductionSec: number;
  bonusBlocksPerGather: number;
  fortuneBonusPct: number;
  bonusCoinsPerGather: number;
  critChancePct: number;
  totalAutoMinedBlocks: number;
  totalCoinsHarvested: number;
  dailyHistory?: Record<string, { blocks: number; coins: number }>;
}

export const AutoMinerAnalyticsChart: React.FC<AutoMinerAnalyticsChartProps> = ({
  isEn,
  unlockedCount,
  totalModules,
  speedReductionSec,
  bonusBlocksPerGather,
  fortuneBonusPct,
  bonusCoinsPerGather,
  critChancePct,
  totalAutoMinedBlocks,
  totalCoinsHarvested,
  dailyHistory = {}
}) => {
  const [activeMetric, setActiveMetric] = useState<'blocks' | 'coins' | 'efficiency'>('blocks');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute live current stats
  const cycleInterval = Math.max(1.0, 4.5 - speedReductionSec);
  const cyclesPerHour = Math.round(3600 / cycleInterval);
  const avgBlocksPerCycle = (1 + bonusBlocksPerGather) * (1 + fortuneBonusPct / 100) + (critChancePct / 100);
  const estimatedBlocksPerHour = Math.round(cyclesPerHour * avgBlocksPerCycle);
  const estimatedBlocksPerDay = estimatedBlocksPerHour * 24;
  const estimatedCoinsPerDay = cyclesPerHour * 24 * bonusCoinsPerGather;

  // Investment Tier calculation
  const investmentTier = useMemo(() => {
    if (unlockedCount >= 90) return { rank: 'EX', labelZh: '匠神百鍊 • 終極至尊', labelEn: 'Godsmith Transcendent', color: '#f59e0b' };
    if (unlockedCount >= 60) return { rank: 'SSS', labelZh: '超頻神域 • 極限採掘', labelEn: 'Overclocked Celestial', color: '#a855f7' };
    if (unlockedCount >= 40) return { rank: 'SS', labelZh: '紅石重工 • 高效流轉', labelEn: 'Industrial Apex', color: '#3b82f6' };
    if (unlockedCount >= 20) return { rank: 'S', labelZh: '自動化先驅 • 穩健成長', labelEn: 'Automation Pioneer', color: '#10b981' };
    if (unlockedCount >= 5) return { rank: 'A', labelZh: '基礎機械 • 產能起步', labelEn: 'Mechanical Starter', color: '#eab308' };
    return { rank: 'B', labelZh: '手工改裝 • 待升級', labelEn: 'Prototype Golem', color: '#9ca3af' };
  }, [unlockedCount]);

  // Generate 7-day data points combining recorded history and realistic progressive progression
  const weekData: DailyDataPoint[] = useMemo(() => {
    const points: DailyDataPoint[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const dayName = isEn
        ? d.toLocaleDateString('en-US', { weekday: 'short' })
        : ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][d.getDay()];

      const recorded = dailyHistory[dateKey];

      // Simulated progressive baseline ramp if earlier days not fully recorded
      const progressionFactor = 0.55 + (6 - i) * 0.075;
      const baseDailyBlocks = Math.max(12, Math.round((totalAutoMinedBlocks / Math.max(1, unlockedCount * 0.5 + 3)) * progressionFactor));
      const baseDailyCoins = Math.max(0, Math.round(baseDailyBlocks * bonusCoinsPerGather * 0.8));

      const blocks = recorded ? recorded.blocks : (i === 0 ? Math.max(baseDailyBlocks, Math.round(totalAutoMinedBlocks * 0.25)) : baseDailyBlocks);
      const coins = recorded ? recorded.coins : (i === 0 ? Math.max(baseDailyCoins, Math.round(totalCoinsHarvested * 0.25)) : baseDailyCoins);

      points.push({
        date: dateKey,
        label: i === 0 ? (isEn ? 'Today' : '今日') : dayName,
        blocks,
        coins
      });
    }

    return points;
  }, [dailyHistory, isEn, totalAutoMinedBlocks, unlockedCount, bonusCoinsPerGather, totalCoinsHarvested]);

  // Max values for scale
  const maxBlocks = Math.max(10, ...weekData.map(d => d.blocks));
  const maxCoins = Math.max(10, ...weekData.map(d => d.coins));

  return (
    <div className="bg-[#171310] border-2 border-amber-900/60 rounded-xl p-3 sm:p-4 text-white shadow-xl space-y-3 font-sans">
      {/* Top Header with title and metric toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-amber-950/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-base border border-amber-500 shadow">
            📈
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-300 font-minecraft flex items-center gap-2">
              <span>{isEn ? 'Auto-Miner Production Analytics' : '自動採礦魔像每日產量趨勢圖表'}</span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.2 rounded border font-minecraft"
                style={{ backgroundColor: `${investmentTier.color}25`, color: investmentTier.color, borderColor: investmentTier.color }}
              >
                {investmentTier.rank} • {isEn ? investmentTier.labelEn : investmentTier.labelZh}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              {isEn
                ? 'Assess module investment efficiency & daily automated harvest yield'
                : '視覺化評估 100 種模項投資效益，掌握每日自動化開採與分紅趨勢'}
            </p>
          </div>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveMetric('blocks');
            }}
            className={`px-2.5 py-1 rounded font-minecraft font-bold cursor-pointer transition-all flex items-center gap-1 ${
              activeMetric === 'blocks'
                ? 'bg-cyan-600 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-3 h-3" />
            <span>{isEn ? 'Blocks Trend' : '方塊開採趨勢'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveMetric('coins');
            }}
            className={`px-2.5 py-1 rounded font-minecraft font-bold cursor-pointer transition-all flex items-center gap-1 ${
              activeMetric === 'coins'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Coins className="w-3 h-3" />
            <span>{isEn ? 'Dividends Trend' : '分紅金幣趨勢'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveMetric('efficiency');
            }}
            className={`px-2.5 py-1 rounded font-minecraft font-bold cursor-pointer transition-all flex items-center gap-1 ${
              activeMetric === 'efficiency'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{isEn ? 'ROI & Stats' : '投資回報評估'}</span>
          </button>
        </div>
      </div>

      {/* Main Chart Body */}
      {activeMetric !== 'efficiency' ? (
        <div className="space-y-3">
          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-black/50 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-minecraft">{isEn ? 'Total Gathered' : '累計自動產出'}</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">
                {activeMetric === 'blocks' ? `${totalAutoMinedBlocks.toLocaleString()} 塊` : `${totalCoinsHarvested.toLocaleString()} 幣`}
              </span>
            </div>

            <div className="bg-black/50 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-minecraft">{isEn ? 'Est. Daily Output' : '預估每日產量'}</span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                ~{activeMetric === 'blocks' ? `${estimatedBlocksPerDay.toLocaleString()} 塊/天` : `${estimatedCoinsPerDay.toLocaleString()} 幣/天`}
              </span>
            </div>

            <div className="bg-black/50 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-minecraft">{isEn ? 'Cycle Speed' : '採集頻率'}</span>
              <span className="font-mono font-bold text-emerald-300 text-sm">
                {cycleInterval.toFixed(1)}s / 次
              </span>
            </div>

            <div className="bg-black/50 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-minecraft">{isEn ? 'Module Overclock' : '模組超頻加成'}</span>
              <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                <span>+{Math.round((unlockedCount / Math.max(1, totalModules)) * 100 * 2.5)}%</span>
              </span>
            </div>
          </div>

          {/* SVG Bar Chart Visualization with Hover Tooltip */}
          <div className="bg-black/60 p-3 sm:p-4 rounded-xl border border-amber-950 relative overflow-hidden">
            {/* Background gridlines */}
            <div className="absolute inset-x-4 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-15">
              <div className="border-b border-dashed border-zinc-500 w-full" />
              <div className="border-b border-dashed border-zinc-500 w-full" />
              <div className="border-b border-dashed border-zinc-500 w-full" />
            </div>

            {/* Bars container */}
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 pt-6 pb-2 px-1 relative z-10">
              {weekData.map((d, idx) => {
                const val = activeMetric === 'blocks' ? d.blocks : d.coins;
                const maxVal = activeMetric === 'blocks' ? maxBlocks : maxCoins;
                const heightPct = Math.max(8, Math.round((val / maxVal) * 100));
                const isHovered = hoveredIndex === idx;
                const isToday = idx === weekData.length - 1;

                return (
                  <div
                    key={d.date}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Value Badge above bar */}
                    <div className={`text-[10px] font-mono font-bold mb-1 transition-all ${
                      isHovered ? 'text-amber-300 scale-110' : 'text-zinc-400'
                    }`}>
                      {val > 999 ? `${(val / 1000).toFixed(1)}k` : val}
                    </div>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[42px] bg-zinc-900 rounded-t-lg overflow-hidden p-0.5 border border-zinc-800 flex items-end h-full">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          activeMetric === 'blocks'
                            ? (isToday
                                ? 'bg-gradient-to-t from-cyan-600 via-sky-400 to-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                                : 'bg-gradient-to-t from-cyan-900 to-cyan-500 group-hover:from-cyan-700 group-hover:to-cyan-400')
                            : (isToday
                                ? 'bg-gradient-to-t from-amber-600 via-yellow-400 to-yellow-200 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                                : 'bg-gradient-to-t from-amber-900 to-amber-500 group-hover:from-amber-700 group-hover:to-amber-400')
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    {/* Date label */}
                    <span className={`text-[10px] font-minecraft mt-1.5 whitespace-nowrap transition-colors ${
                      isToday ? 'text-amber-300 font-bold' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}>
                      {d.label}
                    </span>

                    {/* Hover Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-zinc-950 border border-amber-500 px-3 py-1.5 rounded-lg shadow-2xl z-30 pointer-events-none text-xs text-center animate-in fade-in">
                        <div className="font-minecraft text-amber-300 font-bold">{d.date} ({d.label})</div>
                        <div className="font-mono text-white mt-0.5 flex items-center justify-center gap-2">
                          <span className="text-cyan-300">⛏️ {d.blocks.toLocaleString()} 塊</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-amber-400">🪙 +{d.coins.toLocaleString()} 幣</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Efficiency & ROI Breakdown Tab */
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Speed reduction ROI */}
            <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="flex items-center gap-1 font-minecraft">⏱️ {isEn ? 'Cycle Overclock' : '採集頻率超頻'}</span>
                <span className="text-emerald-400 font-bold font-mono">
                  -{speedReductionSec.toFixed(1)}s
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-700">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (speedReductionSec / 3.5) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                {isEn ? `Current interval: ${cycleInterval.toFixed(1)}s (Cap: 1.0s)` : `當前間隔：${cycleInterval.toFixed(1)}秒 (極限1.0秒)`}
              </div>
            </div>

            {/* Yield Multiplier */}
            <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="flex items-center gap-1 font-minecraft">⛏️ {isEn ? 'Yield per Tick' : '單次採掘增幅'}</span>
                <span className="text-amber-400 font-bold font-mono">
                  +{bonusBlocksPerGather} 塊
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-700">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, ((1 + bonusBlocksPerGather) / 10) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                {isEn ? `Base yield: ${1 + bonusBlocksPerGather} blocks/tick` : `基礎產能：每次開採 ${1 + bonusBlocksPerGather} 塊`}
              </div>
            </div>

            {/* Fortune & Dividends */}
            <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="flex items-center gap-1 font-minecraft">💎 {isEn ? 'Fortune Double' : '幸運雙倍機率'}</span>
                <span className="text-cyan-400 font-bold font-mono">
                  +{fortuneBonusPct}%
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-700">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, fortuneBonusPct)}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                {isEn ? `Coin dividend: +${bonusCoinsPerGather} per cycle` : `開採分紅：每次 +${bonusCoinsPerGather} 遊戲幣`}
              </div>
            </div>
          </div>

          {/* Module Investment Strategy Advice */}
          <div className="p-2.5 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black rounded-xl border border-amber-800/60 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
              <div className="text-[11px] text-zinc-300">
                <strong className="text-amber-300">{isEn ? 'Blacksmith Forge Recommendation: ' : '鐵匠鋪投資效益診斷：'}</strong>
                {speedReductionSec < 2.0
                  ? (isEn ? 'Prioritize Power Cores (🔋) to speed up golem cycles to max rate.' : '優先鍛造【🔋 動力核心】系列，將開採頻率加速至極限 1.0 秒/次！')
                  : bonusBlocksPerGather < 3
                  ? (isEn ? 'Prioritize Alloy Drills (⛏️) to amplify blocks mined per cycle.' : '建議鍛造【⛏️ 合金鑽頭】系列，大幅提升單次挖掘的方塊產量！')
                  : (isEn ? 'Awaken Godsmith Relics (👑) to maximize supreme all-around stats!' : '全方位解鎖【👑 匠神神兵】與符文，覺醒終極自動化開採傳奇！')}
              </div>
            </div>
            <div className="font-mono text-[10px] bg-black/60 px-2 py-1 rounded text-emerald-400 border border-emerald-700/60 shrink-0 font-bold">
              {unlockedCount} / {totalModules} ({Math.round((unlockedCount / totalModules) * 100)}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
