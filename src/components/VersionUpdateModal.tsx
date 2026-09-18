import React, { useState, useEffect } from 'react';
import {
  APP_VERSION,
  APP_BUILD_DATE,
  GITHUB_REPO_URL,
  VersionInfo,
  checkAppVersionUpdate,
  isAutoUpdateEnabled,
  setAutoUpdateEnabled,
  createSaveSafetyBackup,
  restoreSaveSafetyBackup,
  performSafeAppRefresh
} from '../utils/version';
import { sound } from '../utils/soundEffects';
import { useLanguage } from '../utils/i18n';
import {
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  DownloadCloud,
  FileText,
  ExternalLink,
  X,
  Sparkles,
  Database,
  ArrowUpCircle,
  AlertCircle
} from 'lucide-react';

interface VersionUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChangelog: () => void;
  onNotify?: (msg: string) => void;
}

export const VersionUpdateModal: React.FC<VersionUpdateModalProps> = ({
  isOpen,
  onClose,
  onOpenChangelog,
  onNotify
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [autoUpdate, setAutoUpdate] = useState<boolean>(() => isAutoUpdateEnabled());
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleCheckUpdate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAutoUpdate = () => {
    sound.playClickSound();
    const next = !autoUpdate;
    setAutoUpdate(next);
    setAutoUpdateEnabled(next);
    if (onNotify) {
      onNotify(
        next
          ? isEn ? '✅ Auto-update checking enabled' : '✅ 已開啟啟動與後台自動檢查更新功能'
          : isEn ? '⚠️ Auto-update checking paused' : '⚠️ 已暫停自動檢查更新'
      );
    }
  };

  const handleCheckUpdate = async (manual = true) => {
    if (manual) sound.playClickSound();
    setIsChecking(true);
    setBackupStatus(null);
    try {
      const info = await checkAppVersionUpdate();
      setVersionInfo(info);
      if (manual && onNotify) {
        if (info.hasUpdate) {
          onNotify(isEn ? `🚀 New version ${info.latestVersion} found!` : `🚀 發現新版本 ${info.latestVersion}！`);
        } else {
          onNotify(isEn ? `✅ You are on the latest stable version v${APP_VERSION}!` : `✅ 您當前使用的是最新穩定版本 v${APP_VERSION}！`);
        }
      }
    } catch (err) {
      console.error('Update check failed:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCreateBackup = () => {
    sound.playAchievementSound();
    const res = createSaveSafetyBackup();
    if (res.success) {
      setBackupStatus(isEn ? `Backup created (${res.keysBackedUp} keys saved)` : `安全備份完成（共 ${res.keysBackedUp} 筆存檔項目）`);
      if (onNotify) onNotify(isEn ? '🛡️ Save safety backup completed successfully!' : '🛡️ 存檔安全雙重防護備份已建立！');
    }
  };

  const handleRestoreBackup = () => {
    sound.playClickSound();
    const res = restoreSaveSafetyBackup();
    if (res.success) {
      setBackupStatus(isEn ? 'Backup restored! Reloading...' : '備份已成功復原！正在重新整理...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      setBackupStatus(isEn ? 'No prior backup found!' : '尚未找到先前建立的安全備份！');
    }
  };

  const handleApplyUpdate = async () => {
    sound.playUpgradeSound();
    if (onNotify) onNotify(isEn ? '🔄 Backing up save & refreshing assets...' : '🔄 正在建立安全備份並同步最新快取...');
    await performSafeAppRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1e1e1e] border-4 border-black rounded-xl max-w-lg w-full shadow-[inset_-4px_-4px_0_#111,inset_4px_4px_0_#444,0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#141414] px-5 py-4 border-b-2 border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 drop-shadow-[1px_1px_0_#000] flex items-center gap-2">
                <span>{isEn ? 'Version & Auto-Update Engine' : '版本管理與自動更新功能'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded font-bold">
                  v{APP_VERSION}
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isEn ? 'Automatic version check, save data safeguard & hot update' : '自動版本偵測、存檔安全雙重防護與熱更新同步'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main Version Status Card */}
          <div className="bg-zinc-900/90 border-2 border-zinc-800 rounded-xl p-4 shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 font-medium">
                  {isEn ? 'Installed Version' : '本機當前版本'}
                </span>
                <div className="text-2xl font-black text-white font-mono flex items-center gap-2 mt-0.5">
                  <span>v{APP_VERSION}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 rounded-full font-sans font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {isEn ? 'Latest Stable' : '最新穩定版'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCheckUpdate(true)}
                disabled={isChecking}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black text-xs rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#92400e,inset_2px_2px_0_#fde68a] transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? (isEn ? 'Checking...' : '檢查中...') : (isEn ? 'Check Now' : '檢查更新')}</span>
              </button>
            </div>

            {/* Check Results & Source */}
            {versionInfo && (
              <div className="pt-2 border-t border-zinc-800/80 text-xs flex flex-col gap-1.5 text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{isEn ? 'Status:' : '更新狀態：'}</span>
                  <span className="font-medium text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {versionInfo.hasUpdate
                      ? (isEn ? `New Version Available: v${versionInfo.latestVersion}` : `發現新版本：v${versionInfo.latestVersion}`)
                      : (isEn ? `All systems up to date (v${APP_VERSION})` : `已是最新穩定版本 (v${APP_VERSION})`)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{isEn ? 'Last Verified:' : '上次檢查時間：'}</span>
                  <span className="font-mono text-zinc-400">{versionInfo.lastChecked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{isEn ? 'Release Date:' : '發行日期：'}</span>
                  <span className="font-mono text-zinc-400">{APP_BUILD_DATE}</span>
                </div>
              </div>
            )}
          </div>

          {/* Auto-Update Feature Toggle */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-zinc-200">
                  {isEn ? 'Automatic Background Update Check' : '啟動與背景自動檢查更新'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {isEn
                    ? 'Silently verifies updates and syncs bottom tag on app startup'
                    : '應用啟動與運行時自動同步底部版本標籤，確保隨時處於最穩定環境'}
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleAutoUpdate}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border border-black ${
                autoUpdate ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-md ${
                  autoUpdate ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Stability & Save Safeguard Section */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? 'Save State Stability & Disaster Recovery' : '存檔穩定性守護與災難復原保證'}</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              {isEn
                ? `v${APP_VERSION} incorporates automatic dual-layer save snapshots before any version transition, guaranteeing zero progress loss for cafe rank, mining strata, and items.`
                : `v${APP_VERSION} 版本內建更新前雙重存檔快照機制。在任何快取更新或版本躍遷前，自動保護您的咖啡廳星級、地層進度、鎬子道具與金幣資產，穩定度 100% 保證。`}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCreateBackup}
                className="flex-1 py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEn ? 'Create Save Snapshot' : '手動建立安全快照'}</span>
              </button>
              <button
                onClick={handleRestoreBackup}
                className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title={isEn ? 'Restore from last safety snapshot' : '從最近的安全快照復原'}
              >
                <span>{isEn ? 'Restore' : '復原快照'}</span>
              </button>
            </div>

            {backupStatus && (
              <div className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/40">
                {backupStatus}
              </div>
            )}
          </div>

          {/* Quick Actions & Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                sound.playClickSound();
                onClose();
                onOpenChangelog();
              }}
              className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer group"
            >
              <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-300">
                  {isEn ? 'Release Changelog' : '版本更新日誌'}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {isEn ? `View all v${APP_VERSION} features` : `查看 v${APP_VERSION} 全部新特性`}
                </div>
              </div>
            </button>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClickSound()}
              className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer group"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-emerald-300">
                  {isEn ? 'GitHub Repository' : 'GitHub 開源專案'}
                </div>
                <div className="text-[10px] text-zinc-400">
                  PizzaCowMC / pizzacowmc.github.io
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#141414] px-5 py-3 border-t-2 border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-[11px]">
            {isEn ? `Auto-Update & Save Guard v${APP_VERSION}` : `底籤自動更新與穩定性守護 v${APP_VERSION}`}
          </span>
          <button
            onClick={handleApplyUpdate}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg border-2 border-black shadow-[inset_-2px_-2px_0_#064e3b,inset_2px_2px_0_#6ee7b7] active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Safe Refresh & Sync' : '安全更新並刷新'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
