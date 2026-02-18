import { useMemo } from 'react';
import {
  compileDesign,
  validateDesign,
  exportDesignJSON,
  type CompileConfig,
  type ConstraintReport,
  type Design,
  type Palette,
  type CompiledOutput
} from '@erbitron/loom-weave-kit';

export interface UseCompileResult {
  compiled: CompiledOutput;
  constraints: ConstraintReport;
  loading: boolean;
}

export function useCompile(
  design: Design,
  palette: Palette,
  config?: CompileConfig
): UseCompileResult {
  return useMemo(() => {
    const compiled = compileDesign(design, { palette, config });
    const constraints = validateDesign(design, { palette, config });
    return { compiled, constraints, loading: false };
  }, [exportDesignJSON(design), JSON.stringify(palette), JSON.stringify(config)]);
}
