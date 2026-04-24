import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { dayInCycle, totalDays } from "@/lib/cycle";
import { PolygonCycle } from "@/components/PolygonCycle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cycle")({
  head: () => ({
    meta: [
      { title: "Your Cycle — Lunara" },
      { name: "description", content: "A polygon shaped to your unique cycle phases. Edit phases, lengths, and colors." },
    ],
  }),
  component: CyclePage,
});

const COLORS = ["matcha", "rose", "sky", "apricot", "lavender", "matcha-deep"];

function CyclePage() {
  const { profile, phases, updatePhase, addPhase, removePhase } = useAppStore();
  const day = dayInCycle(new Date(), profile.lastPeriodStart, phases);
  const total = totalDays(phases);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="px-5 md:px-10 pt-6 md:pt-10 max-w-5xl mx-auto space-y-8">
      <header>
        <p className="smallcaps text-foreground/55">Your shape</p>
        <h1 className="font-display text-4xl md:text-5xl">The polygon of you</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          {phases.length === 2 && "Two phases trace a line."}
          {phases.length === 3 && "Three phases form a triangle."}
          {phases.length === 4 && "Four phases shape a quadrilateral."}
          {phases.length === 5 && "Five phases bloom into a pentagon."}
          {phases.length === 6 && "Six phases form a hexagon."}
          {" "}Each edge's length mirrors how long that phase lasts.
        </p>
      </header>

      <div className="glass rounded-[2rem] p-6 md:p-10 shadow-soft flex justify-center">
        <PolygonCycle phases={phases} day={day} size={420} onPhaseClick={setOpenIdx} />
      </div>

      {/* Phase editor */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Phases</h2>
            <p className="text-xs text-muted-foreground">Total cycle: {total} days</p>
          </div>
          <Button variant="outline" size="sm" onClick={addPhase} disabled={phases.length >= 6} className="rounded-full">
            <Plus className="h-4 w-4 mr-1" /> Add phase
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {phases.map((p, i) => (
            <div key={p.id} className="rounded-3xl p-5 bg-card/60 border border-border/50 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full" style={{ background: `var(--color-${p.color})` }} />
                <Input
                  value={p.name}
                  onChange={(e) => updatePhase(p.id, { name: e.target.value })}
                  className="rounded-xl bg-transparent border-transparent hover:border-border focus:border-border h-9 text-base font-medium px-2"
                />
                <Button variant="ghost" size="icon" onClick={() => removePhase(p.id)} disabled={phases.length <= 2} className="ml-auto h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="smallcaps text-foreground/55">Length</span>
                  <span className="font-display text-xl">{p.days} <span className="text-xs text-muted-foreground">days</span></span>
                </div>
                <Slider value={[p.days]} min={1} max={20} step={1} onValueChange={(v) => updatePhase(p.id, { days: v[0] })} />
                <div className="flex gap-2 pt-1 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updatePhase(p.id, { color: c })}
                      className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${p.color === c ? "border-foreground/60 scale-110" : "border-transparent"}`}
                      style={{ background: `var(--color-${c})` }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Sheet open={openIdx !== null} onOpenChange={(v) => !v && setOpenIdx(null)}>
        <SheetContent className="sm:max-w-md">
          {openIdx !== null && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: `var(--color-${phases[openIdx].color})` }} />
                  <SheetTitle className="font-display text-2xl">{phases[openIdx].name}</SheetTitle>
                </div>
                <SheetDescription>{phases[openIdx].days} days of your cycle</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5 px-1">
                <p className="text-sm leading-relaxed text-foreground/80">{phases[openIdx].description}</p>
                <div>
                  <p className="smallcaps text-foreground/55 mb-2">Suggested care</p>
                  <ul className="space-y-1.5">
                    {phases[openIdx].tips.map((t) => (
                      <li key={t} className="text-sm flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
