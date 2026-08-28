import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/app/router/routes'
// напрямую из модуля, а не через бочку: иначе файл импортирует сам себя
import { queryClient } from './query-client'

export const router = createRouter({
  routeTree,
  // контекст доступен в loader'ах роутов: context.queryClient.ensureQueryData(...)
  context: { queryClient },
  // предзагрузка роута при наведении на <Link>
  defaultPreload: 'intent',
  // кэшированием занимается TanStack Query, роутер свой слой кэша не включает
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

// типобезопасность Link, useParams, useSearch и остального API
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
