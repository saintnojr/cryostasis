'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
  type AuthError,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { upsertUser } from '@/lib/firestoreService';

/* ─── Types ─────────────────────────────────────────────────────────────────── */
export interface AuthState {
  user:        User | null;
  loading:     boolean;
  error:       string | null;
}

interface AuthContextValue extends AuthState {
  signIn:         (email: string, password: string) => Promise<void>;
  signUp:         (email: string, password: string, displayName?: string) => Promise<void>;
  signInGoogle:   () => Promise<void>;
  logout:         () => Promise<void>;
  clearError:     () => void;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function parseAuthError(err: AuthError): string {
  switch (err.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/** Syncs a Firebase user to Firestore `users` collection */
async function syncUserToFirestore(user: User, provider: 'email' | 'google'): Promise<void> {
  try {
    await upsertUser({
      uid:         user.uid,
      email:       user.email ?? '',
      displayName: user.displayName ?? user.email?.split('@')[0] ?? 'User',
      photoURL:    user.photoURL,
      provider,
    });
  } catch {
    // Non-critical: don't block auth flow on Firestore write failure
    console.warn('Failed to sync user to Firestore');
  }
}

/* ─── Context ────────────────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      await syncUserToFirestore(firebaseUser, 'email');
    } catch (err) {
      setError(parseAuthError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setError(null);
    setLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }
      await syncUserToFirestore(firebaseUser, 'email');
    } catch (err) {
      setError(parseAuthError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }, []);

  const signInGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
      await syncUserToFirestore(firebaseUser, 'google');
    } catch (err) {
      setError(parseAuthError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(parseAuthError(err as AuthError));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signInGoogle, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
