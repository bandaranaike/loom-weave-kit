# 08 Exporters

## JSON (Core)

- Export design and compiled JSON as stable strings.

## SVG (Core)

- Pure string output.
- Default options:
- `cellSizePx = 6`
- `showGrid = false`
- Prefer run-merging optimization over per-cell rects when possible.

## Weaver Sheet Text (Core)

- Row format example:
- `Row 0001: A(10) B(4) M1(8) ...`
- Include color legend header.
- Use palette names when available.

## PNG (Canvas Package)

- `exportPNG(compiled, palette, options): Promise<Blob | Uint8Array>`
- This must stay outside core.

