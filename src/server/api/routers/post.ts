import { TRPCError } from "@trpc/server";
import { Effect, Schema } from "effect";
import { PostInputs } from "@/features/post/schema";
import { PostService } from "@/features/post/service";
import { RuntimeServer } from "@/lib/runtime-server";
import { notReachable } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = Effect.gen(function* () {
	const postService = yield* PostService;

	return {
		create: publicProcedure
			.input(Schema.standardSchemaV1(PostInputs.create))
			.mutation(async ({ input }) => {
				return postService.createPost(input).pipe(RuntimeServer.runPromise);
			}),

		getLatest: publicProcedure.query(() => {
			return postService.getLatestPost.pipe(
				Effect.match({
					onFailure: (error) => {
						switch (error._tag) {
							case "PostNotFound":
								throw new TRPCError({
									code: "NOT_FOUND",
									message: "Post not found",
									cause: error,
								});
							case "DatabaseError":
								throw new TRPCError({
									code: "INTERNAL_SERVER_ERROR",
									message: "Database error",
									cause: error,
								});
							default:
								return notReachable(error);
						}
					},
					onSuccess: (value) => value,
				}),
				RuntimeServer.runPromise,
			);
		}),
	};
}).pipe((result) => createTRPCRouter(RuntimeServer.runSync(result)));
