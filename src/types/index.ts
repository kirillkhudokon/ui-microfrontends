export type PostFiltersData = {
    search: string | null;
    user_id: number | null;
    created_from: string | null;
    created_to: string | null;
    updated_from: string | null;
    updated_to: string | null;
    sort_by: string | null;
    sort_order: string | null;
};

export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string | null;
    updated_at: string | null;
};
