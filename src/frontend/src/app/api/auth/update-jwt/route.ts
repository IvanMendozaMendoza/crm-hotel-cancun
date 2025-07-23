import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, refreshToken } = body;
  // Get the session
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Update session values (in-memory for JWT strategy)
  session.backendJwt = token;
  session.refreshToken = refreshToken;
  // There is no persistent session to update for JWT strategy, but we return success
  return NextResponse.json({ ok: true });
} 