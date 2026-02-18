import type { Design, GridLayer, MotifLayer, VectorLayer } from '../types';

export function addGridLayer(
  design: Design,
  opts?: { id?: string; width?: number; height?: number }
): Design {
  const width = opts?.width ?? design.widthCells;
  const height = opts?.height ?? design.heightCells;
  const layer: GridLayer = {
    id: opts?.id ?? `grid_${design.layers.length + 1}`,
    kind: 'grid',
    width,
    height,
    cells: new Uint16Array(width * height)
  };
  return { ...design, layers: [...design.layers, layer] };
}

export function addVectorLayer(design: Design, opts?: { id?: string }): Design {
  const layer: VectorLayer = {
    id: opts?.id ?? `vector_${design.layers.length + 1}`,
    kind: 'vector',
    commands: []
  };
  return { ...design, layers: [...design.layers, layer] };
}

export function addMotifLayer(
  design: Design,
  opts: {
    id?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    cells?: Uint16Array;
    repeatX?: number;
    repeatY?: number;
    stepX?: number;
    stepY?: number;
  }
): Design {
  const layer: MotifLayer = {
    id: opts.id ?? `motif_${design.layers.length + 1}`,
    kind: 'motif',
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: opts.height,
    cells: opts.cells ?? new Uint16Array(opts.width * opts.height),
    repeatX: opts.repeatX ?? 1,
    repeatY: opts.repeatY ?? 1,
    stepX: opts.stepX ?? opts.width,
    stepY: opts.stepY ?? opts.height
  };
  return { ...design, layers: [...design.layers, layer] };
}
