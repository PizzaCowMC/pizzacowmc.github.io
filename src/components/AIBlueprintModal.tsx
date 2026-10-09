import React, { useState } from 'react';
import { Compass, Sparkles, Copy, Check, Terminal, Layers, Box, Lightbulb, Hammer } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface BlockItem {
  name: string;
  icon: string;
  quantity: string;
}

interface StepItem {
  stepNumber: number;
  title: string;
  instruction: string;
}

interface BlueprintData {
  title: string;
  style: string;
  dimensions: string;
  blockPalette: BlockItem[];
  steps: StepItem[];
  commands: string[];
  proTip: string;
}

interface AIBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
}

export const AIBlueprintModal: React.FC<AIBlueprintModalProps> = ({
  isOpen,
  onClose,
  isEn
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quickThemesZh = [
    '🌲 溫馨森林樹屋咖啡廳',
    '⚡ 賽博紅石蒸氣酒吧',
    '🌋 下界玄武岩熔岩烘焙坊',
    '🪶 終界浮空紫珀夜光茶館',
    '👁️ 深暗幽匿極光冷萃咖啡館'
  ];

  const quickThemesEn = [
    '🌲 Cozy Nordic Forest Treehouse Cafe',
    '⚡ Cyberpunk Redstone Steam Bar',
    '🌋 Nether Molten Basalt Roastery',
    '🪶 End City Floating Purpur Tea House',
    '👁️ Deep Dark Sculk Cold Brew Lounge'
  ];

  const quickThemes = isEn ? quickThemesEn : quickThemesZh;

  const handleGenerate = async (themeToUse?: string) => {
    const query = (themeToUse || promptInput).trim();
    if (!query || isLoading) return;

    sound.playClickSound();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          isEn
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBlueprint(data);
        sound.playLevelUpSound();
      }
    } catch (err) {
      console.warn('Blueprint fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!blueprint) return;
    sound.playCoinSound();

    const fullText = `=== ${blueprint.title} ===
Style: ${blueprint.style}
Dimensions: ${blueprint.dimensions}

[Block Palette]
${blueprint.blockPalette.map(b => `- ${b.name}: ~${b.quantity}`).join('\n')}

[Construction Steps]
${blueprint.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.instruction}`).join('\n')}

[Commands]
${blueprint.commands.join('\n')}

[Pro Tip]
${blueprint.proTip}`;

    navigator.clipboard?.writeText(fullText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border-4 border-indigo-600/80 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(99,102,241,0.35)] overflow-hidden text-white font-sans flex flex-col h-[700px] max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-[#1b1938] to-purple-950 px-5 py-4 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900/90 border-2 border-indigo-400 flex items-center justify-center text-3xl shadow-lg">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-indigo-300 font-minecraft tracking-wide">
                  {isEn ? 'AI Minecraft Cafe Blueprint Architect' : 'AI Minecraft 咖啡廳建築藍圖設計師'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                  GEMINI ARCHITECT
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                {isEn ? 'Generate custom block palettes, structure steps & in-game commands' : '輸入風格關鍵字，由 AI 打造專屬 Minecraft 建築藍圖、方塊建材清單與指令'}
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

        {/* Input Bar & Preset Tags */}
        <div className="p-4 bg-[#141416] border-b border-zinc-800 space-y-2 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={isEn ? 'e.g. Cozy Cherry Blossom Cafe with Waterwheel...' : '例如：櫻花日式溫泉咖啡廳、賽博紅石蒸氣工坊、懸崖景觀酒吧...'}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isLoading || !promptInput.trim()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-minecraft text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isLoading ? (isEn ? 'Designing...' : '設計中...') : (isEn ? 'Generate' : '生成藍圖')}</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none pt-1">
            {quickThemes.map((theme, i) => (
              <button
                key={i}
                onClick={() => {
                  setPromptInput(theme);
                  handleGenerate(theme);
                }}
                className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] whitespace-nowrap font-medium cursor-pointer transition-all active:scale-95 shrink-0"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-minecraft text-indigo-300">
                {isEn ? 'AI Architect is calculating block structure...' : 'AI 建築大師正在計算結構與方塊配色...'}
              </div>
            </div>
          )}

          {!isLoading && !blueprint && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400 space-y-2">
              <Compass className="w-12 h-12 text-zinc-600 mb-1" />
              <p className="text-sm font-bold text-zinc-300">
                {isEn ? 'Ready to Design Your Dream Minecraft Cafe' : '準備好打造您專屬的 Minecraft 夢想咖啡廳'}
              </p>
              <p className="text-xs text-zinc-500 max-w-md">
                {isEn
                  ? 'Click any preset theme above or describe your creative idea. AI will output block palettes, dimensions, and step-by-step guides!'
                  : '點擊上方預設主題或輸入任何關鍵字，AI 將為您即時計算方塊建材清單、地基尺寸與分步建造秘訣！'}
              </p>
            </div>
          )}

          {!isLoading && blueprint && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Title & Style Banner */}
              <div className="p-4 bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border border-indigo-500/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-300 font-minecraft">
                    {blueprint.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                    <span className="text-indigo-300 font-bold">{blueprint.style}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="font-mono text-cyan-400">📐 {blueprint.dimensions}</span>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-black/60 hover:bg-black/80 border border-zinc-600 rounded-lg text-xs font-bold text-white cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{isEn ? 'Copied!' : '已複製！'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Copy Blueprint' : '複製完整藍圖'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Block Palette Grid */}
              <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="text-xs font-black text-indigo-300 font-minecraft flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-indigo-400" />
                  <span>{isEn ? 'Recommended Block Palette' : '建議建材方塊清單'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {blueprint.blockPalette.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-black/40 border border-zinc-800 rounded-lg flex items-center gap-2 text-xs"
                    >
                      <span className="text-lg">{b.icon}</span>
                      <div className="truncate">
                        <div className="font-bold text-zinc-200 truncate">{b.name}</div>
                        <div className="text-[10px] text-amber-400 font-mono">x{b.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Construction Guide */}
              <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2.5">
                <div className="text-xs font-black text-emerald-300 font-minecraft flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Step-by-Step Construction Guide' : '分層建築建造指南'}</span>
                </div>
                <div className="space-y-2">
                  {blueprint.steps.map((s) => (
                    <div
                      key={s.stepNumber}
                      className="p-2.5 bg-black/40 border border-zinc-800/80 rounded-xl text-xs space-y-1"
                    >
                      <div className="font-bold text-amber-300 flex items-center gap-1.5 font-minecraft text-[11px]">
                        <span className="px-1.5 py-0.2 bg-amber-500 text-black rounded text-[10px] font-mono">
                          STEP {s.stepNumber}
                        </span>
                        <span>{s.title}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">
                        {s.instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minecraft In-Game Commands */}
              {blueprint.commands && blueprint.commands.length > 0 && (
                <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                  <div className="text-xs font-black text-cyan-300 font-minecraft flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>{isEn ? 'Useful Minecraft Commands' : '遊戲內常用建造指令'}</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {blueprint.commands.map((cmd, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 bg-black/60 border border-zinc-800 rounded-lg text-emerald-300 truncate"
                      >
                        {cmd}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {blueprint.proTip && (
                <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 font-bold">{isEn ? 'Pro Tip: ' : '大師建造技巧：'}</strong>
                    <span>{blueprint.proTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
