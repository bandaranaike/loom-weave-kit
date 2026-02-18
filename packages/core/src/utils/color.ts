import type { HexColor } from '../types';

export function normalizeHex(hex: string): HexColor {
  const clean = hex.startsWith('#') ? hex : `#${hex}`;
  return clean.toUpperCase() as HexColor;
}

export function blendHex(a: HexColor, b: HexColor, ratio: number): HexColor {
  const parse = (v: string, offset: number) => parseInt(v.slice(offset, offset + 2), 16);
  const aR = parse(a, 1);
  const aG = parse(a, 3);
  const aB = parse(a, 5);
  const bR = parse(b, 1);
  const bG = parse(b, 3);
  const bB = parse(b, 5);
  const mix = (x: number, y: number) => Math.round(x * ratio + y * (1 - ratio));
  const out = [mix(aR, bR), mix(aG, bG), mix(aB, bB)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
  return `#${out.toUpperCase()}` as HexColor;
}
