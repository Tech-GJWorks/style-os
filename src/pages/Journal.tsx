import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useStore, uid } from '../lib/store';
import { outfits, outfitById } from '../data/outfits';
import type { JournalEntry } from '../data/types';
import { Card, Field, PageHeader, btn, inputCls, Note } from '../components/ui';

export function Journal() {
  const { state, update } = useStore();
  const [f, setF] = useState<JournalEntry>({ id: uid(), date: new Date().toISOString().slice(0, 10), feeling: 4, notes: '' });
  const save = () => { update((s) => ({ ...s, journal: [...s.journal, f] })); setF({ id: uid(), date: f.date, feeling: 4, notes: '' }); };
  const entries = [...state.journal].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <PageHeader eyebrow="Reflection builds taste" title="My Style Journal">Log what you wore, where, and how it felt. After a few weeks the patterns show: which outfits made you feel confident, which drew compliments, which you never reach for.</PageHeader>
      <Card className="mb-8">
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Date"><input type="date" className={inputCls} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Outfit"><select className={inputCls} value={f.outfitId ?? ''} onChange={(e) => setF({ ...f, outfitId: e.target.value || undefined })}><option value="">My own combination</option>{outfits.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.name}</option>)}</select></Field>
          <Field label="Occasion"><input className={inputCls} value={f.occasion ?? ''} onChange={(e) => setF({ ...f, occasion: e.target.value })} /></Field>
          <Field label={`How did I feel? (${f.feeling}/5)`}><input type="range" min={1} max={5} value={f.feeling} onChange={(e) => setF({ ...f, feeling: Number(e.target.value) })} className="w-full" /></Field>
          <div className="sm:col-span-4"><Field label="Notes: what worked, what didn't, compliments, fit issues"><textarea rows={3} className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field></div>
        </div>
        <button className={`${btn} mt-3`} disabled={!f.notes && !f.outfitId} onClick={save}>Add entry</button>
      </Card>
      {!entries.length && <Note>No entries yet. "Log as worn" in the Builder also adds entries here.</Note>}
      <div className="space-y-3">
        {entries.map((e) => (
          <Card key={e.id} className="flex gap-4">
            <div className="w-24 shrink-0 text-sm"><div className="font-serif text-lg">{e.date}</div><div className="text-rust">{'★'.repeat(e.feeling)}<span className="text-camel-light">{'★'.repeat(5 - e.feeling)}</span></div></div>
            <div className="flex-1 text-sm">{e.outfitId && <div className="font-medium">{outfitById[e.outfitId]?.name}</div>}{e.occasion && <div className="text-xs text-choc-soft">{e.occasion}</div>}<p className="mt-1 whitespace-pre-wrap">{e.notes}</p></div>
            <button aria-label="Delete" onClick={() => confirm('Delete this entry?') && update((s) => ({ ...s, journal: s.journal.filter((x) => x.id !== e.id) }))}><Trash2 className="h-4 w-4 text-choc-soft" /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}
