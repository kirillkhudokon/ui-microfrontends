import '../index.css';
import { FC, useRef, useState } from 'react';
import { Input, Button, DateRangeFilter, DateRangeFilterRef } from './';
import { User, PostFiltersData } from '@/types';
import { useSortFilter } from '../hooks/useSortFilter';
import { useFiltersWatch } from '../hooks/useFiltersWatch';

interface PostFiltersProps {
    filters: PostFiltersData;
    users: User[];
    onFiltersChange?: (filters: Record<string, any>) => void;
}

const PostFilters: FC<PostFiltersProps> = ({ filters, users, onFiltersChange }) => {
    const [search, setSearch] = useState(filters.search ?? '');
    const { localFilters, setLocalFilters, debouncedSetLocalFilters } = useFiltersWatch<PostFiltersData>({
        initialFilters: filters,
        onFiltersChange,
    });
    
    const createdDateRef = useRef<DateRangeFilterRef>(null);
    const updatedDateRef = useRef<DateRangeFilterRef>(null);
    
    const sortFilter = useSortFilter<'created_at' | 'updated_at'>(
        filters.sort_by as 'created_at' | 'updated_at',
        filters.sort_order as 'asc' | 'desc'
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSetLocalFilters({ ...localFilters, search: value });
    };

    const handleFilterChange = (key: keyof PostFiltersData, value: string | number | null) => {
        setLocalFilters((prev: PostFiltersData) => ({ ...prev, [key]: value }));
    };

    const handleCreatedDateChange = (from: string | null, to: string | null) => {
        setLocalFilters((prev: PostFiltersData) => ({
            ...prev,
            created_from: from,
            created_to: to,
        }));
    };

    const handleUpdatedDateChange = (from: string | null, to: string | null) => {
        setLocalFilters((prev: PostFiltersData) => ({
            ...prev,
            updated_from: from,
            updated_to: to,
        }));
    };

    const handleSort = (field: 'created_at' | 'updated_at') => {
        sortFilter.handleSort(field);
        const newOrder = sortFilter.sortBy === field && sortFilter.sortOrder === 'desc' ? 'asc' : 'desc';
        
        setLocalFilters((prev: PostFiltersData) => ({ 
            ...prev, 
            sort_by: field, 
            sort_order: newOrder
        }));
    };

    const resetFilters = () => {
        const emptyFilters: PostFiltersData = {
            search: null,
            user_id: null,
            created_from: null,
            created_to: null,
            updated_from: null,
            updated_to: null,
            sort_by: 'created_at',
            sort_order: 'desc',
        };
        
        setLocalFilters(emptyFilters);
        createdDateRef.current?.reset();
        updatedDateRef.current?.reset();
        sortFilter.reset('created_at', 'desc');
        setSearch('');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Фильтры и сортировка</h3>
            </div>

            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Поиск по названию</label>
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value ?? '')}
                            placeholder="Введите название..."
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Автор</label>
                        <select
                            value={localFilters.user_id || ''}
                            onChange={(e) => handleFilterChange('user_id', e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Все авторы</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Период создания</label>
                        <DateRangeFilter
                            ref={createdDateRef}
                            initialFrom={filters.created_from}
                            initialTo={filters.created_to}
                            onChange={handleCreatedDateChange}
                            placeholder="Выберите период"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Период обновления</label>
                        <DateRangeFilter
                            ref={updatedDateRef}
                            initialFrom={filters.updated_from}
                            initialTo={filters.updated_to}
                            onChange={handleUpdatedDateChange}
                            placeholder="Выберите период"
                        />
                    </div>
                </div>

                {/* Сортировка */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <label className="font-medium text-gray-700 mr-2">Сортировка:</label>
                    <Button
                        type="button"
                        size="sm"
                        variant={sortFilter.sortBy === 'created_at' ? 'primary' : 'secondary'}
                        className="mr-2 min-w-[140px]"
                        onClick={() => handleSort('created_at')}
                    >
                        По дате создания {sortFilter.sortBy === 'created_at' && (sortFilter.sortOrder === 'desc' ? '↓' : '↑')}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={sortFilter.sortBy === 'updated_at' ? 'primary' : 'secondary'}
                        className="min-w-[160px]"
                        onClick={() => handleSort('updated_at')}
                    >
                        По дате обновления {sortFilter.sortBy === 'updated_at' && (sortFilter.sortOrder === 'desc' ? '↓' : '↑')}
                    </Button>
                </div>

                <div className="mt-2">
                    <Button type="button" variant="secondary" size="sm" className="px-4" onClick={resetFilters}>
                        Сбросить фильтры
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostFilters;
