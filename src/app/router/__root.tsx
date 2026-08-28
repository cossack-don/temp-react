import { Navigate, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
  queryClient: QueryClient
}

/**
 * Корневой роут ничего не рисует сам — только точку вывода и devtools.
 * Оформление выбирают layout-роуты из ./layouts.
 *
 * Экрана 404 в приложении нет: любой ненайденный адрес ведёт на главную.
 * Неизвестные URL перехватывает notFoundRedirectRoute ещё до рендера,
 * а этот обработчик — страховка для notFound(), бросаемого из loader'а роута.
 */
export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootRoute,
  notFoundComponent: () => <Navigate to="/" replace />,
})

function RootRoute() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </>
  )
}
