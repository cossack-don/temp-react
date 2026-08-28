import { Outlet } from '@tanstack/react-router'

import './CleanLayout.css'

/**
 * Чистый лейаут: только контент, без шапки и навигации.
 *
 * Нужен там, где обвязка приложения мешает:
 *  - страницы под встраивание в хост через Module Federation (/embed/*)
 *  - экраны логина и ошибок
 *
 * В отличие от BaseLayout контент тянется на всю ширину контейнера:
 * ширину задаёт тот, кто встраивает страницу.
 */
export function CleanLayout() {
  return (
    <main className="clean">
      <Outlet />
    </main>
  )
}
