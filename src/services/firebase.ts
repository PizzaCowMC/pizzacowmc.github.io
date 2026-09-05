import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';

export interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const LOCAL_CONFIG_KEY = 'mc_custom_firebase_config';

// Load stored or env config
export function getSavedFirebaseConfig(): FirebaseConfigOptions | null {
  try {
    const saved = localStorage.getItem(LOCAL_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved Firebase config', e);
  }

  // Check Vite Env variables
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (metaEnv?.VITE_FIREBASE_API_KEY && metaEnv?.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: metaEnv.VITE_FIREBASE_API_KEY,
      authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || `${metaEnv.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
      storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: metaEnv.VITE_FIREBASE_APP_ID || ''
    };
  }

  return null;
}

export function saveFirebaseConfig(config: FirebaseConfigOptions): boolean {
  try {
    localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config));
    // Re-initialize app
    initFirebase(config, true);
    return true;
  } catch (e) {
    console.error('Failed to save Firebase config', e);
    return false;
  }
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export function initFirebase(customConfig?: FirebaseConfigOptions, forceRestart = false): { app: FirebaseApp | null; auth: Auth | null; db: Firestore | null } {
  if (appInstance && authInstance && dbInstance && !forceRestart) {
    return { app: appInstance, auth: authInstance, db: dbInstance };
  }

  const config = customConfig || getSavedFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, auth: null, db: null };
  }

  try {
    if (getApps().length > 0 && !forceRestart) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp(config);
    }
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    return { app: appInstance, auth: authInstance, db: dbInstance };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return { app: null, auth: null, db: null };
  }
}

// Initial bootstrap attempt
initFirebase();

export function isFirebaseConfigured(): boolean {
  return !!getSavedFirebaseConfig() && !!authInstance && !!dbInstance;
}

export async function registerUser(email: string, pass: string, displayName?: string): Promise<{ user: User | null; error?: string }> {
  const { auth } = initFirebase();
  if (!auth) {
    return { user: null, error: 'Firebase 尚未配置，請先在「Firebase 設定」填寫專案資訊！' };
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && cred.user) {
      await updateProfile(cred.user, { displayName });
    }
    return { user: cred.user };
  } catch (err: any) {
    let msg = err.message || '註冊失敗';
    if (err.code === 'auth/email-already-in-use') msg = '此電子信箱已被註冊！';
    if (err.code === 'auth/weak-password') msg = '密碼強度不足，請至少輸入 6 位字符！';
    if (err.code === 'auth/invalid-email') msg = '電子信箱格式無效！';
    return { user: null, error: msg };
  }
}

export async function loginUser(email: string, pass: string): Promise<{ user: User | null; error?: string }> {
  const { auth } = initFirebase();
  if (!auth) {
    return { user: null, error: 'Firebase 尚未配置，請先在「Firebase 設定」填寫專案資訊！' };
  }
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { user: cred.user };
  } catch (err: any) {
    let msg = err.message || '登入失敗';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      msg = '電子信箱或密碼錯誤！';
    } else if (err.code === 'auth/too-many-requests') {
      msg = '登入失敗次數過多，請稍後再試！';
    }
    return { user: null, error: msg };
  }
}

export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  const { auth } = initFirebase();
  if (!auth) return { success: true };
  try {
    await signOut(auth);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  const { auth } = initFirebase();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function saveUserData(uid: string, gameData: any): Promise<{ success: boolean; error?: string }> {
  const { db } = initFirebase();
  if (!db) {
    return { success: false, error: 'Firebase 資料庫未連接' };
  }
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...gameData,
      updatedAt: serverTimestamp(),
      lastSavedLocalTime: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save to Firestore:', err);
    return { success: false, error: err.message || '雲端儲存失敗' };
  }
}

export async function loadUserData(uid: string): Promise<{ data: any | null; error?: string }> {
  const { db } = initFirebase();
  if (!db) {
    return { data: null, error: 'Firebase 資料庫未連接' };
  }
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return { data: snap.data() };
    }
    return { data: null };
  } catch (err: any) {
    console.error('Failed to load from Firestore:', err);
    return { data: null, error: err.message || '讀取雲端存檔失敗' };
  }
}
