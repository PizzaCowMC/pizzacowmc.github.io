import { AchievementCategory } from '../types';

/**
 * SCALABLE ACHIEVEMENT ENGINE (100,000 achievements)
 * ----------------------------------------------------
 * The old system stored a full array of 1,000 Achievement objects (each with
 * an `unlocked` boolean) in React state AND in Firestore. That does not scale
 * to 100,000 entries:
 *   - Re-scanning 100k items on every stat change would freeze the UI.
 *   - Firestore documents are capped at ~1MB; a 100k-item array blows past it.
 *
 * Instead, each achievement GROUP is defined once as a formula:
 *   - a growth function tierTarget(index) -> number required to unlock tier `index`
 *   - a stat selector that reads the relevant number from live game state
 *
 * Given the current stat value, we can compute in O(1) (closed-form) or
 * O(log n) (binary search over a monotonic formula) exactly how many tiers
 * are unlocked, without iterating the other 99,999 achievements.
 *
 * Only "claimed reward" IDs need to be persisted (a small, bounded array —
 * bounded by how many the player has actually claimed, never all 100k).
 */

export interface AchievementGroupDef {
  groupId: string;
  category: AchievementCategory;
  count: number; // total tiers in this group
  icon: string;
  nameZh: (idx: number, target: number) => string;
  nameEn: (idx: number, target: number) => string;
  descZh: (target: number) => string;
  descEn: (target: number) => string;
  // Monotonically increasing target for tier idx (1-based)
  target: (idx: number) => number;
  reward: (idx: number, target: number) => number;
  // Reads the current value of the underlying stat from game state
  statSelector: (state: AchievementEngineState) => number;
}

export interface AchievementEngineState {
  totalBlocksMined: number;
  totalClicks: number;
  totalCoinsEarned: number;
  coins: number;
  totalBlocksSold: number;
  blocksSoldDuringInflation: number;
  totalBlocksPlaced: number;
  equipScore: number;
  collectionScore: number;
  layerMinedCounts: Record<string, number>;
  totalMonstersKilled: number;
  totalCombatDamageDealt: number;
  totalCombatCoinsEarned: number;
}

const fmtNum = (n: number): string => (n >= 10000 ? `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}萬` : `${n.toLocaleString()}`);

// ------------------------------------------------------------------
// Growth helpers: each produces a strictly increasing integer sequence
// ------------------------------------------------------------------
const linear = (step: number, start = step) => (idx: number) => start + (idx - 1) * step;
const geometricSoft = (start: number, ratio: number, cap: number) => (idx: number) => {
  const raw = start * Math.pow(ratio, idx - 1);
  return Math.min(cap, Math.round(raw));
};
// Blended: linear for early tiers (so early game feels frequent), then
// switches to a gentle power curve so 100,000 tiers doesn't require
// absurdly large late-game targets.
const blended = (linStep: number, linCount: number, power: number, scale: number) => (idx: number) => {
  if (idx <= linCount) return idx * linStep;
  const base = linCount * linStep;
  const n = idx - linCount;
  return Math.round(base + scale * Math.pow(n, power));
};

const LAYERS = [
  { id: 'surface', name: '表層泥岩', icon: '🌱' },
  { id: 'shallow', name: '淺層沉積', icon: '🪙' },
  { id: 'crystalline', name: '金石結晶', icon: '💎' },
  { id: 'deepslate_abyss', name: '深板岩裂谷', icon: '🪨' },
  { id: 'nether_core', name: '熔岩地心', icon: '🔥' },
  { id: 'end_void', name: '終界星環', icon: '🪐' },
  { id: 'deep_dark', name: '幽匿深暗', icon: '👁️' },
  { id: 'aether_celestial', name: '以太星輝', icon: '☀️' }
];

/**
 * GROUPS — total adds up to 100,000.
 * Mining-related groups get the largest share since mining is the core loop.
 */
