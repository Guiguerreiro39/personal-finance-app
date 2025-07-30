import { Effect, Schema } from 'effect';
import { Category } from '@/features/category/schema';
import prisma from '@/lib/prisma/client';
import { execute } from '@/lib/prisma/execute';

export class CategoryService extends Effect.Service<CategoryService>()(
  'CategoryService',
  {
    effect: Effect.gen(function* () {
      return {
        getMany: () =>
          Effect.gen(function* () {
            const categories = yield* execute(prisma.category.findMany());

            return yield* Schema.decode(Schema.Array(Category))(categories);
          }),
      };
    }),
  }
) {}
