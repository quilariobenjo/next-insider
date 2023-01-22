import { createCommentSchema, commentSchema } from "@/server/schema/comments";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { commentIdSchema } from "../../schema/comments";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          comment: input.comment,
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });

      return {
        comment,
      };
    }),
  updateComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          comment: input.comment,
        },
      });
    }),
  deleteComment: protectedProcedure
    .input(commentIdSchema)
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (comment) {
        await ctx.prisma.comment.delete({
          where: {
            id: comment.id,
          },
        });
      }

      return {
        message: "Successfully Deleted!!",
      };
    }),
  getCommentById: protectedProcedure
    .input(commentIdSchema)
    .query(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      return comment;
    }),
  getComments: protectedProcedure
    .input(commentSchema)
    .query(async ({ ctx, input }) => {
      const skip = input?.cursor || 0;
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input?.limit || 3,
        skip,
      });

      return {
        comments: comments.map((comment) => comment),
        hasNextPage: comments.length < (input.limit || 3) ? false : true,
        nextSkip:
          comments.length < (input.limit || 3)
            ? null
            : skip + (input.limit as number),
      };
    }),
});