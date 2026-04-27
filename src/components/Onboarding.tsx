import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export function Onboarding() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [lastPeriod, setLastPeriod] = useState(format(new Date(), "yyyy-MM-dd"));
  const [cycleLength, setCycleLength] = useState(28);

  const next = () => setStep((s) => s + 1);
  const finish = () => {
    completeOnboarding({
      name: name.trim() || undefined,
      lastPeriodStart: lastPeriod,
      avgCycleLength: cycleLength,
      onboarded: true,
    });
  };

  return (
    <div className="min-h-screen aurora-bg relative overflow-hidden flex items-center justify-center px-5">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-matcha/40 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-rose/40 blur-3xl animate-float-slow" style={{ animationDelay: "-5s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-[2rem] p-8 shadow-soft">
          <div className="flex justify-center mb-6">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-8 bg-primary" : "w-1.5 bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="welcome" {...slide}>
                <div className="text-center space-y-3">
                  <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-matcha to-rose shadow-glow" />
                  <h1 className="font-display text-4xl">Welcome to Atossa</h1>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A gentle, personalized companion for your cycle. Built around the truth that no two bodies are the same.
                  </p>
                </div>
                <div className="mt-8 space-y-3">
                  <Label className="smallcaps text-foreground/60">What should we call you?</Label>
                  <Input
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-2xl h-12 bg-card/60"
                  />
                </div>
                <Button onClick={next} className="w-full mt-8 h-12 rounded-2xl">Begin</Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="cycle" {...slide}>
                <div className="text-center space-y-2">
                  <h1 className="font-display text-3xl">Your last cycle</h1>
                  <p className="text-muted-foreground text-sm">
                    When did your most recent period begin?
                  </p>
                </div>
                <div className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="smallcaps text-foreground/60">First day</Label>
                    <Input
                      type="date"
                      value={lastPeriod}
                      max={format(new Date(), "yyyy-MM-dd")}
                      onChange={(e) => setLastPeriod(e.target.value)}
                      className="rounded-2xl h-12 bg-card/60"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <Label className="smallcaps text-foreground/60">Average cycle length</Label>
                      <span className="font-display text-2xl">{cycleLength} <span className="text-sm text-muted-foreground">days</span></span>
                    </div>
                    <Slider
                      value={[cycleLength]}
                      min={20}
                      max={45}
                      step={1}
                      onValueChange={(v) => setCycleLength(v[0])}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <Button variant="ghost" onClick={() => setStep(0)} className="h-12 rounded-2xl">Back</Button>
                  <Button onClick={next} className="h-12 rounded-2xl">Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="phases" {...slide}>
                <div className="text-center space-y-2">
                  <h1 className="font-display text-3xl">Your shape</h1>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We start with the four classic phases — menstrual, follicular, ovulation, luteal. You can reshape them any time on the Cycle tab.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { name: "Menstrual", color: "bg-rose" },
                    { name: "Follicular", color: "bg-matcha" },
                    { name: "Ovulation", color: "bg-apricot" },
                    { name: "Luteal", color: "bg-sky" },
                  ].map((p) => (
                    <div key={p.name} className="rounded-2xl p-4 bg-card/50 border border-border/40 flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${p.color}`} />
                      <span className="text-sm">{p.name}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[11px] text-muted-foreground text-center leading-relaxed">
                  Atossa is for personal tracking and education. It is not a medical device and does not provide diagnoses.
                </p>
                <Button onClick={finish} className="w-full mt-6 h-12 rounded-2xl">Enter Atossa</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const slide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};
