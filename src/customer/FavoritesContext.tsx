import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'menu-app-favorites-v1';

export interface FavoriteItem {
  key: string; // `${venueId}|${code}`
  venueId: string;
  venueName: string;
  productId: string;
  code: string;
  nameAr: string;
  price: number;
}

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isFavorite: (key: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setFavorites(JSON.parse(raw));
      })
      .catch(() => {});
  }, []);

  const persist = useCallback((next: FavoriteItem[]) => {
    setFavorites(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const isFavorite = useCallback((key: string) => favorites.some((f) => f.key === key), [favorites]);

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      const exists = favorites.some((f) => f.key === item.key);
      persist(exists ? favorites.filter((f) => f.key !== item.key) : [...favorites, item]);
    },
    [favorites, persist]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
