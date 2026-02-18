import type { ProductType, SizeCm, ValidationResult } from '../types';
import { getProductSpecsMap } from './specs';

export function validateSize(type: ProductType, sizeCm: SizeCm): ValidationResult {
  const spec = getProductSpecsMap()[type];
  const errors: string[] = [];
  if (sizeCm.widthCm < spec.minWidthCm || sizeCm.widthCm > spec.maxWidthCm) {
    errors.push(`Width must be between ${spec.minWidthCm}cm and ${spec.maxWidthCm}cm.`);
  }
  if (sizeCm.heightCm < spec.minHeightCm || sizeCm.heightCm > spec.maxHeightCm) {
    errors.push(`Height must be between ${spec.minHeightCm}cm and ${spec.maxHeightCm}cm.`);
  }
  return { valid: errors.length === 0, errors };
}
