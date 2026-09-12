export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'merchant' | 'admin';
  via: 'email' | 'google';
  createdAt: number;
}

export type VenueStatus = 'pending' | 'approved' | 'rejected';

export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  phone: string;
  address: string;
  status: VenueStatus;
  logoUrl?: string;
  createdAt: number;
  updatedAt: number;
  /** IDs of every product under this venue, kept in sync by addProduct/
   *  deleteProduct. Lets admin batch-update products by direct path
   *  (setVenueStatus) without ever needing to list the subcollection —
   *  a scoped list would work, but keeping this the one path avoids two
   *  divergent code paths and doubles as the product-count stat. */
  productIds: string[];
}

export interface VenueCategory {
  id: string;
  letter: string;
  name: string;
  nextSeq: number;
  order: number;
}

export interface VenueProduct {
  id: string;
  categoryId: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  price: number;
  available: boolean;
  photoUrl?: string;
  order: number;
  /** Denormalized copy of the parent venue's `status === 'approved'`, kept
   *  in sync by adminService.setVenueStatus — lets a cross-venue search
   *  query be provably scoped to approved venues only. */
  venueApproved: boolean;
}
