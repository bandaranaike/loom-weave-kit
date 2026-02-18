export type ProductType =
  | 'SAREE'
  | 'SARONG'
  | 'WALL_HANGER'
  | 'PILLOW_CASE'
  | 'BEDSHEET';

export type FabricId = 'COTTON' | 'SILK_BLEND' | 'LINEN' | 'RAYON';

export type HexColor = `#${string}`;
export type ColorRef = number;
export type Severity = 'error' | 'warning' | 'info';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ProductSpec {
  type: ProductType;
  name: string;
  widthCm: number;
  heightCm: number;
  minWidthCm: number;
  maxWidthCm: number;
  minHeightCm: number;
  maxHeightCm: number;
}

export interface SizeCm {
  widthCm: number;
  heightCm: number;
}

export interface FabricSpec {
  id: FabricId;
  name: string;
  cellsPerCmX: number;
  cellsPerCmY: number;
  maxPaletteColors: number;
  minFeatureWidthCells: number;
}

export interface BaseColor {
  id: number;
  name: string;
  hex: HexColor;
}

export type MixRatio = '50/50' | '75/25' | '25/75';
export type DitherTile = '2x2' | '4x4';

export interface MixedColorRecipe {
  id: number;
  name: string;
  a: number;
  b: number;
  ratio: MixRatio;
  tile: DitherTile;
}

export interface MixedColor {
  id: number;
  name: string;
  recipe: MixedColorRecipe;
}

export interface Palette {
  base: BaseColor[];
  mixed: MixedColor[];
}

export interface Zone {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GridLayer {
  id: string;
  kind: 'grid';
  width: number;
  height: number;
  cells: Uint16Array;
}

export interface VectorCommand {
  type: 'fillRect' | 'drawLine';
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  w?: number;
  h?: number;
  colorRef: ColorRef;
}

export interface VectorLayer {
  id: string;
  kind: 'vector';
  commands: VectorCommand[];
}

export interface MotifLayer {
  id: string;
  kind: 'motif';
  x: number;
  y: number;
  width: number;
  height: number;
  cells: Uint16Array;
  repeatX?: number;
  repeatY?: number;
  stepX?: number;
  stepY?: number;
}

export type Layer = GridLayer | VectorLayer | MotifLayer;

export interface Design {
  id: string;
  productType: ProductType;
  fabricId: FabricId;
  widthCells: number;
  heightCells: number;
  layers: Layer[];
  zones?: Zone[];
}

export interface DesignJSON {
  id: string;
  productType: ProductType;
  fabricId: FabricId;
  widthCells: number;
  heightCells: number;
  layers: Array<
    | Omit<GridLayer, 'cells'> & { cells: number[] }
    | VectorLayer
    | Omit<MotifLayer, 'cells'> & { cells: number[] }
  >;
  zones?: Zone[];
}

export type RowRun = [colorId: number, count: number];

export interface CompileMetrics {
  distinctBaseColorsUsed: number;
  distinctMixedColorsUsed: number;
  maxRunsInAnyRow: number;
  totalCells: number;
  widthCells: number;
  heightCells: number;
  estimatedWidthCm: number;
  estimatedHeightCm: number;
}

export interface CompiledOutput {
  widthCells: number;
  heightCells: number;
  rleRows: RowRun[][];
  rowInstructions: string[];
  metrics: CompileMetrics;
  grid?: Uint16Array;
}

export interface ConstraintIssue {
  id: string;
  severity: Severity;
  message: string;
  region?: { x: number; y: number; w: number; h: number };
  suggestedFixes?: FixInstruction[];
}

export interface ConstraintReport {
  valid: boolean;
  issues: ConstraintIssue[];
}

export interface FixInstruction {
  kind: 'replace-color' | 'inflate-feature' | 'simplify-row' | 'move-inset' | 'custom';
  message: string;
  payload?: Record<string, unknown>;
}

export interface CompileConfig {
  maxRunsPerRow?: number;
  maxMixedColors?: number;
  edgeMarginCells?: number;
}

export interface ValidateOptions {
  palette?: Palette;
  config?: CompileConfig;
}
