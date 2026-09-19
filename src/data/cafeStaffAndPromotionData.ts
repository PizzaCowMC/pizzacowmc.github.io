import {
  CafeRoleId,
  StaffRank,
  StaffMember,
  CafePromotionTier,
  CafePromotionQuest
} from '../types';

export interface CafeRoleDefinition {
  id: CafeRoleId;
  nameZh: string;
  nameEn: string;
  icon: string;
  badgeColor: string;
  descZh: string;
  descEn: string;
  buffDescZh: string;
  buffDescEn: string;
}

export const CAFE_ROLES: CafeRoleDefinition[] = [
  {
    id: 'manager',
    nameZh: '店長',
    nameEn: 'Store Manager',
    icon: '👔',
    badgeColor: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
    descZh: '全店總指揮，統籌運營與客人迎送',
    descEn: 'Overall director overseeing operations and guest relations',
    buffDescZh: '全店金幣營業額 +25%，客人等待耐心 +30 秒，每日自動維持運轉',
    buffDescEn: '+25% total revenue, +30s guest patience, sustains daily cafe operations'
  },
  {
    id: 'barista',
    nameZh: '首席咖啡師',
    nameEn: 'Head Barista',
    icon: '☕',
    badgeColor: 'bg-orange-600/30 text-orange-300 border-orange-500/50',
    descZh: '精研頂級濃縮與礦物拉花特調',
    descEn: 'Master of mineral espresso and artisan latte arts',
    buffDescZh: '飲品與咖啡出餐速度 +100%，飲品類小費乘數 +1.5x',
    buffDescEn: '+100% brew speed, +1.5x tip multiplier for all beverages'
  },
  {
    id: 'chef',
    nameZh: '紅石主廚',
    nameEn: 'Executive Chef',
    icon: '👨‍🍳',
    badgeColor: 'bg-red-600/30 text-red-300 border-red-500/50',
    descZh: '掌管紅石溫控烤爐與地底熱食',
    descEn: 'Commands redstone thermal stoves and subterranean feasts',
    buffDescZh: '熱食與烘焙料理 25% 機率免消耗食材，烹飪獲得經驗 +50%',
    buffDescEn: '25% chance of zero-ingredient cooking, +50% culinary XP'
  },
  {
    id: 'waiter',
    nameZh: '外場領班',
    nameEn: 'Head Waiter',
    icon: '🏃‍♂️',
    badgeColor: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50',
    descZh: '巡視全場餐桌，光速端送佳餚',
    descEn: 'Patrols dining floors and delivers dishes with swift elegance',
    buffDescZh: '送餐流轉速度翻倍，客人入座流暢度 +50%，清理餐桌自動獲得額外金幣',
    buffDescEn: 'Doubles serving speed, +50% table turnover, bonus coins on table clear'
  },
  {
    id: 'mixologist',
    nameZh: '蒸氣調酒師',
    nameEn: 'Steam Mixologist',
    icon: '🍸',
    badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    descZh: '專職 4F 露天酒吧與夜間霓虹微醺特調',
    descEn: 'Specializes in rooftop lounge glowing cocktails and evening brews',
    buffDescZh: '露天酒吧與特調飲品 50% 機率觸發雙倍暴擊小費，全體客人心情雀躍',
    buffDescEn: '50% chance of double crit tip for bar drinks, enhances mood'
  },
  {
    id: 'sommelier',
    nameZh: '神域品鑑官',
    nameEn: 'Divine Sommelier',
    icon: '🎩',
    badgeColor: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50',
    descZh: '專門接待終界、天界、創世神話級稀有顧客',
    descEn: 'Attracts celestial, ender, and mythic VIP connoisseurs',
    buffDescZh: '大幅提高稀有 VIP 顧客入座機率，VIP 單筆點餐消費金幣加倍',
    buffDescEn: 'Drastically raises VIP patron frequency, doubles VIP dish spending'
  },
  {
    id: 'procurement',
    nameZh: '地底採購專員',
    nameEn: 'Procurement Specialist',
    icon: '⛏️',
    badgeColor: 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50',
    descZh: '每日深入地層深處採集稀有方塊食材',
    descEn: 'Ventures into the abyss to retrieve rare mineral ingredients',
    buffDescZh: '每隔一段時間自動為背包補給 5~15 個已解鎖深層食材方塊',
    buffDescEn: 'Periodically replenishes 5-15 rare strata ingredients into storage'
  }
];

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff_alex',
    nameZh: '艾利克斯 (店長)',
    nameEn: 'Alex (General Manager)',
    avatar: '👔',
    roleId: 'manager',
    level: 5,
    rank: 'Senior',
    assignedVenue: 'main',
    assignedStation: 'counter_main',
    isCrossDispatched: false,
    hireCost: 0,
    isHired: true,
    efficiencyBonus: 25
  },
  {
    id: 'staff_stew',
    nameZh: '咖啡師 史都華',
    nameEn: 'Stewart (Barista)',
    avatar: '☕',
    roleId: 'barista',
    level: 4,
    rank: 'Senior',
    assignedVenue: 'main',
    assignedStation: 'espresso_machine',
    isCrossDispatched: false,
    hireCost: 0,
    isHired: true,
    efficiencyBonus: 30
  },
  {
    id: 'staff_gordon',
    nameZh: '紅石主廚 高登',
    nameEn: 'Gordon (Chef)',
    avatar: '👨‍🍳',
    roleId: 'chef',
    level: 3,
    rank: 'Junior',
    assignedVenue: 'main',
    assignedStation: 'stove_kitchen',
    isCrossDispatched: false,
    hireCost: 0,
    isHired: true,
    efficiencyBonus: 20
  },
  {
    id: 'staff_lily',
    nameZh: '領班 莉莉',
    nameEn: 'Lily (Head Waiter)',
    avatar: '🏃‍♀️',
    roleId: 'waiter',
    level: 2,
    rank: 'Junior',
    assignedVenue: 'main',
    assignedStation: 'dining_floor',
    isCrossDispatched: false,
    hireCost: 5000,
    isHired: false,
    efficiencyBonus: 15
  },
  {
    id: 'staff_felix',
    nameZh: '調酒師 菲利克斯',
    nameEn: 'Felix (Mixologist)',
    avatar: '🍸',
    roleId: 'mixologist',
    level: 2,
    rank: 'Junior',
    assignedVenue: 'main',
    assignedStation: 'rooftop_bar',
    isCrossDispatched: false,
    hireCost: 12000,
    isHired: false,
    efficiencyBonus: 20
  },
  {
    id: 'staff_olivia',
    nameZh: '品鑑名媛 奧莉維亞',
    nameEn: 'Olivia (Sommelier)',
    avatar: '🎩',
    roleId: 'sommelier',
    level: 3,
    rank: 'Senior',
    assignedVenue: 'main',
    assignedStation: 'vip_lounge',
    isCrossDispatched: false,
    hireCost: 35000,
    isHired: false,
    efficiencyBonus: 35
  },
  {
    id: 'staff_digger',
    nameZh: '採購老礦工 巴克',
    nameEn: 'Barker (Procurement)',
    avatar: '⛏️',
    roleId: 'procurement',
    level: 3,
    rank: 'Senior',
    assignedVenue: 'main',
    assignedStation: 'storage_room',
    isCrossDispatched: false,
    hireCost: 20000,
    isHired: false,
    efficiencyBonus: 25
  },
  // 4 Legendary Cross-Realm Guests (異次元/跨界特聘傳奇顧問)
  {
    id: 'legend_ender_duke',
    nameZh: '終界次元調飲公爵',
    nameEn: 'Duke of Ender Void',
    avatar: '🌌',
    roleId: 'mixologist',
    level: 10,
    rank: 'Mythic',
    assignedVenue: 'branch_2',
    assignedStation: 'starlight_bar',
    isCrossDispatched: false,
    hireCost: 250000,
    isHired: false,
    isGuestLegend: true,
    legendTitleZh: '跨請自終界空島・虛空瞬移光速送餐',
    legendTitleEn: 'Headhunted from Ender Void • Instant Teleport Delivery',
    efficiencyBonus: 100
  },
  {
    id: 'legend_dwarf_baker',
    nameZh: '矮人黑曜石熔岩烘焙宗師',
    nameEn: 'Dwarven Magma Baker',
    avatar: '🌋',
    roleId: 'chef',
    level: 10,
    rank: 'Mythic',
    assignedVenue: 'main',
    assignedStation: 'magma_furnace',
    isCrossDispatched: false,
    hireCost: 300000,
    isHired: false,
    isGuestLegend: true,
    legendTitleZh: '跨請自地底深淵・熾熱甜點售價 +200%',
    legendTitleEn: 'Headhunted from Deep Core • Pastry Price +200%',
    efficiencyBonus: 120
  },
  {
    id: 'legend_aether_chef',
    nameZh: '天界以太光輝神廚',
    nameEn: 'Celestial Aether Arch-Chef',
    avatar: '👼',
    roleId: 'chef',
    level: 10,
    rank: 'Mythic',
    assignedVenue: 'branch_2',
    assignedStation: 'celestial_altar',
    isCrossDispatched: false,
    hireCost: 500000,
    isHired: false,
    isGuestLegend: true,
    legendTitleZh: '跨請自以太浮空神庭・50% 機率不消耗食材',
    legendTitleEn: 'Headhunted from Aether Sanctum • 50% Zero-Ingredient Cook',
    efficiencyBonus: 150
  },
  {
    id: 'legend_redstone_ai',
    nameZh: '紅石機械自動化總監',
    nameEn: 'Redstone Automation Overseer',
    avatar: '🤖',
    roleId: 'manager',
    level: 10,
    rank: 'Mythic',
    assignedVenue: 'main',
    assignedStation: 'redstone_core',
    isCrossDispatched: false,
    hireCost: 800000,
    isHired: false,
    isGuestLegend: true,
    legendTitleZh: '跨請自未來時空奇點・自動收取全店金幣小費',
    legendTitleEn: 'Headhunted from Singularity • Auto Collect All Table Coins',
    efficiencyBonus: 200
  }
];

