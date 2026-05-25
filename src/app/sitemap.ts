import { listPublishedArticles } from "@/lib/articles";

export default async function sitemap() {
  const articles = await listPublishedArticles();

  return articles.map((article) => ({
    url: `https://yourdomain.com/articles/${article.slug}`,
    lastModified: article.updatedAt || article.createdAt,
  }));
}
