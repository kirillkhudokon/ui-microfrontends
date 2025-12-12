import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value?: string | null;
    onChange: (file: File | null) => void;
    onDelete?: () => void;
    label?: string;
    error?: string;
    maxSize?: number;
    accept?: string;
    disabled?: boolean;
    className?: string;
}

export default function ImageUpload({
    value,
    onChange,
    onDelete,
    label = 'Изображение',
    error,
    maxSize = 5,
    accept = 'image/*',
    disabled = false,
    className = '',
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!file.type.startsWith('image/')) {
            return 'Пожалуйста, выберите изображение';
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            return `Размер файла не должен превышать ${maxSize}MB`;
        }

        return null;
    };

    const handleFile = (file: File) => {
        const error = validateFile(file);
        if (error) {
            setUploadError(error);
            return;
        }

        setUploadError(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        onChange(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setUploadError(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onDelete) {
            onDelete();
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-foreground">
                    {label}
                </label>
            )}

            <div
                className={`
                    relative border-2 border-dashed rounded-lg transition-colors
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
                    ${error || uploadError ? 'border-destructive' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    disabled={disabled}
                    className="hidden"
                />

                {preview ? (
                    <div className="relative group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick();
                                }}
                                disabled={disabled}
                                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Upload className="w-4 h-4 inline mr-2" />
                                Изменить
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                disabled={disabled}
                                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors"
                            >
                                <X className="w-4 h-4 inline mr-2" />
                                Удалить
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                            Перетащите изображение сюда или
                        </p>
                        <button
                            type="button"
                            className="text-sm text-primary hover:underline font-medium"
                            disabled={disabled}
                        >
                            выберите файл
                        </button>
                        <p className="text-xs text-muted-foreground mt-2">
                            До {maxSize}MB, PNG, JPG, GIF, WEBP
                        </p>
                    </div>
                )}
            </div>

            {(error || uploadError) && (
                <p className="text-sm text-destructive mt-1">
                    {error || uploadError}
                </p>
            )}
        </div>
    );
}
