import { Achievement, AchievementCategory } from '../types';

/**
 * ONE-OFF ACHIEVEMENTS
 * ---------------------
 * These are hand-written, single-fire achievements triggered by specific
 * in-game events (e.g. "sell a diamond for the first time") rather than by
 * crossing a numeric milestone. There are only a few dozen of these, so it's
 * fine to store each one's `unlocked` / `rewardClaimed` state directly.
 *
 * The bulk of the game's 100,000 achievements are NOT defined here — see
 * src/data/achievementEngine.ts for the formula-driven, storage-light system
 * that covers all numeric-milestone achievements (mining totals, coins
 * earned, monsters slain, etc).
 */
function buildOneOffAchievements(): Achievement[] {
  const list: Achievement[] = [];

  const addAch = (
    id: string,
    category: AchievementCategory,
    nameZh: string,
    nameEn: string,
    descZh: string,
    descEn: string,
    icon: string,
    coinReward: number
  ) => {
    list.push({
      id,
      category,
      nameZh,
      nameEn,
      descZh,
      descEn,
      icon,
      coinReward,
      unlocked: false,
      rewardClaimed: false
    });
  };

  addAch('pick_break_recovery', 'equipment', '鎬具浴火重生', 'Pickaxe Phoenix', '鎬具耐久歸零損壞後，成功重新升級或修復。', 'Recover from a broken pickaxe by upgrading or repairing it.', '🔥', 40);
  addAch('build_reclaim_1', 'building', '初次回收', 'First Reclaim', '在建築工地首次點擊已放置的方塊將其回收。', 'Reclaim your first placed block in the building zone.', '♻️', 15);
  addAch('build_clear_all', 'building', '大掃除', 'Clean Slate', '一次性清空整個建築工地並返還所有方塊。', 'Clear the entire building zone at once.', '🧹', 20);
  addAch('sell_diamond_single', 'economy', '鑽石初賣', 'First Diamond Sale', '在交易所首次賣出一顆鑽石。', 'Sell a diamond in the market for the first time.', '💎', 25);
  addAch('sell_emerald_single', 'economy', '綠寶石初賣', 'First Emerald Sale', '在交易所首次賣出一顆綠寶石。', 'Sell an emerald in the market for the first time.', '💚', 25);
  addAch('sell_ancient_debris', 'economy', '遠古殘骸初賣', 'Ancient Debris Sale', '在交易所首次賣出遠古殘骸。', 'Sell an ancient debris in the market for the first time.', '🟫', 35);
  addAch('sell_dirt_50', 'economy', '泥土大拍賣', 'Dirt Clearance Sale', '一次性賣出 50 個泥土。', 'Sell 50 dirt blocks in a single transaction.', '🟤', 10);
  addAch('sell_cobble_50', 'economy', '圓石大拍賣', 'Cobblestone Clearance Sale', '一次性賣出 50 個圓石。', 'Sell 50 cobblestone blocks in a single transaction.', '⬜', 10);
  addAch('sell_single_trade_500', 'economy', '單筆大交易 I', 'Big Trade I', '單筆交易獲利達到 500 遊戲幣。', 'Earn 500 coins in a single market transaction.', '💵', 30);
  addAch('sell_single_trade_1500', 'economy', '單筆大交易 II', 'Big Trade II', '單筆交易獲利達到 1500 遊戲幣。', 'Earn 1,500 coins in a single market transaction.', '💴', 60);
  addAch('quick_sell_all', 'economy', '一鍵清倉', 'Quick Sell Master', '使用一鍵賣出功能清空整個庫存。', 'Use quick-sell to sell your entire inventory at once.', '⚡', 20);
  addAch('repair_pick_1', 'equipment', '初次修復', 'First Repair', '首次花費遊戲幣修復鎬具耐久。', 'Repair your pickaxe for the first time.', '🔧', 15);
  addAch('social_friend_reward_claim', 'social', '好友同盟', 'Friendship Bonus', '成功加入至少一位好友並領取好友獎勵。', 'Add at least one friend and claim the friendship reward.', '🤝', 100);
  addAch('combat_first_kill', 'combat', '初戰告捷', 'First Blood', '在打怪練習場首次擊敗一隻怪物。', 'Defeat your first monster in the Training Grounds.', '⚔️', 10);
  addAch('combat_arena_visit', 'combat', '踏入戰場', 'Enter the Arena', '首次進入打怪練習場。', 'Visit the Training Grounds for the first time.', '🏟️', 5);

  return list;
}

export const ONE_OFF_ACHIEVEMENTS: Achievement[] = buildOneOffAchievements();

// Kept for backward compatibility with any code that hasn't migrated yet.
export const INITIAL_ACHIEVEMENTS: Achievement[] = ONE_OFF_ACHIEVEMENTS;
