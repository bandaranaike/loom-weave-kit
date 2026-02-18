import type { Zone } from './types';

export function defaultSareeZones(widthCells: number, heightCells: number): Zone[] {
  const border = Math.max(1, Math.floor(widthCells * 0.05));
  const palluHeight = Math.max(1, Math.floor(heightCells * 0.2));
  return [
    { name: 'BORDER_LEFT', x: 0, y: 0, w: border, h: heightCells },
    { name: 'BORDER_RIGHT', x: widthCells - border, y: 0, w: border, h: heightCells },
    { name: 'PALLU_END', x: 0, y: heightCells - palluHeight, w: widthCells, h: palluHeight },
    {
      name: 'BODY',
      x: border,
      y: 0,
      w: Math.max(0, widthCells - border * 2),
      h: Math.max(0, heightCells - palluHeight)
    }
  ];
}
