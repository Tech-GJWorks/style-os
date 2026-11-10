import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { get, set } from 'idb-keyval';
import type { JournalEntry, Measurements, Ownership, WardrobeItem, WishItem } from '../data/types';
import { latestMeasurements, seedOwned } from '../data/content';

export interface AppState {
  version: 1;
  statuses: Record<string, Ownership>;
  items: WardrobeItem[];
  favourites: string[];
  planned: string[];
  worn: Record<string, string[]>;
  subs: Record<string, Record<string, string>>; // outfitId -> slotKey -> pieceId | item:<id>
  wishlist: WishItem[];
  journal: JournalEntry[];
  measurements: Measurements;
  budget: { monthly: number };
  photos: Record<string, string>; // outfitId -> my own photo (data URL)
  profilePhoto?: string;
  sizeChecks: SizeCheck[];
}

export interface SizeCheck { id: string; brand: string; garment: string; label: string; chest?: number; waist?: number; hip?: number; length?: number; verdict?: string; date: string }

const KEY = 'style-os-v1';

export const initialState = (): AppState => ({
  version: 1,
  statuses: Object.fromEntries(seedOwned.map((p) => [p, 'OWNED' as Ownership])),
  items: [],
  favourites: [],
  planned: [],
  worn: {},
  subs: {},
  wishlist: [],
  journal: [],
  measurements: { ...latestMeasurements },
  budget: { monthly: 10000 },
  photos: {},
  sizeChecks: [],
});

interface Ctx {
  state: AppState;
  ready: boolean;
  persistError: string | null;
  update: (fn: (s: AppState) => AppState) => void;
  replace: (s: AppState) => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const [persistError, setPersistError] = useState<string | null>(null);
  const timer = useRef<number>();

  useEffect(() => {
    get<AppState>(KEY)
      .then((saved) => { if (saved && saved.version === 1) setState({ ...initialState(), ...saved }); })
      .catch(() => setPersistError('Browser storage is unavailable (private window?). Changes will not survive a refresh.'))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      set(KEY, state).then(() => setPersistError(null)).catch(() => setPersistError('Could not save to browser storage.'));
    }, 250);
  }, [state, ready]);

  const value = useMemo<Ctx>(() => ({ state, ready, persistError, update: (fn) => setState((s) => fn(s)), replace: (s) => setState(s) }), [state, ready, persistError]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Resize an uploaded image to keep IndexedDB small. */
export function compressImage(file: File, max = 900, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Not an image'));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function download(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
