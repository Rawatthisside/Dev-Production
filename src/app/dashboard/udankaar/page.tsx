"use client";

import { useEffect, useState } from "react";

type UdankaarEntry = {
  _id: string;
  title?: string;
  slug?: string;
  photo: string;
  youtubeLink: string;
  createdAt: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

type CurrentUser = {
  role?: string;
};

export default function UdankaarPage() {
  const [entries, setEntries] = useState<UdankaarEntry[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchEntries() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/udankaar");

      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }

      const data = await response.json();
      setEntries(data);
      setError("");
    } catch {
      setEntries([]);
      setError("Could not load Udankaar entries.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchEntries();
    fetchUser();
  }, []);

  async function handleDelete(id: string) {
    if (pendingDeleteId) {
      return;
    }

    setPendingDeleteId(id);
    const minimumWait = wait(3000);

    try {
      const response = await fetch("/api/udankaar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      await minimumWait;

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      fetchEntries();
    } catch {
      setError("Something went wrong while deleting this Udankaar entry.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="space-y-6 text-zinc-950">
      <div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-950">Udankaar</h1>
          <p className="mt-5 text-md text-zinc-600">
            Manage thumbnails, titles, SEO details, and YouTube links.
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          Loading ....
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          Nothing here yet
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => {
            const displayTitle = entry.title || entry.seo?.title || "Untitled Udankaar entry";

            return (
              <article
                key={entry._id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div
                  className="h-52 rounded-xl bg-zinc-100 bg-cover bg-center"
                  style={{ backgroundImage: `url(${entry.photo})` }}
                />

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Added {new Date(entry.createdAt).toLocaleDateString()}
                </p>

                <h2 className="mt-2 text-lg font-semibold text-zinc-950">
                  {displayTitle}
                </h2>

                {entry.slug ? (
                  <p className="mt-1 text-xs text-zinc-500">
                    /{entry.slug}
                  </p>
                ) : null}

                {entry.seo?.description ? (
                  <p className="mt-3 text-sm text-zinc-600">
                    {entry.seo.description}
                  </p>
                ) : null}

                <a
                  href={entry.youtubeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-sm font-medium text-blue-600 underline underline-offset-4"
                >
                  Open YouTube Link
                </a>

                {user?.role === "admin" ? (
                  <div className="mt-4 flex gap-3">
                    <a
                      href={`/dashboard/udankaar/edit/${entry._id}`}
                      className="rounded bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
                    >
                      Edit
                    </a>

                    <button
                      type="button"
                      disabled={pendingDeleteId !== null}
                      onClick={() => handleDelete(entry._id)}
                      className="cursor-pointer rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingDeleteId === entry._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
