import React, { useState } from 'react';
import { BLOCK_TYPES } from '../data/gameData';
import { MarketInflationEvent } from '../types';
import { BlockTexture } from './BlockTexture';
import { sound } from '../utils/soundEffects';
import { Coins, CheckCheck, X, TrendingUp, Sparkles, Flame, Clock, Zap } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface MarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Record<string, number>;
  coins: number;
  inflationEvent: MarketInflationEvent;
  onSellBlock: (blockId: string, amount: number, unitPrice: number) => void;
  onSellAll: (totalEarned: number) => void;
}

export const MarketModal: React.FC<MarketModalProps> = ({
  isOpen,
  onClose,
  inventory,
  coins,
  inflationEvent,
  onSellBlock,
  onSellAll
}) => {
  const { language, getName, t } = useLanguage();
  const [lastSoldMsg, setLastSoldMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = language === 'en';

  // Helper to calculate effective price with inflation and category boost
  const getEffectivePrice = (block: typeof BLOCK_TYPES[0]): number => {
    const isCategoryBoosted = inflationEvent.affectedCategories?.includes(block.category);
    const multiplier = isCategoryBoosted
      ? inflationEvent.multiplier * 1.25
      : inflationEvent.multiplier;
    return Math.max(1, Math.round(block.sellPrice * multiplier));
  };

  // Total value of all blocks in inventory under current inflation rate
  const totalStockValue = BLOCK_TYPES.reduce((sum, block) => {
    const qty = inventory[block.id] || 0;
    const effectivePrice = getEffectivePrice(block);
    return sum + qty * effectivePrice;
  }, 0);

  const handleSell = (blockId: string, amount: number, blockName: string, unitPrice: number) => {
    if (amount <= 0) return;
    sound.playCoinSound();
    onSellBlock(blockId, amount, unitPrice);
    const earned = amount * unitPrice;
    setLastSoldMsg(
      isEn
        ? `Successfully sold ${amount}x ${blockName} for +${earned.toLocaleString()} Coins!`
        : `成功出售 ${amount} 個 ${blockName}，獲得 +${earned.toLocaleString()} 遊戲幣！`
    );
    setTimeout(() => setLastSoldMsg(null), 3000);
  };

  const handleQuickSellAll = () => {
    if (totalStockValue <= 0) return;
    sound.playCoinSound();
    onSellAll(totalStockValue);
    setLastSoldMsg(
      isEn
        ? `Sold all inventory! Pocketed +${totalStockValue.toLocaleString()} Coins!`
        : `一鍵全數出清！總計入袋 +${totalStockValue.toLocaleString()} 遊戲幣！`
    );
    setTimeout(() => setLastSoldMsg(null), 3500);
  };

  const isInflationHigh = inflationEvent.multiplier > 1.2;
  const isDeflation = inflationEvent.multiplier < 1.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#242424] border-6 border-black rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 border-2 border-amber-500 rounded text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                {t('market.title')}
              </h3>
              <p className="text-xs text-zinc-400">
                {t('market.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-black/60 border-2 border-amber-400 rounded flex items-center gap-1.5 text-amber-300 font-mono font-black text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins.toLocaleString()} {isEn ? 'Coins' : '幣'}</span>
            </div>
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Random Market Inflation Banner */}
        <div className={`p-3.5 border-b-4 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isInflationHigh
            ? 'bg-gradient-to-r from-red-950 via-amber-950 to-orange-950 text-amber-200'
            : isDeflation
            ? 'bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-cyan-200'
            : 'bg-zinc-900 text-zinc-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center text-xl shrink-0 ${
              isInflationHigh ? 'bg-amber-500 text-black animate-bounce' : 'bg-zinc-800 text-amber-400'
            }`}>
              {isInflationHigh ? <Flame className="w-6 h-6" /> : isDeflation ? <TrendingUp className="w-6 h-6 rotate-180" /> : <Zap className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm text-white flex items-center gap-1.5">
                  {isEn ? (inflationEvent.titleEn || inflationEvent.title) : inflationEvent.title}
                </span>
                <span className={`text-xs font-mono font-black px-2 py-0.5 rounded border ${
                  isInflationHigh
                    ? 'bg-red-600 text-white border-red-400 animate-pulse'
                    : isDeflation
                    ? 'bg-cyan-900 text-cyan-300 border-cyan-700'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {inflationEvent.multiplier >= 1
                    ? `+${Math.round((inflationEvent.multiplier - 1) * 100)}% ${isEn ? 'Inflation Wave' : '通膨加成'} (x${inflationEvent.multiplier.toFixed(2)})`
                    : `${Math.round((inflationEvent.multiplier - 1) * 100)}% ${isEn ? 'Deflation' : '緊縮優惠'} (x${inflationEvent.multiplier.toFixed(2)})`}
                </span>
              </div>
              <p className="text-xs text-zinc-300/90 mt-0.5">
                {isEn ? (inflationEvent.descEn || inflationEvent.description) : inflationEvent.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-black/60 px-3 py-1.5 rounded border border-zinc-700 shrink-0 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-zinc-400">{isEn ? 'Wave Remaining:' : '通膨週期剩餘：'}</span>
            <span className="text-amber-300 font-bold">{inflationEvent.remainingSeconds} {isEn ? 'sec' : '秒'}</span>
          </div>
        </div>

        {/* Global summary & quick sell bar */}
        <div className="px-4 py-2.5 bg-zinc-950 border-b-2 border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-300">{isEn ? 'Total Inventory Valuation (with inflation):' : '目前庫存全部估值（含通膨加成）：'}</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {totalStockValue.toLocaleString()} {isEn ? 'Coins' : '遊戲幣'}
            </span>
          </div>

          <button
            onClick={handleQuickSellAll}
            disabled={totalStockValue <= 0}
            className={`px-4 py-1.5 text-xs font-black rounded border-2 border-black flex items-center gap-1.5 transition-all ${
              totalStockValue > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isEn ? `Sell All (${totalStockValue.toLocaleString()} Coins)` : `一鍵出清全部庫存 (${totalStockValue.toLocaleString()} 幣)`}
          </button>
        </div>

        {/* Success / Feedback toast */}
        {lastSoldMsg && (
          <div className="px-4 py-2 bg-emerald-950 text-emerald-300 border-b border-emerald-700 text-xs font-bold flex items-center gap-2 animate-pulse">
            <CheckCheck className="w-4 h-4" />
            <span>{lastSoldMsg}</span>
          </div>
        )}

        {/* Block Inventory Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {BLOCK_TYPES.map(block => {
            const qty = inventory[block.id] || 0;
            const effectivePrice = getEffectivePrice(block);
            const isCategoryBoosted = inflationEvent.affectedCategories?.includes(block.category);
            const hasInventory = qty > 0;
            const blockName = getName(block);

            return (
              <div
                key={block.id}
                className={`p-3 border-2 border-black rounded-lg flex items-center justify-between gap-3 transition-colors ${
                  hasInventory ? 'bg-zinc-900/90 shadow-[inset_1px_1px_0_#3f3f46]' : 'bg-zinc-950/40 opacity-50'
                }`}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3">
                  <BlockTexture
                    blockId={block.id}
                    size={46}
                    showName={false}
                    className="shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-amber-200">
                        {blockName}
                      </span>
                      {isCategoryBoosted && (
                        <span className="text-[10px] px-1 bg-red-950 text-red-400 border border-red-700 rounded font-mono font-bold">
                          {isEn ? 'Surge!' : '特惠大漲!'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                      <span className="text-zinc-400">{isEn ? 'Stock:' : '庫存:'} <strong className={hasInventory ? "text-white" : "text-zinc-600"}>{qty}</strong></span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        {isEn ? 'Price:' : '單價:'} {effectivePrice} {isEn ? 'Coins' : '幣'}
                        {effectivePrice !== block.sellPrice && (
                          <span className="text-[10px] text-zinc-500 line-through ml-1">
                            {block.sellPrice}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={qty < 1}
                    onClick={() => handleSell(block.id, 1, blockName, effectivePrice)}
                    className="px-2 py-1 text-xs font-bold rounded border border-black bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-200 shadow-[inset_1px_1px_0_#52525b] cursor-pointer"
                  >
                    {isEn ? 'Sell 1' : '賣 1 個'}
                  </button>

                  <button
                    disabled={qty < 1}
                    onClick={() => handleSell(block.id, qty, blockName, effectivePrice)}
                    className="px-2.5 py-1 text-xs font-black rounded border border-black bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-amber-100 shadow-[inset_-1px_-1px_0_#78350f,inset_1px_1px_0_#fde047] cursor-pointer"
                  >
                    {isEn ? `Sell All (${qty * effectivePrice})` : `全賣 (${qty * effectivePrice}幣)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-900 border-t-2 border-black text-center text-xs text-zinc-400">
          💡 {isEn ? 'Block prices rebalanced. Seize hyper-inflation waves to liquidate your inventory for maximum profits!' : '方塊基礎價值已依新市場經濟下調 20%，可藉由隨機「通膨爆發」時機一口氣拋售獲取暴利！'}
        </div>
      </div>
    </div>
  );
};
