/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CODEFORCES: string;
  readonly VITE_LEETCODE: string;
  readonly VITE_GFG: string;
  readonly VITE_INTERVIEWBIT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
