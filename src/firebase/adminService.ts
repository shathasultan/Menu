import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './config';
import type { Venue, VenueStatus } from './types';

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
