import { connectDB } from "@/lib/db";
import { enforceRateLimit, requireSession } from "@/lib/api-security";
import {
  ARTICLE_CLOUDINARY_FOLDER,
  cloudinary,
  extractManagedCloudinaryPublicId,
  extractManagedCloudinaryPublicIdsFromHtml,
  isCloudinaryPublicIdInFolder,
} from "@/lib/cloudinary";
import { sanitizeHtmlContent } from "@/lib/sanitize-html";
import Article from "@/models/Article";
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function createUniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "article";
  const regex = new RegExp(`^${escapeRegex(base)}(?:-\\d+)?$`, "i");
  const query = excludeId
    ? { slug: regex, _id: { $ne: excludeId } }
    : { slug: regex };
  const existing = await Article.find(query).select("slug").lean();
  const existingSlugs = new Set(
    existing
      .map((item: { slug?: string }) => item.slug)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => slug.toLowerCase()),
  );

  if (!existingSlugs.has(base.toLowerCase())) {
    return base;
  }

  let counter = 1;
  while (existingSlugs.has(`${base}-${counter}`.toLowerCase())) {
    counter += 1;
  }

  return `${base}-${counter}`;
}

// GET article(s)
// GET all articles
export async function GET(req: Request) {
  try {
    const auth = await requireSession("authenticated");

    if (auth.response) {
      return auth.response;
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    if (id) {
      const article = await Article.findById(id);
      if (!article) {
        return Response.json({ error: "Article not found" }, { status: 404 });
      }
      return Response.json(article);
    }

 const query =
  status === "draft" || status === "publish" ? { status } : {};

    const articles = await Article.find(query).sort({ createdAt: -1 });

    return Response.json(articles);
  } catch {
    return Response.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}



// CREATE article
export async function POST(req: Request) {
  try {
    const auth = await requireSession("authenticated");

    if (auth.response) {
      return auth.response;
    }

    const rateLimitResponse = enforceRateLimit(req, {
      max: 20,
      route: "articles:create",
      windowMs: 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectDB();

    const {
      title,
      content,
      coverImage,
      coverImagePublicId,
      tags,
      status,
      seo,
    } = await req.json();

    const safeTitle = String(title || "").trim();
    const safeContent = sanitizeHtmlContent(String(content || ""));
    const safeCoverImage =
      typeof coverImage === "string" ? coverImage.trim() : "";
    const safeCoverImagePublicId =
      typeof coverImagePublicId === "string" &&
      isCloudinaryPublicIdInFolder(
        coverImagePublicId,
        ARTICLE_CLOUDINARY_FOLDER,
      )
        ? coverImagePublicId
        : safeCoverImage
          ? extractManagedCloudinaryPublicId(
              safeCoverImage,
              ARTICLE_CLOUDINARY_FOLDER,
            )
          : null;

    // ✅ FIX: validate both
    if (!safeTitle || !safeContent) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(safeTitle);

    const article = await Article.create({
      title: safeTitle,
      slug,
      content: safeContent,
      coverImage: safeCoverImage || undefined,
      coverImagePublicId: safeCoverImagePublicId,
      tags,
      status: status === "publish" ? "publish" : "draft",

      // ✅ FIX: trim SEO
      seo: {
        title: seo?.title?.trim() || safeTitle,
        description:
          seo?.description?.trim() ||
          safeContent.replace(/<[^>]+>/g, "").slice(0, 150),
        keywords: seo?.keywords || [],
      },
    });

    return Response.json({ message: "Article created", article });
  } catch {
    return Response.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
// DELETE article
export async function DELETE(req: Request) {
  try {
    const auth = await requireSession("authenticated");

    if (auth.response) {
      return auth.response;
    }

    const rateLimitResponse = enforceRateLimit(req, {
      max: 20,
      route: "articles:delete",
      windowMs: 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectDB();

    const { id } = await req.json();
    const article = await Article.findById(id);

    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    const publicIds = new Set<string>();
    const coverImagePublicId =
      article.coverImagePublicId ||
      (article.coverImage
        ? extractManagedCloudinaryPublicId(
            article.coverImage,
            ARTICLE_CLOUDINARY_FOLDER,
          )
        : null);

    if (coverImagePublicId) {
      publicIds.add(coverImagePublicId);
    }

    for (const publicId of extractManagedCloudinaryPublicIdsFromHtml(
      article.content || "",
      ARTICLE_CLOUDINARY_FOLDER,
    )) {
      publicIds.add(publicId);
    }

    for (const publicId of publicIds) {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        return Response.json(
          { error: "Failed to delete article image" },
          { status: 500 }
        );
      }
    }

    await article.deleteOne();

    return Response.json({ message: "Article deleted" });
  } catch {
    return Response.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

// UPDATE article
export async function PUT(req: Request) {
  try {
    const auth = await requireSession("authenticated");

    if (auth.response) {
      return auth.response;
    }

    const rateLimitResponse = enforceRateLimit(req, {
      max: 30,
      route: "articles:update",
      windowMs: 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectDB();

    const { id, title, content, status, seo } = await req.json();

    const safeTitle = String(title || "").trim();
    const safeContent = sanitizeHtmlContent(String(content || ""));

    // ✅ FIX: validate both
    if (!safeTitle || !safeContent) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(safeTitle, String(id));

    const updated = await Article.findByIdAndUpdate(
      id,
      {
        title: safeTitle,
        slug,
        content: safeContent,
        status: status === "publish" ? "publish" : "draft",

        // ✅ FIX: trim SEO
        seo: {
          title: seo?.title?.trim() || safeTitle,
          description:
            seo?.description?.trim() ||
            safeContent.replace(/<[^>]+>/g, "").slice(0, 150),
          keywords: seo?.keywords || [],
        },
      },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Article updated", updated });
  } catch {
    return Response.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}
 
