import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useStore, uid } from '../lib/store';
import { measurementGuide, measurementHistory, reportInconsistencies, faceMeasurements, profile } from '../data/content';
import type { Measurements } from '../data/types';
import { Badge, Card, Field, Note, PageHeader, Section, Table, btn, inputCls } from '../components/ui';
import { OutfitFigure } from '../components/OutfitFigure';
import { pieceById } from '../lib/catalogue';

const f1 = (n?: number) => (n === undefined ? '—' : Number.isInteger(n) ? String(n) : n.toFixed(1));

export function sizeProfile(m: Measurements) {
  const C = m.chest ?? 0, S = m.stomach ?? 0, W = m.waist ?? 0, H = m.hip ?? 0;
  const rise = (W + S) / 2;
  const tall = (m.height ?? 73) >= 72;
  return [
    { garment: 'T-shirts', target: `Garment chest ${f1(C + 4)}–${f1(C + 6)} in (pit-to-pit ${f1((C + 4) / 2)}–${f1((C + 6) / 2)})`, why: 'This is 4–6 in of ease. It must also clear your stomach (' + f1(S) + ' in), so check the hem width too.', fit: 'Regular, 180–220 GSM', tip: tall ? 'Body length 29–30 in so it covers the belt when you lift your arms.' : '' },
    { garment: 'Shirts', target: `Garment chest ${f1(C + 5)}–${f1(C + 7)} in · garment waist ≥ ${f1(S + 3)} in`, why: 'Buttons pulling into an X at the stomach means the waist is too small, even if the chest fits.', fit: 'Regular / classic', tip: 'Sleeve length and neck are not measured yet: add them below.' },
    { garment: 'Polos', target: `Garment chest ${f1(C + 4)}–${f1(C + 6)} in`, why: 'Pique has little stretch, so stay at the upper end.', fit: 'Regular', tip: 'Sleeve should end mid-bicep (your arm is ' + f1(m.arm) + ' in).' },
    { garment: 'Jackets / blazers', target: `Label around ${Math.round(C / 2) * 2} (chest size) in ${tall ? 'Long (L)' : 'Regular (R)'} · try ${Math.round(C / 2) * 2}R and ${Math.round(C / 2) * 2 + 2}${tall ? 'L' : 'R'}`, why: 'Jacket labels are your chest measurement. The button must close over your stomach (' + f1(S) + ' in) without an X-pull.', fit: 'Unstructured or soft-shoulder, double vent', tip: 'Shoulder width is not measured. It is the one thing a tailor cannot fix.' },
    { garment: 'Suits', target: 'Jacket as above; trousers as below. Buy separates or a suit with a large seam allowance.', why: 'Your body is still changing (waist −3.1 in since Aug).', fit: 'Classic, mid/high rise trousers', tip: 'Postpone an expensive made-to-measure suit until your weight stabilises.' },
    { garment: 'Chinos / formal trousers', target: `Waistband (flat ×2) ${f1(rise)}–${f1(rise + 1)} in · seat ≥ ${f1(H + 2)} in`, why: `Mid-rise trousers sit between your natural waist (${f1(W)}) and your navel (${f1(S)}). Labels are often 1–2 in smaller than the real waistband ("vanity sizing"), so the label may read ${Math.floor(rise) - 2}–${Math.ceil(rise)}.`, fit: 'Mid/high rise, slim-straight, 2% elastane', tip: 'Side adjusters or a woven belt handle the changing waist.' },
    { garment: 'Jeans', target: `Waistband ${f1(rise)}–${f1(rise + 1)} in · thigh ≥ ${f1((m.thigh ?? 25) + 1.5)} in`, why: 'The thigh is where jeans most often fail.', fit: 'Slim-straight or straight, mid-rise', tip: 'Rigid denim stretches about 1 in. Stretch denim (1–2% elastane) stretches more.' },
    { garment: 'Kurta', target: `Garment chest ${f1(C + 6)}–${f1(C + 8)} in · length 40–42 in`, why: 'Kurtas need more ease than shirts to drape.', fit: 'Straight', tip: 'Length to just above the knee for your height.' },
    { garment: 'Footwear', target: 'Not measured yet', why: 'UK, EU and US sizes differ between brands; foot length in cm is the reliable number.', fit: '—', tip: 'Measure foot length and width below.' },
  ];
}

