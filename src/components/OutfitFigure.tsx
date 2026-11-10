import type { Measurements, Piece } from '../data/types';

const SKIN = '#A9754F';
const HAIR = '#1C1612';
const BEARD = '#2A1F19';

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt)));
  return `#${[c(n >> 16), c((n >> 8) & 255), c(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * A flat editorial illustration drawn from the real tape measurements (chest, stomach, hip, height).
 * It is a proportion study, not a photograph or a likeness.
 */
export function OutfitFigure({ top, bottom, footwear, outer, accessories = [], m, className = '' }: {
  top?: Piece; bottom?: Piece; footwear?: Piece; outer?: Piece; accessories?: Piece[]; m: Measurements; className?: string;
}) {
  // Front-view width ≈ circumference / π × 1.25 (an oval torso is wider than it is deep). Height 73 in ≈ 420 px.
  const pxPerIn = 420 / (m.height ?? 73);
  const k = (1.25 / Math.PI / 2) * pxPerIn; // px half-width per inch of circumference
  const ch = ((m.chest ?? 43.5) * k) / 1.0;
  const st = ((m.stomach ?? 41.9) * k) / 1.0;
  const hp = ((m.hip ?? 44.5) * k) / 1.04;
  const sh = ch + 7;
  const cx = 100;
  const Y = { sh: 88, ch: 116, st: 165, belt: 203, crotch: 226, knee: 322, ankle: 420 };

  const topHex = top?.colour.hex ?? '#E8E1D4';
  const botHex = bottom?.colour.hex ?? '#BDB3A1';
  const shoeHex = footwear?.colour.hex ?? '#FFFFFF';
  const belt = accessories.find((a) => a.kind.wardrobe === 'Belts');
  const watch = accessories.find((a) => a.kind.wardrobe === 'Watches');
  const glasses = accessories.find((a) => a.kind.wardrobe === 'Eyeglasses' || a.kind.wardrobe === 'Sunglasses');
  const shape = top?.kind.shape ?? 'tee';
  const kurta = shape === 'kurta';
  const longSleeve = ['shirt', 'shirt-band', 'knit', 'hoodie', 'turtleneck', 'kurta'].includes(shape) || top?.kind.id === 'henley-ls';
  const tucked = !kurta && (top?.kind.formality ?? 0) >= 4 && (bottom?.kind.formality ?? 0) >= 4;
  const hem = kurta ? 332 : tucked ? Y.belt : Y.crotch - 2;
  const hemHalf = kurta ? hp + 8 : tucked ? st : hp - 1;

  const torso = `M${cx - 9},70 L${cx - sh},${Y.sh} Q${cx - sh - 3},${Y.sh + 12} ${cx - ch},${Y.ch} L${cx - st - 1},${Y.st} L${cx - hemHalf},${hem} L${cx + hemHalf},${hem} L${cx + st + 1},${Y.st} L${cx + ch},${Y.ch} Q${cx + sh + 3},${Y.sh + 12} ${cx + sh},${Y.sh} L${cx + 9},70 Z`;

  const leg = bottom?.kind.legShape ?? 'straight';
  const open = { straight: 15, tapered: 11.5, relaxed: 18, jogger: 10.5, shorts: 18 }[leg];
  const legEnd = leg === 'shorts' ? 300 : Y.ankle;
  const legL = `M${cx - hp},${Y.belt} L${cx - hp + 1},${Y.crotch} L${cx - 3 - open * 2 + (leg === 'relaxed' ? -2 : 2)},${legEnd} L${cx - 3},${legEnd} L${cx - 2},${Y.crotch + 6} L${cx},${Y.belt + 18} Z`;
  const legR = `M${cx + hp},${Y.belt} L${cx + hp - 1},${Y.crotch} L${cx + 3 + open * 2 - (leg === 'relaxed' ? -2 : 2)},${legEnd} L${cx + 3},${legEnd} L${cx + 2},${Y.crotch + 6} L${cx},${Y.belt + 18} Z`;

  const armEnd = 252;
  const sleeveEnd = longSleeve ? armEnd - 6 : 140;
  const arm = (side: -1 | 1) => `M${cx + side * (sh - 2)},${Y.sh + 2} Q${cx + side * (sh + 12)},${Y.sh + 20} ${cx + side * (sh + 13)},${Y.ch + 30} L${cx + side * (sh + 15)},${armEnd} L${cx + side * (sh + 3)},${armEnd} L${cx + side * (sh - 1)},${Y.ch + 30} Z`;
  const sleeve = (side: -1 | 1, end: number) => `M${cx + side * (sh - 3)},${Y.sh} Q${cx + side * (sh + 13)},${Y.sh + 18} ${cx + side * (sh + 14)},${Math.min(end, Y.ch + 30)} L${cx + side * (sh + 16)},${end} L${cx + side * (sh + 1)},${end} L${cx + side * (sh - 3)},${Y.ch + 20} Z`;

  const os = outer?.kind.outerShape;
  const outerHex = outer?.colour.hex ?? '#000';
  const outerHem = os === 'coat' ? 345 : os === 'blazer' ? 250 : os === 'nehru' ? 236 : 236;
  const gap = os === 'nehru' ? 3 : os === 'cardigan' ? 12 : 15;
  const panel = (side: -1 | 1) => `M${cx + side * 9},70 L${cx + side * (sh + 2)},${Y.sh - 1} Q${cx + side * (sh + 5)},${Y.sh + 12} ${cx + side * (ch + 3)},${Y.ch} L${cx + side * (st + 6)},${Y.st} L${cx + side * (hp + 7)},${outerHem} L${cx + side * gap},${outerHem} L${cx + side * gap},${os === 'blazer' ? 160 : 110} L${cx + side * 6},${os === 'blazer' || os === 'cardigan' ? 92 : 76} Z`;

  return (
    <svg viewBox="0 0 200 450" className={className} role="img" aria-label="Outfit illustration drawn to your measurements">
      <ellipse cx={cx} cy={440} rx={58} ry={6} fill="#000" opacity={0.06} />
      {/* arms (skin) */}
      <path d={arm(-1)} fill={SKIN} />
      <path d={arm(1)} fill={SKIN} />
      {/* legs (skin under shorts) */}
      {leg === 'shorts' && <><rect x={cx - 26} y={296} width={20} height={124} rx={8} fill={SKIN} /><rect x={cx + 6} y={296} width={20} height={124} rx={8} fill={SKIN} /></>}
      {/* trousers */}
      <path d={legL} fill={botHex} stroke={shade(botHex, -25)} strokeWidth={0.8} />
      <path d={legR} fill={botHex} stroke={shade(botHex, -25)} strokeWidth={0.8} />
      {leg === 'jogger' && <><rect x={cx - 3 - open * 2 + 2} y={legEnd - 7} width={open * 2 - 1} height={7} fill={shade(botHex, -15)} /><rect x={cx + 3} y={legEnd - 7} width={open * 2 - 1} height={7} fill={shade(botHex, -15)} /></>}
      {/* shoes */}
      <path d={`M${cx - 6 - open * 2},${Y.ankle - 1} h${open * 2 + 3} v10 q0,6 -6,6 h-${open * 2 + 4} q-6,0 -4,-8 z`} fill={shoeHex} stroke={shade(shoeHex, -40)} strokeWidth={0.8} />
      <path d={`M${cx + 3},${Y.ankle - 1} h${open * 2 + 3} q4,8 -2,16 h-${open * 2 + 4} q-3,0 -1,-6 z`} fill={shoeHex} stroke={shade(shoeHex, -40)} strokeWidth={0.8} />
      {/* neck */}
      <rect x={cx - 9} y={60} width={18} height={20} fill={SKIN} />
      {/* top */}
      <path d={torso} fill={topHex} stroke={shade(topHex, -30)} strokeWidth={0.8} />
      <path d={sleeve(-1, sleeveEnd)} fill={topHex} stroke={shade(topHex, -30)} strokeWidth={0.8} />
      <path d={sleeve(1, sleeveEnd)} fill={topHex} stroke={shade(topHex, -30)} strokeWidth={0.8} />
      {kurta && <><line x1={cx - hemHalf + 3} y1={hem} x2={cx - hemHalf + 6} y2={hem - 40} stroke={shade(topHex, -35)} /><line x1={cx + hemHalf - 3} y1={hem} x2={cx + hemHalf - 6} y2={hem - 40} stroke={shade(topHex, -35)} /></>}
      {/* necklines */}
      {shape === 'tee' && <path d={`M${cx - 10},72 Q${cx},82 ${cx + 10},72`} fill="none" stroke={shade(topHex, -40)} strokeWidth={2} />}
      {(shape === 'henley' || shape === 'polo') && <line x1={cx} y1={76} x2={cx} y2={shape === 'polo' ? 104 : 110} stroke={shade(topHex, -40)} strokeWidth={1.2} />}
      {shape === 'henley' && <path d={`M${cx - 10},72 Q${cx},80 ${cx + 10},72`} fill="none" stroke={shade(topHex, -40)} strokeWidth={2} />}
      {shape === 'polo' && <><path d={`M${cx - 11},70 L${cx - 2},86 L${cx - 16},84 Z`} fill={shade(topHex, -12)} /><path d={`M${cx + 11},70 L${cx + 2},86 L${cx + 16},84 Z`} fill={shade(topHex, -12)} /></>}
      {shape === 'shirt' && <><path d={`M${cx - 11},68 L${cx - 1},88 L${cx - 18},86 Z`} fill={shade(topHex, 12)} stroke={shade(topHex, -35)} strokeWidth={0.6} /><path d={`M${cx + 11},68 L${cx + 1},88 L${cx + 18},86 Z`} fill={shade(topHex, 12)} stroke={shade(topHex, -35)} strokeWidth={0.6} /><line x1={cx} y1={88} x2={cx} y2={hem} stroke={shade(topHex, -30)} strokeWidth={0.8} /></>}
      {(shape === 'shirt-band' || shape === 'kurta') && <><rect x={cx - 10} y={64} width={20} height={7} rx={2} fill={shade(topHex, -10)} /><line x1={cx} y1={71} x2={cx} y2={kurta ? 150 : hem} stroke={shade(topHex, -30)} strokeWidth={0.8} /></>}
      {shape === 'knit' && <><path d={`M${cx - 11},71 Q${cx},84 ${cx + 11},71`} fill="none" stroke={shade(topHex, -30)} strokeWidth={3} /><rect x={cx - hemHalf} y={hem - 7} width={hemHalf * 2} height={7} fill={shade(topHex, -10)} /></>}
      {shape === 'turtleneck' && <rect x={cx - 11} y={56} width={22} height={18} rx={4} fill={shade(topHex, -8)} />}
      {shape === 'hoodie' && <path d={`M${cx - 20},74 Q${cx},96 ${cx + 20},74 Q${cx},84 ${cx - 20},74`} fill={shade(topHex, -12)} />}
      {/* belt */}
      {belt && tucked && <><rect x={cx - st - 1} y={Y.belt - 3} width={(st + 1) * 2} height={6} fill={belt.colour.hex} /><rect x={cx - 4} y={Y.belt - 4} width={8} height={8} fill="none" stroke="#C8A456" strokeWidth={1.5} /></>}
      {/* outer */}
      {outer && <>
        {os !== 'nehru' && <><path d={sleeve(-1, armEnd - 8)} fill={outerHex} stroke={shade(outerHex, -30)} strokeWidth={0.8} /><path d={sleeve(1, armEnd - 8)} fill={outerHex} stroke={shade(outerHex, -30)} strokeWidth={0.8} /></>}
        <path d={panel(-1)} fill={outerHex} stroke={shade(outerHex, -30)} strokeWidth={0.8} />
        <path d={panel(1)} fill={outerHex} stroke={shade(outerHex, -30)} strokeWidth={0.8} />
        {os === 'blazer' && <><path d={`M${cx - 6},92 L${cx - 15},160 L${cx - 24},110 Z`} fill={shade(outerHex, -14)} /><path d={`M${cx + 6},92 L${cx + 15},160 L${cx + 24},110 Z`} fill={shade(outerHex, -14)} /></>}
        {os === 'nehru' && <><rect x={cx - 10} y={64} width={20} height={7} rx={2} fill={shade(outerHex, -12)} />{[100, 130, 160, 190, 220].map((y) => <circle key={y} cx={cx - 5} cy={y} r={1.5} fill="#C8A456" />)}</>}
        {(os === 'overshirt' || os === 'jacket') && <><rect x={cx - ch + 4} y={112} width={16} height={14} rx={1.5} fill={shade(outerHex, -10)} /><rect x={cx + ch - 20} y={112} width={16} height={14} rx={1.5} fill={shade(outerHex, -10)} /></>}
      </>}
      {/* hands */}
      <circle cx={cx - sh - 9} cy={armEnd + 5} r={6.5} fill={SKIN} />
      <circle cx={cx + sh + 9} cy={armEnd + 5} r={6.5} fill={SKIN} />
      {watch && <rect x={cx - sh - 16} y={armEnd - 7} width={14} height={6} rx={2} fill={watch.colour.hex} stroke="#00000033" strokeWidth={0.5} />}
      {/* head */}
      <ellipse cx={cx} cy={42} rx={19} ry={23} fill={SKIN} />
      <path d={`M${cx - 20},40 Q${cx - 22},12 ${cx},14 Q${cx + 23},12 ${cx + 20},40 Q${cx + 16},26 ${cx + 6},28 Q${cx - 8},22 ${cx - 20},40 Z`} fill={HAIR} />
      <path d={`M${cx - 18},44 Q${cx - 18},70 ${cx},68 Q${cx + 18},70 ${cx + 18},44 Q${cx + 14},58 ${cx},57 Q${cx - 14},58 ${cx - 18},44 Z`} fill={BEARD} />
      {glasses && <g fill={glasses.kind.wardrobe === 'Sunglasses' ? '#3a2a1a' : 'none'} stroke="#C8A456" strokeWidth={1}>
        <path d={`M${cx - 15},38 h11 q1,8 -5,9 q-6,0 -6,-9 z`} />
        <path d={`M${cx + 4},38 h11 q0,9 -6,9 q-6,-1 -5,-9 z`} />
        <line x1={cx - 4} y1={38} x2={cx + 4} y2={38} />
      </g>}
    </svg>
  );
}
