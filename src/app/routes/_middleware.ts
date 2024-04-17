// app/routes/_middleware.ts

import { NextResponse } from "next/server";

export function middleware(request: any) {
  const response = NextResponse.next();

  // Set headers to disable caching
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
