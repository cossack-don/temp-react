import { useSyncExternalStore } from 'react'

import { DEFAULT_THEME, getTheme, setTheme, subscribe } from './theme-store'
import type { AppTheme } from './theme-store'

/**
 * Текущая тема приложения и способ её сменить.
 *
 * Хранилище своё, а не контекст: тему читают и компоненты (шапка),
 * и не-React код (опции графика), а провайдер вокруг всего дерева
 * заставлял бы перерисовывать его целиком на каждый чих.
 */
export function useAppTheme(): [AppTheme, (theme: AppTheme) => void] {
  const theme = useSyncExternalStore(subscribe, getTheme, () => DEFAULT_THEME)

  return [theme, setTheme]
}
