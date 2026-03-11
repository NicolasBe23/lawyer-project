import { NextResponse } from "next/server";

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set("strapi_session", "", {
    maxAge: 0,
    path: "/",
  });
  response.cookies.set("strapi_user", "", {
    maxAge: 0,
    path: "/",
  });
};

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  clearAuthCookies(response);
  return response;
}
