import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  X,
  Check,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendEmailVerificationCode,
  verifyEmailCode
} from '../services/firebase';
import { useLanguage } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string | null; displayName: string | null; uid: string | null } | null;
  onCloudSave: () => Promise<{ success: boolean; error?: string }>;
  onCloudLoad: () => Promise<{ success: boolean; error?: string }>;
  lastSavedTime: string | null;
  onUserLoggedOut: () => void;
  onUserLoggedIn: () => void;
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
  // Firebase project config is now fixed/built-in — the "config" tab has
  // been removed, so this only ever needs to distinguish login/register/cloud.
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'cloud'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeCooldown, setCodeCooldown] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [lastDispatchedCode, setLastDispatchedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const isEn = language === 'en';

  useEffect(() => {
    if (codeCooldown <= 0) return;
    const timer = setInterval(() => {
      setCodeCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [codeCooldown]);

  if (!isOpen) return null;

  const showMsg = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMsg({ text, type });
    setTimeout(() => {
      setStatusMsg(null);
    }, 4000);
  };

  const handleSendVerificationCode = async () => {
    if (!email) {
      showMsg(isEn ? 'Please enter your email address first!' : '請先輸入電子信箱！', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showMsg(isEn ? 'Invalid email address format!' : '電子信箱格式無效！', 'error');
      return;
    }
    setIsSendingCode(true);
    sound.playClickSound();
    const res = await sendEmailVerificationCode(email);
    setIsSendingCode(false);

    if (res.success) {
      setCodeSent(true);
      setCodeCooldown(60);
      setIsEmailVerified(false);
      if (res.code) {
        setLastDispatchedCode(res.code);
      }
      sound.playAchievementSound();
      showMsg(
        isEn
          ? `📨 6-digit verification code has been dispatched to ${email}! Please check your inbox.`
          : `📨 6 位數驗證碼已傳送至用戶輸入的信箱「${email}」！請查收收件匣。`,
        'success'
      );
    } else {
      sound.playHitSound(2);
      showMsg(res.error || (isEn ? 'Failed to send verification code.' : '驗證碼發送失敗。'), 'error');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.trim().length !== 6) {
      showMsg(isEn ? 'Please enter the full 6-digit verification code!' : '請輸入完整的 6 位數驗證碼！', 'error');
      return;
    }
    setIsVerifyingCode(true);
    sound.playClickSound();
    const res = await verifyEmailCode(email, verificationCode);
    setIsVerifyingCode(false);

    if (res.success) {
      setIsEmailVerified(true);
      sound.playAchievementSound();
      showMsg(isEn ? '✅ Email verified successfully!' : '✅ 電子信箱驗證成功！', 'success');
    } else {
      sound.playHitSound(2);
      showMsg(res.error || (isEn ? 'Invalid verification code.' : '驗證碼不正確或已過期。'), 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMsg(isEn ? 'Please enter your email and password!' : '請輸入電子信箱與密碼！', 'error');
      return;
    }
    setLoading(true);
    sound.playClickSound();
    const res = await loginUser(email, password);
    setLoading(false);
    if (res.user) {
      sound.playAchievementSound();
      showMsg(
        isEn
          ? `✅ Logged in successfully! Welcome back, ${res.user.displayName || res.user.email}`
          : `✅ 登入成功！歡迎回來，${res.user.displayName || res.user.email}`,
        'success'
      );
      onUserLoggedIn();
      setActiveTab('cloud');
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Login failed: ${res.error}` : `❌ 登入失敗：${res.error}`, 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMsg(isEn ? 'Please fill in all registration fields!' : '請填寫完整註冊資訊！', 'error');
      return;
    }
    if (password.length < 6) {
      showMsg(isEn ? 'Password must be at least 6 characters long!' : '密碼長度請至少 6 位字符！', 'error');
      return;
    }

    // Strict Email Verification Code Requirement
    if (!isEmailVerified) {
      if (verificationCode.trim().length === 6) {
        const check = await verifyEmailCode(email, verificationCode);
        if (!check.success) {
          sound.playHitSound(2);
          showMsg(check.error || (isEn ? 'Verification code incorrect!' : '驗證碼輸入錯誤！'), 'error');
          return;
        }
        setIsEmailVerified(true);
      } else {
        sound.playHitSound(2);
        showMsg(
          isEn
            ? '⚠️ Please click "Send Code" to dispatch the 6-digit code to your email and verify before registering!'
            : '⚠️ 必須先將驗證碼傳至用戶輸入的信箱並完成 6 位數驗證，方可註冊帳號！',
          'error'
        );
        return;
      }
    }

    setLoading(true);
    sound.playClickSound();
    const res = await registerUser(email, password, displayName || undefined);
    setLoading(false);
    if (res.user) {
      sound.playAchievementSound();
      showMsg(isEn ? '🎉 Registration successful! Auto-logged in.' : '🎉 註冊成功並已自動登入！', 'success');
      onUserLoggedIn();
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
    setLoading(true);
    sound.playClickSound();
    const res = await onCloudSave();
    setLoading(false);
    if (res.success) {
      sound.playAchievementSound();
      showMsg(isEn ? '☁️ Progress successfully saved to Cloud Database!' : '☁️ 進度已成功儲存至雲端資料庫！', 'success');
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Cloud save failed: ${res.error}` : `❌ 雲端存檔失敗：${res.error}`, 'error');
    }
  };

  const handleLoadFromCloud = async () => {
    setLoading(true);
    sound.playClickSound();
    const res = await onCloudLoad();
    setLoading(false);
    if (res.success) {
      sound.playAchievementSound();
      showMsg(isEn ? '📥 Cloud progress successfully loaded and applied!' : '📥 雲端進度已成功載入覆蓋！', 'success');
    } else {
      sound.playHitSound(2);
      showMsg(isEn ? `❌ Cloud load failed: ${res.error}` : `❌ 雲端進度讀取失敗：${res.error}`, 'error');
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
        <div className="bg-[#1b1b1b] border-b border-[#303030] px-4 pt-2 flex gap-2">
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
                  {currentUser ? (currentUser.displayName || currentUser.email) : t('auth.notLoggedIn')}
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
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  required
                  className="w-full bg-[#181818] border border-[#383838] focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#181818] border border-[#383838] focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
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
                  {t('auth.displayName')}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Minecraft_Hero"
                  className="w-full bg-[#181818] border border-[#383838] focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.email')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailVerified(false);
                      setLastDispatchedCode(null);
                    }}
                    placeholder="player@example.com"
                    required
                    className="flex-1 bg-[#181818] border border-[#383838] focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || codeCooldown > 0 || !email}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>
                      {isSendingCode
                        ? t('auth.sendingCode')
                        : codeCooldown > 0
                        ? `${t('auth.resendCode')} (${codeCooldown}s)`
                        : t('auth.sendCode')}
                    </span>
                  </button>
                </div>
              </div>

              {/* 6-digit Verification Code Section */}
              <div className="bg-[#191919] border border-zinc-700/80 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    {t('auth.verificationCode')}
                  </span>
                  {isEmailVerified ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {t('auth.emailVerified')}
                    </span>
                  ) : (
                    <span className="text-amber-400/90 text-[11px] font-mono">
                      {codeSent ? (isEn ? 'Code dispatched' : '驗證碼已發送') : (isEn ? 'Required' : '註冊必填')}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setVerificationCode(val);
                      if (val.length === 6 && !isEmailVerified) {
                        verifyEmailCode(email, val).then(res => {
                          if (res.success) {
                            setIsEmailVerified(true);
                            sound.playAchievementSound();
                            showMsg(isEn ? '✅ Email verified!' : '✅ 信箱驗證通過！', 'success');
                          }
                        });
                      }
                    }}
                    placeholder={t('auth.codePlaceholder')}
                    disabled={isEmailVerified}
                    className="flex-1 font-mono tracking-widest text-center text-sm bg-[#131313] border border-[#383838] focus:border-amber-500 rounded-lg px-3 py-1.5 text-white placeholder-zinc-600 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerifyingCode || isEmailVerified || verificationCode.length !== 6}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEmailVerified ? (isEn ? 'Verified' : '已通過') : t('auth.verifyCodeBtn')}</span>
                  </button>
                </div>

                {lastDispatchedCode && (
                  <div className="mt-1.5 p-2 bg-blue-950/40 border border-blue-800/60 rounded text-[11px] text-blue-300 flex items-center justify-between">
                    <span>📨 已發送至 <b className="text-white">{email}</b></span>
                    <span className="font-mono bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-700/60 font-bold">
                      代碼: {lastDispatchedCode}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {t('auth.password')} {isEn ? '(At least 6 chars)' : '(至少 6 位)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#181818] border border-[#383838] focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
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
              {/* Email Verification Status Card */}
              {currentUser && currentUser.email && (
                <div className="bg-[#181818] border border-zinc-700/80 rounded-lg p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-300">{currentUser.email}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold text-emerald-400">{t('auth.emailVerified')}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                    VERIFIED
                  </span>
                </div>
              )}

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

          {/* TAB 4: FIREBASE PROJECT CONFIGURATION — removed. The project
              uses a fixed, built-in Firebase configuration; users can no
              longer supply their own Firebase project settings here. */}
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
