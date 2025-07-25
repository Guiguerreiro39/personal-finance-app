import { TRPCError } from '@trpc/server';
import { Effect, Schema } from 'effect';
import { TransactionInputs } from '@/features/transactions/schema';
import { TransactionService } from '@/features/transactions/service';
import { RuntimeServer } from '@/lib/runtime-server';
import { notReachable } from '@/lib/utils';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const transactionRouter = Effect.gen(function* () {
  const transactionService = yield* TransactionService;

  return {
    create: publicProcedure
      .input(Schema.standardSchemaV1(TransactionInputs.fields.create))
      .mutation(({ input }) => {
        return transactionService.create(input).pipe(
          Effect.match({
            onFailure: (error) => {
              switch (error._tag) {
                case 'DatabaseError':
                case 'ParseError':
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create transaction',
                    cause: error,
                  });
                default:
                  return notReachable(error);
              }
            },
            onSuccess: (value) => value,
          }),
          RuntimeServer.runPromise
        );
      }),
    getAll: publicProcedure.query(() => {
      return transactionService.getAll().pipe(
        Effect.match({
          onFailure: (error) => {
            switch (error._tag) {
              case 'DatabaseError':
              case 'ParseError':
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Failed to get transactions',
                  cause: error,
                });
              default:
                return notReachable(error);
            }
          },
          onSuccess: (value) => value,
        }),
        RuntimeServer.runPromise
      );
    }),
    get: publicProcedure
      .input(Schema.standardSchemaV1(TransactionInputs.fields.get))
      .query(({ input }) => {
        return transactionService.get(input.id).pipe(
          Effect.match({
            onFailure: (error) => {
              switch (error._tag) {
                case 'DatabaseError':
                case 'ParseError':
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to get transaction',
                    cause: error,
                  });
                case 'TransactionNotFound':
                  throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Transaction not found',
                    cause: error,
                  });
                default:
                  return notReachable(error);
              }
            },
            onSuccess: (value) => value,
          }),
          RuntimeServer.runPromise
        );
      }),
  };
}).pipe((result) => createTRPCRouter(RuntimeServer.runSync(result)));
