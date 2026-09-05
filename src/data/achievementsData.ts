import { Achievement, AchievementCategory } from '../types';

function build1000Achievements(): Achievement[] {
  const list: Achievement[] = [];

  // Helper to push
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

  // ==========================================
  // GROUP 1: 全局開採大師 (Mining Milestones) - 200 項
  // ==========================================
  const miningMilestones = [
    1, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 65, 80, 100, 125, 150, 175, 200, 250, 300,
    350, 400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
    6000, 7000, 8000, 9000, 10000, 12000, 14000, 16000, 18000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
    60000, 70000, 80000, 90000, 100000, 120000, 140000, 160000, 180000, 200000, 250000, 300000, 350000, 400000,
    450000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000,
    1700000, 1800000, 1900000, 2000000, 2200000, 2400000, 2600000, 2800000, 3000000, 3200000, 3400000, 3600000,
    3800000, 4000000, 4500000, 5000000, 6000000
  ]; // 100 items

  miningMilestones.forEach((target, idx) => {
    const reward = Math.round(Math.min(10000, 15 + Math.sqrt(target) * 3));
    addAch(
      `mine_total_${target}`,
      'mining',
      `挖掘先驅 #${idx + 1} (${target >= 10000 ? `${target / 10000}萬格` : `${target}格`})`,
      `Mining Pioneer #${idx + 1}`,
      `在挖掘場累計開採達 ${target.toLocaleString()} 個方塊。`,
      `Mine a total of ${target.toLocaleString()} blocks.`,
      target >= 1000000 ? '🌌' : target >= 50000 ? '⚡' : '⛏️',
      reward
    );
  });

  // Additional 100 Click & Mining Speed Milestones
  for (let i = 1; i <= 100; i++) {
    const targetClicks = i * 250;
    addAch(
      `click_milestone_${i}`,
      'mining',
      `勤奮揮鎬 #${i} (${targetClicks.toLocaleString()}次敲擊)`,
      `Tenacious Swings #${i}`,
      `累計敲擊破壞方塊達 ${targetClicks.toLocaleString()} 次。`,
      `Hit blocks ${targetClicks.toLocaleString()} times in total.`,
      i % 10 === 0 ? '💥' : '🔨',
      20 + i * 8
    );
  }

  // ==========================================
  // GROUP 2: 八大地層專精 (Layer Progression) - 200 項 (8 層 x 25 項)
  // ==========================================
  const layersInfo = [
    { id: 'surface', name: '表層泥岩', icon: '🌱' },
    { id: 'shallow', name: '淺層沉積', icon: '🪙' },
    { id: 'crystalline', name: '金石結晶', icon: '💎' },
    { id: 'deepslate_abyss', name: '深板岩裂谷', icon: '🪨' },
    { id: 'nether_core', name: '熔岩地心', icon: '🔥' },
    { id: 'end_void', name: '終界星環', icon: '🪐' },
    { id: 'deep_dark', name: '幽匿深暗', icon: '👁️' },
    { id: 'aether_celestial', name: '以太星輝', icon: '☀️' }
  ];

  const layerStepTargets = [
    100, 300, 600, 1000, 1500, 2000, 3000, 4500, 6000, 8000,
    10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 75000, 90000,
    100000, // 100,000 unlocks next!
    120000, 150000, 200000, 250000
  ]; // 25 targets per layer

  layersInfo.forEach((layer) => {
    layerStepTargets.forEach((tgt, stepIdx) => {
      const isUnlockStep = tgt === 100000;
      addAch(
        `layer_${layer.id}_${tgt}`,
        'mining',
        `${layer.name}開拓 #${stepIdx + 1} (${tgt >= 10000 ? `${tgt / 10000}萬格` : `${tgt}格`})`,
        `${layer.name} Mastery #${stepIdx + 1}`,
        `在「${layer.name}」礦脈層累計挖掘達 ${tgt.toLocaleString()} 格方塊${isUnlockStep ? '（達成10萬格解鎖下層資格！）' : ''}。`,
        `Mine ${tgt.toLocaleString()} blocks in the ${layer.name} stratum.`,
        isUnlockStep ? '🔓' : layer.icon,
        isUnlockStep ? 800 : 25 + stepIdx * 15
      );
    });
  });

  // ==========================================
  // GROUP 3: 財富累積與經濟大亨 (Economy & Coins) - 180 項
  // ==========================================
  const coinTargets = [
    100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000,
    10000, 15000, 20000, 30000, 40000, 50000, 70000, 100000, 140000, 200000,
    280000, 400000, 600000, 800000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000
  ]; // 30 big targets

  coinTargets.forEach((c, idx) => {
    addAch(
      `coin_earned_${c}`,
      'economy',
      `巨富傳奇 #${idx + 1} (${c >= 10000 ? `${c / 10000}萬幣` : `${c}幣`})`,
      `Wealth Titan #${idx + 1}`,
      `累計賺取超過 ${c.toLocaleString()} 遊戲幣。`,
      `Earn a total of ${c.toLocaleString()} coins.`,
      c >= 1000000 ? '👑' : '💰',
      Math.round(20 + Math.sqrt(c) * 1.8)
    );
  });

  // 150 more detailed coin wallet & earnings milestones
  for (let i = 1; i <= 150; i++) {
    const val = i * 2000;
    addAch(
      `wallet_tier_${i}`,
      'economy',
      `金庫儲備階級 #${i} (${val >= 10000 ? `${val / 10000}萬` : val}幣)`,
      `Treasury Reserve #${i}`,
      `當前錢包資金或財富達到 ${val.toLocaleString()} 遊戲幣。`,
      `Accumulate or hold ${val.toLocaleString()} coins.`,
      '🪙',
      30 + Math.floor(i * 3)
    );
  }

  // ==========================================
  // GROUP 4: 市場交易與隨機通膨 (Trade & Inflation) - 150 項
  // ==========================================
  const sellBlocksTargets = [
    10, 25, 50, 100, 150, 200, 300, 450, 600, 800, 1000, 1500, 2000, 3000, 4500,
    6000, 8000, 10000, 15000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 1000000
  ]; // 30 milestones

  sellBlocksTargets.forEach((s, idx) => {
    addAch(
      `sold_blocks_${s}`,
      'economy',
      `方塊貿易行大亨 #${idx + 1} (${s >= 10000 ? `${s / 10000}萬個` : `${s}個`})`,
      `Block Merchant #${idx + 1}`,
      `在交易所累計成功賣出 ${s.toLocaleString()} 個方塊。`,
      `Sell ${s.toLocaleString()} blocks in the market.`,
      '📦',
      30 + idx * 25
    );
  });

  // 120 Market Inflation Trading Achievements (抓住通膨熱潮、高價賣出)
  for (let i = 1; i <= 120; i++) {
    const inflTarget = i * 50;
    addAch(
      `inflation_trader_${i}`,
      'economy',
      `通膨投機大師 #${i} (${inflTarget}個方塊)`,
      `Inflation Speculator #${i}`,
      `在市場通貨膨脹（+80% 以上高倍率）爆發期間累計售出 ${inflTarget.toLocaleString()} 個方塊。`,
      `Sell ${inflTarget.toLocaleString()} blocks during high market inflation events.`,
      i % 5 === 0 ? '🔥' : '📈',
      35 + i * 4
    );
  }

  // ==========================================
  // GROUP 5: 100格建築創作巨匠 (Building Zone) - 120 項
  // ==========================================
  for (let i = 1; i <= 120; i++) {
    const placed = i * 20;
    addAch(
      `build_placed_${i}`,
      'building',
      `建築藝術家 #${i} (${placed}塊結構)`,
      `Architectural Master #${i}`,
      `在 100 格建築工坊內累計擺放 ${placed.toLocaleString()} 個方塊。`,
      `Place a total of ${placed.toLocaleString()} blocks in the building zone.`,
      i >= 50 ? '🏰' : '🧱',
      25 + i * 3
    );
  }

  // ==========================================
  // GROUP 6: 裝備鍛造、修復與附魔 (Equipment) - 80 項
  // ==========================================
  for (let i = 1; i <= 80; i++) {
    addAch(
      `equip_mastery_${i}`,
      'equipment',
      `鐵匠的榮耀 #${i}`,
      `Blacksmith's Honor #${i}`,
      `達成第 ${i} 階鎬具鍛造升級、修復損耗或極限強化進度。`,
      `Complete pickaxe upgrade or durability repair milestone #${i}.`,
      '🪓',
      50 + i * 5
    );
  }

  // ==========================================
  // GROUP 7: 收藏家、好友與稀有探索 (Collection & Social) - 70 項
  // ==========================================
  for (let i = 1; i <= 70; i++) {
    addAch(
      `collection_social_${i}`,
      'collection',
      `創世名錄收藏 #${i}`,
      `Genesis Collector #${i}`,
      `解鎖第 ${i} 項稀有外觀、主題秘境、珍稀神礦收藏或好友社交同盟標誌。`,
      `Unlock rare skins, themes, cosmic ores, or social milestones #${i}.`,
      i % 10 === 0 ? '✨' : '🎨',
      60 + i * 8
    );
  }

  return list;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = build1000Achievements();
