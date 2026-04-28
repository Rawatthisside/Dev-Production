"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function isYoutubeLink(value: string) {
  try {
    const { hostname } = new URL(value);
    return [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "www.youtu.be",
    ].includes(hostname);
  } catch {
    return false;
  }
}

type UdankaarSeo = {
  title?: string;
  description?: string;
};

export default function EditUdankaarPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPublicId, setPhotoPublicId] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchEntry() {
      try {
        const res = await fetch(`/api/udankaar?id=${id}`);

        if (!res.ok) throw new Error();

        const data = await res.json();
        const seo: UdankaarSeo = data.seo || {};

        setTitle(data.title || "");
        setPhoto(data.photo || "");
        setPhotoPublicId(data.photoPublicId || "");
        setYoutubeLink(data.youtubeLink || "");
        setSeoTitle(seo.title || "");
        setSeoDescription(seo.description || "");
      } catch {
        setError("Failed to load entry.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntry();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) return;

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!youtubeLink.trim()) {
      setError("Please enter a YouTube link.");
      return;
    }

    if (!isYoutubeLink(youtubeLink.trim())) {
      setError("Please enter a valid YouTube link.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = photo;
      let nextPhotoPublicId = photoPublicId;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error();

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url ?? "";
        nextPhotoPublicId = uploadData.publicId ?? "";
      }

      const res = await fetch("/api/udankaar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: title.trim(),
          photo: imageUrl,
          photoPublicId: nextPhotoPublicId,
          youtubeLink: youtubeLink.trim(),
          seo: {
            title: seoTitle.trim(),
            description: seoDescription.trim(),
          },
        }),
      });

      if (!res.ok) throw new Error();

      router.push("/dashboard/udankaar");
    } catch {
      setError("Something went wrong while updating.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-xl p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Edit Udankaar
        </h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {photo ? (
              <div
                className="h-52 rounded bg-zinc-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${photo})` }}
              />
            ) : null}

            <input
              type="text"
              placeholder="Entry title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded border p-2"
            />

            <input
              type="text"
              placeholder="SEO Title (optional)"
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
              className="rounded border p-2"
            />

            <textarea
              placeholder="SEO Description (optional)"
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              className="min-h-28 rounded border p-2"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="rounded border p-2"
            />

            <input
              type="text"
              placeholder="YouTube Link"
              value={youtubeLink}
              onChange={(event) => setYoutubeLink(event.target.value)}
              className="rounded border p-2"
            />

            <p className="text-xs text-zinc-500">
              Blank SEO fields will fall back to the entry title automatically.
            </p>

            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-black p-2 text-white disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
