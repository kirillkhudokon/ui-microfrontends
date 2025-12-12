import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'ui_microfrontend',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './Input': './src/components/Input',
        './Textarea': './src/components/TextArea',
        './Alert': './src/components/Alert',
        './Card': './src/components/Card',
        './Link': './src/components/Link',
        
        './ui/button': './src/components/ui/button',
        './ui/input': './src/components/ui/input',
        './ui/calendar': './src/components/ui/calendar',
        './ui/popover': './src/components/ui/popover',
        
        './DateRangePicker': './src/components/DateRangePicker',
        './DateRangeFilter': './src/components/DateRangeFilter',
        './TagInput': './src/components/TagInput',
        './Pagination': './src/components/Pagination',
        './PostFilters': './src/components/PostFilters',
        './ImageUpload': './src/components/ImageUpload',        
        './hooks/useDateRangeFilter': './src/hooks/useDateRangeFilter',
        './hooks/useFiltersWatch': './src/hooks/useFiltersWatch',
        './hooks/useSortFilter': './src/hooks/useSortFilter',
        
        './utils': './src/lib/utils',
      },
      styles: './src/index.css',
      shared: {
        react: {
          singleton: true,
          import: false,
        },
        'react-dom': {
          import: false,
        },
        'date-fns': {
          singleton: true,
        },
        'lucide-react': {
          singleton: true,
        },
        'react-day-picker': {
          singleton: true,
        },
      },
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // tailwindcss :(
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'assets/index.css';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5000,
    strictPort: true,
  },
  preview: {
    port: 5000,
    strictPort: true
  }
});
