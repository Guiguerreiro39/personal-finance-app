import { Effect } from "effect";
import prisma from "@/lib/prisma/client";
import { execute } from "@/lib/prisma/execute";
import { PostNotFound } from "./schema";

export class PostService extends Effect.Service<PostService>()("PostService", {
	effect: Effect.gen(function* () {
		return {
			getPosts: Effect.gen(function* () {
				return prisma.post.findMany();
			}),
			getLatestPost: Effect.gen(function* () {
				const post = yield* execute(
					prisma.post.findFirst({
						orderBy: {
							createdAt: "desc",
						},
					}),
				);

				if (!post) {
					return yield* Effect.fail(new PostNotFound());
				}

				return post;
			}),
			createPost: ({ name }: { name: string }) =>
				Effect.gen(function* () {
					const post = yield* execute(
						prisma.post.create({
							data: {
								name,
							},
						}),
					);

					return post;
				}),
		};
	}),
}) {}
