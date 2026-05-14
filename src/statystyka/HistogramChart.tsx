import type { HistogramEntry, HistogramRow } from "../api/nfzStatApi";

function HistogramPlot({ row }: { row: HistogramRow }) {
  const points = row.points ?? [];
  if (!points.length) return null;

  // Compute 99th percentile cutoff by cumulative count
  const totalCount = points.reduce((s, p) => s + p.y, 0);
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const threshold = totalCount * 0.98;
  let cumulative = 0;
  let cutoffX = sortedPoints[sortedPoints.length - 1].x;
  for (const p of sortedPoints) {
    cumulative += p.y;
    if (cumulative >= threshold) {
      cutoffX = p.x;
      break;
    }
  }

  // Fill dense array from 0 to cutoffX only
  const values = new Array(cutoffX + 1).fill(0) as number[];
  for (const p of points) {
    if (p.x <= cutoffX) values[p.x] = p.y;
  }

  const maxY = Math.max(...values);
  const displayedCount = values.reduce((s, v) => s + v, 0);
  const hiddenCount = totalCount - displayedCount;

  const W = 800;
  const H = 280;
  const ml = 55;
  const mr = 20;
  const mt = 10;
  const mb = 40;
  const pw = W - ml - mr;
  const ph = H - mt - mb;

  const barW = pw / (cutoffX + 1);
  const tickInterval =
    cutoffX <= 30 ? 5 : cutoffX <= 70 ? 10 : cutoffX <= 150 ? 20 : 30;
  const yTicks = 5;

  const label = [row.branch, row["hospital-types"]].filter(Boolean).join(" / ");

  return (
    <div>
      {label && <div className="stat-histogram-label">{label}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", display: "block" }}
        aria-label="Histogram czasu pobytu"
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: yTicks }, (_, i) => i + 1).map((i) => {
          const ty = mt + ph - (i / yTicks) * ph;
          return (
            <line
              key={i}
              x1={ml}
              y1={ty}
              x2={ml + pw}
              y2={ty}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
          );
        })}

        {/* Bars */}
        {values.map((v, x) => {
          if (v === 0) return null;
          const bh = (v / maxY) * ph;
          const bx = ml + x * barW;
          const by = mt + ph - bh;
          return (
            <rect
              key={x}
              x={bx + 0.5}
              y={by}
              width={Math.max(barW - 1, 0.5)}
              height={bh}
              fill="#1a56db"
              opacity={0.8}
            >
              <title>{`Dzień ${x}: ${v.toLocaleString("pl-PL")} hospitalizacji`}</title>
            </rect>
          );
        })}

        {/* X axis line */}
        <line
          x1={ml}
          y1={mt + ph}
          x2={ml + pw}
          y2={mt + ph}
          stroke="#94a3b8"
          strokeWidth={1}
        />

        {/* X ticks + labels */}
        {Array.from(
          { length: Math.floor(cutoffX / tickInterval) + 1 },
          (_, i) => i * tickInterval,
        ).map((x) => {
          const tx = ml + x * barW + barW / 2;
          return (
            <g key={x}>
              <line
                x1={tx}
                y1={mt + ph}
                x2={tx}
                y2={mt + ph + 4}
                stroke="#94a3b8"
                strokeWidth={1}
              />
              <text
                x={tx}
                y={mt + ph + 15}
                textAnchor="middle"
                fontSize={10}
                fill="#64748b"
              >
                {x}
              </text>
            </g>
          );
        })}

        {/* X axis label */}
        <text
          x={ml + pw / 2}
          y={H - 2}
          textAnchor="middle"
          fontSize={11}
          fill="#475569"
        >
          Czas pobytu (dni)
        </text>

        {/* Y axis line */}
        <line
          x1={ml}
          y1={mt}
          x2={ml}
          y2={mt + ph}
          stroke="#94a3b8"
          strokeWidth={1}
        />

        {/* Y ticks + labels */}
        {Array.from({ length: yTicks + 1 }, (_, i) => i).map((i) => {
          const frac = i / yTicks;
          const ty = mt + ph - frac * ph;
          const val = Math.round(frac * maxY);
          return (
            <g key={i}>
              <line
                x1={ml - 4}
                y1={ty}
                x2={ml}
                y2={ty}
                stroke="#94a3b8"
                strokeWidth={1}
              />
              <text
                x={ml - 6}
                y={ty + 4}
                textAnchor="end"
                fontSize={10}
                fill="#64748b"
              >
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Y axis label */}
        <text
          x={12}
          y={mt + ph / 2}
          textAnchor="middle"
          fontSize={11}
          fill="#475569"
          transform={`rotate(-90, 12, ${mt + ph / 2})`}
        >
          Hospitalizacje
        </text>
      </svg>
      {hiddenCount > 0 && (
        <div className="stat-histogram-tail-note">
          Pokazano 98% przypadków (≤ {cutoffX} dni). Pominięto{" "}
          {hiddenCount.toLocaleString("pl-PL")} hospitalizacji z dłuższym
          pobytem.
        </div>
      )}
    </div>
  );
}

export function HistogramChart({ entry }: { entry: HistogramEntry }) {
  const rows = entry.attributes.data ?? [];
  if (!rows.length) return <p className="stat-empty">Brak danych</p>;
  return (
    <>
      {rows.map((row, i) => (
        <HistogramPlot key={i} row={row} />
      ))}
    </>
  );
}
