import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imageAssets, imageFolders } from '../data/imageAssets';
import { outfitById, collections } from '../data/outfits';
import { useStore } from '../lib/store';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { Badge, Card, Note, PageHeader, Section, Table } from '../components/ui';
import { OutfitVisual, useRenders } from '../components/OutfitCard';
import { profile } from '../data/content';

export function Visualize() {
  const { state } = useStore();
  const renders = useRenders();
  const [folder, setFolder] = useState('all');
  const folders = [...new Set(Object.values(imageFolders)), 'accessories'];
  const list = imageAssets.filter((a) => folder === 'all' || a.folder === folder);
  const own = Object.keys(state.photos).length;
  return (
    <div>
      <PageHeader eyebrow="Personal photo-based lookbook" title="Virtual Try-On / Style Visualizations">
        Every outfit has a reserved slot for a personalised render of <b>you</b> wearing it, generated from your reference photo with your face, skin tone, beard, hair, glasses and current proportions preserved.
      </PageHeader>

      <div className="mb-8 grid gap-4 md:grid-cols-[240px_1fr]">
        <Card className="p-3"><ProfilePhoto className="h-80" /><p className="mt-2 text-center text-xs text-choc-soft">Primary reference · {profile.photoDate}</p></Card>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card><div className="text-xs uppercase text-choc-soft">Personalised renders</div><div className="font-serif text-4xl text-olive">{renders.size}<span className="text-lg text-choc-soft"> / {imageAssets.length}</span></div><div className="text-xs text-choc-soft">{imageAssets.length - renders.size} pending</div></Card>
            <Card><div className="text-xs uppercase text-choc-soft">Your own outfit photos</div><div className="font-serif text-4xl text-olive">{own}</div><div className="text-xs text-choc-soft">uploaded on outfit pages</div></Card>
            <Card><div className="text-xs uppercase text-choc-soft">Illustrations</div><div className="font-serif text-4xl text-olive">{imageAssets.length}</div><div className="text-xs text-choc-soft">proportion studies, always available</div></Card>
          </div>
          <Note tone="warn">
            <b>Status, honestly:</b> {renders.size === 0 ? 'no personalised renders have been generated yet.' : `${renders.size} renders exist; the rest are pending.`} The build environment had no image-generation tool. A pending outfit shows a flat illustration drawn from your tape measurements. It is a proportion study, not a likeness of you, and it never pretends to be a photo. Generated images must keep your identity: if a generator cannot keep your face, beard, skin tone and body proportions consistent, the image is rejected rather than published.
          </Note>
          <Card className="text-sm">
            <div className="font-medium">Display priority on every outfit</div>
            <ol className="mt-1 list-decimal pl-5 text-choc-soft"><li>Your own photo wearing the outfit (upload on any outfit page; it stays in your browser)</li><li>A personalised render, if listed in <code>public/images/outfits/manifest.json</code></li><li>The proportion illustration</li></ol>
          </Card>
        </div>
      </div>

      <Section title="Image asset library" sub="One file per outfit, organised by folder, each tied to its outfit metadata.">
        <div className="mb-4 flex flex-wrap gap-2">{['all', ...folders].map((f) => <button key={f} onClick={() => setFolder(f)} className={`rounded-full border px-3 py-1 text-xs ${folder === f ? 'border-olive bg-olive text-ivory' : 'border-camel-light bg-paper'}`}>{f} {f !== 'all' && `(${imageAssets.filter((a) => a.folder === f).length})`}</button>)}</div>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {list.slice(0, 12).map((a) => <Link key={a.outfitId} to={`/outfit/${a.outfitId}`} className="rounded-lg border border-camel-light/60 bg-paper p-2 text-center"><OutfitVisual o={outfitById[a.outfitId]} className="h-40" /><div className="mt-1 truncate text-[11px]">{outfitById[a.outfitId].name}</div></Link>)}
        </div>
        <Table head={['Outfit', 'Collection', 'Folder', 'File', 'Status']} rows={list.map((a) => [<Link to={`/outfit/${a.outfitId}`} className="underline">{a.outfitId}</Link>, collections.find((c) => c.id === outfitById[a.outfitId].collection)?.name, a.folder, <code className="text-[11px]">{a.path}</code>, renders.has(a.outfitId) ? <Badge tone="green">available</Badge> : state.photos[a.outfitId] ? <Badge tone="teal">your photo</Badge> : <Badge tone="amber">pending</Badge>])} />
        <p className="mt-2 text-xs text-choc-soft">The accessories folder is reserved for footwear and accessory close-ups. It has no assets yet.</p>
      </Section>

      <Section title="Render specification" sub="The brief every personalised image must meet. Generation runs through fal.ai after the one-outfit test is approved.">
        <Card className="text-sm leading-relaxed">
          <ul className="list-disc space-y-1 pl-5">
            <li>Reference: the 10 Nov 2026 full-body mirror photo, used as the identity image for every request.</li>
            <li>Preserve: face, medium-tan warm skin, short curly dark hair, full short beard, thin gold-tone metal glasses (unless the outfit specifies sunglasses), height of about 6′1″, current shoulder and midsection proportions. No slimming, no added muscle.</li>
            <li>Show: a full-length, head-to-toe front view on a neutral warm-ivory studio background, with every listed garment in its exact catalogue colour, plus the shoes, belt, watch and eyewear.</li>
            <li>Output: a portrait WebP at the asset path, then the outfit id is added to <code>manifest.json</code>.</li>
            <li>Labels: renders are marked "Personalised render", never "photo", and never presented as real brand products.</li>
          </ul>
        </Card>
      </Section>
    </div>
  );
}
