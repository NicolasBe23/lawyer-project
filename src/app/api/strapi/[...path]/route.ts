import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

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
  const targetUrl = `${STRAPI_URL}/api/${endpoint}${req.nextUrl.search}`;
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
