import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Coffee, Gift, MessageSquare, RefreshCw, X } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ChatMessage {
  id: string;
  sender: 'user' | 'barista';
  text: string;
  timestamp: string;
  isEasterEgg?: boolean;
}

interface AIBristaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  playerName: string;
  coins: number;
  onApplyBuff?: (buffType: 'haste' | 'fortune' | 'double_coins' | 'overclock', durationSec: number, nameZh: string, nameEn: string, cost: number) => void;
  onAddCoins?: (amount: number) => void;
}

export const AIBristaModal: React.FC<AIBristaModalProps> = ({
  isOpen,
  onClose,
  isEn,
  playerName,
  coins,
  onApplyBuff,
  onAddCoins
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'barista',
      text: isEn
        ? `Hrmm! Welcome to the bar, ${playerName}! I'm Tie, the master barista. Looking for mining tips, coffee blends, or craving a little secret gossip from the mines? Ask me anything!`
        : `「哼～哼！（撫摸大鼻子）歡迎來到吧台，${playerName}！我是店長老鐵。想打聽地底挖礦秘訣、特調咖啡推薦，還是想聊聊傳奇料理？儘管開口！」`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isSending) return;

    sound.playClickSound();
    setInputVal('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/barista-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          playerName,
          isEn,
          currentCoins: coins
        })
      });

      if (res.ok) {
        const data = await res.json();
        const baristaMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'barista',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEasterEgg: data.isEasterEgg
        };

        setMessages(prev => [...prev, baristaMsg]);

        if (data.buffGranted && onApplyBuff) {
          sound.playLevelUpSound();
          onApplyBuff(
            data.buffGranted.type,
            data.buffGranted.durationSec,
            data.buffGranted.nameZh,
            data.buffGranted.nameEn,
            0 // free easter egg!
          );
        }

        if (data.bonusCoins && data.bonusCoins > 0 && onAddCoins) {
          sound.playCoinSound();
          onAddCoins(data.bonusCoins);
        }
      }
    } catch (err) {
      console.warn('AI Barista chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'barista',
        text: isEn
          ? "Hrmm! (Cleans glasses) The mine steam is a bit heavy right now, but always remember to keep your pickaxe sharp!"
          : "「哼～！（擦拭眼鏡）礦坑蒸氣有點重，訊號斷斷續續，不過記得隨時磨利你的鎬具！」",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const presetPromptsZh = [
    '☕ 今天有什麼推薦特調？',
    '⛏️ 地底深層有什麼挖礦秘訣？',
    '🎁 老闆好！能請我喝咖啡嗎？',
    '📜 這座礦業咖啡廳有什麼傳奇故事？'
  ];

  const presetPromptsEn = [
    "☕ What's today's specialty coffee?",
    "⛏️ Any secret tips for deep strata mining?",
    "🎁 Hey boss! Free coffee please!",
    "📜 Tell me the legend of Minecraft Cafe!"
  ];

  const presets = isEn ? presetPromptsEn : presetPromptsZh;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border-4 border-emerald-600/80 rounded-2xl w-full max-w-xl shadow-[0_0_50px_rgba(16,185,129,0.35)] overflow-hidden text-white font-sans flex flex-col h-[650px] max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#132a1e] to-zinc-900 px-5 py-4 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg">
                👨‍🌾
              </div>
              <span className="absolute -bottom-1 -right-1 text-sm">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-emerald-300 font-minecraft tracking-wide">
                  {isEn ? 'Villager Barista Tie (AI Barista)' : '智慧咖啡師・老鐵 (AI 店員)'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  GEMINI 3.8
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                {isEn ? 'Minecraft Villager Cafe Owner • Mining Advisor & Secret Easter Eggs' : '村民咖啡廳店長 • 採礦秘訣與隱藏彩蛋對話'}
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

        {/* Message Container */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#111113]">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 border ${
                    isUser
                      ? 'bg-amber-600 border-amber-400 text-black'
                      : 'bg-emerald-900 border-emerald-500 text-white'
                  }`}
                >
                  {isUser ? '⛏️' : '👨‍🌾'}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-black font-bold rounded-tr-none shadow-md'
                      : m.isEasterEgg
                      ? 'bg-gradient-to-r from-emerald-950 to-amber-950 border-2 border-emerald-400 text-emerald-200 rounded-tl-none shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-800/90 text-zinc-100 border border-zinc-700 rounded-tl-none shadow-md'
                  }`}
                >
                  {m.isEasterEgg && (
                    <div className="text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                      <span>{isEn ? '🎉 EASTER EGG UNLOCKED!' : '🎉 觸發隱藏彩蛋！獲得特別獎勵！'}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div
                    className={`text-[9px] font-mono mt-1 text-right ${
                      isUser ? 'text-black/60' : 'text-zinc-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-2.5 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-500 flex items-center justify-center text-base shrink-0">
                👨‍🌾
              </div>
              <div className="bg-zinc-800/90 border border-zinc-700 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isEn ? 'Tie is preparing a thoughtful brew...' : '老鐵正在沉思沖泡回答...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompt Pills */}
        <div className="px-4 py-2 bg-[#18181b] border-t border-zinc-800 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {presets.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(promptText)}
              className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-white text-[11px] whitespace-nowrap font-medium cursor-pointer transition-all active:scale-95 shrink-0"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#151518] border-t border-zinc-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isEn ? 'Ask Barista Tie about coffee, mining, or secret blends...' : '跟店員老鐵點餐、聊天或詢問地底秘訣...'}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isSending}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-minecraft text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isEn ? 'Send' : '送出'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
