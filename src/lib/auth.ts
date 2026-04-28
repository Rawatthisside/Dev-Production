import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
export const SESSION_DURATION_SECONDS = 60 * 60;

export type AuthTokenPayload = JwtPayload & {
  id: string;
  role: string;
};

export const signToken = (payload: Pick<AuthTokenPayload, "id" | "role">) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_DURATION_SECONDS });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
};
