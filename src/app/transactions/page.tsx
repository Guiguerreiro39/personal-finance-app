import { TransactionsList } from '@/features/transaction/pages/transactions-list';
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

  api.category.getMany.prefetch();

  return (
    <HydrateClient>
      <TransactionsList />
    </HydrateClient>
  );
}
