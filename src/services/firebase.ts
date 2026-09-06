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
  deleteDoc,
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

export function usernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase();
  const hex = Array.from(new TextEncoder().encode(clean))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `u_${hex}@minecraft.workshop`;
}

export interface PlayerUserSession {
  uid: string;
  displayName: string;
  email: string | null;
}

const ACTIVE_SESSION_KEY = 'mc_active_user_session';
const CLOUD_BACKUP_PREFIX = 'mc_cloud_backup_';

export function getActiveSession(): PlayerUserSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.uid && parsed.displayName) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse active session', e);
  }
  return null;
}

const authListeners = new Set<(user: PlayerUserSession | null) => void>();

export function setActiveSession(session: PlayerUserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem('mc_current_user_uid', session.uid);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      localStorage.removeItem('mc_current_user_uid');
    }
  } catch (e) {
    console.error('Failed to set active session', e);
  }

  // Notify all listeners
  authListeners.forEach(listener => {
    try {
      listener(session);
    } catch (err) {
      console.error('Error in auth listener:', err);
    }
  });
}

export function isFirebaseConfigured(): boolean {
  return !!getSavedFirebaseConfig() && !!authInstance && !!dbInstance;
}

export async function registerUserWithUsername(
  username: string,
  pass: string
): Promise<{ user: PlayerUserSession | null; error?: string }> {
  const cleanName = username.trim();
  if (!cleanName || cleanName.length < 2) {
    return { user: null, error: '玩家名稱長度請至少 2 個字元！' };
  }
  if (cleanName.length > 20) {
    return { user: null, error: '玩家名稱長度請勿超過 20 個字元！' };
  }
  if (!pass || pass.length < 6) {
    return { user: null, error: '密碼強度不足，請至少輸入 6 位字元！' };
  }

  const { auth, db } = initFirebase();
  if (!auth) {
    const localUsers = JSON.parse(localStorage.getItem('mc_local_registered_users') || '{}');
    const normalized = cleanName.toLowerCase();
    if (localUsers[normalized]) {
      return { user: null, error: '該名稱已被使用，請換一個名稱！' };
    }
    const uid = `local_${normalized}_${Date.now()}`;
    localUsers[normalized] = {
      username: cleanName,
      password: pass,
      uid,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('mc_local_registered_users', JSON.stringify(localUsers));
    const session: PlayerUserSession = {
      uid,
      displayName: cleanName,
      email: null
    };
    setActiveSession(session);
    return { user: session };
  }

  try {
    // 1. Check if name already exists in Firestore 'usernames' collection
    if (db) {
      const normalized = cleanName.toLowerCase();
      const nameDocRef = doc(db, 'usernames', normalized);
      const snap = await getDoc(nameDocRef);
      if (snap.exists()) {
        return { user: null, error: '該名稱已被使用，請換一個名稱！' };
      }
    }

    // 2. Register with Firebase Auth using internal deterministic mapping
    const internalEmail = usernameToEmail(cleanName);
    const cred = await createUserWithEmailAndPassword(auth, internalEmail, pass);

    if (cred.user) {
      await updateProfile(cred.user, { displayName: cleanName });

      // 3. Reserve name in Firestore
      if (db) {
        const normalized = cleanName.toLowerCase();
        await setDoc(doc(db, 'usernames', normalized), {
          uid: cred.user.uid,
          username: cleanName,
          createdAt: serverTimestamp()
        });
      }
    }

    const session: PlayerUserSession = {
      uid: cred.user.uid,
      displayName: cleanName,
      email: cred.user.email
    };
    setActiveSession(session);
    return { user: session };
  } catch (err: any) {
    let msg = err.message || '註冊失敗';
    if (err.code === 'auth/email-already-in-use') {
      msg = '該名稱已被使用，請換一個名稱！';
    } else if (err.code === 'auth/weak-password') {
      msg = '密碼長度不足，請至少輸入 6 位字元！';
    }
    return { user: null, error: msg };
  }
}

export async function loginUserWithUsername(
  username: string,
  pass: string
): Promise<{ user: PlayerUserSession | null; error?: string }> {
  const cleanName = username.trim();
  if (!cleanName) {
    return { user: null, error: '請輸入玩家名稱！' };
  }
  if (!pass) {
    return { user: null, error: '請輸入密碼！' };
  }

  const { auth } = initFirebase();
  if (!auth) {
    const localUsers = JSON.parse(localStorage.getItem('mc_local_registered_users') || '{}');
    const normalized = cleanName.toLowerCase();
    const existing = localUsers[normalized];
    if (!existing || existing.password !== pass) {
      return { user: null, error: '玩家名稱或密碼錯誤！' };
    }
    const session: PlayerUserSession = {
      uid: existing.uid || `local_${normalized}`,
      displayName: existing.username || cleanName,
      email: null
    };
    setActiveSession(session);
    return { user: session };
  }

  try {
    const internalEmail = usernameToEmail(cleanName);
    const cred = await signInWithEmailAndPassword(auth, internalEmail, pass);
    const session: PlayerUserSession = {
      uid: cred.user.uid,
      displayName: cred.user.displayName || cleanName,
      email: cred.user.email
    };
    setActiveSession(session);
    return { user: session };
  } catch (err: any) {
    let msg = err.message || '登入失敗';
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential'
    ) {
      msg = '玩家名稱或密碼錯誤！';
    } else if (err.code === 'auth/too-many-requests') {
      msg = '登入失敗次數過多，請稍候再試！';
    }
    return { user: null, error: msg };
  }
}

