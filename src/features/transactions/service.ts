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

            return yield* Schema.decode(Transaction)(transaction);
          }),
        getMany: ({ cursor, limit, search }: TransactionInputs['getMany']) =>
          Effect.gen(function* () {
            const transactions = yield* execute(
              prisma.transaction.findMany({
                orderBy: {
                  createdAt: 'desc',
                },
                cursor: cursor
                  ? {
                      id: cursor,
                    }
                  : undefined,
                take: limit + 1,
                skip: cursor ? 1 : 0,
                where: {
                  description: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              })
            );

            const hasMore = transactions.length > limit;
            const items = hasMore ? transactions.slice(0, -1) : transactions;

            const lastItem = items.at(-1);
            const nextCursor = hasMore && lastItem ? lastItem.id : null;

            return {
              transactions: yield* Schema.decode(Schema.Array(Transaction))(
                items
              ),
              nextCursor,
            };
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

            return yield* Schema.decode(Transaction)(transaction);
          }),
        delete: (id: TransactionId) =>
          Effect.gen(function* () {
            yield* execute(
              prisma.transaction.delete({
                where: {
                  id,
                },
              })
            );
          }),
        update: ({
          id,
          description,
          amount,
          type,
          date,
          isRecurring,
        }: TransactionInputs['update']) =>
          Effect.gen(function* () {
            const transaction = yield* execute(
              prisma.transaction.update({
                where: {
                  id,
                },
                data: {
                  description,
                  amount,
                  type,
                  date,
                  isRecurring,
                },
              })
            );

            return yield* Schema.decode(Transaction)(transaction);
          }),
        duplicate: (id: TransactionId) =>
          Effect.gen(function* () {
            const transactionToDuplicate = yield* execute(
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

            const transaction = yield* execute(
              prisma.transaction.create({
                data: {
                  description: transactionToDuplicate.description,
                  amount: transactionToDuplicate.amount,
                  type: transactionToDuplicate.type,
                  date: transactionToDuplicate.date,
                  isRecurring: transactionToDuplicate.isRecurring,
                },
              })
            );

            return yield* Schema.decode(Transaction)(transaction);
          }),
      };
    }),
  }
) {}
