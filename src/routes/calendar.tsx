import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { dayInCycle, phaseForDay } from "@/lib/cycle";
import {
  addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isToday,
  startOfMonth, subMonths, addYears, startOfYear,
} from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Lunara" },
      { name: "description", content: "Year-ahead predictions and daily logs for your cycle." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { profile, phases, dailyLogs, upsertLog } = useAppStore();
  const [view, setView] = useState<"year" | "month">("month");
  const [cursor, setCursor] = useState(new Date());
  const [openDay, setOpenDay] = useState<Date | null>(null);
  const [showPredictions, setShowPredictions] = useState(true);

  return (
    <div className="px-5 md:px-10 pt-6 md:pt-10 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="smallcaps text-foreground/55">Calendar</p>
          <h1 className="font-display text-4xl md:text-5xl">A year of your rhythm</h1>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")} className="rounded-full">Month</Button>
          <Button variant={view === "year" ? "default" : "outline"} size="sm" onClick={() => setView("year")} className="rounded-full">Year</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowPredictions((s) => !s)} className="rounded-full">
            {showPredictions ? "Hide predictions" : "Show predictions"}
          </Button>
        </div>
      </header>

      {view === "month" ? (
        <MonthView
          cursor={cursor} setCursor={setCursor}
          phases={phases} profile={profile}
          dailyLogs={dailyLogs}
          showPredictions={showPredictions}
          onDayClick={setOpenDay}
        />
      ) : (
        <YearView phases={phases} profile={profile} dailyLogs={dailyLogs}
          showPredictions={showPredictions}
          onMonthClick={(d: Date) => { setCursor(d); setView("month"); }} />
      )}

      <DayLogSheet
        date={openDay}
        onClose={() => setOpenDay(null)}
        log={openDay ? dailyLogs[format(openDay, "yyyy-MM-dd")] : undefined}
        onSave={(date: Date, log: any) => { upsertLog(format(date, "yyyy-MM-dd"), log); }}
        currentPhase={openDay ? phaseForDay(dayInCycle(openDay, profile.lastPeriodStart, phases), phases).phase : null}
      />
    </div>
  );
}

