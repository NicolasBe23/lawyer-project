import { NextResponse } from "next/server";
import { setAuthCookies } from "../_helpers";
import { STRAPI_API_URL } from "@/lib/config/strapiServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const strapiRes = await fetch(`${STRAPI_API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await strapiRes.json().catch(() => ({}));

    if (!strapiRes.ok) {
      return NextResponse.json(payload, { status: strapiRes.status });
    }

    const response = NextResponse.json({ user: payload.user }, { status: 200 });
    setAuthCookies(response, payload.jwt, payload.user);
    return response;
  } catch {
    return NextResponse.json(
      { error: { message: "Registration failed" } },
      { status: 500 }
    );
  }
}
