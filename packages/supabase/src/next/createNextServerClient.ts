import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createNextServerClient<Database>({
  asAdmin = false,
}: {
  asAdmin?: boolean;
} = {}) {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    asAdmin
      ? process.env.SUPABASE_SERVICE_KEY!
      : process.env.SUPABASE_ANON_KEY!,
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
