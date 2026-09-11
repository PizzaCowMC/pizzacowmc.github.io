import React, { useState } from 'react';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  Settings,
  X,
  Check,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  KeyRound,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  Smartphone,
  Copy,
  CheckCheck
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import {
  registerUserWithUsername,
  loginUserWithUsername,
  logoutUser,
  saveFirebaseConfig,
  getSavedFirebaseConfig,
  FirebaseConfigOptions,
  generateSyncCode,
  redeemSyncCode
} from '../services/firebase';
import { useLanguage } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { displayName: string | null; uid: string | null; email?: string | null } | null;
  onCloudSave: () => Promise<{ success: boolean; error?: string }>;
  onCloudLoad: () => Promise<{ success: boolean; error?: string }>;
  lastSavedTime: string | null;
  onUserLoggedOut: () => void;
  onUserLoggedIn: (user?: { displayName: string | null; uid: string; email?: string | null }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCloudSave,
  onCloudLoad,
  lastSavedTime,
  onUserLoggedOut,
  onUserLoggedIn
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'cloud' | 'sync' | 'config'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Sync Code state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const isEn = language === 'en';

  // Config State
  const initialConfig = getSavedFirebaseConfig() || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  };
  const [configForm, setConfigForm] = useState<FirebaseConfigOptions>(initialConfig);
  const [rawConfigJson, setRawConfigJson] = useState('');

  if (!isOpen) return null;

  const showMsg = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMsg({ text, type });
    setTimeout(() => {
      setStatusMsg(null);
    }, 4500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = username.trim();
    if (!cleanName || !password) {
      showMsg(isEn ? 'Please enter your username and password!' : '請輸入玩家名稱與密碼！', 'error');
      return;
    }
    setLoading(true);
    sound.playClickSound();
    const res = await loginUserWithUsername(cleanName, password);
    setLoading(false);
    if (res.user) {
      sound.playAchievementSound();
      onUserLoggedIn({
        uid: res.user.uid,
        displayName: res.user.displayName || cleanName,
        email: res.user.email
      });

      if (res.hasCloudSave) {
        try {
          await onCloudLoad();
          showMsg(
            isEn
              ? `✅ Welcome back, ${res.user.displayName}! Cloud save automatically restored.`
              : `✅ 登入成功！已自動為您載入跨裝置雲端存檔（最後儲存：${res.saveSummary?.savedAt ? new Date(res.saveSummary.savedAt).toLocaleTimeString() : '最新'}）。`,
            'success'
          );
        } catch (_) {
          showMsg(
            isEn
              ? `✅ Logged in successfully! Welcome back, ${res.user.displayName || cleanName}`
              : `✅ 登入成功！歡迎回來，${res.user.displayName || cleanName}`,
            'success'
          );
        }
      } else {
        showMsg(
          isEn
            ? `✅ Logged in successfully! Welcome back, ${res.user.displayName || cleanName}`
            : `✅ 登入成功！歡迎回來，${res.user.displayName || cleanName}`,
          'success'
        );
      }
      setActiveTab('cloud');
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Login failed: ${res.error}` : `❌ 登入失敗：${res.error}`, 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = username.trim();
    if (!cleanName || !password) {
      showMsg(isEn ? 'Please fill in player username and password!' : '請填寫玩家名稱與密碼！', 'error');
      return;
    }
    if (cleanName.length < 2) {
      showMsg(isEn ? 'Username must be at least 2 characters long!' : '玩家名稱長度請至少 2 個字元！', 'error');
      return;
    }
    if (password.length < 6) {
      showMsg(isEn ? 'Password must be at least 6 characters long!' : '密碼長度請至少 6 位字元！', 'error');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      showMsg(isEn ? 'Passwords do not match!' : '兩次密碼輸入不一致！', 'error');
      return;
    }
    setLoading(true);
    sound.playClickSound();
    const res = await registerUserWithUsername(cleanName, password);
    setLoading(false);
    if (res.user) {
      sound.playAchievementSound();
      showMsg(
        isEn
          ? `🎉 Miner "${cleanName}" registered successfully & logged in across all devices!`
          : `🎉 玩家「${cleanName}」跨裝置帳號註冊成功，並已自動登入！`,
        'success'
      );
      onUserLoggedIn({
        uid: res.user.uid,
        displayName: res.user.displayName || cleanName,
        email: res.user.email
      });
      setActiveTab('cloud');
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Registration failed: ${res.error}` : `❌ 註冊失敗：${res.error}`, 'error');
    }
  };

  const handleLogout = async () => {
    sound.playClickSound();
    await logoutUser();
    onUserLoggedOut();
    showMsg(isEn ? 'Successfully logged out.' : '已成功登出帳號。', 'info');
    setActiveTab('login');
  };

  const handleSaveToCloud = async () => {
    sound.playClickSound();
    setLoading(true);
    const res = await onCloudSave();
    setLoading(false);
    if (res.success) {
      sound.playAchievementSound();
      showMsg(
        isEn
          ? '☁️ Game progress successfully saved & synced across devices!'
          : '☁️ 遊戲進度已成功同步至跨裝置伺服器！',
        'success'
      );
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Cloud sync failed: ${res.error}` : `❌ 雲端存檔失敗：${res.error}`, 'error');
    }
  };

  const handleLoadFromCloud = async () => {
    sound.playClickSound();
    setLoading(true);
    const res = await onCloudLoad();
    setLoading(false);
    if (res.success) {
      sound.playAchievementSound();
      showMsg(
        isEn
          ? '☁️ Cloud progress successfully loaded & applied!'
          : '☁️ 跨裝置雲端進度已成功載入並套用！',
        'success'
      );
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Failed to load save: ${res.error}` : `❌ 讀取雲端存檔失敗：${res.error}`, 'error');
    }
  };

  const handleGenerateSyncCode = async () => {
    sound.playClickSound();
    if (!currentUser?.uid) {
      showMsg(isEn ? 'Please login or register first to generate sync code!' : '請先登入或註冊帳號以產生同步碼！', 'error');
      return;
    }
    setLoading(true);
    const res = await generateSyncCode(currentUser.uid);
    setLoading(false);
    if (res.success && res.code) {
      sound.playAchievementSound();
      setGeneratedCode(res.code);
      showMsg(isEn ? `📱 Sync Code generated: ${res.code}` : `📱 跨裝置引繼碼已產生：${res.code}`, 'success');
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Failed: ${res.error}` : `❌ 產生失敗：${res.error}`, 'error');
    }
  };

  const handleRedeemSyncCode = async () => {
    const clean = inputSyncCode.trim().toUpperCase();
    if (!clean) {
      showMsg(isEn ? 'Please enter a valid 6-digit sync code!' : '請輸入有效的同步引繼碼！', 'error');
      return;
    }
    sound.playClickSound();
    setLoading(true);
    const res = await redeemSyncCode(clean);
    setLoading(false);
    if (res.success && res.user) {
      sound.playAchievementSound();
      onUserLoggedIn(res.user);
      try {
        await onCloudLoad();
      } catch (_) {}
      showMsg(
        isEn
          ? `🎉 Sync Code redeemed! Logged in as ${res.user.displayName} & progress restored.`
          : `🎉 引繼成功！已登入為「${res.user.displayName}」並同步還原進度！`,
        'success'
      );
      setInputSyncCode('');
      setActiveTab('cloud');
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Invalid code: ${res.error}` : `❌ 兌換失敗：${res.error}`, 'error');
    }
  };

  const handleCopyCode = (code: string) => {
    sound.playClickSound();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showMsg(isEn ? 'Copied sync code to clipboard!' : '已複製跨裝置引繼碼至剪貼簿！', 'info');
  };

  const handleSaveConfig = () => {
    sound.playClickSound();
    if (!configForm.apiKey || !configForm.projectId) {
      showMsg(isEn ? 'API Key and Project ID are required!' : '請至少填寫 API Key 與 Project ID！', 'error');
      return;
    }
    const ok = saveFirebaseConfig(configForm);
    if (ok) {
      sound.playAchievementSound();
      showMsg(isEn ? 'Custom Firebase configuration saved!' : '自訂 Firebase 專案設定已儲存！', 'success');
    } else {
      showMsg(isEn ? 'Failed to save Firebase config.' : '儲存設定失敗。', 'error');
    }
  };

  const handleParseRawJson = () => {
    try {
      const parsed = JSON.parse(rawConfigJson);
      setConfigForm({
        apiKey: parsed.apiKey || '',
        authDomain: parsed.authDomain || '',
        projectId: parsed.projectId || '',
        storageBucket: parsed.storageBucket || '',
        messagingSenderId: parsed.messagingSenderId || '',
        appId: parsed.appId || ''
      });
      sound.playAchievementSound();
      showMsg(isEn ? 'Parsed Firebase JSON successfully!' : '已成功解析 Firebase JSON 格式！', 'success');
    } catch (e) {
      sound.playHitSound(2);
      showMsg(isEn ? 'Invalid JSON format. Please verify your snippet.' : 'JSON 格式錯誤，請確認內容！', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#222] border-4 border-[#3c3c3c] rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="bg-[#181818] px-5 py-4 border-b-4 border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-400 font-minecraft tracking-wide">
                🔥 {t('auth.title')}
              </h2>
              <p className="text-xs text-zinc-400">
                {t('auth.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="bg-[#1b1b1b] border-b border-[#303030] px-4 pt-2 flex gap-2 flex-wrap">
          {currentUser ? (
            <button
              onClick={() => {
                sound.playClickSound();
                setActiveTab('cloud');
              }}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cloud'
                  ? 'bg-[#282828] text-amber-400 border-t-2 border-amber-500'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{t('auth.tabCloud')}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  sound.playClickSound();
                  setActiveTab('login');
                }}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-[#282828] text-amber-400 border-t-2 border-amber-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('auth.tabLogin')}</span>
              </button>
              <button
                onClick={() => {
                  sound.playClickSound();
                  setActiveTab('register');
                }}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-[#282828] text-emerald-400 border-t-2 border-emerald-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('auth.tabRegister')}</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('sync');
            }}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sync'
                ? 'bg-[#282828] text-purple-400 border-t-2 border-purple-500'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isEn ? 'Device Sync' : '跨裝置引繼碼'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('config');
            }}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ml-auto cursor-pointer ${
              activeTab === 'config'
                ? 'bg-[#282828] text-blue-400 border-t-2 border-blue-500'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t('auth.tabConfig')}</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status Message Alert */}
          {statusMsg && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : statusMsg.type === 'error'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  : 'bg-blue-950/40 border-blue-500/50 text-blue-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              ) : statusMsg.type === 'error' ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              ) : (
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
              )}
              <div className="flex-1 leading-relaxed">{statusMsg.text}</div>
            </div>
          )}

          {/* Current Auth Status Banner */}
          <div className="bg-[#1c1c1c] border border-[#333] rounded-lg p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] border border-[#3c3c3c] flex items-center justify-center text-xl">
                {currentUser ? '🧙' : '👤'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400">{t('auth.currentIdentity')}</span>
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${currentUser ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50' : 'bg-zinc-800 text-zinc-400'}`}>
                    {currentUser ? t('auth.onlineLoggedIn') : t('auth.guestMode')}
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {currentUser ? (currentUser.displayName || 'Miner') : t('auth.notLoggedIn')}
                </div>
              </div>
            </div>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-900/50 hover:bg-rose-800 text-rose-200 border border-rose-700/50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('auth.logout')}</span>
              </button>
            )}
          </div>

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && !currentUser && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.username')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('auth.usernamePlaceholder')}
                    required
                    className="w-full bg-[#181818] border border-[#383838] focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#181818] border border-[#383838] focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 bg-[#181818] p-2.5 rounded-lg border border-[#2b2b2b]">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('auth.autoLoginNotice')}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? t('auth.loggingIn') : t('auth.loginBtn')}</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-zinc-400">{t('auth.noAccount')}</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs text-amber-400 font-bold hover:underline ml-1 cursor-pointer"
                >
                  {t('auth.registerNow')}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && !currentUser && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.username')} <span className="text-emerald-400 text-[10px]">({isEn ? 'Unique name' : '不可重複'})</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('auth.usernamePlaceholder')}
                    required
                    minLength={2}
                    maxLength={20}
                    className="w-full bg-[#181818] border border-[#383838] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.password')} {isEn ? '(At least 6 chars)' : '(至少 6 位)'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-[#181818] border border-[#383838] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-[#181818] border border-[#383838] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? t('auth.registering') : t('auth.registerBtn')}</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-zinc-400">{t('auth.hasAccount')}</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-amber-400 font-bold hover:underline ml-1 cursor-pointer"
                >
                  {t('auth.switchToLogin')}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CLOUD SAVE & SYNC */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-bold flex items-center gap-1.5 text-amber-400">
                    <Cloud className="w-4 h-4" />
                    {t('auth.syncStatus')}
                  </span>
                  <span className="font-mono text-zinc-400">
                    {t('auth.lastSynced')} {lastSavedTime ? new Date(lastSavedTime).toLocaleTimeString() : t('auth.notSyncedYet')}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t('auth.syncDesc')}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleSaveToCloud}
                    disabled={loading || !currentUser}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95 cursor-pointer"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>{t('auth.uploadProgress')}</span>
                  </button>

                  <button
                    onClick={handleLoadFromCloud}
                    disabled={loading || !currentUser}
                    className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95 cursor-pointer"
                  >
                    <CloudDownload className="w-4 h-4" />
                    <span>{t('auth.downloadProgress')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CROSS-DEVICE SYNC CODE (引繼碼) */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="bg-purple-950/30 border border-purple-600/40 p-3.5 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>{isEn ? 'Cross-Device Migration & Transfer (Sync Code)' : '跨裝置資料轉移・引繼碼'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {isEn
                    ? 'Generate a unique 6-digit Sync Code on your current device, and input it on your phone, tablet, or another browser to instantly transfer your account & progress without re-typing passwords!'
                    : '在目前裝置產生一組 6 位數專屬引繼碼，即可在手機、平板或新瀏覽器上無痛一鍵轉移所有遊戲進度與帳號，有效期限 30 天！'}
                </p>
              </div>

              {/* Section 1: Generate Code */}
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                  <span>{isEn ? '1. Export Current Device Save' : '【步驟一】從此裝置導出引繼碼'}</span>
                  {currentUser && (
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ● {currentUser.displayName}
                    </span>
                  )}
                </div>

                {generatedCode ? (
                  <div className="p-3 bg-[#111] border-2 border-purple-500/60 rounded-lg text-center space-y-2">
                    <div className="text-xs text-zinc-400">{isEn ? 'Your Migration Code:' : '您的跨裝置專屬引繼碼：'}</div>
                    <div className="text-2xl font-black font-mono tracking-widest text-purple-300 py-1 select-all">
                      {generatedCode}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(generatedCode)}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    >
                      {copiedCode ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? (isEn ? 'Copied!' : '已複製！') : (isEn ? 'Copy Code' : '複製引繼碼')}</span>
                    </button>
                    <div className="text-[10px] text-zinc-500">
                      {isEn ? 'Valid for 30 days. Enter this code on another device.' : '30 天內有效，請在另一台裝置輸入此代碼以完成無痛移轉。'}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateSyncCode}
                    disabled={loading || !currentUser}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-98 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{currentUser ? (isEn ? 'Generate 6-Digit Sync Code' : '產生跨裝置 6 位數引繼碼') : (isEn ? 'Please login first' : '請先登入帳號以產生引繼碼')}</span>
                  </button>
                )}
              </div>

              {/* Section 2: Redeem Code */}
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-zinc-200">
                  {isEn ? '2. Import Save from Another Device' : '【步驟二】在另一台裝置輸入引繼碼'}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={inputSyncCode}
                    onChange={(e) => setInputSyncCode(e.target.value)}
                    placeholder="MC-XXXXXX"
                    className="w-full bg-[#181818] border border-[#383838] focus:border-purple-500 rounded-lg px-3 py-2 text-center text-base font-mono font-bold tracking-wider text-white placeholder-zinc-600 outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleRedeemSyncCode}
                    disabled={loading || !inputSyncCode.trim()}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-98 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isEn ? 'Redeem & Sync Save Instantly' : '兌換引繼碼並同步載入存檔'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FIREBASE PROJECT CONFIGURATION */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="bg-amber-950/20 border border-amber-600/30 p-3 rounded-lg text-xs text-amber-300 leading-relaxed">
                💡 {t('auth.customProjectTip')}
              </div>

              {/* Fast Paste JSON textarea */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center justify-between">
                  <span>{t('auth.pasteConfigLabel')}</span>
                  <span className="text-[10px] text-zinc-500">{t('auth.pasteConfigHint')}</span>
                </label>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={rawConfigJson}
                    onChange={(e) => setRawConfigJson(e.target.value)}
                    placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "myproject.firebaseapp.com",\n  "projectId": "myproject-id",\n  "appId": "1:..."\n}`}
                    className="w-full bg-[#181818] border border-[#383838] focus:border-amber-500 rounded-lg p-2 text-xs font-mono text-white placeholder-zinc-600 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleParseRawJson}
                    className="px-3 py-1.5 bg-[#333] hover:bg-[#444] text-xs text-zinc-200 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('auth.parseJson')}</span>
                  </button>
                </div>
              </div>

              {/* Explicit inputs */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-0.5">API Key *</label>
                    <input
                      type="text"
                      value={configForm.apiKey}
                      onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full bg-[#181818] border border-[#383838] focus:border-blue-500 rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-0.5">Project ID *</label>
                    <input
                      type="text"
                      value={configForm.projectId}
                      onChange={(e) => setConfigForm({ ...configForm, projectId: e.target.value })}
                      placeholder="my-project-12345"
                      className="w-full bg-[#181818] border border-[#383838] focus:border-blue-500 rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-0.5">Auth Domain</label>
                    <input
                      type="text"
                      value={configForm.authDomain}
                      onChange={(e) => setConfigForm({ ...configForm, authDomain: e.target.value })}
                      placeholder="project.firebaseapp.com"
                      className="w-full bg-[#181818] border border-[#383838] focus:border-blue-500 rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-0.5">App ID</label>
                    <input
                      type="text"
                      value={configForm.appId}
                      onChange={(e) => setConfigForm({ ...configForm, appId: e.target.value })}
                      placeholder="1:123456789:web:..."
                      className="w-full bg-[#181818] border border-[#383838] focus:border-blue-500 rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-98 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{t('auth.applyConfig')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#181818] px-5 py-3 border-t-2 border-[#333] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>{t('auth.ready')}</span>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#333] hover:bg-[#444] text-white rounded-lg font-bold transition-colors cursor-pointer"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
