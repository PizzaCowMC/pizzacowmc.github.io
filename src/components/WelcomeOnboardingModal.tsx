import React, { useState } from 'react';
import { Sparkles, Globe, User, Shuffle, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import { PlayerSprite } from './PlayerSprite';
import { PLAYER_SKINS } from '../data/gameData';

interface WelcomeOnboardingModalProps {
  isOpen: boolean;
  onComplete: (name: string, language: 'zh' | 'en', skinId: string) => void;
}

const RANDOM_NAME_PRESETS_ZH = [
  '牛排探險家',
  '傳奇礦工',
  '鑽石獵人',
  '紅石大師',
  '恐龍騎士',
  '虛空旅人',
  '匠神學徒',
  '星空咖啡師'
];

const RANDOM_NAME_PRESETS_EN = [
  'SteakExplorer',
  'LegendMiner',
  'DiamondHunter',
  'RedstoneMaster',
  'DinoKnight',
  'VoidDrifter',
  'GodsmithAdept',
  'CosmicBarista'
];

export const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<'zh' | 'en'>(language === 'en' ? 'en' : 'zh');
  const [name, setName] = useState<string>(() => {
    return selectedLang === 'en' ? 'SteakMiner' : '牛排礦工';
  });
  const [selectedSkinId, setSelectedSkinId] = useState<string>('steve');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = selectedLang === 'en';

  const handleRandomizeName = () => {
    sound.playClickSound();
    const list = isEn ? RANDOM_NAME_PRESETS_EN : RANDOM_NAME_PRESETS_ZH;
    const randomPick = list[Math.floor(Math.random() * list.length)];
    setName(randomPick);
    setValidationError(null);
  };

  const handleSelectLanguage = (lang: 'zh' | 'en') => {
    sound.playClickSound();
    setSelectedLang(lang);
    setLanguage(lang);
    if (!name || name === '牛排礦工' || name === 'SteakMiner') {
      setName(lang === 'en' ? 'SteakMiner' : '牛排礦工');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setValidationError(isEn ? 'Please enter a player name!' : '請輸入冒險者名稱！');
      return;
    }
    if (cleanName.length > 18) {
      setValidationError(isEn ? 'Name cannot exceed 18 characters!' : '名稱長度請勿超過 18 個字元！');
      return;
    }

    sound.playUpgradeSound();
    onComplete(cleanName, selectedLang, selectedSkinId);
  };

  // Top starter skins to display
  const displaySkins = PLAYER_SKINS.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#1c1917] border-4 border-[#443831] rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden text-white font-sans flex flex-col">
        {/* Modal Banner Header */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-emerald-950 px-6 py-5 border-b-4 border-black relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              👋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-300 font-minecraft tracking-wide">
                  {isEn ? 'Welcome to Minecraft Workshop!' : '歡迎來到 Minecraft 礦業咖啡廳！'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 border border-amber-400 text-amber-300 rounded font-bold">
                  v26.2.80
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                {isEn
                  ? 'Set up your player profile & language before entering the world'
                  : '在踏入這個充滿方塊與美味料理的傳奇世界前，請先建立您的冒險者資料'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-minecraft">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? '1. Select Language' : '1. 選擇遊戲介面語言'}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSelectLanguage('zh')}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2.5 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedLang === 'zh'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                <span className="text-xl">🇹🇼</span>
                <span>繁體中文</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectLanguage('en')}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2.5 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedLang === 'en'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                <span className="text-xl">🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>

          {/* STEP 2: Player Name Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-minecraft">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? '2. Player Name (Shown in Avatar Field)' : '2. 冒險者名稱 (將顯示在頭像欄位)'}</span>
              </label>
              <button
                type="button"
                onClick={handleRandomizeName}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title={isEn ? 'Randomize Name' : '隨機產生名稱'}
              >
                <Shuffle className="w-3 h-3" />
                <span>{isEn ? 'Random' : '隨機名稱'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setValidationError(null);
                }}
                maxLength={18}
                placeholder={isEn ? 'e.g. SteakMiner' : '例如：牛排礦工'}
                className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white font-mono font-bold text-sm outline-none transition-colors shadow-inner"
              />
            </div>
            {validationError && (
              <p className="text-rose-400 text-xs font-bold animate-shake">{validationError}</p>
            )}
            <p className="text-[11px] text-zinc-400">
              {isEn
                ? '💡 This name will be displayed right beside your avatar at the top of the screen.'
                : '💡 此名稱將立即顯示在畫面最頂端的像素頭像旁，且可在遊戲中隨時免費更改。'}
            </p>
          </div>

          {/* STEP 3: Initial Pixel Avatar Skin Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-minecraft">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? '3. Choose Starter Pixel Avatar' : '3. 挑選初始像素造型'}</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {displaySkins.map(skin => {
                const isSelected = selectedSkinId === skin.id;
                return (
                  <button
                    key={skin.id}
                    type="button"
                    onClick={() => {
                      sound.playClickSound();
                      setSelectedSkinId(skin.id);
                    }}
                    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <div className="w-9 h-9 flex items-center justify-center">
                      <PlayerSprite skinId={skin.id} size="sm" headOnly />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 truncate max-w-full">
                      {isEn ? skin.nameEn : skin.nameZh}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt info */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-200">
            <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              {isEn
                ? 'Your loyal Iron Golem has already prepared an excavation welcome cache for you! Click Start to claim!'
                : '您的忠誠鐵魁儡已在地下礦坑為您準備了一份豐厚的開採見面禮！點擊下方按鈕即可領取並啟程！'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-black text-sm rounded-xl border-2 border-black shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a,0_4px_15px_rgba(245,158,11,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer font-minecraft"
          >
            <span>{isEn ? 'START ADVENTURE' : '踏入世界 • 開始冒險'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
