import React from 'react';
import { Pickaxe, Coins, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { BLOCK_TYPES } from '../data/gameData';
import { BlockTexture } from './BlockTexture';

export interface IronGolemHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalBlocksMined: number;
  blockBreakdown: Record<string, number>;
  bonusCoins: number;
  onClaim: () => void;
  isEn?: boolean;
  offlineSeconds?: number;
}

export const IronGolemHarvestModal: React.FC<IronGolemHarvestModalProps> = ({
  isOpen,
  onClose,
  totalBlocksMined,
  blockBreakdown,
  bonusCoins,
  onClaim,
  isEn = false,
  offlineSeconds = 0
}) => {
  if (!isOpen) return null;

  // Format offline duration
  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return isEn ? 'Initial Welcome Gift' : '開局迎新見面禮';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return isEn ? `${hrs}h ${mins}m away` : `離線離席 ${hrs} 小時 ${mins} 分鐘`;
    }
    if (mins > 0) {
      return isEn ? `${mins}m ${secs}s away` : `離線離席 ${mins} 分鐘 ${secs} 秒`;
    }
    return isEn ? `${secs}s away` : `離線離席 ${secs} 秒`;
  };

  const handleClaim = () => {
    sound.playUpgradeSound();
    onClaim();
    onClose();
  };

  // Convert breakdown to array with block metadata
  const minedItems = (Object.entries(blockBreakdown) as [string, number][])
    .filter(([_, count]) => (count as number) > 0)
    .map(([blockId, count]) => {
      const blockDef = BLOCK_TYPES.find(b => b.id === blockId) || {
        id: blockId,
        nameZh: blockId,
        nameEn: blockId,
        color: '#737373',
        borderColor: '#4d4d4d',
        iconText: '🪨',
        category: 'surface',
        hardness: 1,
        sellPrice: 5
      };
      return {
        blockId,
        count: Number(count),
        blockDef
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#1c1917] border-4 border-amber-600/80 rounded-2xl w-full max-w-xl shadow-[0_0_60px_rgba(217,119,6,0.4)] overflow-hidden text-white font-sans flex flex-col">
        {/* Header with Iron Golem Graphic */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-emerald-950 px-6 py-5 border-b-4 border-black relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-950/80 border-3 border-amber-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-bounce">
                🤖
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-amber-300 font-minecraft tracking-wide">
                  {isEn
                    ? `While you were away, Iron Golem mined ${totalBlocksMined.toLocaleString()} blocks!`
                    : `你不在時鐵魁儡為你挖掘了 ${totalBlocksMined.toLocaleString()} 塊！`}
                </h2>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  ⏱️ {formatDuration(offlineSeconds)}
                </span>
                <span className="text-xs text-zinc-300">
                  {isEn
                    ? 'Iron Golem diligently guarded and harvested the quarry'
                    : '忠誠鐵魁儡趁您休息時持續在礦坑開採'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Section: 下面會顯示他挖了多少什麼方塊 */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider font-minecraft flex items-center gap-2">
              <Pickaxe className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Excavated Blocks Breakdown:' : '下面顯示他挖了多少什麼方塊：'}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {minedItems.length} {isEn ? 'types' : '種方塊'} • {totalBlocksMined.toLocaleString()} {isEn ? 'blocks' : '塊'}
            </span>
          </div>

          {/* Grid of mined blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {minedItems.map(({ blockId, count, blockDef }) => (
              <div
                key={blockId}
                className="bg-black/60 border-2 border-zinc-800 hover:border-amber-600/60 rounded-xl p-2.5 flex items-center gap-2.5 transition-all shadow-sm group"
              >
                <div className="shrink-0 w-10 h-10 flex items-center justify-center">
                  <BlockTexture blockId={blockId} size={36} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-200 truncate">
                    {isEn ? blockDef.nameEn : blockDef.nameZh}
                  </div>
                  <div className="text-[11px] font-mono font-black text-amber-300 mt-0.5">
                    +{count.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus coins reward section */}
          {bonusCoins > 0 && (
            <div className="bg-gradient-to-r from-amber-950/70 via-yellow-950/50 to-zinc-900 border-2 border-amber-500/60 rounded-xl p-3.5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl">
                  🪙
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200">
                    {isEn ? 'Automated Mining Dividends' : '自動開採額外金幣分紅'}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {isEn ? 'Bonus earnings from market exchange' : '鐵魁儡開採伴隨的交易所收益金幣'}
                  </div>
                </div>
              </div>
              <div className="font-mono font-black text-amber-300 text-sm sm:text-base">
                +{bonusCoins.toLocaleString()} {isEn ? 'Coins' : '金幣'}
              </div>
            </div>
          )}
        </div>

        {/* Claim Footer Action Button */}
        <div className="bg-zinc-950 p-4 border-t-2 border-zinc-800 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{isEn ? 'All blocks will be stored into inventory' : '點擊後所有方塊將全數放入背包'}</span>
          </div>

          <button
            onClick={handleClaim}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#6ee7b7,0_4px_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-minecraft"
          >
            <span>{isEn ? 'CLAIM ALL TO INVENTORY' : '📦 一鍵領取並放入背包'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
