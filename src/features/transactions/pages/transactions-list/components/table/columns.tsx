'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DateTime, Effect, Option, Schema } from 'effect';
import { Check, MoreHorizontal, OctagonAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  type Transaction,
  TransactionType,
} from '@/features/transactions/schema';

export const columns: ColumnDef<typeof Transaction.Type>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        className="border-accent-foreground/30"
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
    header: 'Description',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <div>{row.getValue('amount')}</div>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return Schema.decodeUnknown(TransactionType)(row.getValue('type')).pipe(
        Effect.match({
          onFailure: () => 'Unknown',
          onSuccess: (type) => (
            <div className="self-center capitalize">{type.toLowerCase()}</div>
          ),
        }),
        Effect.runSync
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return Schema.decodeUnknown(Schema.Date)(row.getValue('date')).pipe(
        Effect.match({
          onFailure: () => {
            return (
              <div className="flex items-center gap-2 text-destructive">
                <OctagonAlert />
                <span>Invalid date</span>
              </div>
            );
          },
          onSuccess: (date) => {
            const dateTime = DateTime.make(date).pipe(Option.getOrUndefined);

            if (!dateTime) {
              return (
                <div className="flex items-center gap-2 text-destructive">
                  <OctagonAlert />
                  <span>Invalid date</span>
                </div>
              );
            }

            return <div>{DateTime.formatLocal(dateTime)}</div>;
          },
        }),
        Effect.runSync
      );
    },
  },
  {
    accessorKey: 'isRecurring',
    header: () => <div className="text-center">Recurring</div>,
    cell: ({ row }) => {
      return Schema.decodeUnknown(Schema.Boolean)(
        row.getValue('isRecurring')
      ).pipe(
        Effect.match({
          onFailure: () => (
            <div className="flex justify-center text-destructive">
              <OctagonAlert />
            </div>
          ),
          onSuccess: (isRecurring) => {
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
        }),
        Effect.runSync
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View transaction details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
