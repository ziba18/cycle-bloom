import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/store/useAppStore";
import { dayInCycle, phaseForDay, nextPeriodDate, totalDays } from "@/lib/cycle";
import { PolygonCycle } from "@/components/PolygonCycle";
import { differenceInCalendarDays, format } from "date-fns";
import { ArrowRight, Heart, Sparkles, Activity, BookOpen } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Lunara" },
      { name: "description", content: "Your daily cycle snapshot, mood, and wellness overview." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { profile, phases, dailyLogs, bodyLogs, quizResults } = useAppStore();
  const today = new Date();
  const day = dayInCycle(today, profile.lastPeriodStart, phases);
  const { phase, dayInPhase } = phaseForDay(day, phases);
  const next = nextPeriodDate(profile.lastPeriodStart, phases);
  const daysToNext = next ? differenceInCalendarDays(next, today) : null;
  const total = totalDays(phases);

  const todayKey = format(today, "yyyy-MM-dd");
  const todayLog = dailyLogs[todayKey];
  const lastBody = bodyLogs[0];

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="px-5 md:px-10 pt-6 md:pt-10 max-w-6xl mx-auto space-y-8">
      <header className="space-y-1">
        <p className="smallcaps text-foreground/55">{format(today, "EEEE, d MMMM")}</p>
        <h1 className="font-display text-4xl md:text-5xl">
          {greeting}{profile.name ? `, ${profile.name}` : ""}.
        </h1>
        <p className="text-muted-foreground italic font-display text-lg">
          You are exactly where you need to be.
        </p>
      </header>

      {/* Hero card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-[2rem] p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center shadow-soft"
      >
        <div className="space-y-3">
          <p className="smallcaps text-foreground/50">Today</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">
            Day {day} of {total} —{" "}
            <span style={{ color: `var(--color-${phase.color}-deep, var(--color-${phase.color}))` }}>
              {phase.name}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
            {phase.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {phase.tips.slice(0, 3).map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-card/70 border border-border/60">
                {t}
              </span>
            ))}
          </div>
          <div className="pt-3">
            <Link to="/cycle" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
              View full cycle <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="w-full max-w-[260px] mx-auto">
          <PolygonCycle phases={phases} day={day} size={260} showLabels={false} />
        </div>
      </motion.section>

      {/* Stat tiles */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Next period" value={daysToNext != null ? `${daysToNext}d` : "—"} hint={next ? format(next, "MMM d") : ""} accent="rose" />
        <Stat label="Cycle length" value={`${profile.avgCycleLength}d`} hint="average" accent="matcha" />
        <Stat label="Day in phase" value={`${dayInPhase}/${phase.days}`} hint={phase.name} accent="sky" />
        <Stat label="Logs this cycle" value={`${Object.keys(dailyLogs).length}`} hint="entries" accent="apricot" />
      </section>

      {/* Today for you carousel */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">For you today</h3>
          <Sparkles className="h-4 w-4 text-matcha-deep" />
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            <SuggestCard className="bg-rose/40" icon={<Heart className="h-5 w-5" />}
              title="Log how you feel"
              body={todayLog?.mood ? `Mood saved: ${todayLog.mood}` : "Capture today's mood and symptoms in seconds."}
              to="/calendar" cta="Open calendar" />
            <SuggestCard className="bg-matcha/40" icon={<BookOpen className="h-5 w-5" />}
              title="Read about your phase"
              body={`Articles tuned to the ${phase.name.toLowerCase()} phase are waiting.`}
              to="/learn" cta="Browse Learn" />
            <SuggestCard className="bg-sky/40" icon={<Activity className="h-5 w-5" />}
              title="Body check-in"
              body={lastBody ? `Last log: ${lastBody.label} (${lastBody.region})` : "Note where you feel discomfort on a 3D body."}
              to="/body" cta="Open body" />
            <SuggestCard className="bg-apricot/50" icon={<Sparkles className="h-5 w-5" />}
              title="Self-assessment"
              body={quizResults[0] ? `Last result: ${quizResults[0].type.toUpperCase()} — ${quizResults[0].percent}%` : "Try the PCOS or Endometriosis self-test."}
              to="/quiz/pcos" cta="Take quiz" />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground text-center pt-4 max-w-lg mx-auto leading-relaxed">
        Lunara is for personal tracking and education. It is not a medical device and does not provide diagnoses.
      </p>
    </div>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent: string }) {
  return (
    <div className="rounded-3xl p-5 bg-card/60 backdrop-blur border border-border/50 shadow-soft">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full bg-${accent}`} />
        <span className="smallcaps text-foreground/50">{label}</span>
      </div>
      <div className="mt-3 font-display text-3xl">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

function SuggestCard({ icon, title, body, cta, to, className = "" }: any) {
  return (
    <div className="shrink-0 basis-[78%] sm:basis-[48%] md:basis-[32%] min-w-0">
      <Link to={to as any} className="block group">
        <div className={`rounded-3xl p-5 h-full border border-border/50 ${className} transition-transform group-hover:-translate-y-1`}>
          <div className="h-10 w-10 rounded-2xl bg-card/70 flex items-center justify-center text-foreground/70">
            {icon}
          </div>
          <h4 className="mt-4 font-display text-xl">{title}</h4>
          <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{body}</p>
          <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium">
            {cta} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}
