export function index2d(x: number, y: number, width: number): number {
  return y * width + x;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
