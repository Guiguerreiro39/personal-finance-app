import { Schema } from 'effect';

export const TransactionId = Schema.String.pipe(Schema.brand('TransactionId'));

export type TransactionId = Schema.Schema.Type<typeof TransactionId>;

export const TransactionType = Schema.Literal('INCOME', 'EXPENSE');

export const Transaction = Schema.Struct({
  id: TransactionId,
  description: Schema.String,
  amount: Schema.Number,
  type: TransactionType,
  date: Schema.DateFromSelf.pipe(Schema.validDate()),
  isRecurring: Schema.Boolean,
});

export type Transaction = Schema.Schema.Type<typeof Transaction>;
export class TransactionNotFound extends Schema.TaggedError<TransactionNotFound>(
  'TransactionNotFound'
)('TransactionNotFound', {}) {}

export const TransactionInputs = Schema.Struct({
  create: Schema.Struct({
    description: Schema.NonEmptyString.pipe(
      Schema.maxLength(255),
      Schema.minLength(3)
    ),
    amount: Schema.Number.annotations({
      message: () => 'Expected number',
    }).pipe(Schema.positive()),
    type: TransactionType,
    date: Schema.DateFromSelf.pipe(Schema.validDate()),
    isRecurring: Schema.Boolean,
  }),
  get: Schema.Struct({
    id: TransactionId,
  }),
  getMany: Schema.Struct({
    cursor: TransactionId.pipe(Schema.optional),
    limit: Schema.Number.pipe(Schema.between(1, 100)),
    search: Schema.String.pipe(Schema.optional),
  }),
  delete: Schema.Struct({
    id: TransactionId,
  }),
  update: Schema.Struct({
    id: TransactionId,
    description: Schema.NonEmptyString.pipe(
      Schema.maxLength(255),
      Schema.minLength(3)
    ),
    amount: Schema.Number.annotations({
      message: () => 'Expected number',
    }).pipe(Schema.positive()),
    type: TransactionType,
    date: Schema.DateFromSelf.pipe(Schema.validDate()),
    isRecurring: Schema.Boolean,
  }),
  duplicate: Schema.Struct({
    id: TransactionId,
  }),
});

export type TransactionInputs = Schema.Schema.Type<typeof TransactionInputs>;
