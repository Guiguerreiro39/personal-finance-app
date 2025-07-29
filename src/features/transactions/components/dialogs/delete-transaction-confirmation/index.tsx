import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TransactionId } from '@/features/transactions/schema';
import { api } from '@/trpc/react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: TransactionId;
  description: string;
};

export function DeleteTransactionConfirmationDialog({
  open,
  onOpenChange,
  id,
  description,
}: Props) {
  const utils = api.useUtils();
  const { mutate, isPending } = api.transaction.delete.useMutation({
    onSuccess: () => {
      toast.success('Transaction deleted successfully');
      utils.transaction.getMany.invalidate();
      onOpenChange(false);
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{description}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="flex-1" variant="outline">
              Go back
            </Button>
          </DialogClose>
          <Button
            className="flex-1"
            isLoading={isPending}
            onClick={() => mutate({ id })}
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
