'use client';

import { useMemo } from 'react';
import { InfiniteDataTable } from '@/components/infinite-data-table';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { api } from '@/trpc/react';
import { columns } from './columns';

type Props = {
  search: string;
};

export const TransactionsTable = ({ search }: Props) => {
  const [data, query] = api.transaction.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      search,
    },
    {
      initialCursor: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const flatTransactions = useMemo(
    () => data.pages.flatMap((page) => page.transactions) ?? [],
    [data]
  );

  return (
    <InfiniteDataTable
      columns={columns}
      data={flatTransactions}
      fetchNextPageAction={query.fetchNextPage}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
    />
  );
};
