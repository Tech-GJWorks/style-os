import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collections, outfits, outfitById } from '../data/outfits';
import { colours } from '../data/colours';
import { profile } from '../data/content';
import { useStore } from '../lib/store';
import { completion, currentSeason, ownedPool } from '../lib/engine';
import { stylistNotes } from '../lib/stylist';
import { Eyebrow, LookCard, LookImage, SectionHead } from '../components/Catalog';
import { useRenders } from '../components/OutfitCard';

export const occasionEdits: { id: string; name: string; line: string; tags: string[]; cover: string }[] = [
  { id: 'everyday', name: 'Everyday', line: 'Easy, polished, repeatable', tags: ['casual', 'weekend', 'coffee', 'friends', 'movies'], cover: 'tees-02' },
  { id: 'office', name: 'Office', line: 'Business casual to boardroom', tags: ['office', 'business', 'client', 'presentation', 'interview'], cover: 'cotton-04' },
  { id: 'dates', name: 'Dates', line: 'Warm, deep, unforced', tags: ['date', 'dinner', 'romantic', 'first-date', 'anniversary'], cover: 'date-04' },
  { id: 'marriage', name: 'Marriage meetings', line: 'Dependable and approachable', tags: ['arranged', 'family-intro'], cover: 'wedding-01' },
  { id: 'family', name: 'Family functions', line: 'Respectful, festive, comfortable', tags: ['family', 'religious', 'pooja', 'ganesh'], cover: 'traditional-01' },
  { id: 'weddings', name: 'Weddings', line: 'Sangeet to reception', tags: ['wedding', 'reception', 'engagement', 'formal-indian'], cover: 'wedding-04' },
  { id: 'traditional', name: 'Traditional', line: 'Kurtas, Nehru jackets, festivals', tags: ['festive', 'diwali'], cover: 'traditional-03' },
  { id: 'airport', name: 'Airport', line: 'Comfort that still arrives well', tags: ['airport', 'flight'], cover: 'travel-01' },
  { id: 'train', name: 'Train journeys', line: 'Dark, practical, pocketed', tags: ['train'], cover: 'travel-02' },
  { id: 'roadtrip', name: 'Road trips', line: 'Stretch, layers, sneakers', tags: ['road-trip', 'travel', 'city'], cover: 'cargo-01' },
  { id: 'vacation', name: 'Vacation', line: 'Linen, resort, hill station', tags: ['beach', 'resort', 'brunch', 'vacation', 'hill'], cover: 'linen-02' },
];

