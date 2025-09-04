'use client';

import { AuthProvider as FirebaseAuthProvider } from '@/contexts/AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <FirebaseAuthProvider>
      {children}
    </FirebaseAuthProvider>
  );
};
