import { effectTsResolver } from '@hookform/resolvers/effect-ts';
import { Number as N, Option } from 'effect';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  type Transaction,
  TransactionInputs,
} from '@/features/transactions/schema';
import { disableFutureDates } from '@/lib/date-time';
import { api } from '@/trpc/react';

type Props = {
  transaction: typeof Transaction.Type;
  onSuccess?: () => void;
};

export function UpdateForm({ transaction, onSuccess }: Props) {
  const form = useForm({
    resolver: effectTsResolver(TransactionInputs.fields.update),
    defaultValues: {
      ...transaction,
      date: new Date(transaction.date),
    },
  });

  const utils = api.useUtils();
  const { mutate, isPending } = api.transaction.update.useMutation({
    onSuccess: () => {
      utils.transaction.getMany.invalidate();
      toast.success('Transaction updated successfully');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: TransactionInputs['update']) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="How much?"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = N.parse(e.target.value).pipe(
                      Option.getOrUndefined
                    );

                    field.onChange(value ?? '');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker {...field} disabled={disableFutureDates} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is recurring?</FormLabel>
              <div className="flex flex-row items-center justify-between rounded-lg border p-2.5 shadow-xs">
                <FormDescription>
                  Enable if this transaction happens periodically.
                </FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <Separator />
        <DialogFooter>
          <DialogClose asChild>
            <Button className="flex-1" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className="flex-1" isLoading={isPending} type="submit">
            Update
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
