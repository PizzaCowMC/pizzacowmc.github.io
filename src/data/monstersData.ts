import { MonsterData } from '../types';

export const MONSTER_TEMPLATES: MonsterData[] = [
  {
    id: 'zombie',
    nameZh: '綠皮殭屍',
    nameEn: 'Zombie',
    iconEmoji: '🧟',
    maxHp: 100,
    currentHp: 100,
    coinReward: 80,
    dropItemId: 'rotten_flesh',
    dropItemNameZh: '腐肉',
    dropItemNameEn: 'Rotten Flesh',
    dropAmount: 2,
    descZh: '夜晚礦坑最常出沒的腐化亡靈，動作緩慢但數量眾多。',
    descEn: 'A standard undead mob found roaming dark caverns. Slay it with a sword!',
    bgGradient: 'from-emerald-950 via-zinc-900 to-emerald-900',
    rarity: 'common'
  },
  {
    id: 'skeleton',
    nameZh: '神射骷髏',
    nameEn: 'Skeleton Archer',
    iconEmoji: '💀',
    maxHp: 140,
    currentHp: 140,
    coinReward: 120,
    dropItemId: 'bone',
    dropItemNameZh: '骨頭',
    dropItemNameEn: 'Bone',
    dropAmount: 3,
    descZh: '手持骨弓的骷髏射手，發出令人毛骨悚然的骨骼碰撞聲。',
    descEn: 'Bony archer armed with a deadly bow. Swift sword strikes will shatter it!',
    bgGradient: 'from-stone-900 via-zinc-900 to-stone-800',
    rarity: 'common'
  },
  {
    id: 'spider',
    nameZh: '劇毒洞穴蜘蛛',
    nameEn: 'Cave Spider',
    iconEmoji: '🕷️',
    maxHp: 160,
    currentHp: 160,
    coinReward: 150,
    dropItemId: 'string',
    dropItemNameZh: '蜘蛛絲',
    dropItemNameEn: 'Spider String',
    dropAmount: 2,
    descZh: '潛伏在廢棄礦坑天花板上的多足生物，吐出黏膩蛛絲。',
    descEn: 'Fast skittering arachnid in dark shafts. Use your blade to cut through webs!',
    bgGradient: 'from-purple-950 via-zinc-900 to-neutral-900',
    rarity: 'common'
  },
  {
    id: 'creeper',
    nameZh: '伏擊苦力怕',
    nameEn: 'Sneaky Creeper',
    iconEmoji: '💥',
    maxHp: 220,
    currentHp: 220,
    coinReward: 240,
    dropItemId: 'gunpowder',
    dropItemNameZh: '烈性火藥',
    dropItemNameEn: 'Gunpowder',
    dropAmount: 3,
    descZh: '嘶嘶作響的無聲殺手！若不及時用劍斬殺，小心引發大爆炸！',
    descEn: 'Hissing silent creeper! Strike with your sword quickly before it detonates!',
    bgGradient: 'from-lime-950 via-green-950 to-zinc-900',
    rarity: 'rare'
  },
  {
    id: 'piglin',
    nameZh: '狂暴殭屍豬布林',
    nameEn: 'Zombified Piglin',
    iconEmoji: '🐷',
    maxHp: 280,
    currentHp: 280,
    coinReward: 320,
    dropItemId: 'gold_nugget',
    dropItemNameZh: '金粒',
    dropItemNameEn: 'Gold Nugget',
    dropAmount: 4,
    descZh: '來自下界的黃金狂熱者，手握金劍，戰鬥力頑強。',
    descEn: 'Nether warrior hungry for shiny treasure. High resilience and golden loot!',
    bgGradient: 'from-amber-950 via-red-950 to-zinc-950',
    rarity: 'rare'
  },
  {
    id: 'enderman',
    nameZh: '終界使者',
    nameEn: 'Enderman',
    iconEmoji: '👾',
    maxHp: 380,
    currentHp: 380,
    coinReward: 480,
    dropItemId: 'ender_pearl',
    dropItemNameZh: '終界珍珠',
    dropItemNameEn: 'Ender Pearl',
    dropAmount: 1,
    descZh: '黑曜石般的纖長身軀，散發紫色粒子，直視其雙眼將引來瞬移追殺！',
    descEn: 'Tall shadow-walker with violet particles. Wield your sword for high rewards!',
    bgGradient: 'from-violet-950 via-fuchsia-950 to-zinc-950',
    rarity: 'elite'
  },
  {
    id: 'warden',
    nameZh: '幽匿深暗伏守者',
    nameEn: 'Sculk Warden',
    iconEmoji: '👹',
    maxHp: 750,
    currentHp: 750,
    coinReward: 1600,
    dropItemId: 'echo_shard',
    dropItemNameZh: '回音碎片',
    dropItemNameEn: 'Echo Shard',
    dropAmount: 5,
    descZh: '【深層傳奇首領】地底最深處的盲眼巨獸，憑藉胸口靈魂震動發動音波猛擊！',
    descEn: '【Deep Dark Titan Boss】Blind colossus that senses vibrations. Huge coin bounty!',
    bgGradient: 'from-cyan-950 via-teal-950 to-zinc-950',
    rarity: 'boss'
  }
];

// Spawn a random monster based on stratum or pure chance
export function spawnRandomMonster(layerIndex: number = 0): MonsterData {
  let pool = MONSTER_TEMPLATES.filter(m => m.rarity === 'common');

  if (layerIndex >= 2) {
    pool = [...pool, ...MONSTER_TEMPLATES.filter(m => m.rarity === 'rare')];
  }
  if (layerIndex >= 4) {
    pool = [...pool, ...MONSTER_TEMPLATES.filter(m => m.rarity === 'elite')];
  }
  if (layerIndex >= 6 && Math.random() < 0.25) {
    pool = [MONSTER_TEMPLATES.find(m => m.rarity === 'boss')!];
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)] || MONSTER_TEMPLATES[0];

  return {
    ...chosen,
    currentHp: chosen.maxHp
  };
}
