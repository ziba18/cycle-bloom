import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { articles } from "@/data/articles";
import { ArrowLeft, Clock } from "lucide-react";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.article.title} — Lunara` },
      { name: "description", content: loaderData.article.excerpt },
      { property: "og:title", content: loaderData.article.title },
      { property: "og:description", content: loaderData.article.excerpt },
    ] : [{ title: "Article — Lunara" }],
  }),
  component: ArticlePage,
  notFoundComponent: () => (
    <div className="px-5 pt-10 max-w-2xl mx-auto text-center">
      <h1 className="font-display text-3xl">Article not found</h1>
      <Link to="/learn" className="text-primary text-sm mt-3 inline-block">Back to Learn</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-5 pt-10 max-w-2xl mx-auto text-center">
      <p className="text-sm text-destructive">{error.message}</p>
    </div>
  ),
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);

  return (
    <article className="px-5 md:px-10 pt-6 md:pt-10 max-w-3xl mx-auto">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Learn
      </Link>

      <div className={`rounded-[2rem] h-56 mt-6 bg-gradient-to-br ${article.cover} shadow-soft`} />

      <header className="mt-8">
        <span className="smallcaps text-foreground/55">{article.category}</span>
        <h1 className="font-display text-4xl md:text-5xl leading-tight mt-2">{article.title}</h1>
        <p className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <Clock className="h-3 w-3" /> {article.readTime} min read
        </p>
      </header>

      <div className="mt-8 space-y-5 font-display text-lg leading-relaxed text-foreground/85">
        {article.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {related.length > 0 && (
        <section className="mt-14 border-t border-border/50 pt-8">
          <h3 className="font-display text-2xl mb-4">More in {article.category}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((a) => (
              <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }}
                className="glass rounded-2xl p-4 hover:-translate-y-1 transition-transform">
                <div className={`h-16 rounded-xl bg-gradient-to-br ${a.cover} mb-3`} />
                <h4 className="font-display text-base leading-snug">{a.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
