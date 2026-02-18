import type { Design, Palette, VectorCommand } from '../types';
import { index2d } from '../utils/arrays';

function drawLine(grid: Uint16Array, width: number, height: number, c: VectorCommand): void {
  const x2 = c.x2 ?? c.x1;
  const y2 = c.y2 ?? c.y1;
  let cx = c.x1;
  let cy = c.y1;
  const dx = Math.abs(x2 - c.x1);
  const sx = c.x1 < x2 ? 1 : -1;
  const dy = -Math.abs(y2 - c.y1);
  const sy = c.y1 < y2 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    if (cx >= 0 && cy >= 0 && cx < width && cy < height) {
      grid[index2d(cx, cy, width)] = c.colorRef;
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
}

function fillRect(grid: Uint16Array, width: number, height: number, c: VectorCommand): void {
  const w = c.w ?? 0;
  const h = c.h ?? 0;
  for (let y = Math.max(0, c.y1); y < Math.min(height, c.y1 + h); y += 1) {
    for (let x = Math.max(0, c.x1); x < Math.min(width, c.x1 + w); x += 1) {
      grid[index2d(x, y, width)] = c.colorRef;
    }
  }
}

export function rasterizeDesign(design: Design, _palette?: Palette): Uint16Array {
  const grid = new Uint16Array(design.widthCells * design.heightCells);

  for (const layer of design.layers) {
    if (layer.kind === 'grid') {
      for (let y = 0; y < Math.min(design.heightCells, layer.height); y += 1) {
        for (let x = 0; x < Math.min(design.widthCells, layer.width); x += 1) {
          const v = layer.cells[index2d(x, y, layer.width)];
          if (v !== 0) grid[index2d(x, y, design.widthCells)] = v;
        }
      }
    } else if (layer.kind === 'vector') {
      for (const command of layer.commands) {
        if (command.type === 'fillRect') fillRect(grid, design.widthCells, design.heightCells, command);
        if (command.type === 'drawLine') drawLine(grid, design.widthCells, design.heightCells, command);
      }
    } else if (layer.kind === 'motif') {
      const repeatX = layer.repeatX ?? 1;
      const repeatY = layer.repeatY ?? 1;
      const stepX = layer.stepX ?? layer.width;
      const stepY = layer.stepY ?? layer.height;
      for (let ry = 0; ry < repeatY; ry += 1) {
        for (let rx = 0; rx < repeatX; rx += 1) {
          const offsetX = layer.x + rx * stepX;
          const offsetY = layer.y + ry * stepY;
          for (let y = 0; y < layer.height; y += 1) {
            for (let x = 0; x < layer.width; x += 1) {
              const targetX = offsetX + x;
              const targetY = offsetY + y;
              if (
                targetX >= 0 &&
                targetY >= 0 &&
                targetX < design.widthCells &&
                targetY < design.heightCells
              ) {
                const v = layer.cells[index2d(x, y, layer.width)];
                if (v !== 0) grid[index2d(targetX, targetY, design.widthCells)] = v;
              }
            }
          }
        }
      }
    }
  }

  return grid;
}
