import React, { useMemo } from 'react';
import { BLOCK_TYPES } from '../data/gameData';
import { BUILDING_LOTS, BuildingLot, BuildingLotId, countPlaced } from '../data/buildingLots';
import { LotIllustration, getLotStage } from './LotIllustration';
import { sound } from '../utils/soundEffects';

interface BuildingSiteProps {
  isEn: boolean;
  nearLotId: BuildingLotId | null;
  lotGrids: Record<string, (string | null)[]>;
  onEnterLot: (lotId: BuildingLotId) => void;
  onLeaveSite: () => void;
}

/** 5 塊工地在畫面上的位置 (百分比,需與 OverworldMap 的距離判定一致) */
const LOT_POSITIONS: Record<BuildingLotId, string> = {
  cabin: 'left-[2%] top-[3%] w-[30%] h-[35%]',
  castle: 'left-[34%] top-[3%] w-[30%] h-[35%]',
  lighthouse: 'right-[2%] top-[3%] w-[30%] h-[35%]',
  windmill: 'left-[2%] bottom-[3%] w-[30%] h-[36%]',
  temple: 'left-[34%] bottom-[3%] w-[30%] h-[36%]'
};

/** 依玩家座標找出附近的工地 (給 OverworldMap 使用) */
export const getNearLotId = (pos: { x: number; y: number }): BuildingLotId | null => {
  if (pos.y <= 38) {
    if (pos.x <= 33) return 'cabin';
    if (pos.x <= 66) return 'castle';
    return 'lighthouse';
  }
  if (pos.y >= 56) {
    if (pos.x <= 33) return 'windmill';
    if (pos.x <= 66) return 'temple';
  }
  return null;
};

const STAGE_LABEL = {
  empty: { zh: '空地待開工', en: 'Vacant lot' },
  building: { zh: '施工中', en: 'Under construction' },
  done: { zh: '已完工', en: 'Completed' }
};

