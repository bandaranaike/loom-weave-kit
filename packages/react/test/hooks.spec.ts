// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompile, useDesignHistory } from '../src';
import { createDesign, createPalette, addGridLayer, setCell } from '@erbitron/loom-weave-kit';

describe('react hooks', () => {
  it('tracks undo/redo history', () => {
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 4,
      heightCells: 4
    });
    design = addGridLayer(design, { id: 'g1' });
    const { result } = renderHook(() => useDesignHistory(design));

    act(() => {
      const next = setCell(result.current.present, 'g1', 1, 1, 1);
      result.current.commit(next);
    });
    expect(result.current.canUndo).toBe(true);

    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.redo());
    expect(result.current.canUndo).toBe(true);
  });

  it('returns compiled output and constraints', () => {
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 4,
      heightCells: 4
    });
    design = addGridLayer(design, { id: 'g1' });
    design = setCell(design, 'g1', 0, 0, 1);
    const palette = createPalette([
      { id: 1, name: 'A', hex: '#000000' },
      { id: 2, name: 'B', hex: '#FFFFFF' }
    ]);
    const { result } = renderHook(() => useCompile(design, palette));
    expect(result.current.loading).toBe(false);
    expect(result.current.compiled.widthCells).toBe(4);
    expect(Array.isArray(result.current.constraints.issues)).toBe(true);
  });
});
