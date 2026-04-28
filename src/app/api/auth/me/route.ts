import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(null);
    }

    const user = verifyToken(token);

    return Response.json(user);
  } catch {
    return Response.json(null);
  }
}