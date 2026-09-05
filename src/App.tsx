import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BLOCK_TYPES, PICKAXE_TIERS, THEME_BACKGROUNDS, PLAYER_SKINS, STRATA_LAYERS, MARKET_INFLATION_TEMPLATES, SHOP_SUPPLIES } from './data/gameData';
import { INITIAL_ACHIEVEMENTS } from './data/achievementsData';
import { BlockType, PickaxeState, ThemeBackground, PlayerSkin, Friend, Achievement, MarketInflationEvent, ShopSupplyItem } from './types';
import { QuarryMining } from './components/QuarryMining';
import { BuildingZone } from './components/BuildingZone';
import { Hotbar } from './components/Hotbar';
import { MarketModal } from './components/MarketModal';
import { ShopModal } from './components/ShopModal';
import { FriendsModal } from './components/FriendsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { GameMenuModal } from './components/GameMenuModal';
import { ChangelogModal } from './components/ChangelogModal';
import { AuthModal } from './components/AuthModal';
import { sound } from './utils/soundEffects';
import {
  ShoppingBag,
  Coins,
  Users,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  Menu,
  Scroll,
  Cloud,
  ExternalLink,
  Github,
  Pickaxe,
  Box,
  Layers,
  CheckCircle2,
  TrendingUp,
  Flame
} from 'lucide-react';
import {
  subscribeToAuth,
  saveUserData,
  loadUserData,
  isFirebaseConfigured
} from './services/firebase';

const STORAGE_KEY = 'mc_mining_workshop_v1';

