import { TransactionsList } from '@/features/transactions/pages/transactions-list';
import { HydrateClient } from '@/trpc/server';

export default function TransactionsRoute() {
  return (
    <HydrateClient>
      <TransactionsList />
    </HydrateClient>
  );
}
