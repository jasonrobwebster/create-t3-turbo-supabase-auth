import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@acme/db";
import { CreatePostSchema, Post } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    console.log("getting posts");
    try {
      const posts = await ctx.db.query.Post.findMany({
        orderBy: desc(Post.id),
        limit: 10,
      });
      console.log("posts", posts);
      return posts;
    } catch (error) {
      console.error("posts error", error);
      return [];
    }
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.post)
      //   .where(eq(schema.post.id, input.id));

      return ctx.db.query.Post.findFirst({
        where: eq(Post.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Post).values(input).returning();
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Post).where(eq(Post.id, input)).returning();
  }),
} satisfies TRPCRouterRecord;
