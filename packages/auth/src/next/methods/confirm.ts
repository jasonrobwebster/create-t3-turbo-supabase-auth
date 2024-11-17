import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { EmailOtpType } from "@acme/supabase";
import { createNextServerClient } from "@acme/supabase/next";

/**
 * Confirms the user's email address or phone number.
 */
export async function confirm(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = new URL(next);

  if (token_hash && type) {
    const supabase = createNextServerClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
    console.error("Error in auth confirm:", error);
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