const LotCard: React.FC<{
  lot: BuildingLot;
  grid: (string | null)[];
  isNear: boolean;
  isEn: boolean;
  blockColors: Record<string, string>;
  onEnter: () => void;
}> = ({ lot, grid, isNear, isEn, blockColors, onEnter }) => {
  const placed = countPlaced(grid);
  const stage = getLotStage(placed);

  return (
    <div className={`absolute ${LOT_POSITIONS[lot.id]} z-10`}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          sound.playClickSound();
          onEnter();
        }}
        className={`relative w-full h-full rounded-2xl border-4 p-2 flex flex-col gap-1 overflow-hidden cursor-pointer shadow-2xl hover:scale-[1.02] transition-transform ${
          isNear ? 'ring-4 ring-amber-300 animate-pulse' : ''
        }`}
        style={{
          background: `linear-gradient(160deg, ${lot.bgFrom}, ${lot.bgTo})`,
          borderColor: lot.accent
        }}
      >
        {/* 標題列 */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base">{lot.emoji}</span>
            <span className="text-xs sm:text-sm font-black font-minecraft truncate" style={{ color: lot.accent }}>
              {isEn ? lot.nameEn : lot.nameZh}
            </span>
          </div>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-bold border whitespace-nowrap"
            style={{
              color: stage === 'done' ? '#bbf7d0' : stage === 'building' ? '#fde68a' : '#d4d4d8',
              borderColor: stage === 'done' ? '#16a34a' : stage === 'building' ? '#d97706' : '#52525b',
              background: 'rgba(0,0,0,0.45)'
            }}
          >
            {isEn ? STAGE_LABEL[stage].en : STAGE_LABEL[stage].zh}
          </span>
        </div>

        {/* 建築插畫 */}
        <div
          className="relative flex-1 min-h-0 rounded-lg overflow-hidden border border-black/60"
          style={{ background: `linear-gradient(180deg, ${lot.skyFrom}, ${lot.skyTo})` }}
        >
          <LotIllustration lotId={lot.id} stage={stage} className="absolute inset-0 w-full h-full" />

          {/* 玩家實際蓋出來的作品縮圖 */}
          {placed > 0 && (
            <div
              className="hidden sm:grid absolute top-1 right-1 w-11 h-11 border-2 border-black/80 rounded bg-black/55 overflow-hidden"
              style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}
              title={isEn ? 'Your build' : '你的作品縮圖'}
            >
              {grid.map((blockId, i) => (
                <div key={i} style={{ background: blockId ? blockColors[blockId] || '#a3a3a3' : 'transparent' }} />
              ))}
            </div>
          )}
        </div>

        {/* 進度與進入按鈕 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2.5 rounded-full bg-black/60 border border-black overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, placed)}%`, background: lot.accent }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-200 whitespace-nowrap">{placed}/100</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClickSound();
            onEnter();
          }}
          className="w-full py-1 text-black font-black text-xs rounded-xl border-2 border-black shadow active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5 font-minecraft hover:brightness-110"
          style={{ background: lot.accent }}
        >
          <span>🧱</span>
          <span>{isEn ? 'START BUILDING' : '進入施工'}</span>
        </button>
      </div>
    </div>
  );
};

export const BuildingSite: React.FC<BuildingSiteProps> = ({ isEn, nearLotId, lotGrids, onEnterLot, onLeaveSite }) => {
  const blockColors = useMemo(() => {
    const m: Record<string, string> = {};
    BLOCK_TYPES.forEach(b => {
      m[b.id] = b.color;
    });
    return m;
  }, []);

  const doneCount = BUILDING_LOTS.filter(l => getLotStage(countPlaced(lotGrids[l.id])) === 'done').length;
  const totalPlaced = BUILDING_LOTS.reduce((sum, l) => sum + countPlaced(lotGrids[l.id]), 0);

  return (
    <div className="absolute inset-0">
      {/* 泥土工地地面的碎石與雜物 */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[40%] left-[8%] text-sm">🪨</div>
        <div className="absolute top-[56%] left-[70%] text-sm">🪵</div>
        <div className="absolute top-[38%] left-[44%] text-sm">🚧</div>
        <div className="absolute top-[57%] left-[22%] text-sm">🧱</div>
        <div className="absolute top-[41%] left-[84%] text-sm">⛏️</div>
        <div className="absolute top-[58%] left-[58%] text-sm">🪨</div>
      </div>

      {/* 左側施工圍欄 (地圖最左邊) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[1.6%] z-0 border-r-4 border-[#451a03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, #92400e, #92400e 14px, #fbbf24 14px, #fbbf24 20px, #92400e 20px, #92400e 34px)'
        }}
      />

      {/* 東西向泥土主幹道 (往右接回主地圖) */}
      <div
        className="absolute left-[1.6%] right-0 top-[40%] h-[14%] bg-[#8b6b3e] border-y-4 border-[#4a3318] z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #8b6b3e, #8b6b3e 20px, #7a5c33 20px, #7a5c33 40px)'
        }}
      >
        <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-amber-100/40" />
      </div>

      {/* 通往各工地的小徑 */}
      {[
        'left-[14%] top-[34%]',
        'left-[46%] top-[34%]',
        'right-[14%] top-[34%]'
      ].map(p => (
        <div key={p} className={`absolute ${p} w-[6%] h-[8%] bg-[#8b6b3e] border-x-4 border-[#4a3318] z-0`} />
      ))}
      {['left-[14%] top-[52%]', 'left-[46%] top-[52%]'].map(p => (
        <div key={p} className={`absolute ${p} w-[6%] h-[8%] bg-[#8b6b3e] border-x-4 border-[#4a3318] z-0`} />
      ))}

      {/* 吊車與工地看板 */}
      <div className="absolute left-[3%] top-[41%] z-10 pointer-events-none flex flex-col items-center">
        <span className="text-3xl drop-shadow">🏗️</span>
        <span className="text-[9px] bg-black/85 px-1.5 py-0.5 rounded font-minecraft text-amber-300 border border-amber-700/80 whitespace-nowrap">
          {isEn ? 'Construction Site' : '建築工地'}
        </span>
      </div>

      {/* 5 塊工地 */}
      {BUILDING_LOTS.map(lot => (
        <LotCard
          key={lot.id}
          lot={lot}
          grid={lotGrids[lot.id]}
          isNear={nearLotId === lot.id}
          isEn={isEn}
          blockColors={blockColors}
          onEnter={() => onEnterLot(lot.id)}
        />
      ))}

      {/* 材料倉庫 / 工頭告示 */}
      <div className="absolute right-[2%] bottom-[3%] w-[30%] h-[36%] z-10 pointer-events-none">
        <div className="w-full h-full rounded-2xl border-4 border-dashed border-amber-700/80 bg-[#2a1f10]/90 p-2.5 flex flex-col justify-between text-white">
          <div className="flex items-center gap-1.5 border-b-2 border-amber-950 pb-1">
            <span className="text-base">📋</span>
            <span className="text-xs sm:text-sm font-black text-amber-300 font-minecraft">
              {isEn ? 'Foreman Notice Board' : '工頭告示板'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-300 leading-snug">
            {isEn
              ? 'Every plot is its own 10×10 canvas with a unique design. Step into one and build with the blocks you mined!'
              : '每塊工地都是獨立的 10×10 畫布,各有獨特的造型。走進任何一塊,用你開採的方塊自由施工吧!'}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-emerald-300 font-bold">
              {isEn ? `Completed ${doneCount} / ${BUILDING_LOTS.length}` : `已完工 ${doneCount} / ${BUILDING_LOTS.length} 棟`}
            </span>
            <span className="text-amber-300 font-bold">🧱 {totalPlaced}</span>
          </div>
        </div>
      </div>

      {/* 東側出口:回到主地圖 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          sound.playClickSound();
          onLeaveSite();
        }}
        className="absolute right-[0.5%] top-[43%] z-20 px-2 py-1 bg-amber-900/95 border-2 border-amber-600 rounded-md text-[9px] font-minecraft text-amber-200 shadow-xl animate-pulse cursor-pointer hover:bg-amber-800"
      >
        {isEn ? 'Main Map ▶' : '主地圖 ▶'}
      </button>
    </div>
  );
};
