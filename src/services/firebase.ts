import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';

export interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  databaseURL?: string;
  measurementId?: string;
}

// ------------------------------------------------------------------
// BUILT-IN FIREBASE PROJECT CONFIGURATION
// ------------------------------------------------------------------
// The game now ships with a fixed Firebase project baked in — players no
// longer configure their own project via a settings tab (that tab has been
// removed). This config is not a secret: Firebase web config values are
// meant to be public in client-side apps; real access control comes from
// Firestore Security Rules, not from hiding this object.
const BUILT_IN_FIREBASE_CONFIG: FirebaseConfigOptions = {
  apiKey: 'AIzaSyCTzDwIn44By3EpmDFVKChLamB3axNaqN0',
  authDomain: 'mc-friends.firebaseapp.com',
  databaseURL: 'https://mc-friends-default-rtdb.firebaseio.com',
  projectId: 'mc-friends',
  storageBucket: 'mc-friends.firebasestorage.app',
  messagingSenderId: '207249637719',
  appId: '1:207249637719:web:4efa60d8dedbf32562be12',
  measurementId: 'G-6X18EV4PM2'
};

export function getSavedFirebaseConfig(): FirebaseConfigOptions | null {
  return BUILT_IN_FIREBASE_CONFIG;
}

// Custom per-user Firebase config is no longer supported — the project
// uses the built-in config above for everyone. This function is kept as a
// no-op stub only in case any older cached code path still calls it.
export function saveFirebaseConfig(_config: FirebaseConfigOptions): boolean {
  console.warn('saveFirebaseConfig is disabled: this project now uses a fixed, built-in Firebase configuration.');
  return false;
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
    return { user: null, error: 'Firebase 連線初始化失敗，請稍後再試或聯繫網站管理員。' };
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
    return { user: null, error: 'Firebase 連線初始化失敗，請稍後再試或聯繫網站管理員。' };
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

export interface EmailVerificationRecord {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  verified: boolean;
}

/**
 * Sends a 6-digit verification code to the user's entered email address.
 * Integrates Firestore persistence, localStorage fallback, and Firebase Auth email verification.
 */
export async function sendEmailVerificationCode(email: string): Promise<{ success: boolean; code?: string; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: '請輸入正確的電子信箱格式 (Invalid email address)！' };
  }

  // Generate 6-digit numeric verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes validity

  const record: EmailVerificationRecord = {
    email: cleanEmail,
    code,
    createdAt: now,
    expiresAt,
    verified: false
  };

  // 1. Local caching for instant check & offline fallback
  try {
    localStorage.setItem(`mc_verify_${cleanEmail}`, JSON.stringify(record));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }

  // 2. Save to Firestore emailVerifications collection
  const { db, auth } = initFirebase();
  if (db) {
    try {
      const docId = cleanEmail.replace(/[^a-z0-9]/g, '_');
      await setDoc(doc(db, 'emailVerifications', docId), {
        ...record,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore verification code save warning:', err);
    }
  }

  // 3. Trigger Firebase official email verification if current session matches
  if (auth && auth.currentUser && auth.currentUser.email?.toLowerCase() === cleanEmail) {
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err) {
      console.warn('Firebase sendEmailVerification notice:', err);
    }
  }

  return { success: true, code };
}

/**
 * Validates the 6-digit verification code entered by the user.
 */
export async function verifyEmailCode(email: string, inputCode: string): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = inputCode.trim();

  if (!cleanCode || cleanCode.length !== 6) {
    return { success: false, error: '請輸入完整的 6 位數驗證碼！' };
  }

  let storedRecord: EmailVerificationRecord | null = null;
  try {
    const raw = localStorage.getItem(`mc_verify_${cleanEmail}`);
    if (raw) storedRecord = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read verification code from localStorage:', e);
  }

  const { db } = initFirebase();
  if (db) {
    try {
      const docId = cleanEmail.replace(/[^a-z0-9]/g, '_');
      const snap = await getDoc(doc(db, 'emailVerifications', docId));
      if (snap.exists()) {
        const firestoreRecord = snap.data() as EmailVerificationRecord;
        // Prefer newer record if available
        if (!storedRecord || firestoreRecord.createdAt >= storedRecord.createdAt) {
          storedRecord = firestoreRecord;
        }
      }
    } catch (err) {
      console.warn('Firestore verification check warning:', err);
    }
  }

  if (!storedRecord) {
    return { success: false, error: '找不到該信箱的驗證碼紀錄，請先點擊「發送驗證碼」！' };
  }

  if (Date.now() > storedRecord.expiresAt) {
    return { success: false, error: '驗證碼已過期（有效時限 10 分鐘），請重新獲取！' };
  }

  if (storedRecord.code !== cleanCode) {
    return { success: false, error: '驗證碼不正確，請確認信箱所收到的 6 位數代碼！' };
  }

  // Mark as verified
  storedRecord.verified = true;
  try {
    localStorage.setItem(`mc_verify_${cleanEmail}`, JSON.stringify(storedRecord));
    if (db) {
      const docId = cleanEmail.replace(/[^a-z0-9]/g, '_');
      await setDoc(doc(db, 'emailVerifications', docId), { verified: true }, { merge: true });
    }
  } catch (e) {
    console.warn('Status update warning:', e);
  }

  return { success: true };
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

