import { AxeTier, ShovelTier, SwordTier, BlockType, ToolType } from '../types';

export const AXE_TIERS: AxeTier[] = [
  {
    id: 'bare_hand_axe',
    nameZh: '徒手劈木',
    nameEn: 'Bare Hands',
    tier: 0,
    cost: 0,
    speedMultiplier: 1.0,
    attackDamage: 2,
    maxDurability: 999999,
    color: '#e5e5e5',
    bgGradient: 'from-zinc-700 to-zinc-900',
    desc: '徒手敲擊木頭，效率一般且無額外加成。'
  },
  {
    id: 'wood_axe',
    nameZh: '木斧',
    nameEn: 'Wooden Axe',
    tier: 1,
    cost: 60,
    speedMultiplier: 2.2,
    attackDamage: 10,
    maxDurability: 70,
    color: '#b47846',
    bgGradient: 'from-amber-900 to-amber-950',
    desc: '初級伐木工具，採伐木材速度提升 120%，對生物具備微弱擊退。'
  },
  {
    id: 'stone_axe',
    nameZh: '石斧',
    nameEn: 'Stone Axe',
    tier: 2,
    cost: 220,
    speedMultiplier: 3.8,
    attackDamage: 18,
    maxDurability: 160,
    color: '#9e9e9e',
    bgGradient: 'from-stone-600 to-stone-800',
    desc: '堅固石刃斧，採伐木頭極為順暢，耐久 160。'
  },
  {
    id: 'iron_axe',
    nameZh: '鐵斧',
    nameEn: 'Iron Axe',
    tier: 3,
    cost: 680,
    speedMultiplier: 6.5,
    attackDamage: 32,
    maxDurability: 350,
    color: '#e2e8f0',
    bgGradient: 'from-slate-400 to-slate-700',
    desc: '專業級精鐵伐木斧，6.5 倍伐木速度，耐久 350。'
  },
  {
    id: 'gold_axe',
    nameZh: '金斧',
    nameEn: 'Golden Axe',
    tier: 4,
    cost: 1350,
    speedMultiplier: 11.0,
    attackDamage: 36,
    maxDurability: 130,
    color: '#facc15',
    bgGradient: 'from-yellow-500 to-amber-700',
    desc: '華麗耀眼的金斧，極速 11 倍劈碎木頭，但耐久較低。'
  },
  {
    id: 'diamond_axe',
    nameZh: '鑽石斧',
    nameEn: 'Diamond Axe',
    tier: 5,
    cost: 3500,
    speedMultiplier: 10.0,
    attackDamage: 55,
    maxDurability: 900,
    color: '#38bdf8',
    bgGradient: 'from-cyan-500 to-blue-700',
    desc: '傳奇鑽石戰斧，10 倍超高伐木速與 900 超長耐久。'
  },
  {
    id: 'netherite_axe',
    nameZh: '獄髓戰斧',
    nameEn: 'Netherite Battleaxe',
    tier: 6,
    cost: 8500,
    speedMultiplier: 15.0,
    attackDamage: 85,
    maxDurability: 2400,
    color: '#64748b',
    bgGradient: 'from-neutral-800 to-violet-950',
    desc: '地獄合金鑄就的劈砍神器，狂暴 15 倍伐木與 2400 耐久！'
  },
  {
    id: 'celestial_axe',
    nameZh: '天界裂魂神斧',
    nameEn: 'Celestial Soul-Cleaver',
    tier: 7,
    cost: 42000,
    speedMultiplier: 35.0,
    attackDamage: 180,
    maxDurability: 9999,
    color: '#fde047',
    bgGradient: 'from-amber-400 via-yellow-600 to-amber-950',
    desc: '創世主之斧！一擊斬斷遠古森林，近乎無限的 9999 耐久！'
  }
];

export const SHOVEL_TIERS: ShovelTier[] = [
  {
    id: 'bare_hand_shovel',
    nameZh: '徒手挖土',
    nameEn: 'Bare Hands',
    tier: 0,
    cost: 0,
    speedMultiplier: 1.0,
    maxDurability: 999999,
    color: '#e5e5e5',
    bgGradient: 'from-zinc-700 to-zinc-900',
    desc: '用雙手撥動泥沙，雖無限耐久但挖掘緩慢。'
  },
  {
    id: 'wood_shovel',
    nameZh: '木鏟',
    nameEn: 'Wooden Shovel',
    tier: 1,
    cost: 45,
    speedMultiplier: 2.4,
    maxDurability: 65,
    color: '#b47846',
    bgGradient: 'from-amber-900 to-amber-950',
    desc: '簡易木鏟，挖掘泥土、沙子速度提升 140%，耐久 65。'
  },
  {
    id: 'stone_shovel',
    nameZh: '石鏟',
    nameEn: 'Stone Shovel',
    tier: 2,
    cost: 180,
    speedMultiplier: 4.0,
    maxDurability: 150,
    color: '#9e9e9e',
    bgGradient: 'from-stone-600 to-stone-800',
    desc: '厚實石鏟，翻土掘砂 4.0 倍速，耐久 150。'
  },
  {
    id: 'iron_shovel',
    nameZh: '鐵鏟',
    nameEn: 'Iron Shovel',
    tier: 3,
    cost: 550,
    speedMultiplier: 6.8,
    maxDurability: 340,
    color: '#e2e8f0',
    bgGradient: 'from-slate-400 to-slate-700',
    desc: '高強度精鐵拓土鏟，6.8 倍挖掘土壤，耐久 340。'
  },
  {
    id: 'gold_shovel',
    nameZh: '金鏟',
    nameEn: 'Golden Shovel',
    tier: 4,
    cost: 1100,
    speedMultiplier: 11.5,
    maxDurability: 120,
    color: '#facc15',
    bgGradient: 'from-yellow-500 to-amber-700',
    desc: '極速金鏟，瞬間掏空沙土！11.5 倍極速，耐久 120。'
  },
  {
    id: 'diamond_shovel',
    nameZh: '鑽石鏟',
    nameEn: 'Diamond Shovel',
    tier: 5,
    cost: 2800,
    speedMultiplier: 10.5,
    maxDurability: 880,
    color: '#38bdf8',
    bgGradient: 'from-cyan-500 to-blue-700',
    desc: '傳奇鑽石鏟，10.5 倍速與 880 耐久，挖掘泥沙如流水。'
  },
  {
    id: 'netherite_shovel',
    nameZh: '獄髓拓荒鏟',
    nameEn: 'Netherite Pioneer Shovel',
    tier: 6,
    cost: 7000,
    speedMultiplier: 15.5,
    maxDurability: 2300,
    color: '#64748b',
    bgGradient: 'from-neutral-800 to-violet-950',
    desc: '地底拓荒神器，15.5 倍超速清理靈魂沙與各類土壤！'
  },
  {
    id: 'celestial_shovel',
    nameZh: '萬物重塑星神鏟',
    nameEn: 'Cosmic Shovel of Terraform',
    tier: 7,
    cost: 36000,
    speedMultiplier: 36.0,
    maxDurability: 9999,
    color: '#fde047',
    bgGradient: 'from-amber-400 via-yellow-600 to-amber-950',
    desc: '星神塑形聖器！瞬間移山填海，近乎無限的 9999 耐久！'
  }
];

