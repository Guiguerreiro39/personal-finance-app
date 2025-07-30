import { Schema } from 'effect';

export const CategoryId = Schema.String.pipe(Schema.brand('CategoryId'));

export type CategoryId = Schema.Schema.Type<typeof CategoryId>;

export const Category = Schema.Struct({
  id: CategoryId,
  label: Schema.String,
});

export type Category = Schema.Schema.Type<typeof Category>;

export class CategoryNotFound extends Schema.TaggedError<CategoryNotFound>(
  'CategoryNotFound'
)('CategoryNotFound', {}) {}
