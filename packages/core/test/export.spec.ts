import { describe, expect, it } from 'vitest';
import { addGridLayer, compileDesign, createDesign, createPalette, exportSVG, setCell } from '../src';

describe('exports', () => {
  it('validates mixed color recipe', async () => {
    const { addMixedColor } = await import('../src');
    const palette = createPalette([
      { id: 1, name: 'A', hex: '#000000' },
      { id: 2, name: 'B', hex: '#FFFFFF' }
    ]);
    expect(() =>
      addMixedColor(palette, { id: 100, name: 'M1', a: 99, b: 2, ratio: '50/50', tile: '2x2' })
    ).toThrow();
  });

  it('exports svg string', () => {
    const palette = createPalette([
      { id: 1, name: 'A', hex: '#000000' },
      { id: 2, name: 'B', hex: '#FFFFFF' }
    ]);
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 4,
      heightCells: 4
    });
    design = addGridLayer(design, { id: 'g1' });
    design = setCell(design, 'g1', 1, 1, 1);
    const compiled = compileDesign(design, { palette });
    const svg = exportSVG(compiled, palette);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.length).toBeGreaterThan(20);
  });
});
