import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleDescription, getPublishedArticleBySlug } from "@/lib/articles";

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "This article does not exist.",
    };
  }

  const description = getArticleDescription(article);

  return {
    title: article.seo?.title || article.title,
    description,
    openGraph: {
      title: article.seo?.title || article.title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo?.title || article.title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 text-slate-700">
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

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <Link
          href="/articles"
          className="inline-flex items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm transition hover:bg-sky-50"
        >
          ← Back to articles
        </Link>

        <section className="mt-5 overflow-hidden rounded-3xl border border-sky-100 bg-white/95 shadow-sm">
          {article.coverImage ? (
            <div className="overflow-hidden bg-sky-50">
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-[240px] w-full object-cover transition duration-500 hover:scale-[1.02] md:h-[360px]"
              />
            </div>
          ) : (
            <div className="flex h-[190px] items-end bg-gradient-to-br from-sky-100 via-blue-50 to-white px-6 py-6 md:h-[240px] md:px-8">
              <p className="rounded-full border border-sky-200 bg-white/90 px-3 py-1 text-sm text-sky-700">
                Devasthali Article
              </p>
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-slate-800 md:text-5xl">
              {article.title}
            </h1>

            <p className="mt-4 max-w-3xl text-slate-600">{getArticleDescription(article)}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 font-medium text-sky-700">
                By Devasthali
              </span>
              <span className="text-slate-300">•</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-sky-100 bg-white/95 px-6 py-8 shadow-sm md:px-10">
          <article
            className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:leading-7 prose-img:rounded-2xl prose-a:text-sky-700 hover:prose-a:text-sky-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </section>
      </main>
    </div>
  );
}
