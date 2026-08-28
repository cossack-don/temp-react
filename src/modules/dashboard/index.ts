/**
 * Модуль дашборда. Наружу торчат панель (её же отдаём по Module Federation),
 * страница и роуты.
 */
export { DashboardPanel } from './components'
export type { DashboardPanelProps, DashboardSelection } from './components'
export { DashboardPage } from './Page'
export { dashboardRoute, embeddedDashboardRoute } from './router'
