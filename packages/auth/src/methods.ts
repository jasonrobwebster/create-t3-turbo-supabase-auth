import type {
  SignInWithOAuthCredentials,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
} from "@acme/supabase";
import { createNextServerClient } from "@acme/supabase/next";

// sign in methods
// not extensive, feel free to add more here
export const signIn = async (credentials: SignInWithPasswordCredentials) => {
  const supabase = createNextServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw error;
  }
  return data.user;
};
export const signInWithPassword = async (
  credentials: SignInWithPasswordCredentials,
) => {
  const supabase = createNextServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw error;
  }
  return data.user;
};
export const signInWithOAuth = async (
  credentials: SignInWithOAuthCredentials,
) => {
  const supabase = createNextServerClient();
  const { data } = await supabase.auth.signInWithOAuth(credentials);
  return data;
};

// sign out methods
export const signOut = async () => {
  const supabase = createNextServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return;
};

// sign up method
export const signUp = async (credentials: SignUpWithPasswordCredentials) => {
  const supabase = createNextServerClient();
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) {
    throw error;
  }
  return data.user;
};

// get user method
// either from a jwt string or will default to getting it from the session in cookies
export const getUser = async (jwt?: string) => {
  const supabase = createNextServerClient();
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error) {
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

    const newReq = req as Request & { user: User | null };
    newReq.user = user;

    return fn(newReq);
  };
