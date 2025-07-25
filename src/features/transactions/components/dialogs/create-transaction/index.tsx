import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseIncomeForm } from '@/features/transactions/components/dialogs/create-transaction/expense-income-form';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateTransactionDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to track your expenses and income.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="expense">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <ExpenseIncomeForm
              onSuccess={() => onOpenChange(false)}
              type="EXPENSE"
            />
          </TabsContent>
          <TabsContent value="income">
            <ExpenseIncomeForm
              onSuccess={() => onOpenChange(false)}
              type="INCOME"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
