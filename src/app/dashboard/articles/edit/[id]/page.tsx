"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

type Article = {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  status?: "draft" | "publish";
};

function normalizeUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"draft" | "publish">("draft");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default:
                "max-width: 300px; width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 14px;",
            },
          };
        },
      }),
    ],
    content: "<p>Loading...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-zinc min-h-[200px] max-w-none focus:outline-none",
      },
      handleClick: (_view, _pos, event) => {
        const target = event.target;

        if (!(target instanceof HTMLElement)) return false;

        const anchor = target.closest("a");

        if (!(anchor instanceof HTMLAnchorElement) || !anchor.href) return false;

        window.open(anchor.href, "_blank", "noopener,noreferrer");
        return true;
      },
    },
  });

  // 🟢 Fetch existing article
  useEffect(() => {
    if (!editor) return;

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles?id=${params.id}`);

        if (!res.ok) throw new Error();

        const data: Article = await res.json();

        setTitle(data.title || "");
        setCoverImage(data.coverImage || null);
        setStatus(data.status === "publish" ? "publish" : "draft");

        editor.commands.setContent(data.content || "<p></p>");
      } catch {
        setError("Failed to load article.");
      }
    };

    fetchArticle();
  }, [editor, params.id]);

  // 🟢 Update
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editor) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          title,
          content: editor.getHTML(),
          status,
        }),
      });

      if (!res.ok) throw new Error();

      router.push("/dashboard/articles");
    } catch {
      setError("Failed to update article.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getToolButtonClass = (active: boolean, selected: boolean) =>
    `cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "border-black bg-black text-white"
        : selected
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 lg:flex-row">
      <div className="flex-1">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Edit Article</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Update your article and publish when ready.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPreview((prev) => !prev)}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              preview
                ? "border-black bg-black text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {preview ? "Back to Editor" : "Preview"}
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
            placeholder="Article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {!preview && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Tools
              </div>
              <div className="flex flex-wrap items-center gap-2">

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={getToolButtonClass(Boolean(editor?.isActive("bold")), false)}
                >
                  Bold
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={getToolButtonClass(Boolean(editor?.isActive("italic")), false)}
                >
                  Italic
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter URL");
                    const href = url ? normalizeUrl(url) : "";
                    if (href) editor?.chain().focus().setLink({ href }).run();
                  }}
                  className={getToolButtonClass(Boolean(editor?.isActive("link")), false)}
                >
                  Link
                </button>

                <span className="mx-1 h-6 w-px bg-zinc-300" />

                <button
                  type="button"
                  onClick={async () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";

                    input.onchange = async () => {
                      const file = input.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("file", file);

                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await res.json();

                      if (data.url) {
                        editor?.chain().focus().setImage({ src: data.url }).run();
                      }
                    };

                    input.click();
                  }}
                  className={getToolButtonClass(false, false)}
                >
                  Image
                </button>

                <span className="mx-1 h-6 w-px bg-zinc-300" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className={getToolButtonClass(Boolean(editor?.isActive({ textAlign: "left" })), false)}
                >
                  Left
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  className={getToolButtonClass(Boolean(editor?.isActive({ textAlign: "center" })), false)}
                >
                  Center
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  className={getToolButtonClass(Boolean(editor?.isActive({ textAlign: "right" })), false)}
                >
                  Right
                </button>

              </div>
            </div>
          )}

          {preview ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
             <h1 className="mb-3 text-xl font-bold">{title || "Untitled Article"}</h1>

<div className="flex justify-center">
  <img
    src={coverImage || "/placeholder.png"}
    alt="Article cover"
    className="mb-4 w-[70%] max-h-80 rounded-lg object-cover"
  />
</div>

<div
  className="prose prose-zinc max-w-none prose-img:mx-auto prose-img:rounded-xl"
  dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
/>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-3">
              <EditorContent editor={editor} />
            </div>
          )}

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>

      <aside className="h-fit w-full rounded-xl mt-18 border border-zinc-200 bg-white p-4 shadow-sm lg:w-72">
        <h2 className="mb-1 text-base font-semibold">Publishing Options</h2>

        <div className="space-y-3 mt-3">
          <button
            type="button"
            onClick={() => setStatus("draft")}
            className={`cursor-pointer w-full rounded-lg border p-3 text-left transition ${
              status === "draft"
                ? "border-zinc-800 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            <p className="text-sm font-semibold">Save as Draft</p>
          </button>

          <button
            type="button"
            onClick={() => setStatus("publish")}
            className={`cursor-pointer w-full rounded-lg border p-3 text-left transition ${
              status === "publish"
                ? "border-zinc-800 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            <p className="text-sm font-semibold">Publish Now</p>
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Updating..."
            : status === "publish"
            ? "Update & Publish"
            : "Update Draft"}
        </button>
      </aside>
    </form>
  );
}
