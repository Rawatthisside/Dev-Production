"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewUdankaarPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!file) {
      setError("Please choose a photo.");
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

    setError("");
    setIsSubmitting(true);
    const minimumWait = wait(3000);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadResponse.json();

      const response = await fetch("/api/udankaar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          photo: uploadData.url ?? "",
          photoPublicId: uploadData.publicId ?? "",
          youtubeLink: youtubeLink.trim(),
          seo: {
            title: seoTitle.trim(),
            description: seoDescription.trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Udankaar entry");
      }

      await minimumWait;
      router.push("/dashboard/udankaar");
      router.refresh();
    } catch {
      await minimumWait;
      setError("Something went wrong while saving this Udankaar entry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-2xl p-6 text-zinc-950">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-950">Udankaar</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Upload one photo, attach the YouTube link, and add SEO details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Entry title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded border border-zinc-300 bg-white p-2 text-zinc-950 placeholder:text-zinc-500"
          />

          <input
            type="text"
            placeholder="SEO Title (optional)"
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            className="rounded border border-zinc-300 bg-white p-2 text-zinc-950 placeholder:text-zinc-500"
          />

          <textarea
            placeholder="SEO Description (optional)"
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            className="min-h-28 rounded border border-zinc-300 bg-white p-2 text-zinc-950 placeholder:text-zinc-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="rounded border border-zinc-300 bg-white p-2 text-zinc-950 file:text-zinc-950"
          />

          <input
            type="url"
            placeholder="Paste the YouTube link"
            value={youtubeLink}
            onChange={(event) => setYoutubeLink(event.target.value)}
            className="rounded border border-zinc-300 bg-white p-2 text-zinc-950 placeholder:text-zinc-500"
          />

          <p className="text-xs text-zinc-500">
            If SEO title or description is left blank, the system will auto-fill it from the title.
          </p>

          {error ? (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded bg-black p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
