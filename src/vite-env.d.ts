/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_BASE_URL: string;
  // tambahkan variabel lain di sini jika ada
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
