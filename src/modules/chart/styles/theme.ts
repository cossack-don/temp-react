import type { AppTheme } from '@/app/theme'

import type { Chrome } from '../types'

/**
 * Оформление графика. Значения совпадают с токенами приложения из app.css —
 * график не должен выглядеть вставкой из другого проекта.
 *
 * Тем две, и палитра для каждой своя: одни и те же цвета не могут быть
 * читаемыми и на белом, и на тёмно-фиолетовом.
 */

/**
 * Цвета серий по порядку. Это слоты проверенной категориальной палитры:
 * первые три проходят все пороги различимости по всем парам сразу,
 * включая дальтонизм, и в светлой теме, и в тёмной.
 *
 * Дальше третьего цвета гарантий по всем парам уже нет — если серий
 * больше трёх, стоит проверить палитру валидатором или свернуть часть
 * серий в «прочее».
 */
export const SERIES_COLORS: Record<AppTheme, readonly string[]> = {
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4'],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181'],
}

/** Оси, сетка, подписи и подложка тултипа. */
const CHROME_BY_THEME: Record<AppTheme, Chrome> = {
  light: {
    surface: '#ffffff',
    textPrimary: '#14142b',
    textSecondary: '#42425c',
    muted: '#6a6a80',
    grid: 'rgba(15, 15, 40, 0.08)',
    axis: 'rgba(15, 15, 40, 0.18)',
    pointer: 'rgba(15, 15, 40, 0.38)',
    border: 'rgba(15, 15, 40, 0.12)',
  },
  dark: {
    surface: '#1b1755',
    textPrimary: '#eceaf8',
    textSecondary: '#c4bfe4',
    muted: '#9a93c7',
    grid: 'rgba(255, 255, 255, 0.07)',
    axis: 'rgba(255, 255, 255, 0.16)',
    pointer: 'rgba(255, 255, 255, 0.34)',
    border: 'rgba(255, 255, 255, 0.12)',
  },
}

export function getChrome(theme: AppTheme): Chrome {
  return CHROME_BY_THEME[theme]
}

export function getSeriesColors(theme: AppTheme): readonly string[] {
  return SERIES_COLORS[theme]
}
