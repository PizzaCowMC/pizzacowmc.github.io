import React, { useState } from 'react';
import { sound } from '../utils/soundEffects';
import { STRATA_LAYERS } from '../data/gameData';
import { OverworldZone } from '../types';
import { Sparkles, MapPin, Pickaxe, Coffee, ArrowUpCircle, ChevronRight, X } from 'lucide-react';

interface ElevatorViewProps {
  onSelectFloor: (zone: OverworldZone, layerId?: string) => void;
  onClose: () => void;
  isEn: boolean;
  selectedLayerId: string;
  totalBlocksMined: number;
  layerMinedCounts?: Record<string, number>;
}

export const ElevatorView: React.FC<ElevatorViewProps> = ({
  onSelectFloor,
  onClose,
  isEn,
  selectedLayerId,
  totalBlocksMined,
  layerMinedCounts = {}
}) => {
  const [transitAnimation, setTransitAnimation] = useState<string | null>(null);

  const handleRide = (zone: OverworldZone, layerId?: string, floorName?: string) => {
    sound.playUpgradeSound();
    setTransitAnimation(floorName || zone);

    setTimeout(() => {
      onSelectFloor(zone, layerId);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-950 border-4 border-black rounded-2xl shadow-2xl p-4 sm:p-6 text-white relative animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            🛗
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-cyan-300 font-minecraft flex items-center gap-2">
              <span>{isEn ? 'Redstone Steam Express Elevator' : '紅石蒸氣直達高速電梯'}</span>
              <span className="text-xs bg-cyan-900/60 text-cyan-200 px-2 py-0.5 rounded border border-cyan-700">
                {isEn ? 'Dual-way Express' : '雙向貫通'}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              {isEn ? 'Rapidly transit between the Overworld, Cafe, and 10 Underground Strata!' : '穿梭於大地圖步道、咖啡廳大廳與地下 10 大深層礦脈之間！'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClickSound();
            onClose();
          }}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Transition Animation Banner */}
      {transitAnimation && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3 animate-in fade-in">
          <span className="text-4xl animate-bounce">🛗</span>
          <div className="text-cyan-300 font-black text-lg font-minecraft animate-pulse">
            {isEn ? `Transiting to ${transitAnimation}...` : `正在高速搭乘前往【${transitAnimation}】...`}
          </div>
          <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-cyan-400 animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Main Floor Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UPPER / SURFACE FLOORS */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span>☀️</span>
            <span>{isEn ? 'Surface & Cafe Levels' : '地面生活與咖啡廳樓層'}</span>
          </div>

          {/* 2F: Cafe Dining Hall */}
          <button
            onClick={() => handleRide('cafe', undefined, isEn ? '2F Cafe Hall' : '2F 咖啡廳大廳')}
            className="w-full p-3.5 bg-gradient-to-r from-amber-950/60 to-zinc-900 hover:from-amber-900/80 hover:to-zinc-800 border-2 border-amber-600/60 rounded-xl flex items-center justify-between group transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500 flex items-center justify-center text-xl">
                ☕
              </div>
              <div>
                <div className="font-black text-amber-300 text-sm group-hover:text-amber-200">
                  {isEn ? '2F • Mining Cafe Dining & Kitchen' : '2F • 礦業咖啡廳大廳與廚房'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {isEn ? 'Serve guests, cook 1,000 dishes & manage tables' : '招呼顧客、製作千種料理、升級咖啡座席'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 1F: Overworld Ground Pathway */}
          <button
            onClick={() => handleRide('overworld', undefined, isEn ? '1F Overworld Map' : '1F 大地圖綠色步道')}
            className="w-full p-3.5 bg-gradient-to-r from-emerald-950/60 to-zinc-900 hover:from-emerald-900/80 hover:to-zinc-800 border-2 border-emerald-600/60 rounded-xl flex items-center justify-between group transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
                🗺️
              </div>
              <div>
                <div className="font-black text-emerald-300 text-sm group-hover:text-emerald-200">
                  {isEn ? '1F • Overworld Walking Map' : '1F • 戶外草地公路與大地圖'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {isEn ? 'Walk freely between Cafe, Mine and Elevator' : '在綠色步道自由行走，探索各個區域'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* DEEP UNDERGROUND STRATA FLOORS (B1 ~ B10) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>⛏️</span>
            <span>{isEn ? 'Express Mine Shafts (Strata B1 ~ B10)' : '地下礦脈直達井 (第 1 ~ 10 地層)'}</span>
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {STRATA_LAYERS.map((layer, idx) => {
              const floorNum = idx + 1;
              const isSelected = selectedLayerId === layer.id;
              const prevLayer = STRATA_LAYERS[idx - 1];
              const prevCount = prevLayer ? (layerMinedCounts[prevLayer.id] || 0) : 0;
              // Layer 1 is unlocked initially; subsequent strata strictly require 100,000 blocks in previous layer
              const isLocked = idx > 0 && prevCount < 100000;

              return (
                <button
                  key={layer.id}
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    handleRide('quarry', layer.id, `B${floorNum} ${isEn ? layer.nameEn : layer.nameZh}`);
                  }}
                  className={`w-full p-2.5 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer text-left ${
                    isLocked
                      ? 'bg-zinc-900/40 border-zinc-800 text-zinc-600 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-zinc-900 hover:bg-zinc-800/80 border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-cyan-400 w-8">
                      B{floorNum}
                    </span>
                    <span className="text-base">{layer.icon}</span>
                    <div>
                      <div className="text-xs font-black text-zinc-200">
                        {isEn ? layer.nameEn : layer.nameZh}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {isLocked
                          ? (isEn ? `Requires 100k in B${idx} (${prevCount.toLocaleString()}/100k)` : `需上一層開採滿 10 萬格 (${prevCount.toLocaleString()}/10萬)`)
                          : (isEn ? 'Culinary minerals available' : '富含珍稀烹飪礦石')}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-cyan-300">
                    {isLocked ? '🔒' : isSelected ? '★' : (isEn ? 'Go ➔' : '前往 ➔')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
