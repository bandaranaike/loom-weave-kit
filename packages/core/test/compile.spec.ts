import { describe, expect, it } from 'vitest';
import {
  addGridLayer,
  addMotifLayer,
  addMixedColor,
  compileDesign,
  createDesign,
  createPalette,
  exportCompiledJSON,
  setMotifCell,
  setCell
} from '../src';

describe('compile', () => {
  it('is deterministic for same input', () => {
    const palette = createPalette([
      { id: 1, name: 'A', hex: '#000000' },
      { id: 2, name: 'B', hex: '#FFFFFF' }
    ]);
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 8,
      heightCells: 8
    });
    design = addGridLayer(design, { id: 'g1' });
    design = setCell(design, 'g1', 1, 1, 1);
    design = setCell(design, 'g1', 2, 1, 2);
    const a = compileDesign(design, { palette });
    const b = compileDesign(design, { palette });
    expect(exportCompiledJSON(a)).toBe(exportCompiledJSON(b));
  });

  it('repeats motif tiles during rasterization', () => {
    const palette = createPalette([{ id: 1, name: 'A', hex: '#000000' }]);
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 6,
      heightCells: 2
    });
    design = addMotifLayer(design, {
      id: 'm1',
      x: 0,
      y: 0,
      width: 2,
      height: 1,
      repeatX: 3,
      repeatY: 1
    });
    design = setMotifCell(design, 'm1', 0, 0, 1);
    const compiled = compileDesign(design, { palette });
    expect(compiled.rleRows[0][0]).toEqual([1, 1]);
    expect(compiled.rleRows[0].length).toBeGreaterThan(1);
  });

  it('handles large motif repeat stress case', () => {
    const palette = createPalette([{ id: 1, name: 'A', hex: '#000000' }]);
    let design = createDesign({
      productType: 'BEDSHEET',
      fabricId: 'COTTON',
      widthCells: 120,
      heightCells: 40
    });
    design = addMotifLayer(design, {
      id: 'm1',
      x: 0,
      y: 0,
      width: 3,
      height: 2,
      repeatX: 30,
      repeatY: 10,
      stepX: 4,
      stepY: 3
    });
    design = setMotifCell(design, 'm1', 0, 0, 1);
    design = setMotifCell(design, 'm1', 1, 0, 1);
    design = setMotifCell(design, 'm1', 2, 1, 1);

    const compiled = compileDesign(design, { palette });
    expect(compiled.metrics.totalCells).toBe(4800);
    expect(compiled.rleRows.length).toBe(40);
    expect(compiled.rowInstructions.length).toBe(40);
  });

  it('materializes mixed colors deterministically under stress', () => {
    let palette = createPalette([
      { id: 1, name: 'A', hex: '#111111' },
      { id: 2, name: 'B', hex: '#DDDDDD' },
      { id: 3, name: 'C', hex: '#44AA44' }
    ]);
    palette = addMixedColor(palette, {
      id: 100,
      name: 'M1',
      a: 1,
      b: 2,
      ratio: '50/50',
      tile: '2x2'
    });
    palette = addMixedColor(palette, {
      id: 101,
      name: 'M2',
      a: 2,
      b: 3,
      ratio: '75/25',
      tile: '4x4'
    });

    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'RAYON',
      widthCells: 32,
      heightCells: 32
    });
    design = addGridLayer(design, { id: 'g1' });
    for (let y = 0; y < 32; y += 1) {
      for (let x = 0; x < 32; x += 1) {
        const mixedId = (x + y) % 2 === 0 ? 100 : 101;
        design = setCell(design, 'g1', x, y, mixedId);
      }
    }

    const a = compileDesign(design, { palette });
    const b = compileDesign(design, { palette });
    expect(exportCompiledJSON(a)).toBe(exportCompiledJSON(b));
    expect(a.metrics.distinctMixedColorsUsed).toBe(2);
    expect(a.rleRows.every((row) => row.every(([id]) => id < 100))).toBe(true);
  });
});
