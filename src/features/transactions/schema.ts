import { Schema } from 'effect';

export const TransactionId = Schema.UUID.pipe(Schema.brand('TransactionId'));

export type TransactionId = Schema.Schema.Type<typeof TransactionId>;

export const TransactionType = Schema.Literal('INCOME', 'EXPENSE');

export class Transaction extends Schema.Class<Transaction>('Transaction')({
  id: TransactionId,
  label: Schema.String,
  amount: Schema.Number,
  type: TransactionType,
  date: Schema.Date,
  isRecurring: Schema.Boolean,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static readonly Array = Schema.Array(this);
}

export class TransactionNotFound extends Schema.TaggedError<TransactionNotFound>(
  'TransactionNotFound'
)('TransactionNotFound', {}) {}
