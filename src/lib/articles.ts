import { connectDB } from "@/lib/db";
import Article from "@/models/Article";

type RawArticle = {
  _id: { toString(): string } | string;
  title?: string;
  slug?: string;
  content?: string;
  coverImage?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type PublicArticle = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

function toIsoString(value?: Date | string) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toISOString();
}

function normalizeArticle(article: RawArticle): PublicArticle {
  return {
    _id: String(article._id),
    title: article.title ?? "",
    slug: article.slug ?? "",
    content: article.content ?? "",
    coverImage: article.coverImage,
    createdAt: toIsoString(article.createdAt),
    updatedAt: toIsoString(article.updatedAt),
    seo: article.seo,
  };
}

export function getArticleDescription(article: Pick<PublicArticle, "content" | "seo">) {
  const seoDescription = article.seo?.description?.trim();

  if (seoDescription) {
    return seoDescription;
  }

  return article.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 150);
}

export async function listPublishedArticles() {
  await connectDB();

  const articles = await Article.find({ status: "publish" })
    .sort({ createdAt: -1 })
    .lean<RawArticle[]>();

  return articles.map(normalizeArticle);
}

export async function getPublishedArticleBySlug(slug: string) {
  await connectDB();

  const article = await Article.findOne({ slug, status: "publish" }).lean<RawArticle | null>();

  return article ? normalizeArticle(article) : null;
}
