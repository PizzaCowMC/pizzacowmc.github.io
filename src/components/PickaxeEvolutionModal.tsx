import React from 'react';
import { Pickaxe, Shield, Zap, Sparkles, ChevronRight, Check, ArrowRight, ArrowUpCircle } from 'lucide-react';
import { PICKAXE_TIERS } from '../data/gameData';
import { PickaxeTier } from '../types';
import { sound } from '../utils/soundEffects';

interface PickaxeEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  currentPickaxeTier: number;
  ownedPickaxeIds: string[];
  coins: number;
  onOpenShop: () => void;
  onEquipPickaxe: (pickaxe: PickaxeTier) => void;
}

export const PickaxeEvolutionModal: React.FC<PickaxeEvolutionModalProps> = ({
  isOpen,
  onClose,
  isEn,
  currentPickaxeTier,
  ownedPickaxeIds,
  coins,
  onOpenShop,
  onEquipPickaxe
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border-4 border-amber-600/80 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden text-white font-sans flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-900 px-5 py-4 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-900/80 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-lg">
              ⛏️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 font-minecraft tracking-wide">
                  {isEn ? 'Minecraft Pickaxe Evolution Tree' : '經典鎬具階梯合成與進化樹'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  TECH TREE
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                {isEn
                  ? 'Classic tool progression: Bare Hand → Wood → Stone → Iron → Gold → Diamond → Netherite & Beyond'
                  : '經典合成科技樹：徒手 → 木鎬 → 石鎬 → 鐵鎬 → 金鎬 → 鑽石鎬 → 獄髓鎬 → 宇宙神鎬，逐步突破地質硬度！'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/80 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tree Path List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-mono">
              🪙 {isEn ? 'Current Coins:' : '當前持有金幣：'} <strong className="text-amber-300">{coins.toLocaleString()}</strong>
            </span>
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
                onOpenShop();
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-minecraft text-xs font-black rounded-lg cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>🛒 {isEn ? 'Open Supplies Shop' : '前往道具商店'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {PICKAXE_TIERS.map((tierItem, idx) => {
              const isEquipped = currentPickaxeTier === tierItem.tier;
              const isOwned = ownedPickaxeIds.includes(tierItem.id);
              const isNext = !isOwned && idx > 0 && ownedPickaxeIds.includes(PICKAXE_TIERS[idx - 1].id);

              return (
                <div
                  key={tierItem.id}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-gradient-to-r from-amber-950/90 to-zinc-900 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : isOwned
                      ? 'bg-zinc-900/90 border-zinc-700 hover:border-zinc-500'
                      : isNext
                      ? 'bg-amber-950/30 border-amber-600/70'
                      : 'bg-zinc-950/40 border-zinc-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Tier Level Badge */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm border-2 shrink-0 shadow-inner"
                      style={{
                        backgroundColor: `${tierItem.color}25`,
                        borderColor: tierItem.color,
                        color: tierItem.color
                      }}
                    >
                      T{tierItem.tier}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-minecraft font-black text-sm text-white">
                          {isEn ? tierItem.nameEn : tierItem.nameZh}
                        </span>
                        {isEquipped && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-black font-mono font-bold rounded">
                            {isEn ? 'EQUIPPED' : '裝備中'}
                          </span>
                        )}
                        {isOwned && !isEquipped && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 font-mono font-bold rounded border border-cyan-800">
                            {isEn ? 'OWNED' : '已持有'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono text-zinc-300">
                        <span className="text-amber-300">⚡ {tierItem.speedMultiplier}x {isEn ? 'Speed' : '開採速度'}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-cyan-300">🛡️ {tierItem.maxDurability === 999999 ? '∞' : tierItem.maxDurability} {isEn ? 'Durability' : '耐久度'}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400">{tierItem.desc}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="shrink-0 w-full sm:w-auto flex justify-end">
                    {isEquipped ? (
                      <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-600 text-xs font-bold rounded-lg flex items-center gap-1 font-minecraft">
                        <Check className="w-3.5 h-3.5" />
                        {isEn ? 'Active' : '使用中'}
                      </span>
                    ) : isOwned ? (
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          onEquipPickaxe(tierItem);
                        }}
                        className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-minecraft text-xs font-bold rounded-lg border border-zinc-600 cursor-pointer transition-all active:scale-95"
                      >
                        {isEn ? 'Equip' : '更換裝備'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          onClose();
                          onOpenShop();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg font-minecraft text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 ${
                          coins >= tierItem.cost
                            ? 'bg-amber-500 hover:bg-amber-400 text-black border border-amber-300'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}
                      >
                        <span>🛒 {tierItem.cost.toLocaleString()} 🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
