import { CafeDish, DishCategory, DishRarity } from '../types';

// Base prefixes and descriptors for culinary naming
const COFFEE_BASES = [
  '義式濃縮', '深焙美式', '焦糖瑪奇朵', '絲絨拿鐵', '冷萃黑咖啡',
  '卡布奇諾', '摩卡奇諾', '燕麥奶馥芮白', '生椰冰拿鐵', '炭焙維也納',
  '冰滴特調', '手沖精選', '阿芙佳朵', '抹茶咖啡', '肉桂卡布',
  '榛果拿鐵', '海鹽奶蓋美式', '香草雙倍濃縮', '斑蘭冷萃', '蜜香手沖'
];

const TEA_BASES = [
  '高山烏龍', '皇家伯爵茶', '茉莉花草綠茶', '錫蘭紅茶拿鐵', '青提氣泡果茶',
  '四季春青茶', '白桃烏龍冷泡', '大吉嶺晨光茶', '玫瑰洛神花茶', '冬瓜檸檬甘露',
  '抹茶生乳酪', '香茅青檸冰飲', '桂花蜜釀烏龍', '薄荷清涼花果飲', '玄米玉露'
];

const PASTRY_BASES = [
  '可頌麵包', '舒芙蕾鬆餅', '巴斯克乳酪蛋糕', '生巧克力布朗尼', '法式馬卡龍',
  '草莓千層酥', '提拉米蘇', '焦糖烤布蕾', '藍莓丹麥酥', '熔岩巧克力塔',
  '肉桂捲', '戚風蛋糕', '檸檬生乳塔', '焦糖布丁', '司康餅配果醬'
];

const HOT_MEAL_BASES = [
  '石鍋拌飯', '濃醇豚骨拉麵', '黑椒鐵板牛排', '窯烤薄脆披薩', '奶油蘑菇燉飯',
  '咖哩牛肉飯', '日式炙燒炸豬排', '香濃起司漢堡', '煙燻鮭魚三明治', '義式肉醬千層麵',
  '海鮮焗烤飯', '法式洋蔥濃湯', '鮮蝦天婦羅烏龍', '韓式泡菜火鍋', '炙燒骰子牛'
];

const VOID_BASES = [
  '末影珍珠果凍飲', '紫珀水晶凍', '虛空懸浮舒芙蕾', '末地燭光慕斯', '龍息煙燻漢堡',
  '零重力漂浮茶', '末影結晶糖', '虛空黑洞杯子蛋糕', '紫珀晶核拿鐵', '星環星屑奶昔'
];

const DEEP_DARK_BASES = [
  '幽匿菌毯黑松露燉飯', '迴響音波舒芙蕾', '深邃暗夜特調', '無光深穴甘泉飲', '古城守望者濃湯',
  '幽暗催化可可', '心跳共振布丁', '避光深層冷萃', '地底苔蘚沙拉', '幽暗迴音脆餅'
];

const CELESTIAL_BASES = [
  '星光棉花糖拿鐵', '耀陽結晶水果派', '天界極光聖代', '以太雲朵舒芙蕾', '彗星香草泡芙',
  '日光結晶氣泡水', '天使羽翼雪花冰', '星雲漸層特調', '天國甘露奶綠', '太陽風暴馬卡龍'
];

const SINGULARITY_BASES = [
  '時空暗岩分子料理', '時間倒流草莓塔', '暗物質黑芝麻奶昔', '重力透鏡藍莓塔', '事件視界極黑拿鐵',
  '相對論甜甜圈', '量子糾纏特調', '時鐘發條脆餅', '奇異引力可麗餅', '時間裂縫千層派'
];

const GENESIS_BASES = [
  '混沌原質幻彩馬卡龍', '寰宇神殿金箔壽司', '大霹靂餘燼炙烤和牛', '創世源生水果聖代', '太初原液氣泡特飲',
  '宇宙母核巧克力球', '萬物初始濃湯', '創世星雲舒芙蕾', '神域七彩雪酪', '奇點大爆炸聖代'
];

const MYTHIC_BASES = [
  '全知全能終極特調', '無限永恆維度神飲', '萬界創世原點御膳', '神聖造物主千層派', '超神性星海甘露',
  '因果律法則盛宴', '原初真理龍涎聖代', '超越者彩虹甘露', '至尊王座香檳', '登峰造極滿漢全席'
];

