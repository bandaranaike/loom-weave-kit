import type { Design, DesignJSON, GridLayer, MotifLayer } from '../types';

function layerToJson(layer: Design['layers'][number]): DesignJSON['layers'][number] {
  if (layer.kind === 'grid') {
    const grid = layer as GridLayer;
    return { ...grid, cells: Array.from(grid.cells) };
  }
  if (layer.kind === 'motif') {
    const motif = layer as MotifLayer;
    return { ...motif, cells: Array.from(motif.cells) };
  }
  return layer;
}

export function serializeDesign(design: Design): DesignJSON {
  return {
    id: design.id,
    productType: design.productType,
    fabricId: design.fabricId,
    widthCells: design.widthCells,
    heightCells: design.heightCells,
    layers: design.layers.map(layerToJson),
    zones: design.zones
  };
}

export function loadDesign(json: DesignJSON): Design {
  return {
    ...json,
    layers: json.layers.map((layer) => {
      if (layer.kind === 'grid') {
        return { ...layer, cells: Uint16Array.from(layer.cells) };
      }
      if (layer.kind === 'motif') {
        return { ...layer, cells: Uint16Array.from(layer.cells) };
      }
      return layer;
    })
  };
}
