import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { useStore } from '../lib/store';

export const primary = [
  { to: '/', label: 'Catalogue' },
  { to: '/outfits', label: 'Looks' },
  { to: '/lookbook', label: 'Collections' },
  { to: '/occasions', label: 'Occasions' },
  { to: '/wardrobe', label: 'Wardrobe' },
  { to: '/builder', label: 'Builder' },
];

export const more: { group: string; links: { to: string; label: string }[] }[] = [
  { group: 'You', links: [{ to: '/dashboard', label: 'Style Dashboard' }, { to: '/body', label: 'Body & Measurements' }, { to: '/colour', label: 'Colour Intelligence' }, { to: '/psychology', label: 'Style Psychology' }, { to: '/journal', label: 'Style Journal' }] },
  { group: 'Learn', links: [{ to: '/academy', label: 'Style Academy' }, { to: '/fabrics', label: 'Fabrics & Care' }, { to: '/seasons', label: 'Seasonal Wardrobe' }, { to: '/accessories', label: 'Accessories & Footwear' }, { to: '/grooming', label: 'Grooming & Fragrance' }, { to: '/trends', label: 'Trends' }] },
  { group: 'Shop & tools', links: [{ to: '/shopping', label: 'Shopping Planner' }, { to: '/brands', label: 'Brand Guide' }, { to: '/visualize', label: 'Image Library' }, { to: '/search', label: 'Search' }, { to: '/data', label: 'Backup & Data' }] },
];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { persistError } = useStore();
  const loc = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); setMoreOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMoreOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const link = ({ isActive }: { isActive: boolean }) => `relative py-1 text-[12px] uppercase tracking-[0.18em] transition ${isActive ? 'text-choc after:absolute after:inset-x-0 after:-bottom-[21px] after:h-px after:bg-choc' : 'text-choc-soft hover:text-choc'}`;
  return (
    <div className="min-h-screen bg-ivory text-choc">
      <header className="sticky top-0 z-40 border-b border-camel-light/70 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 md:px-10">
          <NavLink to="/" className="shrink-0">
            <div className="font-serif text-[26px] font-semibold leading-none tracking-[0.06em]">STYLE OS</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.32em] text-choc-soft">The personal catalogue</div>
          </NavLink>
          <nav className="hidden items-center gap-8 lg:flex">
            {primary.map((p) => <NavLink key={p.to} to={p.to} end={p.to === '/'} className={link}>{p.label}</NavLink>)}
            <div ref={ref} className="relative">
              <button onClick={() => setMoreOpen((v) => !v)} className="flex items-center gap-1 text-[12px] uppercase tracking-[0.18em] text-choc-soft hover:text-choc">More <ChevronDown className="h-3.5 w-3.5" /></button>
              {moreOpen && (
                <div className="absolute right-0 top-9 grid w-[560px] grid-cols-3 gap-6 border border-camel-light bg-paper p-6 shadow-xl">
                  {more.map((g) => (
                    <div key={g.group}>
                      <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-olive">{g.group}</div>
                      {g.links.map((l) => <NavLink key={l.to} to={l.to} className="block py-1 text-sm text-choc hover:text-rust">{l.label}</NavLink>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <NavLink to="/search" aria-label="Search" className="text-choc-soft hover:text-choc"><Search className="h-4 w-4" /></NavLink>
          </nav>
          <button aria-label="Menu" onClick={() => setOpen(true)} className="lg:hidden"><Menu /></button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-80 overflow-y-auto bg-ivory px-6 py-6">
            <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-5 top-5"><X /></button>
            <div className="mt-10 space-y-3">{primary.map((p) => <NavLink key={p.to} to={p.to} end={p.to === '/'} className="block font-serif text-2xl">{p.label}</NavLink>)}</div>
            {more.map((g) => (
              <div key={g.group} className="mt-8">
                <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-olive">{g.group}</div>
                {g.links.map((l) => <NavLink key={l.to} to={l.to} className="block py-1.5 text-sm">{l.label}</NavLink>)}
              </div>
            ))}
          </div>
        </div>
      )}
      <main>
        {persistError && <div className="bg-amber-100 px-6 py-2 text-sm text-amber-900">{persistError}</div>}
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">{children}</div>
      </main>
      <footer className="border-t border-camel-light/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-[11px] uppercase tracking-[0.18em] text-choc-soft md:px-10">
          <span>Style OS · Warm Deep Autumn · Bengaluru</span>
          <span className="normal-case tracking-normal">Wardrobe data stays in this browser. Use Backup &amp; Data to move it between devices.</span>
        </div>
      </footer>
    </div>
  );
}