export function Body() {
  const { state, update } = useStore();
  const m = state.measurements;
  const set = (k: keyof Measurements, v: string) => update((s) => ({ ...s, measurements: { ...s.measurements, [k]: v === '' ? undefined : k === 'date' ? v : Number(v) } }));
  const missing = measurementGuide.filter((g) => m[g.key] === undefined);
  const report = measurementHistory[0];
  return (
    <div>
      <PageHeader eyebrow="Measured facts" title="My Body & Measurements">
        Sizing on this site comes from your tape measurements, never from height or weight. The latest tape is from 31 Oct 2026 (health log), and it supersedes the style report.
      </PageHeader>

      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_240px]">
        <div>
          <Section title="Measurement history" sub="Measured facts from three sources. Your body is changing quickly, so re-measure every 2–4 weeks.">
            <Table head={['Date', 'Source', 'Chest', 'Stomach', 'Waist', 'Hip', 'Thigh', 'Weight']} rows={measurementHistory.map((h) => [h.date, <span className="text-xs">{h.source}</span>, f1(h.chest), f1(h.stomach), f1(h.waist), f1(h.hip), f1(h.thigh), h.weight ? `${h.weight} kg` : '—'])} />
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {(['chest', 'stomach', 'waist', 'hip'] as const).map((k) => <Card key={k} className="text-center"><div className="text-xs uppercase text-choc-soft">{k}</div><div className="font-serif text-2xl">{f1(m[k])}″</div><div className={`text-xs ${(m[k]! - (report[k] ?? 0)) < 0 ? 'text-olive' : 'text-rust'}`}>{f1(m[k]! - (report[k] ?? 0))}″ vs report</div></Card>)}
            </div>
          </Section>
        </div>
        <Card className="flex flex-col items-center">
          <OutfitFigure className="h-80" top={pieceById['polo:navy']} bottom={pieceById['chinos:beige']} footwear={pieceById['sneaker-white:white']} accessories={[pieceById['glasses:gold-metal'], pieceById['watch-smart:black']]} m={m} />
          <p className="mt-2 text-center text-xs text-choc-soft">Proportion study from your current tape (not a likeness). It redraws when you edit the measurements.</p>
        </Card>
      </div>

      <Section title="Body shape: report vs now">
        <div className="grid gap-4 md:grid-cols-2">
          <Card><Badge tone="sand">From the report</Badge><p className="mt-2 text-sm"><b>{profile.bodyShapeReport}.</b> The stomach (47) was the largest measurement, with chest (45) and hips (47) close behind. Strategy: vertical lines, draw attention upward, structured tailoring.</p></Card>
          <Card><Badge tone="olive">My reading of your 31 Oct numbers</Badge><p className="mt-2 text-sm"><b>{profile.bodyShapeNow}.</b> Your hip (44.5) is now the largest, chest (43.5) and stomach (41.9) are close, and your waist (38.9) is 5.6 in smaller than your hip. The photo still shows fullness at the midsection, so the oval strategies remain right. You are just no longer "stomach-led".</p></Card>
        </div>
        <Note>Face (from the report): forehead {faceMeasurements.forehead}″, cheekbones {faceMeasurements.cheekbone}″, jawline {faceMeasurements.jawline}″, face length {faceMeasurements.faceLength}″ → diamond.</Note>
      </Section>

      <Section title="Inconsistencies found in the references" sub="I flag these instead of guessing silently.">
        <Table head={['Area', 'What conflicts', 'How this site resolves it']} rows={reportInconsistencies.map((r) => [<b>{r.area}</b>, r.issue, r.resolution])} />
      </Section>

      <Section title="My current measurements" sub={missing.length ? `${missing.length} measurements are still needed: ${missing.map((x) => x.label).join(', ')}.` : 'All measurements recorded.'}>
        <Card>
          <div className="mb-4 max-w-xs"><Field label="Measured on"><input type="date" className={inputCls} value={m.date} onChange={(e) => set('date', e.target.value)} /></Field></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {measurementGuide.map((g) => (
              <div key={g.key} className={`rounded-lg border p-3 ${m[g.key] === undefined ? 'border-amber-300 bg-amber-50/50' : 'border-camel-light/60'}`}>
                <Field label={`${g.label} (${g.unit})`} hint={g.how}>
                  <input type="number" step="0.1" className={inputCls} value={m[g.key] ?? ''} placeholder="needed" onChange={(e) => set(g.key, e.target.value)} />
                </Field>
                <div className="mt-1 text-[11px] text-olive">Used for: {g.used}</div>
              </div>
            ))}
          </div>
          {m.height === 73 && <p className="mt-3 text-xs text-choc-soft">Height 73 in (6′1″) is taken from the report and is unconfirmed.</p>}
        </Card>
      </Section>

      <Section title="My size profile" sub="Targets are garment measurements (what a size chart lists), computed from your body plus ease. They are derived recommendations, not brand sizes.">
        <Table head={['Garment', 'Target garment measurement', 'Why', 'Fit', 'Tip']} rows={sizeProfile(m).map((r) => [<b>{r.garment}</b>, r.target, <span className="text-xs">{r.why}</span>, r.fit, <span className="text-xs">{r.tip}</span>])} />
      </Section>

      <Section title="Why is a garment bigger than my body? (ease)">
        <Card className="text-sm leading-relaxed">
          <p><b>Body measurement</b> is you. <b>Garment measurement</b> is the cloth laid flat (×2 for circumference). The difference is <b>ease</b>: the room you need to breathe, sit and move, plus the "design ease" that creates the style.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[['Slim fit', '2–3 in', 'Tight: shows the body. Avoid at the stomach.'], ['Regular fit', '4–6 in', 'Skims. This is your target.'], ['Relaxed fit', '7–10 in', 'Drapes. Good for linen and kurtas.']].map(([a, b, c]) => <div key={a} className="rounded-lg bg-sand/60 p-3"><div className="font-medium">{a}</div><div className="font-serif text-2xl text-olive">+{b}</div><div className="text-xs">{c}</div></div>)}
          </div>
        </Card>
      </Section>

      <BrandSizeTool />

      <Section title="Fitting-room checklist">
        <Card>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {['Shoulder seam sits on the shoulder bone, not past it', 'Shirt buttons lie flat over the stomach: no X-shaped pulls', 'You can pinch 1.5–2 in of fabric at each side of the chest', 'Sit down: the trouser waistband does not dig in or roll', 'Trouser front pockets lie flat (gaping means too tight at the hip)', 'Jacket buttoned: no X-pull, and it covers your seat', 'Jacket sleeve shows ½ in of shirt cuff', 'Lift your arms: the shirt or tee still covers the belt', 'Trouser hem: slight break on the shoe, not bunching', 'Walk and squat: no pulling across the thigh'].map((t) => <li key={t} className="flex gap-2"><input type="checkbox" className="mt-1" /> {t}</li>)}
          </ul>
        </Card>
      </Section>
    </div>
  );
}

