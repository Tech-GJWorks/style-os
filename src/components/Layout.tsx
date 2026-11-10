import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Ruler, Palette, GraduationCap, Images, CalendarHeart, CloudSun, Layers, Shirt, Puzzle, ScanFace,
  Store, Watch, Sparkles, Brain, ShoppingBag, NotebookPen, Menu, X, TrendingUp, Search, Database, LayoutGrid,
} from 'lucide-react';
import { useStore } from '../lib/store';

export const nav = [
  { to: '/', label: 'My Style Dashboard', icon: LayoutDashboard },
  { to: '/body', label: 'My Body & Measurements', icon: Ruler },
  { to: '/colour', label: 'My Colour Intelligence', icon: Palette },
  { to: '/academy', label: 'Clothing Education Academy', icon: GraduationCap },
  { to: '/lookbook', label: 'Outfit Lookbook', icon: Images },
  { to: '/outfits', label: 'My Outfit Combinations', icon: LayoutGrid },
  { to: '/occasions', label: 'Occasion-Based Styling', icon: CalendarHeart },
  { to: '/seasons', label: 'Seasonal Wardrobe', icon: CloudSun },
  { to: '/fabrics', label: 'Fabric & Textile Guide', icon: Layers },
  { to: '/wardrobe', label: 'My Wardrobe', icon: Shirt },
  { to: '/builder', label: 'Outfit Combination Builder', icon: Puzzle },
  { to: '/visualize', label: 'Virtual Try-On / Visuals', icon: ScanFace },
  { to: '/brands', label: 'Brand & Shopping Guide', icon: Store },
  { to: '/accessories', label: 'Accessories & Footwear', icon: Watch },
  { to: '/grooming', label: 'Grooming & Fragrance', icon: Sparkles },
  { to: '/psychology', label: 'Style Psychology & Aura', icon: Brain },
  { to: '/shopping', label: 'Wardrobe Shopping Planner', icon: ShoppingBag },
  { to: '/journal', label: 'My Style Journal', icon: NotebookPen },
  { to: '/trends', label: 'Trends & Evolution', icon: TrendingUp },
  { to: '/search', label: 'Fashion Knowledge Search', icon: Search },
  { to: '/data', label: 'Backup & Data', icon: Database },
];

function NavList({ onPick }: { onPick?: () => void }) {
  return (
    <nav className="space-y-0.5">
      {nav.map(({ to, label, icon: I }) => (
        <NavLink key={to} to={to} end={to === '/'} onClick={onPick}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition ${isActive ? 'bg-ivory/15 text-ivory' : 'text-ivory/70 hover:bg-ivory/5 hover:text-ivory'}`}>
          <I className="h-4 w-4 shrink-0" />{label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { persistError } = useStore();
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-ivory text-choc">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto bg-olive-deep px-4 py-6 lg:block">
        <Brand />
        <NavList />
      </aside>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-olive-deep px-4 py-3 lg:hidden">
        <Brand compact />
        <button aria-label="Menu" onClick={() => setOpen(true)} className="text-ivory"><Menu /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-olive-deep px-4 py-6">
            <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-4 top-5 text-ivory"><X /></button>
            <Brand />
            <NavList onPick={() => setOpen(false)} />
          </div>
        </div>
      )}
      <main key={loc.pathname} className="lg:pl-64">
        {persistError && <div className="bg-amber-100 px-6 py-2 text-sm text-amber-900">{persistError}</div>}
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-10 md:py-12">{children}</div>
        <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-choc-soft md:px-10">
          My Style OS · Your wardrobe data lives only in this browser (IndexedDB). Use Backup & Data to move it between devices.
        </footer>
      </main>
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? '' : 'mb-6 px-3'}>
      <div className="font-serif text-2xl font-semibold tracking-wide text-ivory">MY STYLE OS</div>
      {!compact && <div className="text-[11px] uppercase tracking-[0.18em] text-camel-light/80">Personal Fashion Intelligence</div>}
    </div>
  );
}