function MonthView({ cursor, setCursor, phases, profile, dailyLogs, showPredictions, onDayClick }: any) {
  const start = startOfMonth(cursor);
  const end = endOfMonth(cursor);
  const days = eachDayOfInterval({ start, end });
  const offset = getDay(start);
  const today = new Date();

  return (
    <div className="glass rounded-[2rem] p-5 md:p-7 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => setCursor(subMonths(cursor, 1))} className="rounded-full"><ChevronLeft /></Button>
        <h2 className="font-display text-2xl">{format(cursor, "MMMM yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={() => setCursor(addMonths(cursor, 1))} className="rounded-full"><ChevronRight /></Button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] smallcaps text-foreground/50 mb-2">
        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: offset }).map((_, i) => <div key={`p-${i}`} />)}
        {days.map((d) => {
          const day = dayInCycle(d, profile.lastPeriodStart, phases);
          const { phase } = phaseForDay(day, phases);
          const key = format(d, "yyyy-MM-dd");
          const logged = !!dailyLogs[key];
          const isPast = d < today && !isSameDay(d, today);
          const isFuture = d > today;
          const showColor = logged || isPast || (isFuture && showPredictions) || isToday(d);
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDayClick(d)}
              className="aspect-square rounded-2xl relative flex items-center justify-center text-sm border bg-card/40 hover:bg-card/80 transition-colors"
              style={{
                borderColor: showColor ? `var(--color-${phase.color})` : "transparent",
                borderStyle: isFuture ? "dashed" : "solid",
                background: logged ? `color-mix(in oklab, var(--color-${phase.color}) 35%, transparent)` : undefined,
              }}
            >
              <span className={`${isToday(d) ? "font-bold" : ""}`}>{format(d, "d")}</span>
              {isToday(d) && (
                <span className="absolute inset-0 rounded-2xl ring-2 ring-primary animate-pulse-soft pointer-events-none" />
              )}
              {logged && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-foreground/70" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function YearView({ phases, profile, dailyLogs, showPredictions, onMonthClick }: any) {
  const months = useMemo(() => {
    const startM = startOfYear(new Date());
    return Array.from({ length: 12 }).map((_, i) => addMonths(startM, i));
  }, []);
  const today = new Date();
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((m) => {
          const days = eachDayOfInterval({ start: startOfMonth(m), end: endOfMonth(m) });
          return (
            <button key={m.toISOString()} onClick={() => onMonthClick(m)}
              className="glass rounded-2xl p-4 text-left hover:scale-[1.02] transition-transform shadow-soft">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg">{format(m, "MMMM")}</h3>
                <span className="text-xs text-muted-foreground">{format(m, "yyyy")}</span>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mt-3">
                {days.map((d) => {
                  const day = dayInCycle(d, profile.lastPeriodStart, phases);
                  const { phase } = phaseForDay(day, phases);
                  const key = format(d, "yyyy-MM-dd");
                  const logged = !!dailyLogs[key];
                  const isFuture = d > today;
                  const show = logged || !isFuture || showPredictions;
                  return (
                    <div key={key} className="aspect-square rounded-[5px]"
                      style={{
                        background: show ? `color-mix(in oklab, var(--color-${phase.color}) ${logged ? 80 : 45}%, transparent)` : "var(--color-muted)",
                      }}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
      <div className="text-center text-xs text-muted-foreground">
        Predictions extend up to 12 cycles ahead based on your average length.
      </div>
      <YearLookahead phases={phases} profile={profile} />
    </>
  );
}

function YearLookahead({ phases, profile }: any) {
  const next = useMemo(() => {
    if (!profile.lastPeriodStart) return [];
    const months: Date[] = [];
    const startM = startOfMonth(addYears(new Date(), 0));
    for (let i = 12; i < 24; i++) months.push(addMonths(startM, i));
    return months;
  }, [profile.lastPeriodStart]);

  if (next.length === 0) return null;
  return (
    <div className="mt-8 space-y-3">
      <h3 className="font-display text-2xl">Year ahead</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {next.map((m) => {
          const days = eachDayOfInterval({ start: startOfMonth(m), end: endOfMonth(m) });
          return (
            <div key={m.toISOString()} className="glass rounded-xl p-3 shadow-soft">
              <div className="text-xs font-medium">{format(m, "MMM yyyy")}</div>
              <div className="grid grid-cols-7 gap-0.5 mt-2">
                {days.map((d) => {
                  const day = dayInCycle(d, profile.lastPeriodStart, phases);
                  const { phase } = phaseForDay(day, phases);
                  return <div key={d.toISOString()} className="aspect-square rounded-[3px]"
                    style={{ background: `color-mix(in oklab, var(--color-${phase.color}) 40%, transparent)` }} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SYMPTOMS = ["cramps","headache","bloating","fatigue","tender breasts","acne","backache","nausea","cravings","insomnia"];
const MOODS = ["joyful","calm","tired","anxious","sad","irritable"] as const;
const FLOWS = ["none","spotting","light","medium","heavy"] as const;

function DayLogSheet({ date, onClose, log, onSave, currentPhase }: any) {
  const [draft, setDraft] = useState<any>({});
  const merged = { ...log, ...draft };

  if (!date) return <Sheet open={false} onOpenChange={onClose}><SheetContent /></Sheet>;

  return (
    <Sheet open={!!date} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">{format(date, "EEEE, d MMMM")}</SheetTitle>
          {currentPhase && (
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: `var(--color-${currentPhase.color})` }} />
              {currentPhase.name} phase
            </p>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1">
          <div>
            <p className="smallcaps text-foreground/55 mb-2">Flow</p>
            <div className="flex gap-2 flex-wrap">
              {FLOWS.map((f) => (
                <Chip key={f} active={merged.flow === f} onClick={() => setDraft({ ...draft, flow: f })}>{f}</Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="smallcaps text-foreground/55 mb-2">Mood</p>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map((m) => (
                <Chip key={m} active={merged.mood === m} onClick={() => setDraft({ ...draft, mood: m })}>{m}</Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="smallcaps text-foreground/55 mb-2">Symptoms</p>
            <div className="flex gap-2 flex-wrap">
              {SYMPTOMS.map((s) => {
                const active = (merged.symptoms ?? []).includes(s);
                return (
                  <Chip key={s} active={active} onClick={() => {
                    const cur = merged.symptoms ?? [];
                    setDraft({ ...draft, symptoms: active ? cur.filter((x: string) => x !== s) : [...cur, s] });
                  }}>{s}</Chip>
                );
              })}
            </div>
          </div>

          <div>
            <p className="smallcaps text-foreground/55 mb-2">Notes</p>
            <Textarea
              placeholder="Anything you want to remember..."
              value={merged.notes ?? ""}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="rounded-2xl bg-card/60"
            />
          </div>

          <Button className="w-full h-12 rounded-2xl" onClick={() => { onSave(date, draft); onClose(); }}>
            Save log
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Chip({ children, active, onClick }: any) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
        active ? "bg-primary text-primary-foreground border-primary" : "bg-card/70 border-border hover:border-primary/50"
      }`}>
      {children}
    </button>
  );
}
