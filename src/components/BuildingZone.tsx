import React from 'react';
import { BLOCK_TYPES } from '../data/gameData';
import { BlockTexture } from './BlockTexture';
import { sound } from '../utils/soundEffects';
import { Trash2, Hammer } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface BuildingZoneProps {
  grid: (string | null)[];
  inventory: Record<string, number>;
  selectedBlockId: string;
  onPlaceBlock: (index: number) => void;
  onReclaimBlock: (index: number) => void;
  onClearAll: () => void;
}

export const BuildingZone: React.FC<BuildingZoneProps> = ({
  grid,
  inventory,
  selectedBlockId,
  onPlaceBlock,
  onReclaimBlock,
  onClearAll
}) => {
  const { language, getName, t } = useLanguage();
  const isEn = language === 'en';

  const selectedBlock = BLOCK_TYPES.find(b => b.id === selectedBlockId) || BLOCK_TYPES[0];
  const currentCount = inventory[selectedBlockId] || 0;
  const placedCount = grid.filter(cell => cell !== null).length;
  const selectedBlockName = getName(selectedBlock);

  const handleSlotClick = (index: number) => {
    const existing = grid[index];
    if (existing === null) {
      if (currentCount > 0) {
        sound.playPlaceBlockSound();
        onPlaceBlock(index);
      } else {
        sound.playHitSound(2);
      }
    } else {
      sound.playCrackSound();
      onReclaimBlock(index);
    }
  };

  return (
    <section className="bg-[#242424] border-4 border-black p-5 shadow-[inset_-4px_-4px_0px_#111,inset_4px_4px_0px_#444] rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-dashed border-zinc-700">
        <div>
          <h2 className="text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000] flex items-center gap-2">
            <span>🏗️ {t('building.title')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
              {placedCount} / 100 {isEn ? 'placed' : '格已放置'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isEn ? 'Selected Block:' : '當前選定放置：'} <span className="text-white font-bold">{selectedBlockName}</span>（{isEn ? 'Stock:' : '庫存：'}<span className={currentCount > 0 ? "text-emerald-400 font-mono font-bold" : "text-red-400 font-mono"}>{currentCount}</span>）
          </p>
        </div>

        {/* Clear and reclaim controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs text-zinc-400 mr-1 flex items-center gap-1">
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Click empty to place / Click block to reclaim' : '點擊空格放置 / 點擊方塊收回'}</span>
          </div>
          <button
            onClick={onClearAll}
            className="px-3.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#3f3f46,inset_2px_2px_0_#a1a1aa] transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            {t('building.clear')}
          </button>
        </div>
      </div>

      {/* 10x10 Building Grid */}
      <div className="flex justify-center overflow-x-auto py-2">
        <div className="grid grid-cols-10 gap-1 p-3 bg-zinc-950 border-4 border-black rounded shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
          {grid.map((blockId, index) => {
            const hasBlock = blockId !== null;
            const placedBlockObj = hasBlock ? BLOCK_TYPES.find(b => b.id === blockId) : null;
            const placedBlockName = placedBlockObj ? getName(placedBlockObj) : '';

            return (
              <button
                key={index}
                id={`build-slot-${index}`}
                onClick={() => handleSlotClick(index)}
                title={hasBlock ? `${placedBlockName} (${isEn ? 'Click to reclaim' : '點擊回收'})` : `${isEn ? 'Empty Slot' : '空位格'} #${index + 1} (${isEn ? 'Click to place' : '點擊放置'} ${selectedBlockName})`}
                className={`w-9 h-9 sm:w-11 sm:h-11 border-2 border-black rounded flex items-center justify-center transition-all duration-75 relative group ${
                  hasBlock
                    ? 'hover:brightness-110 active:scale-90'
                    : 'bg-[#181818] hover:bg-zinc-800 active:scale-95 shadow-[inset_1px_1px_0_#333,inset_-1px_-1px_0_#000]'
                }`}
              >
                {hasBlock ? (
                  <BlockTexture blockId={blockId} size={36} />
                ) : (
                  <span className="opacity-0 group-hover:opacity-40 text-[9px] text-zinc-500 font-mono select-none">
                    +
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 px-1">
        <span>💡 {isEn ? 'Tip: Click empty slot to place. Click placed block to reclaim 100% back to inventory!' : '提示：點擊空格放置方塊，點擊已放置方塊即可 100% 完整回收進庫存！'}</span>
        <span className="font-mono text-amber-400">{isEn ? 'Grid: 10 × 10' : '畫布尺寸：10 × 10'}</span>
      </div>
    </section>
  );
};
