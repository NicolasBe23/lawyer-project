import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const setAuthCookies = (
  response: NextResponse,
  jwt: string,
  user: Record<string, unknown>
) => {
  const secure = process.env.NODE_ENV === "production";

  // Server session cookie for middleware and server-side auth checks.
  response.cookies.set("strapi_session", jwt, {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure,
    path: "/",
  });

  response.cookies.set("strapi_user", JSON.stringify(user), {
    maxAge: AUTH_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure,
    path: "/",
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const strapiRes = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await strapiRes.json().catch(() => ({}));

    if (!strapiRes.ok) {
      return NextResponse.json(payload, { status: strapiRes.status });
    }

    const response = NextResponse.json(
      { user: payload.user },
      { status: 200 }
    );
    setAuthCookies(response, payload.jwt, payload.user);
    return response;
  } catch {
    return NextResponse.json(
      { error: { message: "Authentication failed" } },
      { status: 500 }
    );
  }
}
