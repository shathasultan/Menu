import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import type { Venue, VenueStatus } from './types';

export function listenTotalProductCount(cb: (count: number) => void): () => void {
  return onSnapshot(collectionGroup(db, 'products'), (snap) => cb(snap.size));
}

export function listenVenueProductCount(venueId: string, cb: (count: number) => void): () => void {
  return onSnapshot(collection(db, 'venues', venueId, 'products'), (snap) => cb(snap.size));
}

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
  // disagreeing about approval.
  const productsSnap = await getDocs(collection(db, 'venues', venueId, 'products'));
  const batch = writeBatch(db);
  batch.update(doc(db, 'venues', venueId), { status, updatedAt: serverTimestamp() });
  productsSnap.docs.forEach((d) => {
    batch.update(d.ref, { venueApproved: status === 'approved' });
  });
  await batch.commit();
}