const MINERAL_PREFIXES = [
  { nameZh: '純淨泥土', nameEn: 'Earth', blockId: 'dirt', tier: 1 },
  { nameZh: '橡木原香', nameEn: 'Oak', blockId: 'wood', tier: 1 },
  { nameZh: '岩石深焙', nameEn: 'Stone-Roasted', blockId: 'cobblestone', tier: 1 },
  { nameZh: '炭火烘焙', nameEn: 'Charcoal Roasted', blockId: 'coal_ore', tier: 1 },
  { nameZh: '古銅金黃', nameEn: 'Copper Glazed', blockId: 'copper_ore', tier: 1 },
  { nameZh: '玄鐵精釀', nameEn: 'Iron-Crafted', blockId: 'iron_ore', tier: 2 },
  { nameZh: '金箔奢華', nameEn: 'Golden Leaf', blockId: 'gold_ore', tier: 2 },
  { nameZh: '紅石活力', nameEn: 'Redstone Energized', blockId: 'redstone_ore', tier: 2 },
  { nameZh: '青金石海洋', nameEn: 'Lapis Lazuli', blockId: 'lapis_ore', tier: 2 },
  { nameZh: '璀璨鑽石', nameEn: 'Diamond Glitz', blockId: 'diamond_ore', tier: 3 },
  { nameZh: '翡翠皇家', nameEn: 'Emerald Royal', blockId: 'emerald_ore', tier: 3 },
  { nameZh: '紫水晶晶霜', nameEn: 'Amethyst Crystalline', blockId: 'amethyst_cluster', tier: 3 },
  { nameZh: '深板岩凝萃', nameEn: 'Deepslate Cold', blockId: 'deepslate_diamond', tier: 3 },
  { nameZh: '地獄烈焰', nameEn: 'Nether Inferno', blockId: 'netherrack', tier: 4 },
  { nameZh: '螢石日光', nameEn: 'Glowstone Luminous', blockId: 'glowstone', tier: 4 },
  { nameZh: '石英極品細糖', nameEn: 'Quartz Fine Sugar', blockId: 'quartz_ore', tier: 4 },
  { nameZh: '遠古殘骸沉香', nameEn: 'Ancient Debris Aged', blockId: 'ancient_debris', tier: 4 },
  { nameZh: '末影虛空', nameEn: 'Ender Void', blockId: 'end_stone', tier: 5 },
  { nameZh: '紫珀琉璃', nameEn: 'Purpur Glass', blockId: 'purpur', tier: 5 },
  { nameZh: '幽匿共振', nameEn: 'Sculk Resonance', blockId: 'sculk', tier: 5 },
  { nameZh: '迴響靈魂', nameEn: 'Echo Soul', blockId: 'echo_shard', tier: 5 },
  { nameZh: '天界星光', nameEn: 'Celestial Starlight', blockId: 'starlight_stone', tier: 6 },
  { nameZh: '耀陽烈日', nameEn: 'Sunstone Blaze', blockId: 'sunstone', tier: 6 },
  { nameZh: '極光以太', nameEn: 'Aether Aurora', blockId: 'celestial_crystal', tier: 6 },
  { nameZh: '時空暗岩', nameEn: 'Chrono Rift', blockId: 'chrono_stone', tier: 7 },
  { nameZh: '暗物質深邃', nameEn: 'Dark Matter', blockId: 'dark_matter_ore', tier: 7 },
  { nameZh: '時間裂變', nameEn: 'Temporal Flux', blockId: 'temporal_crystal', tier: 7 },
  { nameZh: '奇點引力', nameEn: 'Singularity Gravity', blockId: 'singularity_core', tier: 7 },
  { nameZh: '創世源生', nameEn: 'Genesis Prime', blockId: 'genesis_bedrock', tier: 8 },
  { nameZh: '混沌原質', nameEn: 'Chaos Essence', blockId: 'chaos_essence_ore', tier: 8 },
  { nameZh: '寰宇神殿', nameEn: 'Omniverse Matrix', blockId: 'omniverse_matrix', tier: 8 },
  { nameZh: '無限永恆', nameEn: 'Infinity Shard', blockId: 'infinity_shard', tier: 8 }
];

const FLAVOR_MODIFIERS = [
  '特調', '典藏', '極品', '雪霜', '炙燒', '冰鎮', '醇香', '法式', '秘傳', '星級'
];

