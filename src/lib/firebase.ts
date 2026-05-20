import { 
  initializeApp 
} from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  browserPopupRedirectResolver,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { 
  getDatabase, 
  ref as dbRef, 
  set as dbSet, 
  push as dbPush, 
  get as dbGet, 
  child as dbChild, 
  serverTimestamp as rtdbServerTimestamp
} from 'firebase/database';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = (firebaseConfig as any).firestoreDatabaseId ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) : getFirestore(app);
export const rtdb = getDatabase(app, 'https://eventmanagment-ec21e-default-rtdb.firebaseio.com/');
export const auth = getAuth(app);

export { dbRef, dbSet, dbPush, dbGet, dbChild, rtdbServerTimestamp };

// Set persistence to Local
setPersistence(auth, browserLocalPersistence).catch(console.error);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Export the additional auth functions
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile };

let isSigningIn = false;

export const signInWithGoogle = async () => {
  if (isSigningIn) {
    console.warn("Sign-in already in progress...");
    return;
  }
  
  isSigningIn = true;
  try {
    // Explicitly use the browser popup resolver which is more reliable in iframes
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return result.user;
  } catch (error: any) {
    // Handle cases where the user closes the popup or another request cancels it
    if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      console.log("Sign-in popup closed or cancelled by user.");
      return null;
    }
    console.error("Error signing in with Google:", error);
    throw error;
  } finally {
    isSigningIn = true; // Still "in progress" briefly to prevent double-click bounce
    setTimeout(() => { isSigningIn = false; }, 2000);
  }
};

// CRITICAL: Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error instanceof Error) {
      if (error.message.includes('permission-denied') || (error as any).code === 'permission-denied') {
        console.log("Firebase Firestore Connection Verified (Access Restricted by Rules as expected).");
      } else if (error.message.includes('the client is offline')) {
        console.warn("Firestore is optimizing for offline access. A connection will be established once network channel is active.");
      } else {
        console.log("Firestore initialized:", error.message);
      }
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
