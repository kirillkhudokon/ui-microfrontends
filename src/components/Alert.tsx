import { FC, PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface AlertProps {
    variant?: 'danger'
    type?: 'success' | 'error' | 'warning' | 'info' | 'danger';
    className?: string;
}

const Alert: FC<PropsWithChildren<AlertProps>> = ({ children, type = 'success', className }) => {
    const typeClasses = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        danger: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
    
    return (
        <div className={cn(
            'p-4 mb-4 border rounded-md',
            typeClasses[type],
            className
        )}>
            {children}
        </div>
    );
};

export default Alert;