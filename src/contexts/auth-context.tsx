
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { 
  getAuth, 
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
import { app } from "@/firebase/client-app";

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  };
  
  const signup = async (name: string, email: string, password: string): Promise<any> => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      // Keep user logged in after sign up
      return userCredential;
  };

  const loginWithGoogle = async (): Promise<any> => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
