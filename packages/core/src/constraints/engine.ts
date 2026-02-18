import { compileDesign } from '../compile/compile';
import { getFabricSpec } from '../fabrics';
import type {
  CompileConfig,
  CompiledOutput,
  ConstraintReport,
  Design,
  FixInstruction,
  Palette,
  ValidateOptions
} from '../types';
import { edgeMarginRule } from './rules/edge-margin';
import { maxColorsRule } from './rules/max-colors';
import { minFeatureWidthRule } from './rules/min-feature-width';
import { minMotifSizeRule } from './rules/min-motif-size';
import { productZonesRule } from './rules/product-zones';
import { runLengthRule } from './rules/run-length';

function runRules(
  design: Design,
  compiled: CompiledOutput,
  palette?: Palette,
  config?: CompileConfig
): ConstraintReport {
  const fabric = getFabricSpec(design.fabricId);
  const issues = [
    ...maxColorsRule(design, palette, fabric),
    ...minFeatureWidthRule(compiled, fabric),
    ...runLengthRule(compiled, config?.maxRunsPerRow ?? 32),
    ...minMotifSizeRule(design),
    ...edgeMarginRule(compiled, design.zones, config?.edgeMarginCells ?? 2),
    ...productZonesRule(design)
  ];
  return { valid: issues.every((i) => i.severity !== 'error'), issues };
}

export function validateDesign(design: Design, options: ValidateOptions = {}): ConstraintReport {
  const compiled = compileDesign(design, {
    palette: options.palette ?? { base: [], mixed: [] },
    config: options.config
  });
  return runRules(design, compiled, options.palette, options.config);
}

export function validateWeaveGrid(
  compiled: CompiledOutput,
  options: ValidateOptions & { design?: Design } = {}
): ConstraintReport {
  if (!options.design) {
    return {
      valid: true,
      issues: runLengthRule(compiled, options.config?.maxRunsPerRow ?? 32)
    };
  }
  return runRules(options.design, compiled, options.palette, options.config);
}

function replaceColorFix(design: Design, from: number, to: number): Design {
  return {
    ...design,
    layers: design.layers.map((layer) => {
      if (layer.kind === 'grid') {
        const cells = new Uint16Array(layer.cells);
        for (let i = 0; i < cells.length; i += 1) {
          if (cells[i] === from) cells[i] = to;
        }
        return { ...layer, cells };
      }
      if (layer.kind === 'motif') {
        const cells = new Uint16Array(layer.cells);
        for (let i = 0; i < cells.length; i += 1) {
          if (cells[i] === from) cells[i] = to;
        }
        return { ...layer, cells };
      }
      if (layer.kind === 'vector') {
        return {
          ...layer,
          commands: layer.commands.map((c) => ({
            ...c,
            colorRef: c.colorRef === from ? to : c.colorRef
          }))
        };
      }
      return layer;
    })
  };
}

function moveInsetFix(design: Design, inset: number): Design {
  return {
    ...design,
    layers: design.layers.map((layer) => {
      if (layer.kind === 'motif') {
        return {
          ...layer,
          x: Math.min(design.widthCells - layer.width, Math.max(inset, layer.x)),
          y: Math.min(design.heightCells - layer.height, Math.max(inset, layer.y))
        };
      }
      if (layer.kind === 'vector') {
        return {
          ...layer,
          commands: layer.commands.map((c) => ({
            ...c,
            x1: Math.min(design.widthCells - 1 - inset, Math.max(inset, c.x1)),
            y1: Math.min(design.heightCells - 1 - inset, Math.max(inset, c.y1)),
            x2:
              c.x2 === undefined
                ? undefined
                : Math.min(design.widthCells - 1 - inset, Math.max(inset, c.x2)),
            y2:
              c.y2 === undefined
                ? undefined
                : Math.min(design.heightCells - 1 - inset, Math.max(inset, c.y2))
          }))
        };
      }
      return layer;
    })
  };
}

export function applyAutoFix(design: Design, fix: FixInstruction): Design {
  if (fix.kind === 'replace-color') {
    const from = Number(fix.payload?.from);
    const to = Number(fix.payload?.to);
    if (Number.isFinite(from) && Number.isFinite(to)) {
      return replaceColorFix(design, from, to);
    }
    return design;
  }
  if (fix.kind === 'move-inset') {
    const inset = Number(fix.payload?.inset ?? 2);
    return moveInsetFix(design, Number.isFinite(inset) ? inset : 2);
  }
  return design;
}
