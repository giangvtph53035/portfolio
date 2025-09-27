import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
    const basePlugins = [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ];

    // Only add wayfinder plugin in development (not for Cloudflare build)
    const plugins = command === 'serve' 
        ? [...basePlugins, wayfinder({ formVariants: true })]
        : basePlugins;

    return {
        plugins,
        esbuild: {
            jsx: 'automatic',
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                },
            },
        },
        base: process.env.NODE_ENV === 'production' ? '/' : '/',
    };
});
