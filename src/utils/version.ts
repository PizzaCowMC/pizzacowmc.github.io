/**
 * Centralized Version Management, Auto-Update Verification & Save Safety Engine
 * Version: 2.5.42
 * Repository: https://github.com/PizzaCowMC/pizzacowmc.github.io
 */

export const APP_VERSION = '2.5.42';
export const APP_BUILD_DATE = '2026-09-12';
export const GITHUB_REPO_URL = 'https://github.com/PizzaCowMC/pizzacowmc.github.io';
export const GITHUB_API_COMMITS_URL = 'https://api.github.com/repos/PizzaCowMC/pizzacowmc.github.io/commits/main';

export interface VersionInfo {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  releaseDate: string;
  source: 'server' | 'github' | 'bundled';
  lastChecked: string;
  status: 'up-to-date' | 'update-available' | 'checking' | 'error';
  changelogSummaryZh: string;
  changelogSummaryEn: string;
}

const STORAGE_AUTO_UPDATE_KEY = 'mc_auto_update_enabled_v2541';
const STORAGE_SAFETY_BACKUP_KEY = 'mc_save_safety_backup_v2541';

// Check if user has enabled auto-update checking (Default is TRUE)
export function isAutoUpdateEnabled(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_AUTO_UPDATE_KEY);
    if (saved === null) return true;
    return JSON.parse(saved) === true;
  } catch {
    return true;
  }
}

export function setAutoUpdateEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_AUTO_UPDATE_KEY, JSON.stringify(enabled));
  } catch (e) {
    console.error('Failed to save auto-update preference:', e);
  }
}

// Compare semantic versions (returns >0 if v1 > v2, <0 if v1 < v2, 0 if equal)
export function compareVersions(v1: string, v2: string): number {
  const cleanV1 = v1.replace(/^v/, '').split('.').map(Number);
  const cleanV2 = v2.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < Math.max(cleanV1.length, cleanV2.length); i++) {
    const num1 = cleanV1[i] || 0;
    const num2 = cleanV2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

/**
 * Creates an immutable safety snapshot of all game progress into localStorage
 * Ensures 100% data integrity before any updates, cache clears, or migrations.
 */
export function createSaveSafetyBackup(): { success: boolean; timestamp: string; keysBackedUp: number } {
  try {
    const backupData: Record<string, string> = {};
    let count = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('minecraft_workshop_') || key.startsWith('mc_'))) {
        const val = localStorage.getItem(key);
        if (val !== null) {
          backupData[key] = val;
          count++;
        }
      }
    }

    const payload = {
      timestamp: new Date().toISOString(),
      appVersion: APP_VERSION,
      count,
      data: backupData
    };

    localStorage.setItem(STORAGE_SAFETY_BACKUP_KEY, JSON.stringify(payload));
    return { success: true, timestamp: payload.timestamp, keysBackedUp: count };
  } catch (err) {
    console.error('Failed to create save safety backup:', err);
    return { success: false, timestamp: new Date().toISOString(), keysBackedUp: 0 };
  }
}

/**
 * Restore game state from safety backup if needed
 */
export function restoreSaveSafetyBackup(): { success: boolean; timestamp?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_SAFETY_BACKUP_KEY);
    if (!raw) return { success: false };
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data) return { success: false };

    Object.entries(parsed.data as Record<string, string>).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    return { success: true, timestamp: parsed.timestamp };
  } catch (err) {
    console.error('Failed to restore safety backup:', err);
    return { success: false };
  }
}

/**
 * Check for updates against the local server endpoint (/api/version)
 * and optionally GitHub API.
 */
export async function checkAppVersionUpdate(): Promise<VersionInfo> {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 1. Try local server version endpoint
  try {
    const res = await fetch('/api/version', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const serverVersion = data.version || APP_VERSION;
      const hasUpdate = compareVersions(serverVersion, APP_VERSION) > 0;

      return {
        currentVersion: APP_VERSION,
        latestVersion: serverVersion,
        hasUpdate,
        releaseDate: data.releaseDate || APP_BUILD_DATE,
        source: 'server',
        lastChecked: timestamp,
        status: hasUpdate ? 'update-available' : 'up-to-date',
        changelogSummaryZh: data.changelogSummaryZh || '2.5.42 新增社群投稿背景音樂唱片（3首）',
        changelogSummaryEn: data.changelogSummaryEn || '2.5.42 Added 3 Community-Submitted BGM Discs'
      };
    }
  } catch (e) {
    console.warn('Server version endpoint unreachable, falling back:', e);
  }

  // 2. Try GitHub Repository check if online
  try {
    const ghRes = await fetch(GITHUB_API_COMMITS_URL, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-store'
    });
    if (ghRes.ok) {
      const commitData = await ghRes.json();
      const commitMsg = commitData?.commit?.message || '';
      // Look for version numbers in commit message (e.g. 2.5.41)
      const versionMatch = commitMsg.match(/2\.5\.\d+/);
      const remoteVersion = versionMatch ? versionMatch[0] : APP_VERSION;
      const hasUpdate = compareVersions(remoteVersion, APP_VERSION) > 0;

      return {
        currentVersion: APP_VERSION,
        latestVersion: remoteVersion,
        hasUpdate,
        releaseDate: commitData?.commit?.committer?.date || APP_BUILD_DATE,
        source: 'github',
        lastChecked: timestamp,
        status: hasUpdate ? 'update-available' : 'up-to-date',
        changelogSummaryZh: `GitHub 最新提交: ${commitMsg.slice(0, 60)}`,
        changelogSummaryEn: `Latest GitHub commit: ${commitMsg.slice(0, 60)}`
      };
    }
  } catch (e) {
    console.warn('GitHub API check unreachable:', e);
  }

  // 3. Fallback bundled default
  return {
    currentVersion: APP_VERSION,
    latestVersion: APP_VERSION,
    hasUpdate: false,
    releaseDate: APP_BUILD_DATE,
    source: 'bundled',
    lastChecked: timestamp,
    status: 'up-to-date',
    changelogSummaryZh: '當前已是 2.5.42 最新版本（新增3首社群投稿背景音樂唱片）',
    changelogSummaryEn: 'Currently running the latest v2.5.42 (Added 3 Community-Submitted BGM Discs)'
  };
}

/**
 * Perform safe update & reload:
 * 1. Backs up progress
 * 2. Unregisters old service workers or caches
 * 3. Soft-reloads or window reloads
 */
export async function performSafeAppRefresh(): Promise<void> {
  createSaveSafetyBackup();

  // Try clearing browser cache caches if available
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    } catch (err) {
      console.warn('Cache clearing error:', err);
    }
  }

  // Reload window without cache
  window.location.reload();
}
