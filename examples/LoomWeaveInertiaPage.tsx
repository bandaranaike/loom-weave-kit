import { Head } from '@inertiajs/react';
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
  { id: 1, name: 'Black', hex: '#101010' },
  { id: 2, name: 'Marigold', hex: '#D9A21B' },
  { id: 3, name: 'Cream', hex: '#F6EFE3' }
];

export default function LoomWeaveInertiaPage() {
  const palette = useMemo(() => createPalette(baseColors), []);
  const initialDesign = useMemo(() => {
    let design = createDesign({
      productType: 'WALL_HANGER',
      fabricId: 'COTTON',
      widthCells: 28,
      heightCells: 20
    });
    design = addGridLayer(design, { id: 'grid-main' });
    return design;
  }, []);

  const history = useDesignHistory(initialDesign);
  const { compiled, constraints } = useCompile(history.present, palette, { maxRunsPerRow: 24 });
  const [activeColor, setActiveColor] = useState<number>(1);

  const compiledGrid = useMemo(
    () => inflateRLE(compiled.rleRows, compiled.widthCells, compiled.heightCells),
    [compiled]
  );
  const colorById = useMemo(() => new Map(palette.base.map((c) => [c.id, c.hex])), [palette]);
  const svg = useMemo(() => exportSVG(compiled, palette, { cellSizePx: 12, showGrid: true }), [compiled, palette]);

  const paintCell = (x: number, y: number): void => {
    history.commit(setCell(history.present, 'grid-main', x, y, activeColor));
  };

  const downloadPng = async (): Promise<void> => {
    const blob = await exportPNG(compiled, palette, { pixelSize: 8, output: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loom-weave-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head title="Loom Weave Demo" />
      <main style={{ padding: 20, maxWidth: 1200, margin: '0 auto', fontFamily: 'ui-sans-serif, system-ui' }}>
        <h1>Loom Weave Demo (Inertia)</h1>
        <p>React + Inertia page using @erbitron/loom-weave-kit packages.</p>

        <section style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {palette.base.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveColor(c.id)}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                border: activeColor === c.id ? '2px solid #111' : '1px solid #ccc',
                borderRadius: 8,
                padding: '6px 10px',
                background: '#fff'
              }}
            >
              <span style={{ width: 18, height: 18, background: c.hex, border: '1px solid #888' }} />
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
          <button onClick={downloadPng}>Export PNG</button>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div>
            <h3>Editor</h3>
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
                      cursor: 'crosshair',
                      background: colorById.get(compiledGrid[y * compiled.widthCells + x]) ?? '#fff'
                    }}
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <h3>Preview</h3>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <h3>Constraint Issues ({constraints.issues.length})</h3>
          <ul>
            {constraints.issues.length === 0 ? <li>No issues.</li> : null}
            {constraints.issues.map((issue, i) => (
              <li key={`${issue.id}-${i}`}>
                <strong>{issue.severity.toUpperCase()}</strong>: {issue.message}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
