import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getSafeNextPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const callbackUrl = new URL("/auth/callback", requestUrl.origin);
    callbackUrl.searchParams.set("code", code);
    callbackUrl.searchParams.set("next", getSafeNextPath(requestUrl.searchParams.get("next")));
    return NextResponse.redirect(callbackUrl);
  }

  const html = await readFile(path.join(process.cwd(), "index.html"), "utf8");

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
