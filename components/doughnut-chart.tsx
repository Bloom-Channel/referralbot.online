"use client";

export default function DoughnutChart({
  segments,
  centerValue,
  centerLabel,
  size = 140,
  strokeWidth = 16,
}: {
  segments: { value: number; color: string }[];
  centerValue: string;
  centerLabel: React.ReactNode;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let offset = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s, i) => {
      const fraction = total > 0 ? s.value / total : 0;
      const dash = fraction * circumference;
      const strokeDashoffset = -offset;
      offset += dash;
      return { ...s, dash, strokeDashoffset, key: i };
    });

  return (
    <div className="doughnut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        {arcs.map((a) => (
          <circle
            key={a.key}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={a.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${a.dash} ${circumference - a.dash}`}
            strokeDashoffset={a.strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      <div className="doughnut-center">
        <span className="doughnut-center-value">{centerValue}</span>
        <span className="doughnut-center-label">{centerLabel}</span>
      </div>
    </div>
  );
}
