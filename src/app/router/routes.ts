import { rootRoute } from './__root'
import { notFoundRedirectRoute } from './not-found.route'
import { BaseLayoutRoute } from '@/app/layouts/base/base-layout.route'
import { CleanLayoutRoute } from '@/app/layouts/clean/clean-layout.route'

import { dashboardRoute, embeddedDashboardRoute } from '@/modules/dashboard'

/**
 * Дерево роутов — единственное место, где сходятся лейауты и модули.
 * Роут страницы сам знает своего родителя, здесь описан только состав.
 *
 *   base  → оболочка приложения: шапка, навигация, контейнер по центру
 *   clean → без шапки, во всю ширину: под встраивание в хост
 *
 * Всё, что не совпало ни с одним роутом, ловит notFoundRedirectRoute
 * и уводит на главную.
 */
export const routeTree = rootRoute.addChildren([
  BaseLayoutRoute.addChildren([dashboardRoute]),

  CleanLayoutRoute.addChildren([embeddedDashboardRoute]),

  // последним: неизвестный адрес уводится на главную (это дашборд)
  notFoundRedirectRoute,
])
