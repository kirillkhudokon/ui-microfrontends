import { useState } from 'react';

type SortOrder = 'asc' | 'desc';

interface UseSortFilterReturn<T extends string> {
    sortBy: T;
    sortOrder: SortOrder;
    handleSort: (field: T) => void;
    reset: (defaultField: T, defaultOrder?: SortOrder) => void;
}

export function useSortFilter<T extends string>(
    initialField: T,
    initialOrder: SortOrder = 'desc'
): UseSortFilterReturn<T> {
    const [sortBy, setSortBy] = useState<T>(initialField);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);

    const handleSort = (field: T) => {
        const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
        setSortBy(field);
        setSortOrder(newOrder);
    };

    const reset = (defaultField: T, defaultOrder: SortOrder = 'desc') => {
        setSortBy(defaultField);
        setSortOrder(defaultOrder);
    };

    return {
        sortBy,
        sortOrder,
        handleSort,
        reset,
    };
}
