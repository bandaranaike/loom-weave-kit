import type { Design, GridLayer } from '../types';
import { clamp, index2d } from '../utils/arrays';

function mapGridLayer(design: Design, layerId: string, fn: (layer: GridLayer) => GridLayer): Design {
  return {
    ...design,
    layers: design.layers.map((layer) => {
      if (layer.kind !== 'grid' || layer.id !== layerId) {
        return layer;
      }
      return fn(layer);
    })
  };
}

export function setCell(design: Design, layerId: string, x: number, y: number, colorRef: number): Design {
  return mapGridLayer(design, layerId, (layer) => {
    if (x < 0 || y < 0 || x >= layer.width || y >= layer.height) {
      return layer;
    }
    const next = new Uint16Array(layer.cells);
    next[index2d(x, y, layer.width)] = colorRef;
    return { ...layer, cells: next };
  });
}

export function fillRect(
  design: Design,
  layerId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  colorRef: number
): Design {
  return mapGridLayer(design, layerId, (layer) => {
    const next = new Uint16Array(layer.cells);
    const xEnd = clamp(x + w, 0, layer.width);
    const yEnd = clamp(y + h, 0, layer.height);
    for (let yy = clamp(y, 0, layer.height); yy < yEnd; yy += 1) {
      for (let xx = clamp(x, 0, layer.width); xx < xEnd; xx += 1) {
        next[index2d(xx, yy, layer.width)] = colorRef;
      }
    }
    return { ...layer, cells: next };
  });
}

export function drawLine(
  design: Design,
  layerId: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colorRef: number
): Design {
  return mapGridLayer(design, layerId, (layer) => {
    const next = new Uint16Array(layer.cells);
    let cx = x1;
    let cy = y1;
    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;
    const dy = -Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;
    let err = dx + dy;
    while (true) {
      if (cx >= 0 && cy >= 0 && cx < layer.width && cy < layer.height) {
        next[index2d(cx, cy, layer.width)] = colorRef;
      }
      if (cx === x2 && cy === y2) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        cx += sx;
      }
      if (e2 <= dx) {
        err += dx;
        cy += sy;
      }
    }
    return { ...layer, cells: next };
  });
}
