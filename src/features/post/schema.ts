import { Schema } from "effect";

export const PostId = Schema.Number.pipe(Schema.brand("PostId"));

export type PostId = Schema.Schema.Type<typeof PostId>;

export class Post extends Schema.Class<Post>("Post")({
	id: PostId,
	name: Schema.String,
}) {
	static readonly Array = Schema.Array(this);
}

export class PostNotFound extends Schema.TaggedError<PostNotFound>(
	"PostNotFound",
)("PostNotFound", {}) {}

export const PostInputs = {
	create: Schema.Struct({ name: Schema.String.pipe(Schema.minLength(1)) }),
};
