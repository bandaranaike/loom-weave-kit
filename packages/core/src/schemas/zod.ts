import { z } from 'zod';

export const productSpecSchema = z.object({
  type: z.string(),
  name: z.string(),
  widthCm: z.number().positive(),
  heightCm: z.number().positive(),
  minWidthCm: z.number().positive(),
  maxWidthCm: z.number().positive(),
  minHeightCm: z.number().positive(),
  maxHeightCm: z.number().positive()
});

export const fabricSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  cellsPerCmX: z.number().positive(),
  cellsPerCmY: z.number().positive(),
  maxPaletteColors: z.number().int().positive(),
  minFeatureWidthCells: z.number().int().positive()
});

export const designJsonSchema = z.object({
  id: z.string(),
  productType: z.string(),
  fabricId: z.string(),
  widthCells: z.number().int().positive(),
  heightCells: z.number().int().positive(),
  layers: z.array(z.any()),
  zones: z
    .array(
      z.object({
        name: z.string(),
        x: z.number().int(),
        y: z.number().int(),
        w: z.number().int().nonnegative(),
        h: z.number().int().nonnegative()
      })
    )
    .optional()
});

export const compiledJsonSchema = z.object({
  widthCells: z.number().int().positive(),
  heightCells: z.number().int().positive(),
  rleRows: z.array(z.array(z.tuple([z.number().int().nonnegative(), z.number().int().positive()]))),
  rowInstructions: z.array(z.string()),
  metrics: z.object({
    distinctBaseColorsUsed: z.number().int().nonnegative(),
    distinctMixedColorsUsed: z.number().int().nonnegative(),
    maxRunsInAnyRow: z.number().int().nonnegative(),
    totalCells: z.number().int().positive(),
    widthCells: z.number().int().positive(),
    heightCells: z.number().int().positive(),
    estimatedWidthCm: z.number().positive(),
    estimatedHeightCm: z.number().positive()
  })
});
