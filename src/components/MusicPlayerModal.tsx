import React, { useState, useEffect } from 'react';
import { bgmSystem, BGM_TRACKS, BgmTrack } from '../utils/bgmSystem';
import { sound } from '../utils/soundEffects';
import {
  Disc,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  X,
  Radio,
  Sliders
} from 'lucide-react';

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
}

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({
  isOpen,
  onClose,
  isEn
}) => {
  const [currentTrack, setCurrentTrack] = useState<BgmTrack>(bgmSystem.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(bgmSystem.isPlaying());
  const [volume, setVolume] = useState<number>(Math.round(bgmSystem.getVolume() * 100));
  const [autoArea, setAutoArea] = useState<boolean>(bgmSystem.isAutoAreaMode());

  useEffect(() => {
    const unsub = bgmSystem.subscribe((track, playing) => {
      setCurrentTrack(track);
      setIsPlaying(playing);
      setVolume(Math.round(bgmSystem.getVolume() * 100));
      setAutoArea(bgmSystem.isAutoAreaMode());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    sound.playClickSound();
    bgmSystem.togglePlay();
  };

  const handleSelectTrack = (trackId: string) => {
    sound.playClickSound();
    bgmSystem.playTrack(trackId);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    bgmSystem.setVolume(newVol / 100);
  };

  const handleToggleAutoArea = () => {
    sound.playClickSound();
    const next = !autoArea;
    setAutoArea(next);
    bgmSystem.setAutoAreaMode(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#1f1d1a] border-4 border-amber-900/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-white font-sans flex flex-col">
        {/* Header with Jukebox theme */}
        <div className="bg-[#141210] px-6 py-4 border-b-4 border-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border-2 border-amber-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(217,119,6,0.3)]">
              💽
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 font-minecraft tracking-wider flex items-center gap-2">
                <span>{isEn ? 'Redstone Jukebox • Official Theme Song' : '紅石唱片機 • 官方遊戲主題曲'}</span>
                <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded border border-amber-300">
                  {isEn ? 'MAIN THEME' : '遊戲主題曲'}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                {isEn ? 'Official Soundtrack: Redstone Steam Workshop (Clockwork Machinery)' : '遊戲指定主題曲：紅石蒸氣工坊（齒輪機械節奏）'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Disc Player Deck */}
        <div className="p-5 bg-gradient-to-b from-[#292520] to-[#1a1816] border-b-2 border-amber-950/80">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Spinning Disc Visual */}
            <div className="relative group shrink-0">
              <div
                className={`w-24 h-24 rounded-full border-4 border-black shadow-2xl flex items-center justify-center relative overflow-hidden transition-all ${
                  isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                }`}
                style={{
                  backgroundColor: currentTrack.discColor,
                  boxShadow: `0 0 25px ${currentTrack.discColor}40`
                }}
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-black/40" />
                <div className="absolute inset-4 rounded-full border border-black/40" />
                <div className="absolute inset-6 rounded-full border border-black/30" />

                {/* Center Label */}
                <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-white/80 flex items-center justify-center text-[10px] font-black font-minecraft text-white z-10">
                  {currentTrack.discLabel}
                </div>
              </div>

              {/* Tonearm needle indicator */}
              <div className="absolute -top-1 -right-2 text-xl pointer-events-none drop-shadow">
                {isPlaying ? '🎵' : '⏸️'}
              </div>
            </div>

            {/* Track Info & Quick Play Controls */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center sm:justify-start gap-1.5 font-minecraft">
                <span>{currentTrack.discName}</span>
                <span>•</span>
                <span className="text-zinc-400">{currentTrack.bpm} BPM</span>
              </div>
              <h3 className="text-lg font-black text-white truncate font-minecraft drop-shadow">
                {isEn ? currentTrack.nameEn : currentTrack.nameZh}
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2">
                {isEn ? currentTrack.descEn : currentTrack.descZh}
              </p>

              {/* Playing Status Equalizer Bar */}
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => {
                    sound.playClickSound();
                    bgmSystem.prevTrack();
                  }}
                  title={isEn ? 'Previous Track' : '上一首'}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 active:scale-95 cursor-pointer"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className={`px-4 py-2 rounded-xl font-black text-xs border-2 border-black flex items-center gap-2 active:scale-95 cursor-pointer shadow-lg transition-all ${
                    isPlaying
                      ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{isEn ? 'PAUSE BGM' : '暫停背景音樂'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{isEn ? 'PLAY BGM' : '播放背景音樂'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    sound.playClickSound();
                    bgmSystem.nextTrack();
                  }}
                  title={isEn ? 'Next Track' : '下一首'}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 active:scale-95 cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Animated sound wave bars if playing */}
                {isPlaying && (
                  <div className="flex items-end gap-1 h-5 ml-2">
                    <div className="w-1 bg-amber-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-4" />
                    <div className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-5" />
                    <div className="w-1 bg-cyan-400 rounded-full animate-[bounce_1.0s_ease-in-out_infinite] h-3" />
                    <div className="w-1 bg-purple-400 rounded-full animate-[bounce_0.7s_ease-in-out_infinite] h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Volume Slider & Auto Area Toggle */}
          <div className="mt-4 pt-3 border-t border-amber-950/60 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Volume */}
            <div className="flex items-center gap-2.5 bg-black/40 px-3 py-2 rounded-xl border border-zinc-800">
              <button
                onClick={() => {
                  sound.playClickSound();
                  handleVolumeChange(volume > 0 ? 0 : 50);
                }}
                className="text-zinc-400 hover:text-amber-400 cursor-pointer"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 50 ? (
                  <Volume1 className="w-4 h-4 text-amber-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="font-mono text-xs font-bold text-amber-300 w-10 text-right">
                {volume}%
              </span>
            </div>

            {/* Auto Area Adaptive Mode */}
            <button
              onClick={handleToggleAutoArea}
              className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                autoArea
                  ? 'bg-amber-950/60 border-amber-600/80 text-amber-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${autoArea ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`} />
                <span>{isEn ? 'Area Adaptive BGM' : '場景自適應切換'}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                autoArea ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {autoArea ? (isEn ? 'ON' : '開啟') : (isEn ? 'OFF' : '關閉')}
              </span>
            </button>
          </div>
        </div>

        {/* Track Selection List */}
        <div className="p-4 space-y-2 max-h-[45vh] overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1 mb-1 flex items-center justify-between">
            <span>{isEn ? 'Game Official Theme Song Record' : '遊戲唯一指定主題曲唱片'}</span>
            <span className="text-[10px] text-amber-400 font-bold">
              {isEn ? '★ Official Game Theme' : '★ 遊戲主題曲'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {BGM_TRACKS.map((track, idx) => {
              const isSelected = currentTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`w-full p-3 rounded-xl border-2 flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)] scale-[1.01]'
                      : 'bg-zinc-900/80 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Vinyl Disc Icon */}
                    <div
                      className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-xs font-black font-minecraft text-white shadow relative shrink-0 ${
                        isSelected && isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''
                      }`}
                      style={{ backgroundColor: track.discColor }}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-white/60" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white truncate font-minecraft">
                          {isEn ? track.nameEn : track.nameZh}
                        </span>
                        {track.suitableArea && (
                          <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono border border-zinc-700">
                            {track.suitableArea}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        <span className="text-amber-400 font-bold">{track.composer}</span>
                        <span> • </span>
                        <span>{track.discName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Play state badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    {isSelected && isPlaying ? (
                      <span className="text-xs font-black text-amber-400 font-minecraft flex items-center gap-1 bg-amber-950 px-2 py-1 rounded border border-amber-600 animate-pulse">
                        <span>▶</span>
                        <span>{isEn ? 'PLAYING' : '播放中'}</span>
                      </span>
                    ) : isSelected ? (
                      <span className="text-xs font-black text-zinc-400 font-minecraft bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
                        {isEn ? 'LOADED' : '已就緒'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300">
                        {isEn ? 'Play ➔' : '播放 ➔'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#141210] p-3 border-t-2 border-amber-950 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Real-time Web Audio Chiptune Synthesis' : '立體聲程序化晶片合成器・無須任何外部音檔'}</span>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-black cursor-pointer font-minecraft"
          >
            {isEn ? 'Close' : '關閉'}
          </button>
        </div>
      </div>
    </div>
  );
};
