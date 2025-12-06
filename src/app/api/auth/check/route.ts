import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "jt_session";

export async function GET(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = session === "ok";
  
  return NextResponse.json({ authenticated: isAuthenticated });
}

