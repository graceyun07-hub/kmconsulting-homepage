"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export type LoginState = {
  message: string;
};

function getSafeNextPath(value: FormDataEntryValue | null) {
  const next = String(value ?? "/admin");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
}

async function getOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  }

  return `${proto}://${host}`;
}

function getRedirectTo(origin: string, next: string) {
  const { hostname } = new URL(origin);
  const callbackPath = `/auth/callback?next=${encodeURIComponent(next)}`;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${origin}${callbackPath}`;
  }

  return `${origin}?next=${encodeURIComponent(next)}`;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createSupabaseServerClient();
  const origin = await getOrigin();
  const next = getSafeNextPath(formData.get("next"));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getRedirectTo(origin, next),
    },
  });

  if (error || !data.url) {
    return { message: "Google login could not be started. Please try again." };
  }

  redirect(data.url);
}
