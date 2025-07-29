import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type Row,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchNextPageAction: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const InfiniteDataTable = <TData, TValue>({
  columns,
  data,
  fetchNextPageAction,
  hasNextPage,
  isFetchingNextPage,
}: Props<TData, TValue>) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    rootMargin: '100px',
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPageAction();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPageAction]);

  const table = useReactTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { rows } = table.getCoreRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => targetRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <div
      className="relative flex-1 overflow-auto rounded-md border shadow-sm"
      data-slot="table-container"
      ref={targetRef}
    >
      <Table>
        <TableHeader className="!sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-accent hover:bg-accent/80"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="text-accent-foreground" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rowVirtualizer.getVirtualItems().length > 0 &&
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>;

              return (
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          {rowVirtualizer.getVirtualItems().length === 0 && (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isFetchingNextPage && <div>Fetching More...</div>}
    </div>
  );
};
