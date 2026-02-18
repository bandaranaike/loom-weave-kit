import { describe, expect, it } from 'vitest';
import { exportPNG } from '../src';
import type { CompiledOutput, Palette } from '@erbitron/loom-weave-kit';

class MockContext2D {
  fillStyle = '#000000';
  fillRect(): void {}
}

class MockOffscreenCanvas {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  getContext(_type: string): MockContext2D {
    return new MockContext2D();
  }
  async convertToBlob(): Promise<Blob> {
    return new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });
  }
}

describe('exportPNG', () => {
  it('exports blob for compiled grid', async () => {
    (globalThis as unknown as { OffscreenCanvas: typeof MockOffscreenCanvas }).OffscreenCanvas =
      MockOffscreenCanvas;
    const compiled: CompiledOutput = {
      widthCells: 2,
      heightCells: 2,
      rleRows: [
        [
          [1, 1],
          [100, 1]
        ],
        [
          [2, 1],
          [1, 1]
        ]
      ],
      rowInstructions: [],
      metrics: {
        distinctBaseColorsUsed: 2,
        distinctMixedColorsUsed: 1,
        maxRunsInAnyRow: 2,
        totalCells: 4,
        widthCells: 2,
        heightCells: 2,
        estimatedWidthCm: 1,
        estimatedHeightCm: 1
      }
    };
    const palette: Palette = {
      base: [
        { id: 1, name: 'A', hex: '#000000' },
        { id: 2, name: 'B', hex: '#FFFFFF' }
      ],
      mixed: [{ id: 100, name: 'M1', recipe: { id: 100, name: 'M1', a: 1, b: 2, ratio: '50/50', tile: '2x2' } }]
    };

    const blob = await exportPNG(compiled, palette);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('exports Uint8Array output mode', async () => {
    (globalThis as unknown as { OffscreenCanvas: typeof MockOffscreenCanvas }).OffscreenCanvas =
      MockOffscreenCanvas;
    const compiled: CompiledOutput = {
      widthCells: 1,
      heightCells: 1,
      rleRows: [[[100, 1]]],
      rowInstructions: [],
      metrics: {
        distinctBaseColorsUsed: 1,
        distinctMixedColorsUsed: 1,
        maxRunsInAnyRow: 1,
        totalCells: 1,
        widthCells: 1,
        heightCells: 1,
        estimatedWidthCm: 1,
        estimatedHeightCm: 1
      }
    };
    const palette: Palette = {
      base: [
        { id: 1, name: 'A', hex: '#000000' },
        { id: 2, name: 'B', hex: '#FFFFFF' }
      ],
      mixed: [{ id: 100, name: 'M1', recipe: { id: 100, name: 'M1', a: 1, b: 2, ratio: '75/25', tile: '4x4' } }]
    };

    const bytes = await exportPNG(compiled, palette, { output: 'uint8' });
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);
  });
});
