import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shuffle } from 'lucide-react';
import { occasions } from '../data/occasions';
import { impressions } from '../data/content';
import { outfits } from '../data/outfits';
import type { Season } from '../data/types';
import { useStore } from '../lib/store';
import { completion, currentSeason, evaluateOutfit, generateCombos, inr } from '../lib/engine';
import { Badge, Card, CheckLine, Field, inputCls, btnGhost } from './ui';
import { OutfitVisual, CompletionBadge, useOutfitActions } from './OutfitCard';
import { OutfitFigure } from './OutfitFigure';

const weathers = [
  { id: 'hot', label: 'Hot & dry (30°C+)', seasons: ['summer'] as Season[] },
  { id: 'humid', label: 'Warm & humid', seasons: ['summer', 'monsoon', 'transitional'] as Season[] },
  { id: 'rain', label: 'Raining', seasons: ['monsoon'] as Season[] },
  { id: 'mild', label: 'Mild (20–28°C)', seasons: ['transitional', 'winter'] as Season[] },
  { id: 'cool', label: 'Cool (under 20°C)', seasons: ['winter'] as Season[] },
  { id: 'ac', label: 'Indoors, strong AC', seasons: ['winter', 'transitional'] as Season[] },
];

export function DecisionEngine({ full = false }: { full?: boolean }) {
  const { state } = useStore();
  const { toggleFav, isFav } = useOutfitActions();
  const [occ, setOcc] = useState('daily-casual');
  const [season, setSeason] = useState<Season>(currentSeason());
  const [weather, setWeather] = useState('mild');
  const [imp, setImp] = useState('');
  const [formal, setFormal] = useState(0);
  const [comfort, setComfort] = useState<'any' | 'max'>('any');
  const [location, setLocation] = useState('indoor');
  const [budget, setBudget] = useState(0);
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [seed, setSeed] = useState(0);

  const occasion = occasions.find((o) => o.id === occ)!;
  const range: [number, number] = formal ? [formal, formal] : occasion.formality;
  const w = weathers.find((x) => x.id === weather)!;
  const impTags = imp ? impressions.find((i) => i.id === imp)?.tags ?? [] : [];

  const ranked = useMemo(() => {
    return outfits
      .map((o) => {
        const ev = evaluateOutfit(state, o, { occasionRange: range, season });
        const c = completion(state, o);
        let s = ev.score;
        if (o.occasions.some((t) => occasion.tags.includes(t))) s += 30;
        if (o.seasons.includes(season)) s += 10; else s -= 25;
        if (o.seasons.some((x) => w.seasons.includes(x))) s += 8;
        if (weather === 'rain' && /suede|linen/.test(o.footwear + o.top + o.bottom)) s -= 30;
        if (impTags.length && o.impression.some((i) => impTags.includes(i))) s += 15;
        if (comfort === 'max' && o.difficulty === 1) s += 5;
        if (location === 'outdoor' && o.outer && season === 'summer') s -= 10;
        s += c.pct / 10;
        if (budget >= 0 && c.cost > budget && c.missing.length) s -= budget === 0 ? 15 : 10;
        return { o, ev, c, s };
      })
      .filter((x) => (ownedOnly ? x.c.status === 'Complete' : true))
      .sort((a, b) => b.s - a.s);
  }, [state, occ, season, weather, imp, formal, comfort, location, budget, ownedOnly]);

  const shown = ranked.slice((seed * 3) % Math.max(1, Math.min(ranked.length, 12)), ((seed * 3) % Math.max(1, Math.min(ranked.length, 12))) + 3);
  const own = useMemo(() => generateCombos(state, { season, occasionRange: range, minScore: 70, limit: 30 }), [state, season, occ, formal]);
  const ownPick = own.slice((seed * 2) % Math.max(1, own.length), ((seed * 2) % Math.max(1, own.length)) + 2);

  return (
    <div>
      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Occasion">
            <select className={inputCls} value={occ} onChange={(e) => setOcc(e.target.value)}>
              {['Everyday and casual', 'Dates and relationships', 'Professional', 'Travel', 'Traditional and festive'].map((g) => (
                <optgroup key={g} label={g}>{occasions.filter((o) => o.group === g).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</optgroup>
              ))}
            </select>
          </Field>
          <Field label="Weather"><select className={inputCls} value={weather} onChange={(e) => setWeather(e.target.value)}>{weathers.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></Field>
          <Field label="Season"><select className={inputCls} value={season} onChange={(e) => setSeason(e.target.value as Season)}>{['summer', 'monsoon', 'transitional', 'winter'].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Desired impression"><select className={inputCls} value={imp} onChange={(e) => setImp(e.target.value)}><option value="">Any</option>{impressions.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select></Field>
          <Field label="Location"><select className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)}><option value="indoor">Indoors</option><option value="outdoor">Outdoors</option><option value="mixed">Mixed</option></select></Field>
          <Field label="Formality"><select className={inputCls} value={formal} onChange={(e) => setFormal(Number(e.target.value))}><option value={0}>Occasion default ({occasion.formality.join('–')})</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} — {['', 'Very casual', 'Casual', 'Smart casual', 'Business', 'Formal'][n]}</option>)}</select></Field>
          <Field label="Comfort"><select className={inputCls} value={comfort} onChange={(e) => setComfort(e.target.value as 'any')}><option value="any">Balanced</option><option value="max">Maximum comfort</option></select></Field>
          {full ? <Field label="Budget for new purchases (₹)"><input type="number" min={0} step={500} className={inputCls} value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></Field> : (
            <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={ownedOnly} onChange={(e) => setOwnedOnly(e.target.checked)} /> Only outfits I fully own</label>
          )}
        </div>
        {full && <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={ownedOnly} onChange={(e) => setOwnedOnly(e.target.checked)} /> Only outfits I fully own</label>}
      </Card>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold">From the catalogue</h3>
        <button className={btnGhost} onClick={() => setSeed((s) => s + 1)}><Shuffle className="h-4 w-4" /> Other options</button>
      </div>
      {!shown.length && <p className="text-sm text-choc-soft">No catalogue outfit is fully owned yet. Untick "only outfits I fully own", or mark what you own in My Wardrobe.</p>}
      <div className="grid gap-5 md:grid-cols-3">
        {shown.map(({ o, ev, c }) => (
          <Card key={o.id} className="flex flex-col p-0">
            <Link to={`/outfit/${o.id}`} className="block bg-sand/50 px-4 pt-3"><OutfitVisual o={o} className="h-56" /></Link>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between"><Link to={`/outfit/${o.id}`} className="font-serif text-lg font-semibold hover:text-rust">{o.name}</Link><button onClick={() => toggleFav(o.id)} aria-label="Save to favourites"><Heart className={`h-5 w-5 ${isFav(o.id) ? 'fill-rust text-rust' : 'text-camel'}`} /></button></div>
              <div className="mt-2 flex flex-wrap gap-1"><CompletionBadge status={c.status} pct={c.pct} />{c.status === 'Complete' ? <Badge tone="green">You can wear this today</Badge> : <Badge tone="amber">Needs {c.missing.length} purchase{c.missing.length > 1 ? 's' : ''} · {inr(c.cost)}</Badge>}</div>
              <p className="mt-3 text-sm text-choc-soft">{ev.colourLogic}</p>
              {c.missing.length > 0 && <p className="mt-2 text-xs text-choc-soft"><b>Not owned:</b> {c.missing.map((m) => m.piece?.name).join(', ')}</p>}
              {full && (
                <div className="mt-3 space-y-1 border-t border-camel-light/60 pt-3 text-xs text-choc-soft">
                  <p><b>Fabric:</b> {occasion.fabrics}</p>
                  <p><b>Grooming:</b> {occasion.grooming}</p>
                  <p><b>Fragrance:</b> {occasion.fragrance}</p>
                  <p><b>Avoid:</b> {occasion.avoid}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <h3 className="mb-3 mt-8 font-serif text-xl font-semibold">From only what you own</h3>
      {ownPick.length === 0 ? <p className="text-sm text-choc-soft">Nothing you own makes a strong combination for these conditions yet. Add items in <Link className="underline" to="/wardrobe">My Wardrobe</Link>.</p> : (
        <div className="grid gap-5 md:grid-cols-2">
          {ownPick.map((cmb) => (
            <Card key={cmb.key} className="flex gap-4">
              <OutfitFigure className="h-48 w-28 shrink-0" top={cmb.top} bottom={cmb.bottom} footwear={cmb.footwear} outer={cmb.outer} accessories={cmb.accessories} m={state.measurements} />
              <div className="text-sm">
                <Badge tone="green">All owned · score {cmb.ev.score}</Badge>
                <ul className="mt-2 space-y-0.5">{[cmb.top, cmb.outer, cmb.bottom, cmb.footwear, ...cmb.accessories].filter(Boolean).map((p) => <li key={p!.id}>• {p!.name}</li>)}</ul>
                <ul className="mt-2 text-xs">{cmb.ev.checks.filter((c) => c.status !== 'ok').slice(0, 2).map((c) => <CheckLine key={c.label} {...c} />)}</ul>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
