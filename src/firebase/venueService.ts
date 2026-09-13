import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
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

// Reads the owner's own products by ID (via venues/{venueId}.productIds)
// instead of a `list` query on the subcollection. Firestore's collection
// group query prover rejects the products `list` rule outright if it has
// ANY condition beyond the single bare `venueApproved == true` check the
// cross-venue search relies on — even a get()-free, path-only check like
// isOwner(venueId) breaks it, so the owner's own view can't share that
// rule. `get`-type reads (individual doc listeners) have no such
// restriction, so this stays fully real-time without needing `list` at all.
export function listenProducts(venueId: string, cb: (products: VenueProduct[]) => void): () => void {
  const productMap = new Map<string, VenueProduct>();
  const productUnsubs = new Map<string, () => void>();
  let disposed = false;

  const emit = () => {
    const list = Array.from(productMap.values());
    list.sort((a, b) => a.order - b.order);
    cb(list);
  };

  const unsubVenue = onSnapshot(doc(db, 'venues', venueId), (venueSnap) => {
    if (disposed) return;
    const ids: string[] = venueSnap.exists() ? venueSnap.data().productIds ?? [] : [];
    const idSet = new Set(ids);

    for (const [id, unsub] of productUnsubs) {
      if (!idSet.has(id)) {
        unsub();
        productUnsubs.delete(id);
        productMap.delete(id);
      }
    }

    for (const id of ids) {
      if (productUnsubs.has(id)) continue;
      const unsub = onSnapshot(doc(db, 'venues', venueId, 'products', id), (prodSnap) => {
        if (disposed) return;
        if (prodSnap.exists()) {
          productMap.set(id, prodSnap.data() as VenueProduct);
        } else {
          productMap.delete(id);
        }
        emit();
      });
      productUnsubs.set(id, unsub);
    }

    emit();
  });

  return () => {
    disposed = true;
    unsubVenue();
    for (const unsub of productUnsubs.values()) unsub();
    productUnsubs.clear();
  };
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
  const venueRef = doc(db, 'venues', venueId);
  const prodRef = doc(collection(db, 'venues', venueId, 'products'));
  let code = '';
  await runTransaction(db, async (tx) => {
    const [catSnap, venueSnap] = await Promise.all([tx.get(catRef), tx.get(venueRef)]);
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
      venueApproved: venueSnap.exists() && venueSnap.data().status === 'approved',
    });
    tx.update(venueRef, { productIds: arrayUnion(prodRef.id), updatedAt: serverTimestamp() });
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

export async function deleteProduct(venueId: string, productId: string): Promise<void> {
  const venueRef = doc(db, 'venues', venueId);
  const prodRef = doc(db, 'venues', venueId, 'products', productId);
  await runTransaction(db, async (tx) => {
    tx.delete(prodRef);
    tx.update(venueRef, { productIds: arrayRemove(productId), updatedAt: serverTimestamp() });
  });
}

export function previewNextCode(category: VenueCategory | undefined): string {
  if (!category) return '—';
  return category.letter + String(category.nextSeq ?? 1).padStart(2, '0');
}
