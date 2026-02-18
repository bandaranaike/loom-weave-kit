# 04 React Package (`@erbitron/loom-weave-kit-react`)

## Scope

React helpers only. No UI components required.

## Hooks

- `useDesignHistory`
- `commit(nextDesign)`
- `undo()`, `redo()`
- `canUndo`, `canRedo`
- `useCompile`
- Accept design + palette + config.
- Memoize compile output + constraint report.
- Return `compiled`, `constraints`, and a `loading` flag shape (sync in v1 is fine).

## Boundary Rule

- Keep hooks pure and lightweight.
- No direct DOM APIs beyond standard React runtime behavior.

