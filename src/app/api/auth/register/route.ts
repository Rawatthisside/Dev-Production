import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { enforceRateLimit } from "@/lib/api-security";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPassword =
      typeof password === "string" ? password.trim() : "";
    const rateLimitResponse = enforceRateLimit(req, {
      identifier: normalizedEmail,
      max: 5,
      route: "auth:register-bootstrap",
      windowMs: 10 * 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return Response.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (normalizedPassword.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    await connectDB();

    const userCount = await User.countDocuments();

    if (userCount > 0) {
      return Response.json(
        { error: "Use the Users section in the admin panel to create accounts" },
        { status: 403 }
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
      role: "admin",
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
    return Response.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
