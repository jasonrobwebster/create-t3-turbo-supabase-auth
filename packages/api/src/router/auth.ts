import type { TRPCRouterRecord } from "@trpc/server";
import { AuthApiError, AuthError } from "@supabase/auth-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { signIn, signOut, signUp } from "@acme/auth";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const user = await signIn({
          email: input.email,
          password: input.password,
        });
        return user;
      } catch (error) {
        if (
          error instanceof AuthApiError &&
          error.code === "invalid_credentials"
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            cause: "invalid_credentials",
          });
        }
        throw error;
      }
    }),
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        options: z
          .object({
            redirectTo: z.string().url().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await signUp({
        email: input.email,
        password: input.password,
        options: input.options && {
          emailRedirectTo: input.options.redirectTo,
        },
      });
      return user;
    }),
  signOut: protectedProcedure.mutation(async () => {
    await signOut();
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
