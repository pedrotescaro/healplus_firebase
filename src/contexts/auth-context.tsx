
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/firebase/client-app";

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUserToUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) {
    return null;
  }
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    photoURL: firebaseUser.photoURL
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      setUser(mapFirebaseUserToUser(firebaseUser));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    await auth.currentUser?.reload();
    setUser(mapFirebaseUserToUser(auth.currentUser));
  };
  
  const login = async (email: string, password: string): Promise<any> => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const signup = async (name: string, email: string, password: string): Promise<any> => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      return userCredential;
  };

  const loginWithGoogle = async (): Promise<any> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
