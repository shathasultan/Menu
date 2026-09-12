import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

export function setVenueStatus(venueId: string, status: VenueStatus): Promise<void> {
  return updateDoc(doc(db, 'venues', venueId), { status, updatedAt: serverTimestamp() });
}
