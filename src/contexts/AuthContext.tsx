'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserData, getUserData } from '@/lib/firebase-auth';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ user: User | null; error: string | null }>;
  logOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // 사용자 데이터 가져오기
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { signIn: firebaseSignIn } = await import('@/lib/firebase-auth');
    return firebaseSignIn(email, password);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { signUp: firebaseSignUp } = await import('@/lib/firebase-auth');
    return firebaseSignUp(email, password, displayName);
  };

  const logOut = async () => {
    const { logOut: firebaseLogOut } = await import('@/lib/firebase-auth');
    return firebaseLogOut();
  };

  const resetPassword = async (email: string) => {
    const { resetPassword: firebaseResetPassword } = await import('@/lib/firebase-auth');
    return firebaseResetPassword(email);
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    logOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
