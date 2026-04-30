import bcrypt from "bcryptjs";
import { enforceRateLimit, requireSession } from "@/lib/api-security";
import { createApiErrorResponse } from "@/lib/api-error-response";
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

    const auth = await requireSession("admin");

    if (auth.response) {
      return auth.response;
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
  } catch (error) {
    return createApiErrorResponse(error, {
      context: "users:create",
      fallbackMessage: "Failed to create user",
      duplicateKeyMessage: "User already exists",
      invalidRequestMessage: "Invalid user payload",
    });
  }
}
