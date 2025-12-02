import '../index.css';
import { FC, AnchorHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: 'default' | 'button';
}

const Link: FC<PropsWithChildren<LinkProps>> = ({ 
    children, 
    href, 
    variant = 'default',
    className,
    ...props 
}) => {
    const variantClasses = {
        default: 'text-blue-600 no-underline hover:underline',
        button: 'text-white bg-blue-600 hover:bg-blue-700 no-underline px-5 py-2.5 rounded-md inline-block transition-colors duration-200',
    };

    return (
        <a
            href={href}
            className={cn(variantClasses[variant], className)}
            {...props}
        >
            {children}
        </a>
    );
};

export default Link;