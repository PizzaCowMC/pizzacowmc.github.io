import React from 'react';
import { BLOCK_TYPES, PICKAXE_TIERS } from '../data/gameData';
import { PickaxeState } from '../types';
import { BlockTexture } from './BlockTexture';
import { sound } from '../utils/soundEffects';
import { Coins, Pickaxe } from 'lucide-react';

interface HotbarProps {
  inventory: Record<string, number>;
  selectedBlockId: string;
  onSelectBlock: (blockId: string) => void;
  pickaxeState: PickaxeState;
  coins: number;
  onOpenMarket: () => void;
  onOpenShop: () => void;
}

export const Hotbar: React.FC<HotbarProps> = ({
  inventory,
  selectedBlockId,
  onSelectBlock,
  pickaxeState,
  coins,
  onOpenMarket,
  onOpenShop
}) => {
  const currentPick = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];
  const durabilityPct = currentPick.tier === 0
    ? 100
    : Math.max(0, Math.min(100, Math.round((pickaxeState.currentDurability / currentPick.maxDurability) * 100)));

  return (
    <aside aria-label="快捷列與狀態" className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 max-w-[98vw] flex flex-col items-center">
      {/* Top quick stats bar */}
      <div className="flex items-center gap-2 mb-1 px-3 py-0.5 bg-black/80 border border-zinc-700 rounded-full text-xs text-zinc-200 shadow-md backdrop-blur-xs">
        <button
          onClick={onOpenMarket}
          className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-mono font-bold transition-colors cursor-pointer"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>{coins.toLocaleString()} 幣 (點擊賣方塊)</span>
        </button>

        <span className="text-zinc-600">|</span>

        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 font-bold transition-colors cursor-pointer"
        >
          <Pickaxe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentPick.nameZh}</span>
          {currentPick.tier !== 0 && (
            <span className={`text-[10px] font-mono ${durabilityPct < 20 ? 'text-red-400' : 'text-zinc-400'}`}>
              ({durabilityPct}%)
            </span>
          )}
        </button>
      </div>

      {/* Main hotbar box */}
      <div className="flex items-center gap-1 bg-black/90 p-1.5 border-4 border-[#2b2b2b] rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.95)] max-w-full overflow-x-auto">
        {BLOCK_TYPES.map(block => {
          const isSelected = selectedBlockId === block.id;
          const count = inventory[block.id] || 0;

          return (
            <button
              key={block.id}
              onClick={() => {
                sound.playClickSound();
                onSelectBlock(block.id);
              }}
              title={`${block.nameZh} (${block.nameEn}) - 庫存: ${count} 個 (點擊選為建築方塊)`}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 border-2 rounded flex flex-col items-center justify-center transition-transform active:scale-95 group shrink-0 ${
                isSelected
                  ? 'border-white bg-zinc-800 shadow-[0_0_8px_rgba(255,255,255,0.8),inset_0_0_0_2px_#fff]'
                  : 'border-[#3a3a3a] bg-[#222] hover:bg-zinc-800 shadow-[inset_1px_1px_0_#555,inset_-1px_-1px_0_#111]'
              }`}
            >
              <BlockTexture blockId={block.id} size={30} />

              {/* Quantity count */}
              <span
                className={`absolute bottom-0.5 right-1 text-[10px] font-black font-mono drop-shadow-[0_1px_2px_#000] ${
                  count > 0 ? 'text-white' : 'text-zinc-500'
                }`}
              >
                {count > 999 ? '999+' : count}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute -top-9 bg-black/95 border border-amber-400 text-amber-300 text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
                {block.nameZh} ({count})
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
