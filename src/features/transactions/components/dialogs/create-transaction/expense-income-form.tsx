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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { TransactionInputs } from '@/features/transactions/schema';
import { disableFutureDates } from '@/lib/date-time';
import { notReachable } from '@/lib/utils';
import { api } from '@/trpc/react';

type Props = {
  type: 'EXPENSE' | 'INCOME';
  onSuccess?: () => void;
};

export const ExpenseIncomeForm = ({ type, onSuccess }: Props) => {
  const utils = api.useUtils();

  const { mutate, isPending } = api.transaction.create.useMutation({
    onSuccess: () => {
      utils.transaction.getMany.invalidate();

      switch (type) {
        case 'EXPENSE':
          toast.success('Expense created successfully');
          break;
        case 'INCOME':
          toast.success('Income created successfully');
          break;
        default:
          return notReachable(type);
      }

      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    resolver: effectTsResolver(TransactionInputs.fields.create),
    defaultValues: {
      description: '',
      amount: 0,
      type,
      date: new Date(new Date().setHours(0, 0, 0, 0)),
      isRecurring: false,
    },
  });

  const onSubmit = (data: TransactionInputs['create']) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="What is this transaction?"
                  type="text"
                  {...field}
                />
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
                  {...field}
                  onChange={(e) => {
                    const value = N.parse(e.target.value).pipe(
                      Option.getOrUndefined
                    );

                    field.onChange(value ?? '');
                  }}
                  placeholder="How much?"
                  type="number"
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
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
