import { Effect, Schema } from 'effect';
import {
  Transaction,
  type TransactionId,
  type TransactionInputs,
  TransactionNotFound,
} from '@/features/transactions/schema';
import prisma from '@/lib/prisma/client';
import { execute } from '@/lib/prisma/execute';

export class TransactionService extends Effect.Service<TransactionService>()(
  'TransactionService',
  {
    effect: Effect.gen(function* () {
      return {
        create: ({
          description,
          amount,
          type,
          date,
          isRecurring,
        }: TransactionInputs['create']) =>
          Effect.gen(function* () {
            const transaction = yield* execute(
              prisma.transaction.create({
                data: {
                  description,
                  amount,
                  type,
                  date,
                  isRecurring,
                },
              })
            );

            return yield* Schema.decodeUnknown(Transaction)(transaction);
          }),
        getAll: () =>
          Effect.gen(function* () {
            const transactions = yield* execute(prisma.transaction.findMany());

            return yield* Schema.decodeUnknown(Transaction.Array)(transactions);
          }),
        get: (id: TransactionId) =>
          Effect.gen(function* () {
            const transaction = yield* execute(
              prisma.transaction.findUnique({
                where: {
                  id,
                },
              })
            ).pipe(
              Effect.flatMap((res) => {
                if (!res) {
                  return Effect.fail(new TransactionNotFound());
                }

                return Effect.succeed(res);
              })
            );

            return yield* Schema.decodeUnknown(Transaction)(transaction);
          }),
      };
    }),
  }
) {}
