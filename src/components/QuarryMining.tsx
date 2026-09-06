import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BLOCK_TYPES, PICKAXE_TIERS, STRATA_LAYERS } from '../data/gameData';
import { AXE_TIERS, SHOVEL_TIERS, SWORD_TIERS, getBestToolForBlock } from '../data/toolsData';
import { spawnRandomMonster } from '../data/monstersData';
import { BlockType, PickaxeState, ToolType, MonsterData } from '../types';
import { BlockTexture } from './BlockTexture';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import { calculateBlockXp } from '../utils/levelSystem';
import { Pickaxe, Wrench, Zap, Shield, Sparkles, Layers, Lock, CheckCircle2, ChevronRight, Flame, Sword, Crosshair, Skull } from 'lucide-react';

interface QuarryMiningProps {
  pickaxeState: PickaxeState;
  inventory: Record<string, number>;
  selectedLayerId: string;
  onSelectLayer: (layerId: string) => void;
  layerMinedCounts: Record<string, number>;
  onMineSuccess: (minedBlock: BlockType, amount: number, layerId: string) => void;
  onDurabilityLoss?: () => void;
  onToolDurabilityLoss?: (tool: ToolType) => void;
  onOpenShopToPickaxes?: () => void;
  onOpenShopTab?: (tab: 'pickaxes' | 'axes' | 'shovels' | 'swords') => void;
  totalBlocksMined: number;
  hasteRemainingSeconds?: number;
  hasAutoMiner?: boolean;
  extremeHasteSeconds?: number;
  doubleCoinsSeconds?: number;
  zeroDurabilitySeconds?: number;
  // Tools and Combat props
  activeTool?: ToolType;
  onChangeTool?: (tool: ToolType) => void;
  autoSwitchTool?: boolean;
  onToggleAutoSwitch?: () => void;
  axeState?: { currentTierId: string; currentDurability: number };
  shovelState?: { currentTierId: string; currentDurability: number };
  swordState?: { currentTierId: string; currentDurability: number };
  onDefeatMonster?: (monster: MonsterData, coinReward: number) => void;
  onEarnExtraCoins?: (coins: number) => void;
}

