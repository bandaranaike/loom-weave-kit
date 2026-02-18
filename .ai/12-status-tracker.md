# 12 Status Tracker

Use this file to track what is complete vs pending for the monorepo build.
Update statuses after each meaningful change.

Date baseline: 2026-02-18

## Legend

- `[x]` complete
- `[~]` partial
- `[ ]` pending

## Workspace + Tooling

- [x] pnpm workspace scaffold
- [x] root TypeScript base config
- [x] eslint + prettier setup
- [x] build/test/lint scripts

## Core Package (`@erbitron/loom-weave-kit`)

- [x] products defaults + size validation
- [x] fabrics defaults + lookup
- [x] palette creation/validation
- [x] mixed color recipe support
- [x] design model + layers
- [x] grid layer operations
- [x] vector/motif operations (includes motif repeat controls)
- [x] deterministic compile pipeline
- [x] canonical row-RLE output
- [x] RLE inflate helper
- [x] compile metrics
- [x] constraint engine with required rule set
- [x] applyAutoFix (replace-color and move-inset handlers)
- [x] JSON export
- [x] SVG export
- [x] weaver sheet text export
- [x] zod schemas

## Canvas Export Package (`@erbitron/loom-weave-kit-export-canvas`)

- [x] browser-only canvas surface handling
- [x] PNG export API
- [x] advanced mixed-color raster strategy (deterministic dither choice by recipe)

## React Package (`@erbitron/loom-weave-kit-react`)

- [x] useDesignHistory (undo/redo)
- [x] useCompile (memoized compile + constraints)
- [x] no UI components

## Testing

- [x] core vitest suite for required minimum scenarios
- [x] export-canvas tests
- [x] react hooks tests
- [x] additional edge-case tests (large motif repeats, mixed-recipe stress, auto-fix bounds)

## Documentation

- [x] root README
- [x] per-package READMEs
- [x] quickstart example

## Validation Runs

- [x] install dependencies
- [x] core tests pass
- [x] full workspace tests pass (core + export-canvas + react)
- [x] workspace build passes
- [x] lint passes

## Next Priority

1. Add property-based/fuzz tests for compile determinism and constraint stability.
2. Optionally add worker-based compile path for React hook loading states.
3. Prepare release/versioning workflow.
