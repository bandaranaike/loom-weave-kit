# Loom Weave Kit Agent Guide

This repository uses instruction files in `.ai/` to generate the `@erbitron/loom-weave-kit` monorepo.
Primary agent target: Codex.

## Goal

Build a browser-first TypeScript pnpm monorepo with these packages:

- `@erbitron/loom-weave-kit` (core)
- `@erbitron/loom-weave-kit-export-canvas`
- `@erbitron/loom-weave-kit-react`

## Execution Order

1. Read `.ai/00-overview.md`.
2. Implement workspace/tooling from `.ai/01-repo-tooling.md`.
3. Implement package internals:
- `.ai/02-core-package.md`
- `.ai/03-export-canvas-package.md`
- `.ai/04-react-package.md`
4. Enforce public API in `.ai/05-api-contract.md`.
5. Use model/compile rules from `.ai/06-data-model-compile.md`.
6. Implement constraints from `.ai/07-constraints.md`.
7. Implement exporters from `.ai/08-exports.md`.
8. Add tests from `.ai/09-testing.md`.
9. Write docs/integration guidance from `.ai/10-docs-integration.md`.
10. Verify completion using `.ai/11-deliverables-checklist.md`.
11. Track progress in `.ai/12-status-tracker.md` and keep it updated.

## Hard Rules

- Core package must stay browser-safe and framework-agnostic.
- No Node-only APIs in core (`fs`, `path`, Node crypto, etc.).
- Deterministic compile output is mandatory.
- Use typed arrays and RLE for memory/performance.
- Keep package boundaries strict (canvas/DOM only in export-canvas package).

## Instruction Resolution

- When exact requirements are needed for any task, read the relevant `.ai/*.md` file(s) before implementing.
- Do not guess details covered by `.ai/*.md`; treat those files as the source of truth for package generation work.
- Always read `.ai/12-status-tracker.md` before starting new implementation work and update it after finishing each milestone.
