// bt:ec52ad88d4b0903b
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { DB } from '../types';
import { loadDB, persistDB } from './repo';

interface DataContextValue {
  db: DB | null;
  ready: boolean;
  mutate: (fn: (db: DB) => DB) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadDB().then((loaded) => {
      setDb(loaded);
      setReady(true);
    });
  }, []);

  const mutate = useCallback(async (fn: (db: DB) => DB) => {
    setDb((current) => {
      if (!current) return current;
      const next = fn(current);
      persistDB(next).catch(() => {});
      return next;
    });
  }, []);

  return <DataContext.Provider value={{ db, ready, mutate }}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
