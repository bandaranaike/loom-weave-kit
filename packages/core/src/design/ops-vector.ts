import type { Design, VectorLayer } from '../types';

function mapVectorLayer(
  design: Design,
  layerId: string,
  fn: (layer: VectorLayer) => VectorLayer
): Design {
  return {
    ...design,
    layers: design.layers.map((layer) => {
      if (layer.kind !== 'vector' || layer.id !== layerId) {
        return layer;
      }
      return fn(layer);
    })
  };
}

export function vectorFillRect(
  design: Design,
  layerId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  colorRef: number
): Design {
  return mapVectorLayer(design, layerId, (layer) => ({
    ...layer,
    commands: [...layer.commands, { type: 'fillRect', x1: x, y1: y, w, h, colorRef }]
  }));
}

export function vectorDrawLine(
  design: Design,
  layerId: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colorRef: number
): Design {
  return mapVectorLayer(design, layerId, (layer) => ({
    ...layer,
    commands: [...layer.commands, { type: 'drawLine', x1, y1, x2, y2, colorRef }]
  }));
}
