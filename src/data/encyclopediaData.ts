export interface EncyclopediaEntry {
  id: string;
  category: 'blocks' | 'ores' | 'tools' | 'strata' | 'mobs' | 'mechanics' | 'trivia';
  nameZh: string;
  nameEn: string;
  badgeZh: string;
  badgeEn: string;
  icon: string;
  color: string;
  taglineZh: string;
  taglineEn: string;
  descriptionZh: string;
  descriptionEn: string;
  stats?: { labelZh: string; labelEn: string; value: string }[];
  tipsZh?: string[];
  tipsEn?: string[];
  relatedIds?: string[];
}

export const ENCYCLOPEDIA_CATEGORIES = [
  { id: 'all', labelZh: '全部資料', labelEn: 'All Topics', icon: '📚' },
  { id: 'ores', labelZh: '礦石與寶物', labelEn: 'Ores & Gems', icon: '💎' },
  { id: 'blocks', labelZh: '方塊與建材', labelEn: 'Blocks & Materials', icon: '🧱' },
  { id: 'tools', labelZh: '工具與附魔', labelEn: 'Tools & Enchants', icon: '⛏️' },
  { id: 'strata', labelZh: '地層與世界', labelEn: 'Strata & Worlds', icon: '🗺️' },
  { id: 'mobs', labelZh: '怪物與生物', labelEn: 'Mobs & Bosses', icon: '🧟' },
  { id: 'mechanics', labelZh: '機制與合成', labelEn: 'Mechanics & Redstone', icon: '⚙️' },
  { id: 'trivia', labelZh: '冷知識與秘訣', labelEn: 'Trivia & Tips', icon: '💡' }
] as const;

