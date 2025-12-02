import { useState, useMemo, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

interface UseFiltersOptions<T> {
    initialFilters: T;
    debounceMs?: number;
    debounceFields?: (keyof T)[];
    onFiltersChange?: (filters: Record<string, any>) => void;
}

interface UseFiltersReturn<T> {
    localFilters: T;
    setLocalFilters: React.Dispatch<React.SetStateAction<T>>;
    debouncedSetLocalFilters: (newFilters: T) => void
}

export function useFiltersWatch<T extends Record<string, any>>({
    initialFilters,
    onFiltersChange,
}: UseFiltersOptions<T>): UseFiltersReturn<T> {
    const [localFilters, setLocalFilters] = useState<T>(initialFilters);
    const isFirstRender = useRef(true);

    const getCleanedFilters = (filters: T) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        );
    };

    const applyFilters = (newFilters: T) => {
        const cleanFilters = getCleanedFilters(newFilters);
        
        if (onFiltersChange) {
            onFiltersChange(cleanFilters);
        } 
    };

    const debouncedSetLocalFilters = useMemo(
        () => debounce(applyFilters, 500),
        [onFiltersChange]
    );


    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        
        applyFilters(localFilters);
        return () => {
            debouncedSetLocalFilters.cancel();
        };
    }, [localFilters]);

    return {
        localFilters,
        setLocalFilters,
        debouncedSetLocalFilters
    };
}
