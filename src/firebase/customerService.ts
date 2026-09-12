import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './config';
import type { Venue, VenueCategory, VenueProduct } from './types';

function toVenue(id: string, data: any): Venue {
  return {
    id,
    ownerId: data.ownerId,
    name: data.name,
    type: data.type,
    phone: data.phone,
    address: data.address,
    status: data.status,
    logoUrl: data.logoUrl,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  };
}

export function listenApprovedVenues(cb: (venues: Venue[]) => void): () => void {
  const q = query(collection(db, 'venues'), where('status', '==', 'approved'));
  return onSnapshot(q, (snap) => {
    const venues = snap.docs.map((d) => toVenue(d.id, d.data()));
    venues.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));
    cb(venues);
  });
}

export async function getApprovedVenue(venueId: string): Promise<Venue | null> {
  const snap = await getDoc(doc(db, 'venues', venueId));
  if (!snap.exists() || snap.data().status !== 'approved') return null;
  return toVenue(snap.id, snap.data());
}

export function listenVenueCategories(venueId: string, cb: (cats: VenueCategory[]) => void): () => void {
  return onSnapshot(collection(db, 'venues', venueId, 'categories'), (snap) => {
    const cats = snap.docs.map((d) => d.data() as VenueCategory);
    cats.sort((a, b) => a.order - b.order);
    cb(cats);
  });
}

export function listenVenueProducts(venueId: string, cb: (products: VenueProduct[]) => void): () => void {
  return onSnapshot(collection(db, 'venues', venueId, 'products'), (snap) => {
    const products = snap.docs.map((d) => d.data() as VenueProduct);
    products.sort((a, b) => a.order - b.order);
    cb(products);
  });
}
