import { NextRequest, NextResponse } from "next/server";
import { STRAPI_API_URL } from "@/lib/config/strapiServer";

const buildForwardHeaders = (req: NextRequest, token: string) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);

  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const accept = req.headers.get("accept");
  if (accept) {
    headers.set("Accept", accept);
  }

  return headers;
};

const forwardToStrapi = async (
  req: NextRequest,
  path: string[],
  method: string
) => {
  const token =
    req.cookies.get("strapi_session")?.value;

  if (!token) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const endpoint = path.join("/");
  const targetUrl = `${STRAPI_API_URL}/api/${endpoint}${req.nextUrl.search}`;
  const headers = buildForwardHeaders(req, token);

  const requestInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (method !== "GET" && method !== "HEAD") {
    const body = await req.arrayBuffer();
    if (body.byteLength > 0) {
      requestInit.body = body;
    }
  }

  const strapiRes = await fetch(targetUrl, requestInit);
  const responseBody = await strapiRes.arrayBuffer();

  if (strapiRes.status === 401) {
    const unauthorizedResponse = NextResponse.json(
      { error: { message: "Session expired. Please login again." } },
      { status: 401 }
    );
    unauthorizedResponse.cookies.set("strapi_session", "", {
      maxAge: 0,
      path: "/",
    });
    unauthorizedResponse.cookies.set("strapi_user", "", {
      maxAge: 0,
      path: "/",
    });
    return unauthorizedResponse;
  }

  const responseHeaders = new Headers();
  const responseContentType = strapiRes.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("Content-Type", responseContentType);
  }
  const contentDisposition = strapiRes.headers.get("content-disposition");
  if (contentDisposition) {
    responseHeaders.set("Content-Disposition", contentDisposition);
  }

  return new NextResponse(responseBody, {
    status: strapiRes.status,
    headers: responseHeaders,
  });
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardToStrapi(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardToStrapi(req, path, "POST");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardToStrapi(req, path, "PUT");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardToStrapi(req, path, "PATCH");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardToStrapi(req, path, "DELETE");
}
