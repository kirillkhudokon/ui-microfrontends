import '../../index.css';
import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { cn } from '../../lib/utils';
import { useTagInputEvents } from './useTagInputEvents';

export interface Tag {
    id?: number;
    name: string;
}

export interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
    onSearch?: (term: string) => void;
    suggestions?: Tag[];
}

const TagInput: FC<TagInputProps> = ({ 
    tags = [], 
    onChange, 
    placeholder = "Введите теги...", 
    className,
    onSearch,
    suggestions = []
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const addTag = (tags: string[], tagName: string) => {
        const trimmedTag = tagName.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onChange([...tags, trimmedTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
        setActiveSuggestion(-1);
    };

    const removeTag = (tags: string[], index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(newTags);
    };

    const eventEmitter = useTagInputEvents({
        addTag,
        setActiveSuggestion,
        removeTag,
        setShowSuggestions
    });

    const debouncedSearch = useMemo(
        () => debounce((term: string) => {
            if (term.trim() === '' || !onSearch) {
                return;
            }
            onSearch(term);
        }, 300),
        []
    );

    useEffect(() => {
        if (inputValue.trim()) {
            debouncedSearch(inputValue);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
        
        return () => {
            debouncedSearch.cancel();
        };
    }, [inputValue, debouncedSearch]);

    useEffect(() => {
        if (suggestions.length > 0 && inputValue.trim()) {
            setShowSuggestions(true);
        }
    }, [suggestions, inputValue]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
        eventEmitter.emit(e.key, { 
            inputValue, 
            activeSuggestion,
            suggestions, 
            tags, 
        });
    };

    const handleSuggestionClick = (suggestion: Tag) => {
        addTag(tags, suggestion.name);
    };

    return (
        <div className={cn('relative', className)}>
            <div className="border border-gray-300 rounded-md p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <div className={cn("flex flex-wrap gap-2", tags?.length > 0 ? "mb-2" : "")}>
                    {tags.map((tag, index) => (
                        <span 
                            key={index} 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            #{tag}
                            <button
                                type="button"
                                className="cursor-pointer ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                onClick={() => removeTag(tags, index)}
                                aria-label={`Удалить тег ${tag}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    placeholder={placeholder}
                    className="w-full border-none outline-none text-base"
                />
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div 
                    ref={suggestionsRef} 
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.id || index}
                            className={cn(
                                'px-4 py-2 cursor-pointer hover:bg-gray-100',
                                index === activeSuggestion && 'bg-blue-100'
                            )}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            #{suggestion.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagInput;