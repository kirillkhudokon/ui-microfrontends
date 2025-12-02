import '../index.css';
import { forwardRef, useImperativeHandle } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from './DateRangePicker';
import { useDateRangeFilter, formatDateToLocal } from '@/hooks/useDateRangeFilter';

interface DateRangeFilterProps {
    initialFrom?: string | null;
    initialTo?: string | null;
    placeholder?: string;
    onChange?: (from: string | null, to: string | null) => void;
}

export interface DateRangeFilterRef {
    reset: () => void;
}

export const DateRangeFilter = forwardRef<DateRangeFilterRef, DateRangeFilterProps>(
    ({ initialFrom, initialTo, placeholder, onChange }, ref) => {
        const { dateRange, setDateRange, reset } = useDateRangeFilter(initialFrom, initialTo);

        useImperativeHandle(ref, () => ({
            reset,
        }));

        const handleChange = (range: DateRange | undefined) => {
            setDateRange(range);
            
            const from = range?.from ? formatDateToLocal(range.from) : null;
            const to = range?.to ? formatDateToLocal(range.to) : null;
            
            onChange?.(from, to);
        };

        return (
            <DateRangePicker
                value={dateRange}
                onChange={handleChange}
                placeholder={placeholder}
            />
        );
    }
);

DateRangeFilter.displayName = 'DateRangeFilter';
