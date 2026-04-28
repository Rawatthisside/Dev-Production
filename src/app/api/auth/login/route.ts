import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { enforceRateLimit } from "@/lib/api-security";
import { SESSION_DURATION_SECONDS, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPassword =
      typeof password === "string" ? password : "";
    const rateLimitResponse = enforceRateLimit(req, {
      identifier: normalizedEmail,
      max: 10,
      route: "auth:login",
      windowMs: 10 * 60_000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(normalizedPassword, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      id: user._id,
      role: user.role,
    });

    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 },
    );
  }
}
