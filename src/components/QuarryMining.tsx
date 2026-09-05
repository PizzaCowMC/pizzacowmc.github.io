import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BLOCK_TYPES, PICKAXE_TIERS, STRATA_LAYERS } from '../data/gameData';
import { BlockType, PickaxeState, StrataLayer } from '../types';
import { BlockTexture } from './BlockTexture';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import { Pickaxe, Wrench, Zap, Shield, Sparkles, Layers, Lock, CheckCircle2, ChevronRight, Flame } from 'lucide-react';

interface QuarryMiningProps {
  pickaxeState: PickaxeState;
  inventory: Record<string, number>;
  selectedLayerId: string;
  onSelectLayer: (layerId: string) => void;
  layerMinedCounts: Record<string, number>;
  onMineSuccess: (minedBlock: BlockType, amount: number, layerId: string) => void;
  onDurabilityLoss: () => void;
  onOpenShopToPickaxes: () => void;
  totalBlocksMined: number;
  hasteRemainingSeconds?: number;
  hasAutoMiner?: boolean;
  extremeHasteSeconds?: number;
  doubleCoinsSeconds?: number;
  zeroDurabilitySeconds?: number;
}

export const QuarryMining: React.FC<QuarryMiningProps> = ({
  pickaxeState,
  selectedLayerId,
  onSelectLayer,
  layerMinedCounts,
  onMineSuccess,
  onDurabilityLoss,
  onOpenShopToPickaxes,
  totalBlocksMined,
  hasteRemainingSeconds = 0,
  hasAutoMiner = false,
  extremeHasteSeconds = 0,
  doubleCoinsSeconds = 0,
  zeroDurabilitySeconds = 0
}) => {
  const { language, getName, t } = useLanguage();
  const isEn = language === 'en';

  // Current active stratum definition
  const currentLayerIndex = STRATA_LAYERS.findIndex(l => l.id === selectedLayerId);
  const activeLayer = STRATA_LAYERS[currentLayerIndex >= 0 ? currentLayerIndex : 0];

  // Available blocks in this strata
  const availableBlocks = BLOCK_TYPES.filter(b => activeLayer.blockIds.includes(b.id));
  const fallbackBlocks = availableBlocks.length > 0 ? availableBlocks : BLOCK_TYPES.slice(0, 3);

  // Current active quarry block
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [miningProgress, setMiningProgress] = useState<number>(0); // 0 to 100%
  const [isMiningActive, setIsMiningActive] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  const holdIntervalRef = useRef<number | null>(null);

  const activeBlock = fallbackBlocks[currentBlockIndex % fallbackBlocks.length] || BLOCK_TYPES[0];
  const currentPickaxe = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];

  // Calculate mining speed multiplier (with haste drink 2x multiplier and festival extreme haste 2x)
  const hasteMultiplier = (hasteRemainingSeconds > 0 ? 2.0 : 1.0) * (extremeHasteSeconds > 0 ? 2.0 : 1.0);
  const effectiveSpeed = currentPickaxe.speedMultiplier * (1 + pickaxeState.efficiencyLevel * 0.20) * hasteMultiplier;
  // Base duration in ms
  const requiredMiningTimeMs = Math.max(70, (activeBlock.hardness / effectiveSpeed) * 1000);

  // Pick a new random block inside the current stratum
  const pickNewBlock = useCallback(() => {
    const nextIdx = Math.floor(Math.random() * fallbackBlocks.length);
    setCurrentBlockIndex(nextIdx);
    setMiningProgress(0);
  }, [fallbackBlocks.length]);

  // Complete a mine
  const completeMine = useCallback(() => {
    sound.playBlockBreakSound();

    // Check Fortune bonus
    let amount = 1;
    if (pickaxeState.fortuneLevel > 0) {
      const chance = pickaxeState.fortuneLevel * 0.18;
      if (Math.random() < chance) {
        amount += Math.random() < 0.3 ? 2 : 1;
      }
    }

    // Floating text feedback
    const newId = Date.now() + Math.random();
    const blockDisplayName = getName(activeBlock);
    const fortuneSuffix = isEn ? ' (Fortune!)' : ' (幸運!)';
    const textStr = amount > 1 ? `+${amount} ${blockDisplayName}${fortuneSuffix}` : `+${amount} ${blockDisplayName}`;
    setFloatingTexts(prev => [
      ...prev.slice(-4),
      { id: newId, text: textStr, x: 50 + (Math.random() * 20 - 10), y: 35 }
    ]);

    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== newId));
    }, 900);

    // Give block to inventory & track stats and layer count
    onMineSuccess(activeBlock, amount, activeLayer.id);

    // Consume durability
    onDurabilityLoss();

    // Reset progress and pick next block
    setMiningProgress(0);
    pickNewBlock();
  }, [activeBlock, activeLayer.id, onDurabilityLoss, onMineSuccess, pickNewBlock, pickaxeState.fortuneLevel]);

  // Perform a single mining strike / tick
  const strikeMining = useCallback(() => {
    sound.playHitSound(activeBlock.hardness);

    const strikeFraction = (120 / requiredMiningTimeMs) * 100;
    setMiningProgress(prev => {
      const next = prev + Math.max(15, strikeFraction);
      if (next >= 100) {
        completeMine();
        return 0;
      } else {
        if (Math.random() < 0.35) sound.playCrackSound();
        return next;
      }
    });
  }, [activeBlock.hardness, completeMine, requiredMiningTimeMs]);

  // Handle continuous hold mining
  useEffect(() => {
    if (!isMiningActive) {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
      return;
    }

    // Tick every 60ms
    holdIntervalRef.current = window.setInterval(() => {
      const progressDelta = (60 / requiredMiningTimeMs) * 100;
      setMiningProgress(prev => {
        const next = prev + progressDelta;
        if (next >= 100) {
          completeMine();
          return 0;
        }
        return next;
      });
    }, 60);

    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    };
  }, [isMiningActive, requiredMiningTimeMs, completeMine]);

  // Calculate current crack overlay stage (0 to 9)
  const crackStage = miningProgress > 0 ? Math.min(9, Math.floor((miningProgress / 100) * 10)) : -1;

  // Durability percentage
  const durabilityPercent = currentPickaxe.tier === 0
    ? 100
    : Math.max(0, Math.min(100, Math.round((pickaxeState.currentDurability / currentPickaxe.maxDurability) * 100)));

  // Layer progress calculation
  const currentLayerMined = layerMinedCounts[activeLayer.id] || 0;
  const isLastLayer = currentLayerIndex === STRATA_LAYERS.length - 1;
  const nextLayer = !isLastLayer ? STRATA_LAYERS[currentLayerIndex + 1] : null;
  const unlockThreshold = 100000;
  const currentLayerProgressPct = Math.min(100, Math.floor((currentLayerMined / unlockThreshold) * 1000) / 10);
  const isNextLayerUnlocked = currentLayerMined >= unlockThreshold;

  // Helper to check if any layer is unlocked
  const isLayerUnlocked = (layerIndex: number): boolean => {
    if (layerIndex === 0) return true;
    const prevLayer = STRATA_LAYERS[layerIndex - 1];
    return (layerMinedCounts[prevLayer.id] || 0) >= 100000;
  };

  return (
    <section className="bg-[#262626] border-4 border-black p-4 sm:p-5 shadow-[inset_-4px_-4px_0px_#111,inset_4px_4px_0px_#444] rounded-lg">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-dashed border-zinc-700">
        <div>
          <h2 className="text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000] flex items-center gap-2">
            <span>⛏️ {t('quarry.title')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
              {isEn ? '8 Strata Layers • 100,000 Blocks Unlock' : '8大深度礦脈層 • 100,000格層級解鎖'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isEn ? 'Current Stratum:' : '當前開採地層：'} <strong className="text-amber-300">{getName(activeLayer)}</strong> • {isEn ? 'Total Excavated:' : '累計總挖掘量：'}
            <span className="text-amber-400 font-mono font-bold ml-1">{totalBlocksMined.toLocaleString()}</span> {isEn ? 'blocks' : '格'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded border-2 border-black">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-zinc-400">{isEn ? 'Layer Mined:' : '當前地層挖掘量:'}</span>
          <span className="text-amber-300 font-bold">{currentLayerMined.toLocaleString()} {isEn ? 'blocks' : '格'}</span>
        </div>
      </div>

      {/* Strata Progression Unlock Banner */}
      {!isLastLayer && nextLayer && (
        <div className={`mb-4 p-3 rounded-lg border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
          isNextLayerUnlocked
            ? 'bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border-emerald-600'
            : 'bg-zinc-900/90'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center text-lg shrink-0 ${
              isNextLayerUnlocked ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-amber-400'
            }`}>
              {isNextLayerUnlocked ? <CheckCircle2 className="w-5 h-5" /> : <Flame className="w-5 h-5 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-white">
                  {isEn ? 'Next Stratum Unlock:' : '下一層礦脈解鎖進度：'} {getName(nextLayer)}
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isNextLayerUnlocked ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {isNextLayerUnlocked
                    ? (isEn ? '✅ Unlocked! Click stratum tab below' : '✅ 已解鎖可前往')
                    : (isEn ? `Mine 100,000 in this layer (${currentLayerProgressPct}%)` : `需在此層挖滿 100,000 格 (${currentLayerProgressPct}%)`)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isNextLayerUnlocked
                  ? (isEn ? `Magnificent! 100,000 blocks mined in ${getName(activeLayer)}. Click the tab below to delve deeper!` : `太棒了！已在「${getName(activeLayer)}」挖滿 100,000 格，點擊下方標籤即可切換至下一層！`)
                  : (isEn ? `${(unlockThreshold - currentLayerMined).toLocaleString()} more blocks needed to unlock ${getName(nextLayer)}!` : `還需挖掘 ${(unlockThreshold - currentLayerMined).toLocaleString()} 格方塊即可解鎖「${getName(nextLayer)}」！`)}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-56 shrink-0">
            <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
              <span>{isEn ? '100k Target' : '10萬格進度'}</span>
              <span className="text-amber-300 font-bold">{currentLayerMined.toLocaleString()} / 100,000</span>
            </div>
            <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${currentLayerProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 8 Strata Layers Selector Tabs */}
      <div className="mb-4">
        <div className="text-xs font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('quarry.selectLayer')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {STRATA_LAYERS.map((layer, idx) => {
            const unlocked = isLayerUnlocked(idx);
            const isSelected = activeLayer.id === layer.id;
            const count = layerMinedCounts[layer.id] || 0;
            const layerLabel = isEn ? layer.nameEn.split(':')[1] || layer.nameEn : layer.nameZh.split('：')[1] || layer.nameZh;

            return (
              <button
                key={layer.id}
                disabled={!unlocked}
                onClick={() => {
                  if (unlocked) {
                    onSelectLayer(layer.id);
                    sound.playClickSound();
                    setMiningProgress(0);
                    pickNewBlock();
                  }
                }}
                className={`p-2 rounded-lg border-2 text-left transition-all relative flex flex-col justify-between min-h-[72px] ${
                  isSelected
                    ? 'bg-amber-600/30 border-amber-400 shadow-[inset_0_0_10px_rgba(251,191,36,0.3),0_0_8px_rgba(251,191,36,0.4)]'
                    : unlocked
                    ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-700 hover:border-zinc-500 cursor-pointer'
                    : 'bg-zinc-950/70 border-zinc-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{layer.icon}</span>
                  {!unlocked ? (
                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  ) : count >= 100000 ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">100k+</span>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400">{count > 9999 ? `${Math.floor(count/1000)}k` : count}</span>
                  )}
                </div>

                <div>
                  <div className={`text-xs font-black truncate ${isSelected ? 'text-amber-300' : unlocked ? 'text-zinc-200' : 'text-zinc-600'}`}>
                    {layerLabel}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {!unlocked ? (isEn ? 'Requires 100k' : '需上層挖滿10萬') : (isEn ? `${count.toLocaleString()} mined` : `已挖 ${count.toLocaleString()}`)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main interactive area: Mining Stage + Equipped Pickaxe Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Mining quarry block interaction box */}
        <div className="md:col-span-7 bg-zinc-950 border-4 border-black p-6 rounded-lg text-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center min-h-[270px]">
          {/* Stratum badge */}
          <div className="mb-2">
            <div className="flex items-center justify-center gap-1.5 flex-wrap mb-1">
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-mono">
                {activeLayer.icon} {getName(activeLayer)} • {isEn ? 'Hardness' : '硬度'}: {activeBlock.hardness}s
              </span>
              {doubleCoinsSeconds > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500 text-amber-300 font-mono font-bold animate-pulse">
                  🍬 {isEn ? 'Double Coins' : '雙倍金幣'} {doubleCoinsSeconds}s
                </span>
              )}
              {zeroDurabilitySeconds > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/80 border border-sky-400 text-sky-200 font-mono font-bold animate-pulse">
                  ❄️ {isEn ? 'Zero Durability Loss' : '無限鎖耐久'} {zeroDurabilitySeconds}s
                </span>
              )}
              {extremeHasteSeconds > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-950/80 border border-pink-400 text-pink-200 font-mono font-bold animate-pulse">
                  🍡 {isEn ? 'Extreme Haste +100%' : '極速採礦+100%'} {extremeHasteSeconds}s
                </span>
              )}
            </div>
            <div className="text-lg font-black text-amber-300 drop-shadow-[1px_1px_0_#000] mt-1">
              {getName(activeBlock)}
            </div>
            <p className="text-[11px] text-zinc-400 max-w-sm mx-auto line-clamp-1">
              {activeBlock.description}
            </p>
          </div>

          {/* Block Target Button */}
          <div className="relative my-2">
            <button
              id="quarry-block-target"
              onMouseDown={() => {
                setIsMiningActive(true);
                strikeMining();
              }}
              onMouseUp={() => setIsMiningActive(false)}
              onMouseLeave={() => setIsMiningActive(false)}
              onTouchStart={() => {
                setIsMiningActive(true);
                strikeMining();
              }}
              onTouchEnd={() => setIsMiningActive(false)}
              className="relative p-1 transition-transform active:scale-95 cursor-pointer group focus:outline-none"
              title={isEn ? 'Click or hold to mine!' : '點擊或長按開採！'}
            >
              <BlockTexture
                blockId={activeBlock.id}
                size={115}
                breakStage={crackStage}
                showName={false}
                className="transition-transform group-hover:scale-105 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              />
            </button>

            {/* Floating drop rewards */}
            {floatingTexts.map(item => (
              <div
                key={item.id}
                className="absolute pointer-events-none text-amber-300 font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] animate-bounce font-mono whitespace-nowrap z-30"
                style={{
                  top: `${item.y}%`,
                  left: `${item.x}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                ✨ {item.text}
              </div>
            ))}
          </div>

          {/* Mining Progress Bar */}
          <div className="w-full max-w-xs mt-2">
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
              <span>{isEn ? 'Mining Progress' : '開採敲擊進度'}</span>
              <span className="text-amber-400 font-bold">{Math.round(miningProgress)}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-900 border-2 border-black rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-75"
                style={{ width: `${miningProgress}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 mt-2">
            {isEn ? '🖱️ Click rapidly to smash, or hold mouse/finger for continuous excavation!' : '🖱️ 點擊連擊破岩，或按住滑鼠/螢幕連續開採！'}
          </div>
        </div>

        {/* Right: Pickaxe & Tool Diagnostics */}
        <div className="md:col-span-5 bg-zinc-900 border-3 border-black p-4 rounded-lg flex flex-col justify-between h-full shadow-[inset_2px_2px_0_#3f3f46]">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                <Pickaxe className="w-5 h-5 text-amber-400" />
                <span className="font-black text-white text-sm">{isEn ? 'Equipped Pickaxe Status' : '裝備鎬具狀態'}</span>
              </div>
              <button
                onClick={onOpenShopToPickaxes}
                className="text-[11px] px-2 py-1 bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold rounded border border-black transition-colors flex items-center gap-1 shadow-[inset_1px_1px_0_#fde047] cursor-pointer"
              >
                <Wrench className="w-3 h-3" />
                {isEn ? 'Upgrade / Repair' : '升級 / 修復'}
              </button>
            </div>

            {/* Pickaxe card */}
            <div className="bg-zinc-950 p-3 border-2 border-black rounded mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⛏️</span>
                  <span className="font-black text-amber-300 text-sm">{getName(currentPickaxe)}</span>
                </div>
                <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  {currentPickaxe.speedMultiplier}x {isEn ? 'Speed' : '挖掘倍率'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                {currentPickaxe.desc}
              </p>

              {/* Durability Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-zinc-400">{isEn ? 'Tool Durability' : '鎬子耐久度'}</span>
                  {currentPickaxe.tier === 0 ? (
                    <span className="text-emerald-400 font-bold">{isEn ? 'Infinite' : '無限耐久'}</span>
                  ) : (
                    <span className={durabilityPercent < 20 ? "text-red-400 font-bold" : "text-zinc-200"}>
                      {pickaxeState.currentDurability} / {currentPickaxe.maxDurability} ({durabilityPercent}%)
                    </span>
                  )}
                </div>
                {currentPickaxe.tier !== 0 && (
                  <div className="w-full h-2.5 bg-zinc-900 border border-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        durabilityPercent > 50
                          ? 'bg-emerald-500'
                          : durabilityPercent > 20
                          ? 'bg-amber-500'
                          : 'bg-red-500 animate-pulse'
                      }`}
                      style={{ width: `${durabilityPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pickaxe enchantments */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-1.5 bg-zinc-950/70 border border-zinc-800 rounded">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  {isEn ? 'Efficiency Enchantment (Speed)' : '效率附魔 (Speed)'}
                </span>
                <span className="font-mono font-bold text-yellow-400">
                  Lv. {pickaxeState.efficiencyLevel} (+{pickaxeState.efficiencyLevel * 20}%)
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-zinc-950/70 border border-zinc-800 rounded">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  {isEn ? 'Unbreaking Enchantment (Durability)' : '耐久附魔 (Unbreaking)'}
                </span>
                <span className="font-mono font-bold text-blue-400">
                  Lv. {pickaxeState.unbreakingLevel} ({pickaxeState.unbreakingLevel * 10}% {isEn ? 'reduction' : '減損'})
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-zinc-950/70 border border-zinc-800 rounded">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {isEn ? 'Fortune Enchantment (Bonus Drops)' : '幸運附魔 (Fortune)'}
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  Lv. {pickaxeState.fortuneLevel} ({pickaxeState.fortuneLevel * 18}% {isEn ? 'double chance' : '機率翻倍'})
                </span>
              </div>

              {/* Active Consumable Buffs */}
              {hasteRemainingSeconds > 0 && (
                <div className="flex items-center justify-between p-1.5 bg-amber-950/80 border border-amber-500 rounded animate-pulse">
                  <span className="flex items-center gap-1.5 text-amber-200 font-black">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    ⚡ {isEn ? 'Haste Surge (Halved Mining Time)' : '急迫採礦狂飆 (開採時間減半)'}
                  </span>
                  <span className="font-mono font-black text-amber-300">
                    {hasteRemainingSeconds}s
                  </span>
                </div>
              )}

              {hasAutoMiner && (
                <div className="flex items-center justify-between p-1.5 bg-cyan-950/80 border border-cyan-500 rounded">
                  <span className="flex items-center gap-1.5 text-cyan-200 font-bold">
                    <span className="text-xs">🤖</span>
                    {isEn ? 'Steam Auto-Miner Golem (Mines every 3s)' : '蒸氣紅石自動採礦魔像 (每3秒挖掘)'}
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    {isEn ? 'Active ✔' : '運轉中 ✔'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 mt-3 border-t border-zinc-800 pt-2 text-center">
            💡 {isEn ? 'Excavate 100,000 blocks in a stratum to unlock the next deep geological layer!' : '累積挖掘 100,000 格可解鎖下一層深邃地層，獲得更稀有寶石神礦！'}
          </div>
        </div>
      </div>
    </section>
  );
};
