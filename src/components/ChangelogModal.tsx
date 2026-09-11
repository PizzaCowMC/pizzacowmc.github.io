import React, { useState } from 'react';
import {
  Scroll,
  X,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Filter,
  Smartphone,
  Pickaxe,
  Coffee,
  ShieldCheck,
  Layers,
  Award
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LogCategory = 'all' | 'feature' | 'sync' | 'balance' | 'fix';

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<LogCategory>('all');
  if (!isOpen) return null;

  const isEn = language === 'en';

  const logs = [
    {
      version: '2.5.30',
      isLatest: true,
      date: isEn
        ? '2.5.30 Cross-Device Cloud Sync & 6-Digit Migration & 50k Strata & Multi-Floor Cafe'
        : '2.5.30 全端跨裝置帳號同步・6位數引繼碼・50,000格地層挖滿・咖啡廳4層星級制',
      badge: isEn
        ? '2.5.30 Cloud Sync Engine • 6-Digit Sync Code • 50,000 Strata • F1-S3 Stars'
        : '2.5.30 跨裝置雲端同步引擎 • 6位數引繼碼 • 50,000格地層 • 咖啡廳F1~S3星級制',
      badgeColor: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg animate-pulse',
      summary: isEn
        ? 'Major release introducing true cross-device login, 6-digit sync code transfer, 50k block requirement across strata, and interactive update format.'
        : '重磅釋出：全端跨裝置伺服器帳號登入、6 位數快速引繼碼、前置地層挖滿 50,000 格挑戰與全新分級更新日誌格式！',
      highlights: [
        {
          category: 'sync',
          categoryLabel: isEn ? '📱 Cross-Device Cloud' : '📱 跨裝置雲端',
          tagColor: 'bg-purple-900/60 text-purple-300 border-purple-500/40',
          title: isEn
            ? 'Full-Stack Cross-Device Account & Cloud Save Engine'
            : '全端跨裝置帳號與雲端存檔同步系統（徹底解決跨裝置無法登入）',
          desc: isEn
            ? 'Transitioned to an authoritative server-backed database supporting cross-device user login. Players can now seamlessly sign into the exact same account across any smartphone, tablet, or PC without save loss or credential mismatch.'
            : '全面導入後端權威資料庫與跨裝置存檔引擎！徹底根除先前僅存於單一瀏覽器快取導致「無法跨裝置登入、密碼錯誤、進度遺失」的異常，支援任何電腦、手機與平板無縫同帳號遊玩。'
        },
        {
          category: 'sync',
          categoryLabel: isEn ? '🔑 Sync Code' : '🔑 6位數引繼碼',
          tagColor: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/40',
          title: isEn
            ? 'Instant 6-Digit Migration Code (Cross-Device Sync)'
            : '全新 6 位數專屬跨裝置引繼碼（無痛一鍵轉移進度）',
          desc: isEn
            ? 'Under Account & Cloud, tap "Device Sync" to generate a 6-digit migration code (e.g. MC-892104) with 1-click clipboard copy. Enter this code on another device or browser to restore your miner progress in 1 second!'
            : '在帳號面板中新增「跨裝置引繼碼」專區，可一鍵生成專屬 6 位數引繼代碼（如 MC-892104）並支援剪貼簿複製。在任何新手機或新瀏覽器輸入此碼，即可 1 秒瞬間還原並同步全部進度！'
        },
        {
          category: 'balance',
          categoryLabel: isEn ? '⛏️ Strata Balance' : '⛏️ 地層數值',
          tagColor: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
          title: isEn
            ? '50,000 Blocks Strata Excavation Requirement & Unlock Check'
            : '前方所有地層需挖滿 50,000 格方塊方可解鎖之平衡調整',
          desc: isEn
            ? 'In strict alignment with the mining progression rules, strata beyond Layer 1 now require a dedicated 50,000 mined blocks in the preceding stratum. Includes excavation percentage counters and elevator status synchronization.'
            : '嚴格響應地層開採規則，自第 2 層起至第 10 層，各層均須於前一層開採挖滿 50,000 格方塊方可解鎖！地底礦坑與紅石電梯塔已全面即時同步開採達成數與解鎖狀態。'
        },
        {
          category: 'feature',
          categoryLabel: isEn ? '☕ Cafe Expansion' : '☕ 咖啡廳擴建',
          tagColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
          title: isEn
            ? 'Multi-Floor Super Cafe (1F-4F) & F1~S3 Star Progression'
            : '咖啡廳擴建 1F~4F 露天酒吧全設施・F1~S3 二十一階星級收益系統',
          desc: isEn
            ? 'Super Cafe expanded to 4 distinct levels: 1F Main Hall, 2F Balcony Lounge, 3F VIP Terrace, and 4F Open-Air Rooftop Bar! Upgradable facilities now feature 21 distinct star ranks (F1~F3, E1~E3, D1~D3, C1~C3, B1~B3, A1~A3, S1~S3) generating dynamic passive coin royalties.'
            : '超級咖啡廳升級為 4 大樓層（1F 大廳、2F 景觀包廂、3F VIP 露台、4F 露天酒吧）！設施全面支援 F1 至 S3 共 21 階星級升級，顧客即時在席消費並為玩家帶來豐厚被動金幣分紅。'
        },
        {
          category: 'feature',
          categoryLabel: isEn ? '🎨 Format Upgrade' : '🎨 更新日誌格式',
          tagColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-500/40',
          title: isEn
            ? 'Brand New Categorized & Filterable Changelog Format'
            : '2.5.30 全新分級互動更新日誌格式（支援類別篩選與狀態標籤）',
          desc: isEn
            ? 'Redesigned the changelog UI with high-contrast Minecraft badges, interactive category filters (All, Features, Cloud, Strata, Fixes), and quick-scan release cards.'
            : '啟用 2.5.30 全新更新排版格式！支援頂部類別過濾器（全部、新功能、跨裝置、數值平衡、修復優化），每條更新均有精準分類標籤與色彩對比，閱讀更直觀清晰。'
        },
        {
          category: 'fix',
          categoryLabel: isEn ? '🛡️ Auth Fix' : '🛡️ 登入異常修復',
          tagColor: 'bg-rose-900/60 text-rose-300 border-rose-500/40',
          title: isEn
            ? 'Fixed "Weird Login" & Cross-Device Account Conflict Bugs'
            : '修復「登入怪怪的」與跨裝置帳號判定異常',
          desc: isEn
            ? 'Fixed issues where special character normalization, token expirations, and device browser cache mismatches caused login errors. Login now automatically detects cloud saves and loads your latest progress immediately.'
            : '徹底修復玩家名稱大小寫判定、瀏覽器無痕模式快取隔離以及登入驗證回傳異常；現在登入時若檢測到雲端已有存檔，將自動完成即時同步與載入。'
        }
      ]
    },
    {
      version: '2.5.2',
      isLatest: false,
      date: isEn ? '2.5.2 Multi-Track BGM & English Default' : '2.5.2 多重背景音樂 (BGM)・完整英文預設',
      badge: isEn ? '2.5.2 Multi-BGM Jukebox • English Default' : '2.5.2 多曲目唱片機 • 完整英文預設 • 像素美學',
      badgeColor: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg',
      summary: isEn ? 'Introduced 6 procedural BGM tracks and refined Minecraft aesthetics.' : '打造 6 首純程式化合成的懷舊 Minecraft 音樂唱片與像素地圖美化。',
      highlights: [
        {
          category: 'feature',
          categoryLabel: isEn ? '🎵 Audio' : '🎵 音樂音效',
          tagColor: 'bg-blue-900/60 text-blue-300 border-blue-500/40',
          title: isEn ? 'Multiple Procedural BGM Tracks & Redstone Jukebox' : '加入多個背景音樂 (BGM) 與紅石唱片機',
          desc: isEn
            ? 'Introduced nostalgic procedural 8-bit/16-bit musical tracks inspired by Minecraft with Jukebox controls.'
            : '打造懷舊風格音樂唱片：寧靜白晝、溫馨爐火、深層地鳴、煉獄熾焰、虛空輓歌與天界星環，隨場景自動切換。'
        },
        {
          category: 'feature',
          categoryLabel: isEn ? '🌐 Localization' : '🌐 雙語系',
          tagColor: 'bg-teal-900/60 text-teal-300 border-teal-500/40',
          title: isEn ? 'Full English Localization & Default English Experience' : '完整英文翻譯與預設英文語系',
          desc: isEn
            ? 'The game defaults to English on first launch with 100% comprehensive English localization.'
            : '系統首度啟動預設為英文語系，全遊戲各模組均具備流暢雙語切換支援。'
        }
      ]
    },
    {
      version: '2.5.1',
      date: isEn ? '2.5.1 Strata Ingredients Sync & Encyclopedia & Layer Lock Fix' : '2.5.1 地層產物點餐聯動・全域百科全書・第二層解鎖修復',
      badge: isEn ? '2.5.1 Strata Sync • Encyclopedia Wiki • Layer 2 Lock Bug Fixed' : '2.5.1 地層食材聯動 • 百科全書圖鑑 • 第二層開採防偷渡修復',
      badgeColor: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg',
      highlights: [
        {
          category: 'fix',
          categoryLabel: isEn ? '🛡️ Fix' : '🛡️ 修復',
          tagColor: 'bg-rose-900/60 text-rose-300 border-rose-500/40',
          title: isEn ? 'Fix Layer 2 Direct Unlock Bug' : '修復第二層淺層礦脈可直接解鎖之重大 Bug',
          desc: isEn
            ? 'Resolved the bug where stratum 2 (Shallow Mineral Vein) was mistakenly accessible from the start. All strata deeper than layer 1 now strictly require 100,000 mined blocks in the preceding stratum, fully synchronized across the Quarry and the Elevator!'
            : '徹底修復原本第 2 層「淺層礦脈」無須條件即可直接開採的錯誤！現在除了初始第 1 層「地表沉積層」之外，所有後續地層均嚴格要求必須在上一層累積開採滿 100,000 格方塊方可解鎖，礦坑切換面板與電梯系統全面精準同步！'
        },
        {
          category: 'feature',
          categoryLabel: isEn ? '☕ Cafe' : '☕ 咖啡廳',
          tagColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
          title: isEn ? 'Customer Orders Synced to Unlocked Strata Ingredients' : '顧客點餐與已解鎖地層產物方塊深度聯動',
          desc: isEn
            ? 'Customers visiting the Super Cafe will now exclusively order dishes crafted from ingredients that are yielded by your currently unlocked strata! Dig deeper into new strata layers to progressively unlock rarer dishes from the 1,000 gourmet recipe collection!'
            : '咖啡廳顧客現在只會點選由「玩家當前已解鎖之地層」所產出的方塊食材料理！隨著玩家深入開採解鎖更多地層，顧客點餐庫將循序漸進解鎖更奢華深奧的 1,000 道傳奇料理！'
        },
        {
          category: 'feature',
          categoryLabel: isEn ? '📖 Wiki' : '📖 百科',
          tagColor: 'bg-teal-900/60 text-teal-300 border-teal-500/40',
          title: isEn ? 'Global Minecraft Encyclopedia Quick Access' : '加入百科全書：大地圖、咖啡廳與地底礦坑全景快捷入口',
          desc: isEn
            ? 'Added direct "📖 Encyclopedia" buttons across the Overworld Map, Cafe Interior, and Quarry Mining interfaces. Instant access to full block classifications, hardness ratings, drop rates, monster codex, and cooking recipes anywhere in the world!'
            : '在大地圖控制列、咖啡廳頂部以及地底採掘礦坑全面配置「📖 百科全書」快捷按鈕！玩家隨時隨地可即時查閱所有方塊硬度、掉落倍率、地穴怪物弱點以及 1,000 道烹飪食材維基！'
        },
        {
          category: 'update',
          categoryLabel: isEn ? '🏷️ Version' : '🏷️ 版本',
          tagColor: 'bg-zinc-800 text-zinc-300 border-zinc-600/40',
          title: isEn ? 'Global Version Number Synchronized to v2.5.1' : '全域版本號同步更新至 2.5.1',
          desc: isEn
            ? 'Updated application footer versioning, changelog records, and system notifications to reflect the latest v2.5.1 release.'
            : '同步更新頁尾版本號標記、更新日誌資料庫與全域版本資訊至 2.5.1。'
        }
      ]
    },
    {
      version: '2.5.0 超級咖啡廳',
      date: isEn ? '2.5.0 Super Cafe & Overworld Map & Elevator Ascent' : '2.5.0 超級咖啡廳・手繪大地圖行走探索・紅石直達電梯與返回地面',
      badge: isEn ? '2.5.0 Super Cafe • 1,000 Dishes • Overworld Map • Elevator Surface Transit' : '2.5.0 超級咖啡廳 • 1,000 道特色料理 • 離開按鈕 • 電梯登陸地面',
      badgeColor: 'bg-gradient-to-r from-amber-500 via-emerald-600 to-cyan-500 text-white shadow-lg',
      highlights: [
        {
          type: 'feature',
          title: isEn ? '2.5.0 Super Mining Cafe & 1,000 Gourmet Recipes' : '2.5.0 超級咖啡廳：1,000 道獨創料理與客席點餐模擬',
          desc: isEn
            ? 'Transformed the experience into a Super Cafe Management simulation! Cook 1,000 unique dishes across 10 distinct categories. Mined blocks and ores directly fuel your cooking recipes to serve waiting guests and earn coins and tips!'
            : '全新進化為「2.5.0 超級咖啡廳」！打造橫跨 10 大主題、整整 1,000 道獨一無二的特色料理。地下採掘的礦石方塊直接化為食材，款待入座顧客並賺取豐厚金幣與小費！'
        },
        {
          type: 'feature',
          title: isEn ? 'Exit Buttons in Cafe & Mine & Overworld Map' : '咖啡廳與礦坑全面加入【離開按鈕】',
          desc: isEn
            ? 'Added dedicated, prominent Exit buttons in both the Cafe and Quarry Mine interfaces, allowing players to smoothly return to the 1F Overworld Map walking exploration!'
            : '在咖啡廳介面與礦坑介面均配備清晰醒目的「🚪 離開」按鈕，隨時一鍵返回 1F 大地圖步道，自由探索世界！'
        },
        {
          type: 'feature',
          title: isEn ? 'Elevator Ascent Rule: Deep Mine to Surface & Cafe' : '地底升陸法則：必須搭乘紅石蒸氣電梯才能返回地面與進入咖啡廳',
          desc: isEn
            ? 'As deep underground strata are isolated by sheer bedrock cliffs, players must ride the Redstone Steam Elevator to ascend to the surface Overworld map or directly into the 2F Cafe!'
            : '由於地底礦坑深達萬丈，玩家身處礦坑時，必須搭乘「紅石蒸氣高速電梯」才能突破岩層上到地面大地圖，或直達 2F 咖啡廳！'
        },
        {
          type: 'feature',
          title: isEn ? 'Hand-Drawn Overworld Walking Map (Faithful to Sketch)' : '手繪風格大地圖行走探索系統（完美依照手繪圖還原）',
          desc: isEn
            ? 'Interactive overworld walking map matching the user sketch: Cafe on the top-left, Mine Quarry on the bottom-left, green highway path, and the elevator on the right. Walk freely with WASD, arrow keys, or mouse/touch clicks!'
            : '完全依照玩家手繪圖紙打造互動式大地圖：左上方為咖啡廳、左下方為採掘礦坑、中央為綠色草地公路步道、右側為直達電梯！支援 WASD、方向鍵或點擊行走！'
        },
        {
          type: 'upgrade',
          title: isEn ? 'Cafe Upgrades, Auto-Waiter Cat & Atmosphere' : '超級咖啡廳擴建、三花貓自動店員與香氛設施',
          desc: isEn
            ? 'Expand up to 8 dining tables, hire an adorable Auto-Waiter Kitten to deliver prepared dishes automatically, install the Golden Espresso Roaster for +20% tips, and use the Lavender Aroma Diffuser for +50% customer patience!'
            : '可將座席擴充至 8 張桌位，聘請超萌三花貓店員自動幫忙端出備餐料理，升級黃金義式高壓咖啡機賺取額外 20% 小費，並安裝薰衣草氛香儀延長客人 50% 等候耐心！'
        }
      ]
    },
    {
      version: 'v2.4.0',
      date: isEn ? 'Level 100 System & 10 Strata Layers & Quest NaN Fix' : '等級系統開放至100級・10大地層全開放・晉升任務 NaN Bug 徹底修復',
      badge: isEn ? 'Lv.100 Ascendance & 10 Strata Layers & NaN Fix' : '等級上限至 Lv.100・101組冒險稱號・10大地層・晉升任務進度 NaN 修復',
      badgeColor: 'bg-gradient-to-r from-amber-500 via-purple-600 to-emerald-500 text-white shadow-lg',
      highlights: [
        {
          type: 'bugfix',
          title: isEn ? 'Promotion Special Quest NaN / 2 (NaN%) Bug Fixed' : '徹底修復晉升特殊任務進度顯示 NaN / 2 (NaN%) 的重大問題',
          desc: isEn
            ? 'Fixed the critical issue where promotion special quests tracking pickaxe tiers, enchantment levels, held coins, or strata layers evaluated missing properties resulting in NaN values. Fully synchronized player stats objects and applied safe numeric validation to guarantee accurate real-time quest tracking.'
            : '徹底修復了晉升特殊任務因鎬具階級、附魔總等級、地層探勘或持有金幣等屬性在傳遞時未正確綁定，導致運算出現「NaN / 2 (NaN%)」的重大問題！重新統一資料結構並加入數值安全防禦，確保每一階段的任務進度精準計算且即時呈現。'
        },
        {
          type: 'level',
          title: isEn ? 'Player Progression Extended to Level 100 with 101 Titles' : '冒險等級全面突破至 100 級上限，配備 101 組專屬冒險稱號',
          desc: isEn
            ? 'Extended the player promotion system up to Level 100! Added 101 bespoke bilingual titles (from Novice Miner to Omniscient Omnipotent Creator). Features dynamic high-tier procedural trials (quarry mastery, grand architecture, coin vaulting, arcane enchanting, achievements) scaling up to 1,000,000 coins and the legendary Apex Halo.'
            : '玩家等級與晉升突破系統全面解鎖至 Lv.100 最高階位！新增從「實習礦工」到「全知全能終極造物主」共 101 組中英文專屬稱號；20 級後提供循環遞增的高階考驗（深層採礦、百格創作、金幣聚寶、奧術登峰、成就登神），滿級更享有登頂專屬金燦榮耀與百萬金幣！'
        },
        {
          type: 'strata',
          title: isEn ? 'Expanded to 10 Strata Layers with 8 Ultimate Cosmic Blocks' : '地質深度擴增至 10 大地層，新增 8 種多維創世神話方塊',
          desc: isEn
            ? 'Added 2 brand-new endgame strata layers: Layer 9 [Chrono Rift & Singularity] and Layer 10 [Genesis Omniverse Core]. Introduced 8 cosmic blocks: Chrono Stone, Dark Matter Ore, Temporal Crystal, Singularity Core, Genesis Bedrock, Chaos Essence Ore, Omniverse Matrix, and Infinity Shard, complete with custom SVG textures and up to +60 XP rewards.'
            : '採石場深度正式拓展至 10 大地層！新增第 9 層【時空裂隙・奇點維度】與第 10 層【創世神域・終極宇宙母核】；推出時空暗岩、暗物質礦、時間裂變晶體、奇異點重力核、創世源生基岩、混沌原質神礦、寰宇神殿矩陣與無限永恆碎片等 8 種宇宙級神秘方塊，各具精緻專屬點陣紋理與高達 60 XP 經驗獎勵！'
        }
      ]
    },
    {
      version: 'v2.3.1',
      date: isEn ? 'Sword Durability 0/80 Bug Fix & Broken Blade Mechanism' : '神劍耐久 0/80 Bug 修復・折斷狀態與快速修復機制',
      badge: isEn ? 'Sword Durability Fix & Broken Blade State & Quick Repair' : '神劍耐久 0/80 修復・折斷降傷・戰鬥快速修復・工具自動切換優化',
      badgeColor: 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow',
      highlights: [
        {
          type: 'combat',
          title: isEn ? 'Sword 0/80 Durability Depletion & Full Damage Bug Fixed' : '修復神劍耐久歸零 (0/80) 仍具滿額攻擊力的重大 Bug',
          desc: isEn
            ? 'Fixed the critical issue where swords reaching 0 durability (e.g. 0/80) remained equipped, continuously allowed full-damage attacks, and repeatedly played break sounds on every hit. Added proper broken sword checks and sound suppression when durability is depleted.'
            : '徹底修復神劍耐久耗盡（如 0/80）時仍可揮出滿額攻擊力、重複播放碎裂音效且未正確進入折斷狀態的重大漏洞。耐久度耗盡時不再重複播放音效，並精確進入折斷機制。'
        },
        {
          type: 'feature',
          title: isEn ? 'Broken Blade State & In-Combat Quick Repair' : '全新折斷狀態、徒手刮痕傷害與戰鬥一鍵快速修復',
          desc: isEn
            ? 'When sword durability reaches 0, the blade is marked as [BROKEN]. Attacks drop to 1 scratch damage with instant warning banners. Added a one-click Quick Repair button directly in the combat interface and tool status card so players can sharpen swords immediately using coins.'
            : '當神劍耐久度歸零時，神劍將明確標註【已折斷/損壞】，戰鬥攻擊力退回徒手刮痕傷害 (1 點) 並即時提醒玩家；工具狀態欄與怪物戰鬥介面新增一鍵「🛠️ 快速修復神劍」按鈕，隨時消耗少量金幣磨利修復！'
        },
        {
          type: 'tools',
          title: isEn ? 'Tool Auto-Switch Logic Optimization' : '工具自動切換邏輯修復 (杜絕誤用神劍採礦耗損)',
          desc: isEn
            ? 'Fixed the issue where defeating or fleeing from monsters left the sword equipped while quarrying, which inadvertently wasted sword durability on stone blocks. Auto-switch now correctly restores the optimal mining tool (pickaxe/axe/shovel) after combat.'
            : '修復打怪結束或撤退後手持工具未能自動切回最優採礦工具（鎬/斧/鏟），導致玩家在不知情下以神劍挖掘方塊而迅速耗光神劍耐久度的問題。現在脫離戰鬥後將自動換回開採工具！'
        }
      ]
    },
    {
      version: 'v2.3.0',
      date: isEn ? 'Mining Loop Fix & Next Block Feature' : '連挖Bug修復與「就挖到下一個方塊」功能上線',
      badge: isEn ? 'Combat Runaway Fix & Advance to Next Block' : '打怪連挖修復・秒挖防連鎖・商店分頁點擊修復',
      badgeColor: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow',
      highlights: [
        {
          type: 'mining',
          title: isEn ? 'Continuous Mining Bug After Monsters Fixed' : '修復打怪後觸發持續連挖的 Bug',
          desc: isEn
            ? 'Resolved the critical issue where fighting monsters or exceeding block hardness caused unintentional automatic continuous mining. Added global mouse/touch-up listeners and combat state purges to ensure complete mining stops during and after mob encounters.'
            : '全面修復了「只要打怪完，就會處發Bug連續挖」的重大問題！新增全域指標釋放監聽器，並在怪物遭遇、戰鬥中、擊敗魔物以及撤退時主動清除採礦長按計時器，徹底杜絕背景自動連挖。'
        },
        {
          type: 'feature',
          title: isEn ? 'New Feature: Mine & Advance to Next Block' : '全新功能：就挖到下一個方塊 (單次/秒挖保護)',
          desc: isEn
            ? 'When your tool efficiency exceeds block hardness, mining the block now cleanly completes and advances to the next block ("就挖到下一個方塊") without runaway chained auto-breaking. Players can now precisely mine one block at a time or intentionally hold with a smooth pacing buffer.'
            : '加入「就挖到下一個方塊」保護機制！當工具效率或強度超越方塊硬度（秒挖）時，開採完成後會平穩切換至下一個方塊並自動停頓，防止單次點擊連鎖誤挖；長按開採時亦享有平滑緩衝過渡，手感更加精準可控！'
        },
        {
          type: 'shop',
          title: isEn ? 'Shop Navigation Tabs "Unclickable" Layout Fixed' : '商店選單分頁列「點不到」排版修復',
          desc: isEn
            ? 'Fixed the layout bug where shop navigation tabs were crushed or unclickable on certain screen sizes. Equipped all tabs with shrink-0, independent button cards, and improved touch targets.'
            : '解決了商店分頁列被垂直壓縮導致文字截斷與「點不到」的問題。將所有分頁標籤設置為防壓縮按鈕卡片（shrink-0），強化點擊熱區與反饋效果，所有商品分類一目了然、隨點即開！'
        }
      ]
    },
    {
      version: 'v2.2.8',
      date: isEn ? 'Encyclopedia & Volume Slider' : 'Minecraft 百科全書與音效拉桿更新',
      badge: isEn ? 'Official Lore Wiki & Master Volume Controls' : '全方位百科全書與主音效拉桿',
      badgeColor: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white shadow',
      highlights: [
        {
          type: 'wiki',
          title: isEn ? 'Comprehensive Minecraft Encyclopedia' : '全新加入：Minecraft 百科全書',
          desc: isEn
            ? 'Added an in-depth in-game Encyclopedia featuring comprehensive guides on Ores & Minerals, Blocks & Building Materials, Tool Tiers & Enchantments, Strata Depths, Mobs & Bosses, Redstone Mechanics, and Pro Survival Tips & Lore.'
            : '全新推出「Minecraft 百科全書」！收錄礦石與寶石、方塊與建材、鎬具工具階級與核心附魔、8大地質礦脈層深度、苦力怕與終界龍等怪物生態、紅石電路機制，以及經典水桶救命術與歷史冷知識。'
        },
        {
          type: 'audio',
          title: isEn ? 'Master Volume Slider in Game Menu' : '選單新增音效拉桿，移除頂部開關',
          desc: isEn
            ? 'Removed the header sound toggle button and integrated a continuous 0%–100% Master Volume Slider inside the Game Menu with instant mute/unmute and Web Audio routing.'
            : '依照需求移除頂部獨立音效按鈕，並於主遊戲選單（Menu）中全面升級為「遊戲主音效音量拉桿」，支援 0% 至 100% 精準調節與一鍵快速靜音/恢復。'
        }
      ]
    },
    {
      version: 'v2.2.7',
      date: isEn ? 'Level & Progression Update' : '玩家等級與晉升任務更新',
      badge: isEn ? 'Real Player Level, XP & Promotion Quests' : '真實玩家等級、經驗值與晉升特殊任務',
      badgeColor: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow',
      highlights: [
        {
          type: 'level',
          title: isEn ? 'Player Level & Real XP Progression' : '玩家真實等級（初始Lv.0）與經驗值機制',
          desc: isEn
            ? 'Player level now starts from Lv.0. Earning XP from mining blocks, placing structures, defeating monsters, trading, and completing milestones. Friends list now reflects genuine player levels instead of randomized values.'
            : '玩家等級正式上線！初始等級為 Lv.0，可藉由開採方塊、放置方塊、消滅怪物、市集交易與達成成就獲取經驗值。好友列表亦全面同步為真實等級。'
        },
        {
          type: 'quests',
          title: isEn ? 'Special Promotion Quests for Each Level' : '每級專屬晉升突破特殊任務',
          desc: isEn
            ? 'Leveling up requires fulfilling both the XP threshold and completing a dedicated Promotion Quest (e.g. mining milestones, tool upgrades, depth exploration, and economic targets) with massive coin ascension rewards.'
            : '升等不僅需要累積充足的經驗值，更須達成該等級特定的「晉升特殊任務」（如累積開採量、工具階級突破、地層深潛探索與經濟目標），突破成功可領取巨額金幣與榮譽稱號！'
        }
      ]
    },
    {
      version: 'v2.2.6',
      date: isEn ? 'Latest Bugfix & Session Overhaul' : '最新修正與會話持久化',
      badge: isEn ? 'Session Persistence & Identity Menu' : '帳號身分持久化與自動登出修復',
      badgeColor: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow',
      highlights: [
        {
          type: 'auth',
          title: isEn ? 'Auto-Logout Bug Fix & Session Persistence' : '解決登入自動登出問題與持久化會話',
          desc: isEn
            ? 'Resolved session desynchronization where users were unexpectedly logged out upon logging in. Local storage session bridge now preserves active login state seamlessly across page reloads and tab closures.'
            : '徹底修復登入後未即時顯示頭像與發生自動登出之異常！新增本地會話持久化橋接機制，刷新頁面或重開分頁均能持續保持登入狀態。'
        },
        {
          type: 'menu',
          title: isEn ? 'Profile Dropdown Menu in Header' : '頂部頭像＋名稱下拉快捷選單',
          desc: isEn
            ? 'Replaced generic login labels with dynamic player avatar and registered username. Clicking expands a Minecraft-styled dropdown menu providing quick access to Change Name, Avatar customizer, Settings, and secure Logout.'
            : '登入後頂部直接顯示個人專屬像素頭像與玩家名稱。點擊即可展開快捷選單，一鍵直達「變更名稱」、「更換頭像」、「遊戲設定」與「安全登出」。'
        }
      ]
    },
    {
      version: 'v2.2.5',
      date: isEn ? 'Authentication Update' : '帳號機制升級',
      badge: isEn ? 'Email-Free Auth & Name Conflict Check' : '免信箱帳號機制與重名衝突防護',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow',
      highlights: [
        {
          type: 'account',
          title: isEn ? 'Pure Username + Password Authentication' : '直接使用玩家名稱＋密碼登入',
          desc: isEn
            ? 'Removed cumbersome email verification workflows. Players can register and sign in directly using their chosen Miner handle and password with real-time uniqueness validation.'
            : '全面精簡註冊流程，徹底移除信箱驗證需求。玩家可直接以自訂玩家名稱與密碼輕鬆註冊與登入，並享有即時防重複名稱檢查。'
        },
        {
          type: 'friends',
          title: isEn ? 'Friend Code & Official Account Sync' : '好友視窗同步註冊名稱與防篡改',
          desc: isEn
            ? 'The friends panel now displays the verified registered username and unique player code, eliminating manual renaming confusion and ensuring multi-player identity integrity.'
            : '好友面板頂部統一展示註冊時設定的正式帳號名稱與專屬識別碼，並移除多餘更名鈕，確保好友互動身分真實可靠。'
        }
      ]
    },
    {
      version: 'v2.2.4',
      date: isEn ? 'Critical Hotfix' : '重要漏洞熱修復',
      badge: isEn ? 'Tool Durability Hotfix' : '工具耐久切換漏洞熱修復',
      badgeColor: 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow',
      highlights: [
        {
          type: 'tools',
          title: isEn ? 'Hotbar Durability Exploit Resolved' : '修正切換工具自動回滿耐久之漏洞',
          desc: isEn
            ? 'Patched an exploit where cycling tools in the inventory hotbar would reset pickaxe, shovel, axe, and sword durability back to 100%. Tool wear is now persistently tracked and preserved.'
            : '緊急修正先前在快捷欄更換手持工具時，鎬子、鏟子、斧頭或劍的耐久度會被意外補滿的漏洞。現在各工具的損耗程度皆具備獨立且持久的記錄機制。'
        }
      ]
    },
    {
      version: 'v2.2.3',
      date: isEn ? 'Quality of Life' : '品質優化更新',
      badge: isEn ? 'Code Label & UI String Cleanup' : '介面代碼露出修復與文字純化',
      badgeColor: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow',
      highlights: [
        {
          type: 'ui',
          title: isEn ? 'Function Code Leak Remediation' : '全面修復露出的函式代碼與多語系缺失',
          desc: isEn
            ? 'Scoured all dialogs, modal tooltips, market action labels, and notification banners to remove exposed code function names, replacing them with polished bilingual labels.'
            : '全面盤點並修復所有視窗按鈕、提示氣泡與交易訊息中意外露出原始函式名稱之錯誤，提升文字流暢度與專業質感。'
        }
      ]
    },
    {
      version: 'v2.2.2',
      date: isEn ? 'Customization Update' : '外觀自訂更新',
      badge: isEn ? 'Dedicated Avatar & Skin Switcher' : '獨立頭像與造型挑選器',
      badgeColor: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow',
      highlights: [
        {
          type: 'skins',
          title: isEn ? 'Avatar Select Modal' : '全新玩家造型更換視窗',
          desc: isEn
            ? 'Introduced an interactive Avatar Selection dialog featuring real-time preview, unlocked skins inventory, coin purchase integration, and one-tap equipping.'
            : '新增專屬角色造型選擇視窗，支援即時預覽外觀、金幣解鎖新造型以及一鍵換裝，讓個人採礦形象更加獨特搶眼！'
        }
      ]
    },
    {
      version: 'v2.2.1',
      date: isEn ? 'Identity Update' : '身分系統更新',
      badge: isEn ? 'Independent Change Name System' : '獨立變更名稱彈窗與衝突檢驗',
      badgeColor: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow',
      highlights: [
        {
          type: 'name',
          title: isEn ? 'ChangeNameModal & Duplication Check' : '獨立變更名稱視窗與雲端唯一性校驗',
          desc: isEn
            ? 'Implemented a dedicated name change interface with 2-20 character rules, whitespace trimming, and duplicate check across cloud database and local records.'
            : '打造獨立玩家更名介面，具備 2~20 字元嚴格規範、去空白化，並與雲端資料庫同步比對確認名稱未被佔用，保障玩家身分唯一性。'
        }
      ]
    },
    {
      version: 'v2.2.0',
      date: isEn ? 'Flagship Festival Update' : '旗艦盛典更新',
      badge: isEn ? 'Festivals & English Support' : '萬國節慶與預設英文雙語',
      badgeColor: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow',
      highlights: [
        {
          type: 'festivals',
          title: isEn ? 'Grand Festival Celebrations Hall' : '五大主題節慶活動大廳',
          desc: isEn
            ? 'Added Halloween, Christmas Aurora, Lunar New Year, Spring Sakura, and Tropical Summer festivals. Switch active themes, enjoy ambient falling particles (wisps, snow, sakura petals, golden ingots), and celebrate holidays year-round!'
            : '全新上線節慶狂歡大廳，涵蓋萬聖節、聖誕極光、農曆新春、春櫻盛開與夏日祭典！支援全域落櫻、聖誕飄雪、萬聖南瓜幽火、春節元寶等飄落粒子特效！'
        },
        {
          type: 'i18n',
          title: isEn ? 'Full English & Default English Language' : '完整英文支援並設為預設語系',
          desc: isEn
            ? 'Complete bilingual English and Traditional Chinese localization with English configured as the default language. Switch between English and Chinese effortlessly at any time via header or game menu.'
            : '全系統完整支援繁體中文與英文雙語切換，並以英文 (English) 作為預設初始語言，可隨時在頂部導覽列或遊戲主選單即時切換！'
        },
        {
          type: 'buffs',
          title: isEn ? 'Seasonal Boosters & Tactical Festival Supplies' : '節慶限定神鎬、補給道具與超強增益',
          desc: isEn
            ? 'Introduced holiday exclusive pickaxes (Pumpkin Shadow, Peppermint Crystal, Firecracker Fortune, etc.) alongside powerful booster supplies: Double Coins Pumpkin Candy, Zero-Durability Ice Shards, Extreme Haste Sakura Dango, and Lunar Red Packets.'
            : '推出南瓜暗影鎬、薄荷水晶鎬、爆竹迎春鎬等專屬限定神鎬，並附帶雙倍金幣糖果、極地零度鎬具耐久鎖定冰晶、春日三色團子極速採礦、新春開運大紅包等全新消耗品！'
        },
        {
          type: 'daily',
          title: isEn ? 'Daily Festive Gift Red Packet' : '節慶每日祝福大禮包',
          desc: isEn
            ? 'Miners can now visit the celebration hall once per day to claim free coin bundles with daily login tracking to accelerate their mining progression.'
            : '每日造訪節慶大廳均可免費領取祝福金幣禮包，內建跨日記錄狀態助您迅速累積拓荒資產！'
        }
      ]
    },
    {
      version: 'v2.1.0',
      date: isEn ? 'Major Feature Update' : '重大功能更新',
      badge: isEn ? '100k Stratum & Steam Automation' : '10萬格地層與蒸氣自動化',
      badgeColor: 'bg-gradient-to-r from-amber-600 to-cyan-600 text-white shadow',
      highlights: [
        {
          type: 'strata',
          title: isEn ? '100,000 Blocks Stratum Progression' : '100,000 格深層礦脈探索門檻',
          desc: isEn
            ? 'Elevated layer excavation requirements to 100,000 blocks mined per stratum. Journey from the Surface to the Aether Celestial Realm with true long-term mining goals!'
            : '全面升級地脈深層探索要求至 100,000 格方塊開採量！從地表一路挖向天界秘境，挑戰長線沉浸式極限拓荒！'
        },
        {
          type: 'auto',
          title: isEn ? 'Steam Auto-Miner Redstone Robot' : '蒸氣紅石自動採礦魔像',
          desc: isEn
            ? 'Unlock the steam automation golem in the supplies shop to automatically excavate 1 block every 3 seconds from your active mining layer.'
            : '商店補給區上架自動採礦機器人，每 3 秒自動為您在當前地層採掘 1 顆方塊，解放雙手累積豐厚礦產！'
        },
        {
          type: 'supplies',
          title: isEn ? 'Tactical Consumables & Supplies Shop' : '實用戰略補給品商店',
          desc: isEn
            ? 'Introduced Universal Repair Oil (instantly restores pickaxe durability to 100%), Haste Energy Drink (halves mining time for 60s), and Chain Mining TNT Packs (instantly explodes 30 stratum blocks).'
            : '新增萬能合金修復油（鎬具耐久度瞬間全滿）、急迫能量飲料（採礦冷卻減半翻倍開採）以及連鎖 TNT 炸藥包（瞬間開採 30 顆層級方塊）。'
        },
        {
          type: 'sfx',
          title: isEn ? 'Minecraft SFX & Audio Immersion' : '沉浸式 Minecraft 音效與全域開關',
          desc: isEn
            ? 'Overhauled realistic sound effects for block strikes, tool breakage alarms, upgrades, and coin pickups, paired with instant one-tap mute and volume toggles.'
            : '重製敲磚、鎬具損毀警報、鎬子升級、金幣掉落叮噹聲等逼真音效，並配置一鍵靜音與音效快速切換開關。'
        },
        {
          type: 'reset',
          title: isEn ? 'Protected Hardcore Progress Reset Zone' : '主選單紅色重置進度安全專區',
          desc: isEn
            ? 'Added a protected danger zone at the bottom of the game menu with dual-confirmation dialog to safely wipe all progress for players seeking a fresh start.'
            : '主選單底部新增防誤觸二次確認之危險重製專區，支援一鍵清空重回最初手無寸鐵之拓荒挑戰。'
        }
      ]
    },
    {
      version: 'v2.0.0',
      date: isEn ? 'Epic Overhaul' : '史詩更新',
      badge: isEn ? 'Deep Economy & 1,000 Trophies' : '深度經濟與千階成就',
      badgeColor: 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow',
      highlights: [
        {
          type: 'strata',
          title: isEn ? '8 Stratum Layers & Layer Unlock Mechanics' : '8 大深層礦脈層與分層探索機制',
          desc: isEn
            ? 'Expanded geology: Surface, Sedimentary, Crystalline Rift, Deepslate Abyss, Nether Core, End Void, Deep Dark, and Celestial Heaven.'
            : '全面擴充地質構造：地表表層、淺層岩石、水晶裂谷、深板岩深淵、下界地心、終界虛空、幽匿深穴、天界秘境！'
        },
        {
          type: 'economy',
          title: isEn ? 'Balanced Economy Model' : '全方塊價值降低 20% ＆ 商店物價調升',
          desc: isEn
            ? 'Rebalanced base block sell prices and shop item pricing to curb rapid inflation and provide satisfying long-term progression.'
            : '重新平衡經濟模型，遏制通貨膨脹與暴富速度：所有方塊售出基礎價值降低 20%，商店鎬子、附魔升級與外觀定價調整。'
        },
        {
          type: 'inflation',
          title: isEn ? 'Random Market Inflation Events' : '隨機市場通膨與行情波動系統',
          desc: isEn
            ? 'Real-time market waves: Hyper Inflation (+120%), Ore Boom (+150%), Construction Rush (+100%), Cosmic Surge (+180%), and Deflation!'
            : '交易所加入即時市場動態：世紀超級通膨海嘯 (+120%)、稀有礦石特約收購 (+150%)、王國宏大建材搶購 (+100%) 與秘境能量狂潮！'
        },
        {
          type: 'achievements',
          title: isEn ? 'Expanded to 1,000 Milestones' : '擴充至 1,000 個成就系統',
          desc: isEn
            ? 'Comprehensive milestones spanning mining volume, clicks, stratum depths, wealth accumulation, trading, and building.'
            : '成就總量全面擴充至 1,000 個，涵蓋挖掘量、點擊狂熱、層級拓荒、財富積累、高價拋售與裝備精通！'
        }
      ]
    },
    {
      version: 'v1.2.0',
      date: isEn ? 'Pre-release' : '前次重大更新',
      badge: isEn ? 'Account & Cloud Sync' : '帳號與雲端連線',
      badgeColor: 'bg-emerald-600 text-emerald-100',
      highlights: [
        {
          type: 'account',
          title: isEn ? 'Online Auth & Auto Login' : '線上帳號與自動登入',
          desc: isEn
            ? 'Support for unique user registration, password login, and persistent session authentication across devices.'
            : '支援全服唯一用戶註冊、密碼登入、登入狀態自動保持（自動登入）。'
        },
        {
          type: 'cloud',
          title: isEn ? 'Cloud Progress Save & Sync' : '雲端進度存檔與雙向同步',
          desc: isEn
            ? 'Coins, inventory, pickaxe tiers, durability, and building grids seamlessly saved to cloud Firestore.'
            : '遊戲幣、庫存方塊、鎬子階級、耐久度、建築區 100 格均可一鍵同步儲存至雲端資料庫。'
        },
        {
          type: 'menu',
          title: isEn ? 'Minecraft Styled Menu Drawer' : '全新 Minecraft 風格主選單',
          desc: isEn
            ? 'Global navigation drawer to jump between quarry, building, market, shop, trophies, friends, and accounts.'
            : '新增全局選單導航抽屜，可隨時在挖掘場、建築區、市場、商店、成就、好友、更新日誌與帳號間自由穿梭。'
        }
      ]
    },
    {
      version: 'v1.1.0',
      date: isEn ? 'Past Milestone' : '前次版本',
      badge: isEn ? 'Economic Loop' : '經濟與系統循環',
      badgeColor: 'bg-blue-600 text-blue-100',
      highlights: [
        {
          type: 'pickaxe',
          title: isEn ? 'Pickaxe Tiers & Durability System' : '鎬子等級、挖掘時間與耐久度機制',
          desc: isEn
            ? 'Introduced 7 major tool tiers from Bare Hands to Netherite with realistic hardness calculations.'
            : '新增徒手、木鎬、石鎬、鐵鎬、金鎬、鑽石鎬與獄髓鎬等 7 大階級，挖掘時間隨方塊硬度與鎬子效率真實計算。'
        },
        {
          type: 'market',
          title: isEn ? 'Resource Exchange' : '方塊交易市場',
          desc: isEn
            ? 'Trade mined blocks for coins to establish resource loops.'
            : '挖掘獲得的方塊可於市場批量或單項出售換取遊戲幣。'
        }
      ]
    },
    {
      version: 'v1.0.0',
      date: isEn ? 'Initial Launch' : '初始發布',
      badge: isEn ? 'Foundation' : '基礎架構',
      badgeColor: 'bg-zinc-600 text-zinc-200',
      highlights: [
        {
          type: 'quarry',
          title: isEn ? 'Excavation Core' : '挖掘場採礦核心',
          desc: isEn
            ? 'Click to mine blocks directly into your inventory.'
            : '點擊挖掘不同稀有度方塊，方塊直接納入玩家背包庫存。'
        },
        {
          type: 'build',
          title: isEn ? '100-Block Creative Stage' : '100 格創作建築區',
          desc: isEn
            ? '10x10 creative stage to build structures with harvested blocks.'
            : '提供 10x10 自由建築網格，消耗背包方塊拼貼建造各種建築造型。'
        }
      ]
    }
  ];

  const categoryCounts = {
    all: logs.reduce((acc, l) => acc + l.highlights.length, 0),
    feature: logs.reduce(
      (acc, l) =>
        acc +
        l.highlights.filter(
          (h: any) => h.category === 'feature' || h.type === 'feature' || h.type === 'upgrade'
        ).length,
      0
    ),
    sync: logs.reduce((acc, l) => acc + l.highlights.filter((h: any) => h.category === 'sync').length, 0),
    balance: logs.reduce(
      (acc, l) =>
        acc +
        l.highlights.filter(
          (h: any) => h.category === 'balance' || h.type === 'level' || h.type === 'strata'
        ).length,
      0
    ),
    fix: logs.reduce(
      (acc, l) =>
        acc +
        l.highlights.filter(
          (h: any) => h.category === 'fix' || h.type === 'fix' || h.type === 'bugfix' || h.type === 'combat'
        ).length,
      0
    )
  };

  const matchesCategory = (item: any) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'sync') return item.category === 'sync';
    if (selectedCategory === 'feature') return item.category === 'feature' || item.type === 'feature' || item.type === 'upgrade';
    if (selectedCategory === 'balance') return item.category === 'balance' || item.type === 'level' || item.type === 'strata';
    if (selectedCategory === 'fix') return item.category === 'fix' || item.type === 'fix' || item.type === 'bugfix' || item.type === 'combat';
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#242424] border-4 border-[#3c3c3c] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="bg-[#181818] px-6 py-4 border-b-4 border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Scroll className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-amber-400 font-minecraft tracking-wide">
                  📜 {t('changelog.title')}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded font-bold">
                  v2.5.30
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{t('changelog.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Category Bar (2.5.30 New Format) */}
        <div className="bg-[#1b1b1b] px-6 py-2.5 border-b border-[#333] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isEn ? 'Filter:' : '篩選：'}</span>
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-zinc-100 text-zinc-900 shadow'
                : 'bg-[#282828] text-zinc-300 hover:bg-[#333]'
            }`}
          >
            <span>{isEn ? 'All' : '全部'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full font-mono">
              {categoryCounts.all}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('feature')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'feature'
                ? 'bg-emerald-500 text-white shadow'
                : 'bg-[#282828] text-zinc-300 hover:bg-[#333]'
            }`}
          >
            <span>🚀 {isEn ? 'Features' : '新功能'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full font-mono">
              {categoryCounts.feature}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('sync')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'sync'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#282828] text-zinc-300 hover:bg-[#333]'
            }`}
          >
            <span>📱 {isEn ? 'Cross-Device' : '跨裝置同步'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full font-mono">
              {categoryCounts.sync}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('balance')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'balance'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-[#282828] text-zinc-300 hover:bg-[#333]'
            }`}
          >
            <span>⛏️ {isEn ? 'Strata & Balance' : '地層平衡'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full font-mono">
              {categoryCounts.balance}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('fix')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'fix'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-[#282828] text-zinc-300 hover:bg-[#333]'
            }`}
          >
            <span>🛡️ {isEn ? 'Fixes' : '修復'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full font-mono">
              {categoryCounts.fix}
            </span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* PizzaCowMC Developer Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-amber-950/40 border-2 border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐮</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400 text-sm">{t('changelog.author')}</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                    PizzaCowMC
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {isEn
                    ? 'Visit official GitHub repository for more open source projects & updates'
                    : '點擊右側連結前往 GitHub 查看更多開源專案與動態'}
                </p>
              </div>
            </div>
            <a
              href="https://github.com/PizzaCowMC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2ea44f] hover:bg-[#2c974b] text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>GitHub @PizzaCowMC</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {logs.map((ver, idx) => {
            const filteredHighlights = ver.highlights.filter(matchesCategory);
            if (filteredHighlights.length === 0) return null;

            return (
              <div
                key={idx}
                className={`border-2 rounded-xl p-4 shadow-md transition-all ${
                  (ver as any).isLatest
                    ? 'border-purple-500/60 bg-gradient-to-b from-[#241a2e] to-[#1c1c1c]'
                    : 'border-[#3a3a3a] bg-[#1c1c1c]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-amber-300 font-mono">{ver.version}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ver.badgeColor}`}
                    >
                      {ver.badge}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">{ver.date}</span>
                </div>

                {(ver as any).summary && (
                  <p className="text-xs text-zinc-300 mb-3 bg-[#161616] p-2.5 rounded-lg border border-[#2a2a2a] leading-relaxed">
                    💡 {(ver as any).summary}
                  </p>
                )}

                <div className="space-y-3">
                  {filteredHighlights.map((item: any, itemIdx: number) => (
                    <div
                      key={itemIdx}
                      className="flex items-start gap-2.5 bg-[#252525] p-3 rounded-lg border border-[#303030] hover:border-[#444] transition-all"
                    >
                      <div className="mt-0.5 text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-zinc-100">{item.title}</h4>
                          {item.categoryLabel && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                item.tagColor || 'bg-zinc-800 text-zinc-300 border-zinc-700'
                              }`}
                            >
                              {item.categoryLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-[#181818] px-6 py-3 border-t-2 border-[#333] flex items-center justify-between text-xs text-zinc-400">
          <span>{isEn ? 'Minecraft Quarry & Workshop v2.5.30' : 'Minecraft 挖掘場與建築工坊 v2.5.30'}</span>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-lg font-bold transition-colors cursor-pointer"
          >
            {t('changelog.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
