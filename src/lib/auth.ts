import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "jt_session";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === "ok";
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

