import type { ProductSpec } from '../types';

const PRODUCT_SPECS: ProductSpec[] = [
  {
    type: 'SAREE',
    name: 'Saree',
    widthCm: 115,
    heightCm: 550,
    minWidthCm: 110,
    maxWidthCm: 125,
    minHeightCm: 500,
    maxHeightCm: 600
  },
  {
    type: 'SARONG',
    name: 'Sarong',
    widthCm: 110,
    heightCm: 200,
    minWidthCm: 90,
    maxWidthCm: 130,
    minHeightCm: 150,
    maxHeightCm: 230
  },
  {
    type: 'WALL_HANGER',
    name: 'Wall Hanger',
    widthCm: 60,
    heightCm: 120,
    minWidthCm: 30,
    maxWidthCm: 120,
    minHeightCm: 50,
    maxHeightCm: 250
  },
  {
    type: 'PILLOW_CASE',
    name: 'Pillow Case',
    widthCm: 50,
    heightCm: 75,
    minWidthCm: 35,
    maxWidthCm: 80,
    minHeightCm: 50,
    maxHeightCm: 110
  },
  {
    type: 'BEDSHEET',
    name: 'Bedsheet',
    widthCm: 180,
    heightCm: 240,
    minWidthCm: 120,
    maxWidthCm: 260,
    minHeightCm: 180,
    maxHeightCm: 320
  }
];

export function listProductSpecs(): ProductSpec[] {
  return PRODUCT_SPECS.slice();
}

export function getProductSpecsMap(): Record<string, ProductSpec> {
  return PRODUCT_SPECS.reduce<Record<string, ProductSpec>>((acc, spec) => {
    acc[spec.type] = spec;
    return acc;
  }, {});
}
