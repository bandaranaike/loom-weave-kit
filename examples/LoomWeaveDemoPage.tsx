import { useMemo, useState } from 'react';
import {
  addGridLayer,
  createDesign,
  createPalette,
  exportSVG,
  inflateRLE,
  setCell,
  type BaseColor
} from '@erbitron/loom-weave-kit';
import { useCompile, useDesignHistory } from '@erbitron/loom-weave-kit-react';
import { exportPNG } from '@erbitron/loom-weave-kit-export-canvas';

const baseColors: BaseColor[] = [
  { id: 1, name: 'Black', hex: '#111111' },
  { id: 2, name: 'Gold', hex: '#C9A227' },
  { id: 3, name: 'Cream', hex: '#F6EEDC' }
];

export default function LoomWeaveDemoPage() {
  const palette = useMemo(() => createPalette(baseColors), []);
  const initialDesign = useMemo(() => {
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 32,
      heightCells: 24
    });
    design = addGridLayer(design, { id: 'grid-main' });
    return design;
  }, []);

  const history = useDesignHistory(initialDesign);
  const { compiled, constraints } = useCompile(history.present, palette, { maxRunsPerRow: 28 });
  const [activeColor, setActiveColor] = useState<number>(1);
  const colorById = useMemo(
    () => new Map(palette.base.map((c) => [c.id, c.hex])),
    [palette]
  );
  const compiledGrid = useMemo(
    () => inflateRLE(compiled.rleRows, compiled.widthCells, compiled.heightCells),
    [compiled]
  );

  const svg = useMemo(() => exportSVG(compiled, palette, { cellSizePx: 12, showGrid: true }), [compiled, palette]);

  const paintCell = (x: number, y: number): void => {
    const next = setCell(history.present, 'grid-main', x, y, activeColor);
    history.commit(next);
  };

  const handleExportPng = async (): Promise<void> => {
    const blob = await exportPNG(compiled, palette, { pixelSize: 8, output: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loom-preview-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: '0 auto', fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Loom Weave Kit Demo</h1>
      <p>Paint cells, compile instantly, and export PNG from the compiled weave grid.</p>

      <section style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {palette.base.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveColor(c.id)}
            style={{
              border: activeColor === c.id ? '2px solid #222' : '1px solid #ccc',
              background: '#fff',
              borderRadius: 8,
              padding: 8,
              display: 'flex',
              gap: 8,
              alignItems: 'center'
            }}
          >
            <span style={{ width: 20, height: 20, background: c.hex, border: '1px solid #999' }} />
            {c.name}
          </button>
        ))}
      </section>

      <section style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button onClick={history.undo} disabled={!history.canUndo}>
          Undo
        </button>
        <button onClick={history.redo} disabled={!history.canRedo}>
          Redo
        </button>
        <button onClick={handleExportPng}>Export PNG</button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3>Editor Grid</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${history.present.widthCells}, 18px)`,
              gap: 1,
              background: '#ddd',
              width: 'fit-content',
              padding: 1
            }}
          >
            {Array.from({ length: history.present.heightCells }).flatMap((_, y) =>
              Array.from({ length: history.present.widthCells }).map((__, x) => (
                <button
                  key={`${x}-${y}`}
                  onClick={() => paintCell(x, y)}
                  style={{
                    width: 18,
                    height: 18,
                    border: 'none',
                    background: colorById.get(compiledGrid[y * compiled.widthCells + x]) ?? '#fff',
                    cursor: 'crosshair'
                  }}
                  title={`(${x}, ${y})`}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h3>Compiled SVG Preview</h3>
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Constraint Issues ({constraints.issues.length})</h3>
        <ul>
          {constraints.issues.map((issue, idx) => (
            <li key={`${issue.id}-${idx}`}>
              <strong>{issue.severity.toUpperCase()}</strong>: {issue.message}
            </li>
          ))}
          {constraints.issues.length === 0 ? <li>No issues.</li> : null}
        </ul>
      </section>
    </main>
  );
}