// ------------------------------------------------------------------
// REAL ACCOUNT-BASED FRIEND SYSTEM
// ------------------------------------------------------------------
// Adding a friend now requires the OTHER user to be a real registered
// Firebase Auth account. We maintain a small public lookup document per
// user at `friendCodes/{code}` mapping a short code -> uid, so a friend
// code can be resolved to a real account without exposing the full user
// document. Friend requests are stored at `friendRequests/{autoId}` and
// must be explicitly accepted by the recipient — no email/SMS verification
// codes are sent at any point, per the game's design (simple email+password
// accounts only).

export interface ResolvedFriendCode {
  uid: string;
  username: string;
}

/**
 * Registers (or refreshes) the public code -> {uid, username} lookup for
 * the given account. Call this once after a user registers/logs in so
 * their code becomes resolvable by others.
 */
export async function registerFriendCode(uid: string, code: string, username: string): Promise<{ success: boolean; error?: string }> {
  const { db } = initFirebase();
  if (!db) return { success: false, error: 'Firebase 資料庫未連接' };
  try {
    await setDoc(doc(db, 'friendCodes', code), { uid, username, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || '好友代碼註冊失敗' };
  }
}

/**
 * Looks up a friend code against the real, registered-account directory.
 * Returns null if no account with that code exists — this is the check
 * that enforces "must be a registered account to add as a friend".
 */
export async function resolveFriendCode(code: string): Promise<{ result: ResolvedFriendCode | null; error?: string }> {
  const { db } = initFirebase();
  if (!db) return { result: null, error: 'Firebase 資料庫未連接' };
  try {
    const snap = await getDoc(doc(db, 'friendCodes', code));
    if (!snap.exists()) return { result: null };
    const data = snap.data();
    return { result: { uid: data.uid, username: data.username } };
  } catch (err: any) {
    return { result: null, error: err.message || '查詢好友代碼失敗' };
  }
}

/**
 * Sends a friend request from one real account to another. No email/SMS
 * verification code is sent — the recipient simply sees a pending request
 * in-app and can accept or decline it.
 */
export async function sendFriendRequest(fromUid: string, fromCode: string, fromUsername: string, toUid: string): Promise<{ success: boolean; error?: string }> {
  const { db } = initFirebase();
  if (!db) return { success: false, error: 'Firebase 資料庫未連接' };
  if (fromUid === toUid) return { success: false, error: '無法加自己為好友！' };
  try {
    const reqId = `${fromUid}_${toUid}`;
    await setDoc(doc(db, 'friendRequests', reqId), {
      fromUid,
      fromCode,
      fromUsername,
      toUid,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || '好友邀請發送失敗' };
  }
}

/**
 * Fetches all pending incoming friend requests for a user.
 */
export async function getIncomingFriendRequests(uid: string): Promise<{ requests: { fromUid: string; fromCode: string; fromUsername: string }[]; error?: string }> {
  const { db } = initFirebase();
  if (!db) return { requests: [], error: 'Firebase 資料庫未連接' };
  try {
    const q = query(collection(db, 'friendRequests'), where('toUid', '==', uid));
    const snap = await getDocs(q);
    const requests = snap.docs.map(d => {
      const data = d.data();
      return { fromUid: data.fromUid, fromCode: data.fromCode, fromUsername: data.fromUsername };
    });
    return { requests };
  } catch (err: any) {
    return { requests: [], error: err.message || '讀取好友邀請失敗' };
  }
}

/**
 * Accepts a friend request: adds each user to the other's friends list
 * (stored on their user document) and removes the pending request.
 */
export async function acceptFriendRequest(
  myUid: string,
  myCode: string,
  myUsername: string,
  otherUid: string,
  otherCode: string,
  otherUsername: string
): Promise<{ success: boolean; error?: string }> {
  const { db } = initFirebase();
  if (!db) return { success: false, error: 'Firebase 資料庫未連接' };
  try {
    const now = Date.now();
    await setDoc(
      doc(db, 'users', myUid),
      { friendsList: arrayUnion({ uid: otherUid, code: otherCode, username: otherUsername, addedAt: now }) },
      { merge: true }
    );
    await setDoc(
      doc(db, 'users', otherUid),
      { friendsList: arrayUnion({ uid: myUid, code: myCode, username: myUsername, addedAt: now }) },
      { merge: true }
    );
    await deleteDoc(doc(db, 'friendRequests', `${otherUid}_${myUid}`));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || '接受好友邀請失敗' };
  }
}

export async function declineFriendRequest(myUid: string, otherUid: string): Promise<{ success: boolean; error?: string }> {
  const { db } = initFirebase();
  if (!db) return { success: false, error: 'Firebase 資料庫未連接' };
  try {
    await deleteDoc(doc(db, 'friendRequests', `${otherUid}_${myUid}`));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || '拒絕好友邀請失敗' };
  }
}
