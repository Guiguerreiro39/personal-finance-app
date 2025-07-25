'use client';

import { DataTable } from '@/components/data-table';
import { api } from '@/trpc/react';
import { columns } from './columns';

export const TransactionsTable = () => {
  const { data, error, isLoading } = api.transaction.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={[...data]} />
    </div>
  );
};
