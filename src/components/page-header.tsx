'use client';

import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  action: {
    label: string;
    onClick: () => void;
  };
};

export const PageHeader = ({ title, action }: Props) => {
  return (
    <header className="flex items-center justify-between gap-4">
      <h1 className="font-medium text-xl">{title}</h1>
      <Button onClick={action.onClick} type="button">
        {action.label}
      </Button>
    </header>
  );
};
