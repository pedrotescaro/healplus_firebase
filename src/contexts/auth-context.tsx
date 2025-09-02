
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
  OAuthProvider,
  signInWithPopup,
  UserCredential
} from "firebase/auth";
import { auth, db } from "@/firebase/client-app";
import { doc, setDoc, getDoc } from "firebase/firestore";

type UserRole = 'professional' | 'patient';

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  role: UserRole | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithMicrosoft: () => Promise<UserCredential>;
  refreshUser: () => Promise<void>;
  setUserRoleAndRefresh: (firebaseUser: FirebaseUser, role: UserRole) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUserToUser = async (firebaseUser: FirebaseUser | null): Promise<User | null> => {
  if (!firebaseUser) {
    return null;
  }
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);
  const role = userDoc.exists() ? userDoc.data().role : null; 

  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    photoURL: firebaseUser.photoURL,
    role: role
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      const appUser = await mapFirebaseUserToUser(firebaseUser);
      setUser(appUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
      const appUser = await mapFirebaseUserToUser(currentUser);
      setUser(appUser);
    }
  };
  
  const setUserRoleAndRefresh = async (firebaseUser: FirebaseUser, role: UserRole) => {
    if (firebaseUser) {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      // Ensure other user data is also present when setting the role
      await setDoc(userDocRef, { 
        role: role,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      }, { merge: true });
      await refreshUser();
    } else {
        throw new Error("No authenticated user found to set role.");
    }
  };

  const handleAuthSuccess = async (userCredential: UserCredential) => {
    const firebaseUser = userCredential.user;
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: null // Set role to null initially, will be set via disclaimer
      }, { merge: true });
    }
     await refreshUser();
     return userCredential;
  };
  
  const login = async (email: string, password: string): Promise<UserCredential> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return handleAuthSuccess(userCredential);
  };
  
  const signup = async (name: string, email: string, password: string): Promise<any> => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const successCredential = await handleAuthSuccess(userCredential);
      await sendEmailVerification(userCredential.user);
      return successCredential;
  };

  const loginWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return handleAuthSuccess(userCredential);
  };
  
  const loginWithMicrosoft = async (): Promise<UserCredential> => {
    const provider = new OAuthProvider('microsoft.com');
    const userCredential = await signInWithPopup(auth, provider);
    return handleAuthSuccess(userCredential);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle, loginWithMicrosoft, refreshUser, setUserRoleAndRefresh }}>
      {children}
    </AuthContext.Provider>
  );
}
