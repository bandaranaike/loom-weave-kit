# 09 Testing Requirements

Use `vitest` and include at minimum:

1. Product size validation boundaries
2. Palette limit validation
3. Mixed color recipe validation
4. Compile determinism (`same input => same RLE`)
5. Run length constraint trigger case
6. SVG export returns valid non-empty `<svg ...>`

## Validation Schemas

Use `zod` in core for:

- `DesignJSON`
- `CompiledJSON`
- Product/fabric specs

Error messages must be clear and actionable.