export const ACHIEVEMENT_GROUPS: AchievementGroupDef[] = [
  // 1. Total blocks mined — 25,000 tiers
  {
    groupId: 'mine_total',
    category: 'mining',
    count: 25000,
    icon: '⛏️',
    target: blended(1, 200, 1.62, 6),
    nameZh: (idx, t) => `挖掘先驅 #${idx} (${fmtNum(t)}格)`,
    nameEn: (idx, t) => `Mining Pioneer #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `在挖掘場累計開採達 ${t.toLocaleString()} 個方塊。`,
    descEn: (t) => `Mine a total of ${t.toLocaleString()} blocks.`,
    reward: (_idx, t) => Math.round(Math.min(10000, 15 + Math.sqrt(t) * 2.2)),
    statSelector: (s) => s.totalBlocksMined
  },
  // 2. Click milestones — 10,000 tiers
  {
    groupId: 'click_milestone',
    category: 'mining',
    count: 10000,
    icon: '🔨',
    target: linear(250),
    nameZh: (idx, t) => `勤奮揮鎬 #${idx} (${fmtNum(t)}次)`,
    nameEn: (idx, t) => `Tenacious Swings #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `累計敲擊破壞方塊達 ${t.toLocaleString()} 次。`,
    descEn: (t) => `Hit blocks ${t.toLocaleString()} times in total.`,
    reward: (idx) => 20 + idx * 3,
    statSelector: (s) => s.totalClicks
  },
  // 3. Per-layer progression — 8 layers x 3,000 tiers = 24,000
  ...LAYERS.map((layer, layerIdx): AchievementGroupDef => ({
    groupId: `layer_${layer.id}`,
    category: 'mining',
    count: 3000,
    icon: layer.icon,
    target: blended(50, 60, 1.55, 8),
    nameZh: (idx, t) => `${layer.name}開拓 #${idx} (${fmtNum(t)}格)`,
    nameEn: (idx, t) => `${layer.name} Mastery #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `在「${layer.name}」礦脈層累計挖掘達 ${t.toLocaleString()} 格方塊。`,
    descEn: (t) => `Mine ${t.toLocaleString()} blocks in the ${layer.name} stratum.`,
    reward: (idx, t) => Math.round(20 + idx * 2 + Math.sqrt(t)),
    statSelector: (s) => s.layerMinedCounts[layer.id] || 0
  })),
  // 4. Coins earned (cumulative) — 8,000 tiers
  {
    groupId: 'coin_earned',
    category: 'economy',
    count: 8000,
    icon: '💰',
    target: blended(100, 100, 1.6, 20),
    nameZh: (idx, t) => `巨富傳奇 #${idx} (${fmtNum(t)}幣)`,
    nameEn: (idx, t) => `Wealth Titan #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `累計賺取超過 ${t.toLocaleString()} 遊戲幣。`,
    descEn: (t) => `Earn a total of ${t.toLocaleString()} coins.`,
    reward: (_idx, t) => Math.round(20 + Math.sqrt(t) * 1.5),
    statSelector: (s) => s.totalCoinsEarned
  },
  // 5. Wallet holding tiers — 5,000 tiers
  {
    groupId: 'wallet_tier',
    category: 'economy',
    count: 5000,
    icon: '🪙',
    target: linear(2000),
    nameZh: (idx, t) => `金庫儲備階級 #${idx} (${fmtNum(t)}幣)`,
    nameEn: (idx, t) => `Treasury Reserve #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `當前錢包資金達到 ${t.toLocaleString()} 遊戲幣。`,
    descEn: (t) => `Hold ${t.toLocaleString()} coins at once.`,
    reward: (idx) => 30 + idx * 2,
    statSelector: (s) => s.coins
  },
  // 6. Blocks sold — 6,000 tiers
  {
    groupId: 'sold_blocks',
    category: 'economy',
    count: 6000,
    icon: '📦',
    target: blended(10, 100, 1.5, 15),
    nameZh: (idx, t) => `方塊貿易行大亨 #${idx} (${fmtNum(t)}個)`,
    nameEn: (idx, t) => `Block Merchant #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `在交易所累計成功賣出 ${t.toLocaleString()} 個方塊。`,
    descEn: (t) => `Sell ${t.toLocaleString()} blocks in the market.`,
    reward: (idx) => 30 + idx * 4,
    statSelector: (s) => s.totalBlocksSold
  },
  // 7. Inflation-window trading — 3,000 tiers
  {
    groupId: 'inflation_trader',
    category: 'economy',
    count: 3000,
    icon: '📈',
    target: linear(50),
    nameZh: (idx, t) => `通膨投機大師 #${idx} (${t.toLocaleString()}個)`,
    nameEn: (idx, t) => `Inflation Speculator #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `在市場通貨膨脹爆發期間累計售出 ${t.toLocaleString()} 個方塊。`,
    descEn: (t) => `Sell ${t.toLocaleString()} blocks during high market inflation events.`,
    reward: (idx) => 35 + idx * 2,
    statSelector: (s) => s.blocksSoldDuringInflation
  },
  // 8. Building placed — 5,000 tiers (building zone now 1000 cells)
  {
    groupId: 'build_placed',
    category: 'building',
    count: 5000,
    icon: '🧱',
    target: linear(20),
    nameZh: (idx, t) => `建築藝術家 #${idx} (${fmtNum(t)}塊)`,
    nameEn: (idx, t) => `Architectural Master #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `在建築工坊內累計擺放 ${t.toLocaleString()} 個方塊。`,
    descEn: (t) => `Place a total of ${t.toLocaleString()} blocks in the building zone.`,
    reward: (idx) => 25 + idx * 2,
    statSelector: (s) => s.totalBlocksPlaced
  },
  // 9. Equipment mastery — 2,500 tiers
  {
    groupId: 'equip_mastery',
    category: 'equipment',
    count: 2500,
    icon: '🪓',
    target: linear(1),
    nameZh: (idx) => `鐵匠的榮耀 #${idx}`,
    nameEn: (idx) => `Blacksmith's Honor #${idx}`,
    descZh: (t) => `達成第 ${t} 階鎬具鍛造升級、修復或強化進度。`,
    descEn: (t) => `Complete pickaxe upgrade or repair milestone #${t}.`,
    reward: (idx) => 50 + idx * 4,
    statSelector: (s) => s.equipScore
  },
  // 10. Collection & social — 2,000 tiers
  {
    groupId: 'collection_social',
    category: 'collection',
    count: 2000,
    icon: '🎨',
    target: linear(1),
    nameZh: (idx) => `創世名錄收藏 #${idx}`,
    nameEn: (idx) => `Genesis Collector #${idx}`,
    descZh: (t) => `解鎖第 ${t} 項稀有外觀、主題、收藏或好友社交里程碑。`,
    descEn: (t) => `Unlock rare skins, themes, or social milestones #${t}.`,
    reward: (idx) => 60 + idx * 6,
    statSelector: (s) => s.collectionScore
  },
  // 11. Combat / Training Grounds — 6,500 tiers (new feature)
  {
    groupId: 'monsters_slain',
    category: 'combat' as AchievementCategory,
    count: 4000,
    icon: '⚔️',
    target: blended(5, 200, 1.5, 10),
    nameZh: (idx, t) => `狩獵者印記 #${idx} (${fmtNum(t)}隻)`,
    nameEn: (idx, t) => `Hunter's Mark #${idx} (${t.toLocaleString()})`,
    descZh: (t) => `在打怪練習場累計擊敗 ${t.toLocaleString()} 隻怪物。`,
    descEn: (t) => `Defeat ${t.toLocaleString()} monsters in the Training Grounds.`,
    reward: (idx) => 15 + idx * 2,
    statSelector: (s) => s.totalMonstersKilled
  },
  {
    groupId: 'combat_damage',
    category: 'combat' as AchievementCategory,
    count: 2500,
    icon: '💢',
    target: blended(50, 100, 1.6, 20),
    nameZh: (idx, t) => `戰鬥意志 #${idx} (${fmtNum(t)}點傷害)`,
    nameEn: (idx, t) => `Combat Resolve #${idx} (${t.toLocaleString()} dmg)`,
    descZh: (t) => `在練習場累計造成 ${t.toLocaleString()} 點傷害。`,
    descEn: (t) => `Deal a total of ${t.toLocaleString()} damage in the Training Grounds.`,
    reward: (idx) => 15 + idx * 2,
    statSelector: (s) => s.totalCombatDamageDealt
  }
];

