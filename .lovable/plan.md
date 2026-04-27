
# Atossa — Personalized Cycle & Wellness App

A calming, pastel-toned period tracking app with a unique **polygon cycle visualization** (line → triangle → square → pentagon → hexagon depending on phase count), a true **interactive 3D anatomy** for symptom logging, a year-ahead calendar, an education hub, and self-assessment quizzes. All data stored locally in the browser — no login required.

## Design language

- **Palette:** matcha (#A8C4A2), pastel pink (#F8C8DC), pastel blue (#B8D8E8), warm cream (#FAF6F0), deep slate ink (#2D3142). Soft gradients, generous whitespace.
- **Typography:** Cormorant Garamond (display, elegant serif) for headings, Inter for UI/body. Wide tracking on small caps labels.
- **Motion:** Soft fade + scale transitions, animated SVG polygon morph, subtle floating gradient orbs in the background.
- **Imagery:** 3D-rendered orb/petal motifs (CSS gradient blobs + SVG), glassmorphism cards, soft shadows.

## Information architecture

Bottom tab bar (mobile) / left rail (desktop), 5 tabs. TanStack Start file routes — one route per tab, no hash anchors.

```text
/            Home (overview, today snapshot, quick actions)
/cycle       Polygon cycle visualization + phase customizer
/calendar    Year-ahead calendar with predictions + daily logs
/body        3D anatomy + symptom/pain logging
/learn       Education library (articles, links, carousels)
/quiz/pcos   PCOS self-assessment
/quiz/endo   Endometriosis self-assessment
```

A persistent `AppShell` in `__root.tsx` provides the tab bar, ambient gradient background, and onboarding gate.

## Feature breakdown

### 1. Onboarding (first launch only)
- 3-step carousel: welcome → last period start date + average cycle length → phase configuration (preset: 4 phases — Menstrual, Follicular, Ovulation, Luteal, with editable lengths).
- Saved to localStorage; can be re-run from settings.

### 2. Home `/`
- Greeting + today's date in elegant serif.
- "You are on **Day 8 — Follicular** " card with mini polygon and progress dot.
- Quick stat tiles (next period in X days, cycle length, current phase length, last symptom logged).
- Carousel of "Today for you": one tip from Learn, one suggested log action, one quiz teaser.
- Embla carousel for smooth horizontal swiping.

### 3. Cycle `/cycle` — the signature feature
- **PolygonCycle SVG component**: renders an N-sided polygon (N = number of phases, 2–6).
  - 2 phases → horizontal line with 2 nodes
  - 3 → triangle, 4 → square, 5 → pentagon, 6 → hexagon
  - Each edge length is proportional to that phase's day count (computed from total cycle days).
  - Animated dot travels along the perimeter showing today's position.
  - Each vertex = phase boundary, labeled with phase name + day number.
  - Tap a phase edge → side sheet with description, typical symptoms, self-care tips.
- **Phase Editor** below: list of phases with name, color, length slider; add/remove phases (clamped 2–6). Polygon morphs live as values change.

### 4. Calendar `/calendar`
- Year view: 12 mini-month grid (compact), each day color-coded by predicted phase. Click a month to expand.
- Month view: large calendar with phase rings around each day; past = solid (logged), present = pulsing, future = dashed (predicted).
- Click a day → drawer with daily log: flow level, mood, symptoms (multi-select chips), notes.
- Predictions: project forward 12 cycles using user's avg cycle length + phase config.
- Toggle: "Show predictions" / "Logged only".

### 5. Body `/body` — 3D anatomy
- **react-three-fiber + drei** scene with an interactive stylized human body (low-poly GLB-style geometry built from primitives — head, torso, arms, legs as soft rounded meshes; no external model needed for v1).
- OrbitControls for rotate/zoom; clickable body regions (head, chest, abdomen, pelvis, lower back, arms, legs) as invisible hit-meshes that highlight on hover.
- Click region → glass panel opens with: symptom text input, pain slider 0–10, severity color (matcha → pink → red), save button.
- Logged issues appear as glowing pastel markers on the body. Timeline list below shows recent logs.
- Sandbox preview lacks GPU — include `navigator.gpu`/WebGL adapter check with a graceful fallback message ("3D requires a WebGL-capable browser").

### 6. Learn `/learn`
- Hero carousel of featured articles (Embla, autoplay, fade transitions).
- Category tabs: Cycle Basics, Hormones, Nutrition, Mental Health, Conditions.
- Article grid with cover gradients + read-time. Click → full article view with elegant typography, related links sidebar.
- Curated useful links section (external resources, opens in new tab).
- ~12 seed articles authored in-app (markdown-style React content).

### 7. Quizzes `/quiz/pcos` and `/quiz/endo`
- Personality-test style: one question per screen, slide transitions, progress bar.
- ~12 weighted yes/no/scale questions per quiz, based on common screening indicators (clearly framed as **educational self-assessment, not medical diagnosis** — disclaimer on intro and results).
- Result screen: animated circular percentage gauge, risk band (Low / Moderate / Elevated), explanation, and "talk to a healthcare provider" CTA. Save result to history.

## Technical details

**Stack additions**
- `three`, `@react-three/fiber`, `@react-three/drei` — 3D anatomy
- `embla-carousel-react` (already common) — carousels
- `framer-motion` — page transitions, polygon morph, quiz slides
- `date-fns` — calendar math
- `zustand` — lightweight state store, persisted to localStorage via `persist` middleware

**Routes (TanStack Start, file-based)**
Create: `src/routes/index.tsx`, `cycle.tsx`, `calendar.tsx`, `body.tsx`, `learn.tsx`, `learn.$slug.tsx`, `quiz.pcos.tsx`, `quiz.endo.tsx`. Each gets unique `head()` meta. Update `__root.tsx` to render `<AppShell><Outlet/></AppShell>` plus 404.

**State** (`src/store/useAppStore.ts`, zustand + persist)
- `profile`: { lastPeriodStart, avgCycleLength, onboarded }
- `phases`: Array<{ id, name, color, days }>
- `dailyLogs`: Record<isoDate, { flow, mood, symptoms[], notes }>
- `bodyLogs`: Array<{ id, region, label, pain, createdAt }>
- `quizResults`: Array<{ type, score, percent, takenAt }>

**Polygon math** (`src/lib/polygon.ts`)
- Compute vertex positions on a circle of radius R, N vertices. For unequal edge lengths, place vertices at cumulative angle = 2π * (cumulativeDays / totalDays) so arc length encodes phase length (visually conveys proportion while keeping a closed shape). For N=2, render as a straight line with two nodes.
- Today marker: interpolate along the current edge by `(daysIntoPhase / phaseDays)`.

**3D body** (`src/components/body/AnatomyScene.tsx`)
- Canvas with soft 3-point lighting, env preset "studio".
- Body assembled from `<Sphere>`, `<Capsule>`, `<RoundedBox>` primitives with pastel matcha material + subtle subsurface look (MeshPhysicalMaterial, transmission ~0.1).
- Clickable invisible hit zones (slightly larger meshes with `visible={false}` but raycast-enabled) for each region.
- WebGL detection wrapper renders fallback 2D body SVG if unavailable.

**Styling**
- Extend `src/styles.css` with new design tokens (matcha, pastel-pink, pastel-blue, cream, ink) in oklch, plus serif font import (Google Fonts: Cormorant Garamond + Inter via `<link>` in root `head`).
- Add fade-in / scale-in keyframes and `.glass` utility (backdrop-blur + translucent bg).

**Disclaimers**
- Onboarding, quiz intros, and quiz results all show: "Atossa is for personal tracking and education. It is not a medical device and does not provide diagnoses."

## Build order

1. Design tokens + fonts + AppShell + tab bar + ambient background.
2. Zustand store + onboarding flow.
3. Home tab.
4. Polygon cycle component + Cycle tab + phase editor.
5. Calendar tab (year + month + day drawer).
6. Learn tab + article route + seed content.
7. PCOS + Endo quiz flows.
8. 3D body tab (last — heaviest).
9. Polish: transitions, empty states, 404, head meta on every route.

## What I'm deliberately not doing in v1
- No accounts, sync, or backend (per your choice — local only).
- No push notifications.
- No partner sharing.
- No importing from Apple Health / other apps.

These are easy follow-ups once the core feels right.
