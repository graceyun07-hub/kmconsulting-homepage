import { NextResponse } from "next/server";
import { isAdminEmail } from "../../../lib/admin";
import { createSupabaseServerClient, hasSupabaseConfig } from "../../../lib/supabase/server";

function getSafeNextPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));
  const loginUrl = new URL("/admin/login", requestUrl.origin);

  if (!hasSupabaseConfig()) {
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    loginUrl.searchParams.set("error", "auth");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    loginUrl.searchParams.set("error", "auth");
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut();
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
