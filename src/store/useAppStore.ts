import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Phase = {
  id: string;
  name: string;
  color: string; // CSS var name like "matcha"
  days: number;
  description: string;
  tips: string[];
};

export type DailyLog = {
  flow?: "none" | "spotting" | "light" | "medium" | "heavy";
  mood?: "joyful" | "calm" | "tired" | "anxious" | "sad" | "irritable";
  symptoms?: string[];
  notes?: string;
};

export type BodyLog = {
  id: string;
  region: string;
  label: string;
  pain: number; // 0-10
  createdAt: string; // iso
};

export type QuizResult = {
  id: string;
  type: "pcos" | "endo";
  percent: number;
  band: "Low" | "Moderate" | "Elevated";
  takenAt: string;
};

export type Profile = {
  name?: string;
  lastPeriodStart?: string; // iso date
  avgCycleLength: number;
  onboarded: boolean;
};

type AppState = {
  profile: Profile;
  phases: Phase[];
  dailyLogs: Record<string, DailyLog>;
  bodyLogs: BodyLog[];
  quizResults: QuizResult[];

  setProfile: (p: Partial<Profile>) => void;
  completeOnboarding: (p: Partial<Profile>) => void;
  resetOnboarding: () => void;

  setPhases: (phases: Phase[]) => void;
  updatePhase: (id: string, patch: Partial<Phase>) => void;
  addPhase: () => void;
  removePhase: (id: string) => void;

  upsertLog: (date: string, log: Partial<DailyLog>) => void;
  addBodyLog: (l: Omit<BodyLog, "id" | "createdAt">) => void;
  removeBodyLog: (id: string) => void;
  addQuizResult: (r: Omit<QuizResult, "id" | "takenAt">) => void;
};

const defaultPhases: Phase[] = [
  {
    id: "menstrual",
    name: "Menstrual",
    color: "rose",
    days: 5,
    description:
      "The shedding phase. Energy is naturally lower — your body is doing quiet, important work.",
    tips: ["Rest deeply", "Iron-rich foods", "Warm baths", "Gentle stretching"],
  },
  {
    id: "follicular",
    name: "Follicular",
    color: "matcha",
    days: 9,
    description:
      "Estrogen rises. You may feel creative, social, and ready to start new things.",
    tips: ["Try something new", "Strength training", "Plan & dream"],
  },
  {
    id: "ovulation",
    name: "Ovulation",
    color: "apricot",
    days: 4,
    description:
      "Peak energy and confidence. Communication and connection feel effortless.",
    tips: ["Big conversations", "Hydrate", "Light, fresh meals"],
  },
  {
    id: "luteal",
    name: "Luteal",
    color: "sky",
    days: 10,
    description:
      "Wind-down phase. Focus turns inward; sensitivity may increase before your next cycle.",
    tips: ["Magnesium-rich foods", "Slower workouts", "Earlier bedtimes", "Journal"],
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: { avgCycleLength: 28, onboarded: false },
      phases: defaultPhases,
      dailyLogs: {},
      bodyLogs: [],
      quizResults: [],

      setProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      completeOnboarding: (p) =>
        set({ profile: { ...get().profile, ...p, onboarded: true } }),
      resetOnboarding: () =>
        set({ profile: { ...get().profile, onboarded: false } }),

      setPhases: (phases) => set({ phases }),
      updatePhase: (id, patch) =>
        set({
          phases: get().phases.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }),
      addPhase: () => {
        const phases = get().phases;
        if (phases.length >= 6) return;
        const palette = ["matcha", "rose", "sky", "apricot", "lavender", "matcha-deep"];
        set({
          phases: [
            ...phases,
            {
              id: `phase-${Date.now()}`,
              name: `Phase ${phases.length + 1}`,
              color: palette[phases.length % palette.length],
              days: 5,
              description: "Customize this phase to match your body.",
              tips: ["Listen to your body"],
            },
          ],
        });
      },
      removePhase: (id) => {
        const phases = get().phases;
        if (phases.length <= 2) return;
        set({ phases: phases.filter((p) => p.id !== id) });
      },

      upsertLog: (date, log) =>
        set({
          dailyLogs: {
            ...get().dailyLogs,
            [date]: { ...(get().dailyLogs[date] ?? {}), ...log },
          },
        }),
      addBodyLog: (l) =>
        set({
          bodyLogs: [
            { ...l, id: `body-${Date.now()}`, createdAt: new Date().toISOString() },
            ...get().bodyLogs,
          ].slice(0, 200),
        }),
      removeBodyLog: (id) =>
        set({ bodyLogs: get().bodyLogs.filter((b) => b.id !== id) }),
      addQuizResult: (r) =>
        set({
          quizResults: [
            { ...r, id: `q-${Date.now()}`, takenAt: new Date().toISOString() },
            ...get().quizResults,
          ].slice(0, 50),
        }),
    }),
    { name: "lunara-store-v1" },
  ),
);

export function totalCycleDays(phases: Phase[]) {
  return phases.reduce((s, p) => s + p.days, 0);
}
