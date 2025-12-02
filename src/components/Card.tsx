import '../index.css';
import { FC, PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'featured';
    padding?: 'small' | 'normal' | 'large';
    className?: string;
}

const Card: FC<PropsWithChildren<CardProps>> = ({ 
    children, 
    variant = 'default',
    padding = 'normal',
    className,
    ...props 
}) => {
    const paddingClasses = {
        small: 'p-3',
        normal: 'p-5',
        large: 'p-8',
    };

    return (
        <div 
            className={cn(
                'bg-white border border-gray-200 rounded-lg shadow-sm',
                variant === 'featured' && 'border-blue-500 shadow-md',
                paddingClasses[padding],
                className
            )} 
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;