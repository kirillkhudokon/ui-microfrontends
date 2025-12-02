import '../index.css';
import { FC, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    required?: boolean;
}

const Input: FC<InputProps> = ({ 
    id,
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    error,
    required = false,
    className,
    ...props 
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id} className="block mb-2 font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-600">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    'w-full px-3 py-2.5 border border-gray-300 rounded-md text-base',
                    'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <div className="mt-1 text-sm text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Input;