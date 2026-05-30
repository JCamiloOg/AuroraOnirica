interface ImportMetaEnv {
    readonly VITE_CORS_ORIGIN: string;
    readonly VITE_IMG_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
