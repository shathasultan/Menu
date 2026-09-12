import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { Venue, VenueCategory, VenueProduct } from './types';

export function updateVenueInfo(
  venueId: string,
  patch: Partial<Pick<Venue, 'name' | 'type' | 'phone' | 'address'>>
): Promise<void> {
  return updateDoc(doc(db, 'venues', venueId), { ...patch, updatedAt: serverTimestamp() });
}

export function listenCategories(venueId: string, cb: (cats: VenueCategory[]) => void): () => void {
  const q = query(collection(db, 'venues', venueId, 'categories'), orderBy('order'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as VenueCategory)));
}

export function listenProducts(venueId: string, cb: (products: VenueProduct[]) => void): () => void {
  const q = query(collection(db, 'venues', venueId, 'products'), orderBy('order'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as VenueProduct)));
}

export async function addCategory(venueId: string, name: string): Promise<void> {
  const catsSnap = await getDocs(collection(db, 'venues', venueId, 'categories'));
  const usedLetters = new Set(catsSnap.docs.map((d) => d.data().letter as string));
  let letter = 'A';
  for (let i = 0; i < 26; i++) {
    const candidate = String.fromCharCode(65 + i);
    if (!usedLetters.has(candidate)) {
      letter = candidate;
      break;
    }
  }
  const ref = doc(collection(db, 'venues', venueId, 'categories'));
  await setDoc(ref, {
    id: ref.id,
    letter,
    name,
    nextSeq: 1,
    order: catsSnap.size,
  });
}

export interface AddProductInput {
  categoryId: string;
  nameAr: string;
  nameEn: string;
  price: number;
}

export async function addProduct(venueId: string, input: AddProductInput): Promise<string> {
  const catRef = doc(db, 'venues', venueId, 'categories', input.categoryId);
  const prodRef = doc(collection(db, 'venues', venueId, 'products'));
  let code = '';
  await runTransaction(db, async (tx) => {
    const catSnap = await tx.get(catRef);
    if (!catSnap.exists()) throw new Error('التصنيف غير موجود');
    const cat = catSnap.data() as VenueCategory;
    const seq = cat.nextSeq ?? 1;
    code = cat.letter + String(seq).padStart(2, '0');
    tx.update(catRef, { nextSeq: seq + 1 });
    tx.set(prodRef, {
      id: prodRef.id,
      categoryId: input.categoryId,
      code,
      nameAr: input.nameAr,
      nameEn: input.nameEn,
      price: input.price,
      available: true,
      order: Date.now(),
    });
  });
  return code;
}

export function updateProduct(
  venueId: string,
  productId: string,
  patch: Partial<Pick<VenueProduct, 'nameAr' | 'nameEn' | 'price' | 'available' | 'categoryId' | 'order'>>
): Promise<void> {
  return updateDoc(doc(db, 'venues', venueId, 'products', productId), patch);
}

export function deleteProduct(venueId: string, productId: string): Promise<void> {
  return deleteDoc(doc(db, 'venues', venueId, 'products', productId));
}

export function previewNextCode(category: VenueCategory | undefined): string {
  if (!category) return '—';
  return category.letter + String(category.nextSeq ?? 1).padStart(2, '0');
}
