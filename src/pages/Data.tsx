import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { useStore, download, initialState, type AppState } from '../lib/store';
import { Card, Note, PageHeader, Section, btn, btnGhost } from '../components/ui';

export function DataPage() {
  const { state, replace } = useStore();
  const ref = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const stamp = new Date().toISOString().slice(0, 10);
  const size = Math.round(JSON.stringify(state).length / 1024);
  const restore = async (file?: File) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const incoming: Partial<AppState> = data.state ?? data;
      if (!Array.isArray(incoming.items) && !incoming.statuses) throw new Error('Not a Style OS backup');
      if (!confirm('Replace ALL current data in this browser with the backup? This cannot be undone.')) return;
      replace({ ...initialState(), ...incoming, version: 1 });
      setMsg(`Restored ${incoming.items?.length ?? 0} items from ${file.name}.`);
    } catch (e) { setMsg(`Import failed: ${(e as Error).message}`); }
  };
  return (
    <div>
      <PageHeader eyebrow="Your data, your browser" title="Backup & Data">All wardrobe data (items, photos, ownership, wishlist, journal, measurements) is stored in this browser's IndexedDB. GitHub Pages is a static host: nothing syncs between your phone and laptop automatically.</PageHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><div className="text-xs uppercase text-choc-soft">Stored now</div><div className="font-serif text-3xl">{size} KB</div><div className="text-xs text-choc-soft">{state.items.length} items · {Object.keys(state.statuses).length} statuses · {state.wishlist.length} wishlist · {state.journal.length} journal · {Object.keys(state.photos).length} photos</div></Card>
        <Card><div className="font-medium">Export full backup</div><p className="mb-3 text-xs text-choc-soft">Everything, including photos, as one JSON file.</p><button className={btn} onClick={() => download(`style-os-backup-${stamp}.json`, JSON.stringify({ app: 'my-style-os', exported: new Date().toISOString(), state }, null, 1))}><Download className="h-4 w-4" /> Export backup</button></Card>
        <Card><div className="font-medium">Restore / import</div><p className="mb-3 text-xs text-choc-soft">Replaces current data after a confirmation.</p><button className={btnGhost} onClick={() => ref.current?.click()}><Upload className="h-4 w-4" /> Import JSON</button><input ref={ref} type="file" accept="application/json" className="hidden" onChange={(e) => restore(e.target.files?.[0])} /></Card>
      </div>
      {msg && <div className="mt-4"><Note>{msg}</Note></div>}
      <Section title="Partial exports">
        <div className="flex flex-wrap gap-3">
          <button className={btnGhost} onClick={() => download(`wardrobe-${stamp}.json`, JSON.stringify({ items: state.items, statuses: state.statuses }, null, 1))}><Download className="h-4 w-4" /> Wardrobe only</button>
          <button className={btnGhost} onClick={() => download(`shopping-${stamp}.json`, JSON.stringify(state.wishlist, null, 1))}><Download className="h-4 w-4" /> Shopping list</button>
        </div>
      </Section>
      <Section title="Reset">
        <button className={btnGhost} onClick={() => { if (confirm('Erase ALL Style OS data in this browser and start fresh? Export a backup first. This cannot be undone.') && confirm('Really erase everything?')) { replace(initialState()); setMsg('Reset to defaults.'); } }}><RotateCcw className="h-4 w-4" /> Reset to defaults</button>
      </Section>
      <Section title="Moving between devices / future cloud sync">
        <Card className="text-sm text-choc-soft">Export on one device and import on the other. The app keeps all state in one versioned object behind a single storage module (<code>src/lib/store.tsx</code>), so a cloud backend (Supabase, Firebase, a GitHub Gist) can replace IndexedDB later without touching the pages.</Card>
      </Section>
    </div>
  );
}
