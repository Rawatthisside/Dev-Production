import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const ARTICLE_CLOUDINARY_FOLDER = "admin-panel/articles";

export function extractCloudinaryPublicId(url: string) {
  try {
    const { pathname } = new URL(url);
    const uploadMarker = "/upload/";
    const uploadIndex = pathname.indexOf(uploadMarker);

    if (uploadIndex === -1) {
      return null;
    }

    const assetPath = pathname
      .slice(uploadIndex + uploadMarker.length)
      .split("/")
      .filter(Boolean);

    const versionIndex = assetPath.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdParts =
      versionIndex >= 0 ? assetPath.slice(versionIndex + 1) : assetPath;

    if (publicIdParts.length === 0) {
      return null;
    }

    const lastPart = publicIdParts[publicIdParts.length - 1];
    publicIdParts[publicIdParts.length - 1] = lastPart.replace(/\.[^/.]+$/, "");

    return publicIdParts.join("/");
  } catch {
    return null;
  }
}

export function isCloudinaryPublicIdInFolder(publicId: string, folder: string) {
  return publicId === folder || publicId.startsWith(`${folder}/`);
}

export function extractManagedCloudinaryPublicId(url: string, folder: string) {
  const publicId = extractCloudinaryPublicId(url);

  if (!publicId || !isCloudinaryPublicIdInFolder(publicId, folder)) {
    return null;
  }

  return publicId;
}

export function extractManagedCloudinaryPublicIdsFromHtml(
  html: string,
  folder: string,
) {
  const publicIds = new Set<string>();
  const imageSrcRegex = /<img\b[^>]*\bsrc\s*=\s*(['"])(.*?)\1/gi;

  for (const match of html.matchAll(imageSrcRegex)) {
    const src = match[2]?.trim();

    if (!src) {
      continue;
    }

    const publicId = extractManagedCloudinaryPublicId(src, folder);

    if (publicId) {
      publicIds.add(publicId);
    }
  }

  return [...publicIds];
}

export { cloudinary };
