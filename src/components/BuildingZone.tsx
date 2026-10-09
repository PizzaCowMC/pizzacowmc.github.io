import React, { useMemo, useState } from 'react';
import { BLOCK_TYPES } from '../data/gameData';
import { BlockTexture } from './BlockTexture';
import { LotIllustration } from './LotIllustration';
import { BUILDING_LOTS, BuildingLot, BuildingLotId, GUIDE_LEGEND } from '../data/buildingLots';
import { sound } from '../utils/soundEffects';
import { Trash2, Hammer, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface BuildingZoneProps {
  grid: (string | null)[];
  inventory: Record<string, number>;
  selectedBlockId: string;
  onPlaceBlock: (index: number) => void;
  onReclaimBlock: (index: number) => void;
  onClearAll: () => void;
  /** 目前正在施工的那一塊工地 */
  lot: BuildingLot;
  /** 每塊工地已放置的方塊數 (用來顯示切換標籤上的進度) */
  lotPlacedCounts: Record<string, number>;
  onSelectLot: (lotId: BuildingLotId) => void;
}

export const BuildingZone: React.FC<BuildingZoneProps> = ({
  grid,
  inventory,
  selectedBlockId,
  onPlaceBlock,
  onReclaimBlock,
  onClearAll,
  lot,
  lotPlacedCounts,
  onSelectLot
}) => {
  const { language, getName, t } = useLanguage();
  const isEn = language === 'en';
  const [showGuide, setShowGuide] = useState<boolean>(true);

  const selectedBlock = BLOCK_TYPES.find(b => b.id === selectedBlockId) || BLOCK_TYPES[0];
  const currentCount = inventory[selectedBlockId] || 0;
  const placedCount = grid.filter(cell => cell !== null).length;
  const selectedBlockName = getName(selectedBlock);

  // 藍圖提示:每個格子對應的提示字元與色塊
  const guideCells = useMemo(
    () =>
      grid.map((_, index) => {
        const row = Math.floor(index / 10);
        const col = index % 10;
        return lot.guide[row]?.[col] ?? '.';
      }),
    [grid, lot]
  );
  const guideTint = (ch: string): string => {
    if (ch === 'R') return lot.roofTint;
    return GUIDE_LEGEND[ch]?.tint || '';
  };
  const guideTotal = guideCells.filter(ch => ch !== '.').length;
  const guideFilled = guideCells.filter((ch, i) => ch !== '.' && grid[i] !== null).length;
  const guidePercent = guideTotal > 0 ? Math.round((guideFilled / guideTotal) * 100) : 0;

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
    <section
      className="border-4 p-5 shadow-[inset_-4px_-4px_0px_#111,inset_4px_4px_0px_#444] rounded-lg"
      style={{
        background: `linear-gradient(160deg, ${lot.bgFrom}, ${lot.bgTo})`,
        borderColor: lot.accent
      }}
    >
      {/* 工地切換標籤 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b-2 border-dashed border-zinc-700">
        {BUILDING_LOTS.map(l => {
          const active = l.id === lot.id;
          return (
            <button
              key={l.id}
              onClick={() => {
                if (!active) {
                  sound.playClickSound();
                  onSelectLot(l.id);
                }
              }}
              className={`shrink-0 px-2.5 py-1 rounded-lg border-2 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                active ? 'text-black' : 'bg-black/40 text-zinc-300 hover:bg-black/60'
              }`}
              style={active ? { background: l.accent, borderColor: '#000' } : { borderColor: l.accentDark }}
              title={isEn ? l.taglineEn : l.taglineZh}
            >
              <span>{l.emoji}</span>
              <span>{isEn ? l.nameEn : l.nameZh}</span>
              <span className="font-mono text-[10px] opacity-80">{lotPlacedCounts[l.id] || 0}/100</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-dashed border-zinc-700">
        <div>
          <h2 className="text-xl font-black drop-shadow-[2px_2px_0_#000] flex items-center gap-2 flex-wrap" style={{ color: lot.accent }}>
            <span>
              {lot.emoji} {isEn ? lot.nameEn : lot.nameZh}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
              {placedCount} / 100 {isEn ? 'placed' : '格已放置'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-amber-200 border border-amber-800 font-bold">
              {t('building.title')}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isEn ? lot.taglineEn : lot.taglineZh} ・ {isEn ? 'Selected Block:' : '當前選定放置：'}{' '}
            <span className="text-white font-bold">{selectedBlockName}</span>（{isEn ? 'Stock:' : '庫存：'}
            <span className={currentCount > 0 ? 'text-emerald-400 font-mono font-bold' : 'text-red-400 font-mono'}>{currentCount}</span>）
          </p>
        </div>

        {/* Clear and reclaim controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs text-zinc-400 mr-1 flex items-center gap-1">
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Click empty to place / Click block to reclaim' : '點擊空格放置 / 點擊方塊收回'}</span>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              setShowGuide(v => !v);
            }}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-black border-2 border-black rounded transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title={isEn ? 'Show a faint blueprint hint on empty slots (costs nothing)' : '在空格上顯示淡淡的藍圖提示(不花任何方塊)'}
          >
            {showGuide ? <EyeOff className="w-3.5 h-3.5 text-cyan-300" /> : <Eye className="w-3.5 h-3.5 text-cyan-300" />}
            {showGuide ? (isEn ? 'Hide Blueprint' : '隱藏藍圖提示') : isEn ? 'Show Blueprint' : '顯示藍圖提示'}
          </button>
          <button
            onClick={onClearAll}
            className="px-3.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#3f3f46,inset_2px_2px_0_#a1a1aa] transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            {t('building.clear')}
          </button>
        </div>
      </div>

      {/* 10x10 Building Grid (背景是這棟建築專屬的剪影與天空) */}
      <div className="flex justify-center overflow-x-auto py-2">
        <div
          className="relative p-3 border-4 border-black rounded shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"
          style={{ background: `linear-gradient(180deg, ${lot.skyFrom}33, ${lot.skyTo}1a), #0a0a0a` }}
        >
          <LotIllustration
            lotId={lot.id}
            stage="done"
            className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] opacity-25 pointer-events-none"
          />
          <div className="relative grid grid-cols-10 gap-1">
            {grid.map((blockId, index) => {
              const hasBlock = blockId !== null;
              const placedBlockObj = hasBlock ? BLOCK_TYPES.find(b => b.id === blockId) : null;
              const placedBlockName = placedBlockObj ? getName(placedBlockObj) : '';
              const tint = showGuide && !hasBlock ? guideTint(guideCells[index]) : '';

              return (
                <button
                  key={index}
                  id={`build-slot-${index}`}
                  onClick={() => handleSlotClick(index)}
                  title={
                    hasBlock
                      ? `${placedBlockName} (${isEn ? 'Click to reclaim' : '點擊回收'})`
                      : `${isEn ? 'Empty Slot' : '空位格'} #${index + 1} (${isEn ? 'Click to place' : '點擊放置'} ${selectedBlockName})`
                  }
                  className={`w-9 h-9 sm:w-11 sm:h-11 border-2 border-black rounded flex items-center justify-center transition-all duration-75 relative group ${
                    hasBlock
                      ? 'hover:brightness-110 active:scale-90'
                      : 'bg-black/55 hover:bg-zinc-800/70 active:scale-95 shadow-[inset_1px_1px_0_#333,inset_-1px_-1px_0_#000]'
                  }`}
                  style={tint ? { backgroundColor: tint } : undefined}
                >
                  {hasBlock ? (
                    <BlockTexture blockId={blockId} size={36} />
                  ) : (
                    <span className="opacity-0 group-hover:opacity-40 text-[9px] text-zinc-500 font-mono select-none">+</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 藍圖圖例與完成度 */}
      {showGuide && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[10px] text-zinc-300">
          {['R', '#', 'W', 'D', 'F', 'G'].map(ch => (
            <span key={ch} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-sm border border-black"
                style={{ backgroundColor: ch === 'R' ? lot.roofTint : GUIDE_LEGEND[ch].tint }}
              />
              {isEn ? GUIDE_LEGEND[ch].en : GUIDE_LEGEND[ch].zh}
            </span>
          ))}
          <span className="font-mono font-bold" style={{ color: lot.accent }}>
            {isEn ? `Blueprint ${guidePercent}%` : `藍圖完成度 ${guidePercent}%`}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 px-1 gap-3 flex-wrap">
        <span>
          💡{' '}
          {isEn
            ? 'Tip: Blueprint colors are only hints — build it your own way! Click a placed block to reclaim it 100%.'
            : '提示：藍圖色塊只是參考,想怎麼蓋都可以!點擊已放置方塊即可 100% 完整回收進庫存。'}
        </span>
        <span className="font-mono text-amber-400">{isEn ? 'Grid: 10 × 10' : '畫布尺寸：10 × 10'}</span>
      </div>
    </section>
  );
};