export const SWORD_TIERS: SwordTier[] = [
  {
    id: 'wood_sword',
    nameZh: '木劍',
    nameEn: 'Wooden Sword',
    tier: 1,
    cost: 80,
    attackDamage: 25,
    critChance: 0.12,
    maxDurability: 80,
    color: '#b47846',
    bgGradient: 'from-amber-900 to-amber-950',
    desc: '防身必備新手武器，基礎攻擊力 25，對抗夜間怪物。'
  },
  {
    id: 'stone_sword',
    nameZh: '石劍',
    nameEn: 'Stone Sword',
    tier: 2,
    cost: 260,
    attackDamage: 45,
    critChance: 0.18,
    maxDurability: 180,
    color: '#9e9e9e',
    bgGradient: 'from-stone-600 to-stone-800',
    desc: '沉重鋒利的石刃劍，攻擊力 45，可迅速斬殺殭屍與骷髏。'
  },
  {
    id: 'iron_sword',
    nameZh: '鐵劍',
    nameEn: 'Iron Sword',
    tier: 3,
    cost: 750,
    attackDamage: 75,
    critChance: 0.22,
    maxDurability: 420,
    color: '#e2e8f0',
    bgGradient: 'from-slate-400 to-slate-700',
    desc: '騎士精鍛鋼劍，攻擊力 75，具備 22% 暴擊機率，耐久 420。'
  },
  {
    id: 'gold_sword',
    nameZh: '金劍',
    nameEn: 'Golden Sword',
    tier: 4,
    cost: 1400,
    attackDamage: 90,
    critChance: 0.38,
    maxDurability: 150,
    color: '#facc15',
    bgGradient: 'from-yellow-500 to-amber-700',
    desc: '附魔黃金聖刃，揮擊速度飛快，暴擊率高達 38%！'
  },
  {
    id: 'diamond_sword',
    nameZh: '鑽石劍',
    nameEn: 'Diamond Sword',
    tier: 5,
    cost: 3900,
    attackDamage: 140,
    critChance: 0.28,
    maxDurability: 1200,
    color: '#38bdf8',
    bgGradient: 'from-cyan-500 to-blue-700',
    desc: '英雄傳奇神兵，攻擊力 140，斬妖除魔銳不可擋，耐久 1200。'
  },
  {
    id: 'netherite_sword',
    nameZh: '獄髓鋒刃',
    nameEn: 'Netherite Blade',
    tier: 6,
    cost: 9800,
    attackDamage: 220,
    critChance: 0.35,
    maxDurability: 2800,
    color: '#64748b',
    bgGradient: 'from-neutral-800 to-violet-950',
    desc: '地獄深淵至尊寶劍，狂暴 220 傷害與 35% 致命暴擊！'
  },
  {
    id: 'celestial_sword',
    nameZh: '創世王者神劍',
    nameEn: 'Celestial Excalibur',
    tier: 7,
    cost: 48000,
    attackDamage: 450,
    critChance: 0.50,
    maxDurability: 9999,
    color: '#fde047',
    bgGradient: 'from-amber-400 via-yellow-600 to-amber-950',
    desc: '創世神劍！50% 毀滅暴擊與 450 霸道傷害，秒殺一切邪惡生物！'
  }
];

// Determine the optimal tool for a block
export function getBestToolForBlock(block: BlockType): ToolType {
  const bId = block.id.toLowerCase();
  const pType = (block.pixelType || '').toLowerCase();

  // Wood / logs / planks / leaves
  if (
    bId.includes('wood') ||
    bId.includes('log') ||
    bId.includes('plank') ||
    pType.includes('wood') ||
    bId.includes('pumpkin')
  ) {
    return 'axe';
  }

  // Dirt / sand / gravel / clay / soul sand
  if (
    bId.includes('dirt') ||
    bId.includes('sand') ||
    bId.includes('gravel') ||
    bId.includes('clay') ||
    bId.includes('mud') ||
    pType.includes('dirt') ||
    pType.includes('sand') ||
    pType.includes('gravel')
  ) {
    return 'shovel';
  }

  // Otherwise standard pickaxe
  return 'pickaxe';
}
