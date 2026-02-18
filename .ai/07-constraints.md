# 07 Constraint Engine

## Rule Contract

Each rule accepts design + compiled (if needed) + config and returns `ConstraintIssue[]`.

`ConstraintIssue` fields:

- `id`
- `severity`
- `message`
- `region?: { x, y, w, h }`
- `suggestedFixes?: FixInstruction[]`

## Required Rules

1. Max Colors
2. Min Feature Width (raster analysis)
3. Run Length (max segments per row)
4. Min Motif Size (motif bounding boxes)
5. Edge Margin (unless border zone)
6. Product Zones (warning-level acceptable)

## Auto-Fix

- Implement at least a safe stub pathway: `applyAutoFix(design, fix)`.