export default function App() {
  // --- Game State with LocalStorage Persistence ---
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_coins`);
      return saved ? JSON.parse(saved) : 50; // Starting 50 coins
    } catch {
      return 50;
    }
  });

  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Default initial starter materials
    return {
      dirt: 15,
      wood: 8,
      cobblestone: 10,
      coal_ore: 2,
      copper_ore: 0,
      iron_ore: 0,
      gold_ore: 0,
      redstone_ore: 0,
      lapis_ore: 0,
      diamond_ore: 0,
      emerald_ore: 0,
      deepslate_diamond: 0,
      netherrack: 0,
      glowstone: 0,
      end_stone: 0,
      purpur: 0,
      obsidian: 0,
      ancient_debris: 0
    };
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string>('dirt');

  const [pickaxeState, setPickaxeState] = useState<PickaxeState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pickaxe`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      currentTierId: 'bare_hand',
      currentDurability: 999999,
      efficiencyLevel: 0,
      unbreakingLevel: 0,
      fortuneLevel: 0,
      isBroken: false
    };
  });

  const [ownedPickaxes, setOwnedPickaxes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_owned_picks`);
      return saved ? JSON.parse(saved) : ['bare_hand'];
    } catch {
      return ['bare_hand'];
    }
  });

  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_theme`);
      return saved ? JSON.parse(saved) : 'overworld';
    } catch {
      return 'overworld';
    }
  });

  const [ownedThemes, setOwnedThemes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_owned_themes`);
      return saved ? JSON.parse(saved) : ['overworld'];
    } catch {
      return ['overworld'];
    }
  });

  const [currentSkinId, setCurrentSkinId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_skin`);
      return saved ? JSON.parse(saved) : 'steve';
    } catch {
      return 'steve';
    }
  });

  const [ownedSkins, setOwnedSkins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_owned_skins`);
      return saved ? JSON.parse(saved) : ['steve'];
    } catch {
      return ['steve'];
    }
  });

  // 100-slot building canvas
  const [buildGrid, setBuildGrid] = useState<(string | null)[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_grid`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return Array(100).fill(null);
  });

  // Friends & social state
  const [myUsername, setMyUsername] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_username`);
      return saved ? JSON.parse(saved) : 'Miner_' + Math.floor(1000 + Math.random() * 9000);
    } catch {
      return 'Miner_' + Math.floor(1000 + Math.random() * 9000);
    }
  });

  const [myFriendCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_code`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    localStorage.setItem(`${STORAGE_KEY}_code`, JSON.stringify(code));
    return code;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_friends`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Clean initial state with no test placeholders
    return [];
  });

  const [friendRewardClaimed, setFriendRewardClaimed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_friend_reward_claimed`);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // 150 Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      if (saved) {
        const parsed = JSON.parse(saved) as Achievement[];
        // Merge with initial list in case count expanded
        return INITIAL_ACHIEVEMENTS.map(initial => {
          const found = parsed.find(p => p.id === initial.id);
          return found
            ? { ...initial, unlocked: found.unlocked, rewardClaimed: found.rewardClaimed }
            : initial;
        });
      }
    } catch {
      // Fallback
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Strata mining layer tracking (50,000 blocks each to unlock next)
  const [layerMinedCounts, setLayerMinedCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_layer_mined`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      surface: 0,
      shallow: 0,
      crystalline: 0,
      deepslate_abyss: 0,
      nether_core: 0,
      end_void: 0,
      deep_dark: 0,
      aether_celestial: 0
    };
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_selected_layer`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return 'surface';
  });

  // Layer unlock celebration toast
  const [layerUnlockToast, setLayerUnlockToast] = useState<string | null>(null);

  // Dynamic Random Market Inflation Event System
  const [marketInflationEvent, setMarketInflationEvent] = useState<MarketInflationEvent>(() => ({
    id: 'normal',
    title: '平穩市場週期',
    description: '全品項按標準行情結算，供需平穩。',
    multiplier: 1.0,
    remainingSeconds: 60
  }));

  // Statistics
  const [stats, setStats] = useState<{
    totalClicks: number;
    totalBlocksMined: number;
    totalCoinsEarned: number;
    totalBlocksPlaced: number;
    totalBlocksSold: number;
    blocksSoldDuringInflation: number;
    blockTypeMinedCounts: Record<string, number>;
  }>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stats`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          totalClicks: parsed.totalClicks || 0,
          totalBlocksMined: parsed.totalBlocksMined || 0,
          totalCoinsEarned: parsed.totalCoinsEarned || 0,
          totalBlocksPlaced: parsed.totalBlocksPlaced || 0,
          totalBlocksSold: parsed.totalBlocksSold || 0,
          blocksSoldDuringInflation: parsed.blocksSoldDuringInflation || 0,
          blockTypeMinedCounts: parsed.blockTypeMinedCounts || {}
        };
      }
    } catch {
      // Fallback
    }
    return {
      totalClicks: 0,
      totalBlocksMined: 0,
      totalCoinsEarned: 0,
      totalBlocksPlaced: 0,
      totalBlocksSold: 0,
      blocksSoldDuringInflation: 0,
      blockTypeMinedCounts: {}
    };
  });

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals visibility
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [shopInitialTab, setShopInitialTab] = useState<'pickaxes' | 'themes' | 'skins' | 'supplies'>('pickaxes');

  // Supplies & Automations
  const [hasAutoMiner, setHasAutoMiner] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_auto_miner`);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [hasteRemainingSeconds, setHasteRemainingSeconds] = useState<number>(0);
  const [supplyToastMsg, setSupplyToastMsg] = useState<string | null>(null);

  // Active zone filter in layout
  const [activeView, setActiveView] = useState<'all' | 'quarry' | 'building'>('all');

  // Firebase Auth & Cloud Sync state
  const [currentUser, setCurrentUser] = useState<{ email: string | null; displayName: string | null; uid: string | null } | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_last_saved_time`) || null;
  });
  const [cloudToast, setCloudToast] = useState<string | null>(null);

  // Achievement unlock popup toast
  const [popupAchievement, setPopupAchievement] = useState<Achievement | null>(null);

  // Subscribe to Firebase Auth state change (Auto-Login)
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        setCurrentUser({
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Miner',
          uid: user.uid
        });
        if (user.displayName) {
          setMyUsername(user.displayName);
        }
        // Notify
        setCloudToast(`☁️ 已自動登入：${user.displayName || user.email}`);
        setTimeout(() => setCloudToast(null), 3500);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Cloud Save Handler
  const handleCloudSave = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser?.uid) {
      return { success: false, error: '請先登入 Firebase 帳號！' };
    }
    const payload = {
      coins,
      inventory,
      layerMinedCounts,
      selectedLayerId,
      pickaxeState,
      ownedPickaxes,
      currentThemeId,
      ownedThemes,
      currentSkinId,
      ownedSkins,
      buildGrid,
      myUsername,
      myFriendCode,
      friends,
      friendRewardClaimed,
      achievements: achievements.map(a => ({ id: a.id, unlocked: a.unlocked, rewardClaimed: a.rewardClaimed })),
      stats
    };

    const res = await saveUserData(currentUser.uid, payload);
    if (res.success) {
      const now = new Date().toISOString();
      setLastSavedTime(now);
      localStorage.setItem(`${STORAGE_KEY}_last_saved_time`, now);
    }
    return res;
  }, [
    currentUser,
    coins,
    inventory,
    layerMinedCounts,
    selectedLayerId,
    pickaxeState,
    ownedPickaxes,
    currentThemeId,
    ownedThemes,
    currentSkinId,
    ownedSkins,
    buildGrid,
    myUsername,
    myFriendCode,
    friends,
    friendRewardClaimed,
    achievements,
    stats
  ]);

  // Cloud Load Handler
  const handleCloudLoad = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser?.uid) {
      return { success: false, error: '請先登入 Firebase 帳號！' };
    }
    const res = await loadUserData(currentUser.uid);
    if (res.data) {
      const d = res.data;
      if (typeof d.coins === 'number') setCoins(d.coins);
      if (d.inventory) setInventory(d.inventory);
      if (d.layerMinedCounts) setLayerMinedCounts(d.layerMinedCounts);
      if (d.selectedLayerId) setSelectedLayerId(d.selectedLayerId);
      if (d.pickaxeState) setPickaxeState(d.pickaxeState);
      if (Array.isArray(d.ownedPickaxes)) setOwnedPickaxes(d.ownedPickaxes);
      if (d.currentThemeId) setCurrentThemeId(d.currentThemeId);
      if (Array.isArray(d.ownedThemes)) setOwnedThemes(d.ownedThemes);
      if (d.currentSkinId) setCurrentSkinId(d.currentSkinId);
      if (Array.isArray(d.ownedSkins)) setOwnedSkins(d.ownedSkins);
      if (Array.isArray(d.buildGrid)) setBuildGrid(d.buildGrid);
      if (d.myUsername) setMyUsername(d.myUsername);
      if (Array.isArray(d.friends)) setFriends(d.friends);
      if (typeof d.friendRewardClaimed === 'boolean') setFriendRewardClaimed(d.friendRewardClaimed);
      if (Array.isArray(d.achievements)) {
        setAchievements(prev =>
          prev.map(item => {
            const cloudAch = d.achievements.find((c: any) => c.id === item.id);
            return cloudAch
              ? { ...item, unlocked: cloudAch.unlocked, rewardClaimed: cloudAch.rewardClaimed }
              : item;
          })
        );
      }
      if (d.stats) setStats(d.stats);
      if (d.lastSavedLocalTime) {
        setLastSavedTime(d.lastSavedLocalTime);
        localStorage.setItem(`${STORAGE_KEY}_last_saved_time`, d.lastSavedLocalTime);
      }
      return { success: true };
    }
    return { success: false, error: res.error || '雲端尚無存檔記錄，請先執行一次雲端儲存！' };
  }, [currentUser]);

  // --- Sync to LocalStorage ---
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_coins`, JSON.stringify(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pickaxe`, JSON.stringify(pickaxeState));
  }, [pickaxeState]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_owned_picks`, JSON.stringify(ownedPickaxes));
  }, [ownedPickaxes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_theme`, JSON.stringify(currentThemeId));
  }, [currentThemeId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_owned_themes`, JSON.stringify(ownedThemes));
  }, [ownedThemes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_skin`, JSON.stringify(currentSkinId));
  }, [currentSkinId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_owned_skins`, JSON.stringify(ownedSkins));
  }, [ownedSkins]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_grid`, JSON.stringify(buildGrid));
  }, [buildGrid]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_username`, JSON.stringify(myUsername));
  }, [myUsername]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_friends`, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_friend_reward_claimed`, JSON.stringify(friendRewardClaimed));
  }, [friendRewardClaimed]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_stats`, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_layer_mined`, JSON.stringify(layerMinedCounts));
  }, [layerMinedCounts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_selected_layer`, JSON.stringify(selectedLayerId));
  }, [selectedLayerId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auto_miner`, JSON.stringify(hasAutoMiner));
  }, [hasAutoMiner]);

  // Haste buff countdown
  useEffect(() => {
    if (hasteRemainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setHasteRemainingSeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [hasteRemainingSeconds]);

  // Steam Auto-Miner Robot loop: mines 1 block every 3 seconds
  useEffect(() => {
    if (!hasAutoMiner) return;
    const interval = setInterval(() => {
      const targetLayer = STRATA_LAYERS.find(l => l.id === selectedLayerId) || STRATA_LAYERS[0];
      const layerBlocks = BLOCK_TYPES.filter(b => targetLayer.blockIds.includes(b.id));
      const fallback = layerBlocks.length > 0 ? layerBlocks : BLOCK_TYPES.slice(0, 3);
      const randomBlock = fallback[Math.floor(Math.random() * fallback.length)];

      setInventory(prev => ({
        ...prev,
        [randomBlock.id]: (prev[randomBlock.id] || 0) + 1
      }));
      setLayerMinedCounts(prev => ({
        ...prev,
        [selectedLayerId]: (prev[selectedLayerId] || 0) + 1
      }));
      setStats(prev => ({
        ...prev,
        totalBlocksMined: prev.totalBlocksMined + 1,
        blockTypeMinedCounts: {
          ...prev.blockTypeMinedCounts,
          [randomBlock.id]: (prev.blockTypeMinedCounts[randomBlock.id] || 0) + 1
        }
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [hasAutoMiner, selectedLayerId]);

  // Periodic timer for random market inflation
  useEffect(() => {
    const timer = window.setInterval(() => {
      setMarketInflationEvent(prev => {
        if (prev.remainingSeconds <= 1) {
          const randIdx = Math.floor(Math.random() * MARKET_INFLATION_TEMPLATES.length);
          const next = MARKET_INFLATION_TEMPLATES[randIdx];
          const duration = next.durationSeconds || Math.floor(45 + Math.random() * 45);
          if (next.multiplier > 1.2) {
            sound.playCoinSound();
          }
          return {
            ...next,
            remainingSeconds: duration
          };
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Unlock achievement helper
  const unlockAchievement = useCallback((achId: string) => {
    setAchievements(prev => {
      const ach = prev.find(a => a.id === achId);
      if (!ach || ach.unlocked) return prev;

      sound.playAchievementSound();
      const updated = prev.map(a => (a.id === achId ? { ...a, unlocked: true } : a));

      // Show toast
      setPopupAchievement(ach);
      setTimeout(() => setPopupAchievement(null), 3800);

      return updated;
    });
  }, []);

  // Check achievements against current state & stats across all 1000 achievements
  useEffect(() => {
    const newlyUnlockedIds: string[] = [];

    achievements.forEach(ach => {
      if (ach.unlocked) return;

      // 1. Mine total blocks: mine_total_{X}
      if (ach.id.startsWith('mine_total_')) {
        const target = parseInt(ach.id.replace('mine_total_', ''), 10);
        if (!isNaN(target) && stats.totalBlocksMined >= target) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 2. Click milestones: click_milestone_{X}
      else if (ach.id.startsWith('click_milestone_')) {
        const idx = parseInt(ach.id.replace('click_milestone_', ''), 10);
        if (!isNaN(idx) && stats.totalClicks >= idx * 250) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 3. Strata layer milestones: layer_{layerId}_{target}
      else if (ach.id.startsWith('layer_')) {
        const parts = ach.id.split('_');
        const target = parseInt(parts[parts.length - 1], 10);
        const layerId = parts.slice(1, parts.length - 1).join('_');
        if (!isNaN(target) && (layerMinedCounts[layerId] || 0) >= target) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 4. Cumulative revenue: coin_earned_{target}
      else if (ach.id.startsWith('coin_earned_')) {
        const target = parseInt(ach.id.replace('coin_earned_', ''), 10);
        if (!isNaN(target) && stats.totalCoinsEarned >= target) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 5. Wallet holdings: wallet_tier_{idx}
      else if (ach.id.startsWith('wallet_tier_')) {
        const idx = parseInt(ach.id.replace('wallet_tier_', ''), 10);
        if (!isNaN(idx) && coins >= idx * 2000) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 6. Blocks sold: sold_blocks_{target}
      else if (ach.id.startsWith('sold_blocks_')) {
        const target = parseInt(ach.id.replace('sold_blocks_', ''), 10);
        if (!isNaN(target) && stats.totalBlocksSold >= target) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 7. Inflation trading: inflation_trader_{idx}
      else if (ach.id.startsWith('inflation_trader_')) {
        const idx = parseInt(ach.id.replace('inflation_trader_', ''), 10);
        if (!isNaN(idx) && (stats.blocksSoldDuringInflation || 0) >= idx * 50) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 8. Building placed: build_placed_{idx}
      else if (ach.id.startsWith('build_placed_')) {
        const idx = parseInt(ach.id.replace('build_placed_', ''), 10);
        if (!isNaN(idx) && stats.totalBlocksPlaced >= idx * 20) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 9. Equipment mastery: equip_mastery_{idx}
      else if (ach.id.startsWith('equip_mastery_')) {
        const idx = parseInt(ach.id.replace('equip_mastery_', ''), 10);
        const equipScore = ownedPickaxes.length * 5 + pickaxeState.efficiencyLevel + pickaxeState.unbreakingLevel + pickaxeState.fortuneLevel;
        if (!isNaN(idx) && equipScore >= idx) {
          newlyUnlockedIds.push(ach.id);
        }
      }
      // 10. Collection and social: collection_social_{idx}
      else if (ach.id.startsWith('collection_social_')) {
        const idx = parseInt(ach.id.replace('collection_social_', ''), 10);
        const colScore = ownedThemes.length * 3 + ownedSkins.length * 3 + friends.length * 5;
        if (!isNaN(idx) && colScore >= idx) {
          newlyUnlockedIds.push(ach.id);
        }
      }
    });

    if (newlyUnlockedIds.length > 0) {
      newlyUnlockedIds.forEach(id => unlockAchievement(id));
    }
  }, [
    coins,
    stats,
    ownedPickaxes,
    pickaxeState,
    buildGrid,
    friends,
    friendRewardClaimed,
    ownedThemes,
    ownedSkins,
    layerMinedCounts,
    achievements,
    unlockAchievement
  ]);

  // --- Handlers: Mining ---
  const handleMineSuccess = useCallback((minedBlock: BlockType, amount: number, layerId?: string) => {
    setInventory(prev => ({
      ...prev,
      [minedBlock.id]: (prev[minedBlock.id] || 0) + amount
    }));

    if (layerId) {
      setLayerMinedCounts(prev => {
        const current = prev[layerId] || 0;
        const next = current + amount;

        // Check if 50,000 threshold reached to unlock next layer
        if (current < 50000 && next >= 50000) {
          sound.playAchievementSound();
          const currentLayerIdx = STRATA_LAYERS.findIndex(l => l.id === layerId);
          const nextLayerObj = STRATA_LAYERS[currentLayerIdx + 1];
          if (nextLayerObj) {
            setLayerUnlockToast(`🎉 恭喜！您已在該層挖掘突破 50,000 格！【${nextLayerObj.nameZh}】已正式解鎖！`);
            setTimeout(() => setLayerUnlockToast(null), 5500);
          }
        }

        return {
          ...prev,
          [layerId]: next
        };
      });
    }

    setStats(prev => {
      const currentB = prev.blockTypeMinedCounts[minedBlock.id] || 0;
      return {
        ...prev,
        totalClicks: prev.totalClicks + 1,
        totalBlocksMined: prev.totalBlocksMined + amount,
        blockTypeMinedCounts: {
          ...prev.blockTypeMinedCounts,
          [minedBlock.id]: currentB + amount
        }
      };
    });
  }, []);

  const handleDurabilityLoss = useCallback(() => {
    const currentPick = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];
    if (currentPick.tier === 0) return; // Bare hands don't lose durability

    // Unbreaking chance reduction
    const unbChance = pickaxeState.unbreakingLevel * 0.10;
    if (Math.random() < unbChance) return; // Saved!

    setPickaxeState(prev => {
      const newDura = prev.currentDurability - 1;
      if (newDura <= 0) {
        sound.playToolBreakSound();
        unlockAchievement('pick_break_recovery');
        return {
          ...prev,
          currentTierId: 'bare_hand',
          currentDurability: 999999,
          isBroken: true
        };
      }
      return {
        ...prev,
        currentDurability: newDura
      };
    });
  }, [pickaxeState.currentTierId, pickaxeState.unbreakingLevel, unlockAchievement]);

  // --- Handlers: Building Zone ---
  const handlePlaceBlock = useCallback((index: number) => {
    const count = inventory[selectedBlockId] || 0;
    if (count <= 0) return;

    // Deduct from inventory
    setInventory(prev => ({
      ...prev,
      [selectedBlockId]: prev[selectedBlockId] - 1
    }));

    // Place on grid
    setBuildGrid(prev => {
      const updated = [...prev];
      updated[index] = selectedBlockId;
      return updated;
    });

    setStats(prev => ({
      ...prev,
      totalBlocksPlaced: prev.totalBlocksPlaced + 1
    }));
  }, [inventory, selectedBlockId]);

  const handleReclaimBlock = useCallback((index: number) => {
    const blockId = buildGrid[index];
    if (!blockId) return;

    // Return to inventory
    setInventory(prev => ({
      ...prev,
      [blockId]: (prev[blockId] || 0) + 1
    }));

    // Remove from grid
    setBuildGrid(prev => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });

    unlockAchievement('build_reclaim_1');
  }, [buildGrid, unlockAchievement]);

  const handleClearAllBlocks = useCallback(() => {
    sound.playClickSound();

    // Sum all blocks on grid
    const countsToAdd: Record<string, number> = {};
    buildGrid.forEach(bId => {
      if (bId) {
        countsToAdd[bId] = (countsToAdd[bId] || 0) + 1;
      }
    });

    if (Object.keys(countsToAdd).length === 0) return;

    setInventory(prev => {
      const updated = { ...prev };
      Object.entries(countsToAdd).forEach(([bId, qty]) => {
        updated[bId] = (updated[bId] || 0) + qty;
      });
      return updated;
    });

    setBuildGrid(Array(100).fill(null));
    unlockAchievement('build_clear_all');
  }, [buildGrid, unlockAchievement]);

  // Presets for building
  const handleLoadPreset = useCallback((presetName: string) => {
    sound.playAchievementSound();
    const newGrid = Array(100).fill(null);

    if (presetName === 'creeper') {
      // 10x10 Creeper face
      // Rows 0-9, Cols 0-9
      const creeperMask = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,1,1,0,0,1,0],
        [0,1,0,0,1,1,0,0,1,0],
        [0,1,1,1,0,0,1,1,1,0],
        [0,1,1,0,0,0,0,1,1,0],
        [0,1,1,0,0,0,0,1,1,0],
        [0,1,1,0,1,1,0,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0]
      ];
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const idx = r * 10 + c;
          if (creeperMask[r][c] === 1) newGrid[idx] = 'emerald_ore';
          else if (r >= 1 && r <= 8 && c >= 1 && c <= 8) newGrid[idx] = 'coal_ore';
        }
      }
    } else if (presetName === 'heart') {
      const heartIdxs = [
        12, 13, 16, 17,
        21, 22, 23, 24, 25, 26, 27, 28,
        31, 32, 33, 34, 35, 36, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48,
        52, 53, 54, 55, 56, 57,
        63, 64, 65, 66,
        74, 75
      ];
      heartIdxs.forEach(i => {
        newGrid[i] = 'redstone_ore';
      });
    } else if (presetName === 'sword') {
      const swordIdxs = [
        9, 18, 27, 36, 45, 54,
        63, 64, 72, 73, 81, 90
      ];
      swordIdxs.forEach((idx, step) => {
        newGrid[idx] = step > 7 ? 'wood' : 'diamond_ore';
      });
    }

    setBuildGrid(newGrid);
  }, []);

  // --- Handlers: Market Selling ---
  const handleSellBlock = useCallback((blockId: string, amount: number, customUnitPrice?: number) => {
    const block = BLOCK_TYPES.find(b => b.id === blockId);
    if (!block) return;
    const count = inventory[blockId] || 0;
    const realAmount = Math.min(count, amount);
    if (realAmount <= 0) return;

    const unitPrice = typeof customUnitPrice === 'number' ? customUnitPrice : block.sellPrice;
    const earned = Math.round(realAmount * unitPrice);
    const isInflationTrade = marketInflationEvent.multiplier > 1.05;

    setInventory(prev => ({
      ...prev,
      [blockId]: prev[blockId] - realAmount
    }));

    setCoins(prev => prev + earned);

    setStats(prev => ({
      ...prev,
      totalCoinsEarned: prev.totalCoinsEarned + earned,
      totalBlocksSold: prev.totalBlocksSold + realAmount,
      blocksSoldDuringInflation: prev.blocksSoldDuringInflation + (isInflationTrade ? realAmount : 0)
    }));

    if (blockId === 'diamond_ore' || blockId === 'deepslate_diamond') {
      unlockAchievement('sell_diamond_single');
    }
    if (blockId === 'emerald_ore') unlockAchievement('sell_emerald_single');
    if (blockId === 'ancient_debris') unlockAchievement('sell_ancient_debris');
    if (blockId === 'dirt' && realAmount >= 50) unlockAchievement('sell_dirt_50');
    if (blockId === 'cobblestone' && realAmount >= 50) unlockAchievement('sell_cobble_50');
    if (earned >= 500) unlockAchievement('sell_single_trade_500');
    if (earned >= 1500) unlockAchievement('sell_single_trade_1500');
  }, [inventory, marketInflationEvent.multiplier, unlockAchievement]);

  const handleSellAll = useCallback((customTotalEarned?: number) => {
    let totalEarned = 0;
    let totalSold = 0;
    const newInv = { ...inventory };

    BLOCK_TYPES.forEach(block => {
      const qty = newInv[block.id] || 0;
      if (qty > 0) {
        totalEarned += qty * block.sellPrice;
        totalSold += qty;
        newInv[block.id] = 0;
      }
    });

    const finalEarned = typeof customTotalEarned === 'number' ? customTotalEarned : totalEarned;
    if (finalEarned <= 0 && totalSold <= 0) return;

    const isInflationTrade = marketInflationEvent.multiplier > 1.05;

    setInventory(newInv);
    setCoins(prev => prev + finalEarned);
    setStats(prev => ({
      ...prev,
      totalCoinsEarned: prev.totalCoinsEarned + finalEarned,
      totalBlocksSold: prev.totalBlocksSold + totalSold,
      blocksSoldDuringInflation: prev.blocksSoldDuringInflation + (isInflationTrade ? totalSold : 0)
    }));

    unlockAchievement('quick_sell_all');
    if (finalEarned >= 500) unlockAchievement('sell_single_trade_500');
    if (finalEarned >= 1500) unlockAchievement('sell_single_trade_1500');
  }, [inventory, marketInflationEvent.multiplier, unlockAchievement]);

  // --- Handlers: Shop Purchases & Upgrades ---
  const handleBuyPickaxe = useCallback((tierId: string, cost: number) => {
    if (coins < cost) return;
    const targetPick = PICKAXE_TIERS.find(p => p.id === tierId);
    if (!targetPick) return;

    setCoins(prev => prev - cost);
    setOwnedPickaxes(prev => (prev.includes(tierId) ? prev : [...prev, tierId]));
    setPickaxeState(prev => ({
      ...prev,
      currentTierId: tierId,
      currentDurability: targetPick.maxDurability,
      isBroken: false
    }));
  }, [coins]);

  const handleEquipPickaxe = useCallback((tierId: string) => {
    const targetPick = PICKAXE_TIERS.find(p => p.id === tierId);
    if (!targetPick) return;

    setPickaxeState(prev => ({
      ...prev,
      currentTierId: tierId,
      currentDurability: targetPick.tier === 0 ? 999999 : targetPick.maxDurability,
      isBroken: false
    }));
  }, []);

  const handleRepairPickaxe = useCallback((cost: number) => {
    if (coins < cost) return;
    const currentPick = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];
    if (currentPick.tier === 0) return;

    setCoins(prev => prev - cost);
    setPickaxeState(prev => ({
      ...prev,
      currentDurability: currentPick.maxDurability,
      isBroken: false
    }));

    unlockAchievement('repair_pick_1');
  }, [coins, pickaxeState.currentTierId, unlockAchievement]);

  const handleUpgradePickaxe = useCallback((type: 'efficiency' | 'unbreaking' | 'fortune', cost: number) => {
    if (coins < cost) return;
    setCoins(prev => prev - cost);

    setPickaxeState(prev => {
      if (type === 'efficiency') return { ...prev, efficiencyLevel: prev.efficiencyLevel + 1 };
      if (type === 'unbreaking') return { ...prev, unbreakingLevel: prev.unbreakingLevel + 1 };
      if (type === 'fortune') return { ...prev, fortuneLevel: prev.fortuneLevel + 1 };
      return prev;
    });
  }, [coins]);

  const handleBuyTheme = useCallback((theme: ThemeBackground) => {
    if (coins < theme.cost) return;
    setCoins(prev => prev - theme.cost);
    setOwnedThemes(prev => (prev.includes(theme.id) ? prev : [...prev, theme.id]));
    setCurrentThemeId(theme.id);
  }, [coins]);

  const handleBuySkin = useCallback((skin: PlayerSkin) => {
    if (coins < skin.cost) return;
    setCoins(prev => prev - skin.cost);
    setOwnedSkins(prev => (prev.includes(skin.id) ? prev : [...prev, skin.id]));
    setCurrentSkinId(skin.id);
  }, [coins]);

  // --- Handlers: Consumable Supplies & Artifacts ---
  const handleBuySupply = useCallback((supply: ShopSupplyItem) => {
    if (coins < supply.cost) return;

    if (supply.type === 'repair_oil') {
      const currentPick = PICKAXE_TIERS.find(p => p.id === pickaxeState.currentTierId) || PICKAXE_TIERS[0];
      setCoins(prev => prev - supply.cost);
      setPickaxeState(prev => ({
        ...prev,
        currentDurability: currentPick.tier === 0 ? 999999 : currentPick.maxDurability,
        isBroken: false
      }));
      sound.playUpgradeSound();
      setSupplyToastMsg(`🛢️ 萬能合金修復油已生效！【${currentPick.nameZh}】耐久度完全回滿！`);
      setTimeout(() => setSupplyToastMsg(null), 4000);
    } else if (supply.type === 'haste_drink') {
      setCoins(prev => prev - supply.cost);
      setHasteRemainingSeconds(prev => prev + 60);
      sound.playCoinSound();
      setSupplyToastMsg('⚡ 急迫採礦能量飲料生效！60 秒內採礦時間縮減 50%，開採速度翻倍！');
      setTimeout(() => setSupplyToastMsg(null), 4000);
    } else if (supply.type === 'tnt_blast') {
      setCoins(prev => prev - supply.cost);
      const targetLayer = STRATA_LAYERS.find(l => l.id === selectedLayerId) || STRATA_LAYERS[0];
      const layerBlocks = BLOCK_TYPES.filter(b => targetLayer.blockIds.includes(b.id));
      const fallback = layerBlocks.length > 0 ? layerBlocks : BLOCK_TYPES.slice(0, 3);
      const harvested: Record<string, number> = {};
      for (let i = 0; i < 30; i++) {
        const randomBlock = fallback[Math.floor(Math.random() * fallback.length)];
        harvested[randomBlock.id] = (harvested[randomBlock.id] || 0) + 1;
      }
      setInventory(prev => {
        const next = { ...prev };
        Object.entries(harvested).forEach(([bId, count]) => {
          next[bId] = (next[bId] || 0) + count;
        });
        return next;
      });
      setLayerMinedCounts(prev => ({
        ...prev,
        [selectedLayerId]: (prev[selectedLayerId] || 0) + 30
      }));
      setStats(prev => ({
        ...prev,
        totalBlocksMined: prev.totalBlocksMined + 30
      }));
      sound.playExplosionSound();
      setSupplyToastMsg(`🧨 連鎖採礦 TNT 炸藥包引爆！已瞬間開採 30 塊【${targetLayer.nameZh}】方塊並入庫！`);
      setTimeout(() => setSupplyToastMsg(null), 4500);
    } else if (supply.type === 'fortune_bag') {
      setCoins(prev => prev - supply.cost);
      const bonusReward = Math.floor(Math.random() * 1501) + 1000; // 1,000 ~ 2,500
      setCoins(prev => prev + bonusReward);
      sound.playPouchOpenSound();
      setSupplyToastMsg(`🍀 招財貓幸運金幣福袋開啟！恭喜獲得 +${bonusReward.toLocaleString()} 遊戲幣！`);
      setTimeout(() => setSupplyToastMsg(null), 4500);
    } else if (supply.type === 'auto_miner') {
      if (hasAutoMiner) return;
      setCoins(prev => prev - supply.cost);
      setHasAutoMiner(true);
      try {
        localStorage.setItem(`${STORAGE_KEY}_auto_miner`, JSON.stringify(true));
      } catch {}
      sound.playUpgradeSound();
      setSupplyToastMsg('🤖 蒸氣紅石自動採礦魔像已啟動！每 3 秒自動為您在當前層級開採 1 個方塊！');
      setTimeout(() => setSupplyToastMsg(null), 5000);
    }
  }, [coins, pickaxeState.currentTierId, selectedLayerId, hasAutoMiner]);

  // --- Handlers: Red Reset Progress (選單紅色重製進度) ---
  const handleResetProgress = useCallback(() => {
    // 1. Reset coins & starter inventory
    setCoins(50);
    setInventory({
      dirt: 15,
      wood: 8,
      cobblestone: 10,
      coal_ore: 2,
      copper_ore: 0,
      iron_ore: 0,
      gold_ore: 0,
      redstone_ore: 0,
      lapis_ore: 0,
      diamond_ore: 0,
      emerald_ore: 0,
      deepslate_diamond: 0,
      netherrack: 0,
      glowstone: 0,
      end_stone: 0,
      purpur: 0,
      obsidian: 0,
      ancient_debris: 0
    });

    // 2. Reset pickaxes & state
    setPickaxeState({
      currentTierId: 'bare_hand',
      currentDurability: 999999,
      efficiencyLevel: 0,
      unbreakingLevel: 0,
      fortuneLevel: 0,
      isBroken: false
    });
    setOwnedPickaxes(['bare_hand']);

    // 3. Reset theme & skin
    setCurrentThemeId('overworld');
    setOwnedThemes(['overworld']);
    setCurrentSkinId('steve');
    setOwnedSkins(['steve']);

    // 4. Reset building canvas
    setBuildGrid(Array(100).fill(null));

    // 5. Reset strata layers progression
    setLayerMinedCounts({
      surface: 0,
      shallow: 0,
      crystalline: 0,
      deepslate_abyss: 0,
      nether_core: 0,
      end_void: 0,
      deep_dark: 0,
      aether_celestial: 0
    });
    setSelectedLayerId('surface');

    // 6. Reset all 1,000 achievements
    setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, rewardClaimed: false })));

    // 7. Reset stats
    setStats({
      totalClicks: 0,
      totalBlocksMined: 0,
      totalCoinsEarned: 0,
      totalBlocksPlaced: 0,
      totalBlocksSold: 0,
      blocksSoldDuringInflation: 0,
      blockTypeMinedCounts: {}
    });

    // 8. Reset supplies and buffs
    setHasAutoMiner(false);
    setHasteRemainingSeconds(0);

    // 9. Clear all game localStorage keys
    const keysToRemove = [
      `${STORAGE_KEY}_coins`,
      `${STORAGE_KEY}_inventory`,
      `${STORAGE_KEY}_pickaxe`,
      `${STORAGE_KEY}_owned_picks`,
      `${STORAGE_KEY}_theme`,
      `${STORAGE_KEY}_owned_themes`,
      `${STORAGE_KEY}_skin`,
      `${STORAGE_KEY}_owned_skins`,
      `${STORAGE_KEY}_grid`,
      `${STORAGE_KEY}_achievements`,
      `${STORAGE_KEY}_layer_mined`,
      `${STORAGE_KEY}_selected_layer`,
      `${STORAGE_KEY}_stats`,
      `${STORAGE_KEY}_auto_miner`
    ];
    keysToRemove.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    sound.playExplosionSound();
    setSupplyToastMsg('⚠️ 所有遊戲進度已徹底重置為初始狀態！');
    setTimeout(() => setSupplyToastMsg(null), 6000);
  }, []);

  // --- Handlers: Friends ---
  const handleClaimFriendReward = useCallback(() => {
    if (friends.length < 1 || friendRewardClaimed) return;
    setCoins(prev => prev + 100);
    setFriendRewardClaimed(true);
    unlockAchievement('social_friend_reward_claim');
  }, [friends.length, friendRewardClaimed, unlockAchievement]);

  const handleAddFriendByCode = useCallback((code: string) => {
    if (friends.some(f => f.code === code)) return false;

    // Add friend
    const newFriend: Friend = {
      code,
      username: `Player_${code.slice(0, 4)}`,
      isOnline: Math.random() < 0.8,
      addedAt: Date.now(),
      level: Math.floor(Math.random() * 20) + 1
    };

    setFriends(prev => [...prev, newFriend]);
    return true;
  }, [friends]);

  // --- Handlers: Achievements ---
  const handleClaimAchReward = useCallback((achId: string) => {
    setAchievements(prev => {
      const ach = prev.find(a => a.id === achId);
      if (!ach || !ach.unlocked || ach.rewardClaimed || ach.coinReward <= 0) return prev;

      setCoins(c => c + ach.coinReward);
      return prev.map(a => (a.id === achId ? { ...a, rewardClaimed: true } : a));
    });
  }, []);

  const handleClaimAllAchRewards = useCallback(() => {
    let total = 0;
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.unlocked && a.coinReward > 0 && !a.rewardClaimed) {
          total += a.coinReward;
          return { ...a, rewardClaimed: true };
        }
        return a;
      });
      return updated;
    });

    if (total > 0) {
      setCoins(c => c + total);
    }
  }, []);

  // Theme styling
  const activeTheme = useMemo(() => {
    return THEME_BACKGROUNDS.find(t => t.id === currentThemeId) || THEME_BACKGROUNDS[0];
  }, [currentThemeId]);

  const activeSkin = useMemo(() => {
    return PLAYER_SKINS.find(s => s.id === currentSkinId) || PLAYER_SKINS[0];
  }, [currentSkinId]);

  return (
    <div
      className={`min-h-screen ${activeTheme.bgCss} text-white transition-colors duration-500 pb-28 select-none relative font-sans`}
      style={{
        backgroundImage: `
          linear-gradient(45deg, rgba(0,0,0,0.4) 25%, transparent 25%), 
          linear-gradient(-45deg, rgba(0,0,0,0.4) 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.4) 75%), 
          linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.4) 75%)
        `,
        backgroundSize: '24px 24px'
      }}
    >
      {/* Top Header Navigation */}
      <header className="border-b-4 border-black bg-zinc-950/95 shadow-md backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Menu Trigger & Logo & Author Credit */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsMenuOpen(true);
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs sm:text-sm rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#78350f,inset_2px_2px_0_#fde047] active:scale-95 flex items-center gap-1.5 font-minecraft tracking-wider"
              title="開啟遊戲主選單"
            >
              <Menu className="w-4 h-4" />
              <span>主選單</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">{activeSkin.avatarEmoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-amber-300 drop-shadow-[2px_2px_0_#000] tracking-wide font-minecraft">
                    MINECRAFT 挖掘場與建築工坊
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="text-emerald-400 font-bold">{myUsername}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="font-mono text-zinc-400">#{myFriendCode}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-cyan-400">{activeTheme.nameZh}</span>
                </div>
              </div>
            </div>

            {/* Author Clickable Link */}
            <a
              href="https://github.com/PizzaCowMC"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClickSound()}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#1a2e22] hover:bg-[#223d2d] border-2 border-emerald-500/60 rounded-lg text-emerald-300 text-xs font-bold transition-all shadow active:scale-95 group ml-1"
              title="造訪 PizzaCowMC GitHub"
            >
              <Github className="w-3.5 h-3.5 text-emerald-400" />
              <span>By PizzaCowMC</span>
              <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Center: View Switcher */}
          <div className="hidden md:flex items-center bg-black/60 p-1 border-2 border-black rounded-lg text-xs font-bold">
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveView('all');
              }}
              className={`px-3 py-1 rounded transition-all ${
                activeView === 'all'
                  ? 'bg-zinc-800 text-amber-300 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              全部顯示
            </button>
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveView('quarry');
              }}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-all ${
                activeView === 'quarry'
                  ? 'bg-amber-900/60 text-amber-300 border border-amber-600/50 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
              <span>⛏️ 挖掘場</span>
            </button>
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveView('building');
              }}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-all ${
                activeView === 'building'
                  ? 'bg-blue-900/60 text-blue-300 border border-blue-600/50 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-blue-400" />
              <span>🧱 100格建築</span>
            </button>
          </div>

          {/* Right: Actions, Modals & Cloud State */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Coin Balance Pill */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsMarketOpen(true);
              }}
              title="點擊前往方塊交易所出售庫存"
              className="px-2.5 sm:px-3 py-1.5 bg-black/80 hover:bg-black text-amber-300 border-2 border-amber-400 rounded-lg font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 transition-transform active:scale-95 shadow-[inset_1px_1px_0_#fde047]"
            >
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{coins.toLocaleString()} 幣</span>
            </button>

            {/* Market Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsMarketOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-emerald-100 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#34d399] active:scale-95 flex items-center gap-1"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>賣方塊</span>
            </button>

            {/* Shop Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setShopInitialTab('pickaxes');
                setIsShopOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-amber-100 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#78350f,inset_2px_2px_0_#fde047] active:scale-95 flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>商店</span>
            </button>

            {/* Achievements Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsAchievementsOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-purple-200 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#3b0764,inset_2px_2px_0_#c084fc] active:scale-95 flex items-center gap-1"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>成就</span>
            </button>

            {/* Friends Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsFriendsOpen(true);
              }}
              className="relative px-2.5 sm:px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-blue-100 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#1e3a8a,inset_2px_2px_0_#60a5fa] active:scale-95 flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>好友</span>
              {friends.length >= 1 && !friendRewardClaimed && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Firebase Auth & Cloud Sync Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsAuthOpen(true);
              }}
              title="Firebase 帳號登入與雲端存檔"
              className={`px-2.5 sm:px-3 py-1.5 font-black text-xs rounded-lg border-2 border-black active:scale-95 flex items-center gap-1.5 transition-all ${
                currentUser
                  ? 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-500 shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#34d399]'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              <Cloud className={`w-3.5 h-3.5 ${currentUser ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{currentUser ? '雲端已連線' : 'Firebase'}</span>
              {currentUser && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </button>

            {/* Changelog Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsChangelogOpen(true);
              }}
              title="查看版本更新日誌"
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-2 border-black rounded-lg active:scale-95"
            >
              <Scroll className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                sound.setSoundEnabled(next);
                if (next) sound.playClickSound();
              }}
              title={soundEnabled ? '關閉音效' : '開啟音效'}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded-lg active:scale-95"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Cloud Toast Notification */}
      {cloudToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-emerald-950/90 border-2 border-emerald-500 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold text-emerald-200 animate-in fade-in slide-in-from-top-2">
          <Cloud className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>{cloudToast}</span>
        </div>
      )}

      {/* Layer Unlock Toast Notification */}
      {layerUnlockToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black rounded-xl border-4 border-black shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-2xl">🏆</span>
          <span className="text-sm drop-shadow">{layerUnlockToast}</span>
        </div>
      )}

      {/* Supply & Reset Notification Toast */}
      {supplyToastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-zinc-950/95 border-3 border-amber-400 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_1px_1px_0_#fde047] flex items-center gap-3 text-amber-300 font-bold text-xs sm:text-sm animate-bounce max-w-md text-center">
          <span>{supplyToastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Dynamic Real-time Market Inflation Ticker Bar */}
        <div className="p-3 bg-zinc-950/90 border-3 border-black rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-[inset_2px_2px_0_#333]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border-2 border-black flex items-center justify-center ${
              marketInflationEvent.multiplier > 1.2
                ? 'bg-red-500/20 text-red-400 animate-pulse border-red-500/50'
                : marketInflationEvent.multiplier < 1.0
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {marketInflationEvent.multiplier > 1.2 ? (
                <Flame className="w-4 h-4 text-red-400 animate-bounce" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400">市場即時通膨動態：</span>
                <strong className="text-xs sm:text-sm font-black text-amber-300 tracking-wide font-minecraft">
                  {marketInflationEvent.title}
                </strong>
                <span className={`px-2 py-0.5 rounded text-[11px] font-black border border-black ${
                  marketInflationEvent.multiplier >= 1.0
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-blue-950 text-blue-300 border-blue-600'
                }`}>
                  {marketInflationEvent.multiplier >= 1.0
                    ? `+${Math.round((marketInflationEvent.multiplier - 1) * 100)}% 通膨增益`
                    : `${Math.round((marketInflationEvent.multiplier - 1) * 100)}% 市場緊縮`}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                {marketInflationEvent.description} • 剩餘週期：<strong className="text-amber-400 font-mono">{marketInflationEvent.remainingSeconds}</strong> 秒
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClickSound();
              setIsMarketOpen(true);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#34d399] active:scale-95 flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>前往交易所拋售</span>
          </button>
        </div>

        {/* 1-Friend 100-Coin Milestone Alert (if available to claim) */}
        {friends.length >= 1 && !friendRewardClaimed && (
          <div className="p-3 bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-3 border-amber-500 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-200 font-bold">
              <span className="text-xl">🎁</span>
              <span>
                達成 1 位好友里程碑！恭喜解鎖 <strong className="text-amber-300 font-black">100 遊戲幣</strong> 專屬獎勵！
              </span>
            </div>
            <button
              onClick={() => {
                sound.playAchievementSound();
                handleClaimFriendReward();
              }}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded border-2 border-black shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 cursor-pointer whitespace-nowrap"
            >
              立即領取 100 幣
            </button>
          </div>
        )}

        {/* SECTION 1: 挖掘場 (Quarry Field) */}
        {(activeView === 'all' || activeView === 'quarry') && (
          <QuarryMining
            pickaxeState={pickaxeState}
            inventory={inventory}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            layerMinedCounts={layerMinedCounts}
            onMineSuccess={handleMineSuccess}
            onDurabilityLoss={handleDurabilityLoss}
            onOpenShopToPickaxes={() => {
              sound.playClickSound();
              setShopInitialTab('pickaxes');
              setIsShopOpen(true);
            }}
            totalBlocksMined={stats.totalBlocksMined}
            hasteRemainingSeconds={hasteRemainingSeconds}
            hasAutoMiner={hasAutoMiner}
          />
        )}

        {/* SECTION 2: 100 格建築創作區 (Building Zone) */}
        {(activeView === 'all' || activeView === 'building') && (
          <BuildingZone
            grid={buildGrid}
            inventory={inventory}
            selectedBlockId={selectedBlockId}
            onPlaceBlock={handlePlaceBlock}
            onReclaimBlock={handleReclaimBlock}
            onClearAll={handleClearAllBlocks}
            onLoadPreset={handleLoadPreset}
          />
        )}
      </main>

      {/* Footer with PizzaCowMC link and status */}
      <footer className="max-w-6xl mx-auto px-4 mt-12 mb-16 pt-6 border-t-2 border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-base">🎮</span>
          <span className="font-bold text-zinc-300">MINECRAFT 挖掘場與建築工坊</span>
          <span className="text-zinc-600">|</span>
          <button
            onClick={() => {
              sound.playClickSound();
              setIsChangelogOpen(true);
            }}
            className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
          >
            <span>v1.2.0 (更新日誌)</span>
          </button>
        </div>

        {/* Prominent PizzaCowMC GitHub Credit */}
        <div className="flex items-center gap-2">
          <span>專案由</span>
          <a
            href="https://github.com/PizzaCowMC"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClickSound()}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 rounded text-emerald-300 font-bold hover:text-emerald-200 transition-all"
          >
            <Github className="w-3.5 h-3.5 text-emerald-400" />
            <span>By PizzaCowMC</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
          <span>開源打造</span>
        </div>
      </footer>

      {/* SECTION 3: Fixed Bottom Hotbar */}
      <Hotbar
        inventory={inventory}
        selectedBlockId={selectedBlockId}
        onSelectBlock={setSelectedBlockId}
        pickaxeState={pickaxeState}
        coins={coins}
        onOpenMarket={() => {
          sound.playClickSound();
          setIsMarketOpen(true);
        }}
        onOpenShop={() => {
          sound.playClickSound();
          setShopInitialTab('pickaxes');
          setIsShopOpen(true);
        }}
      />

      {/* POPUP: Achievement Unlocked Toast Notification */}
      {popupAchievement && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-zinc-950 border-4 border-black rounded-lg shadow-[inset_-3px_-3px_0_#111,inset_3px_3px_0_#4ade80,0_10px_25px_rgba(0,0,0,0.9)] max-w-sm flex items-center gap-3 animate-slide-in">
          <div className="text-3xl p-2 bg-amber-500/20 border-2 border-amber-400 rounded">
            {popupAchievement.icon}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              成就已解鎖 Achievement!
            </div>
            <div className="font-black text-amber-300 text-sm">{popupAchievement.nameZh}</div>
            <div className="text-xs text-zinc-300 line-clamp-1">{popupAchievement.descZh}</div>
            {popupAchievement.coinReward > 0 && (
              <div className="text-[11px] font-mono text-yellow-400 font-bold mt-0.5">
                獎勵：+{popupAchievement.coinReward} 遊戲幣 (前往成就頁領取)
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN GAME MENU MODAL */}
      <GameMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeView === 'building' ? 'building' : 'quarry'}
        onSelectTab={(tab) => setActiveView(tab)}
        onOpenMarket={() => setIsMarketOpen(true)}
        onOpenShop={() => {
          setShopInitialTab('pickaxes');
          setIsShopOpen(true);
        }}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenFriends={() => setIsFriendsOpen(true)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          sound.setSoundEnabled(next);
          if (next) sound.playClickSound();
        }}
        onResetProgress={handleResetProgress}
      />

      {/* CHANGELOG MODAL */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />

      {/* FIREBASE AUTH & CLOUD SAVE MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onCloudSave={handleCloudSave}
        onCloudLoad={handleCloudLoad}
        lastSavedTime={lastSavedTime}
        onUserLoggedOut={() => {
          setCurrentUser(null);
          setCloudToast('已登出帳號');
          setTimeout(() => setCloudToast(null), 3000);
        }}
        onUserLoggedIn={() => {
          setCloudToast('🎉 登入成功！');
          setTimeout(() => setCloudToast(null), 3000);
        }}
      />

      {/* MARKET MODAL */}
      <MarketModal
        isOpen={isMarketOpen}
        onClose={() => setIsMarketOpen(false)}
        inventory={inventory}
        coins={coins}
        inflationEvent={marketInflationEvent}
        onSellBlock={handleSellBlock}
        onSellAll={handleSellAll}
      />

      {/* SHOP MODAL */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={coins}
        pickaxeState={pickaxeState}
        ownedPickaxes={ownedPickaxes}
        ownedThemes={ownedThemes}
        currentThemeId={currentThemeId}
        ownedSkins={ownedSkins}
        currentSkinId={currentSkinId}
        onBuyPickaxe={handleBuyPickaxe}
        onEquipPickaxe={handleEquipPickaxe}
        onRepairPickaxe={handleRepairPickaxe}
        onUpgradePickaxe={handleUpgradePickaxe}
        onBuyTheme={handleBuyTheme}
        onEquipTheme={setCurrentThemeId}
        onBuySkin={handleBuySkin}
        onEquipSkin={setCurrentSkinId}
        initialTab={shopInitialTab}
        onBuySupply={handleBuySupply}
        hasAutoMiner={hasAutoMiner}
        hasteRemainingSeconds={hasteRemainingSeconds}
      />

      {/* FRIENDS MODAL */}
      <FriendsModal
        isOpen={isFriendsOpen}
        onClose={() => setIsFriendsOpen(false)}
        myUsername={myUsername}
        myFriendCode={myFriendCode}
        friends={friends}
        friendRewardClaimed={friendRewardClaimed}
        onClaimFriendReward={handleClaimFriendReward}
        onAddFriendByCode={handleAddFriendByCode}
        onUpdateUsername={setMyUsername}
      />

      {/* ACHIEVEMENTS MODAL */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
        onClaimReward={handleClaimAchReward}
        onClaimAllRewards={handleClaimAllAchRewards}
      />
    </div>
  );
}
