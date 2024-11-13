import type {
  SignInWithOAuthCredentials,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
} from "@acme/supabase";
import { createNextServerClient } from "@acme/supabase/next";

const supabase = createNextServerClient();

// sign in methods
// not extensive, feel free to add more here
export const signIn = (credentials: SignInWithPasswordCredentials) =>
  supabase.auth.signInWithPassword(credentials);
export const signInWithPassword = (
  credentials: SignInWithPasswordCredentials,
) => supabase.auth.signInWithPassword(credentials);
export const signInWithOAuth = (credentials: SignInWithOAuthCredentials) =>
  supabase.auth.signInWithOAuth(credentials);

// sign out methods
export const signOut = () => supabase.auth.signOut();

// sign up method
export const signUp = (credentials: SignUpWithPasswordCredentials) =>
  supabase.auth.signUp(credentials);

// get user method
// either from a jwt string or will default to getting it from the session in cookies
export const getUser = async (jwt?: string) => {
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error) {
    console.error(error);
    return null;
  }

  return data.user;
};

export const supabaseAuth =
  (
    fn: (
      req: Request & { user: User | null },
    ) => void | Response | Promise<void | Response>,
  ) =>
  async (req: Request) => {
    const authToken = req.headers.get("Authorization");
    const user = await getUser(authToken ?? undefined);

    return fn({ ...req, user });
  };
