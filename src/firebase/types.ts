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
}
