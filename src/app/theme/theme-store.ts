export type AppTheme = 'light' | 'dark'

/** По умолчанию светлая. Системную тему намеренно не спрашиваем: тема —
 *  осознанный выбор пользователя, а не настройка его ОС. */
export const DEFAULT_THEME: AppTheme = 'light'

const STORAGE_KEY = 'temp-react:theme'

const listeners = new Set<() => void>()

let current: AppTheme = DEFAULT_THEME

function isTheme(value: unknown): value is AppTheme {
  return value === 'light' || value === 'dark'
}

/** Тема пишется в атрибут <html data-theme>, под него написаны токены в app.css. */
function apply(theme: AppTheme) {
  document.documentElement.dataset.theme = theme
}

/** Вызывается один раз до первого рендера — иначе первый кадр будет чужой темы. */
export function initTheme(): AppTheme {
  let stored: string | null = null

  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    // приватный режим или запрет на хранилище — просто остаёмся на умолчании
  }

  current = isTheme(stored) ? stored : DEFAULT_THEME
  apply(current)

  return current
}

export function getTheme(): AppTheme {
  return current
}

export function setTheme(theme: AppTheme) {
  if (theme === current) {
    return
  }

  current = theme
  apply(theme)

  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // не смогли сохранить — тема всё равно применится на эту сессию
  }

  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
