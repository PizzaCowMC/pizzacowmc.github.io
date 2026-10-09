import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const SAVES_DIR = path.join(DATA_DIR, 'saves');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SYNC_CODES_FILE = path.join(DATA_DIR, 'sync_codes.json');

// Initialize Gemini SDK with fallback resilience
let genAI: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    genAI = new GoogleGenAI({ apiKey });
  } else {
    genAI = new GoogleGenAI();
  }
} catch (err) {
  console.warn('GenAI initialization note (fallback will be active if key unset):', err);
}

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SAVES_DIR)) {
  fs.mkdirSync(SAVES_DIR, { recursive: true });
}

// Helpers for thread-safe/resilient JSON storage
function readUsers(): Record<string, any> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  return {};
}

function saveUsers(users: Record<string, any>): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

function readSyncCodes(): Record<string, any> {
  try {
    if (fs.existsSync(SYNC_CODES_FILE)) {
      const content = fs.readFileSync(SYNC_CODES_FILE, 'utf-8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('Error reading sync codes file:', err);
  }
  return {};
}

function saveSyncCodes(codes: Record<string, any>): void {
  try {
    fs.writeFileSync(SYNC_CODES_FILE, JSON.stringify(codes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing sync codes file:', err);
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`mc_salt_${password}`).digest('hex');
}

function sanitizeId(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

async function startServer() {
  const app = express();

  // Allow larger payload for rich game state and recipe logs
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // CORS headers for seamless local/tunnel preview
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // --- API ROUTES ---

  // Health & Version status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      version: '26.3.00',
      cloudSync: 'active',
      timestamp: new Date().toISOString()
    });
  });

  // User Registration (Persistent across all devices)
  app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    const cleanName = (username || '').trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: '玩家名稱長度請至少 2 個字元！' });
    }
    if (cleanName.length > 20) {
      return res.status(400).json({ error: '玩家名稱長度請勿超過 20 個字元！' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: '密碼強度不足，請至少輸入 6 位字元！' });
    }

    const key = cleanName.toLowerCase();
    const users = readUsers();

    if (users[key]) {
      return res.status(400).json({ error: '該玩家名稱已被註冊，請更換一個名稱！' });
    }

    const uid = `player_${sanitizeId(cleanName)}_${Date.now().toString(36)}`;
    const passHash = hashPassword(password);
    const now = new Date().toISOString();

    users[key] = {
      uid,
      username: cleanName,
      passwordHash: passHash,
      createdAt: now,
      lastLoginAt: now,
      lastSavedAt: null
    };
    saveUsers(users);

    return res.json({
      success: true,
      user: {
        uid,
        displayName: cleanName,
        email: `${key}@minecraft.cafe`
      }
    });
  });

  // User Login (Validates against cross-device database)
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const cleanName = (username || '').trim();

    if (!cleanName || !password) {
      return res.status(400).json({ error: '請輸入玩家名稱與密碼！' });
    }

    const key = cleanName.toLowerCase();
    const users = readUsers();
    const user = users[key];

    if (!user) {
      return res.status(404).json({ error: '找不到此玩家帳號，請確認名稱或先進行註冊！' });
    }

    const passHash = hashPassword(password);
    if (user.passwordHash !== passHash) {
      return res.status(401).json({ error: '密碼錯誤，請重新輸入！' });
    }

    user.lastLoginAt = new Date().toISOString();
    saveUsers(users);

    // Check if cloud save file exists for this user
    const saveFilePath = path.join(SAVES_DIR, `${user.uid}.json`);
    let hasCloudSave = false;
    let saveSummary: any = null;

    if (fs.existsSync(saveFilePath)) {
      try {
        const raw = fs.readFileSync(saveFilePath, 'utf-8');
        const data = JSON.parse(raw);
        hasCloudSave = true;
        saveSummary = {
          coins: data.coins ?? 0,
          level: data.level ?? 1,
          totalMined: data.stats?.totalMined ?? 0,
          savedAt: data._savedAt || user.lastSavedAt || null
        };
      } catch (e) {
        console.error('Error reading existing save file on login:', e);
      }
    }

    return res.json({
      success: true,
      user: {
        uid: user.uid,
        displayName: user.username,
        email: `${key}@minecraft.cafe`
      },
      hasCloudSave,
      saveSummary
    });
  });

  // Cloud Save - Saves game state to server
  app.post('/api/cloud/save', (req, res) => {
    const { uid, gameData } = req.body;
    if (!uid || !gameData) {
      return res.status(400).json({ error: '缺少帳號識別碼 (UID) 或存檔資料！' });
    }

    const safeUid = sanitizeId(uid);
    const saveFilePath = path.join(SAVES_DIR, `${safeUid}.json`);
    const savedAt = new Date().toISOString();

    const payload = {
      ...gameData,
      _savedAt: savedAt,
      _uid: safeUid
    };

    try {
      fs.writeFileSync(saveFilePath, JSON.stringify(payload), 'utf-8');

      // Update user index if matching
      const users = readUsers();
      for (const k in users) {
        if (users[k].uid === uid || users[k].uid === safeUid) {
          users[k].lastSavedAt = savedAt;
          saveUsers(users);
          break;
        }
      }

      return res.json({
        success: true,
        savedAt,
        message: '雲端進度已成功同步至跨裝置伺服器！'
      });
    } catch (err: any) {
      console.error('Error saving game data to cloud:', err);
      return res.status(500).json({ error: '雲端存檔寫入失敗：' + (err.message || '未知錯誤') });
    }
  });

  // Cloud Load - Loads game state from server
  app.get('/api/cloud/load/:uid', (req, res) => {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ error: '缺少帳號識別碼！' });
    }

    const safeUid = sanitizeId(uid);
    const saveFilePath = path.join(SAVES_DIR, `${safeUid}.json`);

    if (!fs.existsSync(saveFilePath)) {
      return res.status(404).json({ error: '伺服器上尚未找到此帳號的雲端存檔！' });
    }

    try {
      const raw = fs.readFileSync(saveFilePath, 'utf-8');
      const data = JSON.parse(raw);
      return res.json({
        success: true,
        data,
        savedAt: data._savedAt || null
      });
    } catch (err: any) {
      console.error('Error loading game data from cloud:', err);
      return res.status(500).json({ error: '讀取雲端存檔失敗：' + (err.message || '未知錯誤') });
    }
  });

  // Cross-Device Sync Code: Generate 6-digit sync code (引繼碼)
  app.post('/api/cloud/generate-sync-code', (req, res) => {
    const { uid, gameData } = req.body;
    if (!uid) {
      return res.status(400).json({ error: '請先登入帳號以產生跨裝置同步碼！' });
    }

    // Generate random 6-character uppercase alphanumeric code e.g. MC-793421
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const code = `MC-${randomDigits}`;

    const syncCodes = readSyncCodes();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    // If gameData is passed, ensure save file is updated as well
    const safeUid = sanitizeId(uid);
    if (gameData) {
      const saveFilePath = path.join(SAVES_DIR, `${safeUid}.json`);
      fs.writeFileSync(saveFilePath, JSON.stringify({ ...gameData, _savedAt: new Date().toISOString() }), 'utf-8');
    }

    syncCodes[code] = {
      uid,
      code,
      createdAt: new Date().toISOString(),
      expiresAt
    };
    saveSyncCodes(syncCodes);

    return res.json({
      success: true,
      code,
      expiresAt,
      message: '跨裝置引繼碼已產生！在任何新裝置輸入此代碼即可一鍵轉移進度！'
    });
  });

  // Cross-Device Sync Code: Redeem sync code on new device
  app.post('/api/cloud/redeem-sync-code', (req, res) => {
    const { code } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();

    if (!cleanCode) {
      return res.status(400).json({ error: '請輸入有效的同步引繼碼！' });
    }

    const syncCodes = readSyncCodes();
    const entry = syncCodes[cleanCode];

    if (!entry) {
      return res.status(404).json({ error: '無效或已過期的同步碼，請確認代碼是否正確！' });
    }

    const safeUid = sanitizeId(entry.uid);
    const saveFilePath = path.join(SAVES_DIR, `${safeUid}.json`);

    if (!fs.existsSync(saveFilePath)) {
      return res.status(404).json({ error: '該同步碼對應的存檔不存在！' });
    }

    try {
      const raw = fs.readFileSync(saveFilePath, 'utf-8');
      const data = JSON.parse(raw);

      // Find username
      const users = readUsers();
      let displayName = 'Miner';
      for (const k in users) {
        if (users[k].uid === entry.uid || users[k].uid === safeUid) {
          displayName = users[k].username;
          break;
        }
      }

      return res.json({
        success: true,
        user: {
          uid: entry.uid,
          displayName,
          email: `${displayName.toLowerCase()}@minecraft.cafe`
        },
        data,
        savedAt: data._savedAt || null
      });
    } catch (err: any) {
      console.error('Error redeeming sync code:', err);
      return res.status(500).json({ error: '兌換同步碼失敗：' + (err.message || '未知錯誤') });
    }
  });

  // --- MINECRAFT SERVER STATUS MONITOR ---
  app.get('/api/server/status', (req, res) => {
    // Simulated realistic paper server metrics
    const onlineBase = 88;
    const minuteJitter = Math.floor(Math.sin(Date.now() / 60000) * 15);
    const tpsJitter = 19.98 + (Math.sin(Date.now() / 15000) * 0.02);

    return res.json({
      status: 'online',
      serverName: '☕ Minecraft Cafe Realm',
      version: 'PaperMC 1.21.1 / Applet v26.3.00',
      tps: Math.min(20.0, Math.max(19.85, parseFloat(tpsJitter.toFixed(2)))),
      pingMs: Math.floor(18 + Math.random() * 8),
      onlinePlayers: Math.max(45, onlineBase + minuteJitter),
      maxPlayers: 300,
      uptime: '99.98%',
      loadedChunks: 1240,
      activeEntities: 342,
      cloudSync: 'active',
      motd: '§6☕ §lMinecraft 礦業咖啡廳 §r§7| §a開採地底方塊，款待傳奇顧客！'
    });
  });

  // --- LIVE LEADERBOARDS API ---
  app.get('/api/server/leaderboard', (req, res) => {
    // Read local registered saves to mix in real players
    const users = readUsers();
    const realMiners: Array<{ name: string; blocks: number; dishes: number; coins: number }> = [];

    try {
      if (fs.existsSync(SAVES_DIR)) {
        const files = fs.readdirSync(SAVES_DIR);
        for (const file of files) {
          if (!file.endsWith('.json')) continue;
          const uid = file.replace('.json', '');
          try {
            const raw = fs.readFileSync(path.join(SAVES_DIR, file), 'utf-8');
            const data = JSON.parse(raw);
            let name = 'Adventurer';
            for (const k in users) {
              if (users[k].uid === uid) {
                name = users[k].username;
                break;
              }
            }
            realMiners.push({
              name,
              blocks: data?.stats?.totalBlocksMined || 0,
              dishes: data?.cafeServedCount || 0,
              coins: data?.stats?.totalCoinsEarned || data?.coins || 0
            });
          } catch {}
        }
      }
    } catch {}

    // Simulated high-tier community champions
    const baseChampions = [
      { name: 'SteveTheGodsmith', blocks: 685420, dishes: 1480, coins: 9450000, title: '【至高神匠牛排王】' },
      { name: 'AlexDiamondQueen', blocks: 492100, dishes: 2150, coins: 6820000, title: '【傳奇咖啡首席主廚】' },
      { name: 'RedstoneMechanic', blocks: 358900, dishes: 890, coins: 5120000, title: '【蒸氣魔像工程大師】' },
      { name: 'ObsidianBreaker', blocks: 245000, dishes: 640, coins: 3400000, title: '【深淵破壞者】' },
      { name: 'EmeraldBarista', blocks: 185600, dishes: 1720, coins: 2850000, title: '【星空綠寶石名董】' }
    ];

    // Combine and rank
    const allMiners = [...realMiners, ...baseChampions];

    const miningRank = [...allMiners]
      .sort((a, b) => b.blocks - a.blocks)
      .slice(0, 10)
      .map((m, i) => ({ rank: i + 1, name: m.name, value: m.blocks, badge: i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : '⛏️' }));

    const cafeRank = [...allMiners]
      .sort((a, b) => b.dishes - a.dishes)
      .slice(0, 10)
      .map((m, i) => ({ rank: i + 1, name: m.name, value: m.dishes, badge: i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '☕' }));

    const wealthRank = [...allMiners]
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10)
      .map((m, i) => ({ rank: i + 1, name: m.name, value: m.coins, badge: i === 0 ? '💰' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🪙' }));

    return res.json({
      mining: miningRank,
      cafe: cafeRank,
      wealth: wealthRank,
      updatedAt: new Date().toISOString()
    });
  });

  // --- AI BARISTA NPC CHATBOT (/api/ai/barista-chat) ---
  app.post('/api/ai/barista-chat', async (req, res) => {
    const { message, playerName = '冒險者', isEn = false, currentCoins = 0 } = req.body;
    const cleanMsg = (message || '').trim();

    if (!cleanMsg) {
      return res.status(400).json({ error: '請輸入對話內容！' });
    }

    // Check easter eggs triggers
    const lower = cleanMsg.toLowerCase();
    const hasEasterEgg =
      lower.includes('秘密特調') ||
      lower.includes('secret blend') ||
      lower.includes('老闆好') ||
      lower.includes('彩蛋') ||
      lower.includes('easter egg') ||
      lower.includes('傳奇鎬') ||
      lower.includes('請我喝咖啡') ||
      lower.includes('free coffee');

    // Default fallback responses
    const fallbackResponsesZh = [
      `「哼～哼！（撫摸大鼻子）歡迎光臨，${playerName}！今日推薦剛出爐的【熔岩黑咖啡】，開採深板岩時喝上一口，鎬具急迫速度立刻翻倍！」`,
      `「哼！（調整圍裙）在地底第 2 層開採時，若遇到紅石能源，記得帶幾顆回吧台，我可以用紅石冷萃幫你的自動採礦魔像大幅超頻！」`,
      `「哼～冒險者，聽說你正在向 34 大地層邁進？多喝點【綠寶石拿鐵】，連鎖挖礦幸運值會像湧泉一樣噴發！」`,
      `「（擦拭發光的咖啡杯）我們咖啡廳的名譽全靠各位礦工新鮮送上的地底食材！今天想來點甜甜的【金蘋果摩卡】嗎？」`
    ];

    const fallbackResponsesEn = [
      `"Hrmm! (Nods with big nose) Welcome, ${playerName}! Today's special is fresh Lava Espresso—take a sip and your pickaxe haste will double in no time!"`,
      `"Hrmm! (Straightens apron) If you strike redstone in the deep layers, bring some back! My Redstone Cold Brew will overclock your Auto-Miner golem beyond limits!"`,
      `"Hrmm~ An adventurer climbing through the 34 strata? Drink some Emerald Latte, your fortune yield will skyrocket like a subterranean geyser!"`,
      `"Polishing the glowing crystal cups! Our cafe thrives on the minerals you unearth. Craving a cup of sweet Golden Apple Mocha today?"`
    ];

    let reply = isEn
      ? fallbackResponsesEn[Math.floor(Math.random() * fallbackResponsesEn.length)]
      : fallbackResponsesZh[Math.floor(Math.random() * fallbackResponsesZh.length)];

    let buffGranted: any = null;
    let bonusCoins: number | undefined = undefined;

    if (hasEasterEgg) {
      buffGranted = {
        type: 'haste',
        durationSec: 120,
        nameZh: '☕ 老鐵特調・急迫神速咖啡 Buff (120秒)',
        nameEn: '☕ Tie Special Haste Brew Buff (120s)'
      };
      bonusCoins = 300;
      reply = isEn
        ? `"Hrmmm! (Eyes glowing with emerald light) You found the secret passphrase! Here, enjoy this complimentary Secret Masterpiece Brew on the house! (+300 Coins & 120s Haste II Buff!)"`
        : `「哼哼哼～！（眼睛發出綠寶石神光）想不到你竟然知道本店的秘密暗號！這杯老鐵特調無上神品咖啡請你喝，外加 300 金幣紅包，祝你今日挖穿地心！（獲得急迫 Buff 120秒 & 300 金幣！）」`;
    } else if (genAI) {
      try {
        const systemPrompt = `You are "Villager Barista Tie (方塊咖啡師・老鐵)", the humorous, warm-hearted Minecraft villager barista and owner of the Minecraft Mining Cafe.
You speak with occasional playful Minecraft villager sound cues like "Hrmm~" or "哼～哼～".
You know everything about mining pickaxes (wood, stone, iron, diamond, netherite), subterranean strata layers, coffee blends (Lava Espresso, Emerald Latte, Golden Mocha, Redstone Cold Brew), and cafe recipes.
Respond concisely in 2 to 3 sentences in ${isEn ? 'English' : 'Traditional Chinese (繁體中文)'}. Be supportive, witty, and immerse the player into the Minecraft Cafe vibe.
The player name is: ${playerName}.`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nPlayer said: "${cleanMsg}"`
        });

        if (response && response.text) {
          reply = response.text.trim();
        }
      } catch (aiErr) {
        console.warn('Gemini Barista call failed, using procedural fallback:', aiErr);
      }
    }

    return res.json({
      reply,
      buffGranted,
      bonusCoins,
      isEasterEgg: Boolean(hasEasterEgg)
    });
  });

  // --- AI MINECRAFT ARCHITECTURE & BLUEPRINT GENERATOR (/api/ai/blueprint) ---
  app.post('/api/ai/blueprint', async (req, res) => {
    const { prompt, isEn = false } = req.body;
    const cleanPrompt = (prompt || '溫馨木質森林咖啡廳').trim();

    // Default procedural blueprint fallback
    const fallbackBlueprint = {
      title: isEn ? `Minecraft Cafe Blueprint: ${cleanPrompt}` : `【Minecraft 建築藍圖】${cleanPrompt}`,
      style: isEn ? 'Rustic Nordic Cafe with Steam Chimney' : '溫馨原木北歐風格咖啡廳・附紅石蒸氣壁爐',
      dimensions: '15 x 12 x 8 blocks',
      blockPalette: [
        { name: isEn ? 'Spruce Planks' : '雲杉木材', icon: '🪵', quantity: '128' },
        { name: isEn ? 'Deepslate Bricks' : '深板岩磚', icon: '🧱', quantity: '64' },
        { name: isEn ? 'Tinted Glass' : '遮光玻璃', icon: '🪟', quantity: '32' },
        { name: isEn ? 'Lantern & Campfire' : '營火與懸掛燈籠', icon: '🏮', quantity: '8' },
        { name: isEn ? 'Brewing Stand & Cauldron' : '釀造台與煉藥鍋', icon: '🧪', quantity: '4' }
      ],
      steps: [
        {
          stepNumber: 1,
          title: isEn ? 'Foundation & Base' : '地基與外圍輪廓',
          instruction: isEn
            ? 'Lay a 15x12 perimeter using Deepslate Bricks. Fill interior floor with polished Andesite or stripped Oak logs.'
            : '使用深板岩磚鋪設 15x12 格長方形外圍基座，室內地面填滿拋光安山岩或去皮橡木原木，營造溫暖木質地坪。'
        },
        {
          stepNumber: 2,
          title: isEn ? 'Walls & Panorama Windows' : '牆體立柱與全景採光落地窗',
          instruction: isEn
            ? 'Raise 4-block high Spruce pillars at corners. Install large 3x2 glass windows to let in sunset lighting.'
            : '角落架設 4 格高的雲杉原木支柱，牆面嵌入 3x2 大面積落地遮光玻璃，引入落日採光與自然美景。'
        },
        {
          stepNumber: 3,
          title: isEn ? 'Barista Counter & Coffee Machines' : '咖啡調製吧台與蒸氣設備',
          instruction: isEn
            ? 'Build an L-shaped counter using dark oak stairs. Place a Brewing Stand as espresso machine and Cauldron with smoke campfire underneath.'
            : '在室內深處用黑橡木倒放階梯構築 L 型點餐吧台，吧台上擺放釀造台代表濃縮咖啡機，下方藏匿營火釋放咖啡蒸氣！'
        },
        {
          stepNumber: 4,
          title: isEn ? 'Roof & Cozy Lighting' : '傾斜雙坡斜頂與氛圍吊燈',
          instruction: isEn
            ? 'Construct an A-frame roof with Spruce Stairs. Hang warm lanterns with iron chains above each customer dining table.'
            : '以雲杉階梯建造經典人字形雙坡屋頂，天花板垂吊鐵鍊與暖光燈籠，桌上點綴花盆與粉紅鬱金香！'
        }
      ],
      commands: [
        `/give @p campfire[custom_name='{"text":"Coffee Roaster"}'] 1`,
        `/give @p brewing_stand[custom_name='{"text":"Espresso Machine"}'] 1`,
        `/fill ~ ~ ~ ~14 ~ ~11 deepslate_bricks hollow`
      ],
      proTip: isEn
        ? 'Pro Tip: Place a smoker with water beneath your brewing stand so realistic white steam drifts upward from your cafe counter!'
        : '大師秘訣：在吧台的釀造台正下方埋入一個營火（上方蓋活板門），蒸氣便會穿透吧台緩緩升起，呈現最逼真的熱咖啡冒煙特效！'
    };

    if (genAI) {
      try {
        const aiPrompt = `Generate a creative Minecraft architectural construction blueprint for: "${cleanPrompt}".
Format strictly as JSON with this exact schema:
{
  "title": "string",
  "style": "string",
  "dimensions": "string (e.g. 16x14x9 blocks)",
  "blockPalette": [
    { "name": "block name", "icon": "emoji icon", "quantity": "estimated number" }
  ],
  "steps": [
    { "stepNumber": 1, "title": "Step title", "instruction": "Step instruction details" }
  ],
  "commands": ["Minecraft /give or /fill command 1", "command 2"],
  "proTip": "Expert building tip for Minecraft cafes"
}
Output language: ${isEn ? 'English' : 'Traditional Chinese (繁體中文)'}. Only valid JSON, no markdown formatting.`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: aiPrompt
        });

        if (response && response.text) {
          const raw = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(raw);
          return res.json(parsed);
        }
      } catch (err) {
        console.warn('Gemini blueprint generation fallback:', err);
      }
    }

    return res.json(fallbackBlueprint);
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Minecraft Workshop Server] running on http://0.0.0.0:${PORT} (v26.3.00)`);
  });
}

startServer();
