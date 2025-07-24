import { CreditCard } from 'lucide-react';

type SidebarItem = {
  title: string;
  url: `/${string}`; // this enforces it starts with `/` at compile time
  icon: React.ReactNode;
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: 'Transactions',
    url: '/transactions',
    icon: <CreditCard />,
  },
];
