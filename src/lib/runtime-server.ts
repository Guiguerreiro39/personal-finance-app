import { Layer, ManagedRuntime } from 'effect';
import { CategoryService } from '@/features/category/service';
import { TransactionService } from '@/features/transaction/service';

const MainLayer = Layer.mergeAll(
  TransactionService.Default,
  CategoryService.Default
);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
