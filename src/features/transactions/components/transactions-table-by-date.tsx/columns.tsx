'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Transaction } from '@/features/transactions/schema';
import { cn } from '@/lib/utils';
import { Actions } from './actions';

export const columns = (date: string): ColumnDef<Transaction>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    size: 10,
  },
  {
    accessorKey: 'description',
    header: ({ table }) => (
      <p className="font-medium">
        {date} · {table.getRowCount()}
      </p>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const type = row.original.type;
      const amount =
        type === 'EXPENSE' ? -row.original.amount : row.original.amount;

      return (
        <div
          className={cn(
            type === 'EXPENSE' ? 'text-destructive' : 'text-success'
          )}
        >
          {amount}
        </div>
      );
    },
  },
  {
    accessorKey: 'isRecurring',
    header: () => <div className="text-center">Recurring</div>,
    cell: ({ row }) => {
      const isRecurring = row.original.isRecurring;

      if (isRecurring) {
        return (
          <div className="flex justify-center text-primary">
            <Check />
          </div>
        );
      }

      return (
        <div className="flex justify-center text-secondary-foreground">
          <X />
        </div>
      );
    },
    maxSize: 150,
  },
  {
    id: 'actions',
    enableHiding: false,
    maxSize: 10,
    cell: ({ row }) => {
      const transaction = row.original;
      return <Actions transaction={transaction} />;
    },
  },
];
