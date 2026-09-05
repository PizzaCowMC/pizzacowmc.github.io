import React from 'react';
import { Scroll, X, Sparkles, CheckCircle2, Cloud, Pickaxe, Award, Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const logs = [
    {
      version: 'v2.0.0',
      date: '最新史詩更新',
      badge: '深度經濟與千階成就',
      badgeColor: 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow',
      highlights: [
        {
          type: 'strata',
          title: '8 大深層礦脈層與 50,000 格解鎖機制',
          desc: '全面擴充地質構造：地表表層、淺層岩石、水晶裂谷、深板岩深淵、下界地心、終界虛空、幽匿深穴、天界秘境！每一層必須在上一層挖滿 50,000 格方塊才能深入下一層！'
        },
        {
          type: 'economy',
          title: '全方塊價值降低 20% ＆ 商店物價提升 50%',
          desc: '重新平衡經濟模型，遏制通貨膨脹與暴富速度：所有方塊售出基礎價值降低 20%，商店鎬子、附魔升級、主題背景與外觀定價全面調升 50%。'
        },
        {
          type: 'inflation',
          title: '隨機市場通膨與行情波動系統',
          desc: '交易所加入即時市場動態：世紀超級通膨海嘯 (+120%)、稀有礦石特約收購 (+150%)、王國宏大建材搶購 (+100%)、秘境能量狂潮 (+180%) 與短暫緊縮期！即時倒數並可把握時機拋售賺大錢！'
        },
        {
          type: 'achievements',
          title: '擴充至 1,000 個成就系統',
          desc: '成就總量全面擴充至 1,000 個，涵蓋挖掘量、點擊狂熱、層級拓荒、財富積累、高價拋售、通膨套利、建築巨構與裝備精通，附帶分頁瀏覽與快速領獎功能！'
        }
      ]
    },
    {
      version: 'v1.2.0',
      date: '前次重大更新',
      badge: 'Firebase 與雲端連線',
      badgeColor: 'bg-emerald-600 text-emerald-100',
      highlights: [
        {
          type: 'firebase',
          title: 'Firebase 線上帳號與自動登入',
          desc: '正式接入 Firebase 系統，支援用戶註冊、電子郵件密碼登入、登入狀態自動保持（自動登入），不再受限於單機裝置。'
        },
        {
          type: 'cloud',
          title: '雲端進度存檔與雙向同步',
          desc: '遊戲幣、庫存方塊、鎬子階級、耐久度、建築區 100 格、150 個成就狀態均可一鍵同步儲存至雲端資料庫。'
        },
        {
          type: 'config',
          title: '支援自訂 Firebase 專案',
          desc: '支援使用者直接套用自己的線上 Firebase 專案（支援環境變數或直接貼上 Firebase Web Config 設定）。'
        },
        {
          type: 'clean',
          title: '淨化測試資料',
          desc: '移除過往硬編碼的測試好友與虛擬假資料，提供純淨真實的社交與存檔體系。'
        },
        {
          type: 'menu',
          title: '全新 Minecraft 風格主選單',
          desc: '新增全局選單導航抽屜，可隨時在挖掘場、建築區、市場、商店、成就、好友、更新日誌與帳號間自由穿梭。'
        },
        {
          type: 'credit',
          title: 'By PizzaCowMC 官方專案連結',
          desc: '加入開發者標識與 GitHub 快速直達連結 (https://github.com/PizzaCowMC)。'
        }
      ]
    },
    {
      version: 'v1.1.0',
      date: '前次重大更新',
      badge: '經濟與系統循環',
      badgeColor: 'bg-blue-600 text-blue-100',
      highlights: [
        {
          type: 'pickaxe',
          title: '鎬子等級、挖掘時間與耐久度機制',
          desc: '新增徒手、木鎬、石鎬、鐵鎬、金鎬、鑽石鎬與獄髓鎬等 7 大階級，挖掘時間隨方塊硬度與鎬子效率真實計算，附帶耐久度消耗與鐵砧修復。'
        },
        {
          type: 'market',
          title: '方塊交易市場',
          desc: '挖掘獲得的方塊可於市場批量或單項出售換取遊戲幣，建立完整的資源產出與消耗循環。'
        },
        {
          type: 'shop',
          title: '主題背景與像素外觀商店',
          desc: '新增主世界、地獄、終界、深板岩、櫻花林、自訂暗黑等主題，以及多款 Minecraft 經典外觀供金幣選購。'
        },
        {
          type: 'achievements',
          title: '擴充至 150 個完整成就',
          desc: '涵蓋挖掘、經濟、裝備、建築、社交與全方塊收集六大類別，達成階段性挑戰即可領取高額遊戲幣獎勵。'
        },
        {
          type: 'friends',
          title: '好友邀請與首位好友獎勵',
          desc: '生成專屬好友代碼，成功加入 1 位好友即可領取 100 遊戲幣獎勵。'
        }
      ]
    },
    {
      version: 'v1.0.0',
      date: '初始發布',
      badge: '基礎架構',
      badgeColor: 'bg-zinc-600 text-zinc-200',
      highlights: [
        {
          type: 'quarry',
          title: '挖掘場採礦核心',
          desc: '點擊挖掘不同稀有度方塊，方塊直接納入玩家背包庫存。'
        },
        {
          type: 'build',
          title: '100 格創作建築區',
          desc: '提供 10x10 自由建築網格，消耗背包方塊拼貼建造各種建築造型。'
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
                📜 版本更新日誌 (Changelog)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                掌握最新功能、系統優化與版本進度
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
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
                  <span className="font-bold text-emerald-400 text-sm">Created & Developed</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">PizzaCowMC</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  點擊右側連結前往 GitHub 查看更多開源專案與動態
                </p>
              </div>
            </div>
            <a
              href="https://github.com/PizzaCowMC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2ea44f] hover:bg-[#2c974b] text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 whitespace-nowrap"
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ver.badgeColor}`}>
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
          <span>Minecraft 挖掘場與建築工坊 v1.2.0</span>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-lg font-bold transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
