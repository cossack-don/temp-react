import { DashboardPanel } from './components'

/**
 * Дашборд без привязки к URL: выбор хранится внутри панели.
 * Используется на /embed/dashboard — там, где страница встраивается
 * в чужое приложение и своего роутера у неё нет.
 */
export const DashboardPage = () => <DashboardPanel />