// Sanity: keep this near 100,000 (used only for a dev-time console check)
export const TOTAL_ACHIEVEMENT_COUNT = ACHIEVEMENT_GROUPS.reduce((sum, g) => sum + g.count, 0);

/**
 * Given current game state, returns how many tiers of a group are unlocked
 * via binary search over the group's (monotonic) target function.
 * O(log count) instead of O(count).
 */
export function unlockedTierCount(group: AchievementGroupDef, state: AchievementEngineState): number {
  const statValue = group.statSelector(state);
  let lo = 0;
  let hi = group.count;
  // invariant: tiers [1..lo] are unlocked, tiers (hi..count] are not yet known
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (group.target(mid) <= statValue) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}

export interface DisplayAchievement {
  id: string;
  category: AchievementCategory;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  icon: string;
  coinReward: number;
  target: number;
  unlocked: boolean;
  rewardClaimed: boolean;
}

export function makeAchievementId(groupId: string, idx: number): string {
  return `${groupId}__${idx}`;
}

export function buildDisplayAchievement(
  group: AchievementGroupDef,
  idx: number,
  unlocked: boolean,
  claimedIds: Set<string>
): DisplayAchievement {
  const target = group.target(idx);
  const id = makeAchievementId(group.groupId, idx);
  return {
    id,
    category: group.category,
    nameZh: group.nameZh(idx, target),
    nameEn: group.nameEn(idx, target),
    descZh: group.descZh(target),
    descEn: group.descEn(target),
    icon: group.icon,
    coinReward: group.reward(idx, target),
    target,
    unlocked,
    rewardClaimed: claimedIds.has(id)
  };
}

/**
 * Computes, for every group, the unlocked tier count. This is the ONLY
 * per-tick computation needed — it's O(groups * log(tiersPerGroup)), i.e.
 * a couple hundred operations total, regardless of the 100,000 total tiers.
 */
export function computeUnlockedCounts(state: AchievementEngineState): Record<string, number> {
  const result: Record<string, number> = {};
  for (const group of ACHIEVEMENT_GROUPS) {
    result[group.groupId] = unlockedTierCount(group, state);
  }
  return result;
}

export function getGroupById(groupId: string): AchievementGroupDef | undefined {
  return ACHIEVEMENT_GROUPS.find((g) => g.groupId === groupId);
}

export function parseAchievementId(id: string): { groupId: string; idx: number } | null {
  const sep = id.lastIndexOf('__');
  if (sep === -1) return null;
  const groupId = id.slice(0, sep);
  const idx = parseInt(id.slice(sep + 2), 10);
  if (isNaN(idx)) return null;
  return { groupId, idx };
}
