interface ImportMetaEnv {
  readonly MODE: 'development' | 'production';
  readonly VITE_GMAPS_API_KEY?: string;
  readonly VITE_GAS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css';
