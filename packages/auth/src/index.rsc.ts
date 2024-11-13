import { cache } from "react";

import {
  supabaseAuth as defaultSupabaseAuth,
  getUser as getUserDefault,
  signIn,
  signInWithOAuth,
  signInWithPassword,
  signOut,
  signUp,
} from "./methods";

export { signIn, signInWithOAuth, signInWithPassword, signOut, signUp };
export const getUser = cache(getUserDefault);
export const supabaseAuth = cache(defaultSupabaseAuth);
