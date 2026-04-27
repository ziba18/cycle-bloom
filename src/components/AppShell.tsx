import { Link, useLocation } from "@tanstack/react-router";
import { Home, Hexagon, CalendarDays, Sparkles, BookOpen, User2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Onboarding } from "@/components/Onboarding";
import { motion } from "framer-motion";

type Tab = { to: string; label: string; icon: typeof Home; exact?: boolean };
const tabs: Tab[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/cycle", label: "Cycle", icon: Hexagon },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/body", label: "Body", icon: User2 },
  { to: "/learn", label: "Learn", icon: BookOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const onboarded = useAppStore((s) => s.profile.onboarded);
  const location = useLocation();

  if (!onboarded) return <Onboarding />;

  return (
    <div className="min-h-screen aurora-bg relative overflow-hidden">
      {/* Floating ambient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-matcha/30 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-rose/30 blur-3xl animate-float-slow" style={{ animationDelay: "-4s" }} />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky/30 blur-3xl animate-float-slow" style={{ animationDelay: "-8s" }} />
      </div>

      <div className="relative z-10 flex min-h-screen md:flex-row flex-col">
        {/* Desktop side rail */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 px-6 py-10 border-r border-border/50 bg-card/40 backdrop-blur-xl">
          <Brand />
          <nav className="mt-10 space-y-1">
            {tabs.map((t) => {
              const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to as any}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{t.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-8 text-xs text-muted-foreground">
            <p className="font-display italic text-base">"Soft is strong."</p>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border/40 bg-card/40 backdrop-blur-xl">
          <Brand small />
          <Sparkles className="h-5 w-5 text-matcha-deep" />
        </header>

        {/* Main */}
        <main className="flex-1 pb-28 md:pb-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass rounded-3xl px-2 py-2 shadow-soft">
          <div className="flex items-center justify-around">
            {tabs.map((t) => {
              const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to as any}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] transition-colors ${
                    active ? "text-primary" : "text-foreground/55"
                  }`}
                >
                  <div className={`rounded-2xl p-2 transition-all ${active ? "bg-primary/15" : ""}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{t.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-matcha to-rose blur-sm opacity-70" />
        <span className="relative h-7 w-7 rounded-full bg-gradient-to-br from-cream to-rose border border-foreground/10" />
      </span>
      <span className={`font-display ${small ? "text-2xl" : "text-3xl"} tracking-tight`}>
        Atossa
      </span>
    </Link>
  );
}
