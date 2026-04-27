import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { articles, usefulLinks } from "@/data/articles";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ExternalLink, Clock } from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Atossa" },
      { name: "description", content: "Articles, guides, and resources for menstrual and reproductive health." },
    ],
  }),
  component: LearnPage,
});

const CATEGORIES = ["All", "Cycle Basics", "Hormones", "Nutrition", "Mental Health", "Conditions"] as const;

function LearnPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });
  const featured = articles.slice(0, 4);
  const filtered = cat === "All" ? articles : articles.filter((a) => a.category === cat);

  return (
    <div className="px-5 md:px-10 pt-6 md:pt-10 max-w-6xl mx-auto space-y-10">
      <header>
        <p className="smallcaps text-foreground/55">Learn</p>
        <h1 className="font-display text-4xl md:text-5xl">Knowledge that fits your body</h1>
      </header>

      {/* Featured carousel */}
      <section>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {featured.map((a) => (
              <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }} className="shrink-0 basis-[88%] md:basis-[58%]">
                <div className={`rounded-[2rem] p-8 h-64 bg-gradient-to-br ${a.cover} relative overflow-hidden shadow-soft`}>
                  <div className="absolute inset-0 bg-cream/10" />
                  <div className="relative h-full flex flex-col justify-between">
                    <span className="smallcaps text-foreground/70 self-start bg-card/60 px-2.5 py-1 rounded-full">{a.category}</span>
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl text-foreground leading-tight">{a.title}</h3>
                      <p className="text-foreground/80 text-sm mt-2 max-w-md">{a.excerpt}</p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-foreground/70">
                        <Clock className="h-3 w-3" /> {a.readTime} min read
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-xs border transition-colors ${
              cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card/70 border-border hover:border-primary/50"
            }`}>{c}</button>
        ))}
      </section>

      {/* Article grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((a) => (
          <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }}
            className="group glass rounded-3xl overflow-hidden shadow-soft hover:-translate-y-1 transition-transform">
            <div className={`h-32 bg-gradient-to-br ${a.cover}`} />
            <div className="p-5">
              <span className="smallcaps text-foreground/55">{a.category}</span>
              <h3 className="font-display text-xl mt-1 leading-snug">{a.title}</h3>
              <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{a.excerpt}</p>
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readTime} min</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Quizzes promo */}
      <section className="grid md:grid-cols-2 gap-5">
        {[
          { to: "/quiz/pcos", label: "PCOS self-assessment", body: "12 questions. Get a clarity score and guidance.", grad: "from-apricot to-rose" },
          { to: "/quiz/endo", label: "Endometriosis self-assessment", body: "Reflect on your pain patterns and history.", grad: "from-rose to-lavender" },
        ].map((q) => (
          <Link key={q.to} to={q.to as any}
            className={`rounded-3xl p-7 bg-gradient-to-br ${q.grad} shadow-soft hover:scale-[1.01] transition-transform`}>
            <span className="smallcaps text-foreground/70">Self-assessment</span>
            <h3 className="font-display text-2xl mt-1">{q.label}</h3>
            <p className="text-sm text-foreground/80 mt-1">{q.body}</p>
            <div className="inline-flex items-center gap-1 mt-4 text-sm font-medium">Begin <ArrowRight className="h-4 w-4" /></div>
          </Link>
        ))}
      </section>

      {/* Useful links */}
      <section>
        <h2 className="font-display text-2xl mb-4">Useful links</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {usefulLinks.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
              className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-card/80 transition-colors">
              <span className="text-sm font-medium">{l.name}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
