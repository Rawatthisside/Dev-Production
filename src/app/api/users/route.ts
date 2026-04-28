import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/api-security";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const rateLimitResponse = enforceRateLimit(req, {
      max: 10,
      route: "users:create",
      windowMs: 10 * 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authUser = verifyToken(token);

    if (authUser.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { name, email, password, role } = await req.json();
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPassword =
      typeof password === "string" ? password.trim() : "";
    const normalizedRole = role === "admin" ? "admin" : "editor";

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return Response.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (normalizedPassword.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    return Response.json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