const ICONS_BY_CATEGORY: Record<DishCategory, string[]> = {
  coffee: ['☕', '🍵', '🧋', '🥛', '🥤'],
  tea_beverage: ['🍹', '🧃', '🧉', '🍾', '🥂'],
  pastry: ['🍰', '🍮', '🧁', '🍩', '🥐', '🍪', '🥞'],
  hot_meal: ['🍜', '🍲', '🥘', '🍛', '🍕', '🍔', '🥩'],
  void: ['🌌', '🔮', '🍧', '🍡', '🟣'],
  deep_dark: ['🍄', '🖤', '🥣', '🍫', '🌑'],
  celestial: ['⭐', '🍨', '🍰', '✨', '🌤️'],
  singularity: ['⏳', '⌛', '🌀', '🍧', '🍩'],
  genesis: ['🪐', '🍱', '🎂', '🥧', '💎'],
  mythic: ['👑', '🏆', '🌟', '⚜️', '🍷']
};

/**
 * Procedurally generates exactly 1,000 unique gourmet dishes across 10 categories!
 */
function build1000Dishes(): CafeDish[] {
  const dishes: CafeDish[] = [];
  const categories: { cat: DishCategory; bases: string[]; nameZhPrefix: string; nameEnPrefix: string }[] = [
    { cat: 'coffee', bases: COFFEE_BASES, nameZhPrefix: '咖啡工坊', nameEnPrefix: 'Roastery' },
    { cat: 'tea_beverage', bases: TEA_BASES, nameZhPrefix: '茶飲工坊', nameEnPrefix: 'Tea House' },
    { cat: 'pastry', bases: PASTRY_BASES, nameZhPrefix: '烘焙工坊', nameEnPrefix: 'Bakery' },
    { cat: 'hot_meal', bases: HOT_MEAL_BASES, nameZhPrefix: '地底熱食', nameEnPrefix: 'Hot Kitchen' },
    { cat: 'void', bases: VOID_BASES, nameZhPrefix: '終界虛空', nameEnPrefix: 'Void Realm' },
    { cat: 'deep_dark', bases: DEEP_DARK_BASES, nameZhPrefix: '幽匿深穴', nameEnPrefix: 'Deep Dark' },
    { cat: 'celestial', bases: CELESTIAL_BASES, nameZhPrefix: '天界以太', nameEnPrefix: 'Celestial Aether' },
    { cat: 'singularity', bases: SINGULARITY_BASES, nameZhPrefix: '時空奇點', nameEnPrefix: 'Chrono Singularity' },
    { cat: 'genesis', bases: GENESIS_BASES, nameZhPrefix: '創世神域', nameEnPrefix: 'Genesis Core' },
    { cat: 'mythic', bases: MYTHIC_BASES, nameZhPrefix: '全知神話', nameEnPrefix: 'Apex Mythic' }
  ];

  let currentId = 1;

  for (let cIdx = 0; cIdx < categories.length; cIdx++) {
    const { cat, bases } = categories[cIdx];
    const categoryIcons = ICONS_BY_CATEGORY[cat];

    // Generate exactly 100 dishes for each of the 10 categories = 1,000 total
    for (let i = 0; i < 100; i++) {
      const base = bases[i % bases.length];
      const mineral = MINERAL_PREFIXES[(i * 3 + cIdx * 2) % MINERAL_PREFIXES.length];
      const secondaryMineral = MINERAL_PREFIXES[(i * 5 + cIdx + 7) % MINERAL_PREFIXES.length];
      const modifier = FLAVOR_MODIFIERS[i % FLAVOR_MODIFIERS.length];

      // Calculate Rarity & Tier
      let rarity: DishRarity = 'common';
      if (mineral.tier >= 7 || cat === 'mythic' || cat === 'genesis') {
        rarity = i % 2 === 0 ? 'mythic' : 'legendary';
      } else if (mineral.tier >= 5 || cat === 'singularity' || cat === 'celestial') {
        rarity = i % 3 === 0 ? 'legendary' : 'epic';
      } else if (mineral.tier >= 3 || cat === 'deep_dark' || cat === 'void') {
        rarity = i % 2 === 0 ? 'epic' : 'rare';
      } else if (mineral.tier >= 2 || cat === 'hot_meal') {
        rarity = i % 2 === 0 ? 'rare' : 'uncommon';
      } else {
        rarity = i % 3 === 0 ? 'uncommon' : 'common';
      }

      // Dish names
      const nameZh = `${mineral.nameZh}・${modifier}${base} (No.${currentId})`;
      const nameEn = `${mineral.nameEn} ${base} #${currentId}`;

      // Ingredients
      const requiredIngredients: { blockId: string; count: number }[] = [
        { blockId: mineral.blockId, count: Math.max(1, (i % 3) + 1) }
      ];
      if (rarity !== 'common') {
        requiredIngredients.push({
          blockId: secondaryMineral.blockId,
          count: Math.max(1, (i % 2) + 1)
        });
      }

      // Sell Price & XP rewards scaling with dish index & rarity
      const basePrice = (cIdx + 1) * 28 + (i + 1) * 8 + mineral.tier * 25;
      const rarityMultiplier =
        rarity === 'mythic' ? 8.5 :
        rarity === 'legendary' ? 5.2 :
        rarity === 'epic' ? 3.4 :
        rarity === 'rare' ? 2.2 :
        rarity === 'uncommon' ? 1.5 : 1.0;

      const sellPrice = Math.round(basePrice * rarityMultiplier);
      const xpReward = Math.max(5, Math.round(sellPrice * 0.12));
      const icon = categoryIcons[i % categoryIcons.length];

      const descZh = `【${mineral.nameZh}】與天然香料精心調製，融匯${base}的濃醇滋味，提供極致味蕾享受與回甘。`;
      const descEn = `Exquisite gourmet delight marrying ${mineral.nameEn} with artisan ingredients into a rich ${base}.`;

      dishes.push({
        id: `dish_${currentId}`,
        number: currentId,
        nameZh,
        nameEn,
        category: cat,
        rarity,
        sellPrice,
        xpReward,
        icon,
        requiredIngredients,
        descZh,
        descEn
      });

      currentId++;
    }
  }

  return dishes;
}

