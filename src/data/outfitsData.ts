import { CharacterOutfit } from '../types';

export const CHARACTER_OUTFITS: CharacterOutfit[] = [
  {
    id: 'classic_miner',
    nameZh: '經典礦工工作服',
    nameEn: 'Classic Miner Overalls',
    category: 'miner',
    rarity: 'common',
    cost: 0,
    icon: '⛏️',
    badgeZh: '經典冒險',
    badgeEn: 'Classic Explorer',
    descZh: '採用經典青色純棉與耐磨丹寧牛仔褲，地底挖礦與日常勞動的永恆經典。',
    descEn: 'Classic cyan cotton shirt paired with durable denim jeans. The timeless icon of excavation.',
    buffZh: '基礎採礦效率 +5%，全店基本運作順暢度提升',
    buffEn: '+5% Mining Efficiency & stable baseline cafe operations',
    headStyle: {
      hairColor: '#5a3d28',
      hatType: 'none'
    },
    bodyStyle: {
      skinTone: '#d49b73',
      torsoColor: '#008080', // Classic Steve teal
      torsoPattern: 'overalls',
      accentColor: '#006666',
      beltColor: '#4a2e12'
    },
    armsStyle: {
      sleeveColor: '#008080',
      handColor: '#d49b73',
      heldItem: 'pickaxe'
    },
    legsStyle: {
      pantsColor: '#2b3a67', // Blue jeans
      shoesColor: '#595959'
    }
  },
  {
    id: 'barista_uniform',
    nameZh: '典雅咖啡師圍裙',
    nameEn: 'Artisan Barista Apron',
    category: 'cafe_staff',
    rarity: 'rare',
    cost: 1800,
    icon: '☕',
    badgeZh: '職人特調',
    badgeEn: 'Artisan Special',
    descZh: '深焙咖啡色皮革半身圍裙，搭配米白襯衫與平頂貝雷帽，散發濃醇咖啡香。',
    descEn: 'Rich roasted espresso leather apron over cream-white shirt with a flat barista cap.',
    buffZh: '出餐速度 +15%，咖啡與特調類顧客小費額外 +20%',
    buffEn: '+15% Serving Speed & +20% extra tips on all coffees and specialty beverages',
    headStyle: {
      hairColor: '#3a2012',
      hatType: 'barista_cap',
      hatColor: '#3d2514'
    },
    bodyStyle: {
      skinTone: '#e0ab8b',
      torsoColor: '#4a2c11', // Coffee apron
      torsoPattern: 'apron',
      accentColor: '#f5f0eb', // White shirt
      beltColor: '#c5832b'
    },
    armsStyle: {
      sleeveColor: '#f5f0eb',
      handColor: '#e0ab8b',
      heldItem: 'coffee'
    },
    legsStyle: {
      pantsColor: '#1c1917',
      shoesColor: '#3d2514'
    }
  },
  {
    id: 'executive_chef',
    nameZh: '星級主廚白雙排扣禮袍',
    nameEn: 'Executive Chef Regalia',
    category: 'cafe_staff',
    rarity: 'rare',
    cost: 3200,
    icon: '👨‍🍳',
    badgeZh: '米其林紅石',
    badgeEn: 'Redstone Star',
    descZh: '專業高挺白廚帽、俐落雙排黑鈕扣與熱情紅領結，展現主廚對千種料理的最高敬意。',
    descEn: 'Tall pristine chef toque, double-breasted black buttons, and red necktie. Master of 1,000 recipes.',
    buffZh: '煮飯烹調耗時縮短 15%，所有熱食與烘焙料理經驗 +25%',
    buffEn: '-15% Cooking Duration on stoves & +25% culinary XP on hot meals',
    headStyle: {
      hairColor: '#27272a',
      hatType: 'chef_toque',
      hatColor: '#ffffff'
    },
    bodyStyle: {
      skinTone: '#f5c396',
      torsoColor: '#ffffff', // Chef white
      torsoPattern: 'suit',
      accentColor: '#dc2626', // Red tie
      beltColor: '#18181b'
    },
    armsStyle: {
      sleeveColor: '#ffffff',
      handColor: '#f5c396',
      heldItem: 'spatula'
    },
    legsStyle: {
      pantsColor: '#27272a',
      shoesColor: '#09090b'
    }
  },
  {
    id: 'royal_tuxedo',
    nameZh: '尊爵皇家執事燕尾服',
    nameEn: 'Royal Maitre D\' Tuxedo',
    category: 'cafe_staff',
    rarity: 'epic',
    cost: 6500,
    icon: '👔',
    badgeZh: '黑金貴族',
    badgeEn: 'Black-Tie Elite',
    descZh: '修身漆黑燕尾服、燙金滾邊領結與白絲絨手套，手托純銀餐盤，極致優雅。',
    descEn: 'Tailored jet-black tuxedo with gold-trimmed bowtie, white velvet gloves, and silver serving tray.',
    buffZh: '全店每日總營收 +12%，顧客入座耐心上限 +25 秒',
    buffEn: '+12% Total Cafe Daily Revenue & +25s guest waiting patience',
    headStyle: {
      hairColor: '#18181b',
      hatType: 'none'
    },
    bodyStyle: {
      skinTone: '#e2b38f',
      torsoColor: '#18181b', // Tuxedo black
      torsoPattern: 'suit',
      accentColor: '#f59e0b', // Gold tie/accents
      beltColor: '#d97706'
    },
    armsStyle: {
      sleeveColor: '#18181b',
      handColor: '#ffffff', // White glove
      heldItem: 'tray'
    },
    legsStyle: {
      pantsColor: '#18181b',
      shoesColor: '#09090b'
    }
  },
  {
    id: 'mixologist_neon',
    nameZh: '霓虹蒸氣調酒特裝',
    nameEn: 'Neon Cyber Mixologist',
    category: 'special',
    rarity: 'epic',
    cost: 8800,
    icon: '🍸',
    badgeZh: '高空夜行',
    badgeEn: 'Nightlife Spark',
    descZh: '暗紫色科技感背心與發光天青色能量飾條，護目鏡上閃爍著即時特調最佳配比數據。',
    descEn: 'Deep violet tactical vest with glowing cyan energy lines. HUD goggles computing artisan blend formulas.',
    buffZh: '酒吧飲品暴擊小費機率 +35%，特調料理收益翻倍機率 +15%',
    buffEn: '+35% Bar Tip Crit Chance & +15% double earnings proc rate',
    headStyle: {
      hairColor: '#06b6d4', // Cyan hair
      hatType: 'goggles',
      hatColor: '#06b6d4'
    },
    bodyStyle: {
      skinTone: '#deb887',
      torsoColor: '#312e81', // Indigo vest
      torsoPattern: 'vest',
      accentColor: '#06b6d4', // Neon cyan
      beltColor: '#6366f1'
    },
    armsStyle: {
      sleeveColor: '#1e1b4b',
      handColor: '#deb887',
      heldItem: 'shaker'
    },
    legsStyle: {
      pantsColor: '#18181b',
      shoesColor: '#06b6d4'
    }
  },
  {
    id: 'sommelier_noble',
    nameZh: '紫晶神域品鑑華服',
    nameEn: 'Amethyst Sommelier Regalia',
    category: 'cafe_staff',
    rarity: 'legendary',
    cost: 16000,
    icon: '💎',
    badgeZh: '天界品味',
    badgeEn: 'Celestial Palate',
    descZh: '以終界紫水晶粉與天鵝絨織成的奢華長袍，頭頂細緻晶鑽小冠，手持璀璨神域高腳杯。',
    descEn: 'Woven from velvet and ender amethyst dust, adorned with a delicate tiara and radiant crystal goblet.',
    buffZh: '神話與VIP顧客入座機率 +50%，單筆VIP訂單獲取金幣提高 30%',
    buffEn: '+50% VIP & Mythic guest visit chance, +30% coins per VIP order',
    headStyle: {
      hairColor: '#a855f7',
      hatType: 'tiara',
      hatColor: '#e9d5ff'
    },
    bodyStyle: {
      skinTone: '#fae8ff',
      torsoColor: '#581c87', // Amethyst purple
      torsoPattern: 'robe',
      accentColor: '#c084fc',
      beltColor: '#f59e0b'
    },
    armsStyle: {
      sleeveColor: '#581c87',
      handColor: '#fae8ff',
      heldItem: 'wine'
    },
    legsStyle: {
      pantsColor: '#3b0764',
      shoesColor: '#7e22ce'
    }
  },
  {
    id: 'netherite_hazard',
    nameZh: '獄髓防護耐熱重裝',
    nameEn: 'Netherite Hazard Suit',
    category: 'miner',
    rarity: 'legendary',
    cost: 24000,
    icon: '🛡️',
    badgeZh: '岩漿防護',
    badgeEn: 'Lava Hazard Proof',
    descZh: '以遠古殘骸融煉的黑石獄髓甲胄，內建岩漿冷卻管道與烈焰護目面罩，無懼高溫。',
    descEn: 'Forged from ancient debris alloy with built-in magma cooling pipes and thermal blast shield.',
    buffZh: '深層採掘抗疲勞 +50%，採礦十字鎬耐久損耗降低 35%',
    buffEn: '+50% Deep Mining Endurance & -35% Pickaxe Durability loss',
    headStyle: {
      hairColor: '#18181b',
      hatType: 'miner_helmet',
      hatColor: '#2e2933'
    },
    bodyStyle: {
      skinTone: '#3f3f46',
      torsoColor: '#27252b', // Netherite armor
      torsoPattern: 'armor',
      accentColor: '#ea580c', // Orange magma glowing vents
      beltColor: '#78350f'
    },
    armsStyle: {
      sleeveColor: '#27252b',
      handColor: '#18181b',
      heldItem: 'lantern'
    },
    legsStyle: {
      pantsColor: '#1c1917',
      shoesColor: '#ea580c'
    }
  },
  {
    id: 'celestial_starlight',
    nameZh: '星穹天界光冕長袍',
    nameEn: 'Celestial Sovereign Mantle',
    category: 'special',
    rarity: 'mythic',
    cost: 48000,
    icon: '👑',
    badgeZh: '創世神尊',
    badgeEn: 'Mythic Deity',
    descZh: '凝聚百萬顆恆星光芒的造物神明祭袍，周身環繞浮動星環，金尊無雙。',
    descEn: 'Mythic mantle gathering the light of a million stars. Crowned with celestial aura.',
    buffZh: '全店營收 +25%，烹飪時間全域縮短 20%，全成就解鎖經驗 +30%',
    buffEn: '+25% All Cafe Revenue, -20% Global Cooking Duration, +30% All XP',
    headStyle: {
      hairColor: '#fef08a',
      hatType: 'crown',
      hatColor: '#facc15'
    },
    bodyStyle: {
      skinTone: '#fef9c3',
      torsoColor: '#4338ca', // Cosmic deep royal indigo
      torsoPattern: 'robe',
      accentColor: '#facc15', // Pure gold trim
      beltColor: '#fbbf24'
    },
    armsStyle: {
      sleeveColor: '#4338ca',
      handColor: '#fef9c3',
      heldItem: 'sword'
    },
    legsStyle: {
      pantsColor: '#312e81',
      shoesColor: '#facc15'
    }
  },
  {
    id: 'maid_cafe_elegance',
    nameZh: '典雅蕾絲女僕/執事裝',
    nameEn: 'Elegance Maid & Butler Frock',
    category: 'cafe_staff',
    rarity: 'rare',
    cost: 4500,
    icon: '🎀',
    badgeZh: '溫馨滿分',
    badgeEn: 'Cozy Hospitality',
    descZh: '細緻蕾絲喀什米爾花邊圍裙與蝴蝶領結，步履輕盈，給每一位客人最親切的笑容。',
    descEn: 'Delicate lace ruffled apron with ribbon bowtie. Delivers every treat with heartfelt hospitality.',
    buffZh: '送餐滿意度提升 30%，小費基礎底金 +15%',
    buffEn: '+30% Serving Satisfaction & +15% Base Tip Allowance',
    headStyle: {
      hairColor: '#78350f',
      hatType: 'cat_ears',
      hatColor: '#ffffff'
    },
    bodyStyle: {
      skinTone: '#fed7aa',
      torsoColor: '#18181b', // Black dress
      torsoPattern: 'apron',
      accentColor: '#ffffff', // White ruffles
      beltColor: '#ffffff'
    },
    armsStyle: {
      sleeveColor: '#ffffff',
      handColor: '#fed7aa',
      heldItem: 'tray'
    },
    legsStyle: {
      pantsColor: '#18181b',
      shoesColor: '#09090b'
    }
  },
  {
    id: 'steampunk_inventor',
    nameZh: '蒸氣工坊首席發明家',
    nameEn: 'Steampunk Aeronaut Suit',
    category: 'special',
    rarity: 'epic',
    cost: 7200,
    icon: '⚙️',
    badgeZh: '齒輪機械',
    badgeEn: 'Clockwork Gear',
    descZh: '黃銅護目鏡、重型牛皮工具吊帶與齒輪發條袖套，掌控地下紅石與蒸汽動力樞紐。',
    descEn: 'Brass aviator goggles, heavy leather tool suspenders, and clockwork spring gauntlets.',
    buffZh: '紅石設施與工作台產能 +25%，金幣翻倍機率 +10%',
    buffEn: '+25% Redstone Facility Output & +10% Lucky Double Coin proc',
    headStyle: {
      hairColor: '#b45309',
      hatType: 'goggles',
      hatColor: '#b45309'
    },
    bodyStyle: {
      skinTone: '#fcd34d',
      torsoColor: '#78350f', // Brown leather
      torsoPattern: 'overalls',
      accentColor: '#f59e0b', // Brass gears
      beltColor: '#b45309'
    },
    armsStyle: {
      sleeveColor: '#92400e',
      handColor: '#fcd34d',
      heldItem: 'clipboard'
    },
    legsStyle: {
      pantsColor: '#451a03',
      shoesColor: '#78350f'
    }
  }
];

export function getOutfitById(id?: string): CharacterOutfit {
  if (!id) return CHARACTER_OUTFITS[0];
  return CHARACTER_OUTFITS.find(o => o.id === id) || CHARACTER_OUTFITS[0];
}
