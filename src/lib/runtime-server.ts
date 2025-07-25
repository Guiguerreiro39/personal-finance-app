import { Layer, ManagedRuntime } from 'effect';
import { TransactionService } from '@/features/transactions/service';

const MainLayer = Layer.mergeAll(TransactionService.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
