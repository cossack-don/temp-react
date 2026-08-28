/**
 * Каким конфигом Rsbuild собрано приложение.
 * Значение подставляется через source.define на этапе сборки:
 *   rsbuild.config.ts     → 'standalone'
 *   rsbuild.mf.config.ts  → 'mf'
 */
export const APP_MODE = import.meta.env.PUBLIC_APP_MODE

export const IS_MF = APP_MODE === 'mf'

export const APP_MODE_LABEL = IS_MF ? 'MF remote' : 'standalone'