export const CAFE_PROMOTION_TIERS: CafePromotionTier[] = [
  {
    rank: 1,
    nameZh: '街角石砌咖啡小館',
    nameEn: 'Village Stone Bistro',
    badge: 'Rank I • 新星起點',
    icon: '☕',
    titleHonorZh: '【街角見習店長】',
    titleHonorEn: '[Village Apprentice]',
    tipMultiplierBonus: 0.1,
    passiveDividendBonus: 20,
    requiredQuests: [
      {
        id: 'q1_1',
        rankLevel: 1,
        titleZh: '百客款待之禮',
        titleEn: 'A Hundred Feasts',
        descZh: '在咖啡廳累計送出並款待 50 份美味佳餚',
        descEn: 'Serve and delight 50 guest orders in the cafe',
        targetType: 'dishes_served',
        targetValue: 50,
        rewardCoins: 5000,
        rewardReputation: 10
      },
      {
        id: 'q1_2',
        rankLevel: 1,
        titleZh: '地層萬格深掘 (超級難任務)',
        titleEn: '50k Strata Excavation (Hardcore)',
        descZh: '在地底礦坑前置地層累計開採達 50,000 格方塊',
        descEn: 'Accumulate 50,000 mined blocks in the strata quarry',
        targetType: 'mined_blocks',
        targetValue: 50000,
        rewardCoins: 15000,
        rewardReputation: 15
      },
      {
        id: 'q1_3',
        rankLevel: 1,
        titleZh: '組建專業職位團隊',
        titleEn: 'Forming the Dream Team',
        descZh: '招募並在店內配置至少 3 位具備專業職位的員工',
        descEn: 'Recruit and assign at least 3 staffed team members',
        targetType: 'staff_count',
        targetValue: 3,
        rewardCoins: 8000,
        rewardReputation: 10
      },
      {
        id: 'q1_4',
        rankLevel: 1,
        titleZh: '小試啼聲・營運金儲備',
        titleEn: 'Capital Foundation',
        descZh: '持現金幣達到 20,000 🪙',
        descEn: 'Hold at least 20,000 coins in balance',
        targetType: 'coins_earned',
        targetValue: 20000,
        rewardCoins: 5000,
        rewardReputation: 10
      }
    ]
  },
  {
    rank: 2,
    nameZh: '蒸氣紅石連鎖名邸',
    nameEn: 'Redstone Steam Mansion',
    badge: 'Rank II • 繁華市邑',
    icon: '⚙️',
    titleHonorZh: '【紅石工坊名譽董事】',
    titleHonorEn: '[Redstone Steam Baron]',
    tipMultiplierBonus: 0.25,
    passiveDividendBonus: 60,
    requiredQuests: [
      {
        id: 'q2_1',
        rankLevel: 2,
        titleZh: '千味飄香 (超級難任務)',
        titleEn: 'Two Hundred Fifty Orders',
        descZh: '累計款待並送出 250 份料理',
        descEn: 'Serve and complete 250 customer dining orders',
        targetType: 'dishes_served',
        targetValue: 250,
        rewardCoins: 25000,
        rewardReputation: 15
      },
      {
        id: 'q2_2',
        rankLevel: 2,
        titleZh: '十萬格深層爆破 (超級難任務)',
        titleEn: '100k Strata Excavation (Hardcore)',
        descZh: '在地底深層累計開採達 100,000 格方塊，獲取深淵食材',
        descEn: 'Mine 100,000 blocks in deep strata for abyssal ingredients',
        targetType: 'mined_blocks',
        targetValue: 100000,
        rewardCoins: 50000,
        rewardReputation: 25
      },
      {
        id: 'q2_3',
        rankLevel: 2,
        titleZh: '能跨請！跨樓層調度支援',
        titleEn: 'Cross-Dispatch Mastery',
        descZh: '成功執行「跨請支援」派遣員工至其他樓層或崗位累計 5 次',
        descEn: 'Execute cross-dispatch staff deployment at least 5 times',
        targetType: 'cross_dispatch',
        targetValue: 5,
        rewardCoins: 18000,
        rewardReputation: 15
      },
      {
        id: 'q2_4',
        rankLevel: 2,
        titleZh: '金牌大師認證',
        titleEn: 'Master Staff Promotion',
        descZh: '培養至少 1 位員工晉升至大師級 (Master) 職位',
        descEn: 'Train at least 1 staff member to Master rank',
        targetType: 'master_staff',
        targetValue: 1,
        rewardCoins: 30000,
        rewardReputation: 20
      },
      {
        id: 'q2_5',
        rankLevel: 2,
        titleZh: '名邸金庫積累',
        titleEn: 'Mansion Vault',
        descZh: '持現金幣達到 100,000 🪙',
        descEn: 'Accumulate 100,000 coins in balance',
        targetType: 'coins_earned',
        targetValue: 100000,
        rewardCoins: 20000,
        rewardReputation: 15
      }
    ]
  },
  {
    rank: 3,
    nameZh: '皇家水晶精緻餐殿',
    nameEn: 'Royal Crystal Dining Citadel',
    badge: 'Rank III • 帝國御用',
    icon: '💎',
    titleHonorZh: '【皇家水晶御膳總管】',
    titleHonorEn: '[Royal Grand Steward]',
    tipMultiplierBonus: 0.5,
    passiveDividendBonus: 150,
    requiredQuests: [
      {
        id: 'q3_1',
        rankLevel: 3,
        titleZh: '五百盛饌宴群英 (超級難任務)',
        titleEn: 'Five Hundred Banquets',
        descZh: '累計款待並送出 500 份各式珍饌',
        descEn: 'Complete 500 gourmet dish deliveries',
        targetType: 'dishes_served',
        targetValue: 500,
        rewardCoins: 60000,
        rewardReputation: 25
      },
      {
        id: 'q3_2',
        rankLevel: 3,
        titleZh: '二十萬格地底深層突破 (極限地層)',
        titleEn: '200k Blocks Deep Excavation',
        descZh: '地底前置地層累計採掘突破 200,000 方塊',
        descEn: 'Excavate over 200,000 blocks in deep underground layers',
        targetType: 'mined_blocks',
        targetValue: 200000,
        rewardCoins: 100000,
        rewardReputation: 35
      },
      {
        id: 'q3_3',
        rankLevel: 3,
        titleZh: '跨界特聘！異次元傳奇大師',
        titleEn: 'Cross-Realm Legendary Hire',
        descZh: '跨界聘請至少 1 位異次元傳奇顧問 (終界調飲公爵或矮人熔岩主廚)',
        descEn: 'Cross-hire at least 1 legendary guest specialist',
        targetType: 'cross_dispatch',
        targetValue: 10,
        rewardCoins: 80000,
        rewardReputation: 30
      },
      {
        id: 'q3_4',
        rankLevel: 3,
        titleZh: '星級設施璀璨成林',
        titleEn: 'Crystal Facilities Shine',
        descZh: '全店設施平均星級達到 B1 以上',
        descEn: 'Achieve average facility rating of B1 or higher',
        targetType: 'facility_stars',
        targetValue: 12,
        rewardCoins: 50000,
        rewardReputation: 25
      },
      {
        id: 'q3_5',
        rankLevel: 3,
        titleZh: '皇家百萬金庫',
        titleEn: 'Royal Millionaire',
        descZh: '持現金幣達到 500,000 🪙',
        descEn: 'Hold 500,000 coins in treasury',
        targetType: 'coins_earned',
        targetValue: 500000,
        rewardCoins: 80000,
        rewardReputation: 30
      }
    ]
  },
  {
    rank: 4,
    nameZh: '幽匿共鳴深穴珍膳',
    nameEn: 'Deep Dark Resonance Lounge',
    badge: 'Rank IV • 深穴秘境',
    icon: '🍄',
    titleHonorZh: '【幽匿共鳴星廚之首】',
    titleHonorEn: '[Sculk Resonance Patriarch]',
    tipMultiplierBonus: 0.8,
    passiveDividendBonus: 350,
    requiredQuests: [
      {
        id: 'q4_1',
        rankLevel: 4,
        titleZh: '一千座上賓！千饌大典 (超級難任務)',
        titleEn: '1,000 Grand Banquets',
        descZh: '累計款待並送出 1,000 份料理',
        descEn: 'Serve and complete 1,000 total culinary meals',
        targetType: 'dishes_served',
        targetValue: 1000,
        rewardCoins: 150000,
        rewardReputation: 40
      },
      {
        id: 'q4_2',
        rankLevel: 4,
        titleZh: '三十五萬格幽匿深掘 (極限任務)',
        titleEn: '350k Blocks Abyssal Excavation',
        descZh: '深層地層累計開採突破 350,000 格方塊',
        descEn: 'Mine over 350,000 blocks deep inside the abyss',
        targetType: 'mined_blocks',
        targetValue: 350000,
        rewardCoins: 250000,
        rewardReputation: 50
      },
      {
        id: 'q4_3',
        rankLevel: 4,
        titleZh: '幽匿深研！深淵星級評定',
        titleEn: 'Abyssal Star Evaluations',
        descZh: '全設施星級累計達到 35 顆星以上',
        descEn: 'Accumulate 35 or more total facility stars',
        targetType: 'facility_stars',
        targetValue: 35,
        rewardCoins: 120000,
        rewardReputation: 35
      },
      {
        id: 'q4_4',
        rankLevel: 4,
        titleZh: '雙傳奇顧問坐鎮',
        titleEn: 'Dual Legendary Specialists',
        descZh: '店內跨請並聘請至少 2 位異次元傳奇顧問',
        descEn: 'Cross-hire at least 2 legendary dimension specialists',
        targetType: 'master_staff',
        targetValue: 2,
        rewardCoins: 200000,
        rewardReputation: 45
      },
      {
        id: 'q4_5',
        rankLevel: 4,
        titleZh: '深穴兩百萬神金',
        titleEn: 'Abyssal Treasury',
        descZh: '持現金幣達到 1,500,000 🪙',
        descEn: 'Hold 1,500,000 coins in balance',
        targetType: 'coins_earned',
        targetValue: 150000,
        rewardCoins: 150000,
        rewardReputation: 40
      }
    ]
  },
  {
    rank: 5,
    nameZh: '天界以太星輝神閣',
    nameEn: 'Celestial Aether Sanctum',
    badge: 'Rank V • 天界傳說',
    icon: '⭐',
    titleHonorZh: '【天界以太食神領主】',
    titleHonorEn: '[Celestial Aether God of Culinary]',
    tipMultiplierBonus: 1.2,
    passiveDividendBonus: 800,
    requiredQuests: [
      {
        id: 'q5_1',
        rankLevel: 5,
        titleZh: '兩千以太盛宴 (終極挑戰)',
        titleEn: '2,000 Heavenly Banquets',
        descZh: '累計款待並送出 2,000 份料理',
        descEn: 'Serve 2,000 customer meals across all floors',
        targetType: 'dishes_served',
        targetValue: 2000,
        rewardCoins: 300000,
        rewardReputation: 50
      },
      {
        id: 'q5_2',
        rankLevel: 5,
        titleZh: '五十萬格時空星脈開採 (終極挑戰)',
        titleEn: '500k Blocks Chrono Mining',
        descZh: '地底深層累計開採達 500,000 格方塊',
        descEn: 'Mine 500,000 blocks across subterranean layers',
        targetType: 'mined_blocks',
        targetValue: 500000,
        rewardCoins: 500000,
        rewardReputation: 60
      },
      {
        id: 'q5_3',
        rankLevel: 5,
        titleZh: '神之光輝！四位傳奇全員到齊',
        titleEn: 'All 4 Legendary Guests Hired',
        descZh: '終界公爵、矮人熔岩主廚、以太光輝神廚與紅石自動化總監全體在任',
        descEn: 'Cross-hire all 4 legendary dimension specialists',
        targetType: 'master_staff',
        targetValue: 4,
        rewardCoins: 600000,
        rewardReputation: 70
      },
      {
        id: 'q5_4',
        rankLevel: 5,
        titleZh: '五百萬富甲全服',
        titleEn: 'Celestial Multi-Millionaire',
        descZh: '持現金幣達到 5,000,000 🪙',
        descEn: 'Hold 5,000,000 coins in balance',
        targetType: 'coins_earned',
        targetValue: 5000000,
        rewardCoins: 500000,
        rewardReputation: 60
      }
    ]
  },
  {
    rank: 6,
    nameZh: '時空奇點未來黑洞咖啡廳',
    nameEn: 'Chrono Singularity Apex Cafe',
    badge: 'Rank VI • 奇點超時空',
    icon: '⏳',
    titleHonorZh: '【維度奇點終焉美食家】',
    titleHonorEn: '[Lord of Chrono Singularity]',
    tipMultiplierBonus: 2.0,
    passiveDividendBonus: 2000,
    requiredQuests: [
      {
        id: 'q6_1',
        rankLevel: 6,
        titleZh: '三千五百份時空珍饈 (神級試煉)',
        titleEn: '3,500 Spacetime Banquets',
        descZh: '累計款待並送出 3,500 份料理',
        descEn: 'Deliver 3,500 total culinary masterpieces',
        targetType: 'dishes_served',
        targetValue: 3500,
        rewardCoins: 1000000,
        rewardReputation: 80
      },
      {
        id: 'q6_2',
        rankLevel: 6,
        titleZh: '七十五萬格極限星核大開採',
        titleEn: '750k Blocks Cosmic Excavation',
        descZh: '累計地層採掘突破 750,000 格方塊',
        descEn: 'Mine 750,000 blocks in subterranean cosmos',
        targetType: 'mined_blocks',
        targetValue: 750000,
        rewardCoins: 1500000,
        rewardReputation: 90
      },
      {
        id: 'q6_3',
        rankLevel: 6,
        titleZh: '全員宗師與神話！專業巔峰',
        titleEn: 'Grandmaster & Mythic Staff',
        descZh: '擁有至少 6 位員工達到宗師級或神話級職位',
        descEn: 'Have 6+ staff members at Grandmaster or Mythic tier',
        targetType: 'staff_count',
        targetValue: 6,
        rewardCoins: 1200000,
        rewardReputation: 85
      },
      {
        id: 'q6_4',
        rankLevel: 6,
        titleZh: '千萬神豪富翁',
        titleEn: 'Ten Million Gold Tycoon',
        descZh: '持現金幣達到 10,000,000 🪙',
        descEn: 'Hold 10,000,000 coins in balance',
        targetType: 'coins_earned',
        targetValue: 10000000,
        rewardCoins: 1500000,
        rewardReputation: 100
      }
    ]
  },
  {
    rank: 7,
    nameZh: '創世神域・宇宙母核御膳神殿',
    nameEn: 'Genesis Supreme Cosmos Palace',
    badge: 'Rank VII • 創世極致 (MAX)',
    icon: '🪐',
    titleHonorZh: '【全知全能・創世食神大帝】',
    titleHonorEn: '[Omniscient Genesis Apex God]',
    tipMultiplierBonus: 3.5,
    passiveDividendBonus: 5000,
    requiredQuests: []
  }
];

export function getPromotionTier(rank: number): CafePromotionTier {
  return (
    CAFE_PROMOTION_TIERS.find(t => t.rank === rank) ||
    CAFE_PROMOTION_TIERS[CAFE_PROMOTION_TIERS.length - 1]
  );
}

export function getNextPromotionTier(currentRank: number): CafePromotionTier | null {
  return CAFE_PROMOTION_TIERS.find(t => t.rank === currentRank + 1) || null;
}
