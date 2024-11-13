import type { TRPCRouterRecord } from "@trpc/server";

import { signOut } from "@acme/auth";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signOut: protectedProcedure.mutation(async () => {
    await signOut();
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
