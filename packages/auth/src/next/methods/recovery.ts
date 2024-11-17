import { NextResponse } from "next/server";

import { createNextServerClient } from "@acme/supabase/next";

export async function recovery(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next");
  if (next) {
    const nextUrl = new URL(next);
    if (nextUrl.origin !== origin) {
      return new Response("Invalid redirect URL", { status: 400 });
    }
  }
  const redirectTo = new URL(next ?? origin);

  if (code) {
    const supabase = createNextServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
    console.error("Error in auth recovery:", error);
  }

  // return the user to an error page with instructions
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
