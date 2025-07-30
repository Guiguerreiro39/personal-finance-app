'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DateTime, Effect, Option, Schema } from 'effect';
import { Check, OctagonAlert, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  type Transaction,
  TransactionType,
} from '@/features/transaction/schema';
import { Actions } from './actions';

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
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
      return Schema.decodeUnknown(Schema.DateFromSelf)(
        row.getValue('date')
      ).pipe(
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
      return <Actions transaction={transaction} />;
    },
  },
];