// Pre-computed 1,000 dishes singleton
export const ALL_CAFE_DISHES: CafeDish[] = build1000Dishes();

export const CAFE_DISH_MAP = new Map<string, CafeDish>(
  ALL_CAFE_DISHES.map(d => [d.id, d])
);

export function getDishById(dishId: string): CafeDish | undefined {
  return CAFE_DISH_MAP.get(dishId);
}

// 16 Unique Minecraft & Fantasy Customer Types
export interface CustomerArchetype {
  type: string;
  nameZh: string;
  nameEn: string;
  avatar: string;
  favoredCategory: DishCategory;
  dialoguesZh: string[];
  dialoguesEn: string[];
  generosity: number; // tip multiplier 1.0 ~ 2.5
}

export const CUSTOMER_ARCHETYPES: CustomerArchetype[] = [
  {
    type: 'steve',
    nameZh: '史蒂夫採礦家',
    nameEn: 'Steve Miner',
    avatar: '⛏️',
    favoredCategory: 'coffee',
    dialoguesZh: ['在第 5 層挖了一整天，急需一杯提神咖啡！', '老闆，有沒有用剛出爐礦石現磨的濃郁特調？'],
    dialoguesEn: ['Mined all day in layer 5, I need strong espresso!', 'Got any fresh brew made from quarry minerals?'],
    generosity: 1.2
  },
  {
    type: 'alex',
    nameZh: '愛麗克絲冒險者',
    nameEn: 'Alex Adventurer',
    avatar: '🏹',
    favoredCategory: 'hot_meal',
    dialoguesZh: ['剛從遠征回來，肚子咕嚕咕嚕叫了！', '這家咖啡廳在冒險者公會很有名呢！'],
    dialoguesEn: ['Just returned from an expedition, starving!', 'This cafe is famous at the adventurers guild!'],
    generosity: 1.3
  },
  {
    type: 'villager',
    nameZh: '村民咖啡品鑑師',
    nameEn: 'Villager Connoisseur',
    avatar: '🧑‍🌾',
    favoredCategory: 'tea_beverage',
    dialoguesZh: ['哼～嗯！（看著菜單點頭）這茶葉品質非凡！', '哼嗯！這款飲品值得我用綠寶石大力支持！'],
    dialoguesEn: ['Hrmm! Outstanding aroma in this tea blend!', 'Hrmm! Worth every emerald I have!'],
    generosity: 1.4
  },
  {
    type: 'enderman',
    nameZh: '優雅終界使者',
    nameEn: 'Gentle Enderman',
    avatar: '🟣',
    favoredCategory: 'void',
    dialoguesZh: ['……請不要直視我的眼睛，但這份甜點很棒。', '（瞬移至座位）……這道虛空果凍甚合我意。'],
    dialoguesEn: ['...Do not stare into my eyes, but this sweet is sublime.', '(Teleports to table) ...This void jelly is exquisite.'],
    generosity: 1.8
  },
  {
    type: 'piglin',
    nameZh: '地獄豬布林食客',
    nameEn: 'Piglin Foodie',
    avatar: '🐷',
    favoredCategory: 'hot_meal',
    dialoguesZh: ['金箔！這道餐點上有閃閃發光的黃金！愛死了！', '哼唧！夠辣夠香！老闆再來一份！'],
    dialoguesEn: ['Gold! Shiny golden flakes on my food, I love it!', 'Oink! Fiery spicy flavor! Give me another!'],
    generosity: 1.6
  },
  {
    type: 'cat',
    nameZh: '三花貓常客',
    nameEn: 'Calico Cafe Cat',
    avatar: '🐱',
    favoredCategory: 'pastry',
    dialoguesZh: ['喵～（用肉球指著舒芙蕾）', '喵嗚～（吃完滿足地舔舔爪子）'],
    dialoguesEn: ['Meow~ (Paws at the souffle)', 'Purr~ (Contentedly grooming whiskers)'],
    generosity: 1.1
  },
  {
    type: 'dog',
    nameZh: '忠誠柴犬客人',
    nameEn: 'Loyal Shiba Inu',
    avatar: '🐕',
    favoredCategory: 'pastry',
    dialoguesZh: ['汪汪！（搖尾巴等待香噴噴的點心）', '汪！老闆的手藝全鎮第一名！'],
    dialoguesEn: ['Woof! (Wags tail anticipating fresh pastry)', 'Woof! Best cafe in town!'],
    generosity: 1.1
  },
  {
    type: 'allay',
    nameZh: '悅靈小吃貨',
    nameEn: 'Allay Glutton',
    avatar: '🧚',
    favoredCategory: 'celestial',
    dialoguesZh: ['♪～ 啦啦啦，飄在空中吃蛋糕最幸福了！', '♪～ 聞到了極光水晶的甜蜜芳香～'],
    dialoguesEn: ['♪~ Tra-la-la, floating with cake is heaven!', '♪~ Smells like sweet aurora crystal aroma~'],
    generosity: 1.5
  },
  {
    type: 'sculk',
    nameZh: '幽匿循聲學者',
    nameEn: 'Sculk Scholar',
    avatar: '👾',
    favoredCategory: 'deep_dark',
    dialoguesZh: ['噓……請保持寧靜，我在聆聽這杯特調的迴響。', '這份暗夜料理散發著遠古神廟的神秘回音。'],
    dialoguesEn: ['Shh... quiet please, I am savoring the echoes of this cup.', 'This dark dish carries ancient temple acoustics.'],
    generosity: 2.0
  },
  {
    type: 'chrono',
    nameZh: '時空浪人',
    nameEn: 'Chrono Nomad',
    avatar: '⏳',
    favoredCategory: 'singularity',
    dialoguesZh: ['我在三百年後的未來喝過這杯，今天特地穿越回來品嚐！', '時間在這裡彷彿靜止了，真是美妙的休憩所。'],
    dialoguesEn: ['I tasted this 300 years in the future, traveled back for it!', 'Time seems to freeze here, marvelous cafe.'],
    generosity: 2.2
  },
  {
    type: 'critic',
    nameZh: '鐵魔像米其林評審',
    nameEn: 'Iron Golem Critic',
    avatar: '🤖',
    favoredCategory: 'coffee',
    dialoguesZh: ['本評審考察過數千家餐廳，這杯礦石特調堪稱五星級！', '擺盤厚實，香氣四溢，給予特優評價。'],
    dialoguesEn: ['I have inspected thousands of bistros, this brew is 5-stars!', 'Solid presentation and heavenly aroma, top marks.'],
    generosity: 2.5
  },
  {
    type: 'genesis_god',
    nameZh: '造物主代行者',
    nameEn: 'Genesis Avatar',
    avatar: '🪐',
    favoredCategory: 'genesis',
    dialoguesZh: ['在萬千星系之中，此地的咖啡香氣最令吾滿意。', '以此道料理，足以印證凡人對美味的至高追求。'],
    dialoguesEn: ['Across myriad galaxies, this cafe aroma pleases us most.', 'This dish proves mortals supreme pursuit of flavor.'],
    generosity: 2.8
  }
];
