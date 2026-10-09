import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEffects';
import {
  Pickaxe,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Compass,
  MapPin,
  Hotel,
  Coffee,
  Sparkles,
  Waves,
  Maximize2,
  Minimize2,
  Gamepad2,
  Zap,
  Info
} from 'lucide-react';
import { OverworldZone } from '../types';
import { SkyIslandTransition } from './SkyIslandTransition';
import { PlayerSprite } from './PlayerSprite';
import { BuildingSite, getNearLotId } from './BuildingSite';
import { BuildingLotId, getBuildingLot } from '../data/buildingLots';

interface OverworldMapProps {
  onEnterZone: (zone: OverworldZone) => void;
  isEn: boolean;
  coins: number;
  activeOrdersCount: number;
  readyDishesCount: number;
  playerName?: string;
  avatarIcon?: string;
  skinId?: string;
  initialPos?: { x: number; y: number };
  onOpenEncyclopedia?: () => void;
  onOpenMusicPlayer?: () => void;
  onOpenBlacksmith?: () => void;
  unlockedBlacksmithCount?: number;
  playerLevel?: number;
  branch2Unlocked?: boolean;
  onArriveAtSkyIsland?: () => void;
  onSetPlayerLevel?: (lvl: number) => void;
  onOpenHotel?: () => void;
  /** 進入地圖時所在區域:main = 主地圖,site = 地圖左側的建築工地 */
  initialArea?: 'main' | 'site';
  lotGrids?: Record<string, (string | null)[]>;
  onEnterLot?: (lotId: BuildingLotId) => void;
}

