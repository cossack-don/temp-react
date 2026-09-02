/**
 * Режим сборки: приложение собрано само по себе или как remote для
 * микрофронтенда. Нужно там, где поведение и вид зависят от режима —
 * метка в шапке, цвет плашки в консоли.
 *
 * Значение подставляет Rsbuild через source.define на этапе сборки:
 *   rsbuild.config.ts     → 'standalone'
 *   rsbuild.mf.config.ts  → 'mf'
 */
export const APP_MODE = import.meta.env.PUBLIC_APP_MODE

export const IS_MF = APP_MODE === 'mf'

export const APP_MODE_LABEL = IS_MF ? 'MF remote' : 'standalone'
