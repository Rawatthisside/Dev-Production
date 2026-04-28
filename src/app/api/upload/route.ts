import { type UploadApiResponse } from "cloudinary";
import { enforceRateLimit, requireSession } from "@/lib/api-security";
import { ARTICLE_CLOUDINARY_FOLDER, cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const auth = await requireSession("authenticated");

    if (auth.response) {
      return auth.response;
    }

    const rateLimitResponse = enforceRateLimit(req, {
      max: 30,
      route: "upload:image",
      windowMs: 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "File is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "Only image uploads are allowed" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Image size must be 5 MB or smaller" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: ARTICLE_CLOUDINARY_FOLDER,
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload failed"));
              return;
            }

            resolve(result);
          }
        )
        .end(buffer);
    });

    return Response.json({
      url: upload.secure_url,
      publicId: upload.public_id,
    });
  } catch {
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
