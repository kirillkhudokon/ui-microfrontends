import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';


export function formatDateToLocal(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

interface UseDateRangeFilterReturn {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  reset: () => void;
}

export function useDateRangeFilter(
  initialFrom?: string | null,
  initialTo?: string | null
): UseDateRangeFilterReturn {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (initialFrom || initialTo) {
      return {
        from: initialFrom ? new Date(initialFrom) : undefined,
        to: initialTo ? new Date(initialTo) : undefined,
      };
    }
    return undefined;
  });

  const reset = () => {
    setDateRange(undefined);
  };

  return {
    dateRange,
    setDateRange,
    reset,
  };
}
