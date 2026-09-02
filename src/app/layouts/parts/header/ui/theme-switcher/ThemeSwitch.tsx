import { Toggle } from 'rsuite'

import { useAppTheme } from '@/app/theme'

/**
 * Переключатель светлой и тёмной темы.
 *
 * Toggle из кита в роли чекбокса: включено — тёмная. Значение живёт
 * в хранилище темы, оно же пишет <html data-theme> и localStorage,
 * поэтому выбор переживает перезагрузку.
 */
export const ThemeSwitch = () => {
  const [theme, setTheme] = useAppTheme()

  return (
    <Toggle
      size="sm"
      checked={theme === 'dark'}
      onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      checkedChildren="☾"
      unCheckedChildren="☀"
      title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      aria-label="Переключить тему"
    />
  )
}
