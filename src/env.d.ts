/// <reference types="astro/client" />

declare module '*.css';

declare namespace astroHTML.JSX {
    interface LinkHTMLAttributes {
        fetchPriority?: 'high' | 'low' | 'auto';
    }
}
