import type { Design, FabricId, ProductType, Zone } from '../types';

export interface CreateDesignInput {
  id?: string;
  productType: ProductType;
  fabricId: FabricId;
  widthCells: number;
  heightCells: number;
  zones?: Zone[];
}

export function createDesign(input: CreateDesignInput): Design {
  return {
    id: input.id ?? `design_${Date.now()}`,
    productType: input.productType,
    fabricId: input.fabricId,
    widthCells: input.widthCells,
    heightCells: input.heightCells,
    layers: [],
    zones: input.zones
  };
}
