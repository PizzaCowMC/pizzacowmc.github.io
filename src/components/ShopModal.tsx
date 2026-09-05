import React, { useState } from 'react';
import { PICKAXE_TIERS, THEME_BACKGROUNDS, PLAYER_SKINS, SHOP_SUPPLIES } from '../data/gameData';
import { PickaxeState, ThemeBackground, PlayerSkin, ShopSupplyItem } from '../types';
import { sound } from '../utils/soundEffects';
import { ShoppingBag, Pickaxe, Palette, User, Zap, Shield, Sparkles, Wrench, Check, X, Coins, Package, Bot, Flame } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  pickaxeState: PickaxeState;
  ownedPickaxes: string[];
  ownedThemes: string[];
  currentThemeId: string;
  ownedSkins: string[];
  currentSkinId: string;
  onBuyPickaxe: (tierId: string, cost: number) => void;
  onEquipPickaxe: (tierId: string) => void;
  onRepairPickaxe: (cost: number) => void;
  onUpgradePickaxe: (type: 'efficiency' | 'unbreaking' | 'fortune', cost: number) => void;
  onBuyTheme: (theme: ThemeBackground) => void;
  onEquipTheme: (themeId: string) => void;
  onBuySkin: (skin: PlayerSkin) => void;
  onEquipSkin: (skinId: string) => void;
  onBuySupply?: (supply: ShopSupplyItem) => void;
  hasAutoMiner?: boolean;
  hasteRemainingSeconds?: number;
  initialTab?: 'pickaxes' | 'themes' | 'skins' | 'supplies';
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  coins,
  pickaxeState,
  ownedPickaxes,
  ownedThemes,
  currentThemeId,
  ownedSkins,
  currentSkinId,
  onBuyPickaxe,
  onEquipPickaxe,
  onRepairPickaxe,
  onUpgradePickaxe,
  onBuyTheme,
  onEquipTheme,
  onBuySkin,
  onEquipSkin,
  onBuySupply,
  hasAutoMiner = false,
  hasteRemainingSeconds = 0,
  initialTab = 'pickaxes'
}) => {
  const [activeTab, setActiveTab] = useState<'pickaxes' | 'themes' | 'skins' | 'supplies'>(initialTab);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPick = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];
  const missingDurability = currentPick.tier === 0 ? 0 : Math.max(0, currentPick.maxDurability - pickaxeState.currentDurability);
  const repairCost = Math.max(10, Math.ceil(missingDurability * 0.25));

  // Costs for upgrades (+50% increased for economy balance)
  const effCost = Math.round((pickaxeState.efficiencyLevel + 1) * 120);
  const unbCost = Math.round((pickaxeState.unbreakingLevel + 1) * 115);
  const forCost = Math.round((pickaxeState.fortuneLevel + 1) * 300);

  const showMsg = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#242424] border-6 border-black rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Shop Header */}
        <div className="p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/20 border-2 border-amber-500 rounded text-amber-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                道具與外觀商店 (Game Shop)
              </h3>
              <p className="text-xs text-zinc-400">
                購買鎬具、升級採掘速度、修復耐久與解鎖全新主題背景！
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-black/60 border-2 border-amber-400 rounded flex items-center gap-1.5 text-amber-300 font-mono font-black text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins.toLocaleString()} 幣</span>
            </div>
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-zinc-800 bg-zinc-950 px-3 pt-2 gap-2">
          <button
            onClick={() => {
              setActiveTab('pickaxes');
              sound.playClickSound();
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-2 transition-all ${
              activeTab === 'pickaxes'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <Pickaxe className="w-4 h-4" />
            <span>⛏️ 鎬具與強化工坊</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('themes');
              sound.playClickSound();
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-2 transition-all ${
              activeTab === 'themes'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>🌌 主題背景 ({ownedThemes.length}/{THEME_BACKGROUNDS.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('skins');
              sound.playClickSound();
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-2 transition-all ${
              activeTab === 'skins'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <User className="w-4 h-4" />
            <span>👕 外觀稱號 ({ownedSkins.length}/{PLAYER_SKINS.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('supplies');
              sound.playClickSound();
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-2 transition-all ${
              activeTab === 'supplies'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-400" />
            <span>📦 探險補給與神器 ({SHOP_SUPPLIES.length})</span>
          </button>
        </div>

        {/* Feedback notification toast */}
        {feedbackMsg && (
          <div className="bg-amber-950/90 border-b border-amber-600 px-4 py-2 text-xs text-amber-200 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {feedbackMsg}
          </div>
        )}

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PICKAXES & UPGRADES */}
          {activeTab === 'pickaxes' && (
            <div className="space-y-4">
              {/* Repair Station */}
              {currentPick.tier !== 0 && (
                <div className="p-3 bg-zinc-900 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-[inset_1px_1px_0_#3f3f46]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 border border-blue-500 rounded text-blue-400">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white flex items-center gap-2">
                        <span>鎬具鐵砧修復站</span>
                        <span className="text-xs text-zinc-400">
                          (損耗：{missingDurability} 耐久度)
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        當前耐久：{pickaxeState.currentDurability} / {currentPick.maxDurability}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={missingDurability === 0 || coins < repairCost}
                    onClick={() => {
                      if (coins >= repairCost && missingDurability > 0) {
                        sound.playUpgradeSound();
                        onRepairPickaxe(repairCost);
                        showMsg(`鎬具耐久已全數修復完成！消耗 ${repairCost} 遊戲幣。`);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#1e3a8a,inset_2px_2px_0_#60a5fa] active:scale-95 flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    {missingDurability === 0 ? '耐久度已滿' : `修復全滿 (${repairCost} 幣)`}
                  </button>
                </div>
              )}

              {/* Enchantment Upgrades Station */}
              <div className="bg-zinc-950 p-4 border-2 border-black rounded-lg">
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  附魔工坊 (Enchantment Workshop - 永久繼承所有鎬具)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Efficiency */}
                  <div className="p-3 bg-zinc-900 border border-zinc-700 rounded flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-yellow-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> 效率附魔
                        </span>
                        <span className="text-xs font-mono font-bold text-yellow-400">
                          Lv.{pickaxeState.efficiencyLevel}/10
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-2">
                        每級提升 +20% 採掘速度。
                      </p>
                    </div>
                    <button
                      disabled={pickaxeState.efficiencyLevel >= 10 || coins < effCost}
                      onClick={() => {
                        if (coins >= effCost && pickaxeState.efficiencyLevel < 10) {
                          sound.playUpgradeSound();
                          onUpgradePickaxe('efficiency', effCost);
                          showMsg(`效率附魔成功升級至 Lv.${pickaxeState.efficiencyLevel + 1}！`);
                        }
                      }}
                      className="w-full py-1 text-xs font-black bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black border-2 border-black rounded active:scale-95"
                    >
                      {pickaxeState.efficiencyLevel >= 10 ? '已達上限' : `升級 (${effCost} 幣)`}
                    </button>
                  </div>

                  {/* Unbreaking */}
                  <div className="p-3 bg-zinc-900 border border-zinc-700 rounded flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-blue-300 flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" /> 耐久附魔
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-400">
                          Lv.{pickaxeState.unbreakingLevel}/10
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-2">
                        降低消耗耐久機率，延長壽命。
                      </p>
                    </div>
                    <button
                      disabled={pickaxeState.unbreakingLevel >= 10 || coins < unbCost}
                      onClick={() => {
                        if (coins >= unbCost && pickaxeState.unbreakingLevel < 10) {
                          sound.playUpgradeSound();
                          onUpgradePickaxe('unbreaking', unbCost);
                          showMsg(`耐久附魔成功升級至 Lv.${pickaxeState.unbreakingLevel + 1}！`);
                        }
                      }}
                      className="w-full py-1 text-xs font-black bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white border-2 border-black rounded active:scale-95"
                    >
                      {pickaxeState.unbreakingLevel >= 10 ? '已達上限' : `升級 (${unbCost} 幣)`}
                    </button>
                  </div>

                  {/* Fortune */}
                  <div className="p-3 bg-zinc-900 border border-zinc-700 rounded flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> 幸運附魔
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          Lv.{pickaxeState.fortuneLevel}/5
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-2">
                        開採時有機率掉落雙倍/三倍方塊！
                      </p>
                    </div>
                    <button
                      disabled={pickaxeState.fortuneLevel >= 5 || coins < forCost}
                      onClick={() => {
                        if (coins >= forCost && pickaxeState.fortuneLevel < 5) {
                          sound.playUpgradeSound();
                          onUpgradePickaxe('fortune', forCost);
                          showMsg(`幸運附魔成功升級至 Lv.${pickaxeState.fortuneLevel + 1}！`);
                        }
                      }}
                      className="w-full py-1 text-xs font-black bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white border-2 border-black rounded active:scale-95"
                    >
                      {pickaxeState.fortuneLevel >= 5 ? '已達上限' : `升級 (${forCost} 幣)`}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickaxes Armory List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  鎬具陳列庫 (Pickaxes Armory)
                </h4>
                {PICKAXE_TIERS.map(pick => {
                  const isOwned = ownedPickaxes.includes(pick.id) || pick.tier === 0;
                  const isEquipped = pickaxeState.currentTierId === pick.id;

                  return (
                    <div
                      key={pick.id}
                      className={`p-3 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3 ${
                        isEquipped
                          ? 'bg-amber-950/40 border-amber-500'
                          : isOwned
                          ? 'bg-zinc-900'
                          : 'bg-zinc-950 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded border-2 border-black flex items-center justify-center text-xl bg-gradient-to-br ${pick.bgGradient} shadow-inner`}
                        >
                          ⛏️
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">{pick.nameZh}</span>
                            <span className="text-xs text-zinc-400 font-mono">({pick.nameEn})</span>
                            {isEquipped && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white font-bold rounded">
                                當前裝備中
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1 font-mono">
                            <span className="text-cyan-300 font-bold">⚡ 速度: {pick.speedMultiplier}x</span>
                            <span>•</span>
                            <span className="text-amber-300">
                              🛡️ 耐久: {pick.tier === 0 ? '無限' : pick.maxDurability}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{pick.desc}</p>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <div className="px-3 py-1.5 bg-zinc-800 text-emerald-400 text-xs font-black border border-emerald-500 rounded flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 已裝備
                          </div>
                        ) : isOwned ? (
                          <button
                            onClick={() => {
                              sound.playClickSound();
                              onEquipPickaxe(pick.id);
                              showMsg(`已成功裝備【${pick.nameZh}】！`);
                            }}
                            className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black border-2 border-black rounded active:scale-95"
                          >
                            裝備
                          </button>
                        ) : (
                          <button
                            disabled={coins < pick.cost}
                            onClick={() => {
                              if (coins >= pick.cost) {
                                sound.playUpgradeSound();
                                onBuyPickaxe(pick.id, pick.cost);
                                showMsg(`成功解鎖並裝備【${pick.nameZh}】！`);
                              }
                            }}
                            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-amber-100 text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#78350f,inset_2px_2px_0_#fde047] active:scale-95 flex items-center gap-1"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            購買 ({pick.cost} 幣)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: THEME BACKGROUNDS */}
          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_BACKGROUNDS.map(theme => {
                const isOwned = ownedThemes.includes(theme.id) || theme.cost === 0;
                const isEquipped = currentThemeId === theme.id;

                return (
                  <div
                    key={theme.id}
                    className={`p-3.5 border-2 border-black rounded-lg flex flex-col justify-between ${
                      isEquipped ? 'bg-amber-950/40 border-amber-400' : 'bg-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-white">{theme.nameZh}</span>
                        <div
                          className="w-5 h-5 rounded border border-black shadow-xs"
                          style={{ backgroundColor: theme.previewColor }}
                        />
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{theme.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-xs font-mono text-amber-300">
                        {theme.cost === 0 ? '預設解鎖' : `${theme.cost} 遊戲幣`}
                      </span>

                      {isEquipped ? (
                        <div className="px-3 py-1 bg-zinc-800 text-emerald-400 text-xs font-black border border-emerald-500 rounded flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 套用中
                        </div>
                      ) : isOwned ? (
                        <button
                          onClick={() => {
                            sound.playClickSound();
                            onEquipTheme(theme.id);
                            showMsg(`已套用【${theme.nameZh}】背景主題！`);
                          }}
                          className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold border-2 border-black rounded active:scale-95"
                        >
                          套用主題
                        </button>
                      ) : (
                        <button
                          disabled={coins < theme.cost}
                          onClick={() => {
                            if (coins >= theme.cost) {
                              sound.playUpgradeSound();
                              onBuyTheme(theme);
                              showMsg(`成功購買並套用【${theme.nameZh}】！`);
                            }
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-amber-100 text-xs font-black border-2 border-black rounded active:scale-95 flex items-center gap-1"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          購買 ({theme.cost} 幣)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: PLAYER SKINS & TITLES */}
          {activeTab === 'skins' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLAYER_SKINS.map(skin => {
                const isOwned = ownedSkins.includes(skin.id) || skin.cost === 0;
                const isEquipped = currentSkinId === skin.id;

                return (
                  <div
                    key={skin.id}
                    className={`p-3.5 border-2 border-black rounded-lg flex flex-col justify-between ${
                      isEquipped ? 'bg-amber-950/40 border-amber-400' : 'bg-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-2xl">{skin.avatarEmoji}</span>
                        <div>
                          <span className="font-black text-sm text-white">{skin.nameZh}</span>
                          <span className="text-[11px] ml-2 px-1.5 py-0.5 bg-zinc-800 text-amber-300 rounded border border-zinc-700">
                            {skin.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{skin.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-xs font-mono text-amber-300">
                        {skin.cost === 0 ? '初始贈送' : `${skin.cost} 遊戲幣`}
                      </span>

                      {isEquipped ? (
                        <div className="px-3 py-1 bg-zinc-800 text-emerald-400 text-xs font-black border border-emerald-500 rounded flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 穿戴中
                        </div>
                      ) : isOwned ? (
                        <button
                          onClick={() => {
                            sound.playClickSound();
                            onEquipSkin(skin.id);
                            showMsg(`已穿戴稱號外觀【${skin.nameZh}】！`);
                          }}
                          className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold border-2 border-black rounded active:scale-95"
                        >
                          穿戴外觀
                        </button>
                      ) : (
                        <button
                          disabled={coins < skin.cost}
                          onClick={() => {
                            if (coins >= skin.cost) {
                              sound.playUpgradeSound();
                              onBuySkin(skin);
                              showMsg(`成功解鎖並穿戴【${skin.nameZh}】！`);
                            }
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-amber-100 text-xs font-black border-2 border-black rounded active:scale-95 flex items-center gap-1"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          購買 ({skin.cost} 幣)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: CONSUMABLE SUPPLIES & ARTIFACTS */}
          {activeTab === 'supplies' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHOP_SUPPLIES.map(supply => {
                const isAutoMinerOwned = supply.type === 'auto_miner' && hasAutoMiner;
                const isHasteActive = supply.type === 'haste_drink' && hasteRemainingSeconds > 0;

                return (
                  <div
                    key={supply.id}
                    className={`p-3.5 border-2 border-black rounded-lg flex flex-col justify-between ${
                      isAutoMinerOwned
                        ? 'bg-cyan-950/30 border-cyan-500'
                        : isHasteActive
                        ? 'bg-amber-950/40 border-amber-400 animate-pulse'
                        : 'bg-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-3xl">{supply.iconEmoji}</span>
                        <div>
                          <span className="font-black text-sm text-white">{supply.nameZh}</span>
                          <span className="text-[11px] ml-2 px-1.5 py-0.5 bg-zinc-800 text-amber-300 rounded border border-zinc-700 font-bold">
                            {supply.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300 mb-3">{supply.descZh}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-xs font-mono text-amber-300 font-black">
                        {supply.cost.toLocaleString()} 遊戲幣
                      </span>

                      {isAutoMinerOwned ? (
                        <div className="px-3 py-1 bg-cyan-950 text-cyan-300 text-xs font-black border border-cyan-500 rounded flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-cyan-400" /> 已永久解鎖 (自動採礦中)
                        </div>
                      ) : (
                        <button
                          disabled={coins < supply.cost}
                          onClick={() => {
                            if (coins >= supply.cost && onBuySupply) {
                              onBuySupply(supply);
                              showMsg(`成功購買使用【${supply.nameZh}】！`);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded active:scale-95 flex items-center gap-1 shadow-[inset_1px_1px_0_#34d399,inset_-1px_-1px_0_#065f46]"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          {isHasteActive ? `延長疾速 (+60s)` : `購買使用 (${supply.cost} 幣)`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-900 border-t-2 border-black text-center text-xs text-zinc-400">
          💡 在挖掘場多採掘礦石並於交易所販售，即可獲得充足遊戲幣解鎖全套鎬具與奢華背景！
        </div>
      </div>
    </div>
  );
};
