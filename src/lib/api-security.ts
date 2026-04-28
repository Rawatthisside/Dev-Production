import { type AuthTokenPayload, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

type SessionRequirement = "authenticated" | "admin";

type SessionCheckResult =
  | {
      response: Response;
      user?: never;
    }
  | {
      response?: never;
      user: AuthTokenPayload;
    };

type RateLimitOptions = {
  identifier?: string;
  max: number;
  route: string;
  windowMs: number;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
  __rateLimitStore?: Map<string, number[]>;
};

const rateLimitStore =
  globalRateLimitStore.__rateLimitStore ??
  (globalRateLimitStore.__rateLimitStore = new Map<string, number[]>());

export async function requireSession(
  requirement: SessionRequirement = "authenticated",
): Promise<SessionCheckResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const user = verifyToken(token);

    if (requirement === "admin" && user.role !== "admin") {
      return {
        response: Response.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    return { user };
  } catch {
    return {
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}

export function enforceRateLimit(
  req: Request,
  { identifier = "", max, route, windowMs }: RateLimitOptions,
) {
  const now = Date.now();
  const ip = getClientIp(req);
  const key = `${route}:${ip}:${identifier}`;
  const timestamps = rateLimitStore.get(key) ?? [];
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recentTimestamps.length >= max) {
    rateLimitStore.set(key, recentTimestamps);

    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  recentTimestamps.push(now);
  rateLimitStore.set(key, recentTimestamps);
  pruneRateLimitStore(now, windowMs);

  return null;
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = req.headers.get("x-real-ip")?.trim();

  if (realIp) {
    return realIp;
  }

  const cloudflareIp = req.headers.get("cf-connecting-ip")?.trim();

  if (cloudflareIp) {
    return cloudflareIp;
  }

  return "unknown";
}

function pruneRateLimitStore(now: number, windowMs: number) {
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const recentTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < windowMs,
    );

    if (recentTimestamps.length === 0) {
      rateLimitStore.delete(key);
      continue;
    }

    if (recentTimestamps.length !== timestamps.length) {
      rateLimitStore.set(key, recentTimestamps);
    }
  }
}
