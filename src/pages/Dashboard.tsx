import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { profile, seasons } from '../data/content';
import { colours } from '../data/colours';
import { outfits, outfitById } from '../data/outfits';
import { completion, currentSeason, gapRanking, ownedPool, wardrobeInsights, inr } from '../lib/engine';
import { pieceById } from '../lib/catalogue';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { Badge, Card, PageHeader, Section, Swatch } from '../components/ui';
import { DecisionEngine } from '../components/DecisionEngine';
import { OutfitCard } from '../components/OutfitCard';

export function Dashboard() {
  const { state } = useStore();
  const pool = ownedPool(state);
  const all = outfits.map((o) => ({ o, c: completion(state, o) }));
  const complete = all.filter((x) => x.c.status === 'Complete');
  const almost = all.filter((x) => x.c.status === 'Almost complete');
  const gaps = gapRanking(state).slice(0, 5);
  const insights = wardrobeInsights(state);
  const season = currentSeason();
  const sz = seasons.find((s) => s.id === season)!;
  const favs = state.favourites.map((id) => outfitById[id]).filter(Boolean);
  const recent = [...favs].reverse().slice(0, 3);
  const versatile = [...pool.all].filter((p) => !p.id.startsWith('item:')).map((p) => ({ p, n: outfits.filter((o) => [o.top, o.bottom, o.footwear, o.outer, ...o.required].includes(p.id)).length })).sort((a, b) => b.n - a.n).slice(0, 4);

  return (
    <div>
      <PageHeader eyebrow="Personal Fashion Intelligence & Wardrobe System" title="My Style Dashboard">
        {profile.season} · {profile.faceShape} face · {profile.bodyShapeNow}. Direction: {profile.direction.toLowerCase()}.
      </PageHeader>

      <div className="mb-10 grid gap-5 md:grid-cols-[220px_1fr]">
        <Card className="p-3">
          <ProfilePhoto className="h-72" />
          <p className="mt-2 text-center text-xs text-choc-soft">Reference photo · {profile.photoDate}</p>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Items owned" value={pool.all.length} sub={`${pool.top.length} tops · ${pool.bottom.length} bottoms · ${pool.footwear.length} shoes · ${pool.accessory.length} accessories`} to="/wardrobe" />
          <Stat label="Outfits I can wear now" value={complete.length} sub={`of ${outfits.length} in the catalogue`} to="/outfits" />
          <Stat label="Almost complete" value={almost.length} sub="1–2 items missing" to="/outfits" />
          <Stat label="Combos from my wardrobe" value={insights.combos} sub="owned-only, good scores" to="/builder" />
          <Card className="sm:col-span-2">
            <div className="text-xs uppercase tracking-wider text-choc-soft">My best colours</div>
            <div className="mt-3 flex flex-wrap gap-2">{colours.filter((c) => c.verdict === 'core').slice(0, 16).map((c) => <Swatch key={c.id} id={c.id} />)}</div>
            <Link to="/colour" className="mt-3 inline-flex items-center gap-1 text-xs text-rust">Colour intelligence <ArrowRight className="h-3 w-3" /></Link>
          </Card>
          <Card className="sm:col-span-2">
            <div className="text-xs uppercase tracking-wider text-choc-soft">Recommended silhouettes</div>
            <ul className="mt-2 space-y-1 text-sm">{profile.silhouettes.slice(0, 4).map((s) => <li key={s}>— {s}</li>)}</ul>
          </Card>
        </div>
      </div>

      <Section title="What should I wear today?" sub="The engine ranks the catalogue for your conditions and clearly separates what you own from what you would need to buy.">
        <DecisionEngine />
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Shopping priorities" sub="Ranked by how many catalogue outfits each purchase completes. A purchase that completes nothing ranks low.">
          <Card>
            {gaps.length === 0 ? <p className="text-sm">Nothing missing.</p> : (
              <ol className="space-y-3">
                {gaps.map((g, i) => (
                  <li key={g.pieceId} className="flex items-start gap-3 text-sm">
                    <span className="font-serif text-xl text-rust">{i + 1}</span>
                    <div><div className="font-medium">{pieceById[g.pieceId]?.name}</div><div className="text-xs text-choc-soft">Completes {g.completes} outfit{g.completes === 1 ? '' : 's'} on its own · used in {g.appears} · est. {inr(pieceById[g.pieceId]?.kind.estPrice)}</div></div>
                  </li>
                ))}
              </ol>
            )}
            <Link to="/shopping" className="mt-4 inline-flex items-center gap-1 text-xs text-rust">Shopping planner <ArrowRight className="h-3 w-3" /></Link>
          </Card>
        </Section>
        <Section title="Wardrobe gaps">
          <Card>
            <ul className="space-y-2 text-sm">{insights.insights.slice(0, 6).map((x) => <li key={x.text} className="flex gap-2"><Badge tone={x.level === 'gap' ? 'rust' : x.level === 'dup' ? 'amber' : 'green'}>{x.level === 'gap' ? 'Gap' : x.level === 'dup' ? 'Note' : 'OK'}</Badge><span>{x.text}</span></li>)}</ul>
          </Card>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title={`This season: ${sz.name} (${sz.months})`}>
          <Card className="text-sm">
            <p>{sz.climate}.</p>
            <p className="mt-2"><b>Wear:</b> {sz.garments}.</p>
            <p className="mt-1"><b>Fabrics:</b> {sz.fabrics}.</p>
            <p className="mt-1"><b>Avoid:</b> {sz.avoid}.</p>
            <Link to="/seasons" className="mt-3 inline-flex items-center gap-1 text-xs text-rust">Seasonal wardrobe <ArrowRight className="h-3 w-3" /></Link>
          </Card>
        </Section>
        <Section title="Upcoming occasions" sub="November–February is wedding and family-visit season.">
          <Card className="space-y-2 text-sm">
            {[['wedding-01', 'Arranged-marriage / family introduction'], ['traditional-03', 'Festive family function'], ['wedding-03', 'Evening wedding reception'], ['travel-01', 'Travel home']].map(([id, label]) => {
              const o = outfitById[id]; const c = completion(state, o);
              return <Link key={id} to={`/outfit/${id}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-sand/50"><span><b>{label}:</b> {o.name}</span><Badge tone={c.status === 'Complete' ? 'green' : 'amber'}>{c.pct}%</Badge></Link>;
            })}
          </Card>
        </Section>
      </div>

      <Section title="Most versatile pieces you own" sub="Owned pieces that appear in the most catalogue outfits.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {versatile.map(({ p, n }) => <Card key={p.id} className="flex items-center gap-3"><Swatch hex={p.colour.hex} size="lg" /><div><div className="text-sm font-medium">{p.name}</div><div className="text-xs text-choc-soft">in {n} outfits</div></div></Card>)}
        </div>
      </Section>

      <Section title="Recently saved outfits">
        {recent.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{recent.map((o) => <OutfitCard key={o.id} o={o} />)}</div> : <p className="text-sm text-choc-soft">Tap the heart on any outfit to save it here.</p>}
      </Section>
    </div>
  );
}

function Stat({ label, value, sub, to }: { label: string; value: number; sub: string; to: string }) {
  return (
    <Link to={to}><Card className="h-full transition hover:border-camel">
      <div className="text-xs uppercase tracking-wider text-choc-soft">{label}</div>
      <div className="mt-1 font-serif text-4xl font-semibold text-olive">{value}</div>
      <div className="mt-1 text-xs text-choc-soft">{sub}</div>
    </Card></Link>
  );
}
