import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "rafi_session";
const SECRET = process.env.RAFI_SECRET || process.env.RAFI_PASSWORD || "rafi-dev-secret";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function verifyPassword(password: string) {
  const expected = process.env.RAFI_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createSession() {
  const value = `${Date.now()}`;
  const token = `${value}.${sign(value)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [value, sig] = token.split(".");
  if (!value || !sig) return false;
  const expected = sign(value);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
