# 05 Public API Contract (Core)

Export the following from `@erbitron/loom-weave-kit`.

## Products

- `listProductSpecs(): ProductSpec[]`
- `getProductSpec(type: ProductType): ProductSpec`
- `validateSize(type, sizeCm): ValidationResult`

## Fabrics

- `listFabrics(): FabricSpec[]`
- `getFabricSpec(id: FabricId): FabricSpec`

## Palette

- `createPalette(base: BaseColor[]): Palette`
- `addMixedColor(palette, recipe): Palette`
- `validatePalette(palette, fabricSpec): ValidationResult`

## Design

- `createDesign(input): Design`
- `serializeDesign(design): DesignJSON`
- `loadDesign(json): Design`
- `addGridLayer(design, opts)`
- `setCell(design, layerId, x, y, colorRef)`
- `fillRect(...)`
- `drawLine(...)`
- `addVectorLayer(...)`
- `addMotifLayer(...)`

## Compile

- `compileDesign(design, { palette, config? }): CompiledOutput`

## Constraints

- `validateDesign(design, { palette?, config? }): ConstraintReport`
- `validateWeaveGrid(compiled, { config? }): ConstraintReport`
- `applyAutoFix(design, fix): Design` (stub-friendly in v1)

## Export

- `exportDesignJSON(design): string`
- `exportCompiledJSON(compiled): string`
- `exportSVG(compiled, { cellSizePx?, showGrid? }): string`
- `exportWeaverSheetText(compiled.rowInstructions): string`

## Determinism Rule

- `compileDesign` must return identical output for identical input.

