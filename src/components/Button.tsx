import '../index.css';
import { FC, PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'link' | 'success';
    size?: 'small' | 'normal' | 'large' | 'sm' | 'md';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    className?: string;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ 
    children, 
    variant = 'primary', 
    size = 'normal',
    disabled = false,
    type = 'button',
    onClick,
    className,
    ...props 
}) => {
    const baseClasses = 'inline-block rounded-md border-none cursor-pointer no-underline transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';
    
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:hover:bg-gray-600',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600',
        success: 'bg-green-600 text-white hover:bg-green-700 disabled:hover:bg-green-600',
        link: 'bg-transparent text-blue-600 hover:underline',
    };
    
    const sizeClasses = {
        small: 'px-2.5 py-1.5 text-sm',
        sm: 'px-2.5 py-1.5 text-sm',
        normal: 'px-5 py-2.5 text-base',
        md: 'px-5 py-2.5 text-base',
        large: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button