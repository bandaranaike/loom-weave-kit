import type { FabricSpec, Palette, ValidationResult } from '../types';

export function validatePalette(palette: Palette, fabricSpec: FabricSpec): ValidationResult {
  const errors: string[] = [];
  const baseMax = fabricSpec.maxPaletteColors;
  if (palette.base.length > baseMax) {
    errors.push(`Base colors exceed limit ${baseMax}.`);
  }
  if (palette.mixed.length > 4) {
    errors.push('Mixed colors exceed limit 4.');
  }
  return { valid: errors.length === 0, errors };
}
