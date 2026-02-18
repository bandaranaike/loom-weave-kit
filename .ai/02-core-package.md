# 02 Core Package (`@erbitron/loom-weave-kit`)

## Scope

Implement a browser-safe, framework-agnostic core.

## Must Implement

- Product specs and size validation
- Fabric specs and density/constraint impact
- Palette creation, mixed colors, palette validation
- Design model with layers: grid, vector, motif
- Optional zones
- Compiler to weave grid + row RLE + row instructions + metrics
- Constraint engine + issue reporting + suggested fixes structure
- Exports: JSON, SVG preview, weaver-sheet text

## Performance

- Use typed arrays where applicable.
- Canonical compiled representation is row-RLE.
- Provide repeat/tile mechanisms for large products.

## Browser-Safe Rules

- No `fs`, `path`, Node crypto, or Node-only imaging.
- No direct DOM globals (`window`, `document`).