export function Home() {
  const { state } = useStore();
  const renders = useRenders();
  const season = currentSeason();
  const day = Math.floor(Date.now() / 86400000);
  const inSeason = outfits.filter((o) => o.seasons.includes(season) && renders.has(o.id));
  const lotd = inSeason.length ? inSeason[day % inSeason.length] : outfits[0];
  const notes = stylistNotes(state, lotd);
  const hero = outfitById['oxford-02'];
  const recommended = useMemo(() => outfits
    .filter((o) => renders.has(o.id) && o.id !== lotd.id)
    .map((o) => ({ o, s: completion(state, o).pct + (o.seasons.includes(season) ? 40 : 0) + (state.favourites.includes(o.id) ? 30 : 0) - o.difficulty * 5 }))
    .sort((a, b) => b.s - a.s).slice(0, 4).map((x) => x.o), [state, renders, season, lotd.id]);
  const cover = (cid: string) => outfits.find((o) => o.collection === cid && renders.has(o.id)) ?? outfits.find((o) => o.collection === cid)!;
  const pool = ownedPool(state);
  const complete = outfits.filter((o) => completion(state, o).status === 'Complete').length;

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr]">
        <Link to={`/outfit/${hero.id}`} className="relative block aspect-[4/5] overflow-hidden bg-sand"><LookImage o={hero} eager /></Link>
        <div>
          <Eyebrow>The Autumn Edit · {profile.season}</Eyebrow>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-7xl">Dressed for<br />your colouring,<br /><em className="text-rust">cut for your frame.</em></h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-choc-soft">108 looks photographed on you. Each one comes with a stylist&apos;s breakdown: what it is, why it works on a warm, deep, broad-shouldered frame, and exactly how to wear it.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/outfits" className="bg-choc px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory hover:bg-olive-deep">Browse the looks</Link>
            <Link to="/lookbook" className="border border-choc px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-choc hover:text-ivory">Collections</Link>
          </div>
        </div>
      </section>

      {/* Look of the day */}
      <section className="grid gap-10 border-y border-camel-light/70 py-12 md:grid-cols-[1fr_340px]">
        <div className="order-2 md:order-1">
          <Eyebrow>Look of the day · {season}</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{lotd.name}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-rust">{notes.headline}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {notes.why.slice(0, 2).map((w) => <div key={w.title}><div className="text-[10px] uppercase tracking-[0.25em] text-choc-soft">{w.title}</div><p className="mt-2 text-[15px] leading-relaxed">{w.text}</p></div>)}
          </div>
          <Link to={`/outfit/${lotd.id}`} className="mt-8 inline-block text-[11px] uppercase tracking-[0.22em] underline underline-offset-4">Read the full breakdown</Link>
        </div>
        <Link to={`/outfit/${lotd.id}`} className="relative order-1 block aspect-[3/4] overflow-hidden bg-sand md:order-2"><LookImage o={lotd} /></Link>
      </section>

      <section>
        <SectionHead eyebrow="Selected for you" title="Recommended looks" link="All looks" linkTo="/outfits" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{recommended.map((o) => <LookCard key={o.id} o={o} />)}</div>
      </section>

      <section>
        <SectionHead eyebrow="Shop by moment" title="Occasion edits" link="All occasions" linkTo="/occasions" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {occasionEdits.map((e) => (
            <Link key={e.id} to={`/outfits?edit=${e.id}`} className="group relative block aspect-[3/4] overflow-hidden bg-sand">
              <div className="h-full transition duration-500 group-hover:scale-[1.04]"><LookImage o={outfitById[e.cover]} /></div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16 text-ivory">
                <div className="font-serif text-2xl leading-tight">{e.name}</div>
                <div className="text-[11px] tracking-wide opacity-80">{e.line}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHead eyebrow={`${collections.length} collections`} title="Explore by garment" link="All collections" linkTo="/lookbook" />
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {collections.slice(0, 12).map((c) => (
            <Link key={c.id} to={`/outfits?c=${c.id}`} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-sand"><div className="h-full transition duration-500 group-hover:scale-[1.04]"><LookImage o={cover(c.id)} /></div></div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.15em]">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <Link to="/wardrobe" className="border border-camel-light p-8 hover:border-choc">
          <Eyebrow>My wardrobe</Eyebrow>
          <div className="mt-3 font-serif text-5xl">{pool.all.length}</div>
          <p className="mt-2 text-sm text-choc-soft">pieces recorded · {complete} complete looks you can wear today</p>
        </Link>
        <Link to="/shopping" className="border border-camel-light p-8 hover:border-choc">
          <Eyebrow>Next purchase</Eyebrow>
          <p className="mt-3 font-serif text-2xl leading-snug">The pieces that unlock the most looks, ranked.</p>
          <p className="mt-2 text-sm text-choc-soft">Shopping planner →</p>
        </Link>
        <Link to="/colour" className="border border-camel-light p-8 hover:border-choc">
          <Eyebrow>Your palette</Eyebrow>
          <div className="mt-4 flex flex-wrap gap-1.5">{colours.filter((c) => c.verdict === 'core').slice(0, 14).map((c) => <span key={c.id} className="h-7 w-7 rounded-full" style={{ background: c.hex }} title={c.name} />)}</div>
          <p className="mt-3 text-sm text-choc-soft">Warm Deep Autumn: olive, rust, camel, chocolate, teal.</p>
        </Link>
      </section>
    </div>
  );
}
