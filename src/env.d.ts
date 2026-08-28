/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  /** Базовый URL API. Задаётся в .env, см. .env.example */
  readonly PUBLIC_API_URL?: string
  /**
   * Каким конфигом собрано приложение:
   *   'standalone' — rsbuild.config.ts    (npm run dev)
   *   'mf'         — rsbuild.mf.config.ts (npm run dev:mf)
   */
  readonly PUBLIC_APP_MODE: 'standalone' | 'mf'
}
