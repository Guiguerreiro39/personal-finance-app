'use client';

import { useDebounce } from '@uidotdev/usehooks';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { api } from '@/trpc/react';
import { columns } from './columns';

export const TransactionsTable = () => {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const [data, query] = api.transaction.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      search: debouncedSearch,
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
    <div className="flex flex-1 flex-col gap-4">
      <Input
        className="w-full"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search transaction..."
        value={search}
      />
      <DataTable
        columns={columns}
        data={flatTransactions}
        fetchNextPageAction={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
