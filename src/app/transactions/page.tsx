import { TransactionsPage } from '@/features/transactions';
import { HydrateClient } from '@/trpc/server';

export default function TransactionsRoute() {
  return (
    <HydrateClient>
      <TransactionsPage />
    </HydrateClient>
  );
}
