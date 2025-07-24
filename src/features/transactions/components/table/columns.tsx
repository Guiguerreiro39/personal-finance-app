'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Transaction } from '@/features/transactions/schema';

export const columns: ColumnDef<typeof Transaction.Type>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'isRecurring',
    header: 'Recurring',
  },
];
