import type { Design, MotifLayer } from '../types';
import { index2d } from '../utils/arrays';

function mapMotifLayer(design: Design, layerId: string, fn: (layer: MotifLayer) => MotifLayer): Design {
  return {
    ...design,
    layers: design.layers.map((layer) => {
      if (layer.kind !== 'motif' || layer.id !== layerId) {
        return layer;
      }
      return fn(layer);
    })
  };
}

export function setMotifCell(
  design: Design,
  layerId: string,
  x: number,
  y: number,
  colorRef: number
): Design {
  return mapMotifLayer(design, layerId, (layer) => {
    if (x < 0 || y < 0 || x >= layer.width || y >= layer.height) {
      return layer;
    }
    const next = new Uint16Array(layer.cells);
    next[index2d(x, y, layer.width)] = colorRef;
    return { ...layer, cells: next };
  });
}
