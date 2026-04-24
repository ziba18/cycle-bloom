import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Phase } from "@/store/useAppStore";
import { polygonVertices, todayPosition, totalDays } from "@/lib/cycle";

type Props = {
  phases: Phase[];
  day: number;
  size?: number;
  showLabels?: boolean;
  onPhaseClick?: (phaseIndex: number) => void;
};

export function PolygonCycle({ phases, day, size = 360, showLabels = true, onPhaseClick }: Props) {
  const N = phases.length;
  const total = totalDays(phases);
  const verts = useMemo(() => polygonVertices(phases, size), [phases, size]);
  const today = useMemo(() => todayPosition(phases, day, size), [phases, day, size]);

  const renderEdge = (i: number) => {
    if (N === 2) {
      // single line; phase 0 = first half, phase 1 = second half overlapping
      // Better: just draw one line for both phases visually.
      if (i > 0) return null;
      const a = verts[0];
      const b = verts[1];
      return (
        <line
          key="edge-2"
          x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
          stroke="var(--color-border)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      );
    }
    const a = verts[i];
    const b = verts[(i + 1) % N];
    const phase = phases[i];
    return (
      <line
        key={`edge-${i}`}
        x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
        stroke={`var(--color-${phase.color})`}
        strokeWidth={10}
        strokeLinecap="round"
        opacity={0.7}
        className="cursor-pointer transition-all hover:opacity-100"
        onClick={() => onPhaseClick?.(i)}
      />
    );
  };

  // For N=2, draw segments per phase (split the line)
  const renderTwoPhaseSegments = () => {
    if (N !== 2) return null;
    const a = verts[0];
    const b = verts[1];
    const t = phases[0].days / total;
    const mid: [number, number] = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    return (
      <>
        <line x1={a[0]} y1={a[1]} x2={mid[0]} y2={mid[1]}
          stroke={`var(--color-${phases[0].color})`} strokeWidth={10} strokeLinecap="round"
          opacity={0.75} className="cursor-pointer hover:opacity-100"
          onClick={() => onPhaseClick?.(0)} />
        <line x1={mid[0]} y1={mid[1]} x2={b[0]} y2={b[1]}
          stroke={`var(--color-${phases[1].color})`} strokeWidth={10} strokeLinecap="round"
          opacity={0.75} className="cursor-pointer hover:opacity-100"
          onClick={() => onPhaseClick?.(1)} />
      </>
    );
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto" style={{ maxWidth: size }}>
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-cream)" stopOpacity={0.9} />
          <stop offset="60%" stopColor="var(--color-rose)" stopOpacity={0.25} />
          <stop offset="100%" stopColor="var(--color-matcha)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* central glow */}
      <circle cx={size/2} cy={size/2} r={size/3} fill="url(#coreGlow)" />

      {/* edges */}
      {N === 2 ? renderTwoPhaseSegments() : phases.map((_, i) => renderEdge(i))}

      {/* vertices */}
      {verts.map(([x, y], i) => (
        <g key={`v-${i}`}>
          <circle cx={x} cy={y} r={8}
            fill="var(--color-card)"
            stroke={`var(--color-${phases[i].color})`}
            strokeWidth={3}
          />
          {showLabels && (
            <text
              x={x}
              y={y - 18}
              textAnchor="middle"
              className="fill-foreground"
              style={{ fontSize: 11, fontWeight: 500, fontFamily: "var(--font-sans)" }}
            >
              {phases[i].name}
            </text>
          )}
        </g>
      ))}

      {/* today marker */}
      <motion.g
        initial={false}
        animate={{ x: today.x, y: today.y }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <circle r={16} fill={`var(--color-${phases[today.phaseIndex].color})`} opacity={0.35} className="animate-pulse-soft" />
        <circle r={9} fill="var(--color-card)" stroke={`var(--color-${phases[today.phaseIndex].color})`} strokeWidth={3} />
        <circle r={3} fill={`var(--color-${phases[today.phaseIndex].color})`} />
      </motion.g>
    </svg>
  );
}
