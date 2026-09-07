import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  Shield,
  HelpCircle,
  ExternalLink,
  Flame
} from 'lucide-react';
import {
  ENCYCLOPEDIA_CATEGORIES,
  ENCYCLOPEDIA_ENTRIES,
  EncyclopediaEntry
} from '../data/encyclopediaData';
import { sound } from '../utils/soundEffects';

interface EncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn?: boolean;
}

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({
  isOpen,
  onClose,
  isEn = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    ENCYCLOPEDIA_ENTRIES[0]?.id || null
  );

  // Filter entries
  const filteredEntries = useMemo(() => {
    return ENCYCLOPEDIA_ENTRIES.filter((entry) => {
      const matchCategory =
        selectedCategory === 'all' || entry.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchName =
        entry.nameZh.toLowerCase().includes(q) ||
        entry.nameEn.toLowerCase().includes(q);
      const matchTagline =
        entry.taglineZh.toLowerCase().includes(q) ||
        entry.taglineEn.toLowerCase().includes(q);
      const matchDesc =
        entry.descriptionZh.toLowerCase().includes(q) ||
        entry.descriptionEn.toLowerCase().includes(q);
      const matchBadge =
        entry.badgeZh.toLowerCase().includes(q) ||
        entry.badgeEn.toLowerCase().includes(q);

      return matchCategory && (matchName || matchTagline || matchDesc || matchBadge);
    });
  }, [selectedCategory, searchQuery]);

  const activeEntry: EncyclopediaEntry | null = useMemo(() => {
    return (
      ENCYCLOPEDIA_ENTRIES.find((e) => e.id === selectedEntryId) ||
      filteredEntries[0] ||
      null
    );
  }, [selectedEntryId, filteredEntries]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#1e1e1e] border-4 border-[#3a3a3a] rounded-xl shadow-[inset_-4px_-4px_0_#111,inset_4px_4px_0_#555,0_20px_50px_rgba(0,0,0,0.95)] text-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#2a2a2a] px-5 py-3.5 border-b-2 border-[#333] flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-xl shadow-inner">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-wide font-minecraft flex items-center gap-2">
                  <span>{isEn ? 'Minecraft Encyclopedia' : 'Minecraft 百科全書'}</span>
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-700/60 font-mono">
                  {isEn ? `${filteredEntries.length} Records` : `收錄 ${filteredEntries.length} 條知識`}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                {isEn
                  ? 'Compendium of ores, blocks, tools, mechanics, entities, and tips'
                  : '礦石、建材、鎬子階級、怪物生態、紅石機制與經典生存秘訣指南'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
            title={isEn ? 'Close' : '關閉'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-[#242424] px-5 py-3 border-b border-[#333] flex flex-col sm:flex-row gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search ores, tools, blocks, mobs, trivia...'
                  : '搜尋礦石、工具、方塊、怪物、紅石、冷知識...'
              }
              className="w-full pl-9 pr-8 py-2 bg-[#181818] border border-zinc-700 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Categories Pill Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {ENCYCLOPEDIA_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClickSound();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'bg-[#1a1a1a] text-zinc-400 border-zinc-800 hover:bg-[#282828] hover:text-zinc-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isEn ? cat.labelEn : cat.labelZh}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content: Split Screen on Desktop */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: List of Items */}
          <div className="w-full md:w-5/12 lg:w-4/12 border-r border-[#333] flex flex-col overflow-y-auto bg-[#181818]/60 divide-y divide-zinc-800/60 shrink-0 max-h-56 md:max-h-none">
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center gap-2 my-auto">
                <HelpCircle className="w-8 h-8 text-zinc-600 animate-pulse" />
                <p className="text-xs font-bold">
                  {isEn ? 'No entries match your search.' : '找不到符合條件的百科條目。'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs rounded border border-zinc-700 cursor-pointer"
                >
                  {isEn ? 'Clear filters' : '重設搜尋條件'}
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isSelected = activeEntry?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => {
                      sound.playClickSound();
                      setSelectedEntryId(entry.id);
                    }}
                    className={`p-3 text-left flex items-start gap-3 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-500/15 border-l-4 border-l-amber-400'
                        : 'hover:bg-zinc-800/40 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 border border-black/60 shadow"
                      style={{ backgroundColor: `${entry.color}33`, borderColor: entry.color }}
                    >
                      {entry.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-xs text-zinc-200 truncate group-hover:text-white">
                          {isEn ? entry.nameEn : entry.nameZh}
                        </h3>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 shrink-0 font-medium">
                          {isEn ? entry.badgeEn : entry.badgeZh}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                        {isEn ? entry.taglineEn : entry.taglineZh}
                      </p>
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 self-center hidden sm:block" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Article */}
          <div className="flex-1 overflow-y-auto p-5 md:p-7 bg-[#1c1c1c] space-y-6">
            {activeEntry ? (
              <div className="space-y-6 animate-fade-in">
                {/* Article Header Card */}
                <div
                  className="p-5 rounded-xl border-2 border-zinc-700 bg-gradient-to-br from-[#252525] to-[#1a1a1a] shadow-lg relative overflow-hidden"
                  style={{ borderLeftColor: activeEntry.color, borderLeftWidth: '6px' }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 border-2 shadow-inner"
                      style={{
                        backgroundColor: `${activeEntry.color}25`,
                        borderColor: activeEntry.color
                      }}
                    >
                      {activeEntry.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[11px] font-bold">
                          {isEn ? activeEntry.badgeEn : activeEntry.badgeZh}
                        </span>
                        <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">
                          ID: {activeEntry.id}
                        </span>
                      </div>
                      <h1 className="text-lg sm:text-xl font-black text-white mt-1 font-minecraft tracking-wide">
                        {isEn ? activeEntry.nameEn : activeEntry.nameZh}
                      </h1>
                      <p className="text-xs text-amber-200/90 font-medium mt-1">
                        {isEn ? activeEntry.taglineEn : activeEntry.taglineZh}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Article Narrative Description */}
                <div className="bg-[#222] p-5 rounded-xl border border-zinc-800 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'Encyclopedic Overview' : '百科詳細記載'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                    {isEn ? activeEntry.descriptionEn : activeEntry.descriptionZh}
                  </p>
                </div>

                {/* Quick Stats Grid */}
                {activeEntry.stats && activeEntry.stats.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isEn ? 'Key Parameters & Physics' : '關鍵數值與物理特徵'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeEntry.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-[#222222] p-3 rounded-lg border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="text-zinc-400 font-medium">
                            {isEn ? stat.labelEn : stat.labelZh}
                          </span>
                          <span className="font-bold text-emerald-300 text-right font-mono">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Survival Tips */}
                {((isEn ? activeEntry.tipsEn : activeEntry.tipsZh)?.length ?? 0) > 0 && (
                  <div className="bg-amber-950/20 border border-amber-800/40 p-4 sm:p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isEn ? 'Pro Survival Tips & Secrets' : '專家探勘生存秘訣'}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {(isEn ? activeEntry.tipsEn : activeEntry.tipsZh)?.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500">
                {isEn ? 'Select a topic on the left to read.' : '請點擊左側主題以瀏覽詳細內容。'}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#181818] px-5 py-3 border-t-2 border-[#333] flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span>
              {isEn
                ? 'Official Minecraft Lore & Field Survival Compendium'
                : 'Minecraft 官方典籍與野外探勘生存百科'}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-lg font-bold transition-colors cursor-pointer"
          >
            {isEn ? 'Close Encyclopedia' : '關閉百科全書'}
          </button>
        </div>
      </div>
    </div>
  );
};
