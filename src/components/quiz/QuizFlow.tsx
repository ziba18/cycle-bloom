import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { score, type Question } from "@/data/quizzes";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";

type Props = {
  type: "pcos" | "endo";
  title: string;
  intro: string;
  questions: Question[];
  resultGuidance: Record<"Low" | "Moderate" | "Elevated", string>;
};

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

export function QuizFlow({ type, title, intro, questions, resultGuidance }: Props) {
  const [step, setStep] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | "maybe">>({});
  const [done, setDone] = useState<{ percent: number; band: "Low" | "Moderate" | "Elevated" } | null>(null);
  const addQuizResult = useAppStore((s) => s.addQuizResult);

  const total = questions.length;

  const finish = () => {
    const r = score(answers, questions);
    setDone(r);
    addQuizResult({ type, percent: r.percent, band: r.band });
  };

  const reset = () => { setStep(-1); setAnswers({}); setDone(null); };

  return (
    <div className="px-5 md:px-10 pt-6 md:pt-10 max-w-2xl mx-auto">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-6 glass rounded-[2rem] p-6 md:p-10 shadow-soft min-h-[460px]">
        <AnimatePresence mode="wait">
          {step === -1 && !done && (
            <motion.div key="intro" {...slide}>
              <p className="smallcaps text-foreground/55">Self-assessment</p>
              <h1 className="font-display text-4xl mt-2">{title}</h1>
              <p className="text-muted-foreground mt-3 leading-relaxed">{intro}</p>
              <div className="rounded-2xl bg-rose/15 border border-rose/40 p-4 mt-6 text-sm">
                This quiz is for reflection, not diagnosis. A real diagnosis only comes from a healthcare professional.
              </div>
              <Button onClick={() => setStep(0)} className="mt-8 h-12 rounded-2xl px-8">
                Begin <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step >= 0 && step < total && !done && (
            <motion.div key={`q-${step}`} {...slide}>
              <div className="flex items-center justify-between mb-6">
                <span className="smallcaps text-foreground/55">Question {step + 1} of {total}</span>
                <div className="h-1 flex-1 mx-4 rounded-full bg-foreground/10 overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
                </div>
              </div>

              <h2 className="font-display text-3xl leading-tight min-h-[100px]">{questions[step].text}</h2>

              <div className="grid grid-cols-3 gap-3 mt-8">
                {(["no", "maybe", "yes"] as const).map((a) => (
                  <button key={a}
                    onClick={() => {
                      setAnswers({ ...answers, [questions[step].id]: a });
                      if (step === total - 1) finish();
                      else setStep(step + 1);
                    }}
                    className={`h-16 rounded-2xl border-2 font-medium capitalize transition-all hover:scale-[1.02] ${
                      answers[questions[step].id] === a ? "border-primary bg-primary/10" : "border-border bg-card/60"
                    }`}>{a}</button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(Math.max(-1, step - 1))} className="rounded-2xl">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                {answers[questions[step].id] && step < total - 1 && (
                  <Button onClick={() => setStep(step + 1)} className="rounded-2xl">
                    Next <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {done && (
            <motion.div key="result" {...slide} className="text-center">
              <p className="smallcaps text-foreground/55">Your reflection</p>
              <h2 className="font-display text-3xl mt-2">{title}</h2>

              <div className="my-8 flex justify-center">
                <Gauge percent={done.percent} band={done.band} />
              </div>

              <p className="font-display text-2xl">{done.band} likelihood</p>
              <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto leading-relaxed">
                {resultGuidance[done.band]}
              </p>

              <div className="rounded-2xl bg-card/60 border border-border p-4 mt-6 text-xs text-foreground/70 text-left">
                <strong className="block font-display text-sm mb-1">A note on this score</strong>
                It is a starting point for a conversation, not a verdict. If anything in your body feels persistently off, please reach out to a healthcare provider.
              </div>

              <div className="flex gap-3 justify-center mt-8">
                <Button variant="outline" onClick={reset} className="rounded-2xl">
                  <RefreshCw className="h-4 w-4 mr-1" /> Retake
                </Button>
                <Link to="/learn">
                  <Button className="rounded-2xl">Read more</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Gauge({ percent, band }: { percent: number; band: string }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const color = band === "Low" ? "var(--color-matcha-deep)"
    : band === "Moderate" ? "var(--color-apricot)"
    : "var(--color-rose-deep)";
  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      <circle cx={90} cy={90} r={r} fill="none" stroke="var(--color-border)" strokeWidth={12} />
      <motion.circle cx={90} cy={90} r={r} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        transform="rotate(-90 90 90)" />
      <text x={90} y={92} textAnchor="middle" className="fill-foreground" style={{ fontSize: 32, fontFamily: "var(--font-display)", fontWeight: 600 }}>
        {percent}%
      </text>
      <text x={90} y={114} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        likelihood
      </text>
    </svg>
  );
}
