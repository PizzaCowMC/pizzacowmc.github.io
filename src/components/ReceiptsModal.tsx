import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  Search,
  Coins,
  Sparkles,
  Printer,
  Copy,
  Check,
  Trash2,
  Clock,
  Flame,
  User,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Store,
  ChevronRight
} from 'lucide-react';
import { CafeReceipt } from '../types';
import { calculateReceiptsSummary, clearStoredReceipts } from '../utils/receiptSystem';
import { sound } from '../utils/soundEffects';

interface ReceiptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: CafeReceipt[];
  onClearReceipts: () => void;
  isEn?: boolean;
}

export const ReceiptsModal: React.FC<ReceiptsModalProps> = ({
  isOpen,
  onClose,
  receipts,
  onClearReceipts,
  isEn = false
}) => {
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Summary Metrics
  const summary = useMemo(() => calculateReceiptsSummary(receipts), [receipts]);

  // Filtered Receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      const matchesSearch =
        searchQuery === '' ||
        r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerNameZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.dishNameZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.dishNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(r.dishNumber).includes(searchQuery);

      const matchesCat =
        selectedCategoryFilter === 'all' || r.dishCategory === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [receipts, searchQuery, selectedCategoryFilter]);

  // Currently selected receipt
  const activeReceipt = useMemo(() => {
    if (selectedReceiptId) {
      const found = receipts.find(r => r.id === selectedReceiptId);
      if (found) return found;
    }
    return filteredReceipts[0] || receipts[0] || null;
  }, [selectedReceiptId, receipts, filteredReceipts]);

  if (!isOpen) return null;

  const handleCopyReceiptText = () => {
    if (!activeReceipt) return;
    sound.playClickSound();

    const text = isEn ? `
========================================
   MINECRAFT MINING CAFE • DINING RECEIPT
   ${activeReceipt.receiptNumber}
========================================
Time: ${activeReceipt.timestamp}
Table: ${activeReceipt.tableLabelEn}
Guest: ${activeReceipt.customerAvatar} ${activeReceipt.customerNameEn}

----------------------------------------
Item Ordered:
#${activeReceipt.dishNumber} ${activeReceipt.dishIcon} ${activeReceipt.dishNameEn}
Cooking Time: ${activeReceipt.cookingDurationFormattedEn}
Base Price: ${activeReceipt.basePrice} Coins
Facility Star Bonus: +${activeReceipt.starPriceBonusPct}% (${activeReceipt.starRank})
Patience Tip Multiplier: x${(activeReceipt.tipMultiplier * activeReceipt.speedBonus).toFixed(2)}
Staff Multiplier: x${activeReceipt.staffBonusMultiplier.toFixed(2)}
----------------------------------------
TOTAL PAID: ${activeReceipt.totalEarnings} Coins
Culinary XP: +${activeReceipt.xpEarned} XP
Status: [PAID - Settled in Full]
========================================
   Thank you for dining with us!
   See you again underground!
========================================
    `.trim() : `
========================================
   MINECRAFT 礦業咖啡廳・點餐消費收據
   ${activeReceipt.receiptNumber}
========================================
時間: ${activeReceipt.timestamp}
客席: ${activeReceipt.tableLabelZh}
顧客: ${activeReceipt.customerAvatar} ${activeReceipt.customerNameZh}

----------------------------------------
餐點項目:
#${activeReceipt.dishNumber} ${activeReceipt.dishIcon} ${activeReceipt.dishNameZh}
烹飪耗時: ${activeReceipt.cookingDurationFormattedZh}
基本定價: ${activeReceipt.basePrice} 金幣
設施星級加成: +${activeReceipt.starPriceBonusPct}% (${activeReceipt.starRank})
滿意小費乘數: x${(activeReceipt.tipMultiplier * activeReceipt.speedBonus).toFixed(2)}
職員調度加乘: x${activeReceipt.staffBonusMultiplier.toFixed(2)}
----------------------------------------
結帳金額: ${activeReceipt.totalEarnings} 金幣
經驗獎勵: +${activeReceipt.xpEarned} XP
付款狀態: [PAID 已結清]
========================================
   感謝您的光臨！歡迎再次探訪地底咖啡廳！
========================================
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    if (window.confirm(isEn ? 'Clear all receipt history?' : '確定要清除所有點餐收據歷史存根嗎？')) {
      sound.playClickSound();
      clearStoredReceipts();
      onClearReceipts();
      setSelectedReceiptId(null);
    }
  };

  return (
    <div
      id="receipts_modal_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        id="receipts_modal_container"
        className="relative w-full max-w-5xl bg-zinc-950 border-2 border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-minecraft">
                  {isEn ? 'Cafe Ledger & Receipts System' : '點餐收據系統・營運存根聯'}
                </h2>
                <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded-full uppercase">
                  v2.5.40 NEW
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {isEn
                  ? 'Real-time billing slips, cooking duration tracking, and revenue ledger'
                  : '即時開立熱感印收據、料理耗時追蹤、顧客滿意度與營收報表'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {receipts.length > 0 && (
              <button
                onClick={handleClear}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 border border-zinc-700 hover:border-rose-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title={isEn ? 'Clear Receipts' : '清除存根'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? 'Clear' : '清除'}</span>
              </button>
            )}
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-zinc-900/60 border-b border-zinc-800">
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase">
                {isEn ? 'Total Gross Revenue' : '收據累計總營業額'}
              </div>
              <div className="text-sm sm:text-base font-mono font-black text-amber-300">
                +{summary.totalGrossCoins.toLocaleString()} {isEn ? 'Coins' : '金幣'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase">
                {isEn ? 'Receipts Issued' : '已開立結帳收據'}
              </div>
              <div className="text-sm sm:text-base font-mono font-black text-blue-300">
                {summary.totalReceiptsCount} {isEn ? 'Slips' : '張存根'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase">
                {isEn ? 'Average Ticket' : '每單平均客單價'}
              </div>
              <div className="text-sm sm:text-base font-mono font-black text-emerald-300">
                ~{summary.averageTicketCoins.toLocaleString()} {isEn ? 'Coins' : '金幣'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase">
                {isEn ? 'Total Tips Earned' : '顧客讚賞小費總計'}
              </div>
              <div className="text-sm sm:text-base font-mono font-black text-purple-300">
                +{summary.totalTipsEarned.toLocaleString()} {isEn ? 'Coins' : '金幣'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body: Split View (List on Left, Thermal Slip on Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Receipts Ledger List (5 cols) */}
          <div className="md:col-span-6 lg:col-span-5 border-r border-zinc-800 flex flex-col overflow-hidden bg-zinc-950">
            {/* Search & Filter */}
            <div className="p-3 border-b border-zinc-800 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search receipt #, guest, dish...' : '搜尋單號、顧客姓名、餐點...'}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] custom-scrollbar">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {isEn ? 'All' : '全部'}
                </button>
                {['coffee', 'tea_beverage', 'pastry', 'hot_meal', 'void', 'deep_dark', 'celestial', 'mythic'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === cat
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {filteredReceipts.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 space-y-2">
                  <div className="text-3xl">🧾</div>
                  <p className="text-xs">
                    {receipts.length === 0
                      ? (isEn ? 'No receipts recorded yet. Serve orders in Cafe to generate slips!' : '尚無點餐結帳記錄。在客席接待並上菜後即會自動開立收據！')
                      : (isEn ? 'No receipts matching search criteria.' : '無符合搜尋條件的收據。')}
                  </p>
                </div>
              ) : (
                filteredReceipts.map(r => {
                  const isSelected = activeReceipt?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        sound.playClickSound();
                        setSelectedReceiptId(r.id);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                          : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl flex-shrink-0">{r.customerAvatar}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-amber-400">{r.receiptNumber}</span>
                            <span className="text-[9px] text-zinc-400 font-mono">
                              {r.timestamp.split(' ')[1] || r.timestamp}
                            </span>
                          </div>
                          <div className="text-xs font-bold truncate text-zinc-100 flex items-center gap-1">
                            <span>{r.dishIcon}</span>
                            <span className="truncate">{isEn ? r.dishNameEn : r.dishNameZh}</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-amber-400/80" />
                            <span>{isEn ? r.cookingDurationFormattedEn : r.cookingDurationFormattedZh}</span>
                            <span className="text-zinc-600">·</span>
                            <span>{isEn ? r.customerNameEn : r.customerNameZh}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-mono font-black text-amber-300">
                          +{r.totalEarnings}
                        </div>
                        <div className="text-[9px] font-mono text-emerald-400">
                          +{r.xpEarned} XP
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ml-auto mt-0.5 ${isSelected ? 'text-amber-400' : 'text-zinc-600'}`} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Thermal Paper Receipt Preview (7 cols) */}
          <div className="md:col-span-6 lg:col-span-7 bg-zinc-900/40 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-start custom-scrollbar">
            {activeReceipt ? (
              <div className="w-full max-w-md space-y-4">
                {/* Thermal Receipt Paper Card */}
                <div
                  id="thermal_paper_receipt"
                  className="relative bg-[#fbfbfa] text-zinc-800 rounded-sm p-6 sm:p-8 shadow-2xl font-mono border-t-8 border-dashed border-zinc-400 border-b-8 select-text"
                >
                  {/* Decorative Watermark / Stamp */}
                  <div className="absolute top-6 right-6 border-4 border-emerald-600 text-emerald-700 font-black text-xs sm:text-sm px-2.5 py-1 rounded rotate-[-12deg] opacity-80 uppercase tracking-widest pointer-events-none">
                    PAID 已結清
                  </div>

                  {/* Receipt Header */}
                  <div className="text-center pb-4 border-b-2 border-dashed border-zinc-300 space-y-1">
                    <div className="text-lg font-black tracking-widest text-zinc-900 font-minecraft flex items-center justify-center gap-1.5">
                      <span>☕</span>
                      <span>MINECRAFT CAFE</span>
                    </div>
                    <div className="text-[11px] text-zinc-600 tracking-wide font-sans">
                      {isEn ? 'Culinary Workshop & Dining Hall' : '礦業咖啡廳・地底千味盛宴'}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {activeReceipt.receiptNumber}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {activeReceipt.timestamp}
                    </div>
                  </div>

                  {/* Table & Customer Details */}
                  <div className="py-3 border-b border-dashed border-zinc-300 text-xs space-y-1 font-sans">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{isEn ? 'Location / Table:' : '客席座標:'}</span>
                      <span className="font-bold text-zinc-800">{isEn ? activeReceipt.tableLabelEn : activeReceipt.tableLabelZh}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">{isEn ? 'Guest:' : '用餐貴賓:'}</span>
                      <span className="font-bold text-zinc-800 flex items-center gap-1">
                        <span>{activeReceipt.customerAvatar}</span>
                        <span>{isEn ? activeReceipt.customerNameEn : activeReceipt.customerNameZh}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{isEn ? 'Guest Satisfaction:' : '上菜滿意度:'}</span>
                      <span className="font-bold text-emerald-700">{activeReceipt.patienceAtServe}% (滿意)</span>
                    </div>
                  </div>

                  {/* Order Item & Cooking Duration */}
                  <div className="py-3 border-b-2 border-dashed border-zinc-300 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <span className="text-xl">{activeReceipt.dishIcon}</span>
                        <div>
                          <div className="text-xs font-black text-zinc-900 font-minecraft">
                            #{activeReceipt.dishNumber} {isEn ? activeReceipt.dishNameEn : activeReceipt.dishNameZh}
                          </div>
                          <div className="text-[10px] text-zinc-600 font-sans">
                            {isEn ? `Category: ${activeReceipt.dishCategory}` : `類別: ${activeReceipt.dishCategory}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-black font-mono text-zinc-900">
                        x{activeReceipt.quantity}
                      </div>
                    </div>

                    {/* 2.5.40 Cooking Duration Highlight Box */}
                    <div className="bg-amber-50 border border-amber-300 rounded p-2 text-[11px] space-y-1 font-sans">
                      <div className="flex items-center justify-between text-amber-900 font-bold">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-600" />
                          <span>{isEn ? 'Cooking Duration:' : '灶台烹飪耗時:'}</span>
                        </span>
                        <span className="font-mono font-black text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                          {isEn ? activeReceipt.cookingDurationFormattedEn : activeReceipt.cookingDurationFormattedZh}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-700/90 leading-tight">
                        {isEn
                          ? `Dish complexity level calculated: ${activeReceipt.cookingDurationSeconds}s cooking queue.`
                          : `依據地層礦物與料理複雜度耗時計算：需經 ${activeReceipt.cookingDurationSeconds} 秒爐火慢燉。`}
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown Calculation */}
                  <div className="py-3 border-b-2 border-dashed border-zinc-300 text-xs space-y-1.5 font-sans">
                    <div className="flex justify-between text-zinc-600">
                      <span>{isEn ? 'Base Sell Price:' : '餐點基本定價:'}</span>
                      <span className="font-mono font-bold text-zinc-800">{activeReceipt.basePrice} 金幣</span>
                    </div>

                    {activeReceipt.starPriceBonusPct > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>{isEn ? `Facility Star Rank (${activeReceipt.starRank}):` : `全設施星級加成 (${activeReceipt.starRank}):`}</span>
                        <span className="font-mono font-bold">+{activeReceipt.starPriceBonusPct}%</span>
                      </div>
                    )}

                    <div className="flex justify-between text-purple-700">
                      <span>{isEn ? 'Speed & Tip Multiplier:' : '速度滿意與尊爵小費:'}</span>
                      <span className="font-mono font-bold">x{(activeReceipt.tipMultiplier * activeReceipt.speedBonus).toFixed(2)}</span>
                    </div>

                    {activeReceipt.staffBonusMultiplier > 1.0 && (
                      <div className="flex justify-between text-blue-700">
                        <span>{isEn ? 'Staff Management Bonus:' : '職員職位經理加乘:'}</span>
                        <span className="font-mono font-bold">x{activeReceipt.staffBonusMultiplier.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-500 text-[10px]">
                      <span>{isEn ? 'Sovereign Tax:' : '礦區主權營業稅:'}</span>
                      <span className="font-mono">0% (免稅)</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="py-3 border-b-2 border-dashed border-zinc-300 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
                        {isEn ? 'TOTAL RECEIVED' : '實收總額 (TOTAL)'}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-sans font-bold">
                        +{activeReceipt.xpEarned} XP Cafe Experience
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-zinc-900">
                      {activeReceipt.totalEarnings} <span className="text-xs font-normal">金幣</span>
                    </div>
                  </div>

                  {/* Simulated Barcode & Footer */}
                  <div className="pt-4 text-center space-y-2">
                    {/* Barcode lines */}
                    <div className="flex justify-center items-center gap-[2px] h-9 px-4 opacity-75">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div
                          key={i}
                          className={`bg-zinc-800 h-full ${
                            i % 4 === 0 ? 'w-1' : i % 3 === 0 ? 'w-[2px]' : 'w-[1px]'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono tracking-widest">
                      * {activeReceipt.receiptNumber} *
                    </div>
                    <div className="text-[10px] text-zinc-500 italic font-sans">
                      {isEn ? 'Thank you for dining with us! Come back soon!' : '感謝您的蒞臨與支持！歡迎再次光臨！'}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar below receipt */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={handleCopyReceiptText}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? (isEn ? 'Copied!' : '已複製收據！') : (isEn ? 'Copy Receipt Text' : '複製收據文字')}</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClickSound();
                      window.print();
                    }}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isEn ? 'Print Slip' : '列印存根聯'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-zinc-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-xs">{isEn ? 'Select a receipt from the list to view details' : '請從左側清單選擇一張收據查看熱感印存根'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
