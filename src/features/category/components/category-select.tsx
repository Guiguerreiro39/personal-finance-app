import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/trpc/react';

type Props = {
  onChange: (value: string) => void;
  defaultValue?: string;
};

export const CategorySelect = ({ onChange, defaultValue }: Props) => {
  const [categories] = api.category.getMany.useSuspenseQuery();

  const defaultCategory = categories.find(
    (category) => category.label === 'Unknown'
  );

  return (
    <Select
      defaultValue={defaultValue || defaultCategory?.id}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
