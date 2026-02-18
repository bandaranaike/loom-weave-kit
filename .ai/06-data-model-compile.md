# 06 Data Model + Compile Encoding

## ColorRef Encoding

- Base colors: `1..N`
- Mixed colors: `100..(100+M)` (or equivalent mapped scheme)

## Canonical Compiled Output

- `rleRows: Array<Array<[colorId:number, count:number]>>`
- Optional lazy inflated grid:
- `grid?: Uint16Array` row-major, length `w*h`

Provide helper:

- `inflateRLE(rleRows, w, h): Uint16Array`

## Required Metrics

- `distinctBaseColorsUsed`
- `distinctMixedColorsUsed`
- `maxRunsInAnyRow`
- `totalCells`
- Physical/density estimates

