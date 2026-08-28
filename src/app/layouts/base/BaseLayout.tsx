import { Outlet } from '@tanstack/react-router'

import { Header } from '../parts'
import './BaseLayout.css'

/**
 * Основной лейаут: шапка с навигацией и меткой режима сборки,
 * контент по центру с ограниченной шириной.
 */
export function BaseLayout() {
  return (
    <div className="app">
      <Header />

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
