import type { DitherTile, MixRatio } from '../types';

function ratioOnCells(ratio: MixRatio, tileSize: number): number {
  const total = tileSize * tileSize;
  if (ratio === '50/50') return total / 2;
  if (ratio === '75/25') return Math.round(total * 0.75);
  return Math.round(total * 0.25);
}

export function ditherPick(tile: DitherTile, ratio: MixRatio, x: number, y: number): boolean {
  const size = tile === '2x2' ? 2 : 4;
  const idx = (x % size) + (y % size) * size;
  return idx < ratioOnCells(ratio, size);
}
