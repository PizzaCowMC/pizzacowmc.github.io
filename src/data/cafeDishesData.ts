import { CafeDish, DishCategory, DishRarity } from '../types';

// Base prefixes and descriptors for culinary naming
interface DishBaseName {
  zh: string;
  en: string;
}

const COFFEE_BASES: DishBaseName[] = [
  { zh: '義式濃縮', en: 'Espresso' },
  { zh: '深焙美式', en: 'Dark Americano' },
  { zh: '焦糖瑪奇朵', en: 'Caramel Macchiato' },
  { zh: '絲絨拿鐵', en: 'Velvet Latte' },
  { zh: '冷萃黑咖啡', en: 'Cold Brew' },
  { zh: '卡布奇諾', en: 'Cappuccino' },
  { zh: '摩卡奇諾', en: 'Mochaccino' },
  { zh: '燕麥奶馥芮白', en: 'Oat Flat White' },
  { zh: '生椰冰拿鐵', en: 'Coconut Iced Latte' },
  { zh: '炭焙維也納', en: 'Vienna Roast' },
  { zh: '冰滴特調', en: 'Ice Drip Coffee' },
  { zh: '手沖精選', en: 'Pour-Over Brew' },
  { zh: '阿芙佳朵', en: 'Affogato' },
  { zh: '抹茶咖啡', en: 'Matcha Espresso' },
  { zh: '肉桂卡布', en: 'Cinnamon Cappuccino' },
  { zh: '榛果拿鐵', en: 'Hazelnut Latte' },
  { zh: '海鹽奶蓋美式', en: 'Sea Salt Foam Americano' },
  { zh: '香草雙倍濃縮', en: 'Vanilla Doppio' },
  { zh: '斑蘭冷萃', en: 'Pandan Cold Brew' },
  { zh: '蜜香手沖', en: 'Honey Pour-Over' }
];

const TEA_BASES: DishBaseName[] = [
  { zh: '高山烏龍', en: 'Mountain Oolong' },
  { zh: '皇家伯爵茶', en: 'Royal Earl Grey' },
  { zh: '茉莉花草綠茶', en: 'Jasmine Green Tea' },
  { zh: '錫蘭紅茶拿鐵', en: 'Ceylon Tea Latte' },
  { zh: '青提氣泡果茶', en: 'Green Grape Sparkling Tea' },
  { zh: '四季春青茶', en: 'Four Seasons Spring Tea' },
  { zh: '白桃烏龍冷泡', en: 'White Peach Oolong' },
  { zh: '大吉嶺晨光茶', en: 'Darjeeling Morning Tea' },
  { zh: '玫瑰洛神花茶', en: 'Rose Roselle Tea' },
  { zh: '冬瓜檸檬甘露', en: 'Melon Lemon Dew' },
  { zh: '抹茶生乳酪', en: 'Matcha Cheese Tea' },
  { zh: '香茅青檸冰飲', en: 'Lemongrass Lime Cooler' },
  { zh: '桂花蜜釀烏龍', en: 'Osmanthus Honey Oolong' },
  { zh: '薄荷清涼花果飲', en: 'Cooling Mint Fruit Tea' },
  { zh: '玄米玉露', en: 'Genmaicha Gyokuro' }
];

const PASTRY_BASES: DishBaseName[] = [
  { zh: '可頌麵包', en: 'Croissant' },
  { zh: '舒芙蕾鬆餅', en: 'Souffle Pancake' },
  { zh: '巴斯克乳酪蛋糕', en: 'Basque Cheesecake' },
  { zh: '生巧克力布朗尼', en: 'Fudge Brownie' },
  { zh: '法式馬卡龍', en: 'French Macaron' },
  { zh: '草莓千層酥', en: 'Strawberry Mille-Feuille' },
  { zh: '提拉米蘇', en: 'Tiramisu' },
  { zh: '焦糖烤布蕾', en: 'Creme Brulee' },
  { zh: '藍莓丹麥酥', en: 'Blueberry Danish' },
  { zh: '熔岩巧克力塔', en: 'Lava Chocolate Tart' },
  { zh: '肉桂捲', en: 'Cinnamon Roll' },
  { zh: '戚風蛋糕', en: 'Chiffon Cake' },
  { zh: '檸檬生乳塔', en: 'Lemon Cream Tart' },
  { zh: '焦糖布丁', en: 'Caramel Pudding' },
  { zh: '司康餅配果醬', en: 'Scone with Jam' }
];

