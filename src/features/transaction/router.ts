import { TRPCError } from '@trpc/server';
import { Effect, Schema } from 'effect';
import { TransactionInputs } from '@/features/transaction/schema';
import { TransactionService } from '@/features/transaction/service';
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
    getMany: publicProcedure
      .input(Schema.standardSchemaV1(TransactionInputs.fields.getMany))
      .query(({ input }) => {
        return transactionService.getMany(input).pipe(
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
    update: publicProcedure
      .input(Schema.standardSchemaV1(TransactionInputs.fields.update))
      .mutation(({ input }) => {
        return transactionService.update(input).pipe(
          Effect.match({
            onFailure: (error) => {
              switch (error._tag) {
                case 'DatabaseError':
                case 'ParseError':
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update transaction',
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
    delete: publicProcedure
      .input(Schema.standardSchemaV1(TransactionInputs.fields.delete))
      .mutation(({ input }) => {
        return transactionService.delete(input.id).pipe(
          Effect.match({
            onFailure: (error) => {
              switch (error._tag) {
                case 'DatabaseError':
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to delete transaction',
                    cause: error,
                  });
                default:
                  return notReachable(error._tag);
              }
            },
            onSuccess: (value) => value,
          }),
          RuntimeServer.runPromise
        );
      }),
    duplicate: publicProcedure
      .input(Schema.standardSchemaV1(TransactionInputs.fields.duplicate))
      .mutation(({ input }) => {
        return transactionService.duplicate(input.id).pipe(
          Effect.match({
            onFailure: (error) => {
              switch (error._tag) {
                case 'DatabaseError':
                case 'ParseError':
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to duplicate transaction',
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
