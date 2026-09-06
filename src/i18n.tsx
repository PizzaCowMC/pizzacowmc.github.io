import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type Language = 'en' | 'zh';

const STORAGE_KEY = 'minecraft_workshop_language';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallbackOrParams?: string | Record<string, string | number>) => string;
  getName: (item?: { nameEn?: string; nameZh?: string; title?: string } | null) => string;
  getDesc: (item?: { descEn?: string; descZh?: string; description?: string; desc?: string } | null) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // App Header & Branding
    'app.title': 'Minecraft Quarry & Workshop',
    'app.subtitle': 'Stratum Mining • 1,000-Block Creative Grid • Market Economy',
    'app.tagline': 'By PizzaCowMC',

    // Nav & Views
    'nav.all': 'All Views',
    'nav.quarry': '⛏️ Quarry',
    'nav.building': '🧱 Building',
    'nav.market': '💰 Market',
    'nav.shop': '🛒 Shop',
    'nav.festivals': '🎉 Festivals',
    'nav.achievements': '🏆 Trophy',
    'nav.friends': '👥 Friends',
    'nav.changelog': '📜 Log',
    'nav.account': '☁️ Account',
    'nav.menu': '☰ Menu',
    'nav.guest': 'Guest',

    // Language Toggle
    'lang.current': 'English',
    'lang.switch': '中文',
    'lang.label': 'Language: English',

    // Stats & Header values
    'stats.coins': 'Coins',
    'stats.totalMined': 'Total Mined',
    'stats.blocks': 'blocks',
    'stats.durability': 'Durability',

    // Buffs
    'buff.haste': '⚡ Haste Active',
    'buff.extremeHaste': '🍡 Extreme Haste',
    'buff.zeroDurability': '❄️ Durability Locked',
    'buff.doubleCoins': '🍬 Double Coins',
    'buff.autoMiner': '🤖 Auto-Miner Active',

    // Quarry Mining
    'quarry.title': 'Excavation Quarry',
    'quarry.subtitle': 'Tap block repeatedly to mine resources into your inventory',
    'quarry.selectLayer': 'Select Mining Stratum',
    'quarry.stratumProgress': '100,000 Blocks Progress',
    'quarry.nextLayer': 'Next layer unlocks after mining 100,000 blocks in current layer:',
    'quarry.unlocked': 'Unlocked',
    'quarry.locked': 'Locked',
    'quarry.tapToMine': 'CLICK OR TAP TO MINE',
    'quarry.miningHardness': 'Hardness',
    'quarry.sellPrice': 'Base Price',
    'quarry.miningTime': 'Est. Time',
    'quarry.sec': 's',
    'quarry.brokenPickaxe': '⚠️ PICKAXE BROKEN! Switched to Bare Hands.',
    'quarry.repairPrompt': 'Visit Shop to repair or purchase new pickaxes.',
    'quarry.gotoShop': 'Go to Shop',
    'quarry.critHit': 'CRITICAL HIT!',
    'quarry.blockDestroyed': 'Mined!',
    'quarry.autoMining': 'Auto-miner mining...',

    // Building Zone
    'build.title': '1,000-Block Creative Studio',
    'build.subtitle': 'Place blocks from inventory onto 25x40 (1,000-cell) creative stage',
    'build.selectedBlock': 'Selected Block',
    'build.none': 'None',
    'build.clickToSelect': 'Click a block from your hotbar below to build',
    'build.clearCanvas': 'Clear Canvas',
    'build.clearConfirm': 'Clear all blocks on the 1,000-cell grid? Returned blocks will be recycled.',
    'build.reclaimed': 'Reclaimed',
    'build.placed': 'Placed',
    'build.blocksUsed': 'Grid Occupied',

    // Hotbar
    'hotbar.sellBlocks': 'Sell',
    'hotbar.coins': 'Coins (Click to Sell)',
    'hotbar.durability': 'Durability',
    'hotbar.bareHands': 'Bare Hands',
    'hotbar.inStock': 'In Stock',

    // Market Modal
    'market.title': 'Mineral & Resource Market',
    'market.subtitle': 'Trade raw ores for coins. Catch high-inflation waves for profit!',
    'market.totalWorth': 'Estimated Total Inventory Value',
    'market.sellAll': 'Sell All Items',
    'market.sell1': 'Sell 1',
    'market.sell10': 'Sell 10',
    'market.sell50': 'Sell 50',
    'market.sellAllSingle': 'Sell All',
    'market.currentPrice': 'Unit Price',
    'market.multiplier': 'Market Multiplier',
    'market.inflationEvent': 'Active Market Dynamic',
    'market.normalMarket': 'Stable Market (1.0x)',
    'market.remaining': 'Remaining',
    'market.emptyInventory': 'Your inventory is currently empty. Go mine blocks in the quarry!',

    // Shop Modal
    'shop.title': 'Workshop Emporium',
    'shop.subtitle': 'Upgrade tools, unlock thematic atmospheres, skins & automation',
    'shop.tabPickaxes': 'Pickaxes & Enchants',
    'shop.tabThemes': 'Theme Backgrounds',
    'shop.tabSkins': 'Character Skins',
    'shop.tabSupplies': 'Supplies & Automation',
    'shop.speed': 'Mining Speed',
    'shop.maxDurability': 'Max Durability',
    'shop.buy': 'Buy',
    'shop.equip': 'Equip',
    'shop.equipped': 'Equipped',
    'shop.owned': 'Owned',
    'shop.efficiency': 'Efficiency',
    'shop.unbreaking': 'Unbreaking',
    'shop.fortune': 'Fortune',
    'shop.enchantUpgrade': 'Enchant Upgrade',
    'shop.level': 'Level',
    'shop.repairPickaxe': 'Repair Tool to 100%',
    'shop.autoMinerActive': 'Active & Operational',
    'shop.autoMinerBuy': 'Purchase Steam Auto-Miner Robot',

    // Festivals Modal
    'festivals.title': 'Festival Celebrations Hall',
    'festivals.subtitle': 'Halloween • Christmas • Lunar New Year • Sakura • Summer',
    'festivals.activeFestival': 'Active Festival Theme',
    'festivals.switchFestival': 'Switch Celebration Theme',
    'festivals.claimDaily': 'Claim Daily Festive Gift',
    'festivals.dailyClaimed': 'Today\'s Gift Claimed',
    'festivals.freeCoins': 'Free Coins',
    'festivals.specialPickaxe': 'Holiday Exclusive Pickaxe',
    'festivals.specialItems': 'Festive Booster Supplies',
    'festivals.applyTheme': 'Apply Festival Ambiance',
    'festivals.buffStatus': 'Active Festive Boosters',

    // Achievements Modal
    'achievements.title': 'Trophy & Milestones',
    'achievements.subtitle': '100,000 Comprehensive Milestones • Earn High Coin Bounties',
    'achievements.search': 'Search achievements...',
    'achievements.claimAll': 'Claim All Available Rewards',
    'achievements.claimed': 'Claimed',
    'achievements.claimReward': 'Claim',
    'achievements.locked': 'Locked',
    'achievements.catAll': 'All (100,000)',
    'achievements.catMining': 'Mining',
    'achievements.catEconomy': 'Economy',
    'achievements.catEquipment': 'Equipment',
    'achievements.catBuilding': 'Building',
    'achievements.catSocial': 'Social',
    'achievements.catCollection': 'Collection',
    'achievements.progress': 'Completed',

    // Friends Modal
    'friends.title': 'Social & Friends Network',
    'friends.subtitle': 'Connect with fellow miners and claim companion rewards',
    'friends.myCode': 'Your Friend Code',
    'friends.username': 'Your Username',
    'friends.addFriend': 'Add Friend by Code',
    'friends.inputPlaceholder': 'Enter 6-character friend code...',
    'friends.firstReward': 'First Friend Bonus',
    'friends.claimBonus': 'Claim 100 Coins',
    'friends.bonusClaimed': 'Bonus Claimed',
    'friends.noFriends': 'No friends added yet. Share your code with players!',

    // Changelog Modal
    'changelog.title': 'Release Notes & Version Log',
    'changelog.subtitle': 'Explore latest features, system optimizations and roadmap',
    'changelog.close': 'Close',
    'changelog.author': 'Created & Developed by',

    // Game Menu Modal
    'menu.title': 'Game Navigation Menu',
    'menu.subtitle': 'Quick access to all modules and configurations',
    'menu.soundOn': 'Sound: ON',
    'menu.soundOff': 'Sound: MUTED',
    'menu.resume': 'Resume Game',
    'menu.dangerZone': 'Danger Zone: Hard Reset All Progress',
    'menu.dangerWarning': 'This will permanently wipe all coins, inventory, pickaxes, and builds back to zero.',
    'menu.confirmReset': 'Confirm Reset',
    'menu.cancel': 'Cancel',
    'menu.resetPrompt': 'Are you absolutely sure you want to reset all game progress?',

    // Auth & Cloud Modal
    'auth.title': 'Firebase Account & Cloud Save',
    'auth.subtitle': 'Register, login, auto-login and real-time cloud save sync',
    'auth.tabCloud': 'Cloud Save',
    'auth.tabLogin': 'Account Login',
    'auth.tabRegister': 'Register New Player',
    'auth.tabConfig': 'Firebase Project Config',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.displayName': 'Player Nickname (Display Name)',
    'auth.loginBtn': 'Login & Load Cloud Save',
    'auth.registerBtn': 'Confirm Registration & Auto Login',
    'auth.loggingIn': 'Logging in...',
    'auth.registering': 'Registering...',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.registerNow': 'Register as a new miner',
    'auth.switchToLogin': 'Switch to Login',
    'auth.autoLoginNotice': 'Auto-login is enabled: Your identity and progress will automatically sync upon next visit.',
    'auth.currentIdentity': 'Current Identity:',
    'auth.onlineLoggedIn': 'Online (Logged In)',
    'auth.guestMode': 'Guest Mode (Local Storage Only)',
    'auth.notLoggedIn': 'Not logged into Firebase',
    'auth.logout': 'Logout',
    'auth.syncStatus': 'Cloud Synchronization Status',
    'auth.lastSynced': 'Last Synced:',
    'auth.notSyncedYet': 'Not Synced Yet',
    'auth.syncDesc': 'Cloud save preserves coins, inventory blocks, pickaxe tier, durability, 1,000-cell building plots, all 100,000 achievements, and all statistics.',
    'auth.uploadProgress': 'Upload Current Progress to Cloud',
    'auth.downloadProgress': 'Download & Load Cloud Progress',
    'auth.sendCode': 'Send Code to Email',
    'auth.sendingCode': 'Sending...',
    'auth.resendCode': 'Resend in',
    'auth.verificationCode': 'Email Verification Code (6-digit)',
    'auth.codePlaceholder': 'Enter 6-digit verification code...',
    'auth.verifyCodeBtn': 'Verify Code',
    'auth.verifying': 'Verifying...',
    'auth.emailVerified': 'Email Verified Successfully',
    'auth.emailUnverified': 'Email Not Verified',
    'auth.codeSentPrompt': 'Verification code sent to your entered email address!',
    'auth.codeRequiredPrompt': 'Please obtain and enter the 6-digit verification code sent to your email first!',
    'auth.customProjectTip': 'Use your own Firebase project: Paste your web config object below, or define env variables in .env.',
    'auth.pasteConfigLabel': 'Quick-Paste Firebase Config (JSON / JS Object)',
    'auth.pasteConfigHint': 'Firebase Console > Project Settings > General',
    'auth.parseJson': 'Parse JSON into form fields',
    'auth.applyConfig': 'Apply & Save Config',
    'auth.ready': 'Cloud Save Ready',

    // Common / Notifications
    'common.coins': 'coins',
    'common.cost': 'Cost',
    'common.free': 'Free',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',

    // Building Zone
    'building.title': '1,000-Cell Creative Studio',
    'building.clear': 'Clear All',

    // Achievements
    'achievements.claim': 'Claim',
    'achievements.unlocked': 'Unlocked',

    // Friends
    'friends.copyCode': 'Copy Code',

    // Shop Tabs
    'shop.pickaxesTab': 'Pickaxes',
    'shop.skinsTab': 'Skins',
    'shop.suppliesTab': 'Supplies',
    'shop.themesTab': 'Themes'
  },
  zh: {
    // App Header & Branding
    'app.title': 'Minecraft 挖掘場與建築工坊',
    'app.subtitle': '深層地脈採礦 • 1000格建築創作 • 市場動態經濟',
    'app.tagline': 'By PizzaCowMC',

    // Nav & Views
    'nav.all': '全部視圖',
    'nav.quarry': '⛏️ 挖掘場',
    'nav.building': '🧱 建築區',
    'nav.market': '💰 交易所',
    'nav.shop': '🛒 商店',
    'nav.festivals': '🎉 慶典',
    'nav.achievements': '🏆 成就',
    'nav.friends': '👥 好友',
    'nav.changelog': '📜 日誌',
    'nav.account': '☁️ 帳號',
    'nav.menu': '☰ 選單',
    'nav.guest': '訪客遊玩',

    // Language Toggle
    'lang.current': '繁體中文',
    'lang.switch': 'English',
    'lang.label': '語言：繁體中文',

    // Stats & Header values
    'stats.coins': '遊戲幣',
    'stats.totalMined': '累計挖掘',
    'stats.blocks': '格方塊',
    'stats.durability': '耐久度',

    // Buffs
    'buff.haste': '⚡ 急迫採礦中',
    'buff.extremeHaste': '🍡 極限急迫加成',
    'buff.zeroDurability': '❄️ 耐久鎖死不扣',
    'buff.doubleCoins': '🍬 雙倍金幣翻倍',
    'buff.autoMiner': '🤖 自動採礦機運轉中',

    // Quarry Mining
    'quarry.title': '礦脈挖掘場',
    'quarry.subtitle': '持續敲擊方塊進行開採，採獲資源將直接存入背包',
    'quarry.selectLayer': '選擇開採地脈層級',
    'quarry.stratumProgress': '10萬格進度',
    'quarry.nextLayer': '當前層級累計挖掘達 100,000 格解鎖下一層：',
    'quarry.unlocked': '已解鎖',
    'quarry.locked': '未解鎖',
    'quarry.tapToMine': '點擊或長按方塊進行採掘',
    'quarry.miningHardness': '方塊硬度',
    'quarry.sellPrice': '基礎售價',
    'quarry.miningTime': '預估開採時間',
    'quarry.sec': '秒',
    'quarry.brokenPickaxe': '⚠️ 鎬具已損毀！目前以徒手開採。',
    'quarry.repairPrompt': '請前往商店修復或購買高等級鎬具。',
    'quarry.gotoShop': '前往商店',
    'quarry.critHit': '爆擊開採！',
    'quarry.blockDestroyed': '開採完成！',
    'quarry.autoMining': '自動採礦魔像採掘中...',

    // Building Zone
    'build.title': '1000 格創作建築工坊',
    'build.subtitle': '消耗背包方塊在 25x40 (1,000格) 平面自由拼貼與搭建藝術創作',
    'build.selectedBlock': '當前選中方塊',
    'build.none': '無',
    'build.clickToSelect': '點擊下方快捷列選擇方塊以開始建造',
    'build.clearCanvas': '清空畫布',
    'build.clearConfirm': '確定清空 1000 格畫布上所有方塊嗎？方塊將 100% 完整回收至背包。',
    'build.reclaimed': '已回收',
    'build.placed': '已放置',
    'build.blocksUsed': '已佔用格數',

    // Hotbar
    'hotbar.sellBlocks': '賣出',
    'hotbar.coins': '幣 (點擊賣方塊)',
    'hotbar.durability': '耐久',
    'hotbar.bareHands': '徒手',
    'hotbar.inStock': '庫存',

    // Market Modal
    'market.title': '礦產資源交易所',
    'market.subtitle': '將開採的方塊出售換取金幣，留意通膨行情獲取最大暴利！',
    'market.totalWorth': '背包方塊總估值',
    'market.sellAll': '一鍵全賣背包方塊',
    'market.sell1': '賣出 1 個',
    'market.sell10': '賣出 10 個',
    'market.sell50': '賣出 50 個',
    'market.sellAllSingle': '全賣',
    'market.currentPrice': '單價',
    'market.multiplier': '市場倍率',
    'market.inflationEvent': '當前市場動態',
    'market.normalMarket': '市場平穩 (1.0x)',
    'market.remaining': '剩餘時間',
    'market.emptyInventory': '背包目前空空如也，快去挖掘場採集方塊吧！',

    // Shop Modal
    'shop.title': '工坊裝備與主題商店',
    'shop.subtitle': '鍛造高級鎬具、附魔強化、選購主題背景、經典外觀與補給道具',
    'shop.tabPickaxes': '鎬具與附魔',
    'shop.tabThemes': '主題背景',
    'shop.tabSkins': '角色外觀',
    'shop.tabSupplies': '補給與自動化',
    'shop.speed': '採礦速度',
    'shop.maxDurability': '最高耐久',
    'shop.buy': '購買',
    'shop.equip': '裝備',
    'shop.equipped': '已裝備',
    'shop.owned': '已擁有',
    'shop.efficiency': '效率附魔',
    'shop.unbreaking': '耐久附魔',
    'shop.fortune': '幸運附魔',
    'shop.enchantUpgrade': '附魔升級',
    'shop.level': '等級',
    'shop.repairPickaxe': '全滿修復當前鎬具',
    'shop.autoMinerActive': '已啟動運作中',
    'shop.autoMinerBuy': '購買蒸氣紅石自動採礦魔像',

    // Festivals Modal
    'festivals.title': '節慶狂歡大廳',
    'festivals.subtitle': '萬聖節 • 聖誕節 • 農曆新春 • 櫻花祭 • 夏日祭典',
    'festivals.activeFestival': '當前慶典主題',
    'festivals.switchFestival': '切換慶典活動',
    'festivals.claimDaily': '領取每日節慶祝福大禮包',
    'festivals.dailyClaimed': '今日禮包已領取',
    'festivals.freeCoins': '免費金幣',
    'festivals.specialPickaxe': '節慶限定專屬神鎬',
    'festivals.specialItems': '節慶限定特惠補給品',
    'festivals.applyTheme': '套用節慶氛圍背景',
    'festivals.buffStatus': '當前節慶增益狀態',

    // Achievements Modal
    'achievements.title': '成就榮耀殿堂',
    'achievements.subtitle': '100,000 個終極里程碑挑戰 • 達成領取高額遊戲幣獎賞',
    'achievements.search': '搜尋成就名稱或描述...',
    'achievements.claimAll': '一鍵領取所有已達成獎勵',
    'achievements.claimed': '已領取',
    'achievements.claimReward': '領取獎勵',
    'achievements.locked': '未達成',
    'achievements.catAll': '全部 (100,000)',
    'achievements.catMining': '開採里程',
    'achievements.catEconomy': '財富經濟',
    'achievements.catEquipment': '裝備鍛造',
    'achievements.catBuilding': '建築工程',
    'achievements.catSocial': '好友社交',
    'achievements.catCollection': '礦物收集',
    'achievements.progress': '已達成進度',

    // Friends Modal
    'friends.title': '好友互動與代碼系統',
    'friends.subtitle': '與好友一同探索礦脈，領取首位好友大禮包',
    'friends.myCode': '您的專屬好友代碼',
    'friends.username': '您的玩家暱稱',
    'friends.addFriend': '透過代碼加入好友',
    'friends.inputPlaceholder': '輸入 6 碼好友代碼...',
    'friends.firstReward': '首位好友迎新大禮包',
    'friends.claimBonus': '領取 100 遊戲幣',
    'friends.bonusClaimed': '已領取迎新獎勵',
    'friends.noFriends': '目前尚未加入好友，快將專屬代碼分享給好友吧！',

    // Changelog Modal
    'changelog.title': '版本更新日誌 (Changelog)',
    'changelog.subtitle': '掌握最新功能、系統優化與版本進度',
    'changelog.close': '關閉',
    'changelog.author': '開發與維護者',

    // Game Menu Modal
    'menu.title': '遊戲功能選單',
    'menu.subtitle': '快速穿梭各功能模組與全域系統設定',
    'menu.soundOn': '音效：已開啟',
    'menu.soundOff': '音效：已靜音',
    'menu.resume': '返回遊戲',
    'menu.dangerZone': '危險專區：重製全部進度 (Reset Progress)',
    'menu.dangerWarning': '此操作將徹底清空金幣、背包方塊、鎬具階級、建築網格與成就，無法復原。',
    'menu.confirmReset': '確認永久重置',
    'menu.cancel': '取消返回',
    'menu.resetPrompt': '確定重置所有遊戲進度？',

    // Auth & Cloud Modal
    'auth.title': 'Firebase 帳號與雲端存檔',
    'auth.subtitle': '註冊、登入、自動登入與進度雲端同步',
    'auth.tabCloud': '雲端存檔',
    'auth.tabLogin': '帳號登入',
    'auth.tabRegister': '註冊新帳號',
    'auth.tabConfig': 'Firebase 專案設定',
    'auth.email': '電子信箱 (Email)',
    'auth.password': '密碼 (Password)',
    'auth.displayName': '玩家暱稱 (顯示名稱)',
    'auth.loginBtn': '登入並載入雲端存檔',
    'auth.registerBtn': '確認註冊並自動登入',
    'auth.loggingIn': '登入中...',
    'auth.registering': '註冊中...',
    'auth.noAccount': '還沒有帳號？',
    'auth.hasAccount': '已有帳號？',
    'auth.registerNow': '立即註冊新玩家',
    'auth.switchToLogin': '切換至登入',
    'auth.autoLoginNotice': '系統已啟用「自動登入」，下次進入遊戲將自動識別身分並同步進度。',
    'auth.currentIdentity': '目前身分：',
    'auth.onlineLoggedIn': '已連線 (已登入)',
    'auth.guestMode': '訪客模式 (本機存檔)',
    'auth.notLoggedIn': '尚未登入 Firebase',
    'auth.logout': '登出',
    'auth.syncStatus': '雲端同步狀態',
    'auth.lastSynced': '上次同步：',
    'auth.notSyncedYet': '尚未同步',
    'auth.syncDesc': '雲端存檔會儲存您的金幣、方塊庫存、鎬子階級、耐久度、1,000 格建築區、100,000 個成就狀態與所有統計資料。',
    'auth.uploadProgress': '上傳目前進度至雲端',
    'auth.downloadProgress': '下載並載入雲端進度',
    'auth.sendCode': '發送驗證碼至信箱',
    'auth.sendingCode': '發送中...',
    'auth.resendCode': '重新發送',
    'auth.verificationCode': '信箱驗證碼 (6 位數)',
    'auth.codePlaceholder': '請輸入 6 位數字驗證碼...',
    'auth.verifyCodeBtn': '驗證代碼',
    'auth.verifying': '驗證中...',
    'auth.emailVerified': '電子信箱已驗證通過',
    'auth.emailUnverified': '電子信箱尚未驗證',
    'auth.codeSentPrompt': '6 位數驗證碼已傳送至用戶輸入的信箱！',
    'auth.codeRequiredPrompt': '請先獲取並輸入傳送至該信箱的 6 位數驗證碼以完成信箱驗證！',
    'auth.customProjectTip': '使用您自己的 Firebase 專案：可在下方直接貼上 Firebase Web Config 設定物件，或於 .env 填入環境變數。儲存後立即生效！',
    'auth.pasteConfigLabel': '快速貼上 Firebase Config (JSON / JS 物件)',
    'auth.pasteConfigHint': 'Firebase 控制台 > 專案設定 > 一般',
    'auth.parseJson': '解析上方 JSON 填入表單',
    'auth.applyConfig': '套用並保存設定',
    'auth.ready': '雲端存檔就緒',

    // Common / Notifications
    'common.coins': '遊戲幣',
    'common.cost': '花費',
    'common.free': '免費',
    'common.confirm': '確認',
    'common.back': '返回',
    'common.save': '儲存',
    'common.loading': '載入中...',
    'common.success': '成功',
    'common.error': '錯誤',

    // Building Zone
    'building.title': '1000格建築創作工坊',
    'building.clear': '全部清空',

    // Achievements
    'achievements.claim': '領取',
    'achievements.unlocked': '已解鎖',

    // Friends
    'friends.copyCode': '複製代碼',

    // Shop Tabs
    'shop.pickaxesTab': '鎬具',
    'shop.skinsTab': '造型',
    'shop.suppliesTab': '補給品',
    'shop.themesTab': '主題背景'
  }
};

const LanguageContext = createContext<I18nContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // STRICT REQUIREMENT: English by default ("加入英文跟預設英文")
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'zh') return 'zh';
      return 'en'; // Default to English
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const t = (key: string, fallbackOrParams?: string | Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dict[key];

    if (!text) {
      if (typeof fallbackOrParams === 'string') return fallbackOrParams;
      // Fallback to English dict
      text = TRANSLATIONS.en[key] || key;
    }

    if (fallbackOrParams && typeof fallbackOrParams === 'object') {
      Object.entries(fallbackOrParams).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(val));
      });
    }

    return text;
  };

  const getName = (item?: { nameEn?: string; nameZh?: string; title?: string } | null): string => {
    if (!item) return '';
    if (language === 'en') {
      return item.nameEn || item.nameZh || item.title || '';
    }
    return item.nameZh || item.nameEn || item.title || '';
  };

  const getDesc = (item?: { descEn?: string; descZh?: string; description?: string; desc?: string } | null): string => {
    if (!item) return '';
    if (language === 'en') {
      return item.descEn || item.description || item.descZh || item.desc || '';
    }
    return item.descZh || item.description || item.descEn || item.desc || '';
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      getName,
      getDesc
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): I18nContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
