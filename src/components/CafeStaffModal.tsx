import React, { useState } from 'react';
import { StaffMember, CafeRoleId, CafeVenueId, StaffRank } from '../types';
import { CAFE_ROLES, CafeRoleDefinition } from '../data/cafeStaffAndPromotionData';
import { CharacterModelRenderer } from './CharacterModelRenderer';
import { CHARACTER_OUTFITS, getOutfitById } from '../data/outfitsData';
import { sound } from '../utils/soundEffects';
import {
  Users,
  X,
  Sparkles,
  Award,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Coins,
  Compass,
  CheckCircle2,
  Building2,
  Crown,
  Briefcase,
  Shirt
} from 'lucide-react';

interface CafeStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
  onUpdateStaffMembers: (staff: StaffMember[]) => void;
  coins: number;
  onAddCoins: (amount: number) => void;
  onRecordCrossDispatch?: () => void;
  isEn: boolean;
  branch2Unlocked?: boolean;
  ownedOutfits?: string[];
}

export const CafeStaffModal: React.FC<CafeStaffModalProps> = ({
  isOpen,
  onClose,
  staffMembers,
  onUpdateStaffMembers,
  coins,
  onAddCoins,
  onRecordCrossDispatch,
  isEn,
  branch2Unlocked = true,
  ownedOutfits = ['classic_miner', 'barista_uniform', 'executive_chef', 'royal_tuxedo']
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'cross_dispatch' | 'legends'>('positions');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedTargetFloor, setSelectedTargetFloor] = useState<string>('2F 閣樓景觀包廂');

  if (!isOpen) return null;

  const roleMap = new Map<CafeRoleId, CafeRoleDefinition>(CAFE_ROLES.map(r => [r.id, r]));

  const getStaffOutfitId = (staff: StaffMember): string => {
    if (staff.outfitId) return staff.outfitId;
    if (staff.id === 'legend_ender_duke') return 'sommelier_noble';
    if (staff.id === 'legend_magma_baker') return 'netherite_hazard';
    if (staff.id === 'legend_aether_chef') return 'celestial_starlight';
    if (staff.id === 'legend_redstone_director') return 'steampunk_inventor';
    switch (staff.roleId) {
      case 'manager': return 'royal_tuxedo';
      case 'barista': return 'barista_uniform';
      case 'chef': return 'executive_chef';
      case 'waiter': return 'maid_cafe_elegance';
      case 'mixologist': return 'mixologist_neon';
      case 'sommelier': return 'sommelier_noble';
      case 'procurement': return 'netherite_hazard';
      default: return 'classic_miner';
    }
  };

  // Hire regular or legend staff
  const handleHireStaff = (staffId: string) => {
    const target = staffMembers.find(s => s.id === staffId);
    if (!target) return;
    if (coins < target.hireCost) {
      sound.playHitSound(1);
      return;
    }

    sound.playUpgradeSound();
    onAddCoins(-target.hireCost);
    onUpdateStaffMembers(
      staffMembers.map(s => (s.id === staffId ? { ...s, isHired: true } : s))
    );
  };

  // Change staff position (職位)
  const handleChangeRole = (staffId: string, newRole: CafeRoleId) => {
    sound.playClickSound();
    onUpdateStaffMembers(
      staffMembers.map(s => (s.id === staffId ? { ...s, roleId: newRole } : s))
    );
  };

  // Level up staff
  const handleLevelUpStaff = (staffId: string) => {
    const target = staffMembers.find(s => s.id === staffId);
    if (!target) return;
    const cost = target.level * 2500;
    if (coins < cost) {
      sound.playHitSound(1);
      return;
    }

    sound.playUpgradeSound();
    onAddCoins(-cost);
    const nextLevel = target.level + 1;
    let nextRank: StaffRank = target.rank;
    if (nextLevel >= 10) nextRank = 'Mythic';
    else if (nextLevel >= 8) nextRank = 'Grandmaster';
    else if (nextLevel >= 5) nextRank = 'Master';
    else if (nextLevel >= 3) nextRank = 'Senior';

    onUpdateStaffMembers(
      staffMembers.map(s =>
        s.id === staffId
          ? {
              ...s,
              level: nextLevel,
              rank: nextRank,
              efficiencyBonus: s.efficiencyBonus + 10
            }
          : s
      )
    );
  };

  // Execute Cross-Dispatch (跨請 / 跨樓調度支援)
  const handleExecuteCrossDispatch = (staffId: string, destination: string) => {
    sound.playUpgradeSound();
    onUpdateStaffMembers(
      staffMembers.map(s =>
        s.id === staffId
          ? {
              ...s,
              isCrossDispatched: true,
              crossDispatchTarget: destination
            }
          : s
      )
    );
    if (onRecordCrossDispatch) {
      onRecordCrossDispatch();
    }
  };

  // Recall Cross-Dispatch
  const handleRecallCrossDispatch = (staffId: string) => {
    sound.playClickSound();
    onUpdateStaffMembers(
      staffMembers.map(s =>
        s.id === staffId
          ? {
              ...s,
              isCrossDispatched: false,
              crossDispatchTarget: undefined
            }
          : s
      )
    );
  };

  const hiredStaff = staffMembers.filter(s => s.isHired);
  const unhiredStaff = staffMembers.filter(s => !s.isHired && !s.isGuestLegend);
  const legendGuests = staffMembers.filter(s => s.isGuestLegend);

  const DISPATCH_DESTINATIONS = [
    { id: '1F 本館大廳', nameZh: '1F 本館出餐大廳', nameEn: '1F Main Hall', icon: '🏛️' },
    { id: '2F 景觀包廂', nameZh: '2F 景觀閣樓包廂', nameEn: '2F Loft Lounge', icon: '🛋️' },
    { id: '3F VIP露台', nameZh: '3F VIP紫晶露台', nameEn: '3F VIP Terrace', icon: '💎' },
    { id: '4F 露天酒吧', nameZh: '4F 霓虹高空露天酒吧', nameEn: '4F Rooftop Bar', icon: '🍸' },
    { id: '二號分館・星空祕境', nameZh: '二號分館・星空祕境露天店', nameEn: 'Branch #2 Celestial Starlight', icon: '🌌' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans text-white">
      <div className="bg-[#201d1a] border-4 border-[#4d3a2a] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/90 via-[#2d2218] to-stone-900 px-6 py-4 border-b-2 border-[#543e2b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border-2 border-amber-500/60 flex items-center justify-center text-2xl shadow-inner">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-300 font-minecraft">
                  {isEn ? 'Cafe Staff, Job Roles & Cross-Hire' : '咖啡廳員工職位體系・跨請與特聘'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {hiredStaff.length} {isEn ? 'Staff Hired' : '位在職'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isEn
                  ? 'Assign specialized roles, cross-dispatch to floors/branches, and hire legendary guests.'
                  : '配置店長/主廚等7大專業職位、跨請調度支援各樓層與二號分館，並跨界特聘異次元傳奇顧問！'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-zinc-400 hover:text-white border border-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#181614] px-6 py-2 border-b border-[#3d2e20] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('positions');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-minecraft flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'positions'
                ? 'bg-amber-500 text-black shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isEn ? '1. Staff & 7 Job Roles' : '1. 員工名冊與 7 大職位'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('cross_dispatch');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-minecraft flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cross_dispatch'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isEn ? '2. Cross-Dispatch (能跨請支援)' : '2. 跨請調度 (跨樓層與二號分館支援)'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('legends');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-minecraft flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'legends'
                ? 'bg-yellow-600 text-black shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{isEn ? '3. Cross-Realm Legendary Guests' : '3. 跨界特聘・異次元傳奇顧問'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: POSITIONS & ROLES */}
          {activeTab === 'positions' && (
            <div className="space-y-6">
              {/* Role Buff Explanations */}
              <div className="bg-[#181614] border-2 border-[#3d2e20] rounded-xl p-3.5">
                <div className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? '7 Professional Job Roles & Passive Perks' : '7 大專業職位光環與常駐增益'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {CAFE_ROLES.map(role => (
                    <div
                      key={role.id}
                      className="bg-[#24201c] p-2.5 rounded-lg border border-[#443324] text-xs space-y-1"
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-base">{role.icon}</span>
                        <span className="text-amber-200">{isEn ? role.nameEn : role.nameZh}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        {isEn ? role.buffDescEn : role.buffDescZh}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hired Staff List */}
              <div className="space-y-3">
                <div className="text-xs font-black text-white font-minecraft uppercase tracking-wider flex items-center justify-between">
                  <span>{isEn ? 'Active Hired Staff' : '目前在職員工'}</span>
                  <span className="text-zinc-400 font-normal">
                    {isEn ? 'Click on role badge to change position' : '點擊職位可切換擔任工作'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hiredStaff.map(staff => {
                    const role = roleMap.get(staff.roleId);
                    const levelUpCost = staff.level * 2500;
                    const canAffordLevelUp = coins >= levelUpCost;

                    return (
                      <div
                        key={staff.id}
                        className={`p-4 rounded-xl border-2 bg-[#25211d] flex flex-col justify-between gap-3 shadow-md transition-all ${
                          staff.isCrossDispatched
                            ? 'border-purple-500/60 bg-purple-950/20'
                            : 'border-[#443324]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-16 rounded-xl bg-black/40 border-2 border-amber-600/40 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                              <CharacterModelRenderer
                                outfitId={getStaffOutfitId(staff)}
                                size="sm"
                                animation="idle"
                                showShadow={false}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-amber-200 font-minecraft">
                                  {isEn ? staff.nameEn : staff.nameZh}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold border border-zinc-700">
                                  Lv.{staff.level} {staff.rank}
                                </span>
                              </div>
                              <div className="text-[11px] text-emerald-400 mt-0.5 font-bold">
                                ⚡ {isEn ? 'Efficiency' : '工作效率'} +{staff.efficiencyBonus}%
                              </div>
                            </div>
                          </div>

                          {staff.isCrossDispatched && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-600 text-white rounded-full border border-purple-400 animate-pulse">
                              🚀 {isEn ? 'Dispatched' : '跨請支援中'}
                            </span>
                          )}
                        </div>

                        {/* Current Role and Change Dropdown */}
                        <div className="bg-[#181614] p-2.5 rounded-lg border border-[#3d2e20] space-y-1.5">
                          <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                            <span>{isEn ? 'Designated Position (職位):' : '目前擔任職位：'}</span>
                            <span className="text-amber-400 font-bold">
                              {role?.icon} {isEn ? role?.nameEn : role?.nameZh}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {CAFE_ROLES.map(r => (
                              <button
                                key={r.id}
                                onClick={() => handleChangeRole(staff.id, r.id)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  staff.roleId === r.id
                                    ? 'bg-amber-500 text-black font-black shadow'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                }`}
                              >
                                {r.icon} {isEn ? r.nameEn.split(' ')[0] : r.nameZh}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Outfit / Uniform Selector */}
                        <div className="bg-[#181614] p-2 rounded-lg border border-[#3d2e20] flex items-center justify-between gap-2">
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <Shirt className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{isEn ? 'Uniform:' : '當前制服：'}</span>
                          </div>
                          <select
                            value={staff.outfitId || getStaffOutfitId(staff)}
                            onChange={(e) => {
                              sound.playClickSound();
                              const newOid = e.target.value;
                              onUpdateStaffMembers(
                                staffMembers.map(s => s.id === staff.id ? { ...s, outfitId: newOid } : s)
                              );
                            }}
                            className="px-2 py-0.5 bg-zinc-900 border border-amber-600/50 rounded text-[10px] text-amber-200 font-minecraft cursor-pointer max-w-[160px] truncate"
                          >
                            {ownedOutfits.map(oid => {
                              const o = getOutfitById(oid);
                              return (
                                <option key={o.id} value={o.id}>
                                  {o.icon} {isEn ? o.nameEn : o.nameZh}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Level up / promotion button */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#3d2e20]">
                          <span className="text-[11px] text-zinc-400">
                            {isEn ? `Upgrade to Lv.${staff.level + 1}` : `升等至 Lv.${staff.level + 1}`}
                          </span>
                          <button
                            onClick={() => handleLevelUpStaff(staff.id)}
                            disabled={!canAffordLevelUp}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-minecraft flex items-center gap-1.5 transition-all cursor-pointer ${
                              canAffordLevelUp
                                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow active:scale-95'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>{levelUpCost.toLocaleString()} 🪙</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unhired Staff Available */}
              {unhiredStaff.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-black text-white font-minecraft uppercase tracking-wider">
                    {isEn ? 'Available for Recruitment' : '可招募新員工'}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {unhiredStaff.map(staff => {
                      const role = roleMap.get(staff.roleId);
                      const canAfford = coins >= staff.hireCost;

                      return (
                        <div
                          key={staff.id}
                          className="p-4 rounded-xl border-2 border-[#3d2e20] bg-[#1c1916] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-black/40 border border-zinc-700 flex items-center justify-center text-2xl">
                              {staff.avatar}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-zinc-200">
                                {isEn ? staff.nameEn : staff.nameZh}
                              </div>
                              <div className="text-[10px] text-amber-400 mt-0.5">
                                {role?.icon} {isEn ? role?.nameEn : role?.nameZh}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleHireStaff(staff.id)}
                            disabled={!canAfford}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-minecraft flex items-center gap-1.5 transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-95'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            }`}
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>{staff.hireCost.toLocaleString()} 🪙</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CROSS-DISPATCH (能跨請支援) */}
          {activeTab === 'cross_dispatch' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/30 border-2 border-purple-500/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm font-minecraft">
                  <ArrowRightLeft className="w-5 h-5" />
                  <span>{isEn ? 'Cross-Dispatch & Cross-Floor Support (能跨請)' : '跨請調度支援系統 (能跨請)'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {isEn
                    ? 'Dispatch your skilled staff to 1F, 2F Loft, 3F VIP Terrace, 4F Rooftop Bar, or Celestial Branch #2! Dispatched staff grant full role buffs and boost customer patience and tips in that specific zone.'
                    : '將麾下具備專業職位的員工「跨請」至 1F、2F 閣樓、3F VIP、4F 露天酒吧或二號分館支援！被跨請的員工將直接進駐該區，大幅提升該樓層客人的點餐耐心與小費倍率！'}
                </p>
              </div>

              {/* Staff selection for dispatch */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white font-minecraft">
                  {isEn ? 'Select Staff to Cross-Dispatch' : '選擇欲跨請調度之員工'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hiredStaff.map(staff => {
                    const role = roleMap.get(staff.roleId);

                    return (
                      <div
                        key={staff.id}
                        className={`p-3.5 rounded-xl border-2 bg-[#25211d] space-y-3 ${
                          staff.isCrossDispatched
                            ? 'border-purple-500 bg-purple-950/30'
                            : 'border-[#443324]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{staff.avatar}</span>
                            <div>
                              <div className="text-xs font-bold text-white">
                                {isEn ? staff.nameEn : staff.nameZh}
                              </div>
                              <div className="text-[10px] text-amber-400">
                                {role?.icon} {isEn ? role?.nameEn : role?.nameZh}
                              </div>
                            </div>
                          </div>

                          {staff.isCrossDispatched ? (
                            <button
                              onClick={() => handleRecallCrossDispatch(staff.id)}
                              className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-600/50 rounded-lg text-xs font-bold cursor-pointer transition-all"
                            >
                              {isEn ? 'Recall' : '召回主館'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                              {isEn ? 'Stationed at Main' : '本館常駐'}
                            </span>
                          )}
                        </div>

                        {/* If dispatched, show target */}
                        {staff.isCrossDispatched ? (
                          <div className="p-2 bg-purple-950/60 border border-purple-600/40 rounded-lg text-xs text-purple-200 flex items-center justify-between">
                            <span>🚀 {isEn ? 'Current Post:' : '目前跨請支援目的地：'}</span>
                            <strong className="text-amber-300 font-bold">{staff.crossDispatchTarget}</strong>
                          </div>
                        ) : (
                          <div className="space-y-1.5 pt-1 border-t border-[#3d2e20]">
                            <div className="text-[10px] text-zinc-400">
                              {isEn ? 'Choose destination to cross-dispatch:' : '跨請派駐目的地：'}
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {DISPATCH_DESTINATIONS.map(dest => (
                                <button
                                  key={dest.id}
                                  onClick={() => handleExecuteCrossDispatch(staff.id, dest.nameZh)}
                                  className="px-2 py-1.5 bg-zinc-900 hover:bg-purple-900/60 text-zinc-300 hover:text-purple-200 border border-zinc-700 hover:border-purple-500 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <span>{dest.icon}</span>
                                  <span className="truncate">{isEn ? dest.nameEn : dest.nameZh}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CROSS-REALM LEGENDARY GUESTS (跨界特聘) */}
          {activeTab === 'legends' && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-950/30 border-2 border-yellow-500/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm font-minecraft">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span>{isEn ? 'Cross-Realm Legendary Guest Contracts (跨界特聘)' : '跨界特聘・異次元傳奇顧問 (能跨請特約)'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {isEn
                    ? 'Cross-hire legendary beings from other realms: Duke of Ender Void, Dwarven Magma Baker, Celestial Aether Arch-Chef, and Redstone Mech Overseer to bestow godly cafe passives!'
                    : '跨次元聘請終界次元調飲公爵、矮人黑曜石熔岩主廚、天界以太光輝神廚與紅石自動化總監！傳奇顧問擁有光速瞬移出餐、料理免耗材、自動收錢等全知神力！'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {legendGuests.map(legend => {
                  const canAfford = coins >= legend.hireCost;

                  return (
                    <div
                      key={legend.id}
                      className={`p-4 rounded-xl border-2 flex flex-col justify-between gap-3 shadow-lg ${
                        legend.isHired
                          ? 'bg-yellow-950/20 border-yellow-500/80 shadow-yellow-950/40'
                          : 'bg-[#1c1916] border-[#443324]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black font-minecraft text-yellow-400 bg-yellow-950/80 px-2 py-0.5 rounded border border-yellow-600/40">
                            ★ MYTHIC 傳奇顧問
                          </span>
                          {legend.isHired ? (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Active Contract' : '已簽約在任'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-400">
                              {isEn ? 'Available for Contract' : '可簽約跨聘'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-14 h-16 rounded-2xl bg-black/60 border-2 border-yellow-500/60 flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
                            <CharacterModelRenderer
                              outfitId={getStaffOutfitId(legend)}
                              size="sm"
                              animation="idle"
                              showShadow={false}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-black text-amber-200 font-minecraft">
                              {isEn ? legend.nameEn : legend.nameZh}
                            </div>
                            <div className="text-xs text-yellow-300 font-bold mt-0.5">
                              {isEn ? legend.legendTitleEn : legend.legendTitleZh}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-1">
                              ⚡ {isEn ? 'Godly Boost:' : '神級加成：'} +{legend.efficiencyBonus}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hire button */}
                      <div>
                        {legend.isHired ? (
                          <div className="w-full py-2 bg-yellow-600/20 border border-yellow-500/40 rounded-xl text-center text-xs font-bold text-yellow-300">
                            ✨ {isEn ? 'Serving with Distinction' : '傳奇特聘常駐中'}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleHireStaff(legend.id)}
                            disabled={!canAfford}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold font-minecraft flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-black font-black active:scale-98'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                            }`}
                          >
                            <Crown className="w-4 h-4" />
                            <span>
                              {isEn
                                ? `Cross-Hire Contract (${legend.hireCost.toLocaleString()} 🪙)`
                                : `跨界特聘簽約 (${legend.hireCost.toLocaleString()} 🪙)`}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#181614] px-6 py-3 border-t border-[#3d2e20] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Current Balance:' : '目前持現金幣：'}</span>
            <strong className="text-amber-300 font-mono text-sm">{coins.toLocaleString()} 🪙</strong>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl border border-stone-600 transition-colors cursor-pointer"
          >
            {isEn ? 'Confirm & Close' : '確認完成並關閉'}
          </button>
        </div>
      </div>
    </div>
  );
};
