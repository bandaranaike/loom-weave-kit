import {
  addGridLayer,
  compileDesign,
  createDesign,
  createPalette,
  exportSVG,
  exportWeaverSheetText,
  setCell
} from '@erbitron/loom-weave-kit';

let design = createDesign({
  productType: 'WALL_HANGER',
  fabricId: 'COTTON',
  widthCells: 12,
  heightCells: 12
});
design = addGridLayer(design, { id: 'g1' });
design = setCell(design, 'g1', 2, 2, 1);

const palette = createPalette([
  { id: 1, name: 'Black', hex: '#000000' },
  { id: 2, name: 'Cream', hex: '#FAF6EE' }
]);

const compiled = compileDesign(design, { palette });
const svg = exportSVG(compiled, palette);
const weaverSheet = exportWeaverSheetText(compiled.rowInstructions);

console.log(svg.length, weaverSheet.split('\n')[0]);
