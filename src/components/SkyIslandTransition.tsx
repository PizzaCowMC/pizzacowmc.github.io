import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEffects';

interface SkyIslandTransitionProps {
  isEn: boolean;
  playerLevel: number;
  avatarIcon?: string;
  onComplete: () => void;
  onCancel?: () => void;
}

export const SkyIslandTransition: React.FC<SkyIslandTransitionProps> = ({
  isEn,
  playerLevel,
  avatarIcon = '⛏️',
  onComplete,
  onCancel
}) => {
  // 3 Phases: 0 = Launch, 1 = Stratosphere flight, 2 = Arrival
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Stable callback ref to protect against parent re-renders clearing timers
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleFinish = () => {
    if (isDone) return;
    setIsDone(true);
    sound.playAchievementSound();
    onCompleteRef.current();
  };

  useEffect(() => {
    // Play initial liftoff sound
    try {
      sound.playUpgradeSound();
    } catch {}

    // Progress bar animation: runs smoothly to 100% in ~2.2 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3.5;
      });
    }, 60);

    // Phase 1: Stratosphere cloud flight after 750ms
    const t1 = setTimeout(() => {
      setPhase(1);
      try {
        sound.playDoorSound();
      } catch {}
    }, 750);

    // Phase 2: Touchdown approach after 1600ms
    const t2 = setTimeout(() => {
      setPhase(2);
      try {
        sound.playAchievementSound();
      } catch {}
    }, 1600);

    // Complete transition after 2400ms
    const t3 = setTimeout(() => {
      handleFinish();
    }, 2400);

    // Safety failsafe: If anything hangs, force complete after 3200ms
    const failsafe = setTimeout(() => {
      handleFinish();
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(failsafe);
    };
  }, []); // Empty dependencies: NEVER cancelled mid-flight by parent re-renders!

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-minecraft select-none bg-black/95 animate-in fade-in duration-200">
      {/* Top Controls: Cancel & Skip to prevent any freezing */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        {onCancel ? (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 text-xs font-minecraft flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
          >
            <span>✕</span>
            <span>{isEn ? 'Return to Map' : '返回地圖'}</span>
          </button>
        ) : <div />}

        <button
          onClick={handleFinish}
          className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl border-2 border-amber-300 text-xs font-minecraft font-black flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.7)] transition-all active:scale-95 animate-pulse"
        >
          <span>⏩</span>
          <span>{isEn ? 'Skip to Arrival' : '立即抵達二號分店'}</span>
        </button>
      </div>

      {/* Background Dynamic Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          phase === 0
            ? 'bg-gradient-to-b from-sky-500 via-indigo-900 to-black'
            : phase === 1
            ? 'bg-gradient-to-b from-indigo-950 via-purple-950 to-black'
            : 'bg-gradient-to-b from-purple-900 via-[#18112e] to-[#0d091a]'
        }`}
      />

      {/* Floating Star & Cloud Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />
        <div className="absolute -top-10 left-[10%] text-6xl opacity-30 animate-bounce duration-1000">☁️</div>
        <div className="absolute top-[20%] right-[15%] text-7xl opacity-40 animate-pulse">☁️</div>
        <div className="absolute bottom-[25%] left-[20%] text-8xl opacity-20">☁️</div>
        <div className="absolute top-[40%] right-[30%] text-5xl opacity-35 animate-bounce">✨</div>
        <div className="absolute top-[15%] left-[45%] text-4xl opacity-50 text-amber-300 animate-spin">✦</div>
      </div>

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-6 py-8">
        {/* Floating Island Icon / Animation */}
        <div className="relative mb-6">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 opacity-60 blur-xl animate-pulse" />

          {/* Island / Airship Visual Container */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-zinc-900/90 border-4 border-purple-400/80 shadow-2xl flex flex-col items-center justify-center p-3">
            {phase === 0 && (
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-6xl sm:text-7xl">🚀</span>
                <span className="text-xs text-amber-300 font-bold mt-2 bg-black/60 px-2 py-0.5 rounded border border-amber-600">
                  {avatarIcon} LIFTOFF
                </span>
              </div>
            )}

            {phase === 1 && (
              <div className="flex flex-col items-center scale-110 transition-transform">
                <div className="relative">
                  <span className="text-6xl sm:text-7xl animate-pulse">☁️</span>
                  <span className="absolute -top-2 -right-2 text-2xl animate-spin">✨</span>
                  <span className="absolute bottom-0 left-2 text-3xl">🌌</span>
                </div>
                <span className="text-xs text-cyan-300 font-bold mt-2 bg-black/70 px-2 py-0.5 rounded border border-cyan-500 animate-pulse">
                  SOARING HIGH
                </span>
              </div>
            )}

            {phase === 2 && (
              <div className="flex flex-col items-center animate-in zoom-in-75 duration-500">
                <span className="text-6xl sm:text-7xl">🏝️</span>
                <span className="text-xs text-emerald-300 font-bold mt-2 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-400 shadow-md">
                  ✨ TOUCHDOWN
                </span>
              </div>
            )}
          </div>

          <div className="absolute -top-3 -right-3 text-2xl animate-bounce">🌌</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse text-amber-300">⭐</div>
        </div>

        {/* Phase Titles & Subtitles */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-400 text-purple-200 text-xs font-bold tracking-wider uppercase">
            <span>✦</span>
            <span>
              {isEn
                ? `Sky Island Ascension • Rank ${playerLevel} (Rank 15 Unlocked)`
                : `浮空登島傳送 • 等級 Rank ${playerLevel} (需 Rank 15 解鎖)`}
            </span>
            <span>✦</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 drop-shadow-md">
            {phase === 0
              ? isEn
                ? 'Launching to Mysterious Sky Island...'
                : '啟動空島推進！準備飛往神秘空島...'
              : phase === 1
              ? isEn
                ? 'Soaring Through the Stratosphere & Clouds...'
                : '突破平流層！穿越雲海與星光秘境...'
              : isEn
              ? '✨ Arrived at Branch #2 Celestial Starlight Cafe!'
              : '✨ 成功抵達第二分店・星空祕境！'}
          </h2>

          <p className="text-sm text-zinc-300 max-w-md mx-auto">
            {phase === 0
              ? isEn
                ? 'Leaving the Overworld crossroads behind, rising into the sky realm.'
                : '脫離地表十字路口，乘著浮空風壓升上萬里高空。'
              : phase === 1
              ? isEn
                ? 'Ancient celestial starlight ruins sighted among the glowing nebula clouds.'
                : '星空星雲中浮現遠古星光空島，鎖定第二分店露天平台座標。'
              : isEn
              ? 'Opening the Celestial Starlight Blueprint with 12 exclusive starlight tables!'
              : '即刻開啟二號分館星空藍圖！專屬 12 張星空餐桌與宇宙級料理就緒！'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-1.5 cursor-pointer" onClick={handleFinish} title="點擊立即完成">
          <div className="w-full h-3.5 bg-zinc-950 border-2 border-purple-600 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(168,85,247,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>{isEn ? 'Ascension Flight Progress' : '航程進度'}</span>
            <span className="text-purple-300 font-bold">{Math.round(progress)}% (點擊跳過)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
