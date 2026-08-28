import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/app/router/__root'
import { CleanLayout } from './CleanLayout'

/**
 * Pathless-роут для страниц без шапки: встраивание в хост, логин, ошибки.
 * Сегмент 'clean' в адресе не появляется — /embed/dashboard остаётся
 * ровно таким, как записан в роуте страницы.
 */
export const CleanLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'clean',
  component: CleanLayout,
})
