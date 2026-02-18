# 01 Repo + Tooling

## Required Workspace Layout

Create:

- `pnpm-workspace.yaml`
- root `package.json`
- `tsconfig.base.json`
- `.editorconfig`, `.gitignore`, `.npmrc`, root `README.md`
- `packages/core`
- `packages/export-canvas`
- `packages/react`

Use the exact folder/file shape defined in this repository's design brief.

## Toolchain

- Package manager: `pnpm` workspaces
- Build: `tsup` (ESM-first, optional CJS, DTS)
- Tests: `vitest`
- Lint/format: `eslint` + `prettier`

## Build Requirements

- Proper `exports` map for each package.
- Side-effects minimization for tree shaking.
- Keep package boundaries strict (no DOM in core, no Node-only APIs in core).

