import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import type { Venue, VenueStatus } from './types';

export async function fetchMerchantEmail(ownerId: string): Promise<string> {
  const snap = await getDoc(doc(db, 'users', ownerId));
  return snap.exists() ? (snap.data().email as string) : '';
}

export function listenVenuesByStatus(status: VenueStatus, cb: (venues: Venue[]) => void): () => void {
  // Sorted client-side (not via orderBy) to avoid needing a composite Firestore index.
  const q = query(collection(db, 'venues'), where('status', '==', status));
  return onSnapshot(q, (snap) => {
    const venues = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: data.id,
        ownerId: data.ownerId,
        name: data.name,
        type: data.type,
        phone: data.phone,
        address: data.address,
        status: data.status,
        logoUrl: data.logoUrl,
        productIds: data.productIds ?? [],
        createdAt: data.createdAt?.toMillis?.() ?? 0,
        updatedAt: data.updatedAt?.toMillis?.() ?? 0,
      } as Venue;
    });
    venues.sort((a, b) => b.createdAt - a.createdAt);
    cb(venues);
  });
}

export async function setVenueStatus(venueId: string, status: VenueStatus): Promise<void> {
  // Keep every product's denormalized `venueApproved` flag in sync with the
  // venue's own status in one atomic batch, so the cross-venue search index
  // (collectionGroup query) never observes a venue and its products
  // disagreeing about approval. Targets each product by direct path (via
  // the venue doc's own productIds) rather than listing the subcollection —
  // admin isn't the owner, and the products `list` rule intentionally
  // excludes admin (see firestore.rules) to keep the search query provable.
  const venueRef = doc(db, 'venues', venueId);
  const venueSnap = await getDoc(venueRef);
  const productIds: string[] = venueSnap.exists() ? venueSnap.data().productIds ?? [] : [];

  const batch = writeBatch(db);
  batch.update(venueRef, { status, updatedAt: serverTimestamp() });
  productIds.forEach((id) => {
    batch.update(doc(db, 'venues', venueId, 'products', id), { venueApproved: status === 'approved' });
  });
  await batch.commit();
}
