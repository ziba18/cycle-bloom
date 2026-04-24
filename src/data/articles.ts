export type Article = {
  slug: string;
  title: string;
  category: "Cycle Basics" | "Hormones" | "Nutrition" | "Mental Health" | "Conditions";
  readTime: number;
  excerpt: string;
  cover: string; // gradient class
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "the-four-phases",
    title: "The four phases, gently explained",
    category: "Cycle Basics",
    readTime: 5,
    excerpt: "Menstrual, follicular, ovulation, luteal — what each phase actually does inside you.",
    cover: "from-rose to-apricot",
    body: [
      "Your cycle is a quiet orchestra. Each phase has a different rhythm, a different mood, and a different purpose.",
      "The menstrual phase is a release. Estrogen and progesterone are at their lowest, and your body is shedding the lining it built last cycle. Energy is naturally lower — that is not weakness, it is design.",
      "The follicular phase begins as estrogen rises. Follicles in the ovary mature, and you may feel sharper, more curious, more willing to start things.",
      "Ovulation is a peak — of estrogen, of confidence, of fertility. Many people feel their most articulate and social in this short window.",
      "The luteal phase is the slow exhale. Progesterone climbs, then drops if pregnancy does not occur. Sensitivity often increases. This is the body asking for softness.",
    ],
  },
  {
    slug: "iron-and-you",
    title: "Iron, ferritin, and the menstruating body",
    category: "Nutrition",
    readTime: 4,
    excerpt: "Why iron matters, and the gentle ways to keep your stores topped up.",
    cover: "from-matcha to-sky",
    body: [
      "If you menstruate, you lose iron. It is one of the most common nutritional gaps for women worldwide.",
      "Heme iron from animal sources is most readily absorbed. Plant sources (lentils, spinach, tofu) absorb better when paired with vitamin C.",
      "Coffee and tea reduce iron absorption — try keeping them an hour away from iron-rich meals.",
      "If you are persistently exhausted, ask your doctor for a ferritin test, not just hemoglobin.",
    ],
  },
  {
    slug: "mood-and-the-luteal-dip",
    title: "Why the luteal phase can feel heavy",
    category: "Mental Health",
    readTime: 6,
    excerpt: "PMS is real, neurochemical, and worth understanding — not dismissing.",
    cover: "from-sky to-lavender",
    body: [
      "In the days before your period, progesterone falls. Serotonin, the calming neurotransmitter, often falls with it.",
      "This is why irritability, anxiety, and tearfulness can show up. It is biology, not a personal failing.",
      "Magnesium, vitamin B6, and omega-3s have evidence for reducing PMS intensity.",
      "If symptoms severely disrupt your life every month, ask about PMDD — a treatable, more intense form of premenstrual change.",
    ],
  },
  {
    slug: "movement-by-phase",
    title: "Cycling your training",
    category: "Cycle Basics",
    readTime: 4,
    excerpt: "Strength, stamina, and stretch — matched to where you are in your cycle.",
    cover: "from-matcha to-apricot",
    body: [
      "Follicular: rising estrogen helps you build muscle and try new movements.",
      "Ovulation: peak coordination and power. Personal records often happen here.",
      "Luteal: stamina dips slightly; lean into steady-state cardio and yoga.",
      "Menstrual: light walks, gentle stretching, and rest are not lazy — they are smart.",
    ],
  },
  {
    slug: "estrogen-101",
    title: "Estrogen: more than a sex hormone",
    category: "Hormones",
    readTime: 5,
    excerpt: "Bones, brain, mood, skin — estrogen quietly runs more than you think.",
    cover: "from-rose to-lavender",
    body: [
      "Estrogen has receptors in nearly every tissue: brain, bones, heart, skin.",
      "When estrogen rises in the follicular phase, many people notice clearer thinking and brighter skin.",
      "Long-term low estrogen is associated with bone density loss — one reason perimenopause deserves attention.",
    ],
  },
  {
    slug: "pcos-essentials",
    title: "PCOS: what it is, what it isn't",
    category: "Conditions",
    readTime: 6,
    excerpt: "An overview of polycystic ovary syndrome, and why diagnosis is often slow.",
    cover: "from-apricot to-rose",
    body: [
      "PCOS affects roughly 1 in 10 women of reproductive age. Diagnosis requires two of three: irregular cycles, signs of high androgens, or polycystic ovaries on ultrasound.",
      "It is a metabolic and hormonal condition — insulin resistance is often involved.",
      "Treatment is highly individualized: diet, exercise, sometimes medication. There is no single 'cure', but symptoms can improve dramatically with the right support.",
      "If you suspect PCOS, ask for a full hormone panel and an ultrasound. Self-advocate.",
    ],
  },
  {
    slug: "endometriosis-basics",
    title: "Endometriosis, in plain language",
    category: "Conditions",
    readTime: 6,
    excerpt: "Painful periods are common — but they aren't always normal.",
    cover: "from-rose to-sky",
    body: [
      "Endometriosis is when tissue similar to the uterine lining grows outside the uterus. It can cause severe pain, heavy bleeding, and fertility challenges.",
      "Average time to diagnosis is still 7–10 years. If your periods make you miss school, work, or life — that is worth investigating.",
      "Laparoscopy is the only definitive diagnostic, but imaging and symptom history guide most early decisions.",
    ],
  },
  {
    slug: "tracking-your-temperature",
    title: "What basal body temperature can tell you",
    category: "Cycle Basics",
    readTime: 3,
    excerpt: "A small daily ritual that reveals when you actually ovulated.",
    cover: "from-sky to-matcha",
    body: [
      "After ovulation, progesterone causes a small (0.2–0.5°C) sustained rise in resting body temperature.",
      "Take your temperature at the same time each morning, before getting up.",
      "Patterns appear over weeks — one cycle is a beginning, three is a story.",
    ],
  },
  {
    slug: "sleep-and-cycles",
    title: "Sleep moves with your cycle",
    category: "Mental Health",
    readTime: 4,
    excerpt: "Why insomnia loves the late luteal phase.",
    cover: "from-lavender to-sky",
    body: [
      "Body temperature rises in the luteal phase, which can disrupt sleep.",
      "Progesterone is sedating — until it drops sharply before your period, which can fragment sleep.",
      "Cooler bedrooms, magnesium, and consistent wake times help most.",
    ],
  },
  {
    slug: "fueling-your-cycle",
    title: "Eat with your phase",
    category: "Nutrition",
    readTime: 5,
    excerpt: "A loose, kind framework — not a strict prescription.",
    cover: "from-matcha to-rose",
    body: [
      "Menstrual: warm, iron-rich, hydrating. Soups, stews, leafy greens.",
      "Follicular: fresh and energizing. Fermented foods, lean proteins.",
      "Ovulation: light and bright. Fiber-rich vegetables, antioxidants.",
      "Luteal: grounding and complex. Whole grains, magnesium-rich foods, healthy fats.",
    ],
  },
  {
    slug: "the-pill-explained",
    title: "Hormonal contraception, demystified",
    category: "Hormones",
    readTime: 5,
    excerpt: "What you are actually taking, and what it does in your body.",
    cover: "from-sky to-rose",
    body: [
      "Combined pills contain synthetic estrogen and progestin. They suppress ovulation and thin the uterine lining.",
      "Progestin-only methods (mini-pill, IUD, implant) work mainly by thickening cervical mucus.",
      "There is no 'natural' or 'unnatural' — only what works for your body and your goals. Reassess every few years.",
    ],
  },
  {
    slug: "when-to-see-a-doctor",
    title: "Signs worth a doctor's visit",
    category: "Conditions",
    readTime: 3,
    excerpt: "A short, honest checklist.",
    cover: "from-apricot to-matcha",
    body: [
      "Periods that consistently disrupt your daily life",
      "Cycles shorter than 21 days or longer than 35 days for several months",
      "Bleeding between periods, or very heavy bleeding (soaking a pad/tampon every hour)",
      "Pain during sex",
      "Sudden, significant changes after years of regularity",
      "Trust your gut. You know your body.",
    ],
  },
];

export const usefulLinks = [
  { name: "ACOG — Patient resources", url: "https://www.acog.org/womens-health" },
  { name: "NHS — Periods and menstrual health", url: "https://www.nhs.uk/conditions/periods/" },
  { name: "Endometriosis Foundation", url: "https://www.endofound.org/" },
  { name: "PCOS Awareness Association", url: "https://www.pcosaa.org/" },
];
