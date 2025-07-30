import { TRPCError } from '@trpc/server';
import { Effect } from 'effect';
import { CategoryService } from '@/features/category/service';
import { RuntimeServer } from '@/lib/runtime-server';
import { notReachable } from '@/lib/utils';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const categoryRouter = Effect.gen(function* () {
  const categoryService = yield* CategoryService;

  return {
    getMany: publicProcedure.query(() => {
      return categoryService.getMany().pipe(
        Effect.match({
          onSuccess: (res) => res,
          onFailure: (error) => {
            switch (error._tag) {
              case 'DatabaseError':
              case 'ParseError':
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Failed to get categories',
                  cause: error,
                });
              default:
                return notReachable(error);
            }
          },
        }),
        RuntimeServer.runPromise
      );
    }),
  };
}).pipe((result) => createTRPCRouter(RuntimeServer.runSync(result)));
