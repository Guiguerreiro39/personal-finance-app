'use client';

import { useDebounce } from '@uidotdev/usehooks';
import { Suspense, useState } from 'react';
import { Input } from '@/components/ui/input';
import { TransactionsTableByDate } from '@/features/transactions/components/transactions-table-by-date.tsx';
import { TransactionsHeader } from './header';

export const TransactionsList = () => {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  return (
    <div className="container mx-auto flex h-[calc(100vh-7rem)] flex-col gap-4">
      <div className="space-y-4">
        <TransactionsHeader />
        <Input
          className="w-full"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transaction..."
          value={search}
        />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionsTableByDate search={debouncedSearch} />
      </Suspense>
    </div>
  );
};
