import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { verifyToken } from "@/lib/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    verifyToken(token);
  } catch {
    redirect("/login");
  }

return (
  <div className="flex min-h-screen bg-zinc-100">

    {/* Sidebar */}
    <aside className="flex w-70 flex-col">

      {/* Top (Logo area - white) */}
     {/* Top (White section) */}
<div className="flex h-45 flex-col items-center justify-center gap-2 bg-white">
  <Image
    src="/logo.svg"
    alt="Logo"
    width={96}
    height={54}
    priority
    className="h-auto"
  />

 <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.8rem", fontWeight: "bold", color: "#000000", marginTop: "1rem" }}>Admin Panel</h1>
</div>
{/* Curvy divider */}
<div className="relative h-16 w-full overflow-hidden bg-white">
  <svg
    viewBox="0 0 256 110"
    className="absolute inset-0 h-full w-full"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="sidebarWaveFill" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#000000" />
        <stop offset="100%" stopColor="#111111" />
      </linearGradient>
      <linearGradient id="sidebarWaveStroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
      </linearGradient>
    </defs>
    <path
      d="M0,60 C48,14 96,14 132,56 C160,90 202,88 256,50 L256,110 L0,110 Z"
      fill="url(#sidebarWaveFill)"
    />
    <path
      d="M0,60 C48,14 96,14 132,56 C160,90 202,88 256,50"
      fill="none"
      stroke="url(#sidebarWaveStroke)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M0,66 C48,24 98,24 136,62 C164,90 204,90 256,58"
      fill="none"
      stroke="#ffffff"
      strokeOpacity="0.2"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
</div>


{/* Bottom (Black section) */}
<div className="flex flex-1 flex-col bg-black px-6 py-6 text-white">

     
        {/* Content */}
        <div className="flex flex-1 flex-col px-6 py-6">

          <nav className="flex flex-col gap-2 text-sm">

            <Link href="/dashboard" className=" text-base px-6 py-2.5 rounded hover:bg-white/10 transition">
              Dashboard
            </Link>

            <Link href="/dashboard/articles" className=" text-base px-6 py-2.5 rounded hover:bg-white/10 transition">
              Articles
            </Link>

            <Link href="/dashboard/articles/new" className=" text-base px-6 py-2.5 rounded hover:bg-white/10 transition">
              New Article
            </Link>

            <Link href="/dashboard/udankaar" className=" text-base px-6 py-2.5 rounded hover:bg-white/10 transition">
              Udankaar
            </Link>

            <Link href="/dashboard/udankaar/new" className=" text-base px-6 py-2.5 rounded hover:bg-white/10 transition">
              Add Udankaar
            </Link>

            <Link href="/dashboard/users" className=" text-base px-6 py-2.5 rounded hover:bg-white/10 transition">
              Users
            </Link>

          </nav>

          <form action="/api/auth/logout" method="POST" className="mt-auto pt-6">
            <button
              type="submit"
              className="w-full rounded-md border border-white/20 px-3 py-2 text-sm transition hover:bg-white hover:text-black"
            >
              Log Out
            </button>
          </form>

        </div>
      </div>
    </aside>

    {/* Main */}
    <main className="flex-1 p-8 text-zinc-900">
      {children}
    </main>

  </div>
);
}
