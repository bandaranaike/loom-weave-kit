import type { BaseColor, Palette } from '../types';
import { normalizeHex } from '../utils/color';

export function createPalette(base: BaseColor[]): Palette {
  return {
    base: base.map((c) => ({ ...c, hex: normalizeHex(c.hex) })),
    mixed: []
  };
}
