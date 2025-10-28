/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";

import { User } from "@/types";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("Uder data not found");
      }

      const userData = userDoc.data() as User;

      await updateDoc(doc(db, "users", firebaseUser.uid), {
        status: "online",
        lastSeen: Date.now(),
      });

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: name,
      });

      const userData: User = {
        id: firebaseUser.uid,
        name,
        email,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        status: "offline",
        lastSeen: Date.now(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async logout(): Promise<void> {
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          status: "offline",
          lastSeen: Date.now(),
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
