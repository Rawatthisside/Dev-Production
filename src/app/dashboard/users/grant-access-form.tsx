"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "admin" | "editor";

export default function GrantAccessForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);
    const minimumWait = wait(1500);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();
      await minimumWait;

      if (!response.ok) {
        setError(data.error ?? "Could not create user.");
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("editor");
      setSuccess("Access granted. This user can now log in from the login page.");
      router.refresh();
    } catch {
      await minimumWait;
      setError("Something went wrong while granting access.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-zinc-950">Grant Access</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Create login credentials for a new admin or editor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-800">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200"
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-800">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200"
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-800">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200"
            placeholder="Minimum 6 characters with numbers and symbols"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-800">Role</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="md:col-span-2">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          {!error && success ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Granting Access..." : "Grant Access"}
          </button>
        </div>
      </form>
    </section>
  );
}
