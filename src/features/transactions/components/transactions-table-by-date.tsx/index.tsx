'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { DateTime, Option } from 'effect';
import { useMemo, useRef } from 'react';
import { DataTable } from '@/components/data-table';
import { InfiniteScroll } from '@/components/infinite-scroll';
import type { Transaction } from '@/features/transactions/schema';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { api } from '@/trpc/react';
import { columns } from './columns';

type Props = {
  search: string;
};

export const TransactionsTableByDate = ({ search }: Props) => {
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

  const parentRef = useRef<HTMLDivElement>(null);

  const flatTransactions = useMemo(
    () => data.pages.flatMap((page) => page.transactions) ?? [],
    [data]
  );

  const groupedTransactions = useMemo(() => {
    return flatTransactions.reduce(
      (acc, transaction) => {
        const dateTime = DateTime.make(transaction.date).pipe(
          Option.getOrUndefined
        );

        if (!dateTime) {
          return acc;
        }

        const date = DateTime.formatLocal(dateTime);

        if (!acc.has(date)) {
          acc.set(date, []);
        }

        acc.get(date)?.push(transaction);

        return acc;
      },
      new Map() as Map<string, Transaction[]>
    );
  }, [flatTransactions]);

  const rowVirtualizer = useVirtualizer({
    count: groupedTransactions.size,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  return (
    <div className="relative flex-1 space-y-8 overflow-auto" ref={parentRef}>
      {rowVirtualizer.getVirtualItems().map((virtualItem) => {
        const groupedTransaction = Array.from(groupedTransactions.entries())[
          virtualItem.index
        ];

        if (!groupedTransaction) {
          return null;
        }

        return (
          <DataTable
            columns={columns(groupedTransaction[0])}
            data={groupedTransaction[1]}
            key={groupedTransaction[0]}
          />
        );
      })}

      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
