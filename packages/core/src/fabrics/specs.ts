import type { FabricSpec } from '../types';

const FABRICS: FabricSpec[] = [
  {
    id: 'COTTON',
    name: 'Cotton',
    cellsPerCmX: 2,
    cellsPerCmY: 2,
    maxPaletteColors: 8,
    minFeatureWidthCells: 2
  },
  {
    id: 'SILK_BLEND',
    name: 'Silk Blend',
    cellsPerCmX: 3,
    cellsPerCmY: 3,
    maxPaletteColors: 10,
    minFeatureWidthCells: 2
  },
  {
    id: 'LINEN',
    name: 'Linen',
    cellsPerCmX: 2,
    cellsPerCmY: 2,
    maxPaletteColors: 6,
    minFeatureWidthCells: 3
  },
  {
    id: 'RAYON',
    name: 'Rayon',
    cellsPerCmX: 3,
    cellsPerCmY: 3,
    maxPaletteColors: 8,
    minFeatureWidthCells: 2
  }
];

export function listFabrics(): FabricSpec[] {
  return FABRICS.slice();
}

export function getFabricsMap(): Record<string, FabricSpec> {
  return FABRICS.reduce<Record<string, FabricSpec>>((acc, fabric) => {
    acc[fabric.id] = fabric;
    return acc;
  }, {});
}
