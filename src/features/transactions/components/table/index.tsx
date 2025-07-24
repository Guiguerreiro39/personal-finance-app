import { DataTable } from '@/components/data-table';
import {
  type Transaction,
  TransactionId,
} from '@/features/transactions/schema';
import { columns } from './columns';

const data: (typeof Transaction.Type)[] = [
  {
    id: TransactionId.make(crypto.randomUUID()),
    label: 'Transaction 1',
    amount: 100,
    type: 'EXPENSE',
    date: new Date(),
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: TransactionId.make(crypto.randomUUID()),
    label: 'Transaction 2',
    amount: 200,
    type: 'INCOME',
    date: new Date(),
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: TransactionId.make(crypto.randomUUID()),
    label: 'Transaction 1',
    amount: 100,
    type: 'EXPENSE',
    date: new Date(),
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const TransactionsTable = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};
