import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Trash2, Sparkles } from "lucide-react";
import { format } from "date-fns";

const AnatomyScene = lazy(() => import("@/components/body/AnatomyScene").then(m => ({ default: m.AnatomyScene })));

export const Route = createFileRoute("/body")({
  head: () => ({
    meta: [
      { title: "Body — Atossa" },
      { name: "description", content: "Log how you feel by tapping a 3D body. Track pain, location, and patterns." },
    ],
  }),
  component: BodyPage,
});

const REGIONS = [
  { id: "head", label: "Head" },
  { id: "chest", label: "Chest" },
  { id: "abdomen", label: "Abdomen" },
  { id: "uterus", label: "Uterus" },
  { id: "ovaryL", label: "Left ovary" },
  { id: "ovaryR", label: "Right ovary" },
  { id: "pelvis", label: "Pelvis" },
  { id: "lowerBack", label: "Lower back" },
  { id: "armL", label: "Left arm" },
  { id: "armR", label: "Right arm" },
  { id: "legL", label: "Left leg" },
  { id: "legR", label: "Right leg" },
];

function BodyPage() {
  const { bodyLogs, addBodyLog, removeBodyLog } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [pain, setPain] = useState(3);

  const submit = () => {
    if (!selected || !label.trim()) return;
    const region = REGIONS.find((r) => r.id === selected)?.label ?? selected;
    addBodyLog({ region, label: label.trim(), pain });
    setLabel(""); setPain(3); setSelected(null);
  };

  return (
    <div className="px-5 md:px-10 pt-6 md:pt-10 max-w-6xl mx-auto space-y-8">
      <header>
        <p className="smallcaps text-foreground/55">Body</p>
        <h1 className="font-display text-4xl md:text-5xl">Where do you feel it?</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Rotate the figure, zoom in, and tap a region to log a sensation. Markers show your recent entries.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="glass rounded-[2rem] p-2 shadow-soft h-[520px] relative overflow-hidden">
          <Suspense fallback={<div className="h-full flex items-center justify-center text-muted-foreground">Loading 3D scene…</div>}>
            <AnatomyScene
              onSelect={(id) => { setSelected(id); }}
              selected={selected}
              markers={bodyLogs.slice(0, 12).map((b) => ({
                id: b.id,
                region: REGIONS.find((r) => r.label === b.region)?.id ?? "abdomen",
                pain: b.pain,
              }))}
            />
          </Suspense>
          <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Drag to rotate · scroll to zoom
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass rounded-[2rem] p-6 shadow-soft">
            <h3 className="font-display text-2xl">New entry</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {selected ? `Selected: ${REGIONS.find((r) => r.id === selected)?.label}` : "Tap a region on the body"}
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {REGIONS.map((r) => (
                  <button key={r.id}
                    onClick={() => setSelected(r.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selected === r.id ? "bg-primary text-primary-foreground border-primary" : "bg-card/70 border-border"
                    }`}>{r.label}</button>
                ))}
              </div>
              <div>
                <label className="smallcaps text-foreground/55">What is it?</label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. headache, cramps"
                  className="mt-2 rounded-2xl bg-card/60 h-11" />
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="smallcaps text-foreground/55">Pain level</label>
                  <span className="font-display text-xl">{pain}<span className="text-sm text-muted-foreground"> / 10</span></span>
                </div>
                <Slider value={[pain]} onValueChange={(v) => setPain(v[0])} min={0} max={10} step={1} className="mt-3" />
                <div className="mt-2 h-2 rounded-full overflow-hidden"
                  style={{ background: `linear-gradient(90deg, var(--color-matcha), var(--color-apricot), var(--color-rose-deep))` }} />
              </div>
              <Button onClick={submit} disabled={!selected || !label.trim()} className="w-full h-11 rounded-2xl">
                Save entry
              </Button>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6 shadow-soft">
            <h3 className="font-display text-2xl">Recent</h3>
            {bodyLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-2">No entries yet. Your first log will appear here.</p>
            ) : (
              <ul className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
                {bodyLogs.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card/50 border border-border/40">
                    <span className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ background: painColor(b.pain), color: "#fff" }}>{b.pain}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{b.label}</div>
                      <div className="text-xs text-muted-foreground">{b.region} · {format(new Date(b.createdAt), "d MMM, HH:mm")}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeBodyLog(b.id)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function painColor(p: number) {
  if (p <= 3) return "var(--color-matcha-deep)";
  if (p <= 6) return "var(--color-apricot)";
  return "var(--color-rose-deep)";
}
