import { Link } from 'react-router-dom';
import { collections, outfits } from '../data/outfits';
import { Eyebrow, LookImage } from '../components/Catalog';
import { useRenders } from '../components/OutfitCard';

const groups: { name: string; ids: string[] }[] = [
  { name: 'New this season', ids: ['stripes', 'checks', 'prints', 'textures', 'coords', 'relaxed', 'indian-new'] },
  { name: 'Shirts', ids: ['linen', 'oxford', 'cotton', 'twill', 'utility', 'band', 'printed'] },
  { name: 'Knits & tees', ids: ['polo', 'tees', 'knitwear'] },
  { name: 'Trousers', ids: ['chinos', 'jeans', 'formal-trousers', 'cargo'] },
  { name: 'Layers & tailoring', ids: ['overshirts', 'jackets', 'blazers', 'suits'] },
  { name: 'Moments', ids: ['date', 'travel', 'summer', 'winter'] },
  { name: 'Indian wear', ids: ['traditional', 'wedding'] },
];

export function Lookbook() {
  const renders = useRenders();
  const looks = (cid: string) => outfits.filter((o) => o.collection === cid);
  const cover = (cid: string) => looks(cid).filter((o) => renders.has(o.id));
  return (
    <div>
      <div className="mb-12 max-w-2xl"><Eyebrow>{collections.length} collections · {outfits.length} looks</Eyebrow><h1 className="mt-2 font-serif text-5xl md:text-6xl">Collections</h1><p className="mt-3 text-[15px] leading-relaxed text-choc-soft">Each collection explores one garment or moment in depth, with four to six complete looks photographed on you, every one broken down piece by piece.</p></div>
      {groups.filter((g) => g.ids.some((id) => cover(id).length > 0)).map((g) => (
        <section key={g.name} className="mb-16">
          <h2 className="mb-6 border-b border-camel-light/70 pb-3 font-serif text-3xl">{g.name}</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {g.ids.filter((id) => cover(id).length > 0).map((id) => {
              const c = collections.find((x) => x.id === id)!;
              const cv = cover(id);
              const main = cv[0] ?? looks(id)[0];
              const thumbs = (cv.length > 1 ? cv : looks(id)).slice(1, 4);
              return (
                <Link key={id} to={`/outfits?c=${id}`} className="group block">
                  <div className="grid aspect-[1/1] grid-cols-[2fr_1fr] gap-1.5">
                    <div className="relative h-full min-h-0 overflow-hidden bg-sand"><div className="h-full transition duration-500 group-hover:scale-[1.03]"><LookImage o={main} /></div></div>
                    <div className="grid h-full min-h-0 grid-rows-3 gap-1.5">{thumbs.map((t) => <div key={t.id} className="relative min-h-0 overflow-hidden bg-sand"><LookImage o={t} /></div>)}</div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between"><span className="font-serif text-2xl">{c.name}</span><span className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">{looks(id).length} looks</span></div>
                  <p className="mt-1 text-sm text-choc-soft">{c.blurb}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
