import type { MixedColorRecipe, Palette } from '../types';

const VALID_RATIOS = new Set(['50/50', '75/25', '25/75']);
const VALID_TILES = new Set(['2x2', '4x4']);

export function addMixedColor(palette: Palette, recipe: MixedColorRecipe): Palette {
  if (!VALID_RATIOS.has(recipe.ratio) || !VALID_TILES.has(recipe.tile)) {
    throw new Error('Invalid mixed color recipe ratio/tile.');
  }
  const hasA = palette.base.some((c) => c.id === recipe.a);
  const hasB = palette.base.some((c) => c.id === recipe.b);
  if (!hasA || !hasB) {
    throw new Error('Mixed color recipe references unknown base colors.');
  }
  const mixedId = recipe.id >= 100 ? recipe.id : 100 + palette.mixed.length;
  return {
    ...palette,
    mixed: [...palette.mixed, { id: mixedId, name: recipe.name, recipe: { ...recipe, id: mixedId } }]
  };
}
