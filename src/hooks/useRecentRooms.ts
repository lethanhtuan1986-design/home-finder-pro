import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'xanhstay_recent';
const MAX_RECENT = 10;

export const useRecentRooms = () => {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentIds(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((i) => i !== id);
      const next = [id, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentIds, addRecent };
};
