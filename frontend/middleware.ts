import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/chat")) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

    const url = new URL(path, backendUrl);

    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/chat/:path*",
};
