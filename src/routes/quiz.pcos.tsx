import { createFileRoute } from "@tanstack/react-router";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { pcosQuestions } from "@/data/quizzes";

export const Route = createFileRoute("/quiz/pcos")({
  head: () => ({
    meta: [
      { title: "PCOS Self-Assessment — Atossa" },
      { name: "description", content: "An educational reflection on common PCOS indicators." },
    ],
  }),
  component: () => (
    <QuizFlow
      type="pcos"
      title="PCOS Reflection"
      intro="Twelve gentle questions about your cycle, skin, energy, and family history. Take your time — answer based on the past 6 months."
      questions={pcosQuestions}
      resultGuidance={{
        Low: "Your responses don't strongly suggest PCOS patterns. Continue tracking — small changes often appear before big ones.",
        Moderate: "Several PCOS indicators are present. Consider tracking symptoms in detail and discussing them with a healthcare provider at your next visit.",
        Elevated: "Many PCOS indicators are present. We strongly encourage you to book a consultation with a gynecologist or endocrinologist for proper evaluation (hormone panel and ultrasound).",
      }}
    />
  ),
});
