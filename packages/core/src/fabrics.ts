import type { FabricId, FabricSpec } from './types';
import { getFabricsMap, listFabrics as allFabrics } from './fabrics/specs';
import { assert } from './utils/assert';

export function listFabrics(): FabricSpec[] {
  return allFabrics();
}

export function getFabricSpec(id: FabricId): FabricSpec {
  const fabric = getFabricsMap()[id];
  assert(fabric, `Unknown fabric id: ${id}`);
  return fabric;
}
