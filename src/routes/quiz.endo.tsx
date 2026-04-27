import { createFileRoute } from "@tanstack/react-router";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { endoQuestions } from "@/data/quizzes";

export const Route = createFileRoute("/quiz/endo")({
  head: () => ({
    meta: [
      { title: "Endometriosis Self-Assessment — Atossa" },
      { name: "description", content: "An educational reflection on endometriosis indicators." },
    ],
  }),
  component: () => (
    <QuizFlow
      type="endo"
      title="Endometriosis Reflection"
      intro="Twelve questions about pain, periods, and patterns over time. Painful periods are common — but they are not always normal."
      questions={endoQuestions}
      resultGuidance={{
        Low: "Your responses don't strongly suggest endometriosis patterns. Keep tracking — context across months gives the clearest picture.",
        Moderate: "Some endometriosis indicators are present. Consider keeping a detailed pain diary and bringing it to a healthcare provider.",
        Elevated: "Many endometriosis indicators are present. Please book a consultation with a gynecologist who has experience with endometriosis. Average time to diagnosis is 7–10 years — early advocacy matters.",
      }}
    />
  ),
});
