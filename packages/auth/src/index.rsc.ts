import { cache } from "react";

import {
  getUser as getUserDefault,
  signIn,
  signInWithOAuth,
  signInWithPassword,
  signOut,
  signUp,
} from "./methods";

export { signIn, signInWithOAuth, signInWithPassword, signOut, signUp };
export const getUser = cache(getUserDefault);
