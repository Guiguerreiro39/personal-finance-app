import { Copy, Loader2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteTransactionConfirmationDialog } from '@/features/transactions/components/dialogs/delete-transaction-confirmation';
import { UpdateTransactionDialog } from '@/features/transactions/components/dialogs/update-transaction';
import type { Transaction } from '@/features/transactions/schema';
import { api } from '@/trpc/react';

type Props = {
  transaction: typeof Transaction.Type;
};

export const Actions = ({ transaction }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  const [openDeleteTransaction, setOpenDeleteTransaction] = useState(false);
  const [openUpdateTransaction, setOpenUpdateTransaction] = useState(false);

  const utils = api.useUtils();
  const { mutate, isPending } = api.transaction.duplicate.useMutation({
    onSuccess: () => {
      utils.transaction.getMany.invalidate();
      toast.success('Transaction duplicated successfully');
      setOpenDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setOpenDialog(false);
    },
  });

  return (
    <>
      <DropdownMenu onOpenChange={setOpenDialog} open={openDialog}>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              mutate({ id: transaction.id });
            }}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Copy />}
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenUpdateTransaction(true)}>
            <Pencil />
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => setOpenDeleteTransaction(true)}
          >
            <Trash2 className="text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTransactionConfirmationDialog
        description={transaction.description}
        id={transaction.id}
        onOpenChange={setOpenDeleteTransaction}
        open={openDeleteTransaction}
      />
      <UpdateTransactionDialog
        onOpenChange={setOpenUpdateTransaction}
        open={openUpdateTransaction}
        transaction={transaction}
      />
    </>
  );
};
