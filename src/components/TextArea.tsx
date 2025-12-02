import '../index.css';
import { FC, TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
    label?: string;
    error?: string;
    required?: boolean;
}

const TextArea: FC<TextAreaProps> = ({ 
    id,
    label,
    value,
    onChange,
    placeholder,
    rows = 5,
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
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={cn(
                    'w-full px-3 py-2.5 border border-gray-300 rounded-md text-base resize-y',
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

export default TextArea;