export const OverworldMap: React.FC<OverworldMapProps> = ({
  onEnterZone,
  isEn,
  coins,
  activeOrdersCount,
  readyDishesCount,
  playerName = 'Miner Barista',
  avatarIcon = '⛏️',
  skinId = 'steve',
  initialPos,
  onOpenEncyclopedia,
  onOpenMusicPlayer,
  onOpenBlacksmith,
  unlockedBlacksmithCount = 0,
  playerLevel = 0,
  branch2Unlocked = false,
  onArriveAtSkyIsland,
  onSetPlayerLevel,
  onOpenHotel,
  initialArea = 'main',
  lotGrids = {},
  onEnterLot
}) => {
  // Player coordinate on map (in percentage: 0 to 100)
  // Default spawn at the central crossroads plaza
  const [pos, setPos] = useState<{ x: number; y: number }>(() => initialPos || { x: 50, y: 44 });
  const [facing, setFacing] = useState<'left' | 'right' | 'up' | 'down'>('down');
  // 地圖區域:主地圖 (main) 或 左側的建築工地 (site)
  const [area, setArea] = useState<'main' | 'site'>(initialArea);
  const posRef = useRef(pos);
  const areaRef = useRef(area);
  posRef.current = pos;
  areaRef.current = area;
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [footsteps, setFootsteps] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextFootstepId = useRef(0);

  // Independent Map HUD state
  const [viewMode, setViewMode] = useState<'normal' | 'expanded' | 'wide'>('expanded');
  const [showTouchDPad, setShowTouchDPad] = useState<boolean>(true);

  // Sync initialPos if updated from outside
  useEffect(() => {
    if (initialPos) {
      setPos(initialPos);
      setArea(initialArea);
      areaRef.current = initialArea;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPos]);

  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Sky Island unlock requirement: Rank 15!
  const isSkyIslandUnlocked = playerLevel >= 15;
  const [isAscending, setIsAscending] = useState<boolean>(false);
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  const inMain = area === 'main';
  // 建築工地:靠近哪一塊工地
  const nearLotId: BuildingLotId | null = area === 'site' ? getNearLotId(pos) : null;

  // Logical proximity zones for the expanded 6-landmark world:
  // 1. Cafe: Top-left area (x <= 35, y <= 40)
  const nearCafe = inMain && ((pos.x <= 35 && pos.y <= 40) || getDistance(pos, { x: 18, y: 22 }) <= 17);
  // 2. Mysterious Sky Island: Top-center floating zone (x: 35 to 65, y <= 32)
  const nearSkyIsland = inMain && ((pos.x >= 35 && pos.x <= 65 && pos.y <= 32) || getDistance(pos, { x: 50, y: 16 }) <= 18);
  // 3. Leisure Resort Hotel: Top-right area (x >= 65, y <= 42)
  const nearHotel = inMain && ((pos.x >= 65 && pos.y <= 42) || getDistance(pos, { x: 82, y: 22 }) <= 18);
  // 4. Quarry Pit: Bottom-left mine (x <= 35, y >= 56)
  const nearQuarry = inMain && ((pos.x <= 35 && pos.y >= 56) || getDistance(pos, { x: 18, y: 76 }) <= 18);
  // 5. Redstone Blacksmith: Bottom-center forge (x: 35 to 65, y >= 56)
  const nearBlacksmith = inMain && ((pos.x >= 35 && pos.x <= 65 && pos.y >= 56) || getDistance(pos, { x: 50, y: 76 }) <= 18);
  // 6. Elevator Tower: Bottom-right express tower (x >= 65, y >= 50)
  const nearElevator = inMain && ((pos.x >= 65 && pos.y >= 50) || getDistance(pos, { x: 82, y: 74 }) <= 18);

  // Current zone label for the GPS HUD
  const getCurrentAreaName = () => {
    if (area === 'site') {
      if (nearLotId) {
        const lot = getBuildingLot(nearLotId);
        return `${lot.emoji} ${isEn ? lot.nameEn : lot.nameZh}`;
      }
      return isEn ? '🏗️ Construction Site (West)' : '🏗️ 建築工地(地圖左側)';
    }
    if (nearHotel) return isEn ? '🏨 Resort Hotel & Spa District' : '🏨 休閒渡假旅館・溫泉特區';
    if (nearCafe) return isEn ? '☕ Mining Cafe Square' : '☕ 礦業咖啡廳廣場';
    if (nearSkyIsland) return isEn ? '☁️ Sky Island Ascension Portal' : '☁️ 神秘空島飛升口';
    if (nearQuarry) return isEn ? '⛏️ Subterranean Mine Entrance' : '⛏️ 地底採掘礦坑入口';
    if (nearBlacksmith) return isEn ? '🔨 Redstone Forge Works' : '🔨 紅石自動鐵匠鋪';
    if (nearElevator) return isEn ? '🛗 Steam Elevator Tower' : '🛗 蒸氣直達電梯塔台';
    return isEn ? '🌲 Overworld Forest Crossroads' : '🌲 大地圖森林十字大道';
  };

  const handleTriggerSkyIsland = () => {
    if (!isSkyIslandUnlocked) {
      sound.playCrackSound ? sound.playCrackSound() : sound.playClickSound();
      setShowLockedModal(true);
    } else {
      sound.playUpgradeSound();
      setIsAscending(true);
    }
  };

  const handleAscensionComplete = () => {
    setIsAscending(false);
    if (onArriveAtSkyIsland) {
      onArriveAtSkyIsland();
    } else {
      onEnterZone('cafe');
    }
  };

  const handleTriggerHotel = () => {
    sound.playDoorSound ? sound.playDoorSound() : sound.playClickSound();
    if (onOpenHotel) {
      onOpenHotel();
    } else {
      onEnterZone('hotel');
    }
  };

  // Add subtle footstep particle
  const triggerFootstep = (x: number, y: number) => {
    const id = nextFootstepId.current++;
    setFootsteps(prev => [...prev.slice(-10), { id, x, y }]);
  };

  // Fast Travel teleport shortcut
  const handleFastTravel = (target: 'site' | 'cafe' | 'island' | 'hotel' | 'quarry' | 'forge' | 'elevator') => {
    sound.playClickSound();
    setIsWalking(true);
    setArea(target === 'site' ? 'site' : 'main');
    areaRef.current = target === 'site' ? 'site' : 'main';
    switch (target) {
      case 'site':
        setPos({ x: 90, y: 47 });
        setFacing('left');
        break;
      case 'cafe':
        setPos({ x: 26, y: 26 });
        setFacing('up');
        break;
      case 'island':
        setPos({ x: 50, y: 24 });
        setFacing('up');
        break;
      case 'hotel':
        setPos({ x: 78, y: 26 });
        setFacing('up');
        break;
      case 'quarry':
        setPos({ x: 26, y: 70 });
        setFacing('down');
        break;
      case 'forge':
        setPos({ x: 50, y: 70 });
        setFacing('down');
        break;
      case 'elevator':
        setPos({ x: 78, y: 70 });
        setFacing('down');
        break;
    }
    setTimeout(() => setIsWalking(false), 200);
  };

  // ===== 區域切換:主地圖最左側 ←→ 建築工地最右側 =====
  const GATE_BAND_MIN = 34;
  const GATE_BAND_MAX = 62;
  const isInGateBand = (y: number) => y >= GATE_BAND_MIN && y <= GATE_BAND_MAX;

  const switchArea = (next: 'main' | 'site', x: number, y: number, face: 'left' | 'right') => {
    sound.playDoorSound ? sound.playDoorSound() : sound.playClickSound();
    setArea(next);
    areaRef.current = next;
    const p = { x, y };
    posRef.current = p;
    setPos(p);
    setFacing(face);
    setFootsteps([]);
    setIsWalking(true);
    setTimeout(() => setIsWalking(false), 300);
  };

  // 統一的移動入口:走出主地圖左緣 → 建築工地;走出工地右緣 → 回主地圖
  const applyMove = (rawX: number, rawY: number) => {
    const y = Math.min(92, Math.max(8, rawY));
    if (areaRef.current === 'main' && rawX < 6 && isInGateBand(y)) {
      switchArea('site', 92, y, 'left');
      return;
    }
    if (areaRef.current === 'site' && rawX > 94 && isInGateBand(y)) {
      switchArea('main', 8, y, 'right');
      return;
    }
    const x = Math.min(94, Math.max(6, rawX));
    triggerFootstep(x, y);
    const p = { x, y };
    posRef.current = p;
    setPos(p);
  };

  // Keyboard movement handler
  useEffect(() => {
    const speed = 2.5;
    let stepTimer: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      let dx = 0;
      let dy = 0;
      let newFacing = facing;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        dy -= speed;
        newFacing = 'up';
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        dy += speed;
        newFacing = 'down';
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dx -= speed;
        newFacing = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dx += speed;
        newFacing = 'right';
      } else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
        // Interact / Enter trigger
        if (areaRef.current === 'site') {
          if (nearLotId && onEnterLot) {
            sound.playClickSound();
            onEnterLot(nearLotId);
          }
        } else if (nearHotel) {
          handleTriggerHotel();
        } else if (nearSkyIsland) {
          handleTriggerSkyIsland();
        } else if (nearCafe) {
          sound.playClickSound();
          onEnterZone('cafe');
        } else if (nearQuarry) {
          sound.playClickSound();
          onEnterZone('quarry');
        } else if (nearElevator) {
          sound.playClickSound();
          onEnterZone('elevator');
        } else if (nearBlacksmith && onOpenBlacksmith) {
          sound.playClickSound();
          onOpenBlacksmith();
        }
        return;
      } else {
        return;
      }

      setFacing(newFacing);
      setIsWalking(true);

      applyMove(posRef.current.x + dx, posRef.current.y + dy);

      if (stepTimer) clearTimeout(stepTimer);
      stepTimer = setTimeout(() => setIsWalking(false), 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (stepTimer) clearTimeout(stepTimer);
    };
  }, [facing, area, nearLotId, onEnterLot, nearCafe, nearQuarry, nearElevator, nearSkyIsland, nearBlacksmith, nearHotel, onEnterZone, onOpenBlacksmith, onOpenHotel, isSkyIslandUnlocked]);

  // Click on map to move
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const targetX = Math.min(94, Math.max(6, clickX));
    const targetY = Math.min(92, Math.max(8, clickY));

    if (Math.abs(targetX - pos.x) > Math.abs(targetY - pos.y)) {
      setFacing(targetX < pos.x ? 'left' : 'right');
    } else {
      setFacing(targetY < pos.y ? 'up' : 'down');
    }

    setIsWalking(true);
    applyMove(clickX, targetY);

    setTimeout(() => setIsWalking(false), 300);
  };

  return (
    <div className="w-full flex flex-col items-center select-none animate-in fade-in duration-300">
      <style>{`
        @keyframes owSlideFromLeft { from { transform: translateX(-9%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes owSlideFromRight { from { transform: translateX(9%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .ow-slide-from-left { animation: owSlideFromLeft 0.38s ease-out; }
        .ow-slide-from-right { animation: owSlideFromRight 0.38s ease-out; }
      `}</style>

      {/* ================= INDEPENDENT MAP INTERFACE HUD ================= */}
      <div className="w-full max-w-6xl mb-3 space-y-2">
        {/* Top Control Header */}
        <div className="px-4 py-2.5 bg-zinc-950/95 border-2 border-emerald-700/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xl text-xs backdrop-blur-md">
          {/* Left: Map Title & Coordinates HUD */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-950 to-green-900 border border-emerald-500/60 rounded-xl text-emerald-300 font-black font-minecraft shadow-sm">
              <span className="text-base animate-pulse">🗺️</span>
              <span className="tracking-wide">{isEn ? 'Overworld Map (Independent Hub)' : '1F 大地圖獨立探索系統'}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-200 rounded font-mono">
                LIVE
              </span>
            </div>

            {/* GPS & Compass */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-black/60 border border-zinc-700 rounded-lg text-zinc-300 font-mono text-[11px]">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span className="text-cyan-300 font-bold">X: {pos.x.toFixed(0)}% • Y: {pos.y.toFixed(0)}%</span>
              <span className="text-zinc-600">|</span>
              <span className="text-amber-300 font-bold">{getCurrentAreaName()}</span>
            </div>
          </div>

          {/* Right: Viewport Controls, Audio & Encyclopedia */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-zinc-700">
              <button
                onClick={() => setViewMode('normal')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  viewMode === 'normal' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isEn ? 'Standard' : '標準'}
              </button>
              <button
                onClick={() => setViewMode('expanded')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  viewMode === 'expanded' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isEn ? 'Expanded' : '擴展全景'}
              </button>
            </div>

            {/* Touch D-Pad Toggle */}
            <button
              onClick={() => setShowTouchDPad(!showTouchDPad)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                showTouchDPad
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600/80'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}
              title={isEn ? 'Toggle Touch D-Pad' : '切換方向鍵控制面板'}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'D-Pad' : '虛擬按鍵'}</span>
            </button>

            {onOpenHotel && (
              <button
                onClick={() => {
                  sound.playClickSound();
                  onOpenHotel();
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-700 to-amber-800 hover:from-yellow-600 hover:to-amber-700 border border-yellow-400/80 rounded-xl text-yellow-100 font-black font-minecraft active:scale-95 cursor-pointer shadow transition-all"
                title={isEn ? 'Direct Access: Leisure Resort Hotel' : '直接前往：休閒渡假旅館'}
              >
                <span>🏨</span>
                <span>{isEn ? 'Resort Hotel' : '休閒旅館'}</span>
              </button>
            )}

            {onOpenEncyclopedia && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClickSound();
                  onOpenEncyclopedia();
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-600/60 rounded-xl text-amber-200 font-bold active:scale-95 cursor-pointer shadow transition-all"
                title={isEn ? 'Encyclopedia' : '百科全書'}
              >
                <span>📖</span>
                <span className="hidden sm:inline">{isEn ? 'Wiki' : '百科'}</span>
              </button>
            )}

            {onOpenMusicPlayer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClickSound();
                  onOpenMusicPlayer();
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-amber-300 font-bold active:scale-95 cursor-pointer shadow transition-all"
                title={isEn ? 'Jukebox' : '唱片機'}
              >
                <span>💽</span>
              </button>
            )}
          </div>
        </div>

        {/* Fast Travel / Landmark Navigation Portal Bar */}
        <div className="px-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mr-2 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Fast Travel Portals:' : '地標導航傳送：'}</span>
          </span>

          <button
            onClick={() => handleFastTravel('site')}
            className={`px-3 py-1 rounded-lg border font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              area === 'site' ? 'bg-orange-600 text-white border-orange-300 shadow' : 'bg-gradient-to-r from-orange-950 to-zinc-900 text-orange-300 border-orange-700 hover:border-orange-500'
            }`}
            title={isEn ? 'West of the map: walk left from the main road to reach it' : '位於地圖左側:從主幹道一路往左走也能抵達'}
          >
            <span>🏗️</span>
            <span>{isEn ? '◀ Construction Site' : '◀ 建築工地'}</span>
            <span className="text-[9px] px-1 bg-orange-400/20 rounded text-orange-200">NEW</span>
          </button>

          <button
            onClick={() => handleFastTravel('cafe')}
            className={`px-3 py-1 rounded-lg border font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              nearCafe ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-[#222] text-zinc-300 border-zinc-700 hover:bg-[#333]'
            }`}
          >
            <span>☕</span>
            <span>{isEn ? '2F Cafe' : '超級咖啡廳'}</span>
          </button>

          <button
            onClick={() => handleFastTravel('island')}
            className={`px-3 py-1 rounded-lg border font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              nearSkyIsland ? 'bg-purple-600 text-white border-purple-400 shadow' : 'bg-[#222] text-zinc-300 border-zinc-700 hover:bg-[#333]'
            }`}
          >
            <span>☁️</span>
            <span>{isEn ? 'Sky Island' : '神秘空島'}</span>
          </button>

          <button
            onClick={() => handleFastTravel('hotel')}
            className={`px-3 py-1 rounded-lg border font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              nearHotel ? 'bg-amber-600 text-white border-amber-400 shadow animate-pulse' : 'bg-gradient-to-r from-amber-950 to-zinc-900 text-amber-300 border-amber-700 hover:border-amber-500'
            }`}
          >
            <span>🏨</span>
            <span className="font-minecraft font-black">{isEn ? 'Resort Hotel' : '休閒旅館 (溫泉・吧台)'}</span>
            <span className="text-[9px] px-1 bg-amber-400/20 rounded text-amber-200">NEW</span>
          </button>

          <button
            onClick={() => handleFastTravel('quarry')}
            className={`px-3 py-1 rounded-lg border font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              nearQuarry ? 'bg-amber-600 text-white border-amber-400 shadow' : 'bg-[#222] text-zinc-300 border-zinc-700 hover:bg-[#333]'
            }`}
          >
            <span>⛏️</span>
            <span>{isEn ? 'Mine Shaft' : '採掘礦坑'}</span>
          </button>

          <button
            onClick={() => handleFastTravel('forge')}
            className={`px-3 py-1 rounded-lg border font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              nearBlacksmith ? 'bg-amber-600 text-white border-amber-400 shadow' : 'bg-[#222] text-zinc-300 border-zinc-700 hover:bg-[#333]'
            }`}
          >
            <span>🔨</span>
            <span>{isEn ? 'Redstone Forge' : '紅石鐵匠鋪'}</span>
          </button>

          <button
            onClick={() => handleFastTravel('elevator')}
            className={`px-3 py-1 rounded-lg border font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              nearElevator ? 'bg-cyan-600 text-white border-cyan-400 shadow' : 'bg-[#222] text-zinc-300 border-zinc-700 hover:bg-[#333]'
            }`}
          >
            <span>🛗</span>
            <span>{isEn ? 'Elevator' : '直達電梯'}</span>
          </button>
        </div>
      </div>

      {/* ================= EXPANDED OVERWORLD MAP CANVAS ================= */}
      <div
        onClick={handleMapClick}
        className={`relative w-full max-w-6xl transition-all duration-300 border-4 border-[#143015] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] cursor-crosshair ${
          viewMode === 'normal' ? 'aspect-[16/9] min-h-[480px]' : 'min-h-[580px] sm:min-h-[660px]'
        }`}
        style={
          area === 'site'
            ? {
                backgroundColor: '#8a6d3b',
                backgroundImage: `
                  radial-gradient(#9c7c46 15%, transparent 16%),
                  radial-gradient(#76592e 15%, transparent 16%)
                `,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }
            : {
                backgroundColor: '#276228',
                backgroundImage: `
                  radial-gradient(#388139 15%, transparent 16%),
                  radial-gradient(#205121 15%, transparent 16%)
                `,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }
        }
      >
        {/* ===== 主地圖內容 (area === 'main') ===== */}
        {area === 'main' && (
        <div className="absolute inset-0 ow-slide-from-right">
        {/* Pixel Grass Tufts, Wildflowers & Forest Flora */}
        <div className="absolute inset-0 pointer-events-none opacity-45">
          <div className="absolute top-[8%] left-[46%] text-xs">🌿</div>
          <div className="absolute top-[25%] left-[64%] text-xs">🌼</div>
          <div className="absolute top-[68%] left-[72%] text-xs">🌹</div>
          <div className="absolute top-[88%] left-[58%] text-xs">🌿</div>
          <div className="absolute top-[18%] left-[12%] text-xs">🌼</div>
          <div className="absolute top-[82%] left-[10%] text-xs">🍄</div>
          <div className="absolute top-[48%] left-[8%] text-xs">🌾</div>
          <div className="absolute top-[48%] right-[8%] text-xs">🌲</div>
          <div className="absolute top-[75%] left-[48%] text-xs">🌷</div>
        </div>

        {/* ================= HIGHWAY & ROAD SYSTEM ================= */}
        {/* 1. CENTRAL MAIN EAST-WEST HIGHWAY */}
        <div
          className="absolute left-[2%] right-[2%] top-[40%] h-[14%] bg-[#57534e] border-y-4 border-[#292524] shadow-[0_6px_20px_rgba(0,0,0,0.5)] z-0 flex items-center justify-around"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #57534e, #57534e 20px, #44403c 20px, #44403c 40px)'
          }}
        >
          <div className="w-full border-t-2 border-dashed border-amber-200/40" />
        </div>

        {/* 2. NORTH ROAD TO CAFE */}
        <div
          className="absolute left-[16%] top-[14%] w-[10%] h-[28%] bg-[#57534e] border-x-4 border-[#292524] z-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #57534e, #57534e 20px, #44403c 20px, #44403c 40px)'
          }}
        >
          <div className="h-full border-l-2 border-dashed border-amber-200/40 ml-[48%]" />
        </div>

        {/* 3. NORTH ROAD TO SKY ISLAND PORTAL */}
        <div
          className="absolute left-[45%] top-[12%] w-[10%] h-[30%] bg-[#57534e] border-x-4 border-[#292524] z-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #57534e, #57534e 20px, #44403c 20px, #44403c 40px)'
          }}
        >
          <div className="h-full border-l-2 border-dashed border-purple-300/40 ml-[48%]" />
        </div>

        {/* 4. NORTH ROAD TO RESORT HOTEL */}
        <div
          className="absolute right-[16%] top-[14%] w-[10%] h-[28%] bg-[#6b4e3d] border-x-4 border-[#3b2314] z-0 shadow-md"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #6b4e3d, #6b4e3d 20px, #523829 20px, #523829 40px)'
          }}
        >
          <div className="h-full border-l-2 border-dashed border-yellow-300/40 ml-[48%]" />
        </div>

        {/* 5. SOUTH ROAD TO QUARRY */}
        <div
          className="absolute left-[16%] top-[52%] w-[11%] h-[38%] bg-[#44403c] border-x-4 border-[#1c1917] z-0 shadow-lg flex flex-col justify-around items-center"
        >
          <div className="w-[70%] h-full flex justify-between border-x-2 border-zinc-400/80 relative">
            <div className="w-full h-full flex flex-col justify-between py-1 pointer-events-none">
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
            </div>
          </div>
        </div>

        {/* 6. SOUTH ROAD TO FORGE */}
        <div
          className="absolute left-[45%] top-[52%] w-[10%] h-[38%] bg-[#44403c] border-x-4 border-[#1c1917] z-0"
        />

        {/* 7. SOUTH ROAD TO ELEVATOR */}
        <div
          className="absolute right-[16%] top-[52%] w-[10%] h-[38%] bg-[#3f3f46] border-x-4 border-[#18181b] z-0"
        />

        {/* Central Crossroads Cobblestone Plaza */}
        <div className="absolute left-[34%] top-[39%] w-[32%] h-[16%] bg-[#78716c] border-4 border-[#292524] rounded-2xl z-0 flex items-center justify-center shadow-inner">
          <div className="text-[11px] text-amber-300 font-black font-minecraft flex items-center gap-1.5 opacity-80">
            <span>⛲</span>
            <span>{isEn ? '✦ Central Grand Crossroads Plaza ✦' : '✦ 中央星芒大廣場 ✦'}</span>
          </div>
        </div>

        {/* Wooden Directional Signpost at Crossroads */}
        <div className="absolute left-[58%] top-[36%] z-10 pointer-events-none">
          <div className="bg-amber-900/95 border-2 border-amber-600 px-2 py-1 rounded-md text-[9px] font-minecraft text-amber-200 shadow-xl flex flex-col gap-0.5">
            <div>{isEn ? '◀ Construction Site' : '◀ 建築工地 (往左走)'}</div>
            <div>{isEn ? '↖ 2F Cafe' : '↖ 2F 咖啡廳'}</div>
            <div>{isEn ? '↗ Hotel Resort' : '↗ 休閒旅館 (溫泉/吧台)'}</div>
            <div>{isEn ? '↙ Quarry Mine' : '↙ 地底礦坑'}</div>
            <div>{isEn ? '↘ Elevator' : '↘ 直達電梯'}</div>
          </div>
          <div className="w-1.5 h-4 bg-amber-950 mx-auto" />
        </div>

        {/* Interactive Minecraft Jukebox Block on Crossroads Plaza */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playClickSound();
            if (onOpenMusicPlayer) onOpenMusicPlayer();
          }}
          className="absolute left-[48%] top-[42%] z-10 cursor-pointer group flex flex-col items-center hover:scale-110 transition-transform"
          title={isEn ? 'Redstone Jukebox (Click to open BGM Player)' : '紅石唱片機 (點擊開啟音樂播放器)'}
        >
          <div className="w-8 h-8 rounded bg-[#452817] border-2 border-[#824d2c] shadow-lg flex items-center justify-center relative group-hover:border-amber-400">
            <span className="text-sm">💽</span>
            <span className="absolute -top-3 -right-2 text-[10px] animate-bounce">🎵</span>
          </div>
          <span className="text-[8px] bg-black/85 px-1 py-0.2 rounded font-minecraft text-amber-300 whitespace-nowrap mt-0.5 border border-amber-700/80 shadow">
            {isEn ? 'Jukebox' : '唱片機'}
          </span>
        </div>

        {/* ================= 1. CAFE BUILDING (Top-Left: x: 2%~30%, y: 4%~36%) ================= */}
        <div className="absolute left-[2%] top-[3%] w-[30%] h-[35%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClickSound();
              onEnterZone('cafe');
            }}
            className={`relative w-full h-full bg-[#fefce8] border-4 border-[#15803d] rounded-2xl shadow-2xl flex flex-col p-2.5 overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer ${
              nearCafe ? 'ring-4 ring-emerald-300 animate-pulse' : ''
            }`}
          >
            {/* Cafe Awning */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[92%] h-7 bg-[#16a34a] border-b-4 border-[#15803d] rounded-t-xl flex items-center justify-center shadow">
              <span className="text-white text-[10px] font-black tracking-wider uppercase">☕ 2F MINING CAFE</span>
            </div>

            <div className="mt-3 flex-1 flex flex-col justify-between items-center text-center">
              <div className="flex items-center gap-1.5 bg-[#15803d]/10 px-2.5 py-0.5 rounded-full border border-[#16a34a]/30">
                <span className="text-base">☕</span>
                <span className="text-xs sm:text-sm font-black text-[#15803d] font-minecraft">
                  {isEn ? 'Super Mining Cafe' : '超級咖啡廳'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-bold">
                <span>{activeOrdersCount > 0 ? (isEn ? `🔥 ${activeOrdersCount} Waiting` : `🔥 ${activeOrdersCount} 顧客候餐`) : (isEn ? '✨ Open' : '✨ 營業中')}</span>
                <span>•</span>
                <span>{isEn ? '1,000 Recipes' : '1,000 道料理'}</span>
              </div>

              {/* Enter Cafe Porch Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClickSound();
                  onEnterZone('cafe');
                }}
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <span>☕</span>
                <span>{isEn ? 'ENTER CAFE' : '進入咖啡廳大廳'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 2. MYSTERIOUS SKY ISLAND (Top-Center: x: 34%~66%, y: 2%~32%) ================= */}
        <div className="absolute left-[34%] top-[2%] w-[32%] h-[33%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerSkyIsland();
            }}
            className={`relative w-full h-full bg-[#18112e]/95 border-4 ${
              isSkyIslandUnlocked ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)]' : 'border-amber-600/80 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
            } rounded-2xl flex flex-col p-2.5 overflow-hidden group hover:scale-[1.02] transition-transform text-white cursor-pointer ${
              nearSkyIsland ? 'ring-4 ring-purple-300 animate-pulse bg-[#251747]' : ''
            }`}
          >
            {/* Sky Island Floating Banner */}
            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-[94%] h-6 ${
              isSkyIslandUnlocked
                ? 'bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-800 border-purple-400'
                : 'bg-gradient-to-r from-amber-950 via-purple-950 to-amber-950 border-amber-500'
            } border-b-2 rounded-t-xl flex items-center justify-center gap-1 shadow`}>
              <span className="text-amber-300 text-xs">☁️</span>
              <span className="text-white text-[9px] font-black tracking-wider uppercase font-minecraft">
                {isEn ? '2ND BRANCH • SKY ISLAND (REQ RANK 15)' : '第二分店 • 神秘空島'}
              </span>
            </div>

            <div className="mt-3 flex-1 flex flex-col justify-between items-center text-center">
              <div className="flex items-center gap-1.5 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-400/50">
                <span className="text-base">🏝️</span>
                <span className="text-xs sm:text-sm font-black text-purple-200 font-minecraft">
                  {isEn ? 'Mysterious Sky Island' : '神秘空島'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-purple-200/90 font-bold">
                <span>{isSkyIslandUnlocked ? (isEn ? '✨ Rank 15 Unlocked' : '✨ 已解鎖') : `🔒 Lv.${playerLevel}/15`}</span>
                <span>•</span>
                <span>{isEn ? '12 Tables' : '星空露天座'}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerSkyIsland();
                }}
                className={`w-full py-1.5 font-black text-xs rounded-xl border-2 shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1 font-minecraft ${
                  isSkyIslandUnlocked
                    ? 'bg-purple-600 hover:bg-purple-500 text-white border-amber-300'
                    : 'bg-amber-950/90 text-amber-200 border-amber-500'
                }`}
              >
                <span>{isSkyIslandUnlocked ? '🚀' : '🔒'}</span>
                <span>{isSkyIslandUnlocked ? (isEn ? 'ASCEND' : '前往空島') : (isEn ? 'LOCKED (Lv.15)' : '未解鎖 (需Lv.15)')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 3. LEISURE RESORT HOTEL & HOT SPRINGS (Top-Right: x: 68%~98%, y: 3%~36%) ================= */}
        <div className="absolute right-[2%] top-[3%] w-[30%] h-[35%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerHotel();
            }}
            className={`relative w-full h-full bg-[#241a12] border-4 border-[#d97706] rounded-2xl shadow-2xl flex flex-col p-2.5 overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer text-white ${
              nearHotel ? 'ring-4 ring-amber-300 animate-pulse bg-[#332215]' : ''
            }`}
          >
            {/* Hotel Roof Chalet Trim */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[94%] h-7 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 border-b-4 border-amber-800 rounded-t-xl flex items-center justify-center gap-1.5 shadow">
              <span className="text-amber-200 text-xs animate-bounce">♨️</span>
              <span className="text-white text-[10px] font-black tracking-wider uppercase font-minecraft">
                {isEn ? 'LEISURE RESORT HOTEL & SPA' : '🏨 休閒渡假旅館 • 露天溫泉'}
              </span>
              <span className="text-amber-200 text-xs animate-bounce">♨️</span>
            </div>

            <div className="mt-3 flex-1 flex flex-col justify-between items-center text-center">
              {/* Hotel Title & Badges */}
              <div className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/60">
                <span className="text-base">🏨</span>
                <span className="text-xs sm:text-sm font-black text-amber-200 font-minecraft">
                  {isEn ? 'Cozy Leisure Hotel' : '休閒旅館'}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-rose-950 text-rose-300 rounded font-bold border border-rose-700">
                  ♨️ 溫泉水療
                </span>
              </div>

              {/* Facility Icons preview */}
              <div className="flex items-center justify-around w-full px-1 text-[11px] bg-black/40 py-1 rounded-lg border border-amber-900/60 text-amber-300">
                <span title="邊喝咖啡邊掛機吧台">☕ 吧台</span>
                <span>•</span>
                <span title="經典鎬具合成進化樹">⛏️ 鎬具樹</span>
                <span>•</span>
                <span title="即時伺服器狀態">🌐 伺服器</span>
                <span>•</span>
                <span title="老鐵店長 AI">👨‍🌾 老鐵</span>
                <span>•</span>
                <span title="建築藍圖工坊">📐 藍圖</span>
              </div>

              {/* Enter Hotel Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerHotel();
                }}
                className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl border-2 border-amber-200 shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5 font-minecraft shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              >
                <span>🏨</span>
                <span>{isEn ? 'ENTER HOTEL' : '進入 休閒旅館'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4. QUARRY MINE SHAFT (Bottom-Left: x: 2%~30%, y: 58%~96%) ================= */}
        <div className="absolute left-[2%] bottom-[3%] w-[30%] h-[36%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClickSound();
              onEnterZone('quarry');
            }}
            className={`relative w-full h-full bg-[#1c1917] border-4 border-black rounded-2xl shadow-2xl flex flex-col p-2.5 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform text-white ${
              nearQuarry ? 'ring-4 ring-amber-400 bg-zinc-900' : ''
            }`}
          >
            <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-1">
              <div className="flex items-center gap-1.5">
                <Pickaxe className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-black text-amber-300 font-minecraft">
                  {isEn ? 'Quarry Mine Pit' : '地底採掘礦坑'}
                </span>
              </div>
              <span className="text-[10px] bg-red-950 px-1.5 py-0.2 rounded text-red-300 border border-red-700 font-mono font-bold">
                {isEn ? 'B1~B10' : '10層'}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-between px-1 my-1">
              <div className="flex flex-col text-left text-[10px] text-zinc-300">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <span>⛏️</span>
                  <span>{isEn ? 'Mine for rare ores' : '深入地層開採方塊'}</span>
                </div>
                <div className="text-zinc-400 text-[9px] line-clamp-1">
                  {isEn ? 'Supplies cafe ingredients' : '供應千道料理食材'}
                </div>
              </div>

              <div className="flex gap-1 text-base bg-black/50 p-1 rounded-lg border border-zinc-700">
                <span>💎</span>
                <span>🌋</span>
                <span>🪙</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClickSound();
                onEnterZone('quarry');
              }}
              className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>⛏️</span>
              <span>{isEn ? 'ENTER MINE' : '進入 採掘礦坑'}</span>
            </button>
          </div>
        </div>

        {/* ================= 5. REDSTONE BLACKSMITH (Bottom-Center: x: 34%~66%, y: 58%~96%) ================= */}
        <div className="absolute left-[34%] bottom-[3%] w-[32%] h-[36%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClickSound();
              if (onOpenBlacksmith) onOpenBlacksmith();
            }}
            className={`relative w-full h-full bg-[#1c1410] border-4 border-amber-600 rounded-2xl shadow-2xl flex flex-col p-2.5 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform text-white ${
              nearBlacksmith ? 'ring-4 ring-amber-400 bg-[#291b15]' : ''
            }`}
          >
            <div className="flex items-center justify-between border-b-2 border-amber-950 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base animate-pulse">🔨</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 font-minecraft">
                  {isEn ? 'Redstone Forge' : '紅石鐵匠鋪'}
                </span>
              </div>
              <span className="text-[10px] bg-amber-950 px-1.5 py-0.2 rounded text-amber-300 border border-amber-700 font-minecraft font-bold">
                {unlockedBlacksmithCount}/100 種
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between my-1 py-0.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-300">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <span>⚙️</span>
                  <span>{isEn ? 'Auto-Gather Modules' : '自動採集模組'}</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold">
                  {Math.round((unlockedBlacksmithCount / 100) * 100)}%
                </span>
              </div>

              <div className="bg-black/60 p-1 rounded-lg border border-amber-900/60 flex items-center justify-around text-base">
                <span>🔥</span>
                <span>🛠️</span>
                <span className="animate-pulse">🤖</span>
                <span>💎</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClickSound();
                if (onOpenBlacksmith) onOpenBlacksmith();
              }}
              className="w-full py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5 font-minecraft"
            >
              <span>🔨</span>
              <span>{isEn ? 'ENTER FORGE' : '進入 鐵匠鋪'}</span>
            </button>
          </div>
        </div>

        {/* ================= 6. REDSTONE STEAM ELEVATOR TOWER (Bottom-Right: x: 68%~98%, y: 54%~96%) ================= */}
        <div className="absolute right-[2%] bottom-[3%] w-[30%] h-[38%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClickSound();
              onEnterZone('elevator');
            }}
            className={`relative w-full h-full bg-[#18181b] border-4 border-cyan-800 rounded-2xl shadow-2xl flex flex-col p-2.5 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform text-white ${
              nearElevator ? 'ring-4 ring-cyan-400' : ''
            }`}
          >
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base animate-spin-slow">⚙️</span>
                <span className="text-xs sm:text-sm font-black text-cyan-300 font-minecraft">
                  {isEn ? 'Elevator Tower' : '蒸氣電梯塔'}
                </span>
              </div>
              <span className="text-[10px] bg-cyan-950 px-1.5 py-0.2 rounded text-cyan-300 border border-cyan-700 font-mono">
                B10 ~ 4F
              </span>
            </div>

            <div className="flex-1 my-1 flex items-center justify-between px-2 bg-black/60 border border-zinc-800 rounded-lg">
              <span className="text-2xl">🛗</span>
              <div className="text-right text-[10px] text-zinc-300 font-mono">
                <div className="text-cyan-300 font-bold">{isEn ? 'High Speed Transit' : '極速直達傳送'}</div>
                <div className="text-zinc-400">{isEn ? 'Cafe • Mine • Strata' : '咖啡廳 • 礦坑 • 地層'}</div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClickSound();
                onEnterZone('elevator');
              }}
              className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>🛗</span>
              <span>{isEn ? 'RIDE ELEVATOR' : '搭乘 紅石電梯'}</span>
            </button>
          </div>
        </div>

        {/* 左側入口告示牌:往左走 → 建築工地 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClickSound();
            switchArea('site', 92, 47, 'left');
          }}
          className="absolute left-[0.5%] top-[43%] z-20 px-2 py-1 bg-orange-900/95 border-2 border-orange-500 rounded-md text-[9px] font-minecraft text-orange-100 shadow-xl animate-pulse cursor-pointer hover:bg-orange-800"
          title={isEn ? 'Walk left to reach the Construction Site' : '往左走就會到建築工地'}
        >
          {isEn ? '◀ Construction Site' : '◀ 建築工地'}
        </button>
        </div>
        )}

        {/* ===== 地圖左側:建築工地 (area === 'site') ===== */}
        {area === 'site' && (
          <div className="absolute inset-0 ow-slide-from-left">
            <BuildingSite
              isEn={isEn}
              nearLotId={nearLotId}
              lotGrids={lotGrids}
              onEnterLot={(id) => onEnterLot && onEnterLot(id)}
              onLeaveSite={() => switchArea('main', 8, 47, 'right')}
            />
          </div>
        )}

        {/* 7. FOOTSTEP PARTICLES */}
        {footsteps.map(f => (
          <div
            key={f.id}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-60 transition-opacity duration-1000"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-stone-400 border border-stone-600" />
          </div>
        ))}

        {/* 8. PLAYER AVATAR ON MAP */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="flex flex-col items-center">
            {/* Player Name Tag */}
            <div className="px-2.5 py-0.5 bg-black/90 border border-amber-400/90 rounded-md text-[10px] font-bold text-amber-200 whitespace-nowrap mb-1 shadow-lg flex items-center gap-1.5 font-minecraft">
              <PlayerSprite skinId={skinId} size="xs" headOnly />
              <span>{playerName}</span>
            </div>

            {/* Walking Character Sprite */}
            <div
              className={`transition-transform duration-100 ${
                isWalking ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <PlayerSprite
                skinId={skinId}
                size="lg"
                isWalking={isWalking}
                facing={facing}
                showTool={true}
                glow={true}
              />
            </div>

            {/* Character Shadow */}
            <div className="w-10 h-2 bg-black/60 rounded-full blur-[1px] mt-1" />
          </div>
        </div>

        {/* 9a. 建築工地互動提示 */}
        {area === 'site' && nearLotId && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 bg-black/95 border-3 border-amber-400 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="text-2xl">{getBuildingLot(nearLotId).emoji}</span>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-black text-amber-300 font-minecraft">
                {isEn
                  ? `Press [E] or Click to Build: ${getBuildingLot(nearLotId).nameEn}`
                  : `按 [E] 或點擊進入「${getBuildingLot(nearLotId).nameZh}」施工`}
              </div>
              <div className="text-[10px] text-zinc-400">
                {isEn ? getBuildingLot(nearLotId).taglineEn : getBuildingLot(nearLotId).taglineZh}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClickSound();
                if (onEnterLot) onEnterLot(nearLotId);
              }}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-lg border border-black shadow active:scale-95 cursor-pointer font-minecraft"
            >
              {isEn ? 'BUILD' : '開始施工'}
            </button>
          </div>
        )}

        {/* 9. INTERACTION PROMPT POPUP (When near any zone) */}
        {(nearCafe || nearQuarry || nearElevator || nearSkyIsland || nearHotel || nearBlacksmith) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 bg-black/95 border-3 border-amber-400 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="text-2xl">
              {nearHotel ? '🏨' : nearSkyIsland ? '☁️' : nearCafe ? '☕' : nearQuarry ? '⛏️' : nearBlacksmith ? '🔨' : '🛗'}
            </span>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-black text-amber-300 font-minecraft">
                {nearHotel
                  ? (isEn ? 'Press [E] or Click to Enter Resort Hotel' : '按 [E] 或點擊進入「休閒渡假旅館」')
                  : nearSkyIsland
                  ? isSkyIslandUnlocked
                    ? (isEn ? 'Press [E] or Click to Travel to Sky Island' : '按 [E] 或點擊「前往神秘空島」')
                    : (isEn ? `🔒 Sky Island Locked (Requires Rank 15)` : `🔒 神秘空島未解鎖（需 Rank 15）`)
                  : nearCafe
                  ? (isEn ? 'Press [E] or Click to Enter Cafe' : '按 [E] 或點擊進入「超級咖啡廳」')
                  : nearQuarry
                  ? (isEn ? 'Press [E] or Click to Enter Quarry Mine' : '按 [E] 或點擊進入「地底採掘礦坑」')
                  : nearBlacksmith
                  ? (isEn ? 'Press [E] or Click to Enter Forge' : '按 [E] 或點擊進入「紅石鐵匠鋪」')
                  : (isEn ? 'Press [E] or Click to Enter Elevator' : '按 [E] 或點擊搭乘「紅石電梯」')}
              </div>
              <div className="text-[10px] text-zinc-400">
                {nearHotel
                  ? (isEn ? 'Coffee Lounge • Pickaxe Tree • Server Monitor • AI Barista • Hot Springs Spa' : '掛機吧台 • 鎬具樹 • 伺服器狀態 • 老鐵AI店長 • 建築藍圖 • 露天溫泉水療')
                  : nearSkyIsland
                  ? (isEn ? 'Ascend to Branch #2 (Celestial Starlight Realm)' : '抵達第二分店・星空祕境露天分店')
                  : nearCafe
                  ? (isEn ? 'Serve guests & cook 1,000 gourmet recipes' : '製作千道料理、招呼入座顧客')
                  : nearQuarry
                  ? (isEn ? 'Descend into deep underground strata for mineral ores' : '沿著礦軌直達萬丈地底，採掘各層礦石方塊')
                  : nearBlacksmith
                  ? (isEn ? '100 automatic gathering modules & analytics' : '100種自動採集魔像模組與鍛造分析')
                  : (isEn ? 'High-speed transit between B10 and 4F' : '雙向高速穿梭於地表、咖啡廳與地下10大地層')}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (nearHotel) {
                  handleTriggerHotel();
                } else if (nearSkyIsland) {
                  handleTriggerSkyIsland();
                } else if (nearCafe) {
                  sound.playClickSound();
                  onEnterZone('cafe');
                } else if (nearQuarry) {
                  sound.playClickSound();
                  onEnterZone('quarry');
                } else if (nearBlacksmith && onOpenBlacksmith) {
                  sound.playClickSound();
                  onOpenBlacksmith();
                } else {
                  sound.playClickSound();
                  onEnterZone('elevator');
                }
              }}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-lg border border-black shadow active:scale-95 cursor-pointer font-minecraft"
            >
              {nearSkyIsland ? (isSkyIslandUnlocked ? (isEn ? 'TRAVEL' : '前往空島') : (isEn ? 'LOCKED' : '查看解鎖')) : (isEn ? 'ENTER' : '立即進入')}
            </button>
          </div>
        )}
      </div>

      {/* ================= TOUCH CONTROLS / D-PAD (MOBILE & TABLET) ================= */}
      {showTouchDPad && (
        <div className="flex items-center justify-center gap-4 mt-4 select-none">
          <div className="grid grid-cols-3 gap-2 bg-zinc-950/90 p-2.5 rounded-2xl border-2 border-zinc-700 shadow-2xl backdrop-blur-sm">
            <div />
            <button
              onClick={() => {
                setFacing('up');
                setPos(p => ({ ...p, y: Math.max(8, p.y - 4) }));
                triggerFootstep(pos.x, Math.max(8, pos.y - 4));
              }}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95 cursor-pointer"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <div />

            <button
              onClick={() => {
                setFacing('left');
                applyMove(posRef.current.x - 4, posRef.current.y);
              }}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                if (nearLotId && onEnterLot) onEnterLot(nearLotId);
                else if (nearHotel) handleTriggerHotel();
                else if (nearSkyIsland) handleTriggerSkyIsland();
                else if (nearCafe) onEnterZone('cafe');
                else if (nearQuarry) onEnterZone('quarry');
                else if (nearBlacksmith && onOpenBlacksmith) onOpenBlacksmith();
                else if (nearElevator) onEnterZone('elevator');
              }}
              className="w-12 h-12 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-xl flex items-center justify-center text-black font-black text-xs border border-black shadow active:scale-95 cursor-pointer font-minecraft"
            >
              {nearLotId ? getBuildingLot(nearLotId).emoji : nearHotel ? '🏨' : nearSkyIsland ? '☁️' : nearCafe ? '☕' : nearQuarry ? '⛏️' : nearBlacksmith ? '🔨' : area === 'site' ? '🏗️' : '🛗'}
            </button>
            <button
              onClick={() => {
                setFacing('right');
                applyMove(posRef.current.x + 4, posRef.current.y);
              }}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            <div />
            <button
              onClick={() => {
                setFacing('down');
                setPos(p => ({ ...p, y: Math.min(92, p.y + 4) }));
                triggerFootstep(pos.x, Math.min(92, pos.y + 4));
              }}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95 cursor-pointer"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <div />
          </div>
        </div>
      )}

      {/* FULLSCREEN SKY ISLAND ASCENSION TRANSITION */}
      {isAscending && (
        <SkyIslandTransition
          isEn={isEn}
          playerLevel={playerLevel}
          avatarIcon={avatarIcon}
          onComplete={handleAscensionComplete}
          onCancel={() => setIsAscending(false)}
        />
      )}

      {/* LOCKED SKY ISLAND MODAL */}
      {showLockedModal && (
        <div
          onClick={() => setShowLockedModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#18112e] border-4 border-purple-500 rounded-2xl shadow-2xl p-6 text-white font-minecraft relative space-y-4 text-center"
          >
            <button
              onClick={() => setShowLockedModal(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white text-lg cursor-pointer bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-700"
            >
              ✕
            </button>

            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-purple-950/80 border-2 border-purple-400 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                🏝️
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-sm shadow animate-pulse">
                🔒
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-purple-300 font-bold">
                {isEn ? 'Branch #2 Celestial Starlight' : '第二分店・星空祕境露天分店'}
              </div>
              <h3 className="text-xl font-black text-amber-300 mt-1">
                {isEn ? 'Mysterious Sky Island Locked (Requires Rank 15)' : '神秘空島尚未解鎖（需 Rank 15）'}
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {isEn
                ? 'Traveling to the Mysterious Sky Island (Branch #2) requires Adventurer Rank 15 to activate the aether flight and open the starlight terrace.'
                : '前往神秘空島（第二分店・星空祕境）需要冒險家等級達到 Rank 15，方能承受浮空風壓並開啟星空露天露台！'}
            </p>

            <div className="p-3 bg-black/60 rounded-xl border border-purple-900/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{isEn ? 'Adventurer Rank Progress:' : '冒險家等級進度：'}</span>
                <span className="text-amber-400 font-mono font-bold">
                  Lv.{playerLevel} / 15
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${Math.min(100, Math.max(5, (playerLevel / 15) * 100))}%` }}
                />
              </div>
              <div className="text-[11px] text-amber-300 font-bold">
                {isEn
                  ? `${Math.max(0, 15 - playerLevel)} more level(s) needed to unlock Sky Island!`
                  : `還需提升 ${Math.max(0, 15 - playerLevel)} 個等級即可解鎖神秘空島！`}
              </div>
            </div>

            <button
              onClick={() => setShowLockedModal(false)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl border-2 border-purple-300 shadow active:scale-95 cursor-pointer transition-all font-minecraft"
            >
              {isEn ? 'Understood! I will keep leveling up' : '知道了！我會繼續努力升級'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
