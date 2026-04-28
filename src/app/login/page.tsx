"use client";

import { type SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
      >
        <div className="mb-4 flex justify-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={96}
            height={54}
            priority
            className="h-auto rounded-lg"
          />
        </div>
        <h1 className="text-2xl text-center font-semibold text-zinc-900">Login</h1>
        <p className="mt-2 text-sm text-center text-zinc-600">
          Sign in to access the dashboard
        </p>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold tracking-tight text-zinc-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-[15px] text-zinc-900 shadow-sm outline-none transition duration-200 placeholder:text-zinc-500 placeholder:opacity-100 hover:border-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-200"
            placeholder="Enter your email"
          />
        </div>

        <div className="mt-4 space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold tracking-tight text-zinc-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-[15px] text-zinc-900 shadow-sm outline-none transition duration-200 placeholder:text-zinc-500 placeholder:opacity-100 hover:border-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-200"
            placeholder="Enter your password"
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-500"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
