/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_IMAGE_URL: string;
  // Add other environment variables you may have here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
