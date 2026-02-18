# 03 Export Canvas Package (`@erbitron/loom-weave-kit-export-canvas`)

## Scope

Browser-only PNG exporting for compiled weave output.

## Requirements

- Support `OffscreenCanvas` when available.
- Fallback to `HTMLCanvasElement`.
- Input: compiled weave grid (RLE and/or inflated) + palette.
- Output: `Promise<Blob | Uint8Array>`.

## Boundary Rule

- DOM/canvas usage is allowed here.
- Do not move this functionality into core.

