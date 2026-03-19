/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_API_URL: string;
    readonly VITE_PORTONE_STORE_ID: string;
    readonly VITE_PORTONE_CHANNEL_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
