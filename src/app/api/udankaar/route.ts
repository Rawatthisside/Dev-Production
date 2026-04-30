import { createApiErrorResponse } from "@/lib/api-error-response";
import { enforceRateLimit, requireSession } from "@/lib/api-security";
import { cloudinary, extractCloudinaryPublicId } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import Udankaar from "@/models/Udankaar";

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
  const base = slugify(title) || "udankaar";
  const regex = new RegExp(`^${escapeRegex(base)}(?:-\\d+)?$`, "i");
  const query = excludeId
    ? { slug: regex, _id: { $ne: excludeId } }
    : { slug: regex };
  const existing = await Udankaar.find(query).select("slug").lean();
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

function getDefaultSeoDescription(title: string) {
  return `Watch ${title} on Udankaar.`;
}

export async function GET(req: Request) {
  try {
    const auth = await requireSession("authenticated");

    if (auth.response) {
      return auth.response;
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const entry = await Udankaar.findById(id);

      if (!entry) {
        return Response.json(
          { error: "Udankaar entry not found" },
          { status: 404 }
        );
      }

      return Response.json(entry);
    }

    const entries = await Udankaar.find().sort({ createdAt: -1 });

    return Response.json(entries);
  } catch (error) {
    return createApiErrorResponse(error, {
      context: "udankaar:get",
      fallbackMessage: "Failed to fetch Udankaar entries",
      invalidRequestMessage: "Invalid Udankaar request",
    });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireSession("admin");

    if (auth.response) {
      return auth.response;
    }

    const rateLimitResponse = enforceRateLimit(req, {
      max: 15,
      route: "udankaar:create",
      windowMs: 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectDB();

    const { title, photo, photoPublicId, youtubeLink, seo } = await req.json();

    const safeTitle = String(title || "").trim();
    const safePhoto = typeof photo === "string" ? photo.trim() : "";
    const safePhotoPublicId =
      typeof photoPublicId === "string" ? photoPublicId.trim() : "";
    const safeYoutubeLink =
      typeof youtubeLink === "string" ? youtubeLink.trim() : "";

    if (!safeTitle || !safePhoto || !safeYoutubeLink) {
      return Response.json(
        { error: "Title, photo, and YouTube link are required" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(safeTitle);

    const entry = await Udankaar.create({
      title: safeTitle,
      slug,
      photo: safePhoto,
      photoPublicId: safePhotoPublicId || undefined,
      youtubeLink: safeYoutubeLink,
      seo: {
        title: seo?.title?.trim() || safeTitle,
        description:
          seo?.description?.trim() || getDefaultSeoDescription(safeTitle),
        keywords: Array.isArray(seo?.keywords) ? seo.keywords : [],
      },
    });

    return Response.json({ message: "Udankaar entry created", entry });
  } catch (error) {
    return createApiErrorResponse(error, {
      context: "udankaar:create",
      fallbackMessage: "Failed to create Udankaar entry",
      invalidRequestMessage: "Invalid Udankaar payload",
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireSession("admin");

    if (auth.response) {
      return auth.response;
    }

    const rateLimitResponse = enforceRateLimit(req, {
      max: 15,
      route: "udankaar:delete",
      windowMs: 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectDB();

    const { id } = await req.json();
    const normalizedId = typeof id === "string" ? id.trim() : "";

    if (!normalizedId) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const entry = await Udankaar.findById(normalizedId);

    if (!entry) {
      return Response.json({ error: "Udankaar entry not found" }, { status: 404 });
    }

    const photoPublicId =
      entry.photoPublicId ||
      (entry.photo ? extractCloudinaryPublicId(entry.photo) : null);

    if (photoPublicId) {
      const result = await cloudinary.uploader.destroy(photoPublicId);

      if (result.result !== "ok" && result.result !== "not found") {
        return Response.json(
          { error: "Failed to delete Udankaar image" },
          { status: 500 }
        );
      }
    }

    await entry.deleteOne();

    return Response.json({ message: "Udankaar entry deleted" });
  } catch (error) {
    return createApiErrorResponse(error, {
      context: "udankaar:delete",
      fallbackMessage: "Failed to delete Udankaar entry",
      invalidRequestMessage: "Invalid Udankaar delete request",
    });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireSession("admin");

    if (auth.response) {
      return auth.response;
    }

    const rateLimitResponse = enforceRateLimit(req, {
      max: 20,
      route: "udankaar:update",
      windowMs: 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectDB();

    const { id, title, photo, photoPublicId, youtubeLink, seo } = await req.json();

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const entry = await Udankaar.findById(id);

    if (!entry) {
      return Response.json(
        { error: "Udankaar entry not found" },
        { status: 404 }
      );
    }

    const safeTitle = String(title || "").trim();
    const safePhoto = typeof photo === "string" ? photo.trim() : "";
    const safePhotoPublicId =
      typeof photoPublicId === "string" ? photoPublicId.trim() : "";
    const safeYoutubeLink =
      typeof youtubeLink === "string" ? youtubeLink.trim() : "";
    const oldPublicId =
      safePhoto && safePhoto !== entry.photo
        ? entry.photoPublicId ||
          (entry.photo ? extractCloudinaryPublicId(entry.photo) : null)
        : null;

    if (!safeTitle || !safeYoutubeLink) {
      return Response.json(
        { error: "Title and YouTube link are required" },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(safeTitle, String(id));

    const updated = await Udankaar.findByIdAndUpdate(
      id,
      {
        title: safeTitle,
        slug,
        photo: safePhoto || entry.photo,
        photoPublicId: safePhoto
          ? safePhotoPublicId || extractCloudinaryPublicId(safePhoto)
          : entry.photoPublicId,
        youtubeLink: safeYoutubeLink,
        seo: {
          title: seo?.title?.trim() || safeTitle,
          description:
            seo?.description?.trim() || getDefaultSeoDescription(safeTitle),
          keywords: Array.isArray(seo?.keywords) ? seo.keywords : [],
        },
      },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { error: "Udankaar entry not found" },
        { status: 404 }
      );
    }

    let warning: string | undefined;

    if (oldPublicId) {
      try {
        const result = await cloudinary.uploader.destroy(oldPublicId);

        if (result.result !== "ok" && result.result !== "not found") {
          warning = "Previous Udankaar image could not be deleted.";
          console.error("[udankaar:update:cleanup]", {
            oldPublicId,
            result,
          });
        }
      } catch (cleanupError) {
        warning = "Previous Udankaar image could not be deleted.";
        console.error("[udankaar:update:cleanup]", cleanupError);
      }
    }

    return Response.json({
      message: "Udankaar entry updated",
      updated,
      ...(warning ? { warning } : {}),
    });
  } catch (error) {
    return createApiErrorResponse(error, {
      context: "udankaar:update",
      fallbackMessage: "Failed to update Udankaar entry",
      invalidRequestMessage: "Invalid Udankaar payload",
    });
  }
}
