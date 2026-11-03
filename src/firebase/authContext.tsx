import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, cleanFirestoreData } from './config';
import { UserProfile } from '../types';

interface AppUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  anonymousRestricted: boolean;
  updateProfileData: (displayName: string, photoURL?: string, about?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setAdminOverride: (override: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_EMAILS = ['elonmusk241@gmail.com', 'johnlsacc23332@gmail.com'];
export const PRIMARY_ADMIN_EMAIL = 'elonmusk241@gmail.com';

export function getLocalVisitorId(): string {
  let id = localStorage.getItem('elon_space_visitor_id');
  if (!id) {
    id = `v_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem('elon_space_visitor_id', id);
  }
  return id;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [anonymousRestricted, setAnonymousRestricted] = useState<boolean>(false);
  const [adminOverride, setAdminOverride] = useState<boolean>(() => {
    return localStorage.getItem('elon_musk_space_admin_mode') === 'true';
  });

  const toggleAdminMode = (enabled: boolean) => {
    setAdminOverride(enabled);
    if (enabled) {
      localStorage.setItem('elon_musk_space_admin_mode', 'true');
    } else {
      localStorage.removeItem('elon_musk_space_admin_mode');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const setupLocalVisitor = async (fallbackId: string) => {
      const storedName = localStorage.getItem('elon_space_visitor_name') || `Explorer-${fallbackId.slice(-4).toUpperCase()}`;
      const storedPhoto = `https://api.dicebear.com/7.x/identicon/svg?seed=${fallbackId}&backgroundColor=151515`;

      const localUser: AppUser = {
        uid: fallbackId,
        displayName: storedName,
        photoURL: storedPhoto,
        email: null,
        isAnonymous: true,
      };

      if (!isMounted) return;
      setUser(localUser);

      const now = new Date().toISOString();
      const localProfile: UserProfile = {
        uid: fallbackId,
        displayName: storedName,
        photoURL: storedPhoto,
        role: 'visitor',
        status: 'active',
        online: true,
        lastSeen: now,
        about: 'Space and cutting-edge technology enthusiast.',
        createdAt: now,
        isAnonymous: true,
      };

      // Attempt to sync to Firestore if possible
      try {
        const userRef = doc(db, 'users', fallbackId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const existing = snap.data() as UserProfile;
          await updateDoc(userRef, { online: true, lastSeen: now });
          setProfile({ ...existing, online: true, lastSeen: now });
        } else {
          await setDoc(userRef, cleanFirestoreData(localProfile), { merge: true });
          setProfile(localProfile);
        }
      } catch (err) {
        setProfile(localProfile);
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const appUser: AppUser = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
          isAnonymous: currentUser.isAnonymous,
        };
        setUser(appUser);
        localStorage.setItem('elon_space_visitor_id', currentUser.uid);

        // Fetch or create profile in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const now = new Date().toISOString();
        try {
          const snap = await getDoc(userRef);
          const isEmailAdmin = currentUser.email ? ADMIN_EMAILS.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase()) : false;

          if (snap.exists()) {
            const existing = snap.data() as UserProfile;
            const updatedRole = isEmailAdmin ? 'admin' : (existing.role || 'visitor');
            await updateDoc(userRef, cleanFirestoreData({ online: true, lastSeen: now, role: updatedRole }));
            setProfile({ ...existing, online: true, lastSeen: now, role: updatedRole });
          } else {
            const initialName = currentUser.displayName || `Explorer-${currentUser.uid.slice(0, 5).toUpperCase()}`;
            const initialPhoto = currentUser.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.uid}&backgroundColor=151515`;

            const newProfile = cleanFirestoreData({
              uid: currentUser.uid,
              displayName: initialName,
              photoURL: initialPhoto,
              email: currentUser.email || null,
              role: isEmailAdmin ? 'admin' : 'visitor',
              status: 'active',
              online: true,
              lastSeen: now,
              about: 'Space and cutting-edge technology enthusiast.',
              createdAt: now,
              isAnonymous: currentUser.isAnonymous,
            });

            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          setProfile({
            uid: currentUser.uid,
            displayName: currentUser.displayName || `Explorer-${currentUser.uid.slice(0, 5).toUpperCase()}`,
            photoURL: currentUser.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.uid}`,
            role: currentUser.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase()) ? 'admin' : 'visitor',
            status: 'active',
            online: true,
            lastSeen: now,
            createdAt: now,
            isAnonymous: currentUser.isAnonymous,
          });
        }
        setLoading(false);
      } else {
        // If already known that anonymous auth is restricted by GCP project policy, initialize local visitor immediately
        if (localStorage.getItem('elon_anonymous_auth_restricted') === 'true') {
          setAnonymousRestricted(true);
          const fallbackId = getLocalVisitorId();
          await setupLocalVisitor(fallbackId);
          return;
        }

        // Otherwise try anonymous sign-in, but handle restriction gracefully without error crashing
        try {
          await signInAnonymously(auth);
        } catch (authError: any) {
          // Firebase project has Anonymous auth disabled in console (auth/admin-restricted-operation)
          // Gracefully remember and initialize persistent visitor session
          localStorage.setItem('elon_anonymous_auth_restricted', 'true');
          setAnonymousRestricted(true);
          const fallbackId = getLocalVisitorId();
          await setupLocalVisitor(fallbackId);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const updateProfileData = async (displayName: string, photoURL?: string, about?: string) => {
    if (!user) return;
    const updates: Partial<UserProfile> = {
      displayName: displayName.trim(),
    };
    if (photoURL) updates.photoURL = photoURL;
    if (about !== undefined) updates.about = about.trim();

    localStorage.setItem('elon_space_visitor_name', displayName.trim());

    // Update state immediately
    setProfile((prev) => prev ? { ...prev, ...updates } : null);
    setUser((prev) => prev ? { ...prev, displayName: displayName.trim(), photoURL: photoURL || prev.photoURL } : null);

    // Sync to Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, cleanFirestoreData(updates), { merge: true });
    } catch (error) {
      console.warn('Could not update remote profile, updated locally:', error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (auth.currentUser) {
        await fbSignOut(auth);
      }
      localStorage.removeItem('elon_space_visitor_id');
      localStorage.removeItem('elon_space_visitor_name');
      const newId = getLocalVisitorId();
      setUser({
        uid: newId,
        displayName: `Explorer-${newId.slice(-4).toUpperCase()}`,
        photoURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${newId}`,
        email: null,
        isAnonymous: true,
      });
      setProfile({
        uid: newId,
        displayName: `Explorer-${newId.slice(-4).toUpperCase()}`,
        photoURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${newId}`,
        role: 'visitor',
        status: 'active',
        createdAt: new Date().toISOString(),
        isAnonymous: true,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isUserEmailAdmin = user?.email 
    ? ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase()) 
    : false;
  const isProfileAdmin = profile?.role === 'admin';
  const isAdmin = isUserEmailAdmin || isProfileAdmin || adminOverride;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        anonymousRestricted,
        updateProfileData,
        signInWithGoogle,
        signOut,
        setAdminOverride: toggleAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
