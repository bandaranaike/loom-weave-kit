# 10 Docs + Integration Notes

## Required Documentation

- Root `README.md`:
- Install instructions for all packages
- Quickstart (create design -> compile -> SVG/weaver sheet)
- Mixed color + dither explanation
- Constraint system overview
- Laravel + React + Inertia integration guide
- Per-package READMEs in each package folder.

## Laravel + React + Inertia Guidance

- Preferred bundler: Vite
- Ensure ESM exports resolve cleanly
- Persist `DesignJSON` and optionally `CompiledJSON` in DB
- Use compiled SVG for previews
- Generate weaver sheet text for print workflows

