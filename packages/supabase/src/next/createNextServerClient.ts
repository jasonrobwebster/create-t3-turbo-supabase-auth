import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "../env";

export function createNextServerClient<Database>({
  asAdmin = false,
}: {
  asAdmin?: boolean;
} = {}) {
  const cookieStore = cookies();

  return createServerClient<Database>(
    env.SUPABASE_URL,
    asAdmin ? env.SUPABASE_SERVICE_KEY : env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookies) {
          try {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
