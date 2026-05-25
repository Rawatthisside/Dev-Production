import Link from "next/link";
import { getArticleDescription, listPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await listPublishedArticles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 text-slate-700">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-sky-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-center gap-3 px-4">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="h-10 w-10 rounded-full bg-white p-1 shadow-sm"
          />
          <span className="text-2xl font-bold tracking-wide text-sky-700">DEVASTHALI</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto mt-6 w-full max-w-6xl px-4">
        <div className="flex h-[210px] items-center justify-center rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-100 via-blue-50 to-white text-center shadow-sm md:h-[250px]">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 md:text-5xl">Articles</h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Stories, culture, and insights from Devasthali.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-sky-100 bg-white/90 p-8 text-center text-sm text-slate-500 shadow-sm">
            No published articles yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/articles/${article.slug}`}
                className="group block overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                {article.coverImage && (
                  <div className="overflow-hidden bg-sky-50">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-slate-800 transition group-hover:text-sky-700">
                    {article.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                    {getArticleDescription(article)}
                  </p>

                  <div className="mt-4 text-sm font-semibold text-sky-600 transition group-hover:text-sky-700">
                    Read article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
