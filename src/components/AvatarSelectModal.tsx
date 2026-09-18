import React, { useState } from 'react';
import { PLAYER_SKINS } from '../data/gameData';
import { CHARACTER_OUTFITS, getOutfitById } from '../data/outfitsData';
import { PlayerSkin, CharacterOutfit, StaffMember } from '../types';
import { CharacterModelRenderer } from './CharacterModelRenderer';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import {
  X,
  Check,
  Lock,
  Sparkles,
  Coins,
  Shirt,
  User,
  Users,
  Eye,
  Zap,
  Play,
  Award
} from 'lucide-react';

interface AvatarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkinId: string;
  ownedSkins: string[];
  coins: number;
  onEquipSkin: (skinId: string) => void;
  onBuySkin: (skin: PlayerSkin) => void;
  // 2.5.41 Outfits & Wardrobe additions
  currentOutfitId?: string;
  ownedOutfits?: string[];
  onEquipOutfit?: (outfitId: string) => void;
  onBuyOutfit?: (outfit: CharacterOutfit) => void;
  staffMembers?: StaffMember[];
  onAssignStaffOutfit?: (staffId: string, outfitId: string) => void;
}

export const AvatarSelectModal: React.FC<AvatarSelectModalProps> = ({
  isOpen,
  onClose,
  currentSkinId,
  ownedSkins,
  coins,
  onEquipSkin,
  onBuySkin,
  currentOutfitId = 'classic_miner',
  ownedOutfits = ['classic_miner'],
  onEquipOutfit,
  onBuyOutfit,
  staffMembers = [],
  onAssignStaffOutfit
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'wardrobe' | 'avatars' | 'staff'>('wardrobe');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(currentOutfitId);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'cafe_staff' | 'miner' | 'special'>('all');
  const [previewAnim, setPreviewAnim] = useState<'idle' | 'walk' | 'cheer'>('idle');

  if (!isOpen) return null;

  const currentSkin = PLAYER_SKINS.find(s => s.id === currentSkinId) || PLAYER_SKINS[0];
  const activeOutfit = getOutfitById(currentOutfitId);
  const previewOutfit = getOutfitById(selectedOutfitId);

  // Filter outfits
  const filteredOutfits = CHARACTER_OUTFITS.filter(o => {
    if (categoryFilter === 'all') return true;
    return o.category === categoryFilter;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-400',
          glow: '#f59e0b',
          label: isEn ? 'Mythic' : '創世神話'
        };
      case 'legendary':
        return {
          bg: 'bg-purple-500/20 text-purple-300 border-purple-400',
          glow: '#a855f7',
          label: isEn ? 'Legendary' : '傳說紫晶'
        };
      case 'epic':
        return {
          bg: 'bg-blue-500/20 text-blue-300 border-blue-400',
          glow: '#3b82f6',
          label: isEn ? 'Epic' : '史詩卓越'
        };
      case 'rare':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400',
          glow: '#10b981',
          label: isEn ? 'Rare' : '稀有工藝'
        };
      default:
        return {
          bg: 'bg-zinc-700/40 text-zinc-300 border-zinc-500',
          glow: '#71717a',
          label: isEn ? 'Standard' : '經典基礎'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#201e1c] border-4 sm:border-6 border-black rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[inset_-6px_-6px_0_#111,inset_6px_6px_0_#444,0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-zinc-900 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 border-2 border-amber-500 rounded-lg text-amber-400">
              <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-black text-amber-300 drop-shadow-[2px_2px_0_#000] font-minecraft">
                  {isEn ? 'Avatar & Wardrobe Studio' : '角色造型與衣物時裝工坊'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/60 rounded font-mono font-bold">
                  v2.5.41
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {isEn
                  ? '3D Minecraft humanoid model visualizer, outfits, and staff uniforms'
                  : '高精像素人型模型增強・時裝衣物・全體員工制服自訂'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Coin Balance */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-300 text-xs font-bold font-minecraft">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{coins.toLocaleString()}</span>
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

        {/* Tab Navigation */}
        <div className="bg-zinc-950 px-3 sm:px-5 pt-2 border-b-2 border-black flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('wardrobe');
            }}
            className={`px-3 sm:px-4 py-2 font-minecraft text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 border-x-2 rounded-t-lg transition-all cursor-pointer ${
              activeTab === 'wardrobe'
                ? 'bg-[#201e1c] text-amber-300 border-amber-500 -mb-[2px] z-10'
                : 'bg-zinc-900/60 text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Wardrobe & Outfits' : '衣物時裝工坊'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-900/60 rounded text-amber-200">
              {CHARACTER_OUTFITS.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('staff');
            }}
            className={`px-3 sm:px-4 py-2 font-minecraft text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 border-x-2 rounded-t-lg transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-[#201e1c] text-amber-300 border-amber-500 -mb-[2px] z-10'
                : 'bg-zinc-900/60 text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>{isEn ? 'Staff Uniforms' : '員工制服指派'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-purple-900/60 rounded text-purple-200">
              {staffMembers.filter(s => s.isHired).length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('avatars');
            }}
            className={`px-3 sm:px-4 py-2 font-minecraft text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 border-x-2 rounded-t-lg transition-all cursor-pointer ${
              activeTab === 'avatars'
                ? 'bg-[#201e1c] text-amber-300 border-amber-500 -mb-[2px] z-10'
                : 'bg-zinc-900/60 text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>{isEn ? 'Player Skins & Badges' : '角色頭像稱號'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-cyan-900/60 rounded text-cyan-200">
              {PLAYER_SKINS.length}
            </span>
          </button>
        </div>

        {/* ================= TAB 1: WARDROBE & OUTFITS ================= */}
        {activeTab === 'wardrobe' && (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Model Showcase Studio */}
            <div className="w-full md:w-72 lg:w-80 bg-zinc-950/90 border-b-4 md:border-b-0 md:border-r-4 border-black p-4 flex flex-col items-center justify-between shrink-0 shadow-inner">
              <div className="w-full flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="font-bold font-minecraft flex items-center gap-1 text-amber-400">
                  <Eye className="w-3.5 h-3.5" />
                  {isEn ? 'Live 3D Model Studio' : '即時模型展示台'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {previewAnim.toUpperCase()}
                </span>
              </div>

              {/* 3D Model Pedestal Box */}
              <div className="relative w-full h-56 sm:h-64 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border-2 border-amber-500/40 flex flex-col items-center justify-center p-3 shadow-2xl overflow-hidden group">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.4) 1px, transparent 0)',
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Rotating / Glowing Pedestal */}
                <div className="absolute bottom-4 w-32 h-6 rounded-full bg-amber-500/20 border border-amber-400/50 blur-[1px] animate-pulse pointer-events-none" />

                {/* The Enhanced Minecraft Humanoid Model */}
                <CharacterModelRenderer
                  customOutfit={previewOutfit}
                  size="xl"
                  animation={previewAnim}
                  showShadow={true}
                  glowColor={getRarityBadge(previewOutfit.rarity).glow}
                  characterName={isEn ? previewOutfit.nameEn : previewOutfit.nameZh}
                  showNameTag={true}
                />

                {/* Equipped Badge overlay */}
                {selectedOutfitId === currentOutfitId && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-950/90 border border-emerald-500 rounded text-[10px] font-minecraft font-black text-emerald-300 flex items-center gap-1 shadow-md">
                    <Check className="w-3 h-3" />
                    <span>{isEn ? 'EQUIPPED' : '已穿戴'}</span>
                  </div>
                )}
              </div>

              {/* Animation Action Bar */}
              <div className="w-full mt-3 flex items-center justify-center gap-1.5 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setPreviewAnim('idle')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold font-minecraft transition-all cursor-pointer ${
                    previewAnim === 'idle'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isEn ? 'Idle' : '待機'}
                </button>
                <button
                  onClick={() => setPreviewAnim('walk')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold font-minecraft transition-all cursor-pointer ${
                    previewAnim === 'walk'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isEn ? 'Walk' : '行走'}
                </button>
                <button
                  onClick={() => setPreviewAnim('cheer')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold font-minecraft transition-all cursor-pointer ${
                    previewAnim === 'cheer'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isEn ? 'Cheer' : '歡呼'}
                </button>
              </div>

              {/* Stat Buff Info Card */}
              <div className="w-full mt-2.5 p-2.5 bg-zinc-900/90 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 font-minecraft mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isEn ? 'Outfit Buff Effect:' : '時裝屬性加成：'}</span>
                </div>
                <div className="text-[11px] text-emerald-400 leading-tight">
                  {isEn ? previewOutfit.buffEn : previewOutfit.buffZh}
                </div>
              </div>
            </div>

            {/* Right Outfit Gallery */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#201e1c]">
              {/* Filter Tabs */}
              <div className="p-3 bg-zinc-900/80 border-b-2 border-black flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs font-bold font-minecraft cursor-pointer transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-amber-500 text-black shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isEn ? 'All' : '全部'}
                  </button>
                  <button
                    onClick={() => setCategoryFilter('cafe_staff')}
                    className={`px-2.5 py-1 rounded text-xs font-bold font-minecraft cursor-pointer transition-all ${
                      categoryFilter === 'cafe_staff'
                        ? 'bg-amber-500 text-black shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ☕ {isEn ? 'Cafe & Kitchen' : '咖啡與外場'}
                  </button>
                  <button
                    onClick={() => setCategoryFilter('miner')}
                    className={`px-2.5 py-1 rounded text-xs font-bold font-minecraft cursor-pointer transition-all ${
                      categoryFilter === 'miner'
                        ? 'bg-amber-500 text-black shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ⛏️ {isEn ? 'Mining Gear' : '礦業工裝'}
                  </button>
                  <button
                    onClick={() => setCategoryFilter('special')}
                    className={`px-2.5 py-1 rounded text-xs font-bold font-minecraft cursor-pointer transition-all ${
                      categoryFilter === 'special'
                        ? 'bg-amber-500 text-black shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ✨ {isEn ? 'Special & Mythic' : '傳奇特裝'}
                  </button>
                </div>

                <div className="text-[11px] text-zinc-400 shrink-0 font-mono">
                  {filteredOutfits.length} {isEn ? 'items' : '套時裝'}
                </div>
              </div>

              {/* Grid List of Outfits */}
              <div className="p-3 sm:p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredOutfits.map(outfit => {
                  const isSelected = selectedOutfitId === outfit.id;
                  const isEquipped = currentOutfitId === outfit.id;
                  const isOwned = ownedOutfits.includes(outfit.id) || outfit.cost === 0;
                  const canAfford = coins >= outfit.cost;
                  const rarityBadge = getRarityBadge(outfit.rarity);

                  return (
                    <div
                      key={outfit.id}
                      onClick={() => {
                        sound.playClickSound();
                        setSelectedOutfitId(outfit.id);
                      }}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between cursor-pointer relative group ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : isOwned
                          ? 'border-zinc-700 bg-zinc-900/90 hover:border-zinc-500'
                          : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {/* Miniature Model Preview icon */}
                        <div className="w-14 h-16 rounded-lg bg-black/40 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                          <CharacterModelRenderer
                            customOutfit={outfit}
                            size="sm"
                            animation="idle"
                            showShadow={false}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-black text-zinc-100 font-minecraft truncate">
                              {isEn ? outfit.nameEn : outfit.nameZh}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${rarityBadge.bg}`}
                            >
                              {rarityBadge.label}
                            </span>
                            <span className="text-[10px] text-zinc-400 truncate">
                              {isEn ? outfit.badgeEn : outfit.badgeZh}
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                            {isEn ? outfit.descEn : outfit.descZh}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Buff & Action Row */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
                        <div className="flex items-center gap-1">
                          {outfit.cost === 0 ? (
                            <span className="text-xs font-bold text-zinc-400">
                              {isEn ? 'Default' : '基礎初始'}
                            </span>
                          ) : isOwned ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Unlocked' : '已解鎖'}</span>
                            </span>
                          ) : (
                            <span className="text-xs font-black text-amber-400 font-minecraft flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              <span>{outfit.cost.toLocaleString()}</span>
                            </span>
                          )}
                        </div>

                        {/* Equip / Unlock Button */}
                        {isEquipped ? (
                          <div className="px-3 py-1 bg-emerald-950 border border-emerald-500 rounded text-xs font-black text-emerald-300 flex items-center gap-1 font-minecraft">
                            <Check className="w-3 h-3" />
                            <span>{isEn ? 'Active' : '穿戴中'}</span>
                          </div>
                        ) : isOwned ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sound.playClickSound();
                              if (onEquipOutfit) {
                                onEquipOutfit(outfit.id);
                              }
                            }}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black border-2 border-black rounded text-xs font-black shadow active:scale-95 cursor-pointer font-minecraft"
                          >
                            {isEn ? 'Equip Outfit' : '穿戴時裝'}
                          </button>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (canAfford) {
                                sound.playAchievementSound();
                                if (onBuyOutfit) {
                                  onBuyOutfit(outfit);
                                }
                              } else {
                                sound.playHitSound(2);
                              }
                            }}
                            className={`px-3 py-1 rounded text-xs font-black border-2 border-black flex items-center gap-1 active:scale-95 font-minecraft ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow cursor-pointer'
                                : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                            }`}
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Unlock' : '解鎖'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: STAFF UNIFORMS ================= */}
        {activeTab === 'staff' && (
          <div className="flex-1 p-4 overflow-y-auto bg-[#201e1c]">
            <div className="mb-4 p-3 bg-zinc-900/90 border-2 border-amber-500/40 rounded-xl flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-amber-300 font-minecraft">
                  {isEn ? 'Cafe Staff Uniform Assignments' : '咖啡廳員工制服調度指派'}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {isEn
                    ? 'Assign any unlocked outfit to your cafe team members to wear at work!'
                    : '將你已解鎖的時裝指派給全體員工，他們將穿著專屬制服在咖啡廳工作！'}
                </p>
              </div>
              <span className="text-2xl">👔</span>
            </div>

            {staffMembers.filter(s => s.isHired).length === 0 ? (
              <div className="p-8 text-center bg-zinc-950/80 rounded-xl border border-zinc-800">
                <Users className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400 font-minecraft">
                  {isEn
                    ? 'No staff hired yet. Go to Cafe Staff Station to hire your team!'
                    : '目前尚無已聘用員工。請前往咖啡廳員工站點招募夥伴！'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffMembers
                  .filter(s => s.isHired)
                  .map(staff => {
                    const assignedOutfit = getOutfitById(staff.outfitId);

                    return (
                      <div
                        key={staff.id}
                        className="p-3.5 bg-zinc-900/90 border-2 border-zinc-700 rounded-xl flex flex-col justify-between gap-3 shadow"
                      >
                        <div className="flex items-start gap-3">
                          {/* Staff Model Renderer */}
                          <div className="w-16 h-20 rounded-lg bg-black/40 border border-amber-600/40 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                            <CharacterModelRenderer
                              outfitId={staff.outfitId || 'barista_uniform'}
                              size="sm"
                              animation="idle"
                              showShadow={false}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white font-minecraft">
                                {isEn ? staff.nameEn : staff.nameZh}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold border border-zinc-700">
                                {staff.rank}
                              </span>
                            </div>

                            <div className="text-xs text-amber-400 font-bold mt-0.5">
                              {staff.avatar} {isEn ? staff.assignedStation : staff.assignedStation}
                            </div>

                            <div className="mt-1.5 text-[11px] text-zinc-300">
                              <span className="text-zinc-500">{isEn ? 'Uniform: ' : '現穿制服：'}</span>
                              <span className="text-amber-300 font-bold">
                                {isEn ? assignedOutfit.nameEn : assignedOutfit.nameZh}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Outfit Selection Dropdown */}
                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                          <span className="text-xs text-zinc-400 font-minecraft">
                            {isEn ? 'Change Outfit:' : '選擇套裝：'}
                          </span>

                          <select
                            value={staff.outfitId || 'barista_uniform'}
                            onChange={(e) => {
                              sound.playClickSound();
                              if (onAssignStaffOutfit) {
                                onAssignStaffOutfit(staff.id, e.target.value);
                              }
                            }}
                            className="px-2 py-1 bg-zinc-950 border border-amber-500/60 rounded text-xs text-amber-200 font-minecraft cursor-pointer"
                          >
                            {ownedOutfits.map(outfitId => {
                              const o = getOutfitById(outfitId);
                              return (
                                <option key={o.id} value={o.id}>
                                  {o.icon} {isEn ? o.nameEn : o.nameZh}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: AVATARS & SKINS ================= */}
        {activeTab === 'avatars' && (
          <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#201e1c]">
            {PLAYER_SKINS.map(skin => {
              const isEquipped = currentSkinId === skin.id;
              const isOwned = ownedSkins.includes(skin.id) || skin.cost === 0;
              const canAfford = coins >= skin.cost;

              return (
                <div
                  key={skin.id}
                  className={`p-3.5 rounded-lg border-2 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-[inset_1px_1px_0_#34d399]'
                      : isOwned
                      ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                      : 'bg-zinc-950/80 border-zinc-800 opacity-90'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-3xl shrink-0 ${
                        isEquipped
                          ? 'bg-emerald-900/60 border-emerald-400 shadow-md'
                          : isOwned
                          ? 'bg-zinc-800 border-zinc-600'
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                    >
                      {skin.avatarEmoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white truncate font-minecraft">
                          {isEn ? skin.nameEn : skin.nameZh}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-amber-300 rounded font-bold border border-zinc-700 shrink-0">
                          {skin.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                        {skin.desc}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      {skin.cost === 0 ? (
                        <span className="text-xs font-bold text-zinc-400">
                          {isEn ? 'Default' : '預設造型'}
                        </span>
                      ) : isOwned ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Unlocked' : '已解鎖'}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-black text-amber-400 font-minecraft flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{skin.cost.toLocaleString()}</span>
                        </span>
                      )}
                    </div>

                    {isEquipped ? (
                      <div className="px-3 py-1.5 bg-emerald-900/80 text-emerald-200 border border-emerald-500 rounded text-xs font-black flex items-center gap-1 font-minecraft">
                        <Check className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Active' : '使用中'}</span>
                      </div>
                    ) : isOwned ? (
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          onEquipSkin(skin.id);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border-2 border-black rounded text-xs font-black shadow active:scale-95 cursor-pointer font-minecraft"
                      >
                        {isEn ? 'Equip Avatar' : '裝備頭像'}
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          if (canAfford) {
                            sound.playAchievementSound();
                            onBuySkin(skin);
                          } else {
                            sound.playHitSound(2);
                          }
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-black border-2 border-black flex items-center gap-1 active:scale-95 font-minecraft ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-black shadow cursor-pointer'
                            : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Unlock & Equip' : '解鎖並裝備'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-zinc-900 border-t-4 border-black flex justify-between items-center">
          <div className="text-[11px] text-zinc-400 hidden sm:block">
            {isEn
              ? 'Equip outfits to boost cafe operations & explore the overworld in style!'
              : '裝備時裝將同步改變大地圖行走模型與全店屬性加成！'}
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-lg border-2 border-black active:scale-95 cursor-pointer font-minecraft shadow ml-auto"
          >
            {isEn ? 'Done' : '完成確認'}
          </button>
        </div>
      </div>
    </div>
  );
};
