import React, { useState, useEffect } from 'react';
import { PICKAXE_TIERS, THEME_BACKGROUNDS, PLAYER_SKINS, SHOP_SUPPLIES } from '../data/gameData';
import { AXE_TIERS, SHOVEL_TIERS, SWORD_TIERS } from '../data/toolsData';
import { PickaxeState, ThemeBackground, PlayerSkin, ShopSupplyItem } from '../types';
import { sound } from '../utils/soundEffects';
import { ShoppingBag, Pickaxe, Palette, User, Zap, Shield, Sparkles, Wrench, Check, X, Coins, Package, Bot, Sword } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

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
  
  // Axes
  axeState?: { currentTierId: string; currentDurability: number };
  ownedAxes?: string[];
  onBuyAxe?: (tierId: string, cost: number) => void;
  onEquipAxe?: (tierId: string) => void;
  onRepairAxe?: (cost: number) => void;

  // Shovels
  shovelState?: { currentTierId: string; currentDurability: number };
  ownedShovels?: string[];
  onBuyShovel?: (tierId: string, cost: number) => void;
  onEquipShovel?: (tierId: string) => void;
  onRepairShovel?: (cost: number) => void;

  // Swords
  swordState?: { currentTierId: string; currentDurability: number };
  ownedSwords?: string[];
  onBuySword?: (tierId: string, cost: number) => void;
  onEquipSword?: (tierId: string) => void;
  onRepairSword?: (cost: number) => void;

  onBuyTheme: (theme: ThemeBackground) => void;
  onEquipTheme: (themeId: string) => void;
  onBuySkin: (skin: PlayerSkin) => void;
  onEquipSkin: (skinId: string) => void;
  onBuySupply?: (supply: ShopSupplyItem) => void;
  hasAutoMiner?: boolean;
  hasteRemainingSeconds?: number;
  initialTab?: 'pickaxes' | 'axes' | 'shovels' | 'swords' | 'themes' | 'skins' | 'supplies';
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
  axeState = { currentTierId: 'bare_hand_axe', currentDurability: 999999 },
  ownedAxes = ['bare_hand_axe'],
  onBuyAxe,
  onEquipAxe,
  onRepairAxe,
  shovelState = { currentTierId: 'bare_hand_shovel', currentDurability: 999999 },
  ownedShovels = ['bare_hand_shovel'],
  onBuyShovel,
  onEquipShovel,
  onRepairShovel,
  swordState = { currentTierId: 'wood_sword', currentDurability: 80 },
  ownedSwords = ['wood_sword'],
  onBuySword,
  onEquipSword,
  onRepairSword,
  onBuyTheme,
  onEquipTheme,
  onBuySkin,
  onEquipSkin,
  onBuySupply,
  hasAutoMiner = false,
  hasteRemainingSeconds = 0,
  initialTab = 'pickaxes'
}) => {
  const { language, getName, getDesc, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pickaxes' | 'axes' | 'shovels' | 'swords' | 'themes' | 'skins' | 'supplies'>(initialTab);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const isEn = language === 'en';

  // Current pickaxe stats
  const currentPick = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];
  const missingPickDurability = currentPick.tier === 0 ? 0 : Math.max(0, currentPick.maxDurability - pickaxeState.currentDurability);
  const pickRepairCost = Math.max(10, Math.ceil(missingPickDurability * 0.25));

  // Current axe stats
  const currentAxe = AXE_TIERS.find(a => a.id === axeState.currentTierId) || AXE_TIERS[0];
  const missingAxeDurability = currentAxe.tier === 0 ? 0 : Math.max(0, currentAxe.maxDurability - axeState.currentDurability);
  const axeRepairCost = Math.max(10, Math.ceil(missingAxeDurability * 0.25));

  // Current shovel stats
  const currentShovel = SHOVEL_TIERS.find(s => s.id === shovelState.currentTierId) || SHOVEL_TIERS[0];
  const missingShovelDurability = currentShovel.tier === 0 ? 0 : Math.max(0, currentShovel.maxDurability - shovelState.currentDurability);
  const shovelRepairCost = Math.max(10, Math.ceil(missingShovelDurability * 0.25));

  // Current sword stats
  const currentSword = SWORD_TIERS.find(s => s.id === swordState.currentTierId) || SWORD_TIERS[0];
  const missingSwordDurability = Math.max(0, currentSword.maxDurability - swordState.currentDurability);
  const swordRepairCost = Math.max(10, Math.ceil(missingSwordDurability * 0.3));

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
      <div className="bg-[#242424] border-6 border-black rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Shop Header */}
        <div className="p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/20 border-2 border-amber-500 rounded text-amber-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000]">
                {t('shop.title')}
              </h3>
              <p className="text-xs text-zinc-400">
                {t('shop.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-black/60 border-2 border-amber-400 rounded flex items-center gap-1.5 text-amber-300 font-mono font-black text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins.toLocaleString()} {isEn ? 'Coins' : '幣'}</span>
            </div>
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
              }}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-zinc-800 bg-zinc-950 px-3 pt-2 gap-1.5 overflow-x-auto">
          {/* Pickaxes */}
          <button
            onClick={() => {
              setActiveTab('pickaxes');
              sound.playClickSound();
            }}
            className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pickaxes'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <Pickaxe className="w-3.5 h-3.5" />
            <span>⛏️ {isEn ? 'Pickaxes' : '礦鎬與附魔'}</span>
          </button>

          {/* Axes */}
          <button
            onClick={() => {
              setActiveTab('axes');
              sound.playClickSound();
            }}
            className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'axes'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <span className="text-sm">🪓</span>
            <span>{isEn ? 'Axes (Wood)' : '斧頭 (採木專用)'}</span>
          </button>

          {/* Shovels */}
          <button
            onClick={() => {
              setActiveTab('shovels');
              sound.playClickSound();
            }}
            className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'shovels'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <span className="text-sm">🪏</span>
            <span>{isEn ? 'Shovels (Soil)' : '鏟子 (掘土泥沙)'}</span>
          </button>

          {/* Swords */}
          <button
            onClick={() => {
              setActiveTab('swords');
              sound.playClickSound();
            }}
            className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'swords'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <Sword className="w-3.5 h-3.5 text-red-400" />
            <span>⚔️ {isEn ? 'Swords (Combat)' : '神劍 (怪獸武器)'}</span>
          </button>

          {/* Themes */}
          <button
            onClick={() => {
              setActiveTab('themes');
              sound.playClickSound();
            }}
            className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🌌 {t('shop.themesTab')}</span>
          </button>

          {/* Skins */}
          <button
            onClick={() => {
              setActiveTab('skins');
              sound.playClickSound();
            }}
            className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'skins'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>👕 {t('shop.skinsTab')}</span>
          </button>

          {/* Supplies */}
          <button
            onClick={() => {
              setActiveTab('supplies');
              sound.playClickSound();
            }}
            className={`px-3 py-2 text-xs font-black rounded-t-lg border-t-2 border-x-2 border-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'supplies'
                ? 'bg-[#242424] text-amber-300 border-b-0 -mb-[2px] shadow-[inset_0_2px_0_#fde047]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-b-2'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>📦 {t('shop.suppliesTab')}</span>
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
                        <span>{isEn ? 'Pickaxe Anvil Repair Station' : '鎬具鐵砧修復站'}</span>
                        <span className="text-xs text-zinc-400">
                          ({isEn ? 'Damage:' : '損耗：'}{missingPickDurability} {isEn ? 'durability' : '耐久度'})
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {isEn ? 'Current Durability:' : '當前耐久：'}{pickaxeState.currentDurability} / {currentPick.maxDurability}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={missingPickDurability === 0 || coins < pickRepairCost}
                    onClick={() => {
                      if (coins >= pickRepairCost && missingPickDurability > 0) {
                        sound.playUpgradeSound();
                        onRepairPickaxe(pickRepairCost);
                        showMsg(isEn ? `Pickaxe fully repaired! Spent ${pickRepairCost} Coins.` : `鎬具耐久已全數修復完成！消耗 ${pickRepairCost} 遊戲幣。`);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#1e3a8a,inset_2px_2px_0_#60a5fa] active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    {missingPickDurability === 0 ? (isEn ? 'Durability Full' : '耐久度已滿') : (isEn ? `Repair All (${pickRepairCost} Coins)` : `修復全滿 (${pickRepairCost} 幣)`)}
                  </button>
                </div>
              )}

              {/* Enchantment Upgrades Station */}
              <div className="bg-zinc-950 p-4 border-2 border-black rounded-lg">
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {isEn ? 'Enchantment Workshop (Permanently Inherited by All Pickaxes)' : '附魔工坊 (Enchantment Workshop - 永久繼承所有鎬具)'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Efficiency */}
                  <div className="p-3 bg-zinc-900 border border-zinc-700 rounded flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-yellow-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> {isEn ? 'Efficiency' : '效率附魔'}
                        </span>
                        <span className="text-xs font-mono font-bold text-yellow-400">
                          Lv.{pickaxeState.efficiencyLevel}/10
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-2">
                        {isEn ? '+20% mining speed per level.' : '每級提升 +20% 採掘速度。'}
                      </p>
                    </div>
                    <button
                      disabled={pickaxeState.efficiencyLevel >= 10 || coins < effCost}
                      onClick={() => {
                        if (coins >= effCost && pickaxeState.efficiencyLevel < 10) {
                          sound.playUpgradeSound();
                          onUpgradePickaxe('efficiency', effCost);
                          showMsg(isEn ? `Efficiency upgraded to Lv.${pickaxeState.efficiencyLevel + 1}!` : `效率附魔成功升級至 Lv.${pickaxeState.efficiencyLevel + 1}！`);
                        }
                      }}
                      className="w-full py-1 text-xs font-black bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black border-2 border-black rounded active:scale-95 cursor-pointer"
                    >
                      {pickaxeState.efficiencyLevel >= 10 ? (isEn ? 'MAX' : '已達上限') : (isEn ? `Upgrade (${effCost} Coins)` : `升級 (${effCost} 幣)`)}
                    </button>
                  </div>

                  {/* Unbreaking */}
                  <div className="p-3 bg-zinc-900 border border-zinc-700 rounded flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-blue-300 flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" /> {isEn ? 'Unbreaking' : '耐久附魔'}
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-400">
                          Lv.{pickaxeState.unbreakingLevel}/10
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-2">
                        {isEn ? 'Reduces durability depletion probability.' : '降低消耗耐久機率，延長壽命。'}
                      </p>
                    </div>
                    <button
                      disabled={pickaxeState.unbreakingLevel >= 10 || coins < unbCost}
                      onClick={() => {
                        if (coins >= unbCost && pickaxeState.unbreakingLevel < 10) {
                          sound.playUpgradeSound();
                          onUpgradePickaxe('unbreaking', unbCost);
                          showMsg(isEn ? `Unbreaking upgraded to Lv.${pickaxeState.unbreakingLevel + 1}!` : `耐久附魔成功升級至 Lv.${pickaxeState.unbreakingLevel + 1}！`);
                        }
                      }}
                      className="w-full py-1 text-xs font-black bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white border-2 border-black rounded active:scale-95 cursor-pointer"
                    >
                      {pickaxeState.unbreakingLevel >= 10 ? (isEn ? 'MAX' : '已達上限') : (isEn ? `Upgrade (${unbCost} Coins)` : `升級 (${unbCost} 幣)`)}
                    </button>
                  </div>

                  {/* Fortune */}
                  <div className="p-3 bg-zinc-900 border border-zinc-700 rounded flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> {isEn ? 'Fortune' : '幸運附魔'}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          Lv.{pickaxeState.fortuneLevel}/5
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-2">
                        {isEn ? 'Chance for bonus block drops!' : '開採時有機率掉落額外方塊！'}
                      </p>
                    </div>
                    <button
                      disabled={pickaxeState.fortuneLevel >= 5 || coins < forCost}
                      onClick={() => {
                        if (coins >= forCost && pickaxeState.fortuneLevel < 5) {
                          sound.playUpgradeSound();
                          onUpgradePickaxe('fortune', forCost);
                          showMsg(isEn ? `Fortune upgraded to Lv.${pickaxeState.fortuneLevel + 1}!` : `幸運附魔成功升級至 Lv.${pickaxeState.fortuneLevel + 1}！`);
                        }
                      }}
                      className="w-full py-1 text-xs font-black bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white border-2 border-black rounded active:scale-95 cursor-pointer"
                    >
                      {pickaxeState.fortuneLevel >= 5 ? (isEn ? 'MAX' : '已達上限') : (isEn ? `Upgrade (${forCost} Coins)` : `升級 (${forCost} 幣)`)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickaxes Armory List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  {isEn ? 'Pickaxes Armory' : '鎬具陳列庫 (Pickaxes Armory)'}
                </h4>
                {PICKAXE_TIERS.map(pick => {
                  const isOwned = ownedPickaxes.includes(pick.id) || pick.tier === 0;
                  const isEquipped = pickaxeState.currentTierId === pick.id;
                  const pickName = getName(pick);

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
                            <span className="font-black text-sm text-white">{pickName}</span>
                            {isEquipped && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white font-bold rounded">
                                {isEn ? 'Equipped' : '當前裝備中'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1 font-mono">
                            <span className="text-cyan-300 font-bold">⚡ {isEn ? 'Speed' : '速度'}: {pick.speedMultiplier}x</span>
                            <span>•</span>
                            <span className="text-amber-300">
                              🛡️ {isEn ? 'Durability' : '耐久'}: {pick.tier === 0 ? (isEn ? 'Infinite' : '無限') : pick.maxDurability}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{getDesc(pick)}</p>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <div className="px-3 py-1.5 bg-zinc-800 text-emerald-400 text-xs font-black border border-emerald-500 rounded flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {isEn ? 'Equipped' : '已裝備'}
                          </div>
                        ) : isOwned ? (
                          <button
                            onClick={() => {
                              sound.playClickSound();
                              onEquipPickaxe(pick.id);
                              showMsg(isEn ? `Equipped ${pickName}!` : `已裝備【${pickName}】！`);
                            }}
                            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black border-2 border-black rounded active:scale-95 cursor-pointer"
                          >
                            {isEn ? 'Equip' : '裝備'}
                          </button>
                        ) : (
                          <button
                            disabled={coins < pick.cost}
                            onClick={() => {
                              if (coins >= pick.cost) {
                                sound.playUpgradeSound();
                                onBuyPickaxe(pick.id, pick.cost);
                                showMsg(isEn ? `Forged ${pickName}!` : `成功鍛造購買【${pickName}】！`);
                              }
                            }}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-black border-2 border-black rounded shadow-[inset_1px_1px_0_#fde047] active:scale-95 flex items-center gap-1 cursor-pointer"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            {isEn ? `Forge (${pick.cost.toLocaleString()})` : `鍛造購買 (${pick.cost.toLocaleString()} 幣)`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AXES (WOODCUTTING) */}
          {activeTab === 'axes' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/40 border-2 border-amber-600/60 rounded-lg text-xs text-amber-200 flex items-center gap-2.5">
                <span className="text-2xl">🪓</span>
                <div>
                  <strong className="text-amber-300 font-black">
                    {isEn ? 'Axe Utility Guide:' : '斧頭伐木專屬加成說明：'}
                  </strong>
                  <p className="text-zinc-300 text-[11px] mt-0.5">
                    {isEn
                      ? 'Axes break oak wood, logs, and planks up to 35x faster, and grant a 35% chance to drop extra bonus timber!'
                      : '裝備斧頭開採原木、木材方塊速度高達 35 倍，且開採原木時具備 35% 機率掉落額外木材！'}
                  </p>
                </div>
              </div>

              {/* Repair Station for Axe */}
              {currentAxe.tier !== 0 && (
                <div className="p-3 bg-zinc-900 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-[inset_1px_1px_0_#3f3f46]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 border border-amber-500 rounded text-amber-400">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white flex items-center gap-2">
                        <span>{isEn ? 'Axe Repair Station' : '斧頭鐵砧修復站'}</span>
                        <span className="text-xs text-zinc-400">
                          ({isEn ? 'Damage:' : '損耗：'}{missingAxeDurability} {isEn ? 'durability' : '耐久度'})
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {isEn ? 'Current Durability:' : '當前耐久：'}{axeState.currentDurability} / {currentAxe.maxDurability}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={missingAxeDurability === 0 || coins < axeRepairCost}
                    onClick={() => {
                      if (coins >= axeRepairCost && missingAxeDurability > 0 && onRepairAxe) {
                        sound.playUpgradeSound();
                        onRepairAxe(axeRepairCost);
                        showMsg(isEn ? `Axe fully repaired! Spent ${axeRepairCost} Coins.` : `斧頭耐久已全數修復！消耗 ${axeRepairCost} 遊戲幣。`);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fde047] active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    {missingAxeDurability === 0 ? (isEn ? 'Durability Full' : '耐久度已滿') : (isEn ? `Repair All (${axeRepairCost} Coins)` : `修復全滿 (${axeRepairCost} 幣)`)}
                  </button>
                </div>
              )}

              {/* Axes list */}
              <div className="space-y-2">
                {AXE_TIERS.map(axe => {
                  const isOwned = ownedAxes.includes(axe.id) || axe.tier === 0;
                  const isEquipped = axeState.currentTierId === axe.id;
                  const axeName = isEn ? axe.nameEn : axe.nameZh;

                  return (
                    <div
                      key={axe.id}
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
                          className={`w-12 h-12 rounded border-2 border-black flex items-center justify-center text-2xl bg-gradient-to-br ${axe.bgGradient} shadow-inner`}
                        >
                          🪓
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">{axeName}</span>
                            {isEquipped && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-600 text-white font-bold rounded">
                                {isEn ? 'Equipped' : '當前裝備中'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1 font-mono">
                            <span className="text-amber-300 font-bold">🪓 {isEn ? 'Chop Speed' : '伐木速度'}: {axe.speedMultiplier}x</span>
                            <span>•</span>
                            <span className="text-red-300 font-bold">⚔️ {isEn ? 'ATK' : '攻擊'}: {axe.attackDamage}</span>
                            <span>•</span>
                            <span className="text-zinc-300">
                              🛡️ {isEn ? 'Durability' : '耐久'}: {axe.tier === 0 ? (isEn ? 'Infinite' : '無限') : axe.maxDurability}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{axe.desc}</p>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <div className="px-3 py-1.5 bg-zinc-800 text-amber-400 text-xs font-black border border-amber-500 rounded flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {isEn ? 'Equipped' : '已裝備'}
                          </div>
                        ) : isOwned ? (
                          <button
                            onClick={() => {
                              sound.playClickSound();
                              if (onEquipAxe) onEquipAxe(axe.id);
                              showMsg(isEn ? `Equipped ${axeName}!` : `已裝備【${axeName}】！`);
                            }}
                            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black border-2 border-black rounded active:scale-95 cursor-pointer"
                          >
                            {isEn ? 'Equip' : '裝備'}
                          </button>
                        ) : (
                          <button
                            disabled={coins < axe.cost}
                            onClick={() => {
                              if (coins >= axe.cost && onBuyAxe) {
                                sound.playUpgradeSound();
                                onBuyAxe(axe.id, axe.cost);
                                showMsg(isEn ? `Crafted ${axeName}!` : `成功購買打造【${axeName}】！`);
                              }
                            }}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-black border-2 border-black rounded shadow-[inset_1px_1px_0_#fde047] active:scale-95 flex items-center gap-1 cursor-pointer"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            {isEn ? `Buy (${axe.cost.toLocaleString()})` : `購買打造 (${axe.cost.toLocaleString()} 幣)`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SHOVELS (SOIL & SAND) */}
          {activeTab === 'shovels' && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-950/40 border-2 border-sky-600/60 rounded-lg text-xs text-sky-200 flex items-center gap-2.5">
                <span className="text-2xl">🪏</span>
                <div>
                  <strong className="text-sky-300 font-black">
                    {isEn ? 'Shovel Excavation Bonus:' : '鏟子掘土專屬加成說明：'}
                  </strong>
                  <p className="text-zinc-300 text-[11px] mt-0.5">
                    {isEn
                      ? 'Shovels excavate dirt, sand, gravel, and clay up to 36x faster, and have a 25% chance to dig up bonus coins or flint!'
                      : '裝備鏟子挖掘泥土、細沙、礫石速度高達 36 倍，且挖掘泥沙時具備 25% 機率挖獲額外金幣寶藏！'}
                  </p>
                </div>
              </div>

              {/* Repair Station for Shovel */}
              {currentShovel.tier !== 0 && (
                <div className="p-3 bg-zinc-900 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-[inset_1px_1px_0_#3f3f46]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/20 border border-sky-500 rounded text-sky-400">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white flex items-center gap-2">
                        <span>{isEn ? 'Shovel Repair Station' : '鏟子鐵砧修復站'}</span>
                        <span className="text-xs text-zinc-400">
                          ({isEn ? 'Damage:' : '損耗：'}{missingShovelDurability} {isEn ? 'durability' : '耐久度'})
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {isEn ? 'Current Durability:' : '當前耐久：'}{shovelState.currentDurability} / {currentShovel.maxDurability}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={missingShovelDurability === 0 || coins < shovelRepairCost}
                    onClick={() => {
                      if (coins >= shovelRepairCost && missingShovelDurability > 0 && onRepairShovel) {
                        sound.playUpgradeSound();
                        onRepairShovel(shovelRepairCost);
                        showMsg(isEn ? `Shovel fully repaired! Spent ${shovelRepairCost} Coins.` : `鏟子耐久已全數修復！消耗 ${shovelRepairCost} 遊戲幣。`);
                      }
                    }}
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#0369a1,inset_2px_2px_0_#7dd3fc] active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    {missingShovelDurability === 0 ? (isEn ? 'Durability Full' : '耐久度已滿') : (isEn ? `Repair All (${shovelRepairCost} Coins)` : `修復全滿 (${shovelRepairCost} 幣)`)}
                  </button>
                </div>
              )}

              {/* Shovels list */}
              <div className="space-y-2">
                {SHOVEL_TIERS.map(shov => {
                  const isOwned = ownedShovels.includes(shov.id) || shov.tier === 0;
                  const isEquipped = shovelState.currentTierId === shov.id;
                  const shovName = isEn ? shov.nameEn : shov.nameZh;

                  return (
                    <div
                      key={shov.id}
                      className={`p-3 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3 ${
                        isEquipped
                          ? 'bg-sky-950/40 border-sky-500'
                          : isOwned
                          ? 'bg-zinc-900'
                          : 'bg-zinc-950 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded border-2 border-black flex items-center justify-center text-2xl bg-gradient-to-br ${shov.bgGradient} shadow-inner`}
                        >
                          🪏
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">{shovName}</span>
                            {isEquipped && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-sky-600 text-white font-bold rounded">
                                {isEn ? 'Equipped' : '當前裝備中'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1 font-mono">
                            <span className="text-sky-300 font-bold">🪏 {isEn ? 'Dig Speed' : '挖掘泥沙速度'}: {shov.speedMultiplier}x</span>
                            <span>•</span>
                            <span className="text-zinc-300">
                              🛡️ {isEn ? 'Durability' : '耐久'}: {shov.tier === 0 ? (isEn ? 'Infinite' : '無限') : shov.maxDurability}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{shov.desc}</p>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <div className="px-3 py-1.5 bg-zinc-800 text-sky-400 text-xs font-black border border-sky-500 rounded flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {isEn ? 'Equipped' : '已裝備'}
                          </div>
                        ) : isOwned ? (
                          <button
                            onClick={() => {
                              sound.playClickSound();
                              if (onEquipShovel) onEquipShovel(shov.id);
                              showMsg(isEn ? `Equipped ${shovName}!` : `已裝備【${shovName}】！`);
                            }}
                            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black border-2 border-black rounded active:scale-95 cursor-pointer"
                          >
                            {isEn ? 'Equip' : '裝備'}
                          </button>
                        ) : (
                          <button
                            disabled={coins < shov.cost}
                            onClick={() => {
                              if (coins >= shov.cost && onBuyShovel) {
                                sound.playUpgradeSound();
                                onBuyShovel(shov.id, shov.cost);
                                showMsg(isEn ? `Crafted ${shovName}!` : `成功購買打造【${shovName}】！`);
                              }
                            }}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded shadow-[inset_1px_1px_0_#7dd3fc] active:scale-95 flex items-center gap-1 cursor-pointer"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            {isEn ? `Buy (${shov.cost.toLocaleString()})` : `購買打造 (${shov.cost.toLocaleString()} 幣)`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SWORDS (MONSTER WEAPONS) */}
          {activeTab === 'swords' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-950/40 border-2 border-red-600/60 rounded-lg text-xs text-red-200 flex items-center gap-2.5">
                <span className="text-2xl">⚔️</span>
                <div>
                  <strong className="text-red-300 font-black">
                    {isEn ? 'Sword Combat Rule ("Must Hit With Sword"):' : '神劍斬殺規則 (隨機怪物必須用劍打)：'}
                  </strong>
                  <p className="text-zinc-300 text-[11px] mt-0.5">
                    {isEn
                      ? 'Monsters randomly ambush during quarrying! Only swords can pierce their armor and deal massive damage + critical strikes. Non-swords only deal 1 scratch damage!'
                      : '在挖掘場挖掘時會隨機遭遇地穴怪物突襲！只有裝備【劍】才能破防造成高額傷害與暴擊，非劍類工具僅能造成 1 點刮痕傷害！'}
                  </p>
                </div>
              </div>

              {/* Repair Station for Sword */}
              <div className="p-3 bg-zinc-900 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-[inset_1px_1px_0_#3f3f46]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 border border-red-500 rounded text-red-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-sm text-white flex items-center gap-2">
                      <span>{isEn ? 'Sword Sharpen & Repair Station' : '神劍研磨與修復站'}</span>
                      <span className="text-xs text-zinc-400">
                        ({isEn ? 'Damage:' : '損耗：'}{missingSwordDurability} {isEn ? 'durability' : '耐久度'})
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {isEn ? 'Current Durability:' : '當前耐久：'}{swordState.currentDurability} / {currentSword.maxDurability}
                    </div>
                  </div>
                </div>

                <button
                  disabled={missingSwordDurability === 0 || coins < swordRepairCost}
                  onClick={() => {
                    if (coins >= swordRepairCost && missingSwordDurability > 0 && onRepairSword) {
                      sound.playUpgradeSound();
                      onRepairSword(swordRepairCost);
                      showMsg(isEn ? `Sword fully repaired! Spent ${swordRepairCost} Coins.` : `神劍鋒刃已全數修復！消耗 ${swordRepairCost} 遊戲幣。`);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded shadow-[inset_-2px_-2px_0_#7f1d1d,inset_2px_2px_0_#f87171] active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  {missingSwordDurability === 0 ? (isEn ? 'Durability Full' : '耐久度已滿') : (isEn ? `Repair All (${swordRepairCost} Coins)` : `修復全滿 (${swordRepairCost} 幣)`)}
                </button>
              </div>

              {/* Swords list */}
              <div className="space-y-2">
                {SWORD_TIERS.map(sword => {
                  const isOwned = ownedSwords.includes(sword.id);
                  const isEquipped = swordState.currentTierId === sword.id;
                  const swordName = isEn ? sword.nameEn : sword.nameZh;

                  return (
                    <div
                      key={sword.id}
                      className={`p-3 border-2 border-black rounded-lg flex flex-wrap items-center justify-between gap-3 ${
                        isEquipped
                          ? 'bg-red-950/40 border-red-500'
                          : isOwned
                          ? 'bg-zinc-900'
                          : 'bg-zinc-950 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded border-2 border-black flex items-center justify-center text-2xl bg-gradient-to-br ${sword.bgGradient} shadow-inner`}
                        >
                          ⚔️
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">{swordName}</span>
                            {isEquipped && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-red-600 text-white font-bold rounded">
                                {isEn ? 'Equipped' : '當前裝備中'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1 font-mono">
                            <span className="text-red-400 font-bold">⚔️ {isEn ? 'Attack' : '攻擊力'}: {sword.attackDamage}</span>
                            <span>•</span>
                            <span className="text-amber-300 font-bold">💥 {isEn ? 'Crit Chance' : '暴擊率'}: {Math.round(sword.critChance * 100)}%</span>
                            <span>•</span>
                            <span className="text-zinc-300">
                              🛡️ {isEn ? 'Durability' : '耐久'}: {sword.maxDurability}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{sword.desc}</p>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <div className="px-3 py-1.5 bg-zinc-800 text-red-400 text-xs font-black border border-red-500 rounded flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {isEn ? 'Equipped' : '已裝備'}
                          </div>
                        ) : isOwned ? (
                          <button
                            onClick={() => {
                              sound.playClickSound();
                              if (onEquipSword) onEquipSword(sword.id);
                              showMsg(isEn ? `Equipped ${swordName}!` : `已裝備【${swordName}】！`);
                            }}
                            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black border-2 border-black rounded active:scale-95 cursor-pointer"
                          >
                            {isEn ? 'Equip' : '裝備'}
                          </button>
                        ) : (
                          <button
                            disabled={coins < sword.cost}
                            onClick={() => {
                              if (coins >= sword.cost && onBuySword) {
                                sound.playUpgradeSound();
                                onBuySword(sword.id, sword.cost);
                                showMsg(isEn ? `Forged ${swordName}!` : `成功購買鍛造【${swordName}】！`);
                              }
                            }}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded shadow-[inset_1px_1px_0_#f87171] active:scale-95 flex items-center gap-1 cursor-pointer"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            {isEn ? `Forge (${sword.cost.toLocaleString()})` : `購買鍛造 (${sword.cost.toLocaleString()} 幣)`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: THEMES */}
          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_BACKGROUNDS.map(theme => {
                const isOwned = ownedThemes.includes(theme.id);
                const isEquipped = currentThemeId === theme.id;
                const themeName = getName(theme);

                return (
                  <div
                    key={theme.id}
                    className={`p-3 border-2 border-black rounded-lg flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-amber-950/40 border-amber-500'
                        : isOwned
                        ? 'bg-zinc-900'
                        : 'bg-zinc-950 opacity-90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-white">{themeName}</span>
                        {isEquipped && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white font-bold rounded">
                            {isEn ? 'Equipped' : '當前使用中'}
                          </span>
                        )}
                      </div>
                      <div
                        className="w-full h-12 rounded border border-black mb-2 shadow-inner flex items-center justify-center text-xs font-bold"
                        style={{ background: theme.previewColor }}
                      >
                        <span className="px-2 py-0.5 bg-black/60 text-white rounded text-[10px]">
                          {themeName}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{getDesc(theme)}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-xs font-mono text-amber-300 font-black">
                        {theme.cost === 0 ? (isEn ? 'Free' : '預設免費') : `${theme.cost.toLocaleString()} ${isEn ? 'Coins' : '遊戲幣'}`}
                      </span>

                      {isEquipped ? (
                        <div className="px-3 py-1 bg-zinc-800 text-emerald-400 text-xs font-black border border-emerald-500 rounded flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {isEn ? 'Equipped' : '已裝備'}
                        </div>
                      ) : isOwned ? (
                        <button
                          onClick={() => {
                            sound.playClickSound();
                            onEquipTheme(theme.id);
                            showMsg(isEn ? `Applied theme ${themeName}!` : `已切換主題【${themeName}】！`);
                          }}
                          className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black border-2 border-black rounded active:scale-95 cursor-pointer"
                        >
                          {isEn ? 'Apply' : '套用'}
                        </button>
                      ) : (
                        <button
                          disabled={coins < theme.cost}
                          onClick={() => {
                            if (coins >= theme.cost) {
                              sound.playUpgradeSound();
                              onBuyTheme(theme);
                              showMsg(isEn ? `Purchased theme ${themeName}!` : `成功購買解鎖主題【${themeName}】！`);
                            }
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-black border-2 border-black rounded shadow-[inset_1px_1px_0_#fde047] active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          {isEn ? `Unlock (${theme.cost.toLocaleString()})` : `解鎖 (${theme.cost.toLocaleString()} 幣)`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 6: SKINS */}
          {activeTab === 'skins' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLAYER_SKINS.map(skin => {
                const isOwned = ownedSkins.includes(skin.id);
                const isEquipped = currentSkinId === skin.id;
                const skinName = getName(skin);

                return (
                  <div
                    key={skin.id}
                    className={`p-3 border-2 border-black rounded-lg flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-amber-950/40 border-amber-500'
                        : isOwned
                        ? 'bg-zinc-900'
                        : 'bg-zinc-950 opacity-90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{skin.avatarEmoji}</span>
                          <span className="font-black text-sm text-white">{skinName}</span>
                        </div>
                        {isEquipped && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white font-bold rounded">
                            {isEn ? 'Equipped' : '當前使用中'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{getDesc(skin)}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-xs font-mono text-amber-300 font-black">
                        {skin.cost === 0 ? (isEn ? 'Default Free' : '預設免費') : `${skin.cost.toLocaleString()} ${isEn ? 'Coins' : '遊戲幣'}`}
                      </span>

                      {isEquipped ? (
                        <div className="px-3 py-1 bg-zinc-800 text-emerald-400 text-xs font-black border border-emerald-500 rounded flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {isEn ? 'Equipped' : '已裝備'}
                        </div>
                      ) : isOwned ? (
                        <button
                          onClick={() => {
                            sound.playClickSound();
                            onEquipSkin(skin.id);
                            showMsg(isEn ? `Equipped skin ${skinName}!` : `已套用外觀【${skinName}】！`);
                          }}
                          className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black border-2 border-black rounded active:scale-95 cursor-pointer"
                        >
                          {isEn ? 'Equip' : '裝備'}
                        </button>
                      ) : (
                        <button
                          disabled={coins < skin.cost}
                          onClick={() => {
                            if (coins >= skin.cost) {
                              sound.playUpgradeSound();
                              onBuySkin(skin);
                              showMsg(isEn ? `Purchased skin ${skinName}!` : `成功購買外觀【${skinName}】！`);
                            }
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-black border-2 border-black rounded shadow-[inset_1px_1px_0_#fde047] active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          {isEn ? `Buy (${skin.cost.toLocaleString()})` : `購買 (${skin.cost.toLocaleString()} 幣)`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 7: SUPPLIES & AUTOMATION */}
          {activeTab === 'supplies' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHOP_SUPPLIES.map(supply => {
                const isAutoMinerOwned = supply.type === 'auto_miner' && hasAutoMiner;
                const isHasteActive = supply.type === 'haste_drink' && hasteRemainingSeconds > 0;
                const supplyName = getName(supply);
                const supplyDesc = isEn ? supply.descEn : supply.descZh;

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
                          <span className="font-black text-sm text-white">{supplyName}</span>
                          <span className="text-[11px] ml-2 px-1.5 py-0.5 bg-zinc-800 text-amber-300 rounded border border-zinc-700 font-bold">
                            {supply.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300 mb-3">{supplyDesc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-xs font-mono text-amber-300 font-black">
                        {supply.cost.toLocaleString()} {isEn ? 'Coins' : '遊戲幣'}
                      </span>

                      {isAutoMinerOwned ? (
                        <div className="px-3 py-1 bg-cyan-950 text-cyan-300 text-xs font-black border border-cyan-500 rounded flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-cyan-400" /> {isEn ? 'Permanent Active (Auto-Mining)' : '已永久解鎖 (自動採礦中)'}
                        </div>
                      ) : (
                        <button
                          disabled={coins < supply.cost}
                          onClick={() => {
                            if (coins >= supply.cost && onBuySupply) {
                              onBuySupply(supply);
                              showMsg(isEn ? `Purchased and activated ${supplyName}!` : `成功購買使用【${supplyName}】！`);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black border-2 border-black rounded active:scale-95 flex items-center gap-1 shadow-[inset_1px_1px_0_#34d399,inset_-1px_-1px_0_#065f46] cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          {isHasteActive ? (isEn ? 'Extend Haste (+60s)' : '延長疾速 (+60s)') : (isEn ? `Buy & Use (${supply.cost} Coins)` : `購買使用 (${supply.cost} 幣)`)}
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
          💡 {isEn ? 'Excavate minerals in the quarry and sell them in the market to earn coins for tools, weapons, and luxury themes!' : '在挖掘場多採掘礦石並於交易所販售，即可獲得充足遊戲幣解鎖全套鎬斧鏟劍與奢華背景！'}
        </div>
      </div>
    </div>
  );
};
