import { createRoute } from '@tanstack/react-router'

import { BaseLayoutRoute } from '@/app/layouts/base/base-layout.route'
import { CleanLayoutRoute } from '@/app/layouts/clean/clean-layout.route'

import { DashboardPanel } from '../components'
import type { DashboardSelection } from '../components'
import { DashboardPage } from '../Page'

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined

/** Дашборд — главная страница. Состояние трёх селектов живёт в URL. */
export const dashboardRoute = createRoute({
  getParentRoute: () => BaseLayoutRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): DashboardSelection => ({
    region: asString(search.region),
    country: asString(search.country),
    city: asString(search.city),
  }),
  component: DashboardRouteComponent,
})

function DashboardRouteComponent() {
  const search = dashboardRoute.useSearch()
  const navigate = dashboardRoute.useNavigate()

  return (
    <DashboardPanel
      value={search}
      onChange={(next) => void navigate({ search: next, replace: true })}
    />
  )
}

/** Тот же дашборд без шапки и без синхронизации с URL — под встраивание в хост. */
export const embeddedDashboardRoute = createRoute({
  getParentRoute: () => CleanLayoutRoute,
  path: '/embed/dashboard',
  component: DashboardPage,
})