const HOT_MEAL_BASES: DishBaseName[] = [
  { zh: '石鍋拌飯', en: 'Stone Bibimbap' },
  { zh: '濃醇豚骨拉麵', en: 'Tonkotsu Ramen' },
  { zh: '黑椒鐵板牛排', en: 'Sizzling Pepper Steak' },
  { zh: '窯烤薄脆披薩', en: 'Crispy Hearth Pizza' },
  { zh: '奶油蘑菇燉飯', en: 'Creamy Mushroom Risotto' },
  { zh: '咖哩牛肉飯', en: 'Curry Beef Rice' },
  { zh: '日式炙燒炸豬排', en: 'Crispy Tonkatsu Cutlet' },
  { zh: '香濃起司漢堡', en: 'Cheesy Gourmet Burger' },
  { zh: '煙燻鮭魚三明治', en: 'Smoked Salmon Sandwich' },
  { zh: '義式肉醬千層麵', en: 'Bolognese Lasagna' },
  { zh: '海鮮焗烤飯', en: 'Seafood Gratin' },
  { zh: '法式洋蔥濃湯', en: 'French Onion Soup' },
  { zh: '鮮蝦天婦羅烏龍', en: 'Tempura Shrimp Udon' },
  { zh: '韓式泡菜火鍋', en: 'Kimchi Hotpot' },
  { zh: '炙燒骰子牛', en: 'Seared Beef Cubes' }
];

const VOID_BASES: DishBaseName[] = [
  { zh: '末影珍珠果凍飲', en: 'Ender Pearl Jelly' },
  { zh: '紫珀水晶凍', en: 'Purpur Crystal Gelee' },
  { zh: '虛空懸浮舒芙蕾', en: 'Levitation Void Souffle' },
  { zh: '末地燭光慕斯', en: 'End Rod Candle Mousse' },
  { zh: '龍息煙燻漢堡', en: 'Dragon Breath Burger' },
  { zh: '零重力漂浮茶', en: 'Zero-G Floating Tea' },
  { zh: '末影結晶糖', en: 'Ender Crystal Candy' },
  { zh: '虛空黑洞杯子蛋糕', en: 'Black Hole Cupcake' },
  { zh: '紫珀晶核拿鐵', en: 'Purpur Core Latte' },
  { zh: '星環星屑奶昔', en: 'Ring Stardust Shake' }
];

const DEEP_DARK_BASES: DishBaseName[] = [
  { zh: '幽匿菌毯黑松露燉飯', en: 'Sculk Truffle Risotto' },
  { zh: '迴響音波舒芙蕾', en: 'Sonic Wave Souffle' },
  { zh: '深邃暗夜特調', en: 'Deep Night Elixir' },
  { zh: '無光深穴甘泉飲', en: 'Cavern Spring Nectar' },
  { zh: '古城守望者濃湯', en: 'Ancient Warden Broth' },
  { zh: '幽暗催化可可', en: 'Catalyst Dark Cocoa' },
  { zh: '心跳共振布丁', en: 'Resonance Pudding' },
  { zh: '避光深層冷萃', en: 'Dark Cold Brew' },
  { zh: '地底苔蘚沙拉', en: 'Subterranean Moss Salad' },
  { zh: '幽暗迴音脆餅', en: 'Echo Shard Wafers' }
];

const CELESTIAL_BASES: DishBaseName[] = [
  { zh: '星光棉花糖拿鐵', en: 'Starlight Marshmallow Latte' },
  { zh: '耀陽結晶水果派', en: 'Sunstone Fruit Pie' },
  { zh: '天界極光聖代', en: 'Celestial Aurora Sundae' },
  { zh: '以太雲朵舒芙蕾', en: 'Aether Cloud Souffle' },
  { zh: '彗星香草泡芙', en: 'Comet Cream Puff' },
  { zh: '日光結晶氣泡水', en: 'Solar Crystal Sparkling' },
  { zh: '天使羽翼雪花冰', en: 'Angel Wing Shaved Snow' },
  { zh: '星雲漸層特調', en: 'Nebula Gradient Cocktail' },
  { zh: '天國甘露奶綠', en: 'Heavenly Nectar Latte' },
  { zh: '太陽風暴馬卡龍', en: 'Solar Storm Macaron' }
];

