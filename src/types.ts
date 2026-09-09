// bt:ec52ad88d4b0903b
export interface Category {
  id: string;
  code: string;
  name: string;
  nextSeq: number;
}

export interface Product {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  order: number;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  type: string;
  status: 'open' | 'closed';
  location: string;
  hours: string;
  contact: string;
  hue: number;
  description: string;
  categories: Category[];
  products: Product[];
}

export interface DB {
  restaurants: Restaurant[];
  favorites: string[];
}
