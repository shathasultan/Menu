import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './config';
import { fetchUserProfile, fetchOwnVenue } from './authService';
import type { UserProfile, Venue } from './types';

interface AuthContextValue {
  firebaseUser: User | null;
  profile: UserProfile | null;
  venue: Venue | null;
  loading: boolean;
  refreshVenue: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const [userProfile, ownVenue] = await Promise.all([
          fetchUserProfile(user.uid),
          fetchOwnVenue(user.uid),
        ]);
        setProfile(userProfile);
        setVenue(ownVenue);
      } else {
        setProfile(null);
        setVenue(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refreshVenue = async () => {
    if (!firebaseUser) return;
    setVenue(await fetchOwnVenue(firebaseUser.uid));
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, venue, loading, refreshVenue }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
