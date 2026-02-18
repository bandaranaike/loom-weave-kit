import type { CompiledOutput, Palette } from '../types';

function paletteMap(palette: Palette): Map<number, string> {
  const map = new Map<number, string>();
  for (const base of palette.base) map.set(base.id, base.hex);
  for (const mixed of palette.mixed) {
    const a = palette.base.find((b) => b.id === mixed.recipe.a)?.hex ?? '#888888';
    const b = palette.base.find((bb) => bb.id === mixed.recipe.b)?.hex ?? '#444444';
    map.set(mixed.id, `url(#m${mixed.id})`);
    map.set(mixed.id + 10000, `${a},${b}`);
  }
  map.set(0, '#FFFFFF');
  return map;
}

export function exportSVG(
  compiled: CompiledOutput,
  palette: Palette,
  options?: { cellSizePx?: number; showGrid?: boolean }
): string {
  const cell = options?.cellSizePx ?? 6;
  const widthPx = compiled.widthCells * cell;
  const heightPx = compiled.heightCells * cell;
  const colors = paletteMap(palette);
  const defs: string[] = [];
  for (const mixed of palette.mixed) {
    const [a, b] = (colors.get(mixed.id + 10000) ?? '#888888,#444444').split(',');
    defs.push(
      `<pattern id="m${mixed.id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${a}"/><path d="M0 0 L4 4 M4 0 L0 4" stroke="${b}" stroke-width="1"/></pattern>`
    );
  }
  const rects: string[] = [];
  for (let y = 0; y < compiled.heightCells; y += 1) {
    let x = 0;
    for (const [id, count] of compiled.rleRows[y]) {
      if (id !== 0) {
        rects.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${count * cell}" height="${cell}" fill="${colors.get(id) ?? '#000000'}"/>`
        );
      }
      x += count;
    }
  }
  const grid = options?.showGrid
    ? `<path d="${Array.from({ length: compiled.widthCells + 1 })
        .map((_, i) => `M${i * cell} 0 V${heightPx}`)
        .concat(Array.from({ length: compiled.heightCells + 1 }).map((_, i) => `M0 ${i * cell} H${widthPx}`))
        .join(' ')}" stroke="#D0D0D0" stroke-width="0.5"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthPx}" height="${heightPx}" viewBox="0 0 ${widthPx} ${heightPx}"><defs>${defs.join('')}</defs><rect width="${widthPx}" height="${heightPx}" fill="#FFFFFF"/>${rects.join('')}${grid}</svg>`;
}
