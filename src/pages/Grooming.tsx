import { grooming } from '../data/content';
import { occasions } from '../data/occasions';
import { Badge, Card, Note, PageHeader, Section, Table } from '../components/ui';

export function Grooming() {
  return (
    <div>
      <PageHeader eyebrow="Diamond face · warm skin" title="Grooming & Fragrance">For a diamond face, the grooming goal is to add width at the forehead and jaw and soften the angle at the cheekbones. Your current curly-volume hair and full short beard are already well chosen.</PageHeader>
      <Section title="Hairstyles">
        <div className="grid gap-3 md:grid-cols-2">{grooming.hair.map((h) => <Card key={h.name}><div className="flex items-center gap-2"><span className="font-serif text-lg font-semibold">{h.name}</span><Badge tone={h.from === 'report' ? 'teal' : 'sand'}>{h.from === 'report' ? 'From report' : 'My advice'}</Badge></div><p className="mt-1 text-sm text-choc-soft">{h.detail}</p></Card>)}</div>
      </Section>
      <Section title="Beard">
        <div className="grid gap-3 md:grid-cols-2">{grooming.beard.map((h) => <Card key={h.name}><div className="flex items-center gap-2"><span className="font-serif text-lg font-semibold">{h.name}</span><Badge tone={h.from === 'report' ? 'teal' : 'sand'}>{h.from === 'report' ? 'From report' : 'My advice'}</Badge></div><p className="mt-1 text-sm text-choc-soft">{h.detail}</p></Card>)}</div>
        <Card className="mt-3"><svg viewBox="0 0 300 140" className="mx-auto h-36"><ellipse cx="80" cy="60" rx="40" ry="52" fill="#A9754F" /><path d="M42,66 Q42,118 80,116 Q118,118 118,66 Q108,96 80,94 Q52,96 42,66Z" fill="#2A1F19" /><text x="80" y="134" textAnchor="middle" fontSize="11">Rounded edges ✓</text><ellipse cx="220" cy="60" rx="40" ry="52" fill="#A9754F" /><path d="M182,66 L184,116 L256,116 L258,66 Q248,96 220,94 Q192,96 182,66Z" fill="#2A1F19" /><text x="220" y="134" textAnchor="middle" fontSize="11">Square boxed ✗</text></svg><p className="text-center text-xs text-choc-soft">A rounded bottom softens the narrow chin. A squared box beard exaggerates the angles.</p></Card>
      </Section>
      <Section title="Eyebrows & skincare">
        <div className="grid gap-3 md:grid-cols-2"><Card><div className="font-medium">Eyebrows</div><p className="mt-1 text-sm text-choc-soft">{grooming.eyebrows}</p></Card><Card><div className="font-medium">Skincare basics</div><ul className="mt-1 list-disc pl-5 text-sm text-choc-soft">{grooming.skincare.map((s) => <li key={s}>{s}</li>)}</ul></Card></div>
      </Section>
      <Section title="Your fragrance wardrobe (from your report)">
        <div className="grid gap-4 md:grid-cols-3">{grooming.fragrances.map((f) => <Card key={f.name}><div className="font-serif text-xl font-semibold">{f.name}</div><div className="text-sm text-rust">{f.family} · {f.intensity}</div><p className="mt-2 text-sm"><b>When:</b> {f.use}</p><p className="text-sm"><b>Longevity:</b> {f.longevity}</p><p className="mt-2 text-xs text-choc-soft">{f.notes}</p><p className="mt-2 text-xs text-choc-soft">{f.price}</p></Card>)}</div>
      </Section>
      <Section title="Fragrance families">
        <Table head={['Family', 'When it works']} rows={grooming.fragranceFamilies.map((f) => [<b>{f.name}</b>, f.when])} />
      </Section>
      <Section title="Which scent for which occasion">
        <Table head={['Occasion', 'Fragrance', 'Grooming']} rows={occasions.filter((_, i) => i % 3 === 0).map((o) => [o.name, o.fragrance, <span className="text-xs">{o.grooming}</span>])} />
      </Section>
      <Section title="Application">
        <Card><ul className="list-disc space-y-1 pl-5 text-sm">{grooming.application.map((a) => <li key={a}>{a}</li>)}</ul></Card>
        <div className="mt-3"><Note>Projection = how far the scent travels. Longevity = how long it lasts on skin. Bengaluru humidity increases projection and shortens longevity, so spray less and reapply at lunch if needed.</Note></div>
      </Section>
    </div>
  );
}
