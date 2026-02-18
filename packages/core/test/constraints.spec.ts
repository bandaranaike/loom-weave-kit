import { describe, expect, it } from 'vitest';
import {
  addGridLayer,
  addMotifLayer,
  addVectorLayer,
  applyAutoFix,
  compileDesign,
  createDesign,
  createPalette,
  setMotifCell,
  setCell,
  vectorDrawLine,
  validateDesign
} from '../src';

describe('constraints', () => {
  it('triggers run length warning for noisy rows', () => {
    const palette = createPalette([
      { id: 1, name: 'A', hex: '#000000' },
      { id: 2, name: 'B', hex: '#FFFFFF' }
    ]);
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 16,
      heightCells: 1
    });
    design = addGridLayer(design, { id: 'g1' });
    for (let x = 0; x < 16; x += 1) {
      design = setCell(design, 'g1', x, 0, x % 2 === 0 ? 1 : 2);
    }
    const compiled = compileDesign(design, { palette });
    const report = validateDesign(design, { palette, config: { maxRunsPerRow: 4 } });
    expect(compiled.rleRows[0].length).toBe(16);
    expect(report.issues.some((i) => i.id === 'run-length')).toBe(true);
  });

  it('applies replace-color autofix', () => {
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 4,
      heightCells: 1
    });
    design = addGridLayer(design, { id: 'g1' });
    design = setCell(design, 'g1', 0, 0, 1);
    const fixed = applyAutoFix(design, {
      kind: 'replace-color',
      message: 'replace',
      payload: { from: 1, to: 2 }
    });
    const compiled = compileDesign(fixed, {
      palette: createPalette([
        { id: 1, name: 'A', hex: '#000000' },
        { id: 2, name: 'B', hex: '#FFFFFF' }
      ])
    });
    expect(compiled.rleRows[0][0][0]).toBe(2);
  });

  it('clamps motif and vector coordinates with move-inset autofix', () => {
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 8,
      heightCells: 8
    });
    design = addMotifLayer(design, {
      id: 'm1',
      x: 0,
      y: 0,
      width: 3,
      height: 3
    });
    design = setMotifCell(design, 'm1', 0, 0, 1);
    design = addVectorLayer(design, { id: 'v1' });
    design = vectorDrawLine(design, 'v1', 0, 0, 7, 7, 1);

    const fixed = applyAutoFix(design, {
      kind: 'move-inset',
      message: 'inset',
      payload: { inset: 2 }
    });

    const motif = fixed.layers.find((l) => l.kind === 'motif');
    const vector = fixed.layers.find((l) => l.kind === 'vector');
    if (!motif || motif.kind !== 'motif' || !vector || vector.kind !== 'vector') {
      throw new Error('Expected motif/vector layers');
    }
    expect(motif.x).toBeGreaterThanOrEqual(2);
    expect(motif.y).toBeGreaterThanOrEqual(2);
    expect(vector.commands[0].x1).toBeGreaterThanOrEqual(2);
    expect(vector.commands[0].y1).toBeGreaterThanOrEqual(2);
    expect(vector.commands[0].x2).toBeLessThanOrEqual(5);
    expect(vector.commands[0].y2).toBeLessThanOrEqual(5);
  });
});
