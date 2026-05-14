const COLORS = [
  "#1a56db",
  "#7e3af2",
  "#e74694",
  "#ff5a1f",
  "#0e9f6e",
  "#c27803",
  "#3f83f8",
  "#a4cafe",
  "#f98080",
  "#84e1bc",
  "#faca15",
  "#31c48d",
];

interface Slice {
  label: string;
  value: number;
}

interface PieChartProps {
  slices: Slice[];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function PieChart({ slices }: PieChartProps) {
  const total = slices.reduce((s, r) => s + r.value, 0);
  if (!total) return null;

  const cx = 90,
    cy = 90,
    r = 80;
  let cursor = 0;

  return (
    <div className="pie-chart-wrap">
      <svg width={180} height={180} viewBox="0 0 180 180">
        {slices.map((slice, i) => {
          const deg = (slice.value / total) * 360;
          const start = cursor;
          const end = cursor + deg;
          cursor = end;
          // avoid degenerate path for single-slice (100%)
          const d =
            deg >= 360
              ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
              : slicePath(cx, cy, r, start, end);
          return (
            <path key={i} d={d} fill={COLORS[i % COLORS.length]}>
              <title>
                {slice.label}: {slice.value.toLocaleString("pl-PL")}
              </title>
            </path>
          );
        })}
      </svg>
      <ul className="pie-legend">
        {slices.map((slice, i) => (
          <li key={i} className="pie-legend-item">
            <span
              className="pie-legend-dot"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="pie-legend-label">{slice.label}</span>
            <span className="pie-legend-pct">
              {((slice.value / total) * 100).toLocaleString("pl-PL", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              %
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