export async function updatePlayerUsername(
  newUsername: string
): Promise<{ success: boolean; error?: string }> {
  const cleanName = newUsername.trim();
  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: '玩家名稱長度請至少 2 個字元！' };
  }
  if (cleanName.length > 20) {
    return { success: false, error: '玩家名稱長度最多 20 個字元！' };
  }

  const { auth, db } = initFirebase();
  const normalized = cleanName.toLowerCase();
  const currentSession = getActiveSession();

  // Local fallback check
  const localUsers = JSON.parse(localStorage.getItem('mc_local_registered_users') || '{}');
  const currentUid = auth?.currentUser?.uid || currentSession?.uid || '';

  if (db && auth?.currentUser) {
    try {
      // Check if new name is already taken by someone else
      const nameDocRef = doc(db, 'usernames', normalized);
      const snap = await getDoc(nameDocRef);
      if (snap.exists() && snap.data()?.uid !== auth.currentUser.uid) {
        return { success: false, error: '該名稱已被使用，請換一個名稱！' };
      }

      const oldName = auth.currentUser.displayName;
      // Update Firebase Auth displayName
      await updateProfile(auth.currentUser, { displayName: cleanName });

      // Claim new username in Firestore
      await setDoc(nameDocRef, {
        uid: auth.currentUser.uid,
        username: cleanName,
        updatedAt: serverTimestamp()
      });

      // Remove old username record if changed
      if (oldName && oldName.toLowerCase() !== normalized) {
        await deleteDoc(doc(db, 'usernames', oldName.toLowerCase())).catch(() => {});
      }

      if (currentSession) {
        setActiveSession({ ...currentSession, displayName: cleanName });
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '更新名稱失敗' };
    }
  } else {
    // Guest/local storage mode
    if (localUsers[normalized] && localUsers[normalized].uid !== currentUid) {
      return { success: false, error: '該名稱已被使用，請換一個名稱！' };
    }
    localUsers[normalized] = {
      ...(localUsers[normalized] || {}),
      username: cleanName,
      uid: currentUid || 'local_user',
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('mc_local_registered_users', JSON.stringify(localUsers));

    if (currentSession) {
      setActiveSession({ ...currentSession, displayName: cleanName });
    }

    return { success: true };
  }
}

export async function registerUser(email: string, pass: string, displayName?: string): Promise<{ user: PlayerUserSession | null; error?: string }> {
  return registerUserWithUsername(displayName || email.split('@')[0], pass);
}

export async function loginUser(email: string, pass: string): Promise<{ user: PlayerUserSession | null; error?: string }> {
  return loginUserWithUsername(email.split('@')[0], pass);
}

export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  setActiveSession(null);
  const { auth } = initFirebase();
  if (auth) {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  }
  return { success: true };
}

export function subscribeToAuth(callback: (user: PlayerUserSession | null) => void): () => void {
  authListeners.add(callback);

  // Immediately dispatch current active session if present
  const currentSession = getActiveSession();
  callback(currentSession);

  const { auth } = initFirebase();
  let firebaseUnsub = () => {};

  if (auth) {
    firebaseUnsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const session: PlayerUserSession = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Miner',
          email: firebaseUser.email
        };
        setActiveSession(session);
      } else {
        const sess = getActiveSession();
        // Only clear if active session was associated with Firebase
        if (sess && !sess.uid.startsWith('local_')) {
          setActiveSession(null);
        }
      }
    });
  }

  return () => {
    authListeners.delete(callback);
    firebaseUnsub();
  };
}

export async function saveUserData(uid: string, gameData: any): Promise<{ success: boolean; error?: string }> {
  // Always persist local cloud backup
  try {
    localStorage.setItem(`${CLOUD_BACKUP_PREFIX}${uid}`, JSON.stringify(gameData));
  } catch (e) {
    console.warn('Local cloud backup save warning:', e);
  }

  const { db } = initFirebase();
  if (!db) {
    // Successfully saved locally
    return { success: true };
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
    // If local save succeeded, report success with warning or retry
    return { success: true };
  }
}

export async function loadUserData(uid: string): Promise<{ data: any | null; error?: string }> {
  const { db } = initFirebase();
  if (db) {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return { data: snap.data() };
      }
    } catch (err: any) {
      console.error('Failed to load from Firestore, checking local backup:', err);
    }
  }

  // Fallback to local cloud backup
  try {
    const raw = localStorage.getItem(`${CLOUD_BACKUP_PREFIX}${uid}`);
    if (raw) {
      return { data: JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to read local backup:', e);
  }

  return { data: null };
}
