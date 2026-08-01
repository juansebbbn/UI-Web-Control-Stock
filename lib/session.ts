import "server-only";
import { cookies } from "next/headers";

const TOKEN_COOKIE = "cs_session";
const USER_COOKIE = "cs_user";

export type SessionUser = { email: string };

export type Session = { token: string; user: SessionUser };

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 8, // 8h
};

/** Solo lectura — segura de llamar durante el render de un Server Component. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  const userRaw = store.get(USER_COOKIE)?.value;
  if (!token || !userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as SessionUser;
    return { token, user };
  } catch {
    return null;
  }
}

/** Solo puede llamarse desde Server Actions o Route Handlers. */
export async function setSession(token: string, user: SessionUser): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, cookieOpts);
  store.set(USER_COOKIE, JSON.stringify(user), cookieOpts);
}

/** Solo puede llamarse desde Server Actions o Route Handlers. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
}
