import { accessoryGuides, matchingRules } from '../data/content';
import { pieces } from '../lib/catalogue';
import { Card, PageHeader, Section } from '../components/ui';
import { PieceStatusRow } from '../components/OutfitCard';

export function Accessories() {
  const acc = pieces.filter((p) => p.kind.slot === 'accessory' || p.kind.slot === 'footwear');
  return (
    <div>
      <PageHeader eyebrow="Minimal and coordinated" title="Accessories & Footwear">Accessories finish an outfit, so keep them minimal and coordinated: one leather story, one metal tone (gold for you), shoes that match the formality of your trousers.</PageHeader>
      <Section title="Matching rules">
        <div className="grid gap-3 md:grid-cols-3">{matchingRules.map((r) => <Card key={r.rule}><div className="font-medium">{r.rule}</div><p className="mt-1 text-sm text-choc-soft">{r.detail}</p></Card>)}</div>
      </Section>
      {accessoryGuides.map((g) => (
        <Section key={g.group} title={g.group}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{g.items.map((i) => <Card key={i.name}><div className="font-serif text-lg font-semibold">{i.name}</div><p className="mt-1 text-sm text-choc-soft">{i.what}</p><p className="mt-2 rounded bg-sand/60 p-2 text-xs"><b>For you:</b> {i.forMe}</p></Card>)}</div>
        </Section>
      ))}
      <Section title="Trouser break and sock guide">
        <Card>
          <svg viewBox="0 0 400 120" className="w-full max-w-xl">
            {[['No break', 0], ['Quarter', 6], ['Half', 12], ['Full', 20]].map(([n, b], i) => (
              <g key={n as string} transform={`translate(${i * 100 + 20},0)`}>
                <rect x="10" y="0" width="40" height={80 + (b as number)} fill="#6B6B3A" />
                {(b as number) > 0 && <path d={`M10,${70 + (b as number) / 2} q20,${b} 40,0`} stroke="#3F4326" fill="none" strokeWidth="2" />}
                <path d="M2,86 h56 q6,0 4,8 h-60 z" fill="#4E3426" />
                <text x="30" y="112" textAnchor="middle" fontSize="11" fill="#3B2A20">{n as string}</text>
              </g>
            ))}
          </svg>
          <p className="mt-3 text-sm text-choc-soft">A quarter or half break suits you: it keeps the leg line long. A full break pools fabric and shortens the leg. Socks: formal socks match the trouser; with loafers and sneakers, wear no-show socks.</p>
        </Card>
      </Section>
      <Section title="My accessory and footwear inventory" sub="Treated as real inventory. Outfits recommend the best owned accessory automatically.">
        <div className="grid gap-4 md:grid-cols-2">{['footwear', 'accessory'].map((s) => <Card key={s}><div className="mb-1 text-xs uppercase tracking-wider text-choc-soft">{s === 'footwear' ? 'Footwear' : 'Accessories'}</div><div className="divide-y divide-camel-light/50">{acc.filter((p) => p.kind.slot === s).map((p) => <PieceStatusRow key={p.id} pieceId={p.id} label={p.name} />)}</div></Card>)}</div>
      </Section>
    </div>
  );
}