const SINGULARITY_BASES: DishBaseName[] = [
  { zh: '時空暗岩分子料理', en: 'Chrono Molecular Plate' },
  { zh: '時間倒流草莓塔', en: 'Time-Reversal Berry Tart' },
  { zh: '暗物質黑芝麻奶昔', en: 'Dark Matter Sesame Shake' },
  { zh: '重力透鏡藍莓塔', en: 'Gravity Lens Tart' },
  { zh: '事件視界極黑拿鐵', en: 'Event Horizon Dark Latte' },
  { zh: '相對論甜甜圈', en: 'Relativity Doughnut' },
  { zh: '量子糾纏特調', en: 'Quantum Entanglement Drink' },
  { zh: '時鐘發條脆餅', en: 'Clockwork Crisp' },
  { zh: '奇異引力可麗餅', en: 'Singular Gravity Crepe' },
  { zh: '時間裂縫千層派', en: 'Time Rift Mille-Feuille' }
];

const GENESIS_BASES: DishBaseName[] = [
  { zh: '混沌原質幻彩馬卡龍', en: 'Chaos Essence Macaron' },
  { zh: '寰宇神殿金箔壽司', en: 'Omniverse Gilded Sushi' },
  { zh: '大霹靂餘燼炙烤和牛', en: 'Big Bang Ember Wagyu' },
  { zh: '創世源生水果聖代', en: 'Genesis Prime Sundae' },
  { zh: '太初原液氣泡特飲', en: 'Primordial Fizz Elixir' },
  { zh: '宇宙母核巧克力球', en: 'Cosmic Core Choco Sphere' },
  { zh: '萬物初始濃湯', en: 'Origin of All Broth' },
  { zh: '創世星雲舒芙蕾', en: 'Genesis Nebula Souffle' },
  { zh: '神域七彩雪酪', en: 'Divine Prism Sorbet' },
  { zh: '奇點大爆炸聖代', en: 'Singularity Big Bang Parfait' }
];

const MYTHIC_BASES: DishBaseName[] = [
  { zh: '全知全能終極特調', en: 'Omnipotent Ultimate Elixir' },
  { zh: '無限永恆維度神飲', en: 'Infinite Dimension Drink' },
  { zh: '萬界創世原點御膳', en: 'Origin Point Feast' },
  { zh: '神聖造物主千層派', en: 'Holy Creator Mille-Feuille' },
  { zh: '超神性星海甘露', en: 'Astral Ambrosia Nectar' },
  { zh: '因果律法則盛宴', en: 'Causality Law Grand Feast' },
  { zh: '原初真理龍涎聖代', en: 'Primal Truth Dragon Sundae' },
  { zh: '超越者彩虹甘露', en: 'The Ascended Nectar' },
  { zh: '至尊王座香檳', en: 'Sovereign Throne Champagne' },
  { zh: '登峰造極滿漢全席', en: 'Pinnacle Imperial Banquet' }
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

const FLAVOR_MODIFIERS: { zh: string; en: string }[] = [
  { zh: '特調', en: 'Special' },
  { zh: '典藏', en: 'Reserve' },
  { zh: '極品', en: 'Supreme' },
  { zh: '雪霜', en: 'Frosted' },
  { zh: '炙燒', en: 'Roasted' },
  { zh: '冰鎮', en: 'Chilled' },
  { zh: '醇香', en: 'Velvet' },
  { zh: '法式', en: 'Artisan' },
  { zh: '秘傳', en: 'Secret' },
  { zh: '星級', en: 'Signature' }
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
  const categories: { cat: DishCategory; bases: DishBaseName[]; nameZhPrefix: string; nameEnPrefix: string }[] = [
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
      const nameZh = `${mineral.nameZh}・${modifier.zh}${base.zh} (No.${currentId})`;
      const nameEn = `${mineral.nameEn} ${modifier.en} ${base.en} #${currentId}`;

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

      const descZh = `【${mineral.nameZh}】與天然香料精心調製，融匯${base.zh}的濃醇滋味，提供極致味蕾享受與回甘。`;
      const descEn = `Exquisite gourmet delight marrying ${mineral.nameEn} with artisan ingredients into a rich ${base.en}.`;

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