export const ENCYCLOPEDIA_ENTRIES: EncyclopediaEntry[] = [
  // --- ORES & GEMS ---
  {
    id: 'ore_coal',
    category: 'ores',
    nameZh: '煤炭礦石 (Coal Ore)',
    nameEn: 'Coal Ore',
    badgeZh: '基礎燃料',
    badgeEn: 'Essential Fuel',
    icon: '⬛',
    color: '#2b2b2b',
    taglineZh: '生存初期的第一道光，熔爐與火把的核心燃料。',
    taglineEn: 'The spark of early survival, indispensable for torches and smelting.',
    descriptionZh: '煤炭礦石是 Minecraft 中最常見且必不可少的礦石之一。開採可直接掉落煤炭，用於製作火把照明防止怪物生成，並作為熔爐的長效燃燒材料（每個煤炭可燃燒 8 個物品）。在深板岩層亦會以深層煤礦形式稀少分佈。',
    descriptionEn: 'Coal Ore is one of the most common and vital resources in Minecraft. When mined, it drops raw coal directly, powering torches to deter hostiles and fueling furnaces to smelt up to 8 items per piece.',
    stats: [
      { labelZh: '需要工具', labelEn: 'Required Tool', value: '木鎬 (Wooden Pickaxe) 以上' },
      { labelZh: '方塊硬度', labelEn: 'Hardness', value: '3.0' },
      { labelZh: '生成高度', labelEn: 'Y-Level', value: 'Y=0 至 Y=256 (表層至淺岩層)' },
      { labelZh: '開採經驗', labelEn: 'XP Dropped', value: '0 - 2 點經驗值' }
    ],
    tipsZh: [
      '若使用附帶「絲綢之觸 (Silk Touch)」的鎬子開採，會掉落完整的礦石本體。',
      '搭配「幸運 (Fortune)」附魔最高可一次掉落高達 4 顆煤炭。'
    ],
    tipsEn: [
      'Use Silk Touch to collect the pristine ore block.',
      'Fortune III pickaxe can drop up to 4 pieces of coal per block.'
    ]
  },
  {
    id: 'ore_iron',
    category: 'ores',
    nameZh: '鐵礦石 (Iron Ore)',
    nameEn: 'Iron Ore',
    badgeZh: '工業基石',
    badgeEn: 'Industrial Backbone',
    icon: '⚙️',
    color: '#d4a373',
    taglineZh: '文明進步的脊樑，打造堅固裝備與防護不可或缺。',
    taglineEn: 'The backbone of tech progression, unlocking durable armor and tools.',
    descriptionZh: '鐵礦石廣泛分佈於山脈與中層岩層。開採掉落粗鐵（Raw Iron），放入熔爐高溫提煉後即可獲得鐵錠。鐵錠可用於製作鐵鎬、鐵桶、盾牌、全套鐵護甲、漏斗與鐵路軌道，是玩家從石器時代跨入工業時代的關鍵轉折點。',
    descriptionEn: 'Iron Ore generates naturally throughout caves and underground caverns. Mining drops raw iron, which smelts into versatile iron ingots used for shields, hoppers, shears, minecarts, and mid-tier gear.',
    stats: [
      { labelZh: '需要工具', labelEn: 'Required Tool', value: '石鎬 (Stone Pickaxe) 以上' },
      { labelZh: '方塊硬度', labelEn: 'Hardness', value: '3.0' },
      { labelZh: '生成高度', labelEn: 'Y-Level', value: 'Y=-24 至 Y=56 (鐵礦岩層峰值約在 Y=16)' },
      { labelZh: '開採經驗', labelEn: 'XP Dropped', value: '熔煉獲得 0.7 點經驗值' }
    ],
    tipsZh: [
      '隨身攜帶一桶水是鐵錠的最佳用途之一，能防墜落傷害並能冷卻岩漿為黑曜石。',
      '深層鐵礦石（Deepslate Iron Ore）硬度更高，需花費更多挖掘打擊次數。'
    ],
    tipsEn: [
      'Crafting a Water Bucket is priority one—it stops fall damage and solidifies lava into obsidian.',
      'Deepslate iron ore takes twice as long to mine due to increased hardness.'
    ]
  },
  {
    id: 'ore_gold',
    category: 'ores',
    nameZh: '金礦石 (Gold Ore)',
    nameEn: 'Gold Ore',
    badgeZh: '貴金屬',
    badgeEn: 'Precious Metal',
    icon: '🪙',
    color: '#ffb703',
    taglineZh: '豬布林的最愛，下界通行護身符與金蘋果的原料。',
    taglineEn: 'Revered by Piglins and essential for Golden Apples and powered rails.',
    descriptionZh: '金礦石金黃耀眼，開採熔煉為金錠。雖然金製工具耐久較低，但挖掘速度是全遊戲最快且附魔親和力最高。更重要的是，在下界身穿一件金裝可避免豬布林主動攻擊，並可合成金蘋果與金胡蘿蔔這兩種遊戲內最強力的回血補給品。',
    descriptionEn: 'Gold Ore yields raw gold that smelts into gleaming gold ingots. Gold pickaxes mine the fastest in the game, and golden armor prevents Piglin aggression in the Nether. Essential for Golden Apples.',
    stats: [
      { labelZh: '需要工具', labelEn: 'Required Tool', value: '鐵鎬 (Iron Pickaxe) 以上' },
      { labelZh: '方塊硬度', labelEn: 'Hardness', value: '3.0' },
      { labelZh: '生成高度', labelEn: 'Y-Level', value: 'Y=-64 至 Y=32 (惡地群系更可在高山大量生成)' },
      { labelZh: '開採經驗', labelEn: 'XP Dropped', value: '熔煉獲得 1.0 點經驗值' }
    ],
    tipsZh: [
      '在下界地底挖掘下界金礦石會直接掉落金粒，受幸運附魔大幅增幅。',
      '合成充能鐵軌（Powered Rail）不可缺少金錠。'
    ],
    tipsEn: [
      'In the Nether, Nether Gold Ore drops gold nuggets directly, highly boosted by Fortune.',
      'Powered Rails require gold ingots to construct booster cart networks.'
    ]
  },
  {
    id: 'ore_diamond',
    category: 'ores',
    nameZh: '鑽石礦石 (Diamond Ore)',
    nameEn: 'Diamond Ore',
    badgeZh: '極致瑰寶',
    badgeEn: 'Crown Jewel',
    icon: '💎',
    color: '#00b4d8',
    taglineZh: '每位礦工夢寐以求的湛藍結晶，邁向強者之巔的標誌。',
    taglineEn: 'The iconic azure gem coveted by all spelunkers, gateway to end-game power.',
    descriptionZh: '鑽石是 Minecraft 最經典的象徵。多隱藏於接近基岩的深邃底層（特別是深板岩層 Y=-53 至 Y=-58）。開採直接掉落耀眼的鑽石，可用於打造極高耐久度與威力的鑽石裝備，並是合成附魔台與下界合金裝備基底的必備珍寶。',
    descriptionEn: 'The definitive pinnacle of underground excavation. Mostly found in deep underground layers around Y=-58. Yields pure diamonds directly, crafting end-game tools, enchanting tables, and netherite templates.',
    stats: [
      { labelZh: '需要工具', labelEn: 'Required Tool', value: '鐵鎬 (Iron Pickaxe) 以上' },
      { labelZh: '方塊硬度', labelEn: 'Hardness', value: '3.0 (深層 4.5)' },
      { labelZh: '最佳高度', labelEn: 'Optimal Level', value: 'Y=-58 (越深生成機率越高，但岩漿湖密布)' },
      { labelZh: '開採經驗', labelEn: 'XP Dropped', value: '3 - 7 點經驗值' }
    ],
    tipsZh: [
      '強烈建議取得「時運 III (Fortune III)」附魔鎬後再挖掘鑽石礦，平均每塊可收穫 2.2 顆鑽石！',
      '在深層探險時小心腳下的隱形岩漿湖，隨身備妥水桶。'
    ],
    tipsEn: [
      'Always save unmined diamonds until you acquire Fortune III to multiply yields exponentially!',
      'Watch out for subterranean magma lakes hiding below brittle gravel and slate.'
    ]
  },
  {
    id: 'ore_ancient_debris',
    category: 'ores',
    nameZh: '遠古殘骸 (Ancient Debris)',
    nameEn: 'Ancient Debris',
    badgeZh: '下界神鐵',
    badgeEn: 'Netherite Core',
    icon: '🛡️',
    color: '#7f4f24',
    taglineZh: '在下界熊熊烈焰中淬鍊的終極金屬，浮於岩漿之上而不滅。',
    taglineEn: 'The ultimate alloy core forged in Nether flames, impervious to lava.',
    descriptionZh: '遠古殘骸是隱藏於地獄下界深層（Y=8 至 Y=22）的極罕見古代殘留物。它具有極高的爆炸抗性（無法被TNT炸毀）且丟入岩漿不會被銷毀。熔煉後可得下界合金碎屑（Netherite Scrap），結合金錠合成為下界合金錠，將鑽石裝備升級為抗擊退、高傷害、防火的神級裝備。',
    descriptionEn: 'Ultra-rare ancient remnants hidden in the depths of the Nether (Y=15). Totally immune to lava and explosions. Smelted into Netherite Scraps and combined with gold to forge invincible Netherite armor.',
    stats: [
      { labelZh: '需要工具', labelEn: 'Required Tool', value: '鑽石鎬 (Diamond Pickaxe) 以上' },
      { labelZh: '方塊硬度', labelEn: 'Hardness', value: '30.0 (極度堅硬)' },
      { labelZh: '爆炸抗性', labelEn: 'Blast Resistance', value: '1200 (免疫TNT爆炸)' },
      { labelZh: '生成高度', labelEn: 'Y-Level', value: '下界 Y=8 ~ 22 (Y=15 濃度最高)' }
    ],
    tipsZh: [
      '玩家常用床在下界睡覺造成的巨大爆炸快速炸開地獄石來搜尋遠古殘骸。',
      '下界合金裝備若不慎掉入岩漿，會完好漂浮在岩漿表面不會燒毀。'
    ],
    tipsEn: [
      'Bed-bombing at Nether Y=15 is the most famous strategy for rapid ancient debris strip-mining.',
      'Netherite items safely float on top of lava lakes without burning.'
    ]
  },

  // --- BLOCKS & MATERIALS ---
  {
    id: 'block_obsidian',
    category: 'blocks',
    nameZh: '黑曜石 (Obsidian)',
    nameEn: 'Obsidian',
    badgeZh: '堅不可摧',
    badgeEn: 'Indestructible',
    icon: '🔮',
    color: '#3a0ca3',
    taglineZh: '水流與岩漿相遇時誕生的強韌紫黑之石，開啟地獄傳送門。',
    taglineEn: 'Formed when flowing water meets lava source, gateway to the Nether.',
    descriptionZh: '黑曜石是自然界中爆炸抗性最高的方塊之一。當水流接觸到靜止的岩漿源時便會立即生成黑曜石。它是構築下界傳送門框架（至少需要10塊）與合成附魔台、信標的核心建材，一般爆炸（苦力怕、TNT）對其毫無作用。',
    descriptionEn: 'Formed when water pours over a lava source. It has a colossal blast resistance of 1200, resisting TNT and Creepers. Used to construct Nether Portals and enchanting tables.',
    stats: [
      { labelZh: '需要工具', labelEn: 'Required Tool', value: '鑽石鎬 (Diamond Pickaxe) 以上' },
      { labelZh: '方塊硬度', labelEn: 'Hardness', value: '50.0' },
      { labelZh: '開採耗時', labelEn: 'Mining Time', value: '鑽石鎬約需 9.4 秒 (未附魔)' },
      { labelZh: '爆炸抗性', labelEn: 'Blast Resistance', value: '1200.0' }
    ],
    tipsZh: [
      '如果沒有鑽石鎬，可使用水桶與岩漿桶在模具中直接「澆築」出傳送門！',
      '哭泣的黑曜石（Crying Obsidian）帶有幽微紫光，可用於合成重生錨。'
    ],
    tipsEn: [
      'Speedrunners use buckets to "cast" portals directly without mining obsidian.',
      'Crying Obsidian glows subtly and crafts Respawn Anchors for setting spawns in the Nether.'
    ]
  },
  {
    id: 'block_tnt',
    category: 'blocks',
    nameZh: 'TNT (炸藥)',
    nameEn: 'TNT (Explosive)',
    badgeZh: '毀滅爆炸',
    badgeEn: 'Demolition',
    icon: '🧨',
    color: '#e63946',
    taglineZh: '紅石信號一觸即發，大範圍爆破挖掘與戰鬥奇效。',
    taglineEn: 'Primed by redstone or flint & steel for instantaneous quarry blasting.',
    descriptionZh: '由 5 個火藥與 4 個沙子合成的高能爆炸方塊。可用打火石點燃，或透過紅石信號觸發。點燃後會產生約 4 秒白光閃爍倒數並受到重力影響，隨後引發威力高達 4 級的猛烈爆炸，破壞周圍大部分方塊。',
    descriptionEn: 'Crafted from 5 gunpowder and 4 sand. Activated by flint and steel, fire, or redstone pulses. Has a 4-second fuse before unleashing a Power 4 explosive blast.',
    stats: [
      { labelZh: '合成配方', labelEn: 'Recipe', value: '火藥 x5 + 沙子 x4' },
      { labelZh: '爆炸半徑', labelEn: 'Blast Radius', value: '約 7-8 格球型破壞' },
      { labelZh: '引爆延遲', labelEn: 'Fuse Time', value: '4.0 秒 (80 遊戲刻)' },
      { labelZh: '水下特性', labelEn: 'Water Physics', value: '在水中爆炸不會破壞地形，但仍有傷害' }
    ],
    tipsZh: [
      '利用水流可以製作完全不破壞周圍建築的 TNT 大砲或跳高彈射器！',
      '開採採石場時使用 TNT 可瞬間清理大片石層。'
    ],
    tipsEn: [
      'In water, TNT deals entity damage and knockback but 0 environmental block damage.',
      'Essential for industrial strip-mining and automatic perimeter clearing.'
    ]
  },
  {
    id: 'block_deepslate',
    category: 'blocks',
    nameZh: '深層板岩 (Deepslate)',
    nameEn: 'Deepslate',
    badgeZh: '地底基岩帶',
    badgeEn: 'Abyssal Stone',
    icon: '🪨',
    color: '#495057',
    taglineZh: '盤踞於 Y=0 以下的深灰堅硬岩層，回音迴盪的漆黑地界。',
    taglineEn: 'Dense dark stone blanketing the subterranean world below Y=0.',
    descriptionZh: '在 Y=0 以下取代一般石頭的堅硬地質。具有深色條紋與高硬度，開採需比普通石頭多花費近兩倍時間。所有在該層生成的礦石均會演變為深層礦石（如深層鑽石礦）。可加工為深板岩磚、圓石深板岩與雕刻深板岩，是極具質感的暗黑系建築材料。',
    descriptionEn: 'Dense, layered stone generating below Y=0 down to bedrock. Requires 1.5x longer to mine than standard stone, hosting deepslate variants of all ores with enhanced hardness.',
    stats: [
      { labelZh: '硬度倍率', labelEn: 'Hardness', value: '4.5 (普通石頭為 1.5)' },
      { labelZh: '需要工具', labelEn: 'Required Tool', value: '木鎬 (Wooden Pickaxe) 以上' },
      { labelZh: '生成深度', labelEn: 'Depth', value: 'Y=0 至 Y=-64' },
      { labelZh: '建築衍生', labelEn: 'Craftables', value: '深板岩瓦、深板岩磚、磨製深板岩' }
    ],
    tipsZh: [
      '搭配急迫（Haste II）與效率 V（Efficiency V）的下界合金鎬，深板岩亦可實現瞬間秒破（Insta-mine）。',
      '強化深板岩（Reinforced Deepslate）生成於遠古城市，無法在生存模式被開採或破壞。'
    ],
    tipsEn: [
      'Efficiency V with Haste II allows ultra-fast mining through deep caverns.',
      'Reinforced Deepslate in Ancient Cities cannot be obtained or moved in Survival.'
    ]
  },

  // --- TOOLS & ENCHANTS ---
  {
    id: 'tool_pickaxe_tiers',
    category: 'tools',
    nameZh: '鎬子階級全覽 (Pickaxe Progression)',
    nameEn: 'Pickaxe Progression',
    badgeZh: '挖礦核心',
    badgeEn: 'Mining Arsenal',
    icon: '⛏️',
    color: '#06d6a0',
    taglineZh: '從第一把木鎬到星辰獄髓，見證每位冒險家的工匠成長史。',
    taglineEn: 'From modest timber picks to God-forged Netherite implements.',
    descriptionZh: '鎬子是 Minecraft 中使用頻率最高的工具。各材質階級具有不同的採掘速率、耐久度與可採掘方塊等級：\n• 木鎬：採掘力 1.0x，耐久 60，可採石頭、煤礦\n• 石鎬：採掘力 1.8x，耐久 132，可採鐵礦、青金石\n• 鐵鎬：採掘力 3.2x，耐久 251，可採金礦、紅石、鑽石\n• 金鎬：採掘力 5.5x，耐久 32，採速最快但極易磨損\n• 鑽石鎬：採掘力 7.5x，耐久 1562，可採黑曜石與遠古殘骸\n• 獄髓鎬：採掘力 12.0x，耐久 2031，防火防岩漿，最高性能',
    descriptionEn: 'The iconic backbone tool of excavation. Different tiers dictate what blocks drop their loot and the speed of destruction. Wood -> Stone -> Iron -> Diamond -> Netherite.',
    stats: [
      { labelZh: '最耐用工具', labelEn: 'Highest Durability', value: '獄髓鎬 (2031 點耐久度)' },
      { labelZh: '最快採速', labelEn: 'Raw Speed Peak', value: '金鎬 / 獄髓鎬 + 效率V' },
      { labelZh: '不可採方塊', labelEn: 'Unbreakable', value: '基岩 (Bedrock)、終界傳送門框架' }
    ],
    tipsZh: [
      '隨身多帶一把附帶絲綢之觸的鎬子，可以在野外直接打包冰塊、書架或完整的礦石！',
      '在鐵砧上修復鑽石鎬比重新打造一把更能保留昂貴的附魔屬性。'
    ],
    tipsEn: [
      'Always keep a backup Silk Touch pickaxe for collecting intact ore, glass, and bookshelves.',
      'Repair enchanted pickaxes using corresponding ingots or diamonds on an anvil.'
    ]
  },
  {
    id: 'tool_enchantments',
    category: 'tools',
    nameZh: '核心三大挖礦附魔 (Core Mining Enchants)',
    nameEn: 'Core Mining Enchants',
    badgeZh: '神級強化',
    badgeEn: 'Godly Buffs',
    icon: '✨',
    color: '#9d4edd',
    taglineZh: '效率、耐久與時運的完美交織，打造終極採集神兵。',
    taglineEn: 'Efficiency, Unbreaking, and Fortune — the holy trinity of spelunking.',
    descriptionZh: '三大挖礦附魔徹底改變遊戲採集效率：\n1. 效率 (Efficiency I-V)：大幅縮短破壞方塊所需時間。最高等級搭配急迫信標可達成「瞬間秒破（Insta-mine）」。\n2. 耐久 (Unbreaking I-III)：使每次使用有高達 75% 機率不消耗耐久，變相將工具使用壽命延長至 4 倍！\n3. 幸運 / 時運 (Fortune I-III)：增加開採煤炭、紅石、青金石、鑽石等礦石時的掉落數量（幸運III最高單塊掉落多達4倍），且大幅增加稀有掉落率！\n4. 修補 (Mending)：吸收經驗值球即可自動修復工具耐久度。',
    descriptionEn: 'The essential enchantments for any miner: Efficiency boosts break speed to instantaneous levels, Unbreaking quadruples lifespan, and Fortune multiplies gem yields up to 4x. Mending repairs durability using XP.',
    stats: [
      { labelZh: '時運III平均增幅', labelEn: 'Fortune III Avg Multiplier', value: '礦石掉落量約 +120% (2.2x)' },
      { labelZh: '耐久III壽命加成', labelEn: 'Unbreaking III Multiplier', value: '有效耐久提升 400% (4x)' },
      { labelZh: '衝突附魔', labelEn: 'Incompatible Pair', value: '時運 (Fortune) 與 絲綢之觸 (Silk Touch) 互斥' }
    ],
    tipsZh: [
      '時運（Fortune）對直接掉落方塊本身的礦石（如鐵礦、金礦未開啟自動熔煉時）不生效，但對粗鐵、粗金有效！',
      '擁有「修補（Mending）」附魔的鎬子在大型採石場中幾乎永遠不會損壞。'
    ],
    tipsEn: [
      'Fortune and Silk Touch cannot exist simultaneously on the same tool.',
      'With Mending, your pickaxe heals itself continuously from the XP generated by mining ores.'
    ]
  },

  // --- STRATA & BIOMES ---
  {
    id: 'strata_layers',
    category: 'strata',
    nameZh: '10大礦脈層與地下地層分佈 (10 Strata Layers)',
    nameEn: '10 Strata Layers Breakdown',
    badgeZh: '地質分層',
    badgeEn: 'Geological Strata',
    icon: '🗺️',
    color: '#3a86ff',
    taglineZh: '越往地心探勘，未知凶險與無價珍寶便越發密集。',
    taglineEn: 'The deeper the descent, the greater the subterranean peril and riches.',
    descriptionZh: '本遊戲精準還原 Minecraft 現代深度世界與多維創世神話：\n• 第1層 表層泥岩：泥土、原木、圓石、細沙、礫石\n• 第2層 淺層礦脈：煤炭、銅礦、鐵礦、青金石\n• 第3層 金石結晶：黃金、紅石、鑽石、綠寶石、紫水晶\n• 第4層 深板岩暗黑裂谷：深板岩鑽石、深板岩綠寶石、方解石\n• 第5層 地獄熾熱熔岩地心：地獄岩磚、靈魂沙、石英礦、螢石、遠古遺骸\n• 第6層 終界外島虛空星環：終界石磚、紫珀塊、黑曜石、哭泣黑曜石、末地水晶\n• 第7層 伏守幽匿深暗異域：幽匿塊、幽匿催化體、迴響碎屑、強化深板岩\n• 第8層 天界以太星輝神域：星光聖石、耀陽晶石、天界水晶、宇宙星雲神礦\n• 第9層 時空裂隙・奇點維度：時空暗岩、暗物質礦、時間裂變晶體、奇異點重力核\n• 第10層 創世神域・終極宇宙母核：創世源生基岩、混沌原質神礦、寰宇神殿矩陣、無限永恆碎片。',
    descriptionEn: 'Explore 10 expansive geological and cosmic layers: Layer 1 Topsoil down to Nether Core, The End Void, Ancient Deep Dark, Aether Celestial, Chrono Rift & Singularity, and the supreme Layer 10 Genesis Omniverse Core.',
    stats: [
      { labelZh: '地層總數', labelEn: 'Total Layers', value: '10 大地質層' },
      { labelZh: '解鎖格數要求', labelEn: 'Blocks To Unlock', value: '循序漸進解鎖 (100 ~ 5,000 方塊)' },
      { labelZh: '終極神物', labelEn: 'Ultimate Relic', value: '無限永恆碎片 (Infinity Shard)' }
    ],
    tipsZh: [
      '在採石場中挖掘越深的地層，開採方塊所獲取的玩家經驗值（XP）與金幣倍率越高！',
      '深層板岩硬度較大，建議升級附魔後再行深潛開採。'
    ],
    tipsEn: [
      'Deeper layers yield vastly higher base coin prices and player progression XP.',
      'Beware of the heightened hardness of deepslate when operating without haste buffs.'
    ]
  },

  // --- MOBS & MONSTERS ---
  {
    id: 'mob_creeper',
    category: 'mobs',
    nameZh: '苦力怕 (Creeper)',
    nameEn: 'Creeper',
    badgeZh: '潛伏自爆者',
    badgeEn: 'Silent Stalker',
    icon: '🧨',
    color: '#55a630',
    taglineZh: '安靜無聲地接近，隨之而來的是一聲致命的「嘶嘶——」。',
    taglineEn: 'Creeps up without footsteps, preceded only by a dreadful "hiss...".',
    descriptionZh: 'Minecraft 最具代表性的敵對生物。苦力怕白天不會燃燒，移動時幾乎完全靜音。當接近玩家約 3 格距離時，會膨脹發出「嘶——」的引信聲音，並在 1.5 秒後引發猛烈自爆，對周圍玩家與建築物造成毀滅性破壞。害怕貓與豹貓。',
    descriptionEn: 'The world-famous green camouflaged ambusher. Completely silent until it begins its 1.5-second hissing countdown before a catastrophic explosion. Terrified of cats.',
    stats: [
      { labelZh: '生命值', labelEn: 'Health', value: '20 點 (❤️ x 10)' },
      { labelZh: '掉落物', labelEn: 'Drops', value: '火藥 (Gunpowder)、唱片 (被骷髏射殺時)' },
      { labelZh: '閃電苦力怕', labelEn: 'Charged Form', value: '被雷擊中變為高壓苦力怕，爆炸威力加倍' },
      { labelZh: '最大傷害', labelEn: 'Max Damage', value: '普通 49 點 / 高壓 97 點' }
    ],
    tipsZh: [
      '飼養一隻貓在身邊是最好的苦力怕驅趕手段，苦力怕會主動避開貓 6 格以上。',
      '如果苦力怕即將爆炸，立刻在身前放置一個方塊或舉盾，能吸收高達 80%~100% 的爆炸傷害！'
    ],
    tipsEn: [
      'Tamed cats deter Creepers completely within a 6-block radius.',
      'Blocking with a Shield blocks 100% of Creeper explosive damage point-blank!'
    ]
  },
  {
    id: 'mob_enderman',
    category: 'mobs',
    nameZh: '終界使者 (Enderman)',
    nameEn: 'Enderman',
    badgeZh: '虛空瞬移者',
    badgeEn: 'Void Teleporter',
    icon: '👾',
    color: '#7b2cbf',
    taglineZh: '高挑黑影、幽紫微光；切勿直視它的雙眸，否則死神降臨。',
    taglineEn: 'Tall shadow emitting purple particles; never gaze directly into its eyes.',
    descriptionZh: '高達 3 格高的中立型神秘生物。平時隨機搬移方塊漫步，一旦玩家用準心直視其臉部或攻擊它，它會張大嘴巴發出驚悚尖叫並進入狂暴追擊狀態。能無視障礙物進行長距離瞬間移動。極度畏懼水，任何雨水或水源都會對其造成持續傷害。',
    descriptionEn: 'A 3-block tall neutral entity native to the End. Highly territorial: direct eye contact triggers terrifying screams and instantaneous teleporting melee assault. Extremely allergic to water.',
    stats: [
      { labelZh: '生命值', labelEn: 'Health', value: '40 點 (❤️ x 20)' },
      { labelZh: '核心掉落', labelEn: 'Crucial Drops', value: '終界珍珠 (Ender Pearl)' },
      { labelZh: '主要弱點', labelEn: 'Weakness', value: '水流 (Water)、雨天、頭頂戴雕刻南瓜' },
      { labelZh: '高度限制', labelEn: 'Height Barrier', value: '身高 3 格 (2 格高天花板可有效防護)' }
    ],
    tipsZh: [
      '頭上戴著雕刻南瓜（Carved Pumpkin）直視終界使者不會引起它的仇恨！',
      '搭建 2 格高的頂棚，玩家站在下方可無傷擊殺身高 3 格的終界使者。'
    ],
    tipsEn: [
      'Wearing a Carved Pumpkin prevents Endermen from aggroing when stared at.',
      'Standing beneath a 2-block ceiling makes you impervious to their attacks.'
    ]
  },
  {
    id: 'mob_ender_dragon',
    category: 'mobs',
    nameZh: '終界龍 (Ender Dragon)',
    nameEn: 'Ender Dragon',
    badgeZh: '終末霸主',
    badgeEn: 'Apex Boss',
    icon: '🐉',
    color: '#10002b',
    taglineZh: '翺翔於終界虛空的巨獸，Minecraft 主線冒險的終極考驗。',
    taglineEn: 'The winged titan of the End Void, the climactic ordeal of Minecraft.',
    descriptionZh: 'Minecraft 的初代終極 Boss。盤旋於終界主島的黑曜石柱之間，藉由柱頂的終界水晶（End Crystals）持續吸收能量回血。它會俯衝撞擊玩家並噴吐腐蝕性的紫龍息。擊敗它會噴發多達 12,000 點經驗值、生成終界折躍門，並在中心基岩祭壇掉落唯一的「龍蛋（Dragon Egg）」。',
    descriptionEn: 'The apex guardian of the End dimension. Heals from perched End Crystals atop obsidian pillars. Slain dragons unleash 12,000 XP, a gateway to End Cities, and the trophy Dragon Egg.',
    stats: [
      { labelZh: '生命值', labelEn: 'Health', value: '200 點 (❤️ x 100)' },
      { labelZh: '回血機制', labelEn: 'Healing', value: '終界水晶持續光束治療' },
      { labelZh: '擊敗經驗', labelEn: 'XP Reward', value: '初次擊殺 12,000 點經驗值' },
      { labelZh: '專屬戰利品', labelEn: 'Unique Trophy', value: '龍蛋 (Dragon Egg)、龍息 (需用玻璃瓶收集)' }
    ],
    tipsZh: [
      '戰鬥首要目標是摧毀所有黑曜石柱頂的終界水晶，有鐵欄杆保護的水晶需用箭射爆或攀爬破壞。',
      '利用「床在終界睡覺會爆炸」的特性（床爆法），可在終界龍停靠基岩柱時給予巨量爆發傷害！'
    ],
    tipsEn: [
      'Destroy all End Crystals first using bows and arrows before targeting the dragon.',
      'Using explosive Beds during its perch sequence deals massive burst damage.'
    ]
  },

  // --- MECHANICS & REDSTONE ---
  {
    id: 'mech_redstone',
    category: 'mechanics',
    nameZh: '紅石電路與自動化 (Redstone Engineering)',
    nameEn: 'Redstone Engineering',
    badgeZh: '科技大腦',
    badgeEn: 'Logic & Circuits',
    icon: '🔴',
    color: '#d00000',
    taglineZh: 'Minecraft 中的電力工程學，從自動活塞門到龐大計算機。',
    taglineEn: 'Minecraft electricity, powering automated sorting systems and contraptions.',
    descriptionZh: '紅石粉鋪在方塊上宛如電線，可傳導強弱 0 至 15 級的能量信號。搭配紅石火把、中繼器（延遲與中繼信號）、比較器（檢測容器存量與減法運算）、活塞、投擲器與漏斗，玩家可以設計出全自動採礦機、自動物品分類倉庫、隱藏機關門乃至完整的 8 位元 CPU！',
    descriptionEn: 'The electrical logic framework of Minecraft. Transmits signals from 0 to 15 strength. Combined with repeaters, comparators, and pistons, it fuels industrial sorting and automated farms.',
    stats: [
      { labelZh: '信號極限', labelEn: 'Signal Range', value: '15 格 (可用紅石中繼器重置延長)' },
      { labelZh: '遊戲刻速率', labelEn: 'Game Tick Rate', value: '20 刻/秒 (紅石刻為 10 刻/秒)' },
      { labelZh: '經典元件', labelEn: 'Key Components', value: '紅石粉、中繼器、比較器、活塞、偵測器、漏斗' }
    ],
    tipsZh: [
      '偵測器（Observer）能即時感應面前方塊的任何狀態更新（如甘蔗生長、紅石亮起）並發出 1 刻脈衝。',
      '漏斗（Hopper）能自動將上方物品吸入並傳遞至指向的箱子中，是自動化物流的心臟。'
    ],
    tipsEn: [
      'Observers output a 1-tick pulse whenever the block face directly in front changes.',
      'Hoppers move 2.5 items per second and form the foundation of automated inventory pipes.'
    ]
  },
  {
    id: 'mech_market_economy',
    category: 'mechanics',
    nameZh: '市場經濟與動態通膨 (Market Dynamics)',
    nameEn: 'Market Dynamics',
    badgeZh: '商業運作',
    badgeEn: 'Trade Dynamics',
    icon: '📈',
    color: '#38b000',
    taglineZh: '低買高賣的致富法則，洞察隨機牛市與暴跌危機。',
    taglineEn: 'Buy low, sell high: master cyclical bull markets and crash protection.',
    descriptionZh: '本作品中的方塊交易所具備高度動態的價格波動機制。每隔一段時間，市場價格倍率會在 0.5x 至 2.5x 之間波動，甚至觸發「黃金牛市（Gold Boom +150%）」或「市場崩盤（Market Crash -50%）」！聰明的礦工會在價格低迷時屯積高階礦石，待繁榮牛市一次拋售套現巨額金幣。',
    descriptionEn: 'The in-game Market Exchange simulates dynamic real-time supply and demand cycles with price multipliers ranging from 0.5x to 2.5x, featuring Market Booms and Crashes.',
    stats: [
      { labelZh: '波動區間', labelEn: 'Multiplier Range', value: '0.5x ~ 2.5x 基準價' },
      { labelZh: '刷新週期', labelEn: 'Tick Interval', value: '隨機時間或主動重整' },
      { labelZh: '特殊事件', labelEn: 'Special Events', value: '採礦熱潮、牛市暴漲、經濟恐慌' }
    ],
    tipsZh: [
      '當看見市場行情標示「牛市暴漲」時，切勿猶豫，立即將庫存的稀有礦石大量拋售！',
      '搭配自動採礦機的離線產能，可在牛市到來時瞬間成為富翁。'
    ],
    tipsEn: [
      'Sell stockpiled diamonds and ancient debris during Market Boom cycles for maximum multiplier.',
      'Auto-miner output can be hoarded until market prices surpass 1.8x.'
    ]
  },

  // --- TRIVIA & TIPS ---
  {
    id: 'trivia_water_bucket',
    category: 'trivia',
    nameZh: '水桶救命術 (MLG Water Bucket Trick)',
    nameEn: 'MLG Water Bucket Trick',
    badgeZh: '神級操作',
    badgeEn: 'Legendary Skill',
    icon: '🪣',
    color: '#0077b6',
    taglineZh: '無論自千米高空墜落，一滴水即可抵擋萬鈞重力。',
    taglineEn: 'Falling from the highest skies, a single droplet nullifies gravity.',
    descriptionZh: '在 Minecraft 的物理引擎中，只要玩家在著地瞬間落入任何深度的水流（即使只有最薄的一層水），所有累積的摔落傷害都將完全歸零！這項操作被全世界玩家譽為「MLG 水桶技巧」，是高空探險與下界山脈攀岩必備的求生神技。',
    descriptionEn: 'Minecraft physics dictates that falling into even the shallowest puddle resets fall damage to zero. The famous "MLG Water Bucket" is the most iconic trick in gaming history.',
    stats: [
      { labelZh: '減傷效果', labelEn: 'Damage Negation', value: '100% 免疫墜落傷害' },
      { labelZh: '有效深度', labelEn: 'Required Depth', value: '僅需 1 格水 (或水流邊緣)' },
      { labelZh: '下界限制', labelEn: 'Nether Exception', value: '水桶在下界蒸發無法倒出 (可用乾草捆、黏液塊代替)' }
    ],
    tipsZh: [
      '在下界無法使用水桶，但隨身攜帶「乾草捆（Hay Bale）」可吸收 80% 的墜落傷害，或使用「扭曲藤蔓」著地攀爬。',
      '按住右鍵連點通常能提高著地放置水流的成功率。'
    ],
    tipsEn: [
      'Water evaporates instantly in the Nether; use Hay Bales (-80% fall damage) or Twisting Vines instead.',
      'Spamming right-click upon approach increases landing success rate.'
    ]
  },
  {
    id: 'trivia_enchanting_setup',
    category: 'trivia',
    nameZh: '30級頂級附魔台擺法 (Level 30 Enchanting Setup)',
    nameEn: 'Level 30 Enchanting Setup',
    badgeZh: '神秘奧術',
    badgeEn: 'Arcane Mastery',
    icon: '📖',
    color: '#f72585',
    taglineZh: '15個書架環繞的古老儀式，解鎖全套極致神級詞條。',
    taglineEn: '15 bookshelves surrounding the altar unlock top-tier Level 30 enchantments.',
    descriptionZh: '附魔台需要吸收周圍書架釋放的漂浮符文能量才能提供 30 級的高階附魔。標準擺法為：附魔台四周環繞放置 15 個書架，距離附魔台 1 格空隙（5x5 方陣，留出 1 個出入口）。注意：書架與附魔台之間不得有任何障礙物（包括火把、地毯、雪或草），否則會阻斷符文能量傳導！',
    descriptionEn: 'An Enchanting Table requires 15 bookshelves placed in a 5x5 perimeter with exactly one block of air space in between. Any obstruction like torches or snow cancels the bookshelf bonus.',
    stats: [
      { labelZh: '必備書架數', labelEn: 'Required Bookshelves', value: '15 個書架' },
      { labelZh: '最高附魔等級', labelEn: 'Max Enchant Level', value: '30 級' },
      { labelZh: '消耗物品', labelEn: 'Resource Cost', value: '3 顆青金石 (Lapis) + 3 級經驗值' }
    ],
    tipsZh: [
      '若只需低階附魔（如只要效率I），可在書架與附魔台之間插上火把暫時遮蔽符文！',
      '附魔前先用砂輪（Grindstone）洗去不滿意的附魔還可回收部分經驗值。'
    ],
    tipsEn: [
      'Place a torch between the table and shelves to temporarily lower the enchant level.',
      'Use a Grindstone to disenchant bad rolls and recycle a portion of your XP.'
    ]
  },
  {
    id: 'trivia_creeper_origin',
    category: 'trivia',
    nameZh: '苦力怕的意外身世 (Accidental Origin of Creeper)',
    nameEn: 'Accidental Origin of Creeper',
    badgeZh: '歷史趣聞',
    badgeEn: 'Game Lore',
    icon: '🐷',
    color: '#ff758f',
    taglineZh: '原本只是一隻寫錯代碼的小豬，卻成為了遊戲史上最經典的噩夢。',
    taglineEn: 'A coding typo while designing the Pig inadvertently created gaming royalty.',
    descriptionZh: '你知道嗎？苦力怕最初竟然是一個程式碼 Bug！2009 年 Minecraft 創作者 Notch 在編寫「豬（Pig）」的模型代碼時，不小心將高度（Height）與長度（Length）的數值弄反，導致原本矮胖的小豬變成了一隻站立行走的細長四足怪獸。Notch 覺得這個怪模怪樣的模型非常詭異有趣，索性保留下來換上綠色迷彩貼圖，賦予它自爆機制，從此誕生了遊戲史上最具知名度的招牌怪物！',
    descriptionEn: 'In 2009, creator Markus "Notch" Persson accidentally swapped the length and height coordinates when coding the pig model. Finding the resulting tall, four-legged abomination delightfully creepy, he added TNT mechanics, birthing the legendary Creeper.',
    stats: [
      { labelZh: '誕生年份', labelEn: 'Year Created', value: '2009 年 (Alpha 0.24)' },
      { labelZh: '原始身分', labelEn: 'Original Model', value: '寫錯坐標的「豬 (Pig)」' },
      { labelZh: '文化地位', labelEn: 'Cultural Status', value: 'Minecraft 註冊商標「A」字母的臉孔' }
    ],
    tipsZh: [
      'Minecraft 的官方 Logo 中，中間字母「A」的孔洞正是苦力怕的面孔形狀。',
      '苦力怕死亡時閉上雙眼的特殊材質，在很早期版本中也是一個經典彩蛋。'
    ],
    tipsEn: [
      'The letter "A" in the official Minecraft logo features the Creeper\'s signature face.',
      'Piglins run away from soul fire, while Creepers run away from cats.'
    ]
  }
];
