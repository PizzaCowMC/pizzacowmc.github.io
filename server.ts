import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const SAVES_DIR = path.join(DATA_DIR, 'saves');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SYNC_CODES_FILE = path.join(DATA_DIR, 'sync_codes.json');

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
      version: '2.5.41',
      cloudSync: 'active',
      timestamp: new Date().toISOString()
    });
  });

  // Dedicated Auto-Update & Version Verification endpoint
  app.get('/api/version', (req, res) => {
    res.json({
      version: '2.5.41',
      latestVersion: '2.5.41',
      releaseDate: '2026-09-11',
      status: 'stable',
      githubRepo: 'https://github.com/PizzaCowMC/pizzacowmc.github.io',
      changelogSummaryZh: '2.5.41 完整英語翻譯支援、員工與玩家像素人形模型增強、10套時裝衣物工坊與制服調度系統',
      changelogSummaryEn: '2.5.41 Full English Translation, Enhanced Humanoid Character Models, and 10 Outfits & Uniforms Wardrobe',
      features: [
        '完整英語的翻譯：全方位 UI、收據、時裝、備餐倒數與員工系統英文化',
        '員工、玩家的模型增強：高精緻像素人型 SVG 模型，具備呼吸、走動、喝采動態與專屬手持物',
        '衣物時裝工坊：10 套專屬服裝（附帶出餐加速、減免工時等加成），全體員工制服自訂調度',
        '煮飯耗時（5秒~10分鐘）與點餐收據存根系統持續完善'
      ],
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
    console.log(`[Minecraft Workshop Server] running on http://0.0.0.0:${PORT} (v2.5.30)`);
  });
}

startServer();
