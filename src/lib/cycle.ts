import { differenceInCalendarDays, addDays, parseISO, formatISO } from "date-fns";
import type { Phase } from "@/store/useAppStore";

export function isoDate(d: Date) {
  return formatISO(d, { representation: "date" });
}

export function totalDays(phases: Phase[]) {
  return phases.reduce((s, p) => s + p.days, 0);
}

/**
 * Returns the day-in-cycle for a given date (1..totalDays), based on lastPeriodStart.
 */
export function dayInCycle(
  date: Date,
  lastPeriodStart: string | undefined,
  phases: Phase[],
): number {
  const total = totalDays(phases);
  if (!lastPeriodStart || total < 1) return 1;
  const start = parseISO(lastPeriodStart);
  const diff = differenceInCalendarDays(date, start);
  const m = ((diff % total) + total) % total;
  return m + 1;
}

export function phaseForDay(day: number, phases: Phase[]): { phase: Phase; dayInPhase: number; phaseIndex: number } {
  let acc = 0;
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    if (day <= acc + p.days) {
      return { phase: p, dayInPhase: day - acc, phaseIndex: i };
    }
    acc += p.days;
  }
  // fallback to last
  return { phase: phases[phases.length - 1], dayInPhase: phases[phases.length - 1].days, phaseIndex: phases.length - 1 };
}

export function nextPeriodDate(lastPeriodStart: string | undefined, phases: Phase[]): Date | null {
  if (!lastPeriodStart) return null;
  const total = totalDays(phases);
  const start = parseISO(lastPeriodStart);
  const today = new Date();
  const diff = differenceInCalendarDays(today, start);
  const cyclesPassed = Math.floor(diff / total);
  return addDays(start, (cyclesPassed + 1) * total);
}

/**
 * Vertices placed around a circle so that arc-length proportion matches phase length.
 * Returns array of [x, y] in a viewBox of size `size` centered at (size/2, size/2).
 */
export function polygonVertices(phases: Phase[], size: number, padding = 40) {
  const total = totalDays(phases);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - padding;
  const N = phases.length;

  if (N === 2) {
    // Render as horizontal line: two nodes
    return [
      [padding, cy] as [number, number],
      [size - padding, cy] as [number, number],
    ];
  }

  let cum = 0;
  const verts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    // angle starts at top (-PI/2) and goes clockwise
    const t = cum / total;
    const angle = -Math.PI / 2 + t * Math.PI * 2;
    verts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    cum += phases[i].days;
  }
  return verts;
}

/** Position of the "today" marker along edges of polygon. */
export function todayPosition(
  phases: Phase[],
  day: number,
  size: number,
  padding = 40,
): { x: number; y: number; phaseIndex: number } {
  const verts = polygonVertices(phases, size, padding);
  const N = phases.length;
  const { phaseIndex, dayInPhase } = phaseForDay(day, phases);
  const phase = phases[phaseIndex];
  const t = Math.min(1, Math.max(0, (dayInPhase - 1) / Math.max(1, phase.days)));

  // For N>=2: edge from verts[phaseIndex] to verts[(phaseIndex+1)%N]
  // For N=2: only one segment exists; treat phase 0 going right, phase 1 going left
  if (N === 2) {
    const [a, b] = verts;
    if (phaseIndex === 0) {
      return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, phaseIndex };
    }
    return { x: b[0] + (a[0] - b[0]) * t, y: b[1] + (a[1] - b[1]) * t, phaseIndex };
  }
  const a = verts[phaseIndex];
  const b = verts[(phaseIndex + 1) % N];
  return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, phaseIndex };
}

export function colorVar(name: string) {
  return `var(--color-${name})`;
}
