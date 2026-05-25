"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import { FontSize } from "@/lib/tiptap-fontsize";
import Image from "@tiptap/extension-image";
import { readErrorMessage } from "@/lib/read-error-message";

const INITIAL_CONTENT = `<h1>Article</h1><p>Start writing...</p>`;

function normalizeUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"draft" | "publish">("draft");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [seoTitle, setSeoTitle] = useState("");
const [seoDescription, setSeoDescription] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Tools
  const [activeTools, setActiveTools] = useState({
    bold: false,
    italic: false,
    link: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  });


  const [activeHeadingLevel, setActiveHeadingLevel] = useState<number | null>(null);


  const [fontSizeValue, setFontSizeValue] = useState<string>("");

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
        default: "max-width: 300px; width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 14px;",
      },
    };
  },
}),
  FontSize,
],
    content: INITIAL_CONTENT,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
     
      updateActiveTools(editor);
    },
    onSelectionUpdate: ({ editor }) => {
   
      updateActiveTools(editor);
    },
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

 
  const updateActiveTools = (editor: Editor | null) => {
    if (!editor) return;

   
    setActiveTools({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      link: editor.isActive("link"),
      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),
    });

   
    const headingLevel = editor.getAttributes("heading").level;
    setActiveHeadingLevel(headingLevel || null);

 
    const fontSize = editor.getAttributes("textStyle").fontSize;
    if (fontSize) {
      const sizeNumber = parseInt(fontSize, 10).toString();
      setFontSizeValue(sizeNumber);
    } else {
      setFontSizeValue("");
    }
  };


  useEffect(() => {
    if (editor) {
      updateActiveTools(editor);
    }
  }, [editor]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editor) return;

    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = "";

    
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error(
            await readErrorMessage(uploadRes, "Image upload failed."),
          );
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
     body: JSON.stringify({
  title,
  content: editor.getHTML(),
  status,
  coverImage: imageUrl,

  seo: {
    title: seoTitle,
    description: seoDescription,
  },
}),
      });

      if (!response.ok) {
        throw new Error(
          await readErrorMessage(response, "Failed to create article."),
        );
      }

      router.push("/dashboard/articles");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create article.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const getToolButtonClass = (isActive: boolean) =>
    `cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? "border-black bg-black text-white"
        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 lg:flex-row">
      <div className="flex-1">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Create Article</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Draft with formatting tools, then publish when ready.
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

        {!preview && (
          <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
<input
  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
  placeholder="SEO Title "
  value={seoTitle}
  onChange={(e) => setSeoTitle(e.target.value)}
/>

<textarea
  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
  placeholder="SEO Description "
  value={seoDescription}
  onChange={(e) => setSeoDescription(e.target.value)}
/>
          
          

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Tools
              </div>

              <div className="flex flex-wrap items-center gap-2">

               
                {([1, 2, 3, 4, 5] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level }).run()
                    }
                    className={getToolButtonClass(activeHeadingLevel === level)}
                  >
                    H{level}
                  </button>
                ))}

               
                <select
                  value={fontSizeValue}
                  onChange={(e) => {
                    const size = e.target.value;
                    setFontSizeValue(size);
                    if (size) {
                      editor?.chain().focus().setFontSize(`${size}px`).run();
                    }
                  }}
                  className={`cursor-pointer rounded-md border px-2 py-1 text-sm text-zinc-700 transition ${
                    fontSizeValue
                      ? "border-black bg-white"
                      : "border-zinc-300 bg-white hover:border-black"
                  }`}
                >
                  <option value="" disabled>
                    Size
                  </option>
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

               
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={getToolButtonClass(activeTools.bold)}
                >
                  Bold
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={getToolButtonClass(activeTools.italic)}
                >
                  Italic
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter URL");
                    const href = url ? normalizeUrl(url) : "";

                    if (href) {
                      editor?.chain().focus().setLink({ href }).run();
                    }
                  }}
                  className={getToolButtonClass(activeTools.link)}
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

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(
            await readErrorMessage(res, "Image upload failed."),
          );
        }

        const data = await res.json();

        if (!data.url) {
          throw new Error("Image upload failed.");
        }

        setError("");
        editor?.chain().focus().setImage({ src: data.url }).run();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Image upload failed.",
        );
      }
    };

    input.click();
  }}
  className={getToolButtonClass(false)}
>
  Image
</button>
 <span className="mx-1 h-6 w-px bg-zinc-300" />
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className={getToolButtonClass(activeTools.alignLeft)}
                >
                  Left
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  className={getToolButtonClass(activeTools.alignCenter)}
                >
                  Center
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  className={getToolButtonClass(activeTools.alignRight)}
                >
                  Right
                </button>

              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-3">
              <EditorContent editor={editor} />
            </div>

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>
        )}

        {preview && (
         
          <div className="w-full overflow-x-hidden">
            <div className="flex min-h-screen w-full flex-col items-center bg-linear-to-b from-zinc-50 to-white py-12 px-4 sm:px-6">
              <article className="w-full max-w-3xl">
                {/* Cover Image */}
                {imagePreview && (
                  <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Article cover"
                      className="h-96 w-48 object-cover"
                    />
                  </div>
                )}

               
                <header className="mb-8 border-b border-zinc-200 pb-8 px-4 sm:px-6">
                  <h1 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl md:text-5xl wrap-break-words">
                    {title || "Untitled Article"}
                  </h1>
                  <p className="mt-4 text-base text-zinc-600">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </header>

                {/* Article Content */}
                <main className="prose prose-zinc max-w-none px-4 sm:px-6 prose-headings:break-words prose-p:break-words prose-a:break-words">
                  <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }} />
                </main>

                {/* Footer Divider */}
                <footer className="mt-12 border-t border-zinc-200 pt-8 px-4 sm:px-6">
                  <p className="text-sm text-zinc-500">
                    End of article • Published on {new Date().toLocaleDateString("en-GB")}
                  </p>
                </footer>
              </article>
            </div>
          </div>
        )}
      </div>

    {/* RIGHT COLUMN */}
<div className="flex w-full flex-col gap-6 lg:w-72">

  {/* RIGHT SIDE - ENHANCED: Better status tracking */}
  <aside className="h-fit w-full rounded-xl mt-18 border border-zinc-200 bg-white p-4 shadow-sm">
    <h2 className="mb-1 text-base font-semibold">Publishing Options</h2>

    <div className="space-y-3 mt-3">
      <button
        type="button"
        onClick={() => setStatus("draft")}
        className={`cursor-pointer w-full rounded-lg border p-3 text-left transition ${
          status === "draft"
            ? "border-black bg-black text-white"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
        }`}
      >
        <div className="font-medium">Save as Draft</div>
        <div
          className={`text-xs mt-1 ${
            status === "draft"
              ? "text-zinc-200"
              : "text-zinc-500"
          }`}
        >
          Keep this article private
        </div>
      </button>

      <button
        type="button"
        onClick={() => setStatus("publish")}
        className={`cursor-pointer w-full rounded-lg border p-3 text-left transition ${
          status === "publish"
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
        }`}
      >
        <div className="font-medium">Publish Now</div>
        <div
          className={`text-xs mt-1 ${
            status === "publish"
              ? "text-blue-100"
              : "text-zinc-500"
          }`}
        >
          Make this article public
        </div>
      </button>
    </div>

    <button
      type="submit"
      className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
      disabled={isSubmitting}
    >
      {isSubmitting
        ? "Submitting..."
        : status === "publish"
        ? "Publish Article"
        : "Save Draft"}
    </button>
  </aside>

  {/* Independent Thumbnail Section */}
  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
    <h2 className="mb-3 text-base font-semibold">
      Thumbnail / Cover Image
    </h2>

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const selected = e.target.files?.[0];

        if (selected) {
          setFile(selected);
          setImagePreview(URL.createObjectURL(selected));
        }
      }}
      className="w-full rounded border border-zinc-300 p-2"
    />

    {imagePreview && (
      <div className="mt-4 overflow-hidden rounded-lg border">
        <img
          src={imagePreview}
          alt="Article cover preview"
          className="h-48 w-full object-cover rounded"
        />
      </div>
    )}
  </div>
</div>
    </form>
  );
}
