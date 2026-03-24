import { NextResponse } from "next/server";

export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const setAuthCookies = (
  response: NextResponse,
  jwt: string,
  user: Record<string, unknown>
) => {
  const secure = process.env.NODE_ENV === "production";

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