export const QuarryMining: React.FC<QuarryMiningProps> = ({
  pickaxeState,
  selectedLayerId,
  onSelectLayer,
  layerMinedCounts,
  onMineSuccess,
  onDurabilityLoss,
  onToolDurabilityLoss,
  onOpenShopToPickaxes,
  onOpenShopTab,
  totalBlocksMined,
  hasteRemainingSeconds = 0,
  hasAutoMiner = false,
  extremeHasteSeconds = 0,
  doubleCoinsSeconds = 0,
  zeroDurabilitySeconds = 0,
  activeTool: externalActiveTool,
  onChangeTool: externalOnChangeTool,
  autoSwitchTool: externalAutoSwitchTool,
  onToggleAutoSwitch: externalOnToggleAutoSwitch,
  axeState = { currentTierId: 'bare_hand_axe', currentDurability: 999999 },
  shovelState = { currentTierId: 'bare_hand_shovel', currentDurability: 999999 },
  swordState = { currentTierId: 'wood_sword', currentDurability: 80 },
  onDefeatMonster,
  onEarnExtraCoins
}) => {
  const { language, getName, t } = useLanguage();
  const isEn = language === 'en';

  // Local tool state if not controlled externally
  const [internalActiveTool, setInternalActiveTool] = useState<ToolType>('pickaxe');
  const [internalAutoSwitch, setInternalAutoSwitch] = useState<boolean>(true);

  const activeTool = externalActiveTool !== undefined ? externalActiveTool : internalActiveTool;
  const autoSwitchTool = externalAutoSwitchTool !== undefined ? externalAutoSwitchTool : internalAutoSwitch;

  const setActiveTool = useCallback((tool: ToolType) => {
    if (externalOnChangeTool) {
      externalOnChangeTool(tool);
    } else {
      setInternalActiveTool(tool);
    }
  }, [externalOnChangeTool]);

  const toggleAutoSwitch = useCallback(() => {
    if (externalOnToggleAutoSwitch) {
      externalOnToggleAutoSwitch();
    } else {
      setInternalAutoSwitch(prev => !prev);
    }
  }, [externalOnToggleAutoSwitch]);

  // Current active stratum definition
  const currentLayerIndex = STRATA_LAYERS.findIndex(l => l.id === selectedLayerId);
  const activeLayer = STRATA_LAYERS[currentLayerIndex >= 0 ? currentLayerIndex : 0];

  // Available blocks in this strata
  const availableBlocks = BLOCK_TYPES.filter(b => activeLayer.blockIds.includes(b.id));
  const fallbackBlocks = availableBlocks.length > 0 ? availableBlocks : BLOCK_TYPES.slice(0, 3);

  // Mining state
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [miningProgress, setMiningProgress] = useState<number>(0); // 0 to 100%
  const [isMiningActive, setIsMiningActive] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number; color?: string }[]>([]);

  // Monster combat state
  const [activeMonster, setActiveMonster] = useState<MonsterData | null>(null);
  const [monsterCurrentHp, setMonsterCurrentHp] = useState<number>(100);
  const [isMonsterHit, setIsMonsterHit] = useState<boolean>(false);

  // Safety lock to prevent double execution (fixes "我每挖一個就變成兩個???!!!")
  const isCompletingRef = useRef<boolean>(false);
  const holdIntervalRef = useRef<number | null>(null);

  const activeBlock = fallbackBlocks[currentBlockIndex % fallbackBlocks.length] || BLOCK_TYPES[0];

  // Current equipped tool objects
  const currentPickaxe = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];
  const currentAxe = AXE_TIERS.find(a => a.id === axeState.currentTierId) || AXE_TIERS[0];
  const currentShovel = SHOVEL_TIERS.find(s => s.id === shovelState.currentTierId) || SHOVEL_TIERS[0];
  const currentSword = SWORD_TIERS.find(s => s.id === swordState.currentTierId) || SWORD_TIERS[0];

  // Best recommended tool for the current block
  const bestTool = getBestToolForBlock(activeBlock);

  // If auto-switch is ON, automatically equip the best tool for the block (unless fighting a monster)
  useEffect(() => {
    if (autoSwitchTool) {
      if (activeMonster) {
        if (activeTool !== 'sword') {
          setActiveTool('sword');
        }
      } else {
        if (activeTool !== bestTool && activeTool !== 'sword') {
          setActiveTool(bestTool);
        }
      }
    }
  }, [activeBlock, activeMonster, activeTool, autoSwitchTool, bestTool, setActiveTool]);

  // Keyboard shortcut listener: [1] Pickaxe, [2] Axe, [3] Shovel, [4] Sword
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === '1') {
        sound.playClickSound();
        setActiveTool('pickaxe');
      } else if (e.key === '2') {
        sound.playClickSound();
        setActiveTool('axe');
      } else if (e.key === '3') {
        sound.playClickSound();
        setActiveTool('shovel');
      } else if (e.key === '4') {
        sound.playClickSound();
        setActiveTool('sword');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool]);

  // Calculate speed multiplier based on active tool vs required tool
  const hasteMultiplier = (hasteRemainingSeconds > 0 ? 2.0 : 1.0) * (extremeHasteSeconds > 0 ? 2.0 : 1.0);

  let toolSpeedMultiplier = 1.0;
  if (activeTool === 'pickaxe') {
    const basePickSpeed = currentPickaxe.speedMultiplier * (1 + pickaxeState.efficiencyLevel * 0.20);
    // Pickaxe is best on stone/ore. On wood or soil it has a 0.55x penalty
    toolSpeedMultiplier = bestTool === 'pickaxe' ? basePickSpeed : basePickSpeed * 0.55;
  } else if (activeTool === 'axe') {
    // Axe is best on wood!
    toolSpeedMultiplier = bestTool === 'axe' ? currentAxe.speedMultiplier : currentAxe.speedMultiplier * 0.45;
  } else if (activeTool === 'shovel') {
    // Shovel is best on soil!
    toolSpeedMultiplier = bestTool === 'shovel' ? currentShovel.speedMultiplier : currentShovel.speedMultiplier * 0.45;
  } else if (activeTool === 'sword') {
    // Swords are weapons; very slow at mining
    toolSpeedMultiplier = 0.5;
  }

  const effectiveSpeed = Math.max(0.4, toolSpeedMultiplier * hasteMultiplier);
  const requiredMiningTimeMs = Math.max(70, (activeBlock.hardness / effectiveSpeed) * 1000);

  // Tool durability handler
  const handleConsumeDurability = useCallback((tool: ToolType) => {
    if (zeroDurabilitySeconds > 0) return; // Buff active: zero durability loss

    if (onToolDurabilityLoss) {
      onToolDurabilityLoss(tool);
    } else if (tool === 'pickaxe' && onDurabilityLoss) {
      onDurabilityLoss();
    }
  }, [onDurabilityLoss, onToolDurabilityLoss, zeroDurabilitySeconds]);

  // Pick a new random block inside the current stratum
  const pickNewBlock = useCallback(() => {
    const nextIdx = Math.floor(Math.random() * fallbackBlocks.length);
    setCurrentBlockIndex(nextIdx);
    setMiningProgress(0);
  }, [fallbackBlocks.length]);

  // Complete a mine operation (strictly idempotent, prevents duplicate execution)
  const completeMine = useCallback(() => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    sound.playBlockBreakSound();

    // Default amount is STRICTLY 1
    let amount = 1;

    // Fortune enchantment bonus (only active when using pickaxe)
    if (activeTool === 'pickaxe' && pickaxeState.fortuneLevel > 0) {
      const chance = pickaxeState.fortuneLevel * 0.18;
      if (Math.random() < chance) {
        amount += Math.random() < 0.3 ? 2 : 1;
      }
    } else if (activeTool === 'axe' && bestTool === 'axe') {
      // Axe special: 35% chance to drop +1 bonus timber
      if (Math.random() < 0.35) {
        amount += 1;
      }
    }

    // Floating text feedback
    const newId = Date.now() + Math.random();
    const blockDisplayName = getName(activeBlock);
    const fortuneSuffix = isEn ? ' (Bonus!)' : ' (額外收穫!)';
    const textStr = amount > 1 ? `+${amount} ${blockDisplayName}${fortuneSuffix}` : `+${amount} ${blockDisplayName}`;
    const xpGained = calculateBlockXp(activeBlock.category, activeBlock.hardness) * amount;
    const xpId = Date.now() + Math.random() + 0.1;

    setFloatingTexts(prev => [
      ...prev.slice(-4),
      { id: newId, text: textStr, x: 50 + (Math.random() * 20 - 10), y: 35, color: '#fde047' },
      { id: xpId, text: `+${xpGained} XP`, x: 50 + (Math.random() * 20 - 10), y: 15, color: '#4ade80' }
    ]);

    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== newId && item.id !== xpId));
    }, 900);

    // Give block to inventory & track stats and layer count
    onMineSuccess(activeBlock, amount, activeLayer.id);

    // Consume durability for active tool
    handleConsumeDurability(activeTool);

    // Shovel special: 25% chance to uncover bonus coins from soil/sand
    if (activeTool === 'shovel' && bestTool === 'shovel') {
      if (Math.random() < 0.25) {
        const bonusCoins = Math.floor(5 + Math.random() * 15);
        if (onEarnExtraCoins) onEarnExtraCoins(bonusCoins);
        const coinFloatId = Date.now() + Math.random();
        setFloatingTexts(prev => [
          ...prev.slice(-4),
          { id: coinFloatId, text: `🪙 +${bonusCoins} ${isEn ? 'Coins' : '金幣'}`, x: 50, y: 55, color: '#38bdf8' }
        ]);
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(item => item.id !== coinFloatId));
        }, 900);
      }
    }

    // 9% chance for a random underground monster encounter!
    if (!activeMonster && Math.random() < 0.09) {
      const monster = spawnRandomMonster(currentLayerIndex);
      setActiveMonster(monster);
      setMonsterCurrentHp(monster.maxHp);
      sound.playMonsterSpawnSound();
      if (autoSwitchTool) {
        setActiveTool('sword');
      }
    }

    // Reset progress and pick next block
    setMiningProgress(0);
    pickNewBlock();

    // Release completion lock
    setTimeout(() => {
      isCompletingRef.current = false;
    }, 70);
  }, [
    activeBlock,
    activeLayer.id,
    activeMonster,
    activeTool,
    autoSwitchTool,
    bestTool,
    currentLayerIndex,
    getName,
    handleConsumeDurability,
    isEn,
    onEarnExtraCoins,
    onMineSuccess,
    pickNewBlock,
    pickaxeState.fortuneLevel,
    setActiveTool
  ]);

  // Strike mining action (click)
  const strikeMining = useCallback(() => {
    if (isCompletingRef.current || activeMonster) return;
    sound.playHitSound(activeBlock.hardness);

    const strikeFraction = (120 / requiredMiningTimeMs) * 100;
    const nextProgress = miningProgress + Math.max(15, strikeFraction);

    if (nextProgress >= 100) {
      setMiningProgress(100);
      completeMine();
    } else {
      setMiningProgress(nextProgress);
      if (Math.random() < 0.35) sound.playCrackSound();
    }
  }, [activeBlock.hardness, activeMonster, completeMine, miningProgress, requiredMiningTimeMs]);

  // Handle continuous hold mining
  useEffect(() => {
    if (!isMiningActive || activeMonster) {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
      return;
    }

    holdIntervalRef.current = window.setInterval(() => {
      if (isCompletingRef.current) return;
      setMiningProgress(prev => {
        const next = prev + (60 / requiredMiningTimeMs) * 100;
        if (next >= 100) {
          setTimeout(() => completeMine(), 0);
          return 100;
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
  }, [activeMonster, completeMine, isMiningActive, requiredMiningTimeMs]);

  // Monster Combat: Strike monster
  const strikeMonster = useCallback(() => {
    if (!activeMonster) return;

    setIsMonsterHit(true);
    setTimeout(() => setIsMonsterHit(false), 200);

    let damage = 1;
    let isCrit = false;

    if (activeTool === 'sword') {
      // Using a sword: deals full attack damage with crit chance!
      damage = currentSword.attackDamage;
      if (Math.random() < currentSword.critChance) {
        isCrit = true;
        damage = Math.round(damage * 1.75);
        sound.playSwordCritSound();
      } else {
        sound.playSwordSlashSound();
      }
      sound.playMonsterHurtSound();
      handleConsumeDurability('sword');
    } else {
      // Using pickaxe, axe, shovel, or bare hands: only 1 scratch damage!
      damage = 1;
      sound.playHitSound(0.5);
      handleConsumeDurability(activeTool);
    }

    const nextHp = Math.max(0, monsterCurrentHp - damage);
    setMonsterCurrentHp(nextHp);

    // Floating combat text
    const newId = Date.now() + Math.random();
    const hitText = activeTool === 'sword'
      ? (isCrit ? `💥 CRIT! -${damage}` : `⚔️ -${damage}`)
      : `1 (${isEn ? 'Use Sword!' : '請用劍打！'})`;

    setFloatingTexts(prev => [
      ...prev.slice(-4),
      {
        id: newId,
        text: hitText,
        x: 50 + (Math.random() * 24 - 12),
        y: 40 + (Math.random() * 10 - 5),
        color: activeTool === 'sword' ? (isCrit ? '#fbbf24' : '#ef4444') : '#9ca3af'
      }
    ]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== newId));
    }, 800);

    // Check if monster defeated
    if (nextHp <= 0) {
      sound.playMonsterDefeatSound();

      const coinReward = activeMonster.coinReward * (doubleCoinsSeconds > 0 ? 2 : 1);
      if (onDefeatMonster) {
        onDefeatMonster(activeMonster, coinReward);
      } else if (onEarnExtraCoins) {
        onEarnExtraCoins(coinReward);
      }

      // Victory toast
      const defeatId = Date.now() + 99;
      setFloatingTexts(prev => [
        ...prev,
        {
          id: defeatId,
          text: `🎉 ${isEn ? 'Defeated' : '討伐成功!'} +${coinReward} 🪙`,
          x: 50,
          y: 25,
          color: '#34d399'
        }
      ]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(item => item.id !== defeatId));
      }, 1500);

      // Return to quarry blocks
      setTimeout(() => {
        setActiveMonster(null);
        if (autoSwitchTool) {
          setActiveTool(bestTool);
        }
      }, 350);
    }
  }, [
    activeMonster,
    activeTool,
    autoSwitchTool,
    bestTool,
    currentSword.attackDamage,
    currentSword.critChance,
    doubleCoinsSeconds,
    handleConsumeDurability,
    isEn,
    monsterCurrentHp,
    onDefeatMonster,
    onEarnExtraCoins,
    setActiveTool
  ]);

  // Manually trigger a monster encounter (for user testing and exploration)
  const triggerManualMonster = useCallback(() => {
    sound.playClickSound();
    const monster = spawnRandomMonster(currentLayerIndex);
    setActiveMonster(monster);
    setMonsterCurrentHp(monster.maxHp);
    sound.playMonsterSpawnSound();
    if (autoSwitchTool) {
      setActiveTool('sword');
    }
  }, [autoSwitchTool, currentLayerIndex, setActiveTool]);

  // Crack stage 0-9
  const crackStage = Math.min(9, Math.floor((miningProgress / 100) * 10));

  return (
    <div className="space-y-4">
      {/* 1. Minecraft Quick Hotbar: [1] Pickaxe, [2] Axe, [3] Shovel, [4] Sword */}
      <div className="bg-zinc-900 border-4 border-black p-3 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-black text-amber-300 font-minecraft mr-1">
            {isEn ? 'Hotbar:' : '快捷工具欄:'}
          </span>

          {/* Slot 1: Pickaxe */}
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTool('pickaxe');
            }}
            className={`px-2.5 py-1.5 rounded-md border-2 border-black flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
              activeTool === 'pickaxe'
                ? 'bg-amber-950 text-amber-300 border-amber-400 ring-2 ring-amber-400 scale-105 shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
            }`}
            title={isEn ? 'Hotkey: 1 - Best for Stone and Ores' : '快捷鍵: 1 - 適用開採岩石與礦物'}
          >
            <span className="px-1 py-0.2 rounded bg-black/60 text-[10px] text-zinc-400 font-mono">[1]</span>
            <span className="text-base">⛏️</span>
            <span>{getName(currentPickaxe)}</span>
            {bestTool === 'pickaxe' && !activeMonster && (
              <span className="text-[10px] px-1 bg-emerald-900 text-emerald-300 rounded font-mono">
                {isEn ? 'BEST' : '首選'}
              </span>
            )}
          </button>

          {/* Slot 2: Axe */}
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTool('axe');
            }}
            className={`px-2.5 py-1.5 rounded-md border-2 border-black flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
              activeTool === 'axe'
                ? 'bg-amber-950 text-amber-300 border-amber-400 ring-2 ring-amber-400 scale-105 shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
            }`}
            title={isEn ? 'Hotkey: 2 - Best for Logs and Wood (+35% extra drop)' : '快捷鍵: 2 - 適用採伐原木木材 (+35% 額外掉落)'}
          >
            <span className="px-1 py-0.2 rounded bg-black/60 text-[10px] text-zinc-400 font-mono">[2]</span>
            <span className="text-base">🪓</span>
            <span>{isEn ? currentAxe.nameEn : currentAxe.nameZh}</span>
            {bestTool === 'axe' && !activeMonster && (
              <span className="text-[10px] px-1 bg-emerald-900 text-emerald-300 rounded font-mono">
                {isEn ? 'BEST' : '首選'}
              </span>
            )}
          </button>

          {/* Slot 3: Shovel */}
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTool('shovel');
            }}
            className={`px-2.5 py-1.5 rounded-md border-2 border-black flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
              activeTool === 'shovel'
                ? 'bg-sky-950 text-sky-300 border-sky-400 ring-2 ring-sky-400 scale-105 shadow-[inset_0_2px_0_#7dd3fc]'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
            }`}
            title={isEn ? 'Hotkey: 3 - Best for Dirt, Sand and Gravel (+25% bonus coins)' : '快捷鍵: 3 - 適用挖掘泥沙礫石 (+25% 機率挖獲金幣)'}
          >
            <span className="px-1 py-0.2 rounded bg-black/60 text-[10px] text-zinc-400 font-mono">[3]</span>
            <span className="text-base">🪏</span>
            <span>{isEn ? currentShovel.nameEn : currentShovel.nameZh}</span>
            {bestTool === 'shovel' && !activeMonster && (
              <span className="text-[10px] px-1 bg-emerald-900 text-emerald-300 rounded font-mono">
                {isEn ? 'BEST' : '首選'}
              </span>
            )}
          </button>

          {/* Slot 4: Sword */}
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTool('sword');
            }}
            className={`px-2.5 py-1.5 rounded-md border-2 border-black flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
              activeTool === 'sword'
                ? 'bg-red-950 text-red-300 border-red-400 ring-2 ring-red-400 scale-105 shadow-[inset_0_2px_0_#f87171]'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
            }`}
            title={isEn ? 'Hotkey: 4 - Weapon for Monsters (Deals lethal damage + crits)' : '快捷鍵: 4 - 隨機怪物專用武器 (造成致命攻擊與暴擊)'}
          >
            <span className="px-1 py-0.2 rounded bg-black/60 text-[10px] text-zinc-400 font-mono">[4]</span>
            <span className="text-base">⚔️</span>
            <span>{isEn ? currentSword.nameEn : currentSword.nameZh}</span>
            {activeMonster && (
              <span className="text-[10px] px-1 bg-red-800 text-red-200 rounded font-mono animate-pulse">
                {isEn ? 'WEAPON' : '武器'}
              </span>
            )}
          </button>
        </div>

        {/* Right action toggles: Auto-switch tool & Summon Monster exploration */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClickSound();
              toggleAutoSwitch();
            }}
            className={`px-2.5 py-1 text-xs font-black rounded border-2 border-black flex items-center gap-1 cursor-pointer transition-all ${
              autoSwitchTool
                ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-200 border-emerald-400'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
            }`}
            title={isEn ? 'Automatically equip best tool for each block and weapon for monsters' : '自動依據當前開採方塊與怪物切換最佳工具與武器'}
          >
            <Zap className={`w-3.5 h-3.5 ${autoSwitchTool ? 'text-emerald-300 animate-pulse' : 'text-zinc-500'}`} />
            <span>{isEn ? 'Auto-Switch' : '智慧換工具'}: {autoSwitchTool ? (isEn ? 'ON' : '開啟') : (isEn ? 'OFF' : '關閉')}</span>
          </button>

          {!activeMonster && (
            <button
              onClick={triggerManualMonster}
              className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-black rounded border-2 border-red-700 active:scale-95 flex items-center gap-1 cursor-pointer"
              title={isEn ? 'Search the underground tunnels for wild monsters!' : '主動探測幽暗地穴，挑戰隨機出現的怪獸！'}
            >
              <Skull className="w-3.5 h-3.5 text-red-400" />
              <span>{isEn ? 'Explore Monster' : '探尋地穴怪獸'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Strata selection scrollbar */}
      <div className="bg-zinc-900 border-4 border-black p-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="font-black text-amber-300 text-xs sm:text-sm tracking-wide font-minecraft">
              {t('quarry.strataSelector')}
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {isEn ? 'Unlocked Strata: ' : '已解鎖地層：'}
            <strong className="text-amber-300">{STRATA_LAYERS.filter((_, idx) => idx <= 1 || (layerMinedCounts[STRATA_LAYERS[idx-1]?.id] || 0) >= 100000).length}</strong> / {STRATA_LAYERS.length}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {STRATA_LAYERS.map((layer, index) => {
            const isSelected = layer.id === selectedLayerId;
            const prevLayer = STRATA_LAYERS[index - 1];
            const unlocked = index <= 1 || (prevLayer && (layerMinedCounts[prevLayer.id] || 0) >= 100000);
            const count = layerMinedCounts[layer.id] || 0;
            const layerLabel = getName(layer);

            return (
              <button
                key={layer.id}
                disabled={!unlocked}
                onClick={() => {
                  if (unlocked) {
                    sound.playClickSound();
                    onSelectLayer(layer.id);
                  }
                }}
                className={`flex-shrink-0 px-3 py-2 rounded border-2 border-black text-left flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/80 border-amber-400 shadow-[inset_0_2px_0_#fde047]'
                    : unlocked
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-zinc-950 opacity-50 cursor-not-allowed border-zinc-800'
                }`}
              >
                <div className="text-xl">
                  {unlocked ? layer.icon : <Lock className="w-4 h-4 text-zinc-500" />}
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

      {/* 3. Main Quarry Arena: Monster Combat or Mining Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left Arena Box */}
        <div className="md:col-span-7 bg-zinc-950 border-4 border-black p-6 rounded-lg text-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center min-h-[290px]">
          {/* Active Status Badges */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-2">
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

          {/* === MODE A: RANDOM MONSTER COMBAT ("隨機怪物,要用劍打") === */}
          {activeMonster ? (
            <div className="w-full flex flex-col items-center animate-fadeIn">
              {/* Monster Title & Rarity */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-2 py-0.5 rounded font-black border uppercase ${
                  activeMonster.rarity === 'boss'
                    ? 'bg-purple-950 text-purple-300 border-purple-500 animate-pulse'
                    : activeMonster.rarity === 'elite'
                    ? 'bg-red-950 text-red-300 border-red-500'
                    : activeMonster.rarity === 'rare'
                    ? 'bg-blue-950 text-blue-300 border-blue-500'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-600'
                }`}>
                  {activeMonster.rarity}
                </span>
                <span className="text-base sm:text-lg font-black text-red-400 drop-shadow-[1px_1px_0_#000]">
                  {isEn ? activeMonster.nameEn : activeMonster.nameZh}
                </span>
              </div>

              {/* Weapon Warning Notice */}
              <div className={`text-[11px] font-bold px-3 py-1 rounded-md mb-3 border max-w-sm ${
                activeTool === 'sword'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                  : 'bg-red-950/90 text-red-200 border-red-500 animate-bounce'
              }`}>
                {activeTool === 'sword' ? (
                  <span>⚔️ {isEn ? 'Sword ready! Strike to deal lethal weapon damage!' : `已裝備【${isEn ? currentSword.nameEn : currentSword.nameZh}】！點擊怪物斬殺！`}</span>
                ) : (
                  <span>⚠️ {isEn ? 'MUST USE SWORD TO ATTACK! Non-swords only deal 1 scratch damage!' : '隨機怪獸必須用【劍】打！其他工具僅能造成 1 點刮痕！'}</span>
                )}
              </div>

              {/* Monster Target Hit Button */}
              <div className="relative my-2">
                <button
                  id="monster-combat-target"
                  onClick={strikeMonster}
                  className={`p-4 rounded-2xl border-4 transition-all cursor-pointer relative group ${
                    isMonsterHit
                      ? 'scale-90 bg-red-900/60 border-red-400 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                      : 'hover:scale-105 bg-black/60 border-red-600/80 shadow-2xl'
                  }`}
                  title={isEn ? 'Click to attack monster!' : '點擊攻擊怪獸！'}
                >
                  <div className="text-6xl sm:text-7xl select-none filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)]">
                    {activeMonster.emoji}
                  </div>
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="text-[10px] px-2 py-0.5 bg-red-950 text-red-300 font-mono font-bold rounded-full border border-red-500">
                      ATK: {activeMonster.attack}
                    </span>
                  </div>
                </button>

                {/* Floating Damage Numbers */}
                {floatingTexts.map(item => (
                  <div
                    key={item.id}
                    className="absolute pointer-events-none font-black text-base sm:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,1)] animate-bounce font-mono whitespace-nowrap z-30"
                    style={{
                      top: `${item.y}%`,
                      left: `${item.x}%`,
                      transform: 'translate(-50%, -50%)',
                      color: item.color || '#ef4444'
                    }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Monster HP Bar */}
              <div className="w-full max-w-xs mt-3">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-zinc-400">{isEn ? 'Monster HP' : '怪獸血量'}</span>
                  <span className="text-red-400 font-bold">{monsterCurrentHp} / {activeMonster.maxHp}</span>
                </div>
                <div className="w-full h-3.5 bg-zinc-900 border-2 border-black rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-150"
                    style={{ width: `${(monsterCurrentHp / activeMonster.maxHp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Combat Action Controls */}
              <div className="flex items-center gap-2 mt-4">
                {activeTool !== 'sword' ? (
                  <button
                    onClick={() => {
                      sound.playClickSound();
                      setActiveTool('sword');
                    }}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded border-2 border-black shadow-[inset_1px_1px_0_#fca5a5] active:scale-95 flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <Sword className="w-4 h-4" />
                    <span>{isEn ? `Equip ${currentSword.nameEn}` : `立即換劍【${currentSword.nameZh}】迎戰！`}</span>
                  </button>
                ) : (
                  <button
                    onClick={strikeMonster}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded border-2 border-black shadow-[inset_1px_1px_0_#fef08a] active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>{isEn ? `Strike (${currentSword.attackDamage} DMG)` : `揮劍猛劈！(傷害: ${currentSword.attackDamage})`}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClickSound();
                    setActiveMonster(null);
                    if (autoSwitchTool) setActiveTool(bestTool);
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded border border-black cursor-pointer"
                >
                  {isEn ? 'Flee' : '暫時撤退'}
                </button>
              </div>
            </div>
          ) : (
            /* === MODE B: STANDARD QUARRY BLOCK MINING === */
            <div className="w-full flex flex-col items-center">
              {/* Stratum badge & Tool advice banner */}
              <div className="mb-2">
                <div className="flex items-center justify-center gap-1.5 flex-wrap mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-mono">
                    {activeLayer.icon} {getName(activeLayer)} • {isEn ? 'Hardness' : '硬度'}: {activeBlock.hardness}s
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                    activeTool === bestTool
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                      : 'bg-amber-950/90 border-amber-500 text-amber-300'
                  }`}>
                    {activeTool === bestTool
                      ? (isEn ? '✓ Optimal Tool Equipped' : '✓ 已裝備最佳工具')
                      : (isEn ? `⚠️ Recommended: ${bestTool.toUpperCase()}` : `⚠️ 建議切換至【${bestTool === 'axe' ? '斧頭' : bestTool === 'shovel' ? '鏟子' : '鎬子'}】`)}
                  </span>
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
                    className="absolute pointer-events-none font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] animate-bounce font-mono whitespace-nowrap z-30"
                    style={{
                      top: `${item.y}%`,
                      left: `${item.x}%`,
                      transform: 'translate(-50%, -50%)',
                      color: item.color || '#fde047'
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
          )}
        </div>

        {/* Right: Active Tool Diagnostics Card */}
        <div className="md:col-span-5 bg-zinc-900 border-3 border-black p-4 rounded-lg flex flex-col justify-between h-full shadow-[inset_2px_2px_0_#3f3f46]">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                {activeTool === 'sword' ? (
                  <Sword className="w-5 h-5 text-red-400" />
                ) : (
                  <Pickaxe className="w-5 h-5 text-amber-400" />
                )}
                <span className="font-black text-white text-sm">
                  {isEn ? 'Equipped Tool Status' : '當前裝備工具狀態'}
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playClickSound();
                  if (onOpenShopTab) {
                    onOpenShopTab(activeTool === 'sword' ? 'swords' : activeTool === 'axe' ? 'axes' : activeTool === 'shovel' ? 'shovels' : 'pickaxes');
                  } else if (onOpenShopToPickaxes) {
                    onOpenShopToPickaxes();
                  }
                }}
                className="text-[11px] px-2 py-1 bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold rounded border border-black transition-colors flex items-center gap-1 shadow-[inset_1px_1px_0_#fde047] cursor-pointer"
              >
                <Wrench className="w-3 h-3" />
                {isEn ? 'Upgrade / Repair' : '升級 / 修復'}
              </button>
            </div>

            {/* Active Tool Details */}
            {activeTool === 'pickaxe' && (
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
                      <span className="text-zinc-300">
                        {pickaxeState.currentDurability} / {currentPickaxe.maxDurability}
                      </span>
                    )}
                  </div>
                  {currentPickaxe.tier !== 0 && (
                    <div className="w-full h-2 bg-zinc-900 border border-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, (pickaxeState.currentDurability / currentPickaxe.maxDurability) * 100))}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTool === 'axe' && (
              <div className="bg-zinc-950 p-3 border-2 border-black rounded mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🪓</span>
                    <span className="font-black text-amber-300 text-sm">{isEn ? currentAxe.nameEn : currentAxe.nameZh}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    {currentAxe.speedMultiplier}x {isEn ? 'Wood Speed' : '伐木倍率'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                  {currentAxe.desc}
                </p>

                {/* Durability */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-zinc-400">{isEn ? 'Axe Durability' : '斧頭耐久度'}</span>
                    {currentAxe.tier === 0 ? (
                      <span className="text-emerald-400 font-bold">{isEn ? 'Infinite' : '無限耐久'}</span>
                    ) : (
                      <span className="text-zinc-300">
                        {axeState.currentDurability} / {currentAxe.maxDurability}
                      </span>
                    )}
                  </div>
                  {currentAxe.tier !== 0 && (
                    <div className="w-full h-2 bg-zinc-900 border border-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, (axeState.currentDurability / currentAxe.maxDurability) * 100))}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTool === 'shovel' && (
              <div className="bg-zinc-950 p-3 border-2 border-black rounded mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🪏</span>
                    <span className="font-black text-sky-300 text-sm">{isEn ? currentShovel.nameEn : currentShovel.nameZh}</span>
                  </div>
                  <span className="text-xs font-mono text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                    {currentShovel.speedMultiplier}x {isEn ? 'Dig Speed' : '泥沙倍率'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                  {currentShovel.desc}
                </p>

                {/* Durability */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-zinc-400">{isEn ? 'Shovel Durability' : '鏟子耐久度'}</span>
                    {currentShovel.tier === 0 ? (
                      <span className="text-emerald-400 font-bold">{isEn ? 'Infinite' : '無限耐久'}</span>
                    ) : (
                      <span className="text-zinc-300">
                        {shovelState.currentDurability} / {currentShovel.maxDurability}
                      </span>
                    )}
                  </div>
                  {currentShovel.tier !== 0 && (
                    <div className="w-full h-2 bg-zinc-900 border border-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-400 transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, (shovelState.currentDurability / currentShovel.maxDurability) * 100))}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTool === 'sword' && (
              <div className="bg-zinc-950 p-3 border-2 border-black rounded mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚔️</span>
                    <span className="font-black text-red-300 text-sm">{isEn ? currentSword.nameEn : currentSword.nameZh}</span>
                  </div>
                  <span className="text-xs font-mono text-red-300 font-bold bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                    {currentSword.attackDamage} ATK
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                  {currentSword.desc}
                </p>

                {/* Durability */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-zinc-400">{isEn ? 'Sword Durability' : '神劍耐久度'}</span>
                    <span className="text-zinc-300">
                      {swordState.currentDurability} / {currentSword.maxDurability}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 border border-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{ width: `${Math.max(0, Math.min(100, (swordState.currentDurability / currentSword.maxDurability) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Enchantments summary (Active for Pickaxe) */}
            <div className="bg-zinc-950 p-2.5 border border-zinc-800 rounded">
              <span className="text-[11px] font-black text-amber-300 block mb-1">
                {isEn ? 'Pickaxe Enchantments:' : '礦鎬附魔能力加成：'}
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1 bg-zinc-900 rounded border border-zinc-800 text-[10px]">
                  <span className="text-yellow-400 block font-mono">Lv.{pickaxeState.efficiencyLevel}</span>
                  <span className="text-zinc-400">{isEn ? 'Efficiency' : '效率'}</span>
                </div>
                <div className="p-1 bg-zinc-900 rounded border border-zinc-800 text-[10px]">
                  <span className="text-blue-400 block font-mono">Lv.{pickaxeState.unbreakingLevel}</span>
                  <span className="text-zinc-400">{isEn ? 'Unbreaking' : '耐久'}</span>
                </div>
                <div className="p-1 bg-zinc-900 rounded border border-zinc-800 text-[10px]">
                  <span className="text-emerald-400 block font-mono">Lv.{pickaxeState.fortuneLevel}</span>
                  <span className="text-zinc-400">{isEn ? 'Fortune' : '時運'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 border-t border-zinc-800 pt-2 mt-3 flex items-center justify-between">
            <span>{isEn ? 'Total Quarry Yield:' : '累積開採方塊：'}</span>
            <strong className="text-amber-300 font-mono font-black">{totalBlocksMined.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
