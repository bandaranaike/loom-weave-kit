import { describe, expect, it } from 'vitest';
import { getProductSpec, validateSize, listFabrics, createPalette, validatePalette } from '../src';

describe('core product/fabric/palette', () => {
  it('validates product size boundaries', () => {
    const saree = getProductSpec('SAREE');
    expect(validateSize('SAREE', { widthCm: saree.minWidthCm, heightCm: saree.minHeightCm }).valid).toBe(
      true
    );
    expect(validateSize('SAREE', { widthCm: saree.minWidthCm - 1, heightCm: saree.minHeightCm }).valid).toBe(
      false
    );
  });

  it('enforces palette limits by fabric', () => {
    const linen = listFabrics().find((f) => f.id === 'LINEN');
    if (!linen) throw new Error('Missing linen spec');
    const base = Array.from({ length: 7 }).map((_, i) => ({
      id: i + 1,
      name: `C${i + 1}`,
      hex: '#000000' as const
    }));
    const palette = createPalette(base);
    expect(validatePalette(palette, linen).valid).toBe(false);
  });
});
