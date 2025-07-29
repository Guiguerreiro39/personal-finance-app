import { Suspense } from 'react';
import { TransactionsHeader } from './components/header';
import { TransactionsTable } from './components/table';

export const TransactionsList = () => {
  return (
    <div className="container mx-auto flex max-h-[calc(100vh-6.5rem)] flex-col gap-8">
      <TransactionsHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionsTable />
      </Suspense>
    </div>
  );
};
