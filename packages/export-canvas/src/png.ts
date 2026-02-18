import { inflateRLE, type CompiledOutput, type Palette } from '@erbitron/loom-weave-kit';
import { createCanvasSurface } from './canvas';

export interface ExportPNGOptions {
  pixelSize?: number;
  output?: 'blob' | 'uint8';
}

function colorLookup(palette: Palette): Map<number, string> {
  const out = new Map<number, string>();
  for (const c of palette.base) out.set(c.id, c.hex);
  for (const c of palette.mixed) {
    const a = palette.base.find((b) => b.id === c.recipe.a)?.hex ?? '#777777';
    out.set(c.id, a);
  }
  out.set(0, '#FFFFFF');
  return out;
}

function ditherPick(tile: '2x2' | '4x4', ratio: '50/50' | '75/25' | '25/75', x: number, y: number): boolean {
  const size = tile === '2x2' ? 2 : 4;
  const total = size * size;
  const on = ratio === '50/50' ? total / 2 : ratio === '75/25' ? Math.round(total * 0.75) : Math.round(total * 0.25);
  const idx = (x % size) + (y % size) * size;
  return idx < on;
}

export async function exportPNG(
  compiled: CompiledOutput,
  palette: Palette,
  options: ExportPNGOptions = {}
): Promise<Blob | Uint8Array> {
  const pixelSize = options.pixelSize ?? 1;
  const width = compiled.widthCells * pixelSize;
  const height = compiled.heightCells * pixelSize;
  const { canvas, ctx } = createCanvasSurface(width, height);
  const map = colorLookup(palette);
  const mixedMap = new Map(palette.mixed.map((m) => [m.id, m]));
  const grid = compiled.grid ?? inflateRLE(compiled.rleRows, compiled.widthCells, compiled.heightCells);

  for (let y = 0; y < compiled.heightCells; y += 1) {
    for (let x = 0; x < compiled.widthCells; x += 1) {
      const id = grid[y * compiled.widthCells + x];
      const mixed = mixedMap.get(id);
      if (mixed) {
        const selectedBase = ditherPick(mixed.recipe.tile, mixed.recipe.ratio, x, y)
          ? mixed.recipe.a
          : mixed.recipe.b;
        ctx.fillStyle = map.get(selectedBase) ?? '#000000';
      } else {
        ctx.fillStyle = map.get(id) ?? '#000000';
      }
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }

  if ('convertToBlob' in canvas) {
    const blob = await (canvas as OffscreenCanvas).convertToBlob({ type: 'image/png' });
    if (options.output === 'uint8') {
      return new Uint8Array(await blob.arrayBuffer());
    }
    return blob;
  }

  const htmlCanvas = canvas as HTMLCanvasElement;
  const blob = await new Promise<Blob>((resolve, reject) => {
    htmlCanvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to generate PNG blob.'));
    }, 'image/png');
  });
  if (options.output === 'uint8') {
    return new Uint8Array(await blob.arrayBuffer());
  }
  return blob;
}
