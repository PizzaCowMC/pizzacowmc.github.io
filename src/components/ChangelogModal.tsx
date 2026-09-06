import React from 'react';
import { Scroll, X, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  if (!isOpen) return null;

  const isEn = language === 'en';

  const logs = [
    {
      version: 'v2.2.4',
      date: isEn ? 'Latest Release' : '最新版本發布',
      badge: isEn ? 'Rendering Engine Stability & Blueprint Anti-Exploit' : '開採渲染衝突修復與藍圖防刷方塊機制',
      badgeColor: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white shadow',
      highlights: [
        {
          type: 'stability',
          title: isEn ? 'Component State-in-Render Collision Fix' : '徹底修復開採場組件跨級渲染狀態衝突 (setState-in-render)',
          desc: isEn
            ? 'Eliminated the React runtime warning "Cannot update a component (App) while rendering a different component (QuarryMining)". Decoupled block drop completions, durability wear triggers, and tool breakage routines from React state setter callbacks using synchronized mutable refs.'
            : '徹底修復了 React 運行時警告「Cannot update a component (`App`) while rendering a different component (`QuarryMining`)」！將開採敲擊進度與連續長按計時器完全解耦至 Mutable Ref 同步管理，杜絕在 setState 回呼函式中直接觸發父組件更新，保證極致流暢且零報錯。'
        },
        {
          type: 'blueprint',
          title: isEn ? 'Strict Inventory Deduction for Blueprints (No Free Blocks!)' : '1000格藍圖材料嚴格扣除・全面杜絕免費刷取方塊',
          desc: isEn
            ? 'Resolved the exploit where players could load blueprints without owning materials. Every 1,000-cell pixel blueprint strictly validates inventory counts, blocks construction if resources are deficient with exact deficit breakdowns, and deducts the consumed blocks from inventory.'
            : '全面修復並嚴格堵塞「切換藍圖可免費取得方塊」之平衡性漏洞！套用苦力怕、像素心、傳奇鑽石劍、黑曜要塞與光芒星辰等任何 1000 格藍圖時，系統即刻強制驗證背包材料；若材料不足將阻斷搭建並列出缺額明細，材料齊全則如實從背包扣除，徹底杜絕免費複製方塊。'
        },
        {
          type: 'inspector',
          title: isEn ? 'Interactive Blueprint Material Breakdown Inspector' : '內建藍圖材料清單檢視儀（ℹ️ 按鈕）',
          desc: isEn
            ? 'Added an inspector popover next to every preset in the Building Zone. Players can preview all required block types, required quantities vs current inventory counts, and deficit indicators before constructing.'
            : '於建築工坊藍圖按鈕旁全新新增「材料需求清單（ℹ️）」檢視儀，讓玩家在正式鋪設前，一鍵預覽各藍圖所需方塊種類、需求數量與背包現有庫存比對。'
        },
        {
          type: 'email',
          title: isEn ? 'Email Verification Code Security on Registration' : '註冊用戶信箱 6 位數安全驗證碼直接傳送',
          desc: isEn
            ? 'Integrated 6-digit verification code dispatch directly to the user-entered email address during registration. Includes 60s resend cooldown, instant formatting checks, and persistent verification status across cloud sync.'
            : '註冊帳號流程升級：用戶填寫電子信箱後點擊「發送驗證碼」，系統即時將 6 位數專屬驗證碼傳送至該用戶信箱，具備 60 秒冷卻倒數防刷、格式自動校驗，未通過驗證者無法完成註冊。'
        }
      ]
    },
    {
      version: 'v2.2.3',
      date: isEn ? 'Previous Release' : '前次版本更新',
      badge: isEn ? 'Combat Balance & Precision Engine' : '戰鬥練習場平衡與極致效能優化',
      badgeColor: 'bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 text-white shadow',
      highlights: [
        {
          type: 'combat',
          title: isEn ? 'Monster Balance & Combat Loot System' : '練習場怪物數值調教與戰鬥戰利品體系',
          desc: isEn
            ? 'Rebalanced attack, health, and coin drop formulas for all 8 training monsters (Zombies, Skeletons, Creepers, Spiders, Endermen, and the Wither Boss). Monsters defeated and damage dealt scale smoothly into combat coin rewards and dedicated combat achievement tiers.'
            : '全面微調 8 大訓練場經典怪物（殭屍、骷髏、苦力怕、洞穴蜘蛛、終界使者與凋零首領）之生命防禦與擊殺掉落曲線，將擊敗數量與傷害輸出無縫連動金幣戰利品與戰鬥專屬成就！'
        },
        {
          type: 'drag',
          title: isEn ? 'Fluid Drag-Painting & Eraser Mode in 1,000-Cell Studio' : '1000格工坊連續拖曳塗繪與抹除模式',
          desc: isEn
            ? 'Enhanced the building canvas with continuous drag-painting (Paint mode) and continuous reclamation (Eraser mode). Global event listeners prevent drag-sticking and ensure high-FPS interaction across the entire 1,000-cell grid.'
            : '建築工坊全新導入滑鼠按住連續拖曳放置（塗繪模式）與連續抹除（回收模式）！全局事件監聽確保跨瀏覽器邊界的穩定手感，在 1000 格大畫布上實現高幀率滑順鋪設。'
        },
        {
          type: 'save',
          title: isEn ? 'Cloud Save & Local Storage Resilience' : '雲端存檔與本地數據校驗加固',
          desc: isEn
            ? 'Strengthened bidirectional synchronization between Firebase Firestore and localStorage. Automatic boundary padding, schema migrations, and per-pickaxe durability fallback prevent data loss across sessions and device switches.'
            : '大幅強化 Firebase Firestore 與本地端存檔雙向同步防護機制，自動相容早期 100 格建築存檔並補齊至 1000 格，確保裝備、成就與統計數據跨裝置切換時萬無一失。'
        }
      ]
    },
    {
      version: 'v2.2.2',
      date: isEn ? 'Feature Update' : '功能修復與優化',
      badge: isEn ? 'Independent Durability & Anvil Quick-Repair' : '獨立鎬具耐久記憶與商店鐵砧修復',
      badgeColor: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow',
      highlights: [
        {
          type: 'durability',
          title: isEn ? 'Independent Durability Tracking per Tool' : '每把鎬具獨立耐久度記錄系統',
          desc: isEn
            ? 'Fixed the issue where switching pickaxes reset damaged tools to full durability. Every owned pickaxe (wood, stone, iron, gold, diamond, netherite, and seasonal festival picks) now maintains its exact wear state independently in save files.'
            : '徹底修復切換鎬具時耐久度異常回滿的問題！玩家所持有的每把鎬具（木、石、鐵、金、鑽石、獄髓與節慶限定款）均具備獨立持久度狀態表，換裝時精準記憶並自動保存當前磨損狀況。'
        },
        {
          type: 'shop',
          title: isEn ? 'In-Shop Direct Repair Buttons & Status Badges' : '商店陳列庫即時獨立修復與損毀警示',
          desc: isEn
            ? 'The pickaxe catalog now renders live durability percentages, warning tags (Damaged in amber, Broken in red), and direct one-click repair buttons next to each damaged tool without requiring players to equip them first.'
            : '商店鎬具陳列庫即時顯示每把工具的剩餘耐久數值與百分比（受損顯示黃字、損毀顯示紅字警報），並提供「直接快速修復」按鈕，無需換裝即可一鍵保養整備！'
        },
        {
          type: 'alarm',
          title: isEn ? 'Tool Breakage Audio & Safety Warning' : '鎬具損毀音效警報與低速防護機制',
          desc: isEn
            ? 'Added custom tool breakage sound cues and pulsing visual tags. When durability reaches zero, the miner speed safely throttles with an on-screen repair prompt, preventing wasted mining actions.'
            : '加入鎬具耐久歸零損毀時的專案破碎警報音效與呼吸警示標籤，採礦時自動保護降速並提醒玩家前往鐵砧或商店修復，大幅提升生存真實感與裝備管理樂趣。'
        }
      ]
    },
    {
      version: 'v2.2.1',
      date: isEn ? 'Milestone Expansion' : '重大里程碑擴充',
      badge: isEn ? '100k Trophies & 1,000-Cell Studio' : '10萬終極成就與1000格超大建築區',
      badgeColor: 'bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-500 text-white shadow',
      highlights: [
        {
          type: 'achievements',
          title: isEn ? 'Scalable 100,000 Milestone Achievement Engine' : '100,000 個終極成就引擎全面上線',
          desc: isEn
            ? 'Expanded the achievement system to 100,000 individual milestones across 12 categories: Stratum excavation, coin titans, equipment mastery, 1,000-block architecture, social bonds, and training monsters. Built with O(log N) binary search for zero UI latency.'
            : '成就榮耀殿堂正式擴充至十萬個（100,000）終極里程碑！涵蓋 8 大地層深探、金庫儲備、鍛造鐵匠、建築藝術家、名錄收藏與怪物狩獵等 12 組成就組，結合二分搜尋算法保持極致零延遲！'
        },
        {
          type: 'building',
          title: isEn ? '1,000-Cell Creative Studio (25x40 Grid)' : '1000 格超大平面建築創作工坊',
          desc: isEn
            ? 'Expanded the creative canvas from 100 cells to 25 columns × 40 rows (1,000 cells total). Added Compact, Normal, and Large multi-level zoom controls with live occupancy percentages and full inventory recycling.'
            : '建築創作畫布由原先的 100 格巨幅升級至 25 列 × 40 行（全域共 1,000 格）！全新配備「小（緊湊全覽）」、「中（標準）」、「大（特大精準）」三段縮放視角與即時使用率進度條。'
        },
        {
          type: 'blueprints',
          title: isEn ? '1,000-Cell Pixel Art Blueprint Presets' : '1000 格精選像素藍圖一鍵鋪設',
          desc: isEn
            ? 'Introduced 5 high-definition pixel blueprints crafted specifically for the 1,000-cell grid: Giant Creeper Face, Classic Pixel Heart, Legendary Diamond Sword, Obsidian Fortress Castle, and Glowing Star of Destiny.'
            : '內建 5 款專為 1000 格畫布量身打造的大型像素藍圖：巨型苦力怕肖像、經典像素心、傳奇鑽石劍、雄偉黑曜石要塞與光芒星辰，一鍵套用且支援 100% 完整回收背包！'
        }
      ]
    },
    {
      version: 'v2.2.0',
      date: isEn ? 'Latest Flagship Update' : '最新旗艦盛典',
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
      badge: isEn ? 'Firebase & Cloud Sync' : 'Firebase 與雲端連線',
      badgeColor: 'bg-emerald-600 text-emerald-100',
      highlights: [
        {
          type: 'firebase',
          title: isEn ? 'Firebase Online Auth & Auto Login' : 'Firebase 線上帳號與自動登入',
          desc: isEn
            ? 'Support for user registration, email login, and persistent session authentication across devices.'
            : '正式接入 Firebase 系統，支援用戶註冊、電子郵件密碼登入、登入狀態自動保持（自動登入）。'
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
              <h2 className="text-xl font-black text-amber-400 font-minecraft tracking-wide">
                📜 {t('changelog.title')}
              </h2>
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

          {logs.map((ver, idx) => (
            <div key={idx} className="border-2 border-[#3a3a3a] bg-[#1c1c1c] rounded-xl p-4 shadow-md">
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

              <div className="space-y-3">
                {ver.highlights.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2.5 bg-[#252525] p-2.5 rounded-lg border border-[#303030]">
                    <div className="mt-0.5 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">{item.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#181818] px-6 py-3 border-t-2 border-[#333] flex items-center justify-between text-xs text-zinc-400">
          <span>{isEn ? 'Minecraft Quarry & Workshop v2.2.4' : 'Minecraft 挖掘場與建築工坊 v2.2.4'}</span>
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
