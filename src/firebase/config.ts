import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Effective Firebase Config with Vercel environment fallback
const effectiveConfig = {
  projectId: firebaseConfig.projectId || (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  appId: firebaseConfig.appId || (import.meta as any).env?.VITE_FIREBASE_APP_ID,
  apiKey: firebaseConfig.apiKey || (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  authDomain: firebaseConfig.authDomain || (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || (import.meta as any).env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID,
  storageBucket: firebaseConfig.storageBucket || (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfig.messagingSenderId || (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(effectiveConfig) : getApp();

// Export Firestore with specific database ID from config
export const db = getFirestore(app, effectiveConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Test Firestore connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    return false;
  }
}
testConnection();

// Standardized Firestore Error Handler conforming to skill guidelines
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
  };
}

export function cleanFirestoreData<T>(data: T): any {
  if (data === null || data === undefined) return null;
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (value === undefined ? null : value))
  );
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo: (auth.currentUser?.providerData || []).map(provider => ({
        providerId: provider.providerId ?? null,
        email: provider.email ?? null,
      }))
    },
    operationType,
    path: path ?? null
  };
  const sanitizedErr = cleanFirestoreData(errInfo);
  console.error('Firestore Error:', JSON.stringify(sanitizedErr));
  throw new Error(JSON.stringify(sanitizedErr));
}

