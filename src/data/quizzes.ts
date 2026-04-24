// Educational, non-diagnostic self-assessment items.
export type Question = {
  id: string;
  text: string;
  // weight = how much a "yes" contributes to the score (0..1)
  weight: number;
};

export const pcosQuestions: Question[] = [
  { id: "p1", text: "Are your menstrual cycles often irregular (shorter than 21 or longer than 35 days)?", weight: 1 },
  { id: "p2", text: "Have you sometimes gone three or more months without a period?", weight: 1 },
  { id: "p3", text: "Do you experience persistent acne, especially along the jawline?", weight: 0.6 },
  { id: "p4", text: "Have you noticed unusual hair growth on the face, chest, or back?", weight: 0.9 },
  { id: "p5", text: "Have you noticed thinning hair on the scalp?", weight: 0.6 },
  { id: "p6", text: "Do you find weight gain (especially around the abdomen) hard to manage?", weight: 0.7 },
  { id: "p7", text: "Have you ever been told you have insulin resistance or pre-diabetes?", weight: 0.9 },
  { id: "p8", text: "Do you have darkened patches of skin (e.g. neck, underarms)?", weight: 0.7 },
  { id: "p9", text: "Has a relative been diagnosed with PCOS?", weight: 0.5 },
  { id: "p10", text: "Have you had difficulty conceiving for 6+ months?", weight: 0.7 },
  { id: "p11", text: "Do you experience strong sugar or carb cravings frequently?", weight: 0.4 },
  { id: "p12", text: "Have you experienced ovarian cysts on ultrasound?", weight: 0.9 },
];

export const endoQuestions: Question[] = [
  { id: "e1", text: "Are your period cramps severe enough to interfere with work, school, or daily life?", weight: 1 },
  { id: "e2", text: "Do over-the-counter pain medications often fail to relieve your menstrual pain?", weight: 0.9 },
  { id: "e3", text: "Do you experience pain during or after sex?", weight: 0.9 },
  { id: "e4", text: "Do you have pain when urinating or during bowel movements, especially during your period?", weight: 0.8 },
  { id: "e5", text: "Do you have very heavy or prolonged periods (over 7 days)?", weight: 0.7 },
  { id: "e6", text: "Do you experience chronic pelvic pain even outside your period?", weight: 0.9 },
  { id: "e7", text: "Do you suffer from severe fatigue around your period?", weight: 0.5 },
  { id: "e8", text: "Have you experienced infertility or difficulty conceiving?", weight: 0.7 },
  { id: "e9", text: "Has a close family member been diagnosed with endometriosis?", weight: 0.5 },
  { id: "e10", text: "Do you experience digestive issues (bloating, nausea, diarrhea) cyclically?", weight: 0.6 },
  { id: "e11", text: "Has your period pain worsened over the years?", weight: 0.7 },
  { id: "e12", text: "Do you experience pain in your lower back or legs during your period?", weight: 0.6 },
];

export function score(answers: Record<string, "yes" | "no" | "maybe">, questions: Question[]) {
  const max = questions.reduce((s, q) => s + q.weight, 0);
  const got = questions.reduce((s, q) => {
    const a = answers[q.id];
    if (a === "yes") return s + q.weight;
    if (a === "maybe") return s + q.weight * 0.5;
    return s;
  }, 0);
  const percent = Math.round((got / max) * 100);
  const band: "Low" | "Moderate" | "Elevated" =
    percent < 33 ? "Low" : percent < 66 ? "Moderate" : "Elevated";
  return { percent, band };
}
