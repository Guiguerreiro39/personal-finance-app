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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
          <TabsList className="w-full">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="income">Change your password here.</TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="flex-1" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className="flex-1" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
