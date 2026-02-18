import { useCallback, useMemo, useState } from 'react';
import type { Design } from '@erbitron/loom-weave-kit';

export interface DesignHistoryState {
  present: Design;
  commit: (nextDesign: Design) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useDesignHistory(initial: Design): DesignHistoryState {
  const [past, setPast] = useState<Design[]>([]);
  const [present, setPresent] = useState<Design>(initial);
  const [future, setFuture] = useState<Design[]>([]);

  const commit = useCallback(
    (next: Design) => {
      setPast((p) => [...p, present]);
      setPresent(next);
      setFuture([]);
    },
    [present]
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [present, ...f]);
      setPresent(prev);
      return p.slice(0, -1);
    });
  }, [present]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const [next, ...rest] = f;
      setPast((p) => [...p, present]);
      setPresent(next);
      return rest;
    });
  }, [present]);

  return useMemo(
    () => ({
      present,
      commit,
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0
    }),
    [present, commit, undo, redo, past.length, future.length]
  );
}
