'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Repeat2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Transaction } from '@/features/transaction/schema';
import { cn, notReachable } from '@/lib/utils';
import { Actions } from './actions';

export const columns = (date: string): ColumnDef<Transaction>[] => [
  {
    accessorKey: 'description',
    header: ({ table }) => (
      <div className="flex items-center gap-8">
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
        <p className="font-medium">
          {date} · {table.getRowCount()}
        </p>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-8">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
        <div className="flex flex-1 flex-col">
          <p className="font-medium">{row.getValue('description')}</p>
          <small className="text-muted-foreground text-xs">
            Personal account
          </small>
        </div>
        {row.original.isRecurring && (
          <Tooltip>
            <TooltipTrigger>
              <Repeat2 className="size-5 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>This transaction happens on a scheduled basis</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    ),
    minSize: 500,
  },
  {
    accessorKey: 'category',
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => {
      const category = row.original.category;

      return (
        <div className="flex justify-center">
          <Badge variant="outline">{category.label}</Badge>
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: 'amount',
    header: ({ table }) => (
      <div className="text-right">
        {table.getRowModel().rows.reduce((acc, row) => {
          let result = acc;
          const type = row.original.type;

          switch (type) {
            case 'EXPENSE':
              result -= row.original.amount;
              break;
            case 'INCOME':
              result += row.original.amount;
              break;
            default:
              notReachable(type);
          }

          return result;
        }, 0)}
      </div>
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const amount =
        type === 'EXPENSE' ? -row.original.amount : row.original.amount;

      return (
        <p
          className={cn(
            'text-right',
            type === 'EXPENSE' ? 'text-destructive' : 'text-success'
          )}
        >
          {amount}
        </p>
      );
    },
    size: 100,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex justify-end">
          <Actions transaction={transaction} />
        </div>
      );
    },
    size: 50,
  },
];
