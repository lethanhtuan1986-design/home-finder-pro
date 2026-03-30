import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'xanhstay_saved';
const EVENT_NAME = 'xanhstay_saved_change';

// Shared external store to sync all hook instances
let listeners: Array<() => void> = [];
function emitChange() {
  window.dispatchEvent(new Event(EVENT_NAME));
  listeners.forEach(l => l());
}
function subscribe(listener: () => void) {
  listeners.push(listener);
  const handler = () => listener();
  window.addEventListener(EVENT_NAME, handler);
  return () => {
    listeners = listeners.filter(l => l !== listener);
    window.removeEventListener(EVENT_NAME, handler);
  };
}
function getSnapshot(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

let cachedSnapshot: string[] = getSnapshot();
function getSnapshotCached(): string[] {
  const fresh = getSnapshot();
  if (JSON.stringify(fresh) !== JSON.stringify(cachedSnapshot)) {
    cachedSnapshot = fresh;
  }
  return cachedSnapshot;
}

export const useSavedRooms = () => {
  const savedIds = useSyncExternalStore(subscribe, getSnapshotCached);

  const toggleSave = useCallback((id: string) => {
    const current = getSnapshot();
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    cachedSnapshot = next;
    emitChange();
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { savedIds, toggleSave, isSaved };
};
