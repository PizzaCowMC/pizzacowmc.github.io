import React, { useState, useMemo } from 'react';
import {
  BLACKSMITH_MODULES,
  BlacksmithModule,
  calculateBlacksmithBonuses,
  getModuleRedstoneCost,
  getOreDisplayInfo
} from '../data/blacksmithData';
import { AutoMinerAnalyticsChart } from './AutoMinerAnalyticsChart';
import { sound } from '../utils/soundEffects';
import {
  Hammer,
  Sparkles,
  X,
  Check,
  Lock,
  Coins,
  Zap,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Flame,
  Shield,
  Award,
  BookOpen,
  HelpCircle,
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';

interface BlacksmithModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  coins: number;
  inventory: Record<string, number>;
  unlockedModuleIds: string[];
  onForgeModule: (moduleId: string) => void;
  onForgeAllAffordable: () => void;
  hasAutoMiner: boolean;
  onActivateAutoMiner: () => void;
  totalAutoMinedBlocks?: number;
  totalCoinsHarvested?: number;
  dailyHistory?: Record<string, { blocks: number; coins: number }>;
}

type FilterCategory = 'all' | 'core' | 'drill' | 'filter' | 'rune' | 'overclock' | 'radar' | 'legendary';
type FilterStatus = 'all' | 'unlocked' | 'affordable' | 'locked';

