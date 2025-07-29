import { TransactionsList } from '@/features/transactions/pages/transactions-list';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { api, HydrateClient } from '@/trpc/server';

export default function TransactionsPage() {
  api.transaction.getMany.prefetchInfinite(
    {
      limit: DEFAULT_LIMIT,
      search: '',
    },
    {
      initialCursor: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <HydrateClient>
      <TransactionsList />
    </HydrateClient>
  );
}
