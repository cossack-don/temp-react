/**
 * Модуль дашборда. Наружу торчат панель (её же отдаём по Module Federation),
 * страница, роуты и типы.
 */
export { DashboardPanel } from './components'
export { DashboardPage } from './Page'
export { dashboardRoute, embeddedDashboardRoute } from './router'
export type {
  Cluster,
  DashboardPanelProps,
  DashboardSelection,
  DataCenter,
  Metric,
  MetricSeries,
  PeriodPoints,
  PeriodRange,
  Selection,
  Server,
} from './types'
