import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BLOCK_TYPES, PICKAXE_TIERS, THEME_BACKGROUNDS, PLAYER_SKINS, STRATA_LAYERS, MARKET_INFLATION_TEMPLATES, SHOP_SUPPLIES } from './data/gameData';
import { INITIAL_ACHIEVEMENTS } from './data/achievementsData';
import { BlockType, PickaxeState, ThemeBackground, PlayerSkin, Friend, Achievement, MarketInflationEvent, ShopSupplyItem, ToolType, MonsterData } from './types';
import { AXE_TIERS, SHOVEL_TIERS, SWORD_TIERS } from './data/toolsData';
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
import { ChangeNameModal } from './components/ChangeNameModal';
import { AvatarSelectModal } from './components/AvatarSelectModal';
import { FestivalsModal } from './components/FestivalsModal';
import { FestivalParticles } from './components/FestivalParticles';
import { LevelModal } from './components/LevelModal';
import { getLevelQuest, getLevelTitle, checkQuestProgress, calculateBlockXp } from './utils/levelSystem';
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
  Flame,
  User as UserIcon,
  ChevronDown,
  Edit3,
  LogOut,
  Settings
} from 'lucide-react';
import {
  subscribeToAuth,
  saveUserData,
  loadUserData,
  logoutUser,
  isFirebaseConfigured
} from './services/firebase';
import { useLanguage } from './utils/i18n';

const STORAGE_KEY = 'mc_mining_workshop_v1';

// Helper to filter out any legacy default 'alex-crafter' friend
const isAlexCrafterFriend = (f: Friend): boolean => {
  if (!f) return false;
  const username = (f.username || '').toLowerCase();
  const code = (f.code || '').toLowerCase();
  return (
    username.includes('alex-crafter') ||
    username.includes('alexcrafter') ||
    (username.includes('alex') && username.includes('crafter')) ||
    code.includes('alex-crafter') ||
    code.includes('alexcrafter') ||
    (code.includes('alex') && code.includes('crafter')) ||
    username === 'alex-crafter' ||
    code === 'alex-crafter' ||
    username === 'alex' ||
    code === 'alex'
  );
};

