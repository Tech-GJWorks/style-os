import type { ReactNode } from 'react';
import { Check, AlertTriangle, XCircle } from 'lucide-react';
import type { Ownership } from '../data/types';
import { colourById } from '../data/colours';

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 border-b border-camel-light pb-6">
      {eyebrow && <p className="text-[10px] uppercase tracking-[0.3em] text-olive">{eyebrow}</p>}
      <h1 className="mt-1 font-serif text-5xl text-choc md:text-6xl">{title}</h1>
      {children && <div className="mt-3 max-w-3xl text-[15px] leading-relaxed text-choc-soft">{children}</div>}
    </header>
  );
}

export function Section({ title, sub, children, id }: { title: string; sub?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="mb-12">
      <h2 className="font-serif text-3xl text-choc">{title}</h2>
      {sub && <p className="mt-1 max-w-3xl text-sm text-choc-soft">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border border-camel-light/70 bg-paper p-5 ${className}`}>{children}</div>;
}

export function Badge({ children, tone = 'sand' }: { children: ReactNode; tone?: 'sand' | 'olive' | 'rust' | 'teal' | 'grey' | 'amber' | 'green' | 'red' }) {
  const t = {
    sand: 'bg-sand text-choc', olive: 'bg-olive/10 text-olive-deep', rust: 'bg-rust/10 text-rust', teal: 'bg-teal/10 text-teal',
    grey: 'bg-stone-200 text-stone-600', amber: 'bg-amber-100 text-amber-800', green: 'bg-emerald-100 text-emerald-800', red: 'bg-red-100 text-red-800',
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${t}`}>{children}</span>;
}

export function Swatch({ id, hex, size = 'md', label }: { id?: string; hex?: string; size?: 'sm' | 'md' | 'lg'; label?: boolean }) {
  const c = id ? colourById[id] : undefined;
  const s = { sm: 'h-4 w-4', md: 'h-7 w-7', lg: 'h-14 w-14' }[size];
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`${s} inline-block shrink-0 rounded-full border border-black/10`} style={{ background: hex ?? c?.hex }} title={c?.name} />
      {label && c && <span className="text-sm">{c.name}</span>}
    </span>
  );
}

export const STATUS: Record<Ownership, { label: string; dot: string; chip: string }> = {
  OWNED: { label: 'Owned', dot: 'bg-emerald-600', chip: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  NOT_OWNED: { label: 'Not owned', dot: 'bg-stone-400', chip: 'bg-stone-50 text-stone-600 border-stone-300' },
  WANT: { label: 'Want to buy', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-800 border-amber-300' },
  PLANNED: { label: 'Planned purchase', dot: 'bg-sky-600', chip: 'bg-sky-50 text-sky-800 border-sky-300' },
  NOT_INTERESTED: { label: 'Not interested', dot: 'bg-stone-300', chip: 'bg-white text-stone-400 border-stone-200 line-through' },
};

export function StatusPicker({ value, onChange, compact }: { value: Ownership; onChange: (o: Ownership) => void; compact?: boolean }) {
  return (
    <div className="relative inline-flex">
      <select
        aria-label="Ownership status"
        value={value}
        onChange={(e) => onChange(e.target.value as Ownership)}
        className={`cursor-pointer appearance-none rounded-full border py-1 pl-6 pr-3 text-xs font-medium ${STATUS[value].chip} ${compact ? '' : 'min-w-[128px]'}`}
      >
        {(Object.keys(STATUS) as Ownership[]).map((k) => <option key={k} value={k}>{STATUS[k].label}</option>)}
      </select>
      <span className={`pointer-events-none absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${STATUS[value].dot}`} />
    </div>
  );
}

export function CheckLine({ status, label, detail }: { status: 'ok' | 'warn' | 'bad'; label: string; detail: string }) {
  const I = status === 'ok' ? Check : status === 'warn' ? AlertTriangle : XCircle;
  const c = status === 'ok' ? 'text-olive' : status === 'warn' ? 'text-amber-600' : 'text-red-600';
  return (
    <li className="flex gap-3 py-2">
      <I className={`mt-0.5 h-4 w-4 shrink-0 ${c}`} />
      <div><span className="font-medium text-choc">{label}.</span> <span className="text-choc-soft">{detail}</span></div>
    </li>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (t: T) => void }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} className={`rounded-full border px-4 py-1.5 text-sm transition ${value === t.id ? 'border-olive bg-olive text-ivory' : 'border-camel-light bg-paper text-choc hover:border-camel'}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-choc">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-choc-soft">{hint}</span>}
    </label>
  );
}

export const inputCls = 'w-full rounded-lg border border-camel-light bg-white px-3 py-2 text-sm text-choc outline-none focus:border-olive';
export const btn = 'inline-flex items-center gap-2 bg-choc px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ivory hover:bg-olive-deep disabled:opacity-40';
export const btnGhost = 'inline-flex items-center gap-2 border border-camel-light px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-choc hover:border-choc';

export function Dots({ n, max = 5 }: { n: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} of ${max}`}>
      {Array.from({ length: max }, (_, i) => <span key={i} className={`h-1.5 w-3 rounded-full ${i < n ? 'bg-rust' : 'bg-camel-light'}`} />)}
    </span>
  );
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return <div className={`rounded-lg border px-4 py-3 text-sm ${tone === 'warn' ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-teal/20 bg-teal/5 text-choc'}`}>{children}</div>;
}

export function Table({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto border border-camel-light/70 bg-paper">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-sand/60 text-xs uppercase tracking-wider text-choc-soft">
          <tr>{head.map((h, i) => <th key={i} className="px-3 py-2.5 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <tr key={i} className="border-t border-camel-light/50 align-top">{r.map((c, j) => <td key={j} className="px-3 py-2.5">{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
