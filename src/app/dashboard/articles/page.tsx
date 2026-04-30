"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readErrorMessage } from "@/lib/read-error-message";

type Article = {
  _id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  status?: "draft" | "publish";
};

type CurrentUser = {
  role?: string;
};

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "publish">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    type: "edit" | "delete";
    id: string;
  } | null>(null);

  const limit = 5;
  const isActionPending = pendingAction !== null;

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      if (!res.ok) {
        throw new Error(
          await readErrorMessage(res, "Could not load articles."),
        );
      }
      const data = await res.json();
      setArticles(data);
      setError("");
    } catch (error) {
      setArticles([]);
      setError(
        error instanceof Error ? error.message : "Could not load articles.",
      );
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchUser();
  }, []);

  const handleDelete = async (id: string) => {
    if (isActionPending) {
      return;
    }
    setPendingAction({ type: "delete", id });
    const minimumWait = wait(3000);
    try {
      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      await minimumWait;

      if (!response.ok) {
        setError(await readErrorMessage(response, "Failed to delete article."));
        return;
      }

      setError("");
      await fetchArticles();
    } finally {
      setPendingAction(null);
    }
  };

  const handleEdit = async (id: string) => {
    if (isActionPending) {
      return;
    }
    setPendingAction({ type: "edit", id });
    await wait(3000);
    router.push(`/dashboard/articles/edit/${id}`);
  };

  const filtered = articles.filter((article: Article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / limit);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [filtered.length, page, totalPages]);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  function trim(html: string, maxLength: number) {
  const text = html.replace(/<[^>]+>/g, ""); // remove HTML tags

  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(" ")) + " ...";
}

  return (
    <div className="space-y-6 text-zinc-950">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Articles</h1>
          <p className="mt-5 text-md text-zinc-600">
            Search, edit, and manage published or draft articles.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
              statusFilter === "all"
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("draft");
              setPage(1);
            }}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
              statusFilter === "draft"
                ? "border-amber-600 bg-amber-500 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("publish");
              setPage(1);
            }}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
              statusFilter === "publish"
                ? "border-emerald-700 bg-emerald-600 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            Published
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4">
        {paginated.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600 shadow-sm">
            No articles found.
          </div>
        ) : (
          paginated.map((article: Article) => (
        <div
  key={article._id}
  onClick={() => router.push(`/dashboard/articles/edit/${article._id}`)}
  className="cursor-pointer rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-sm"
>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-xl font-semibold text-zinc-950">{article.title}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    article.status === "publish"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {article.status === "publish" ? "Published" : "Draft"}
                </span>
              </div>


            <div
  className="prose prose-zinc mt-3 max-w-none word-wrap text-zinc-800"
  onClick={(e) => {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    const anchor = target.closest("a");

    if (anchor instanceof HTMLAnchorElement) {
      e.stopPropagation();
    }
  }}
  dangerouslySetInnerHTML={{
    __html: trim(article.content, 180),
  }}
/>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  disabled={isActionPending}
                 onClick={(e) => {
  e.stopPropagation();
  handleEdit(article._id);
}}
                  className="cursor-pointer rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pendingAction?.type === "edit" && pendingAction.id === article._id
                    ? "Opening..."
                    : article.status === "draft"
                    ? "Continue"
                    : "Edit"}
                </button>

                {user?.role === "admin" && (
                  <button
                    type="button"
                    disabled={isActionPending}
                  onClick={(e) => {
  e.stopPropagation();
  handleDelete(article._id);
}}
                    className="cursor-pointer rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingAction?.type === "delete" &&
                    pendingAction.id === article._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 text-zinc-950 shadow-sm">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-zinc-600">
          Page {page} of {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages || 1))}
          className="cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
