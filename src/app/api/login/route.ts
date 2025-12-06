import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "jt_session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const inputPassword = body?.password;
  const correctPassword = process.env.APP_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Server misconfigured: APP_PASSWORD not set" },
      { status: 500 }
    );
  }

  if (!inputPassword || inputPassword !== correctPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
