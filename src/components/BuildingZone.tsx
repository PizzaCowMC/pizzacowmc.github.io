import React, { useState, useRef, useEffect } from 'react';
import { BLOCK_TYPES } from '../data/gameData';
import { BlockTexture } from './BlockTexture';
import { sound } from '../utils/soundEffects';
import { Trash2, Hammer, ZoomIn, ZoomOut, Sparkles, Paintbrush, Wand2, ShieldAlert, Layers } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { BLUEPRINT_PRESETS, getPresetMaterialRequirements } from '../data/buildingPresets';

interface BuildingZoneProps {
  grid: (string | null)[];
  inventory: Record<string, number>;
  selectedBlockId: string;
  onPlaceBlock: (index: number) => void;
  onReclaimBlock: (index: number) => void;
  onClearAll: () => void;
  onLoadPreset?: (presetName: string) => void;
}

// Grid is 25 columns x 40 rows = 1,000 cells total.
export const BUILDING_GRID_COLS = 25;
export const BUILDING_GRID_TOTAL = 1000;

export const BuildingZone: React.FC<BuildingZoneProps> = ({
  grid,
  inventory,
  selectedBlockId,
  onPlaceBlock,
  onReclaimBlock,
  onClearAll,
  onLoadPreset
}) => {
  const { language, getName, t } = useLanguage();
  const isEn = language === 'en';

  const [zoomLevel, setZoomLevel] = useState<'compact' | 'normal' | 'large'>('normal');
  const [paintMode, setPaintMode] = useState<'paint' | 'reclaim'>('paint');
  const [inspectingBlueprint, setInspectingBlueprint] = useState<string | null>(null);
  const isMouseDownRef = useRef(false);

  const selectedBlock = BLOCK_TYPES.find(b => b.id === selectedBlockId) || BLOCK_TYPES[0];
  const currentCount = inventory[selectedBlockId] || 0;
  const placedCount = grid.filter(cell => cell !== null).length;
  const selectedBlockName = getName(selectedBlock);

  // Available blocks include current inventory plus placed blocks that would be reused
  const availableBlocks = React.useMemo(() => {
    const counts = { ...inventory };
    grid.forEach(cell => {
      if (cell) counts[cell] = (counts[cell] || 0) + 1;
    });
    return counts;
  }, [inventory, grid]);

  const getAffordability = (presetId: string) => {
    const reqs = getPresetMaterialRequirements(presetId);
    let canAfford = true;
    let missingCount = 0;
    for (const [blockId, count] of Object.entries(reqs)) {
      const has = availableBlocks[blockId] || 0;
      if (has < count) {
        canAfford = false;
        missingCount += (count - has);
      }
    }
    return { canAfford, missingCount, reqs };
  };

  // Global mouse up listener to terminate drag painting
  useEffect(() => {
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleSlotAction = (index: number, isDrag = false) => {
    const existing = grid[index];
    if (paintMode === 'reclaim') {
      if (existing !== null) {
        sound.playCrackSound();
        onReclaimBlock(index);
      }
      return;
    }

    // Default paint mode
    if (existing === null) {
      if (currentCount > 0) {
        if (!isDrag) sound.playPlaceBlockSound();
        onPlaceBlock(index);
      } else if (!isDrag) {
        sound.playHitSound(2);
      }
    } else if (!isDrag) {
      // Single click on existing block reclaims it
      sound.playCrackSound();
      onReclaimBlock(index);
    }
  };

  const handleMouseDown = (index: number) => {
    isMouseDownRef.current = true;
    handleSlotAction(index, false);
  };

  const handleMouseEnter = (index: number) => {
    if (isMouseDownRef.current) {
      handleSlotAction(index, true);
    }
  };

  // Dimensions based on zoom
  const cellClass =
    zoomLevel === 'compact'
      ? 'w-5 h-5 sm:w-6 sm:h-6 text-[8px]'
      : zoomLevel === 'large'
      ? 'w-9 h-9 sm:w-11 sm:h-11 text-xs'
      : 'w-7 h-7 sm:w-8 sm:h-8 text-[10px]';

  const textureSize =
    zoomLevel === 'compact' ? 18 : zoomLevel === 'large' ? 36 : 26;

  const occupancyPct = ((placedCount / BUILDING_GRID_TOTAL) * 100).toFixed(1);

  return (
    <section className="bg-[#242424] border-4 border-black p-5 shadow-[inset_-4px_-4px_0px_#111,inset_4px_4px_0px_#444] rounded-lg">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-dashed border-zinc-700">
        <div>
          <h2 className="text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000] flex items-center gap-2">
            <span>🏗️ {t('building.title')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
              {placedCount} / {BUILDING_GRID_TOTAL} {isEn ? 'placed' : '格已放置'} ({occupancyPct}%)
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isEn ? 'Selected Block:' : '當前選定放置：'} <span className="text-white font-bold">{selectedBlockName}</span>（{isEn ? 'Stock:' : '庫存：'}<span className={currentCount > 0 ? "text-emerald-400 font-mono font-bold" : "text-red-400 font-mono"}>{currentCount}</span>）
          </p>
        </div>

        {/* Clear, Zoom, and Mode controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom controls */}
          <div className="flex items-center bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
            <button
              onClick={() => setZoomLevel('compact')}
              title={isEn ? 'Compact View (25x40 full overview)' : '緊湊全覽 (縮小)'}
              className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 ${
                zoomLevel === 'compact' ? 'bg-amber-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ZoomOut className="w-3 h-3" />
              {isEn ? 'Small' : '小'}
            </button>
            <button
              onClick={() => setZoomLevel('normal')}
              title={isEn ? 'Standard View' : '標準大小'}
              className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 ${
                zoomLevel === 'normal' ? 'bg-amber-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isEn ? 'Normal' : '中'}
            </button>
            <button
              onClick={() => setZoomLevel('large')}
              title={isEn ? 'Large View (High Precision)' : '放大視角 (特大)'}
              className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 ${
                zoomLevel === 'large' ? 'bg-amber-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ZoomIn className="w-3 h-3" />
              {isEn ? 'Large' : '大'}
            </button>
          </div>

          {/* Paint Mode Toggle */}
          <div className="flex items-center bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
            <button
              onClick={() => setPaintMode('paint')}
              className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 cursor-pointer ${
                paintMode === 'paint' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Paintbrush className="w-3 h-3" />
              {isEn ? 'Paint' : '塗繪'}
            </button>
            <button
              onClick={() => setPaintMode('reclaim')}
              className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 cursor-pointer ${
                paintMode === 'reclaim' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Hammer className="w-3 h-3" />
              {isEn ? 'Eraser' : '回收'}
            </button>
          </div>

          {/* Clear All */}
          <button
            onClick={onClearAll}
            className="px-3.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#3f3f46,inset_2px_2px_0_#a1a1aa] transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            {t('building.clear')}
          </button>
        </div>
      </div>

      {/* Blueprint Presets Bar */}
      {onLoadPreset && (
        <div className="mb-3 p-2.5 bg-zinc-900/90 border border-zinc-700/80 rounded-lg space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? '1,000-Cell Blueprints:' : '1000格精選像素藍圖：'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded font-mono">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>{isEn ? 'Strict block consumption • No free blocks' : '嚴格扣除背包方塊・杜絕免費複製'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {BLUEPRINT_PRESETS.map((preset) => {
              const { canAfford, missingCount, reqs } = getAffordability(preset.id);
              const isSelected = inspectingBlueprint === preset.id;
              return (
                <div key={preset.id} className="relative flex items-center">
                  <button
                    onClick={() => onLoadPreset(preset.id)}
                    title={
                      canAfford
                        ? (isEn ? 'Click to construct blueprint (blocks will be deducted)' : '點擊建造藍圖（將扣除背包方塊）')
                        : (isEn ? `Missing ${missingCount} blocks! Click to check` : `尚缺 ${missingCount} 個方塊！點擊查看`)
                    }
                    className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all border ${
                      canAfford
                        ? 'bg-zinc-800 hover:bg-emerald-950 text-emerald-300 border-emerald-600/70 hover:border-emerald-400'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-700 hover:border-amber-600/60 hover:text-amber-300'
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <span>{isEn ? preset.nameEn : preset.nameZh}</span>
                    {canAfford ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ) : (
                      <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-800/60 font-mono">
                        缺{missingCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setInspectingBlueprint(isSelected ? null : preset.id)}
                    title={isEn ? 'View material breakdown' : '檢視材料清單'}
                    className="ml-0.5 px-1 py-1 text-[10px] text-zinc-400 hover:text-white bg-zinc-800/70 border border-zinc-700 rounded cursor-pointer"
                  >
                    ℹ️
                  </button>
                </div>
              );
            })}
          </div>

          {/* Material Requirement Inspector Card */}
          {inspectingBlueprint && (() => {
            const preset = BLUEPRINT_PRESETS.find(p => p.id === inspectingBlueprint);
            if (!preset) return null;
            const { canAfford, missingCount, reqs } = getAffordability(preset.id);
            return (
              <div className="mt-2 p-3 bg-zinc-950 border border-amber-600/40 rounded-lg text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{preset.icon}</span>
                    <span className="font-bold text-amber-300">{isEn ? preset.nameEn : preset.nameZh}</span>
                    <span className="text-zinc-400 font-mono">({preset.badge})</span>
                  </div>
                  <button
                    onClick={() => setInspectingBlueprint(null)}
                    className="text-zinc-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {isEn ? preset.descriptionEn : preset.descriptionZh}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {Object.entries(reqs).map(([blockId, needed]) => {
                    const blockObj = BLOCK_TYPES.find(b => b.id === blockId);
                    const has = availableBlocks[blockId] || 0;
                    const isEnough = has >= needed;
                    return (
                      <div
                        key={blockId}
                        className={`p-2 rounded border flex items-center justify-between text-[11px] ${
                          isEnough
                            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                            : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                        }`}
                      >
                        <span className="font-bold truncate mr-1">
                          {blockObj ? (isEn ? blockObj.nameEn : blockObj.nameZh) : blockId}
                        </span>
                        <span className="font-mono shrink-0">
                          {has} / {needed}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className={canAfford ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {canAfford
                      ? (isEn ? '✅ All materials ready in inventory' : '✅ 背包材料充足，可直接搭建！')
                      : (isEn ? `⚠️ Insufficient: Missing ${missingCount} blocks` : `⚠️ 背包材料不足：共缺少 ${missingCount} 個方塊`)}
                  </span>
                  <button
                    onClick={() => {
                      onLoadPreset(preset.id);
                      setInspectingBlueprint(null);
                    }}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded cursor-pointer active:scale-95"
                  >
                    {isEn ? 'Construct' : '確認搭建'}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Progress Bar for 1,000 Cells */}
      <div className="mb-3 bg-zinc-950 border border-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${Math.min(100, (placedCount / BUILDING_GRID_TOTAL) * 100)}%` }}
        />
      </div>

      {/* 25x40 (1,000-cell) Building Grid */}
      <div className="flex justify-center overflow-auto py-2 max-h-[460px] border border-zinc-800 rounded bg-zinc-950/40 select-none">
        <div
          className="grid gap-1 p-3 bg-zinc-950 border-4 border-black rounded shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"
          style={{ gridTemplateColumns: `repeat(${BUILDING_GRID_COLS}, minmax(0, 1fr))` }}
        >
          {grid.map((blockId, index) => {
            const hasBlock = blockId !== null;
            const placedBlockObj = hasBlock ? BLOCK_TYPES.find(b => b.id === blockId) : null;
            const placedBlockName = placedBlockObj ? getName(placedBlockObj) : '';

            return (
              <button
                key={index}
                id={`build-slot-${index}`}
                onMouseDown={() => handleMouseDown(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                title={hasBlock ? `${placedBlockName} (${isEn ? 'Click to reclaim' : '點擊回收'})` : `${isEn ? 'Empty Slot' : '空位格'} #${index + 1} (${isEn ? 'Click to place' : '點擊放置'} ${selectedBlockName})`}
                className={`${cellClass} border-2 border-black rounded flex items-center justify-center transition-all duration-75 relative group select-none ${
                  hasBlock
                    ? 'hover:brightness-110 active:scale-90'
                    : 'bg-[#181818] hover:bg-zinc-800 active:scale-95 shadow-[inset_1px_1px_0_#333,inset_-1px_-1px_0_#000]'
                }`}
              >
                {hasBlock ? (
                  <BlockTexture blockId={blockId} size={textureSize} />
                ) : (
                  <span className="opacity-0 group-hover:opacity-40 text-zinc-500 font-mono select-none">
                    +
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 mt-2 px-1 gap-2">
        <span>
          💡 {isEn
            ? 'Tip: Drag mouse across grid to paint continuously! Switch to Eraser to reclaim. Placed blocks return 100% to inventory.'
            : '提示：按住滑鼠拖曳可連續塗繪放置！切換至「回收」可連續抹除回收。所有放置方塊 100% 完整回收進背包。'}
        </span>
        <span className="font-mono text-amber-400">
          {isEn ? `Canvas: ${BUILDING_GRID_COLS} Cols × ${BUILDING_GRID_TOTAL / BUILDING_GRID_COLS} Rows (1,000 Cells)` : `畫布規格：${BUILDING_GRID_COLS} 列 × ${BUILDING_GRID_TOTAL / BUILDING_GRID_COLS} 行 (全域共 1,000 格)`}
        </span>
      </div>
    </section>
  );
};
