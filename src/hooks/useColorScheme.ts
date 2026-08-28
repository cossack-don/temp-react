import { useSyncExternalStore } from 'react'

export type ColorScheme = 'light' | 'dark'

const query = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getSnapshot(): ColorScheme {
  return window.matchMedia(query).matches ? 'dark' : 'light'
}

/** Тема ОС. График перерисовывается вслед за ней. */
export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'light')
}