function BrandSizeTool() {
  const { state, update } = useStore();
  const m = state.measurements;
  const [f, setF] = useState({ brand: '', garment: 'Shirt', label: '', chest: '', waist: '', hip: '', length: '' });
  const ease = (g?: number, b?: number) => (g && b ? g - b : undefined);
  const verdict = (e: number | undefined, lo: number, hi: number) => (e === undefined ? '—' : e < lo ? `Tight (+${e.toFixed(1)})` : e > hi ? `Loose (+${e.toFixed(1)})` : `Good (+${e.toFixed(1)})`);
  const top = f.garment !== 'Trousers';
  const rows = state.sizeChecks;
  const chestV = verdict(ease(+f.chest, m.chest), top ? 4 : 0, top ? 7 : 99);
  const waistV = top ? verdict(ease(+f.waist, m.stomach), 2.5, 8) : verdict(ease(+f.waist, ((m.waist ?? 0) + (m.stomach ?? 0)) / 2), -0.5, 1.5);
  const hipV = verdict(ease(+f.hip, m.hip), top ? 1 : 1.5, top ? 10 : 4);
  const save = () => update((s) => ({ ...s, sizeChecks: [...s.sizeChecks, { id: uid(), brand: f.brand, garment: f.garment, label: f.label, chest: +f.chest || undefined, waist: +f.waist || undefined, hip: +f.hip || undefined, length: +f.length || undefined, verdict: [chestV, waistV, hipV].join(' / '), date: new Date().toISOString().slice(0, 10) }] }));
  return (
    <Section title="Brand size comparison tool" sub="I have not verified any brand's size chart. Copy the garment measurements from the brand's official chart or product page, or measure the garment in store, and the tool compares them to your body. Saved checks build your own verified brand-fit record.">
      <Card>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Brand"><input className={inputCls} value={f.brand} onChange={(e) => setF({ ...f, brand: e.target.value })} placeholder="e.g. Uniqlo" /></Field>
          <Field label="Garment"><select className={inputCls} value={f.garment} onChange={(e) => setF({ ...f, garment: e.target.value })}>{['Shirt', 'T-shirt', 'Polo', 'Blazer', 'Kurta', 'Trousers'].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Size label"><input className={inputCls} value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} placeholder="XL / 40 / 44L" /></Field>
          <Field label="Length (in)"><input type="number" className={inputCls} value={f.length} onChange={(e) => setF({ ...f, length: e.target.value })} /></Field>
          {top && <Field label="Garment chest (in, circumference)"><input type="number" className={inputCls} value={f.chest} onChange={(e) => setF({ ...f, chest: e.target.value })} /></Field>}
          <Field label={top ? 'Garment waist / hem (in)' : 'Waistband (in)'}><input type="number" className={inputCls} value={f.waist} onChange={(e) => setF({ ...f, waist: e.target.value })} /></Field>
          <Field label={top ? 'Garment hip / hem (in)' : 'Seat / hip (in)'}><input type="number" className={inputCls} value={f.hip} onChange={(e) => setF({ ...f, hip: e.target.value })} /></Field>
        </div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          {top && <div className="rounded-lg bg-sand/60 p-3"><div className="text-xs text-choc-soft">Chest vs your {m.chest}″</div><b>{chestV}</b></div>}
          <div className="rounded-lg bg-sand/60 p-3"><div className="text-xs text-choc-soft">{top ? `Waist vs your stomach ${m.stomach}″` : 'Waistband vs your mid-rise line'}</div><b>{waistV}</b></div>
          <div className="rounded-lg bg-sand/60 p-3"><div className="text-xs text-choc-soft">Hip vs your {m.hip}″</div><b>{hipV}</b></div>
        </div>
        <button className={`${btn} mt-4`} disabled={!f.brand} onClick={save}>Save to my brand-fit record</button>
        {rows.length > 0 && <div className="mt-5"><Table head={['Date', 'Brand', 'Garment', 'Label', 'Verdict', '']} rows={rows.map((r) => [r.date, r.brand, r.garment, r.label, <span className="text-xs">{r.verdict}</span>, <button aria-label="Delete" onClick={() => confirm('Delete this size check?') && update((s) => ({ ...s, sizeChecks: s.sizeChecks.filter((x) => x.id !== r.id) }))}><Trash2 className="h-4 w-4 text-choc-soft" /></button>])} /></div>}
      </Card>
    </Section>
  );
}
