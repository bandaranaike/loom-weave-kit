import type { ProductSpec, ProductType } from './types';
import { assert } from './utils/assert';
import { getProductSpecsMap, listProductSpecs as allProductSpecs } from './products/specs';
import { validateSize as validateProductSize } from './products/validate';

export function listProductSpecs(): ProductSpec[] {
  return allProductSpecs();
}

export function getProductSpec(type: ProductType): ProductSpec {
  const spec = getProductSpecsMap()[type];
  assert(spec, `Unknown product type: ${type}`);
  return spec;
}

export { validateProductSize as validateSize };
