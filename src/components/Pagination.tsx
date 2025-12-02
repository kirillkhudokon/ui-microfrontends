import '../index.css';
import { FC } from 'react';
import { cn } from '@/lib/utils';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface PaginationProps {
    links: PaginationLink[];
    LinkComponent?: any; 
}

const Pagination: FC<PaginationProps> = ({ links, LinkComponent }) => {
    const LinkTag = LinkComponent || 'a';
    
    return (
        <div className="flex gap-2 mt-6 justify-center">
            {links.map((link, index) => (
                link.url ? (
                    <LinkTag
                        key={index}
                        href={link.url}
                        className={cn(
                            'px-4 py-2 border rounded-md no-underline transition-colors',
                            link.active 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
};

export default Pagination;
