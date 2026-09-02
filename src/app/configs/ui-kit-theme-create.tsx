import { CustomProvider } from 'rsuite'
import ruRU from 'rsuite/locales/ru_RU'

import { useAppTheme } from '@/app/theme/useAppTheme'

import type { ReactNode } from 'react'

/**
 * Настройка UI-кита RSuite. Ставится один раз, вокруг всего приложения.
 *
 * theme берём из хранилища темы приложения: CustomProvider вешает на <html>
 * класс .rs-theme-dark, а наш собственный код — атрибут data-theme. Оба
 * переключаются вместе, поэтому токены кита и токены приложения не разъезжаются.
 *
 * locale переводит то, что компоненты рисуют сами: месяцы в календаре,
 * «Ничего не найдено» в селектах, кнопки в пагинации. Без него они
 * останутся английскими даже на русской странице.
 */
export function UiKitProvider({ children }: { children: ReactNode }) {
  const [theme] = useAppTheme()

  return (
    <CustomProvider theme={theme} locale={ruRU}>
      {children}
    </CustomProvider>
  )
}
