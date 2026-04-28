import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const redirectUrl = new URL("/login", req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
