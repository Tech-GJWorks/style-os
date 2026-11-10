import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { glossary } from '../data/content';
import { garments } from '../data/garments';
import { fabrics, weaves } from '../data/fabrics';
import { occasions } from '../data/occasions';
import { outfits } from '../data/outfits';
import { Badge, Card, PageHeader, inputCls } from '../components/ui';

export function SearchPage() {
  const [q, setQ] = useState('');
  const ql = q.toLowerCase().trim();
  const res = useMemo(() => {
    const has = (s: string) => !ql || s.toLowerCase().includes(ql);
    return {
      gl: glossary.filter((g) => has(g.term + ' ' + (g.q ?? '') + ' ' + g.a + g.tags.join(' '))),
      ga: ql ? garments.filter((g) => has(g.name + g.definition)) : [],
      fa: ql ? [...fabrics.map((f) => ({ t: f.name, d: f.what })), ...weaves.map((w) => ({ t: w.term, d: w.explain }))].filter((x) => has(x.t + x.d)) : [],
      oc: ql ? occasions.filter((o) => has(o.name + o.clothing)) : [],
      ou: ql ? outfits.filter((o) => has(o.name + o.why)) : [],
    };
  }, [ql]);
  return (
    <div>
      <PageHeader eyebrow="Glossary + site-wide search" title="Fashion Knowledge Search">Simple enough for a beginner, detailed enough to build real knowledge. Search terms, garments, fabrics, occasions and outfits.</PageHeader>
      <div className="relative mb-8 max-w-xl"><Search className="absolute left-3 top-3 h-4 w-4 text-choc-soft" /><input autoFocus className={`${inputCls} py-2.5 pl-9 text-base`} placeholder='Try "half break", "GSM", "Oxford vs poplin"…' value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {res.ga.length > 0 && <Group title="Garments">{res.ga.map((g) => <Link key={g.id} to={`/academy/${g.id}`}><Card className="hover:border-camel"><div className="font-medium">{g.name}</div><p className="text-xs text-choc-soft">{g.definition}</p></Card></Link>)}</Group>}
      {res.fa.length > 0 && <Group title="Fabrics & weaves">{res.fa.map((f) => <Link key={f.t} to="/fabrics"><Card className="hover:border-camel"><div className="font-medium">{f.t}</div><p className="line-clamp-3 text-xs text-choc-soft">{f.d}</p></Card></Link>)}</Group>}
      {res.oc.length > 0 && <Group title="Occasions">{res.oc.map((o) => <Link key={o.id} to={`/occasions/${o.id}`}><Card className="hover:border-camel"><div className="font-medium">{o.name}</div><p className="text-xs text-choc-soft">{o.clothing}</p></Card></Link>)}</Group>}
      {res.ou.length > 0 && <Group title="Outfits">{res.ou.slice(0, 9).map((o) => <Link key={o.id} to={`/outfit/${o.id}`}><Card className="hover:border-camel"><div className="font-medium">{o.name}</div><p className="line-clamp-2 text-xs text-choc-soft">{o.why}</p></Card></Link>)}</Group>}
      <Group title={`Glossary (${res.gl.length})`}>
        {res.gl.map((g) => (
          <Card key={g.term}>
            <div className="font-serif text-lg font-semibold">{g.q ?? g.term}</div>
            <p className="mt-1 text-sm leading-relaxed text-choc-soft">{g.a}</p>
            <div className="mt-2 flex flex-wrap gap-1">{g.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
          </Card>
        ))}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mb-8"><h2 className="mb-3 font-serif text-2xl font-semibold">{title}</h2><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{children}</div></section>;
}
