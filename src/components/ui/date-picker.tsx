import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DayPicker } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
} & Omit<
  Extract<React.ComponentProps<typeof DayPicker>, { mode: 'single' }>,
  'mode' | 'onSelect' | 'selected'
>;

export function DatePicker({ value, onChange, ...dayPickerProps }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          data-empty={!value}
          variant="outline"
        >
          <CalendarIcon />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...dayPickerProps}
          mode="single"
          onSelect={onChange}
          required
          selected={value}
        />
      </PopoverContent>
    </Popover>
  );
}
