import { TransactionsHeader } from './components/header';
import { TransactionsTable } from './components/table';

export const TransactionsPage = () => {
  return (
    <div>
      <TransactionsHeader />
      <TransactionsTable />
    </div>
  );
};
