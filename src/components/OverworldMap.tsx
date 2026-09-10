import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEffects';
import { Pickaxe, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { OverworldZone } from '../types';

interface OverworldMapProps {
  onEnterZone: (zone: OverworldZone) => void;
  isEn: boolean;
  coins: number;
  activeOrdersCount: number;
  readyDishesCount: number;
  playerName?: string;
  avatarIcon?: string;
  initialPos?: { x: number; y: number };
  onOpenEncyclopedia?: () => void;
}

export const OverworldMap: React.FC<OverworldMapProps> = ({
  onEnterZone,
  isEn,
  coins,
  activeOrdersCount,
  readyDishesCount,
  playerName = 'Miner Barista',
  avatarIcon = '⛏️',
  initialPos,
  onOpenEncyclopedia
}) => {
  // Player coordinate on map (in percentage: 0 to 100)
  // Default spawn at the central crossroads
  const [pos, setPos] = useState<{ x: number; y: number }>(() => initialPos || { x: 50, y: 44 });
  const [facing, setFacing] = useState<'left' | 'right' | 'up' | 'down'>('down');
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [footsteps, setFootsteps] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextFootstepId = useRef(0);

  // Sync initialPos if updated from outside
  useEffect(() => {
    if (initialPos) {
      setPos(initialPos);
    }
  }, [initialPos]);

  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Logical proximity zones:
  // 1. Cafe: Top-left area (x <= 42, y <= 38)
  const nearCafe = (pos.x <= 42 && pos.y <= 38) || getDistance(pos, { x: 28, y: 22 }) <= 16;
  // 2. Quarry: South road & bottom mine pit (y >= 62, x <= 62) - perfectly aligned with walking down!
  const nearQuarry = (pos.y >= 62 && pos.x <= 62) || getDistance(pos, { x: 36, y: 76 }) <= 20;
  // 3. Elevator: East elevator tower (x >= 64, y >= 20, y <= 78)
  const nearElevator = (pos.x >= 64 && pos.y >= 20 && pos.y <= 78) || getDistance(pos, { x: 80, y: 46 }) <= 18;

  // Add subtle footstep particle
  const triggerFootstep = (x: number, y: number) => {
    const id = nextFootstepId.current++;
    setFootsteps(prev => [...prev.slice(-10), { id, x, y }]);
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
        if (nearCafe) {
          sound.playClickSound();
          onEnterZone('cafe');
        } else if (nearQuarry) {
          sound.playClickSound();
          onEnterZone('quarry');
        } else if (nearElevator) {
          sound.playClickSound();
          onEnterZone('elevator');
        }
        return;
      } else {
        return;
      }

      setFacing(newFacing);
      setIsWalking(true);

      setPos(prev => {
        const nextX = Math.min(94, Math.max(6, prev.x + dx));
        const nextY = Math.min(90, Math.max(10, prev.y + dy));
        triggerFootstep(nextX, nextY);
        return { x: nextX, y: nextY };
      });

      if (stepTimer) clearTimeout(stepTimer);
      stepTimer = setTimeout(() => setIsWalking(false), 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (stepTimer) clearTimeout(stepTimer);
    };
  }, [facing, nearCafe, nearQuarry, nearElevator, onEnterZone]);

  // Click on map to move
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const targetX = Math.min(94, Math.max(6, clickX));
    const targetY = Math.min(90, Math.max(10, clickY));

    if (Math.abs(targetX - pos.x) > Math.abs(targetY - pos.y)) {
      setFacing(targetX < pos.x ? 'left' : 'right');
    } else {
      setFacing(targetY < pos.y ? 'up' : 'down');
    }

    setIsWalking(true);
    triggerFootstep(targetX, targetY);
    setPos({ x: targetX, y: targetY });

    setTimeout(() => setIsWalking(false), 300);
  };

  return (
    <div className="w-full flex flex-col items-center select-none animate-in fade-in duration-300">
      {/* Control Banner & Quick Stats */}
      <div className="w-full max-w-5xl mb-3 px-4 py-2.5 bg-zinc-950/95 border-2 border-zinc-800 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 rounded-lg text-amber-300 font-bold font-minecraft">
            <span className="text-base">🗺️</span>
            <span>{isEn ? 'Overworld Map Exploration' : '1F 地面大地圖探索'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[11px] font-mono border border-zinc-700">W A S D</span>
            <span>/</span>
            <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[11px] font-mono border border-zinc-700">{isEn ? 'Arrow Keys or Click Ground' : '方向鍵 或 點擊地面行走'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          {onOpenEncyclopedia && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClickSound();
                onOpenEncyclopedia();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-800/90 hover:bg-amber-700 border border-amber-500/80 rounded-lg text-amber-100 font-bold font-minecraft active:scale-95 cursor-pointer shadow transition-all hover:brightness-110"
              title={isEn ? 'Open Minecraft Encyclopedia' : '開啟 Minecraft 百科全書'}
            >
              <span>📖</span>
              <span>{isEn ? 'Encyclopedia' : '百科全書'}</span>
            </button>
          )}

          <div className="px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-700 text-zinc-300 flex items-center gap-1">
            <span>🪙</span>
            <strong className="text-amber-300">{coins.toLocaleString()}</strong>
          </div>
          <div className="px-2.5 py-1 bg-emerald-950/70 border border-emerald-700/60 rounded-lg text-emerald-300 flex items-center gap-1">
            <span>☕</span>
            <span>{isEn ? 'Kitchen: ' : '備餐: '}</span>
            <strong className="text-amber-200">{readyDishesCount}</strong>
          </div>
        </div>
      </div>

      {/* OVERWORLD MAP CANVAS CONTAINER */}
      <div
        onClick={handleMapClick}
        className="relative w-full max-w-5xl aspect-[16/9] min-h-[440px] border-4 border-[#143015] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-crosshair"
        style={{
          backgroundColor: '#2d6a2e',
          backgroundImage: `
            radial-gradient(#3a853b 15%, transparent 16%),
            radial-gradient(#245825 15%, transparent 16%)
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      >
        {/* Pixel Grass Tufts & Wildflower Details */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[8%] left-[45%] text-xs">🌿</div>
          <div className="absolute top-[25%] left-[62%] text-xs">🌼</div>
          <div className="absolute top-[65%] left-[70%] text-xs">🌹</div>
          <div className="absolute top-[85%] left-[58%] text-xs">🌿</div>
          <div className="absolute top-[18%] left-[12%] text-xs">🌼</div>
          <div className="absolute top-[80%] left-[10%] text-xs">🍄</div>
        </div>

        {/* ================= ROAD NETWORK ================= */}
        {/* 1. CENTRAL EAST-WEST HIGHWAY (Cobblestone Highway) */}
        <div
          className="absolute left-0 right-[24%] top-[38%] h-[14%] bg-[#57534e] border-y-4 border-[#292524] shadow-[0_4px_16px_rgba(0,0,0,0.4)] z-0 flex items-center justify-around"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #57534e, #57534e 20px, #44403c 20px, #44403c 40px)'
          }}
        >
          <div className="w-full border-t-2 border-dashed border-amber-200/40" />
        </div>

        {/* 2. NORTH ROAD TO CAFE (Turning up from Crossroads) */}
        <div
          className="absolute left-[24%] top-[14%] w-[12%] h-[26%] bg-[#57534e] border-x-4 border-[#292524] z-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #57534e, #57534e 20px, #44403c 20px, #44403c 40px)'
          }}
        >
          <div className="h-full border-l-2 border-dashed border-amber-200/40 ml-[48%]" />
        </div>

        {/* 3. SOUTH ROAD TO QUARRY (The Red Arrow Path! Directly under Crossroads) */}
        <div
          className="absolute left-[36%] top-[50%] w-[15%] h-[38%] bg-[#44403c] border-x-4 border-[#1c1917] z-0 shadow-lg flex flex-col justify-around items-center"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #44403c, #44403c 16px, #292524 16px, #292524 32px)'
          }}
        >
          {/* Minecart Rails & Wooden Ties */}
          <div className="w-[70%] h-full flex justify-between border-x-2 border-zinc-400/80 relative">
            <div className="w-full h-full flex flex-col justify-between py-1 pointer-events-none">
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
              <div className="w-full h-1 bg-amber-900 border-t border-amber-950" />
            </div>
            {/* South Road Direction Indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-60 text-amber-200 text-xs font-minecraft pointer-events-none">
              <span>{isEn ? '▼ Quarry Mine ▼' : '▼ 採掘礦坑 ▼'}</span>
            </div>
          </div>
        </div>

        {/* Central Crossroads Cobblestone Plaza */}
        <div className="absolute left-[35%] top-[38%] w-[17%] h-[14%] bg-[#78716c] border-4 border-[#292524] rounded-lg z-0 flex items-center justify-center shadow-inner">
          <div className="text-[10px] text-amber-300 font-bold font-minecraft opacity-70">
            {isEn ? '✦ Crossroads ✦' : '✦ 十字路口 ✦'}
          </div>
        </div>

        {/* Wooden Directional Signpost at Crossroads */}
        <div className="absolute left-[54%] top-[26%] z-10 pointer-events-none">
          <div className="bg-amber-900/95 border-2 border-amber-600 px-2 py-1 rounded-md text-[9px] font-minecraft text-amber-200 shadow-xl flex flex-col gap-0.5">
            <div>{isEn ? '⬆ 2F Cafe' : '⬆ 2F 咖啡廳'}</div>
            <div>{isEn ? '⬇ B1~B10 Mine' : '⬇ B1~B10 礦坑'}</div>
            <div>{isEn ? '➡ Elevator' : '➡ 直達電梯'}</div>
          </div>
          <div className="w-1.5 h-4 bg-amber-950 mx-auto" />
        </div>

        {/* ================= 1. CAFE BUILDING (Top-Left) ================= */}
        <div className="absolute left-[3%] top-[4%] w-[29%] h-[38%] z-10">
          <div className="relative w-full h-full bg-[#fefce8] border-4 border-[#15803d] rounded-2xl shadow-2xl flex flex-col p-2.5 overflow-hidden group hover:scale-[1.02] transition-transform">
            {/* Cafe Awning */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[92%] h-8 bg-[#16a34a] border-b-4 border-[#15803d] rounded-t-xl flex items-center justify-center shadow">
              <span className="text-white text-[11px] font-black tracking-wider">☕ 2F MINING CAFE</span>
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-between items-center text-center">
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
                className={`w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  nearCafe ? 'ring-4 ring-emerald-300 animate-pulse bg-emerald-500' : ''
                }`}
              >
                <span>☕</span>
                <span>{isEn ? 'ENTER CAFE' : '進入咖啡廳大廳'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 2. QUARRY MINE SHAFT (Bottom & South Path) ================= */}
        {/* Directly at the end of the South Road! */}
        <div className="absolute left-[8%] bottom-[4%] w-[44%] h-[38%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClickSound();
              onEnterZone('quarry');
            }}
            className={`relative w-full h-full bg-[#1c1917] border-4 border-black rounded-2xl shadow-2xl flex flex-col p-3 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform text-white ${
              nearQuarry ? 'ring-4 ring-amber-400 bg-zinc-900' : ''
            }`}
          >
            {/* Rocky Cavern Title */}
            <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-1">
              <div className="flex items-center gap-2">
                <Pickaxe className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-black text-amber-300 font-minecraft">
                  {isEn ? 'Quarry Mine Pit' : '地底採掘礦坑 (豎井入口)'}
                </span>
              </div>
              <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded text-red-300 border border-red-700 font-mono font-bold">
                {isEn ? '10 Strata B1~B10' : '10 大地層 B1~B10'}
              </span>
            </div>

            {/* Cavern Scenery & Rails */}
            <div className="flex-1 flex items-center justify-between px-2">
              <div className="flex flex-col text-left text-[10px] text-zinc-300">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <span>⛏️</span>
                  <span>{isEn ? 'Dig deep for rare ores!' : '深入地層開採各色方塊！'}</span>
                </div>
                <div className="text-zinc-400">
                  {isEn ? 'Ingredients fuel 1,000 gourmet cafe recipes' : '供應咖啡廳 1,000 道傳奇料理專屬食材'}
                </div>
              </div>

              {/* Ore Chunks visual */}
              <div className="flex gap-1 text-lg bg-black/50 p-1.5 rounded-lg border border-zinc-700">
                <span>💎</span>
                <span>🌋</span>
                <span>🪙</span>
              </div>
            </div>

            {/* Enter Quarry Button Pad */}
            <div className="w-full pt-1 flex items-center justify-between gap-2 border-t border-zinc-700">
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-minecraft">
                <span>🚃</span>
                <span>{isEn ? 'Minecart Track' : '直通地下礦坑軌道'}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClickSound();
                  onEnterZone('quarry');
                }}
                className={`px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center gap-1.5 ${
                  nearQuarry ? 'ring-2 ring-amber-200 animate-bounce' : ''
                }`}
              >
                <span>⛏️</span>
                <span>{isEn ? 'ENTER MINE' : '進入 採掘礦坑'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 3. REDSTONE STEAM ELEVATOR TOWER (Right) ================= */}
        <div className="absolute right-[2%] top-[10%] w-[25%] h-[82%] z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClickSound();
              onEnterZone('elevator');
            }}
            className={`relative w-full h-full bg-[#18181b] border-4 border-cyan-800 rounded-2xl shadow-2xl flex flex-col p-3 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform text-white ${
              nearElevator ? 'ring-4 ring-cyan-400' : ''
            }`}
            style={{
              backgroundImage: 'radial-gradient(#0e7490 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          >
            {/* Top Gear / Wheel of elevator */}
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base animate-spin">⚙️</span>
                <span className="text-xs sm:text-sm font-black text-cyan-300 font-minecraft">
                  {isEn ? 'Elevator Tower' : '紅石蒸氣電梯塔'}
                </span>
              </div>
              <span className="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-700">
                {isEn ? 'Express' : '直達傳送'}
              </span>
            </div>

            {/* Elevator shaft cables & floor display */}
            <div className="flex-1 my-2 flex flex-col items-center justify-between border-2 border-zinc-800 rounded-lg p-2 bg-black/60">
              <div className="flex items-center gap-1 font-mono text-xs text-amber-400 font-bold">
                <span>▲</span>
                <span>{isEn ? 'B10 ~ 4F Express' : 'B10 ~ 4F 直達'}</span>
                <span>▼</span>
              </div>

              {/* Elevator Cabin Indicator */}
              <div className="w-16 h-20 bg-gradient-to-b from-cyan-900 to-zinc-900 border-2 border-cyan-400 rounded-lg flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <span className="text-2xl">🛗</span>
                <span className="text-[9px] font-black text-cyan-200">EXPRESS</span>
              </div>

              <div className="w-full flex justify-around text-[10px] text-zinc-400">
                <span>{isEn ? 'Cafe 2F' : '咖啡廳 2F'}</span>
                <span>•</span>
                <span>{isEn ? 'Mine B10' : '礦坑 B10'}</span>
              </div>
            </div>

            {/* Elevator Ride Button */}
            <div className="w-full pt-1 border-t-2 border-zinc-800 flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClickSound();
                  onEnterZone('elevator');
                }}
                className={`w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  nearElevator ? 'ring-2 ring-cyan-200 animate-pulse bg-cyan-400' : ''
                }`}
              >
                <span>🛗</span>
                <span>{isEn ? 'RIDE ELEVATOR' : '搭乘紅石電梯'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8. FOOTSTEP PARTICLES */}
        {footsteps.map(f => (
          <div
            key={f.id}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-60 transition-opacity duration-1000"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-stone-400 border border-stone-600" />
          </div>
        ))}

        {/* 9. PLAYER AVATAR ON MAP */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="flex flex-col items-center">
            {/* Player Name Tag */}
            <div className="px-2 py-0.5 bg-black/85 border border-amber-400/80 rounded-md text-[10px] font-bold text-amber-200 whitespace-nowrap mb-1 shadow-md flex items-center gap-1 font-minecraft">
              <span>{avatarIcon}</span>
              <span>{playerName}</span>
            </div>

            {/* Walking Character Sprite */}
            <div
              className={`w-10 h-10 bg-amber-900 border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-2xl transition-transform ${
                isWalking ? 'scale-110 -rotate-6' : ''
              }`}
            >
              {avatarIcon}
            </div>

            {/* Character Shadow */}
            <div className="w-8 h-2 bg-black/50 rounded-full blur-[1px] mt-0.5" />
          </div>
        </div>

        {/* 10. INTERACTION PROMPT POPUP (When near any zone) */}
        {(nearCafe || nearQuarry || nearElevator) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 bg-black/95 border-3 border-amber-400 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="text-xl">
              {nearCafe ? '☕' : nearQuarry ? '⛏️' : '🛗'}
            </span>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-black text-amber-300 font-minecraft">
                {nearCafe
                  ? (isEn ? 'Press [E] or Click to Enter Cafe' : '按 [E] 或點擊進入「超級咖啡廳」')
                  : nearQuarry
                  ? (isEn ? 'Press [E] or Click to Enter Quarry Mine' : '按 [E] 或點擊進入「地底採掘礦坑」')
                  : (isEn ? 'Press [E] or Click to Enter Elevator' : '按 [E] 或點擊搭乘「紅石電梯」')}
              </div>
              <div className="text-[10px] text-zinc-400">
                {nearCafe
                  ? (isEn ? 'Manage 1,000 gourmet dishes & serve guests' : '製作千道料理、招呼入座顧客')
                  : nearQuarry
                  ? (isEn ? 'Descend into deep underground strata for mineral ores' : '沿著礦軌直達萬丈地底，採掘各層礦石食材')
                  : (isEn ? 'High-speed transit between B10 and 4F' : '雙向高速穿梭於地表、咖啡廳與地下10大地層')}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClickSound();
                if (nearCafe) onEnterZone('cafe');
                else if (nearQuarry) onEnterZone('quarry');
                else onEnterZone('elevator');
              }}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-lg border border-black shadow active:scale-95 cursor-pointer font-minecraft"
            >
              {isEn ? 'ENTER' : '立即進入'}
            </button>
          </div>
        )}
      </div>

      {/* MOBILE / TOUCH CONTROLS (D-PAD) */}
      <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
        <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-2 rounded-2xl border-2 border-zinc-700 shadow-lg">
          <div />
          <button
            onClick={() => {
              setFacing('up');
              setPos(p => ({ ...p, y: Math.max(10, p.y - 5) }));
            }}
            className="w-11 h-11 bg-zinc-800 active:bg-zinc-700 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          <button
            onClick={() => {
              setFacing('left');
              setPos(p => ({ ...p, x: Math.max(6, p.x - 5) }));
            }}
            className="w-11 h-11 bg-zinc-800 active:bg-zinc-700 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (nearCafe) onEnterZone('cafe');
              else if (nearQuarry) onEnterZone('quarry');
              else if (nearElevator) onEnterZone('elevator');
            }}
            className="w-11 h-11 bg-emerald-600 active:bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xs border border-emerald-400 shadow active:scale-95"
          >
            {isEn ? 'ENTER' : '進入'}
          </button>
          <button
            onClick={() => {
              setFacing('right');
              setPos(p => ({ ...p, x: Math.min(94, p.x + 5) }));
            }}
            className="w-11 h-11 bg-zinc-800 active:bg-zinc-700 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div />
          <button
            onClick={() => {
              setFacing('down');
              setPos(p => ({ ...p, y: Math.min(90, p.y + 5) }));
            }}
            className="w-11 h-11 bg-zinc-800 active:bg-zinc-700 rounded-xl flex items-center justify-center text-white border border-zinc-600 shadow active:scale-95"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};
