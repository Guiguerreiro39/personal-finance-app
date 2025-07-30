'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { CreateTransactionDialog } from '@/features/transaction/components/dialogs/create-transaction';

export const TransactionsHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        action={{
          label: 'New Transaction',
          onClick: () => setOpen(true),
        }}
        title="Transactions"
      />
      <CreateTransactionDialog onOpenChange={setOpen} open={open} />
    </>
  );
};
