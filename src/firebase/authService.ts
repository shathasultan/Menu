import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserProfile, Venue } from './types';

export interface SignUpInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

async function ensureMerchantDocs(user: User, extra: { name: string; phone?: string; via: 'email' | 'google' }) {
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: extra.name,
      email: user.email ?? '',
      phone: extra.phone ?? '',
      role: 'merchant',
      via: extra.via,
      createdAt: serverTimestamp(),
    });
  }

  const venueRef = doc(db, 'venues', user.uid);
  const existingVenue = await getDoc(venueRef);
  if (!existingVenue.exists()) {
    await setDoc(venueRef, {
      id: user.uid,
      ownerId: user.uid,
      name: '',
      type: '',
      phone: '',
      address: '',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function signUpMerchant({ name, email, phone, password }: SignUpInput): Promise<void> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await ensureMerchantDocs(cred.user, { name, phone, via: 'email' });
}

export async function signInMerchant(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogleIdToken(idToken: string): Promise<void> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  await ensureMerchantDocs(result.user, {
    name: result.user.displayName ?? 'مستخدم',
    via: 'google',
  });
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid: data.uid,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    via: data.via,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export async function fetchOwnVenue(uid: string): Promise<Venue | null> {
  const snap = await getDoc(doc(db, 'venues', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: data.id,
    ownerId: data.ownerId,
    name: data.name,
    type: data.type,
    phone: data.phone,
    address: data.address,
    status: data.status,
    logoUrl: data.logoUrl,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
  };
}