export const BlacksmithModal: React.FC<BlacksmithModalProps> = ({
  isOpen,
  onClose,
  isEn,
  coins,
  inventory,
  unlockedModuleIds,
  onForgeModule,
  onForgeAllAffordable,
  hasAutoMiner,
  onActivateAutoMiner,
  totalAutoMinedBlocks = 0,
  totalCoinsHarvested = 0,
  dailyHistory = {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const bonuses = useMemo(() => {
    return calculateBlacksmithBonuses(unlockedModuleIds);
  }, [unlockedModuleIds]);

  // Current collection percentage
  const totalCount = BLACKSMITH_MODULES.length; // 100
  const unlockedCount = unlockedModuleIds.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  // Check if player can afford a module (加入紅石，需要一定量才能升級)
  const canAfford = (mod: BlacksmithModule) => {
    if (coins < mod.costCoins) return false;
    const requiredRedstone = getModuleRedstoneCost(mod);
    const userRedstone = inventory['redstone_ore'] || 0;
    if (userRedstone < requiredRedstone) return false;

    if (mod.costOre && mod.costOre.oreId !== 'redstone_ore') {
      const currentOre = inventory[mod.costOre.oreId] || 0;
      if (currentOre < mod.costOre.amount) return false;
    }
    return true;
  };

  // Filter modules
  const filteredModules = useMemo(() => {
    return BLACKSMITH_MODULES.filter(mod => {
      // Category filter
      if (selectedCategory !== 'all' && mod.category !== selectedCategory) {
        return false;
      }
      // Status filter
      const isUnlocked = unlockedModuleIds.includes(mod.id);
      if (filterStatus === 'unlocked' && !isUnlocked) return false;
      if (filterStatus === 'affordable' && (isUnlocked || !canAfford(mod))) return false;
      if (filterStatus === 'locked' && isUnlocked) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNameZh = mod.nameZh.toLowerCase().includes(query);
        const matchNameEn = mod.nameEn.toLowerCase().includes(query);
        const matchNumber = String(mod.number).includes(query);
        const matchDesc = mod.bonusDescZh.toLowerCase().includes(query) || mod.bonusDescEn.toLowerCase().includes(query);
        if (!matchNameZh && !matchNameEn && !matchNumber && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, filterStatus, searchQuery, unlockedModuleIds, coins, inventory]);

  const affordableCount = useMemo(() => {
    return BLACKSMITH_MODULES.filter(m => !unlockedModuleIds.includes(m.id) && canAfford(m)).length;
  }, [unlockedModuleIds, coins, inventory]);

  if (!isOpen) return null;

  const currentGatherInterval = Math.max(1.5, 5.0 - bonuses.speedReductionSec).toFixed(1);
  const currentBlocksPerCycle = 1 + bonuses.bonusBlocksPerGather;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-[#1c1714] border-4 border-amber-900 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(245,158,11,0.1)] overflow-hidden text-white">
        
        {/* ================= 1. HEADER ================= */}
        <div className="p-4 bg-[#14100d] border-b-4 border-amber-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 via-amber-900 to-black border-2 border-amber-500 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              🔨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-amber-300 font-minecraft tracking-wider flex items-center gap-2">
                  <span>{isEn ? 'Redstone Blacksmith & Forge' : '紅石鐵匠鋪 • 自動採集升級工坊'}</span>
                  <span className="text-[10px] bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-700">
                    {isEn ? '100 MODULES' : '100 種收集'}
                  </span>
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                {isEn
                  ? 'Forge and collect 100 specialized automation modules using mined ores & coins'
                  : '使用開採的礦石與金幣鍛造升級，全方位強化紅石自動採集魔像！'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Coin preview */}
            <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-mono font-bold text-amber-300 shadow">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins.toLocaleString()}</span>
            </div>

            {/* Quick Redstone preview (加入紅石持有量顯示) */}
            <div className="flex items-center gap-1.5 bg-red-950/70 px-3 py-1.5 rounded-xl border border-red-700/80 text-xs font-mono font-bold text-red-300 shadow">
              <span className="text-sm">🔴</span>
              <span>{isEn ? 'Redstone:' : '紅石:'}</span>
              <span className="text-white font-black">{(inventory['redstone_ore'] || 0).toLocaleString()}</span>
            </div>

            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= 2. LIVE FORGE DASHBOARD & COLLECTION PROGRESS ================= */}
        <div className="bg-gradient-to-b from-[#241c17] to-[#1a1411] px-5 py-3.5 border-b-2 border-amber-950 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: 100 Collection Progress Bar */}
          <div className="w-full md:w-1/2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-minecraft">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>{isEn ? 'Forge Collection Progress' : '鐵匠鋪 100 種模項收集進度'}</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {unlockedCount} / {totalCount} ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-3.5 bg-zinc-950 border-2 border-amber-700/80 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                style={{ width: `${Math.max(2, progressPct)}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
              <span>{isEn ? 'Collect all 100 to forge Crown of Godsmiths' : '集滿 100 種即可覺醒「匠神終極百鍊天成之冠」！'}</span>
              {affordableCount > 0 && (
                <span className="text-amber-400 font-bold">
                  {isEn ? `${affordableCount} ready to forge!` : `有 ${affordableCount} 種材料已就緒！`}
                </span>
              )}
            </div>
          </div>

          {/* Right: Live Auto-Miner Golem Stat Monitors */}
          <div className="w-full md:w-auto flex-1 flex flex-wrap items-center justify-end gap-2 text-xs">
            {/* Golem Online / Deploy status */}
            {hasAutoMiner ? (
              <div className="bg-emerald-950/80 border border-emerald-500/80 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
                <span className="text-lg animate-bounce">🤖</span>
                <div>
                  <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Golem Status' : '採集魔像'}</div>
                  <div className="font-mono font-bold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>{isEn ? 'ONLINE' : '運轉中'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  sound.playUpgradeSound();
                  onActivateAutoMiner();
                }}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-minecraft text-white cursor-pointer animate-bounce shadow"
              >
                <span className="text-lg">🤖</span>
                <div className="text-left">
                  <div className="text-[10px] text-amber-200">{isEn ? 'Deploy Golem' : '未啟動魔像'}</div>
                  <div className="font-bold">{isEn ? 'Activate Now' : '點擊立即啟動'}</div>
                </div>
              </button>
            )}

            <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-amber-800/60 flex items-center gap-2">
              <span className="text-lg">⏱️</span>
              <div>
                <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Cycle Speed' : '採集頻率'}</div>
                <div className="font-mono font-bold text-cyan-300">{currentGatherInterval}s / 次</div>
              </div>
            </div>

            <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-amber-800/60 flex items-center gap-2">
              <span className="text-lg">⛏️</span>
              <div>
                <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Yield per Tick' : '單次採掘量'}</div>
                <div className="font-mono font-bold text-amber-300">+{currentBlocksPerCycle} 塊</div>
              </div>
            </div>

            <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-amber-800/60 flex items-center gap-2">
              <span className="text-lg">💎</span>
              <div>
                <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Fortune Bonus' : '幸運雙倍'}</div>
                <div className="font-mono font-bold text-emerald-300">+{bonuses.fortuneBonusPct}%</div>
              </div>
            </div>

            {bonuses.bonusCoinsPerGather > 0 && (
              <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-amber-800/60 flex items-center gap-2">
                <span className="text-lg">🪙</span>
                <div>
                  <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Dividend' : '開採分紅'}</div>
                  <div className="font-mono font-bold text-yellow-300">+{bonuses.bonusCoinsPerGather}</div>
                </div>
              </div>
            )}

            {totalAutoMinedBlocks > 0 && (
              <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-amber-800/60 flex items-center gap-2">
                <span className="text-lg">⛏️</span>
                <div>
                  <div className="text-[10px] text-zinc-400 font-minecraft">{isEn ? 'Total Auto-Mined' : '累計自動產出'}</div>
                  <div className="font-mono font-bold text-cyan-300">{totalAutoMinedBlocks.toLocaleString()} 塊</div>
                </div>
              </div>
            )}

            {/* Guide Button: 如何蒐集 */}
            <button
              onClick={() => {
                sound.playClickSound();
                setShowGuide(prev => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 font-minecraft font-black text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow active:scale-95 ${
                showGuide
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-sky-300 border-sky-800'
              }`}
              title={isEn ? 'How to Collect Modules & Materials Guide' : '如何蒐集模項與礦石攻略指南'}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'Collection Guide' : '如何蒐集'}</span>
              <span className="text-[10px] bg-black/60 px-1.5 py-0.2 rounded font-mono text-white">
                {showGuide ? (isEn ? 'Hide' : '收合') : (isEn ? 'Guide' : '攻略')}
              </span>
            </button>

            {/* Toggle Analytics Chart Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setShowAnalytics(prev => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 font-minecraft font-black text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow active:scale-95 ${
                showAnalytics
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-amber-800'
              }`}
              title={isEn ? 'Toggle Auto-Miner Production Trend Chart' : '展開 / 收合自動採礦魔像每日產量趨勢圖表'}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Analytics' : '產量趨勢圖表'}</span>
              <span className="text-[10px] bg-black/60 px-1.5 py-0.2 rounded font-mono text-white">
                {showAnalytics ? (isEn ? 'Hide' : '收合') : (isEn ? 'Show' : '展開')}
              </span>
            </button>

            {/* Quick Bulk Forge Button */}
            {affordableCount > 0 && (
              <button
                onClick={() => {
                  sound.playUpgradeSound();
                  onForgeAllAffordable();
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer font-minecraft animate-pulse"
              >
                <span>🔨 {isEn ? `Forge All (${affordableCount})` : `一鍵鍛造 (${affordableCount}種)`}</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= 2.4 HOW TO COLLECT GUIDE (如何蒐集模項攻略) ================= */}
        {showGuide && (
          <div className="px-4 py-3 bg-[#11161f] border-b-2 border-sky-900/80 animate-in fade-in duration-200">
            <div className="bg-[#0b1017] border-2 border-sky-600/70 rounded-xl p-3 sm:p-4 text-white shadow-xl space-y-3 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-sky-900/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center text-lg border border-sky-400 shadow">
                    📖
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-sky-300 font-minecraft">
                      {isEn ? 'Guide: How to Collect 100 Blacksmith Modules' : '📖 鐵匠鋪 100 種模項與材料蒐集全攻略指南'}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {isEn
                        ? 'Master ore distribution across strata, rapid gold gathering, and auto-miner snowballing'
                        : '掌握採礦地層礦石分佈、金幣速刷途徑、自動採集魔像滾雪球與一鍵鍛造技巧'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                {/* 1. 地層礦石對照 */}
                <div className="bg-black/50 p-2.5 rounded-lg border border-sky-900/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-minecraft font-bold">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>{isEn ? '1. Quarry Ore Locations' : '1. 採礦場地層礦石分佈'}</span>
                  </div>
                  <ul className="text-[11px] text-zinc-300 space-y-1 list-disc list-inside">
                    <li><strong className="text-amber-200">泥土/沙石層:</strong> 煤炭、泥土、黏土</li>
                    <li><strong className="text-cyan-200">淺層岩:</strong> 原石、鐵礦石、銅礦</li>
                    <li><strong className="text-emerald-200">深板岩:</strong> 金礦、紅石礦、青金石</li>
                    <li><strong className="text-purple-200">熔岩/黑曜石:</strong> 鑽石、綠寶石、黑曜石</li>
                    <li><strong className="text-rose-300">地獄/末地:</strong> 遠古遺骸、獄髓合金</li>
                  </ul>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {isEn ? 'Switch stratum on map to mine deeper ores!' : '💡 點擊採礦場上方地層按鈕即可切換開採深層礦物！'}
                  </p>
                </div>

                {/* 2. 金幣速刷管道 */}
                <div className="bg-black/50 p-2.5 rounded-lg border border-sky-900/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-yellow-300 font-minecraft font-bold">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>{isEn ? '2. Rapid Coin Income' : '2. 金幣快速獲取 4 途徑'}</span>
                  </div>
                  <ul className="text-[11px] text-zinc-300 space-y-1 list-disc list-inside">
                    <li><strong className="text-yellow-200">鏟子挖沙土:</strong> 25% 額外掉落金幣</li>
                    <li><strong className="text-rose-300">討伐怪獸:</strong> 隨機遭遇怪獸，持劍討伐賺 40~300+ 幣</li>
                    <li><strong className="text-sky-200">交易所變現:</strong> 背包多餘原石直接賣出</li>
                    <li><strong className="text-amber-300">咖啡廳營運:</strong> 持續產生離線被動營業金幣</li>
                  </ul>
                </div>

                {/* 3. 魔像滾雪球 */}
                <div className="bg-black/50 p-2.5 rounded-lg border border-sky-900/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-minecraft font-bold">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? '3. Auto-Miner Snowball' : '3. 魔像自動採掘滾雪球'}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    {isEn
                      ? 'Deploy the Auto-Miner Golem! It continuously extracts blocks from your selected stratum while you play.'
                      : '點擊「啟動魔像」後，魔像會在背景依照你選定的地層持續開採。'}
                  </p>
                  <p className="text-[11px] text-emerald-200 font-mono">
                    {isEn
                      ? 'Every forged module stacks: faster speed (down to 1.0s), higher yield, & coin dividends!'
                      : '⚡ 收集越多模項，冷卻極速降至 1.0 秒、產量暴增、分紅金幣倍增！'}
                  </p>
                </div>

                {/* 4. 一鍵鍛造與成就 */}
                <div className="bg-black/50 p-2.5 rounded-lg border border-sky-900/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-300 font-minecraft font-bold">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{isEn ? '4. One-Click Bulk Forge' : '4. 一鍵鍛造與 100 達成'}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    {isEn
                      ? 'When materials and coins are met, the "Forge All" button lights up for instant bulk crafting.'
                      : '滿足任一模項的材料時，右上角的【一鍵鍛造】會發光並顯示數量，點擊即可批量完成升級！'}
                  </p>
                  <div className="bg-purple-950/60 p-1.5 rounded border border-purple-500/50 text-[10px] text-amber-200">
                    👑 {isEn ? 'Collect all 100 to forge the ultimate Crown of Godsmiths!' : '集齊 100 種即可解鎖終極【匠神百鍊天成之冠】！'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2.5 AUTO-MINER YIELD TRENDS & ROI CHART ================= */}
        {showAnalytics && (
          <div className="px-4 py-2 bg-[#120e0c] border-b-2 border-amber-950/80 animate-in fade-in duration-200">
            <AutoMinerAnalyticsChart
              isEn={isEn}
              unlockedCount={unlockedCount}
              totalModules={totalCount}
              speedReductionSec={bonuses.speedReductionSec}
              bonusBlocksPerGather={bonuses.bonusBlocksPerGather}
              fortuneBonusPct={bonuses.fortuneBonusPct}
              bonusCoinsPerGather={bonuses.bonusCoinsPerGather}
              critChancePct={bonuses.critChancePct}
              totalAutoMinedBlocks={totalAutoMinedBlocks}
              totalCoinsHarvested={totalCoinsHarvested}
              dailyHistory={dailyHistory}
            />
          </div>
        )}

        {/* ================= 3. FILTER TABS & SEARCH ================= */}
        <div className="p-3 bg-[#171310] border-b-2 border-amber-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-full">
            {[
              { id: 'all', labelZh: '全部 (100)', labelEn: 'All (100)' },
              { id: 'core', labelZh: '🔋 動力核心 (15)', labelEn: '🔋 Core (15)' },
              { id: 'drill', labelZh: '⛏️ 合金鑽頭 (15)', labelEn: '⛏️ Drill (15)' },
              { id: 'filter', labelZh: '🪣 分選漏斗 (15)', labelEn: '🪣 Filter (15)' },
              { id: 'rune', labelZh: '📜 遠古符文 (15)', labelEn: '📜 Rune (15)' },
              { id: 'overclock', labelZh: '⚙️ 機械齒輪 (15)', labelEn: '⚙️ Gear (15)' },
              { id: 'radar', labelZh: '📡 探測雷達 (15)', labelEn: '📡 Radar (15)' },
              { id: 'legendary', labelZh: '👑 匠神神兵 (10)', labelEn: '👑 Godsmith (10)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClickSound();
                  setSelectedCategory(tab.id as FilterCategory);
                }}
                className={`px-2.5 py-1.5 rounded-lg border font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-amber-600 border-amber-300 text-black font-minecraft shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {isEn ? tab.labelEn : tab.labelZh}
              </button>
            ))}
          </div>

          {/* Search bar & status filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search #, name, stats...' : '搜尋序號、名稱、效果...'}
                className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-minecraft"
              />
            </div>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as FilterStatus)}
              className="bg-black/60 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-minecraft focus:outline-none cursor-pointer"
            >
              <option value="all">{isEn ? 'All Status' : '全部狀態'}</option>
              <option value="unlocked">{isEn ? 'Collected' : '已收集'}</option>
              <option value="affordable">{isEn ? 'Ready to Forge' : '可鍛造'}</option>
              <option value="locked">{isEn ? 'Locked' : '未解鎖'}</option>
            </select>
          </div>
        </div>

        {/* ================= 4. 100 MODULE CARDS GRID ================= */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredModules.map(mod => {
              const isUnlocked = unlockedModuleIds.includes(mod.id);
              const affordable = canAfford(mod);
              const requiredRedstone = getModuleRedstoneCost(mod);
              const userRedstone = inventory['redstone_ore'] || 0;
              const hasSecondaryOre = !!(mod.costOre && mod.costOre.oreId !== 'redstone_ore');
              const userSecondaryOre = hasSecondaryOre ? (inventory[mod.costOre!.oreId] || 0) : 0;
              const secondaryInfo = hasSecondaryOre ? getOreDisplayInfo(mod.costOre!.oreId) : null;

              return (
                <div
                  key={mod.id}
                  className={`p-3.5 rounded-xl border-2 flex flex-col justify-between transition-all relative overflow-hidden min-h-[210px] ${
                    isUnlocked
                      ? 'bg-[#18231c] border-emerald-500/80 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]'
                      : affordable
                      ? 'bg-[#221c17] border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)] hover:scale-[1.01]'
                      : 'bg-[#181513] border-zinc-800 opacity-80'
                  }`}
                >
                  <div>
                    {/* Top card info */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl shrink-0 shadow"
                          style={{
                            backgroundColor: `${mod.rarityColor}20`,
                            borderColor: mod.rarityColor
                          }}
                        >
                          {mod.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-zinc-500">
                              #{String(mod.number).padStart(3, '0')}
                            </span>
                            <span
                              className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded font-minecraft"
                              style={{
                                backgroundColor: `${mod.rarityColor}25`,
                                color: mod.rarityColor
                              }}
                            >
                              {mod.rarity.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-white font-minecraft truncate drop-shadow">
                            {isEn ? mod.nameEn : mod.nameZh}
                          </h4>
                        </div>
                      </div>

                      {isUnlocked && (
                        <span className="text-[10px] font-minecraft font-black text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500 shrink-0 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{isEn ? 'ACTIVE' : '已裝載'}</span>
                        </span>
                      )}
                    </div>

                    {/* Stat Bonus Highlight */}
                    <div className="bg-black/50 px-2.5 py-1.5 rounded-lg border border-zinc-800 mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300 font-minecraft">
                        ✨ {isEn ? mod.bonusDescEn : mod.bonusDescZh}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono">
                        {isEn ? mod.categoryEn : mod.categoryZh}
                      </span>
                    </div>

                    {/* Flavor text */}
                    <p className="text-[11px] text-zinc-400 mb-3 line-clamp-2 italic">
                      "{isEn ? mod.flavorEn : mod.flavorZh}"
                    </p>
                  </div>

                  {/* Bottom: Forge Requirement & Action Button */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    {/* Costs - Completely removed cardboard box emoji 📦! */}
                    <div className="flex items-center gap-1.5 text-xs flex-wrap">
                      {/* Coins */}
                      <span
                        className={`font-mono font-bold flex items-center gap-1 ${
                          coins >= mod.costCoins ? 'text-amber-300' : 'text-rose-400'
                        }`}
                        title={isEn ? `Coins: ${mod.costCoins}` : `金幣: ${mod.costCoins}`}
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>{mod.costCoins}</span>
                      </span>

                      <span className="text-zinc-600">•</span>

                      {/* Redstone: 加入紅石，需要一定量才能升級 */}
                      <span
                        className={`text-[11px] font-mono font-bold flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                          userRedstone >= requiredRedstone
                            ? 'bg-red-950/60 border-red-600/80 text-red-200'
                            : 'bg-zinc-900 border-zinc-700 text-rose-400'
                        }`}
                        title={isEn ? `Requires ${requiredRedstone} Redstone` : `需要 ${requiredRedstone} 顆紅石`}
                      >
                        <span>🔴</span>
                        <span>{isEn ? 'Redstone' : '紅石'} {userRedstone}/{requiredRedstone}</span>
                      </span>

                      {/* Secondary Mineral (NO BOX EMOJI!) */}
                      {hasSecondaryOre && secondaryInfo && (
                        <>
                          <span className="text-zinc-600">•</span>
                          <span
                            className={`text-[11px] font-mono flex items-center gap-1 ${
                              userSecondaryOre >= mod.costOre!.amount ? 'text-cyan-300' : 'text-rose-400'
                            }`}
                            title={isEn ? `${secondaryInfo.nameEn}: ${mod.costOre!.amount}` : `${secondaryInfo.nameZh}: ${mod.costOre!.amount}`}
                          >
                            <span>{secondaryInfo.icon}</span>
                            <span>{isEn ? secondaryInfo.nameEn : secondaryInfo.nameZh} {userSecondaryOre}/{mod.costOre!.amount}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Forge Button */}
                    {isUnlocked ? (
                      <span className="text-[11px] text-emerald-400 font-minecraft font-bold">
                        {isEn ? '✓ Collected' : '✓ 已納入收藏'}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (affordable) {
                            sound.playUpgradeSound();
                            onForgeModule(mod.id);
                          } else {
                            sound.playClickSound();
                          }
                        }}
                        disabled={!affordable}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black font-minecraft border-2 shadow flex items-center gap-1 transition-all ${
                          affordable
                            ? 'bg-amber-500 hover:bg-amber-400 text-black border-black cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Hammer className="w-3 h-3" />
                        <span>{isEn ? 'Forge' : '鍛造模項'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 5. FOOTER ================= */}
        <div className="p-3.5 bg-[#14100d] border-t-2 border-amber-950 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>
              {isEn
                ? 'All 100 modules stack bonuses automatically to power the Redstone Auto-Collector'
                : '100 種模項鍛造後全數永久累加生效，紅石自動採掘魔像將全自動掛機開採！'}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-black cursor-pointer font-minecraft"
          >
            {isEn ? 'Close' : '關閉'}
          </button>
        </div>
      </div>
    </div>
  );
};
