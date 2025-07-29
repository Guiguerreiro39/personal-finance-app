import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Transaction } from '@/features/transactions/schema';
import { UpdateForm } from './update-form';

type Props = {
  transaction: typeof Transaction.Type;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpdateTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Transaction</DialogTitle>
          <DialogDescription>
            Update the details of your transaction.
          </DialogDescription>
        </DialogHeader>
        <UpdateForm
          onSuccess={() => onOpenChange(false)}
          transaction={transaction}
        />
      </DialogContent>
    </Dialog>
  );
}