export default function App() {
  const { language, toggleLanguage, t, getName, getDesc } = useLanguage();
  const isEn = language === 'en';

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

  // Tools & Combat States (Axes, Shovels, Swords)
  const [activeTool, setActiveTool] = useState<ToolType>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_tool`);
      return (saved ? JSON.parse(saved) : 'pickaxe') as ToolType;
    } catch {
      return 'pickaxe';
    }
  });

  const [autoSwitchTool, setAutoSwitchTool] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_auto_switch`);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [axeState, setAxeState] = useState<{ currentTierId: string; currentDurability: number }>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_axe_state`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { currentTierId: 'bare_hand_axe', currentDurability: 999999 };
  });

  const [ownedAxes, setOwnedAxes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_owned_axes`);
      return saved ? JSON.parse(saved) : ['bare_hand_axe'];
    } catch {
      return ['bare_hand_axe'];
    }
  });

  const [shovelState, setShovelState] = useState<{ currentTierId: string; currentDurability: number }>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_shovel_state`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { currentTierId: 'bare_hand_shovel', currentDurability: 999999 };
  });

  const [ownedShovels, setOwnedShovels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_owned_shovels`);
      return saved ? JSON.parse(saved) : ['bare_hand_shovel'];
    } catch {
      return ['bare_hand_shovel'];
    }
  });

  const [swordState, setSwordState] = useState<{ currentTierId: string; currentDurability: number }>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sword_state`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { currentTierId: 'wood_sword', currentDurability: 80 };
  });

  const [ownedSwords, setOwnedSwords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_owned_swords`);
      return saved ? JSON.parse(saved) : ['wood_sword'];
    } catch {
      return ['wood_sword'];
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(f => !isAlexCrafterFriend(f));
        }
      }
    } catch {
      // Fallback
    }
    // Clean initial state with no default placeholders
    return [];
  });

  const [friendRewardClaimed, setFriendRewardClaimed] = useState<boolean>(() => {
    try {
      const friendsSaved = localStorage.getItem(`${STORAGE_KEY}_friends`);
      const parsedFriends = friendsSaved ? JSON.parse(friendsSaved) : [];
      const realFriends = Array.isArray(parsedFriends) ? parsedFriends.filter((f: any) => !isAlexCrafterFriend(f)) : [];
      if (realFriends.length === 0) {
        localStorage.removeItem(`${STORAGE_KEY}_friend_reward_claimed`);
        return false;
      }
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isChangeNameOpen, setIsChangeNameOpen] = useState<boolean>(false);
  const [isAvatarSelectOpen, setIsAvatarSelectOpen] = useState<boolean>(false);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isFestivalsOpen, setIsFestivalsOpen] = useState<boolean>(false);
  const [activeFestivalId, setActiveFestivalId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_festival`);
      return saved ? JSON.parse(saved) : 'halloween';
    } catch {
      return 'halloween';
    }
  });
  const [dailyGiftClaimedToday, setDailyGiftClaimedToday] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_daily_fest_gift`) === new Date().toISOString().slice(0, 10);
    } catch {
      return false;
    }
  });
  const [extremeHasteSeconds, setExtremeHasteSeconds] = useState<number>(0);
  const [zeroDurabilitySeconds, setZeroDurabilitySeconds] = useState<number>(0);
  const [doubleCoinsSeconds, setDoubleCoinsSeconds] = useState<number>(0);
  const [shopInitialTab, setShopInitialTab] = useState<'pickaxes' | 'axes' | 'shovels' | 'swords' | 'themes' | 'skins' | 'supplies'>('pickaxes');

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

  // Player Level & XP Progression System (Real Level, starts at 0)
  const [playerLevel, setPlayerLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_player_level`);
      return saved !== null ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [playerXp, setPlayerXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_player_xp`);
      return saved !== null ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);

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
      return { success: false, error: '請先登入帳號！' };
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
      stats,
      playerLevel,
      playerXp
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
    stats,
    playerLevel,
    playerXp
  ]);

  // Cloud Load Handler
  const handleCloudLoad = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser?.uid) {
      return { success: false, error: '請先登入帳號！' };
    }
    const res = await loadUserData(currentUser.uid);
    if (res.data) {
      const d = res.data;
      if (typeof d.coins === 'number') setCoins(d.coins);
      if (typeof d.playerLevel === 'number') setPlayerLevel(d.playerLevel);
      if (typeof d.playerXp === 'number') setPlayerXp(d.playerXp);
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
      if (Array.isArray(d.friends)) setFriends(d.friends.filter(f => !isAlexCrafterFriend(f)));
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
    localStorage.setItem(`${STORAGE_KEY}_active_tool`, JSON.stringify(activeTool));
  }, [activeTool]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auto_switch`, JSON.stringify(autoSwitchTool));
  }, [autoSwitchTool]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_axe_state`, JSON.stringify(axeState));
  }, [axeState]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_owned_axes`, JSON.stringify(ownedAxes));
  }, [ownedAxes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_shovel_state`, JSON.stringify(shovelState));
  }, [shovelState]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_owned_shovels`, JSON.stringify(ownedShovels));
  }, [ownedShovels]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sword_state`, JSON.stringify(swordState));
  }, [swordState]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_owned_swords`, JSON.stringify(ownedSwords));
  }, [ownedSwords]);

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
    // Purge any legacy 'alex-crafter' default friend from active state & localStorage
    setFriends(prev => {
      const cleaned = prev.filter(f => !isAlexCrafterFriend(f));
      if (cleaned.length === 0) {
        setFriendRewardClaimed(false);
        try {
          localStorage.removeItem(`${STORAGE_KEY}_friend_reward_claimed`);
        } catch {}
      }
      if (cleaned.length !== prev.length) {
        try {
          localStorage.setItem(`${STORAGE_KEY}_friends`, JSON.stringify(cleaned));
        } catch {}
        return cleaned;
      }
      return prev;
    });
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_active_festival`, JSON.stringify(activeFestivalId));
    } catch {}
  }, [activeFestivalId]);

  // Player Level & XP LocalStorage Sync
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_player_level`, JSON.stringify(playerLevel));
  }, [playerLevel]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_player_xp`, JSON.stringify(playerXp));
  }, [playerXp]);

  // Current Promotion Quest and Evaluation
  const currentLevelQuest = useMemo(() => getLevelQuest(playerLevel), [playerLevel]);
  const levelQuestProgress = useMemo(() => {
    const pickaxeTierIndex = PICKAXE_TIERS.findIndex(p => p.id === pickaxeState.currentTierId);
    const totalEnchants = pickaxeState.efficiencyLevel + pickaxeState.unbreakingLevel + pickaxeState.fortuneLevel;
    const currentStrataIndex = STRATA_LAYERS.findIndex(l => l.id === selectedLayerId);
    const achievementsCount = achievements.filter(a => a.unlocked).length;

    return checkQuestProgress(currentLevelQuest, {
      totalBlocksMined: stats.totalBlocksMined,
      totalBlocksPlaced: stats.totalBlocksPlaced,
      totalCoinsEarned: stats.totalCoinsEarned,
      coins,
      pickaxeTier: Math.max(0, pickaxeTierIndex),
      totalEnchants,
      currentStrataIndex: Math.max(0, currentStrataIndex),
      hasAutoMiner,
      achievementsCount
    });
  }, [currentLevelQuest, stats, coins, pickaxeState, selectedLayerId, hasAutoMiner, achievements]);

  const canLevelUp = playerXp >= currentLevelQuest.requiredXp && levelQuestProgress.isCompleted;

  const handleLevelUp = useCallback(() => {
    const pickaxeTierIndex = PICKAXE_TIERS.findIndex(p => p.id === pickaxeState.currentTierId);
    const totalEnchants = pickaxeState.efficiencyLevel + pickaxeState.unbreakingLevel + pickaxeState.fortuneLevel;
    const currentStrataIndex = STRATA_LAYERS.findIndex(l => l.id === selectedLayerId);
    const achievementsCount = achievements.filter(a => a.unlocked).length;

    const progress = checkQuestProgress(currentLevelQuest, {
      totalBlocksMined: stats.totalBlocksMined,
      totalBlocksPlaced: stats.totalBlocksPlaced,
      totalCoinsEarned: stats.totalCoinsEarned,
      coins,
      pickaxeTier: Math.max(0, pickaxeTierIndex),
      totalEnchants,
      currentStrataIndex: Math.max(0, currentStrataIndex),
      hasAutoMiner,
      achievementsCount
    });

    if (playerXp < currentLevelQuest.requiredXp || !progress.isCompleted) {
      sound.playHitSound(1);
      return;
    }

    sound.playAchievementSound();
    setCoins(c => c + currentLevelQuest.coinReward);
    setPlayerXp(xp => Math.max(0, xp - currentLevelQuest.requiredXp));
    setPlayerLevel(lvl => lvl + 1);

    const nextLvl = playerLevel + 1;
    const nextTitle = getLevelTitle(nextLvl, isEn);
    setLevelUpToast(
      isEn
        ? `🎉 Level Up! Ascended to Lv.${nextLvl}「${nextTitle}」! Claimed +${currentLevelQuest.coinReward} Coins!`
        : `🎉 恭喜突破升等！成功晉升至 Lv.${nextLvl}「${nextTitle}」！領取 +${currentLevelQuest.coinReward} 金幣突破獎勵！`
    );
    setTimeout(() => setLevelUpToast(null), 6000);
  }, [currentLevelQuest, playerLevel, playerXp, pickaxeState, selectedLayerId, achievements, stats, coins, hasAutoMiner, isEn]);

  // Haste buff countdown
  useEffect(() => {
    if (hasteRemainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setHasteRemainingSeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [hasteRemainingSeconds]);

  // Festival Buffs countdowns
  useEffect(() => {
    if (extremeHasteSeconds <= 0) return;
    const timer = setInterval(() => {
      setExtremeHasteSeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [extremeHasteSeconds]);

  useEffect(() => {
    if (zeroDurabilitySeconds <= 0) return;
    const timer = setInterval(() => {
      setZeroDurabilitySeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [zeroDurabilitySeconds]);

  useEffect(() => {
    if (doubleCoinsSeconds <= 0) return;
    const timer = setInterval(() => {
      setDoubleCoinsSeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [doubleCoinsSeconds]);

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

  // Unlock achievement helper (supports single or batch unlock)
  const unlockAchievementsBatch = useCallback((achIds: string[]) => {
    if (!achIds || achIds.length === 0) return;
    const idSet = new Set(achIds);

    setAchievements(prev => {
      let lastUnlocked: Achievement | null = null;
      let hasChange = false;

      const updated = prev.map(a => {
        if (idSet.has(a.id) && !a.unlocked) {
          lastUnlocked = { ...a, unlocked: true };
          hasChange = true;
          return lastUnlocked;
        }
        return a;
      });

      if (!hasChange) return prev;

      sound.playAchievementSound();
      if (lastUnlocked) {
        setPopupAchievement(lastUnlocked);
        setTimeout(() => setPopupAchievement(null), 3800);
      }

      return updated;
    });
  }, []);

  const unlockAchievement = useCallback((achId: string) => {
    unlockAchievementsBatch([achId]);
  }, [unlockAchievementsBatch]);

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
      unlockAchievementsBatch(newlyUnlockedIds);
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
    unlockAchievementsBatch
  ]);

  // --- Handlers: Mining ---
  const handleMineSuccess = useCallback((minedBlock: BlockType, amount: number, layerId?: string) => {
    setInventory(prev => ({
      ...prev,
      [minedBlock.id]: (prev[minedBlock.id] || 0) + amount
    }));

    // Award XP based on block category and hardness
    const earnedXp = calculateBlockXp(minedBlock.category, minedBlock.hardness) * amount;
    setPlayerXp(prev => prev + earnedXp);

    if (layerId) {
      setLayerMinedCounts(prev => {
        const current = prev[layerId] || 0;
        const next = current + amount;

        // Check if 100,000 threshold reached to unlock next layer
        if (current < 100000 && next >= 100000) {
          sound.playAchievementSound();
          const currentLayerIdx = STRATA_LAYERS.findIndex(l => l.id === layerId);
          const nextLayerObj = STRATA_LAYERS[currentLayerIdx + 1];
          if (nextLayerObj) {
            setLayerUnlockToast(`🎉 恭喜！您已在該層挖掘突破 100,000 格！【${nextLayerObj.nameZh}】已正式解鎖！`);
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
    // Zero-durability lock buff (Christmas event)
    if (zeroDurabilitySeconds > 0) return;

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
  }, [zeroDurabilitySeconds, pickaxeState.currentTierId, pickaxeState.unbreakingLevel, unlockAchievement]);

  const handleToolDurabilityLoss = useCallback((tool: ToolType) => {
    if (zeroDurabilitySeconds > 0) return;

    if (tool === 'pickaxe') {
      handleDurabilityLoss();
    } else if (tool === 'axe') {
      const currentAxe = AXE_TIERS.find(a => a.id === axeState.currentTierId) || AXE_TIERS[0];
      if (currentAxe.tier === 0) return;
      setAxeState(prev => {
        const nextDur = Math.max(0, prev.currentDurability - 1);
        if (nextDur === 0) {
          sound.playToolBreakSound();
          return { currentTierId: 'bare_hand_axe', currentDurability: 999999 };
        }
        return { ...prev, currentDurability: nextDur };
      });
    } else if (tool === 'shovel') {
      const currentShovel = SHOVEL_TIERS.find(s => s.id === shovelState.currentTierId) || SHOVEL_TIERS[0];
      if (currentShovel.tier === 0) return;
      setShovelState(prev => {
        const nextDur = Math.max(0, prev.currentDurability - 1);
        if (nextDur === 0) {
          sound.playToolBreakSound();
          return { currentTierId: 'bare_hand_shovel', currentDurability: 999999 };
        }
        return { ...prev, currentDurability: nextDur };
      });
    } else if (tool === 'sword') {
      setSwordState(prev => {
        const nextDur = Math.max(0, prev.currentDurability - 1);
        if (nextDur === 0) {
          sound.playToolBreakSound();
          return { ...prev, currentDurability: 0 };
        }
        return { ...prev, currentDurability: nextDur };
      });
    }
  }, [axeState.currentTierId, handleDurabilityLoss, shovelState.currentTierId, zeroDurabilitySeconds]);

  // Monster Defeat & Loot Handler
  const handleDefeatMonster = useCallback((monster: MonsterData, coinReward: number) => {
    setCoins(prev => prev + coinReward);
    setPlayerXp(prev => prev + 35);
    setStats(prev => ({
      ...prev,
      totalCoinsEarned: prev.totalCoinsEarned + coinReward
    }));

    if (monster.dropItemId) {
      setInventory(prev => ({
        ...prev,
        [monster.dropItemId!]: (prev[monster.dropItemId!] || 0) + 1
      }));
    }
  }, []);

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

    setPlayerXp(prev => prev + 3);
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
    const baseEarned = Math.round(realAmount * unitPrice);
    const earned = doubleCoinsSeconds > 0 ? baseEarned * 2 : baseEarned;
    const isInflationTrade = marketInflationEvent.multiplier > 1.05;

    setInventory(prev => ({
      ...prev,
      [blockId]: prev[blockId] - realAmount
    }));

    setCoins(prev => prev + earned);
    setPlayerXp(prev => prev + Math.max(1, Math.floor(earned / 20)));

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
  }, [inventory, marketInflationEvent.multiplier, doubleCoinsSeconds, unlockAchievement]);

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

    const baseEarned = typeof customTotalEarned === 'number' ? customTotalEarned : totalEarned;
    const finalEarned = doubleCoinsSeconds > 0 ? baseEarned * 2 : baseEarned;
    if (finalEarned <= 0 && totalSold <= 0) return;

    const isInflationTrade = marketInflationEvent.multiplier > 1.05;

    setInventory(newInv);
    setCoins(prev => prev + finalEarned);
    setPlayerXp(prev => prev + Math.max(1, Math.floor(finalEarned / 20)));
    setStats(prev => ({
      ...prev,
      totalCoinsEarned: prev.totalCoinsEarned + finalEarned,
      totalBlocksSold: prev.totalBlocksSold + totalSold,
      blocksSoldDuringInflation: prev.blocksSoldDuringInflation + (isInflationTrade ? totalSold : 0)
    }));

    unlockAchievement('quick_sell_all');
    if (finalEarned >= 500) unlockAchievement('sell_single_trade_500');
    if (finalEarned >= 1500) unlockAchievement('sell_single_trade_1500');
  }, [inventory, marketInflationEvent.multiplier, doubleCoinsSeconds, unlockAchievement]);

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

  // --- Handlers: Axes, Shovels, Swords ---
  const handleBuyAxe = useCallback((tierId: string, cost: number) => {
    if (coins < cost) return;
    const tier = AXE_TIERS.find(a => a.id === tierId);
    if (!tier) return;
    setCoins(prev => prev - cost);
    setOwnedAxes(prev => (prev.includes(tierId) ? prev : [...prev, tierId]));
    setAxeState({ currentTierId: tierId, currentDurability: tier.maxDurability });
  }, [coins]);

  const handleEquipAxe = useCallback((tierId: string) => {
    const tier = AXE_TIERS.find(a => a.id === tierId);
    if (!tier) return;
    setAxeState(prev => ({
      currentTierId: tierId,
      currentDurability: tier.tier === 0 ? 999999 : (prev.currentTierId === tierId ? prev.currentDurability : tier.maxDurability)
    }));
    setActiveTool('axe');
  }, []);

  const handleRepairAxe = useCallback((cost: number) => {
    if (coins < cost) return;
    const tier = AXE_TIERS.find(a => a.id === axeState.currentTierId) || AXE_TIERS[0];
    setCoins(prev => prev - cost);
    setAxeState(prev => ({ ...prev, currentDurability: tier.maxDurability }));
  }, [axeState.currentTierId, coins]);

  const handleBuyShovel = useCallback((tierId: string, cost: number) => {
    if (coins < cost) return;
    const tier = SHOVEL_TIERS.find(s => s.id === tierId);
    if (!tier) return;
    setCoins(prev => prev - cost);
    setOwnedShovels(prev => (prev.includes(tierId) ? prev : [...prev, tierId]));
    setShovelState({ currentTierId: tierId, currentDurability: tier.maxDurability });
  }, [coins]);

  const handleEquipShovel = useCallback((tierId: string) => {
    const tier = SHOVEL_TIERS.find(s => s.id === tierId);
    if (!tier) return;
    setShovelState(prev => ({
      currentTierId: tierId,
      currentDurability: tier.tier === 0 ? 999999 : (prev.currentTierId === tierId ? prev.currentDurability : tier.maxDurability)
    }));
    setActiveTool('shovel');
  }, []);

  const handleRepairShovel = useCallback((cost: number) => {
    if (coins < cost) return;
    const tier = SHOVEL_TIERS.find(s => s.id === shovelState.currentTierId) || SHOVEL_TIERS[0];
    setCoins(prev => prev - cost);
    setShovelState(prev => ({ ...prev, currentDurability: tier.maxDurability }));
  }, [coins, shovelState.currentTierId]);

  const handleBuySword = useCallback((tierId: string, cost: number) => {
    if (coins < cost) return;
    const tier = SWORD_TIERS.find(s => s.id === tierId);
    if (!tier) return;
    setCoins(prev => prev - cost);
    setOwnedSwords(prev => (prev.includes(tierId) ? prev : [...prev, tierId]));
    setSwordState({ currentTierId: tierId, currentDurability: tier.maxDurability });
  }, [coins]);

  const handleEquipSword = useCallback((tierId: string) => {
    const tier = SWORD_TIERS.find(s => s.id === tierId);
    if (!tier) return;
    setSwordState(prev => ({
      currentTierId: tierId,
      currentDurability: prev.currentTierId === tierId ? prev.currentDurability : tier.maxDurability
    }));
    setActiveTool('sword');
  }, []);

  const handleRepairSword = useCallback((cost: number) => {
    if (coins < cost) return;
    const tier = SWORD_TIERS.find(s => s.id === swordState.currentTierId) || SWORD_TIERS[0];
    setCoins(prev => prev - cost);
    setSwordState(prev => ({ ...prev, currentDurability: tier.maxDurability }));
  }, [coins, swordState.currentTierId]);

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
    } else if (supply.type === 'double_coins_candy') {
      setCoins(prev => prev - supply.cost);
      setDoubleCoinsSeconds(prev => prev + 120);
      sound.playPouchOpenSound();
      setSupplyToastMsg('🍬 萬聖節南瓜雙倍金幣糖果生效！120 秒內賣出方塊金幣收益翻倍！');
      setTimeout(() => setSupplyToastMsg(null), 4500);
    } else if (supply.type === 'ice_shard') {
      setCoins(prev => prev - supply.cost);
      setZeroDurabilitySeconds(prev => prev + 90);
      sound.playUpgradeSound();
      setSupplyToastMsg('❄️ 聖誕極地零度冰晶生效！90 秒內挖掘方塊鎬具耐久鎖死不消耗！');
      setTimeout(() => setSupplyToastMsg(null), 4500);
    } else if (supply.type === 'cherry_dango') {
      setCoins(prev => prev - supply.cost);
      setExtremeHasteSeconds(prev => prev + 60);
      sound.playCoinSound();
      setSupplyToastMsg('🍡 櫻花春日三色團子生效！60 秒內採礦速度極限激增 +100%！');
      setTimeout(() => setSupplyToastMsg(null), 4500);
    } else if (supply.type === 'lucky_packet') {
      setCoins(prev => prev - supply.cost);
      const bonusReward = Math.floor(Math.random() * 2001) + 1500; // 1,500 ~ 3,500
      setCoins(prev => prev + bonusReward);
      sound.playPouchOpenSound();
      setSupplyToastMsg(`🧧 新春開運壓歲大紅包開啟！恭喜獲得 +${bonusReward.toLocaleString()} 遊戲幣！`);
      setTimeout(() => setSupplyToastMsg(null), 4500);
    } else if (supply.type === 'watermelon_ice') {
      setCoins(prev => prev - supply.cost);
      setExtremeHasteSeconds(prev => prev + 45);
      setDoubleCoinsSeconds(prev => prev + 45);
      sound.playCoinSound();
      setSupplyToastMsg('🍉 夏至冰鎮西瓜切片生效！45 秒內同時享受極速採礦與雙倍金幣加成！');
      setTimeout(() => setSupplyToastMsg(null), 4500);
    }
  }, [coins, pickaxeState.currentTierId, selectedLayerId, hasAutoMiner]);

  // --- Handlers: Festival Daily Gift Claim ---
  const handleClaimDailyFestivalGift = useCallback((coinsAmount: number) => {
    if (dailyGiftClaimedToday) return;
    const today = new Date().toISOString().slice(0, 10);
    setCoins(prev => prev + coinsAmount);
    setDailyGiftClaimedToday(true);
    try {
      localStorage.setItem(`${STORAGE_KEY}_daily_fest_gift`, today);
    } catch {}
    sound.playPouchOpenSound();
    setSupplyToastMsg(`🎉 領取成功！獲得節慶每日祝福大禮包 +${coinsAmount.toLocaleString()} 遊戲幣！`);
    setTimeout(() => setSupplyToastMsg(null), 4500);
  }, [dailyGiftClaimedToday]);

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
    setFriends([]);
    setFriendRewardClaimed(false);
    setPlayerLevel(0);
    setPlayerXp(0);

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
      `${STORAGE_KEY}_auto_miner`,
      `${STORAGE_KEY}_friend_reward_claimed`,
      `${STORAGE_KEY}_friends`,
      `${STORAGE_KEY}_player_level`,
      `${STORAGE_KEY}_player_xp`
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
      level: 0
    };

    setFriends(prev => [...prev, newFriend]);
    return true;
  }, [friends]);

  const handleRemoveFriend = useCallback((code: string) => {
    setFriends(prev => prev.filter(f => f.code !== code));
  }, []);

  // --- Handlers: Achievements ---
  const handleClaimAchReward = useCallback((achId: string) => {
    setAchievements(prev => {
      const ach = prev.find(a => a.id === achId);
      if (!ach || !ach.unlocked || ach.rewardClaimed || ach.coinReward <= 0) return prev;

      setCoins(c => c + ach.coinReward);
      setPlayerXp(xp => xp + 50);
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
      setPlayerXp(xp => xp + Math.round(total * 0.5));
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
      {/* Dynamic Festival Atmosphere Particles */}
      <FestivalParticles festivalId={activeFestivalId} />

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
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs sm:text-sm rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#78350f,inset_2px_2px_0_#fde047] active:scale-95 flex items-center gap-1.5 font-minecraft tracking-wider cursor-pointer"
              title={isEn ? 'Open Game Main Menu' : '開啟遊戲主選單'}
            >
              <Menu className="w-4 h-4" />
              <span>{t('nav.menu')}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">{activeSkin.avatarEmoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-amber-300 drop-shadow-[2px_2px_0_#000] tracking-wide font-minecraft">
                    {t('app.title')}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="text-emerald-400 font-bold">{myUsername}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="font-mono text-zinc-400">#{myFriendCode}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-cyan-400">{getName(activeTheme)}</span>
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
              title="Visit PizzaCowMC GitHub"
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
              className={`px-3 py-1 rounded transition-all cursor-pointer ${
                activeView === 'all'
                  ? 'bg-zinc-800 text-amber-300 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('nav.all')}
            </button>
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveView('quarry');
              }}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'quarry'
                  ? 'bg-amber-900/60 text-amber-300 border border-amber-600/50 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('nav.quarry')}</span>
            </button>
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveView('building');
              }}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'building'
                  ? 'bg-blue-900/60 text-blue-300 border border-blue-600/50 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('nav.building')}</span>
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
              title={isEn ? 'Click to visit Market and sell blocks' : '點擊前往方塊交易所出售庫存'}
              className="px-2.5 sm:px-3 py-1.5 bg-black/80 hover:bg-black text-amber-300 border-2 border-amber-400 rounded-lg font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 transition-transform active:scale-95 shadow-[inset_1px_1px_0_#fde047] cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{coins.toLocaleString()} {t('common.coins')}</span>
            </button>

            {/* Market Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsMarketOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-emerald-100 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#34d399] active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{t('nav.market')}</span>
            </button>

            {/* Shop Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setShopInitialTab('pickaxes');
                setIsShopOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-amber-100 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#78350f,inset_2px_2px_0_#fde047] active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('nav.shop')}</span>
            </button>

            {/* Festival Celebration Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsFestivalsOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-yellow-100 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#7f1d1d,inset_2px_2px_0_#fde047] active:scale-95 flex items-center gap-1 relative cursor-pointer"
              title={isEn ? 'Festival Hall: Limited pickaxes, gifts and buffs' : '節慶活動大廳：萬聖節、聖誕節、春節、櫻花祭限定神鎬與特惠'}
            >
              <span>{t('nav.festivals')}</span>
              {!dailyGiftClaimedToday && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Achievements Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsAchievementsOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-purple-200 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#3b0764,inset_2px_2px_0_#c084fc] active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t('nav.achievements')}</span>
            </button>

            {/* Friends Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsFriendsOpen(true);
              }}
              className="relative px-2.5 sm:px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-blue-100 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#1e3a8a,inset_2px_2px_0_#60a5fa] active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('nav.friends')}</span>
              {friends.length >= 1 && !friendRewardClaimed && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Player Level & Promotion Quests Badge */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsLevelModalOpen(true);
              }}
              title={isEn ? `Player Level ${playerLevel} (${playerXp} XP) - Click to view promotion quests` : `玩家真實等級 Lv.${playerLevel} (${playerXp} XP) - 點擊查看晉升特殊任務`}
              className="relative px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 hover:from-emerald-900 hover:to-zinc-800 text-emerald-200 font-black text-xs rounded-lg border-2 border-emerald-500 shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#34d399] active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer font-minecraft"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-emerald-400 font-mono font-bold">Lv.{playerLevel}</span>
                  <span className="hidden md:inline text-zinc-300 font-normal">
                    {getLevelTitle(playerLevel, isEn)}
                  </span>
                </div>
                {/* XP mini bar */}
                <div className="w-12 sm:w-16 h-1 bg-zinc-950 border border-black rounded-xs overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((playerXp / currentLevelQuest.requiredXp) * 100))}%` }}
                  />
                </div>
              </div>
              {canLevelUp && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Account / User Menu or Login/Register Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    sound.playClickSound();
                    setIsUserMenuOpen(prev => !prev);
                  }}
                  title={isEn ? 'User Profile & Menu' : '玩家選單 (變更名稱/頭像/設定/登出)'}
                  className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 hover:from-emerald-900 hover:to-zinc-800 text-emerald-200 font-black text-xs rounded-lg border-2 border-emerald-500 shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#34d399] active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer font-minecraft"
                >
                  <span className="text-base leading-none drop-shadow-[1px_1px_0_#000]">{activeSkin.avatarEmoji}</span>
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentUser.displayName || myUsername}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-emerald-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Backdrop */}
                {isUserMenuOpen && (
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                )}

                {/* Dropdown Menu Box */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#242424] border-4 border-black rounded-lg shadow-[inset_-4px_-4px_0_#111,inset_4px_4px_0_#444,0_12px_30px_rgba(0,0,0,0.95)] z-50 overflow-hidden font-minecraft animate-in fade-in zoom-in-95 duration-100">
                    {/* Header info */}
                    <div className="p-3 bg-zinc-900 border-b-2 border-black flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border-2 border-emerald-500/80 flex items-center justify-center text-2xl shrink-0 shadow-[inset_1px_1px_0_#34d399]">
                        {activeSkin.avatarEmoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-white truncate">
                          {currentUser.displayName || myUsername}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                          <span className="text-amber-300">#{myFriendCode}</span>
                          <span className="text-emerald-400">• {isEn ? 'Online' : '已連線'}</span>
                        </div>
                        <div className="text-[10px] text-emerald-300 font-bold font-mono mt-0.5 flex items-center justify-between">
                          <span>Lv.{playerLevel} {getLevelTitle(playerLevel, isEn)}</span>
                          <span className="text-zinc-400 font-normal">{playerXp}/{currentLevelQuest.requiredXp} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5 space-y-1">
                      {/* 等級與晉升任務 */}
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          setIsUserMenuOpen(false);
                          setIsLevelModalOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-emerald-300 hover:text-white hover:bg-emerald-950/60 rounded flex items-center justify-between transition-colors cursor-pointer border border-emerald-500/30"
                      >
                        <div className="flex items-center gap-2.5">
                          <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{isEn ? 'Level & Quests' : '等級與晉升任務'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400">Lv.{playerLevel}</span>
                      </button>

                      {/* 變更名稱 */}
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          setIsUserMenuOpen(false);
                          setIsChangeNameOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{isEn ? 'Change Name' : '變更名稱'}</span>
                      </button>

                      {/* 頭像 */}
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          setIsUserMenuOpen(false);
                          setIsAvatarSelectOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{isEn ? 'Avatar' : '頭像'}</span>
                      </button>

                      {/* 設定 */}
                      <button
                        onClick={() => {
                          sound.playClickSound();
                          setIsUserMenuOpen(false);
                          setIsMenuOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{isEn ? 'Settings' : '設定'}</span>
                      </button>

                      <div className="my-1 border-t border-zinc-800" />

                      {/* 登出 */}
                      <button
                        onClick={async () => {
                          sound.playClickSound();
                          setIsUserMenuOpen(false);
                          await logoutUser();
                          setCurrentUser(null);
                          setCloudToast(isEn ? '👋 Successfully logged out' : '👋 已成功登出帳號');
                          setTimeout(() => setCloudToast(null), 3000);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{isEn ? 'Logout' : '登出'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in: Show 登入 / 註冊 */
              <button
                onClick={() => {
                  sound.playClickSound();
                  setIsAuthOpen(true);
                }}
                title={isEn ? 'Account Login & Register' : '帳號登入與註冊'}
                className="px-2.5 sm:px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#27272a,inset_2px_2px_0_#52525b] active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer font-minecraft"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Login / Register' : '登入 / 註冊'}</span>
              </button>
            )}

            {/* Changelog Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                setIsChangelogOpen(true);
              }}
              title={isEn ? 'View Version Changelog' : '查看版本更新日誌'}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-2 border-black rounded-lg active:scale-95 cursor-pointer"
            >
              <Scroll className="w-4 h-4" />
            </button>

            {/* Quick Language Toggle */}
            <button
              onClick={() => {
                sound.playClickSound();
                toggleLanguage();
              }}
              title={isEn ? '切換至繁體中文 (Traditional Chinese)' : 'Switch to English (預設英文)'}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold border-2 border-black rounded-lg active:scale-95 text-xs flex items-center gap-1 cursor-pointer font-minecraft"
            >
              <span>🌐</span>
              <span>{isEn ? 'EN' : '繁中'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                sound.setSoundEnabled(next);
                if (next) sound.playClickSound();
              }}
              title={soundEnabled ? (isEn ? 'Mute Audio' : '關閉音效') : (isEn ? 'Enable Audio' : '開啟音效')}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-2 border-black rounded-lg active:scale-95 cursor-pointer"
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
                <span className="text-xs font-semibold text-zinc-400">
                  {isEn ? 'Market Inflation Dynamic:' : '市場即時通膨動態：'}
                </span>
                <strong className="text-xs sm:text-sm font-black text-amber-300 tracking-wide font-minecraft">
                  {getName(marketInflationEvent)}
                </strong>
                <span className={`px-2 py-0.5 rounded text-[11px] font-black border border-black ${
                  marketInflationEvent.multiplier >= 1.0
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-blue-950 text-blue-300 border-blue-600'
                }`}>
                  {marketInflationEvent.multiplier >= 1.0
                    ? `+${Math.round((marketInflationEvent.multiplier - 1) * 100)}% ${isEn ? 'Inflation Surge' : '通膨增益'}`
                    : `${Math.round((marketInflationEvent.multiplier - 1) * 100)}% ${isEn ? 'Market Deflation' : '市場緊縮'}`}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                {getDesc(marketInflationEvent)} • {isEn ? 'Remaining cycle: ' : '剩餘週期：'}
                <strong className="text-amber-400 font-mono">{marketInflationEvent.remainingSeconds}</strong> {isEn ? 's' : '秒'}
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
            <span>{isEn ? 'Go to Exchange' : '前往交易所拋售'}</span>
          </button>
        </div>

        {/* 1-Friend 100-Coin Milestone Alert (if available to claim) */}
        {friends.length >= 1 && !friendRewardClaimed && (
          <div className="p-3 bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-3 border-amber-500 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-200 font-bold">
              <span className="text-xl">🎁</span>
              <span>
                {isEn ? 'Reached 1-Friend Milestone! Unlocked ' : '達成 1 位好友里程碑！恭喜解鎖 '}
                <strong className="text-amber-300 font-black">{isEn ? '100 Coins' : '100 遊戲幣'}</strong>
                {isEn ? ' exclusive reward!' : ' 專屬獎勵！'}
              </span>
            </div>
            <button
              onClick={() => {
                sound.playAchievementSound();
                handleClaimFriendReward();
              }}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded border-2 border-black shadow-[inset_-2px_-2px_0_#b45309,inset_2px_2px_0_#fef08a] active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {isEn ? 'Claim 100 Coins' : '立即領取 100 幣'}
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
            onToolDurabilityLoss={handleToolDurabilityLoss}
            onOpenShopToPickaxes={() => {
              sound.playClickSound();
              setShopInitialTab('pickaxes');
              setIsShopOpen(true);
            }}
            onOpenShopTab={(tab) => {
              sound.playClickSound();
              setShopInitialTab(tab);
              setIsShopOpen(true);
            }}
            totalBlocksMined={stats.totalBlocksMined}
            hasteRemainingSeconds={hasteRemainingSeconds}
            hasAutoMiner={hasAutoMiner}
            extremeHasteSeconds={extremeHasteSeconds}
            doubleCoinsSeconds={doubleCoinsSeconds}
            zeroDurabilitySeconds={zeroDurabilitySeconds}
            activeTool={activeTool}
            onChangeTool={setActiveTool}
            autoSwitchTool={autoSwitchTool}
            onToggleAutoSwitch={() => setAutoSwitchTool(prev => !prev)}
            axeState={axeState}
            shovelState={shovelState}
            swordState={swordState}
            onDefeatMonster={handleDefeatMonster}
            onEarnExtraCoins={(c) => {
              setCoins(prev => prev + c);
              setStats(prev => ({ ...prev, totalCoinsEarned: prev.totalCoinsEarned + c }));
            }}
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
          <span className="font-bold text-zinc-300">{t('app.title')}</span>
          <span className="text-zinc-600">|</span>
          <button
            onClick={() => {
              sound.playClickSound();
              setIsChangelogOpen(true);
            }}
            className="text-amber-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
          >
            <span>{isEn ? 'v2.2.6 (Changelog)' : 'v2.2.6 (更新日誌)'}</span>
          </button>
        </div>

        {/* Prominent PizzaCowMC GitHub Credit */}
        <div className="flex items-center gap-2">
          <span>{isEn ? 'Open-source project' : '專案由'}</span>
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
          {!isEn && <span>開源打造</span>}
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
              {isEn ? 'Achievement Unlocked!' : '成就已解鎖 Achievement!'}
            </div>
            <div className="font-black text-amber-300 text-sm">{getName(popupAchievement)}</div>
            <div className="text-xs text-zinc-300 line-clamp-1">{getDesc(popupAchievement)}</div>
            {popupAchievement.coinReward > 0 && (
              <div className="text-[11px] font-mono text-yellow-400 font-bold mt-0.5">
                {isEn
                  ? `Reward: +${popupAchievement.coinReward} coins (Claim in Achievements tab)`
                  : `獎勵：+${popupAchievement.coinReward} 遊戲幣 (前往成就頁領取)`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP: Level Up Toast Notification */}
      {levelUpToast && (
        <div className="fixed top-20 right-5 z-50 p-4 bg-zinc-950 border-4 border-emerald-400 rounded-lg shadow-[inset_-3px_-3px_0_#064e3b,inset_3px_3px_0_#34d399,0_10px_25px_rgba(0,0,0,0.9)] max-w-sm flex items-center gap-3 animate-slide-in font-minecraft">
          <div className="text-3xl p-2 bg-emerald-500/20 border-2 border-emerald-400 rounded shrink-0">
            👑
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isEn ? 'Level Up Promotion!' : '等級晉升突破！'}
            </div>
            <div className="font-black text-amber-300 text-xs mt-0.5">{levelUpToast}</div>
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
        onOpenFestivals={() => setIsFestivalsOpen(true)}
        onOpenLevel={() => setIsLevelModalOpen(true)}
        playerLevel={playerLevel}
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

      {/* CHANGE NAME MODAL */}
      <ChangeNameModal
        isOpen={isChangeNameOpen}
        onClose={() => setIsChangeNameOpen(false)}
        currentUsername={currentUser?.displayName || myUsername}
        onNameUpdated={(newName) => {
          setMyUsername(newName);
          if (currentUser) {
            setCurrentUser(prev => prev ? { ...prev, displayName: newName } : null);
          }
          setCloudToast(isEn ? `✅ Name updated to: ${newName}` : `✅ 玩家名稱已成功變更為：${newName}`);
          setTimeout(() => setCloudToast(null), 3500);
          handleCloudSave();
        }}
        isLoggedIn={!!currentUser}
      />

      {/* AVATAR SELECT MODAL */}
      <AvatarSelectModal
        isOpen={isAvatarSelectOpen}
        onClose={() => setIsAvatarSelectOpen(false)}
        currentSkinId={currentSkinId}
        ownedSkins={ownedSkins}
        coins={coins}
        onEquipSkin={(skinId) => {
          setCurrentSkinId(skinId);
          setCloudToast(isEn ? '🎭 Avatar equipped!' : '🎭 頭像已裝備！');
          setTimeout(() => setCloudToast(null), 2500);
          handleCloudSave();
        }}
        onBuySkin={(skin) => {
          handleBuySkin(skin);
          setCloudToast(isEn ? '🎉 New avatar unlocked & equipped!' : '🎉 新頭像造型已解鎖並裝備！');
          setTimeout(() => setCloudToast(null), 2500);
          handleCloudSave();
        }}
      />

      {/* ACCOUNT & CLOUD SAVE MODAL */}
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
        onUserLoggedIn={(user) => {
          if (user) {
            setCurrentUser({
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'Miner',
              uid: user.uid
            });
            if (user.displayName) {
              setMyUsername(user.displayName);
            }
          }
          setCloudToast(isEn ? '🎉 Logged in successfully!' : '🎉 登入成功！');
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
        axeState={axeState}
        ownedAxes={ownedAxes}
        onBuyAxe={handleBuyAxe}
        onEquipAxe={handleEquipAxe}
        onRepairAxe={handleRepairAxe}
        shovelState={shovelState}
        ownedShovels={ownedShovels}
        onBuyShovel={handleBuyShovel}
        onEquipShovel={handleEquipShovel}
        onRepairShovel={handleRepairShovel}
        swordState={swordState}
        ownedSwords={ownedSwords}
        onBuySword={handleBuySword}
        onEquipSword={handleEquipSword}
        onRepairSword={handleRepairSword}
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
        myUsername={currentUser?.displayName || myUsername}
        myFriendCode={myFriendCode}
        friends={friends}
        friendRewardClaimed={friendRewardClaimed}
        onClaimFriendReward={handleClaimFriendReward}
        onAddFriendByCode={handleAddFriendByCode}
        onRemoveFriend={handleRemoveFriend}
        playerLevel={playerLevel}
        playerXp={playerXp}
        onOpenLevelModal={() => setIsLevelModalOpen(true)}
      />

      {/* ACHIEVEMENTS MODAL */}
      {isAchievementsOpen && (
        <AchievementsModal
          isOpen={isAchievementsOpen}
          onClose={() => setIsAchievementsOpen(false)}
          achievements={achievements}
          onClaimReward={handleClaimAchReward}
          onClaimAllRewards={handleClaimAllAchRewards}
        />
      )}

      {/* FESTIVALS MODAL */}
      <FestivalsModal
        isOpen={isFestivalsOpen}
        onClose={() => setIsFestivalsOpen(false)}
        activeFestivalId={activeFestivalId}
        onSelectActiveFestival={setActiveFestivalId}
        coins={coins}
        currentThemeId={currentThemeId}
        ownedThemes={ownedThemes}
        onBuyTheme={handleBuyTheme}
        onEquipTheme={setCurrentThemeId}
        pickaxeState={pickaxeState}
        ownedPickaxes={ownedPickaxes}
        onBuyPickaxe={handleBuyPickaxe}
        onEquipPickaxe={handleEquipPickaxe}
        onBuySupply={handleBuySupply}
        onClaimDailyFestivalGift={handleClaimDailyFestivalGift}
        dailyGiftClaimedToday={dailyGiftClaimedToday}
        activeBuffs={{
          hasteSeconds: hasteRemainingSeconds,
          zeroDurabilitySeconds,
          doubleCoinsSeconds,
          extremeHasteSeconds
        }}
      />

      {/* PLAYER LEVEL & PROMOTION QUESTS MODAL */}
      <LevelModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        playerLevel={playerLevel}
        playerXp={playerXp}
        onLevelUp={handleLevelUp}
        stats={stats}
        coins={coins}
        pickaxeState={pickaxeState}
        selectedLayerId={selectedLayerId}
        hasAutoMiner={hasAutoMiner}
        achievementsCount={achievements.filter(a => a.unlocked).length}
      />
    </div>
  );
}
