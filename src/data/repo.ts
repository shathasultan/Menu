// bt:ec52ad88d4b0903b
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, DB, Product, Restaurant } from '../types';
import { seedDB } from './seed';

const STORAGE_KEY = 'menyu-app-v1';

function uid(prefix: string): string {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

export async function loadDB(): Promise<DB> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    // fall through to seed
  }
  return seedDB();
}

export async function persistDB(db: DB): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function getRestaurant(db: DB, slug: string): Restaurant | undefined {
  return db.restaurants.find((r) => r.slug === slug);
}

export function getRestaurantById(db: DB, id: string): Restaurant | undefined {
  return db.restaurants.find((r) => r.id === id);
}

export function updateRestaurant(db: DB, id: string, patch: Partial<Restaurant>): DB {
  const restaurants = db.restaurants.map((r) => (r.id === id ? { ...r, ...patch } : r));
  return { ...db, restaurants };
}

export function addCategory(db: DB, restId: string, name: string): DB {
  const restaurants = db.restaurants.map((r) => {
    if (r.id !== restId) return r;
    const code = String.fromCharCode(65 + r.categories.length);
    const cat: Category = { id: uid('c'), code, name, nextSeq: 1 };
    return { ...r, categories: [...r.categories, cat] };
  });
  return { ...db, restaurants };
}

export function addProduct(
  db: DB,
  restId: string,
  data: { categoryId: string; name: string; price: number; description: string }
): DB {
  const restaurants = db.restaurants.map((r) => {
    if (r.id !== restId) return r;
    const cat = r.categories.find((c) => c.id === data.categoryId) ?? r.categories[0];
    if (!cat) return r;
    const seq = cat.nextSeq;
    const inCat = r.products.filter((p) => p.categoryId === cat.id);
    const maxOrder = inCat.reduce((m, p) => Math.max(m, p.order || 0), 0);
    const product: Product = {
      id: uid('p'),
      categoryId: cat.id,
      code: cat.code + pad2(seq),
      name: data.name,
      price: data.price,
      description: data.description,
      available: true,
      order: maxOrder + 1,
    };
    const categories = r.categories.map((c) =>
      c.id === cat.id ? { ...c, nextSeq: c.nextSeq + 1 } : c
    );
    return { ...r, categories, products: [...r.products, product] };
  });
  return { ...db, restaurants };
}

export function updateProduct(
  db: DB,
  restId: string,
  prodId: string,
  patch: Partial<Product>
): DB {
  const restaurants = db.restaurants.map((r) => {
    if (r.id !== restId) return r;
    const products = r.products.map((p) => (p.id === prodId ? { ...p, ...patch } : p));
    return { ...r, products };
  });
  return { ...db, restaurants };
}

export function deleteProduct(db: DB, restId: string, prodId: string): DB {
  const restaurants = db.restaurants.map((r) => {
    if (r.id !== restId) return r;
    return { ...r, products: r.products.filter((p) => p.id !== prodId) };
  });
  return { ...db, restaurants };
}

export function reorderProduct(db: DB, restId: string, prodId: string, dir: 1 | -1): DB {
  const restaurants = db.restaurants.map((r) => {
    if (r.id !== restId) return r;
    const p = r.products.find((x) => x.id === prodId);
    if (!p) return r;
    const siblings = r.products
      .filter((x) => x.categoryId === p.categoryId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.indexOf(p);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= siblings.length) return r;
    const other = siblings[swapIdx];
    const products = r.products.map((x) => {
      if (x.id === p.id) return { ...x, order: other.order };
      if (x.id === other.id) return { ...x, order: p.order };
      return x;
    });
    return { ...r, products };
  });
  return { ...db, restaurants };
}

export function createRestaurant(
  db: DB,
  data: { name: string; type: string; tagline: string }
): { db: DB; restaurant: Restaurant } {
  const slugBase = data.name.trim().toLowerCase().replace(/\s+/g, '-') || uid('r');
  const restaurant: Restaurant = {
    id: uid('r'),
    slug: slugBase + '-' + Math.random().toString(36).slice(2, 6),
    name: data.name,
    tagline: data.tagline,
    type: data.type || 'مشروع طعام',
    status: 'open',
    location: '',
    hours: '',
    contact: '',
    hue: Math.floor(Math.random() * 360),
    description: '',
    categories: [],
    products: [],
  };
  return { db: { ...db, restaurants: [...db.restaurants, restaurant] }, restaurant };
}

export interface SearchResult {
  restaurants: Restaurant[];
  products: { product: Product; restaurant: Restaurant; category: Category | undefined }[];
}

export function searchAll(db: DB, query: string): SearchResult {
  const q = query.trim().toLowerCase();
  const restaurants = q
    ? db.restaurants.filter(
        (r) => r.name.toLowerCase().includes(q) || r.tagline.toLowerCase().includes(q)
      )
    : [];
  const products: SearchResult['products'] = [];
  if (q) {
    db.restaurants.forEach((r) => {
      r.products.forEach((p) => {
        const cat = r.categories.find((c) => c.id === p.categoryId);
        const hay = (p.code + ' ' + p.name + ' ' + (cat?.name ?? '')).toLowerCase();
        if (hay.includes(q)) products.push({ product: p, restaurant: r, category: cat });
      });
    });
  }
  return { restaurants, products };
}

export function toggleFavorite(db: DB, productId: string): DB {
  const has = db.favorites.includes(productId);
  const favorites = has
    ? db.favorites.filter((id) => id !== productId)
    : [...db.favorites, productId];
  return { ...db, favorites };
}

export function isFavorite(db: DB, productId: string): boolean {
  return db.favorites.includes(productId);
}

export function listFavorites(db: DB): { product: Product; restaurant: Restaurant }[] {
  const out: { product: Product; restaurant: Restaurant }[] = [];
  db.restaurants.forEach((r) => {
    r.products.forEach((p) => {
      if (db.favorites.includes(p.id)) out.push({ product: p, restaurant: r });
    });
  });
  return out;
}
