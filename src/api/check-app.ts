import { queryOptions } from '@tanstack/react-query'

import { api } from './http'

/**
 * Ответ GET /check-app.
 *
 * Сервер отдаёт snake_case (`uptime_seconds`, `posts_count`), интерсептор
 * приводит ключи к camelCase — здесь описан уже готовый вид.
 */
export interface AppCheck {
  status: 'ok'
  version: string
  /** Сколько секунд процесс сервера живёт. */
  uptimeSeconds: number
  /** Сколько постов сейчас в памяти сервера. */
  postsCount: number
  /** Время на сервере в ISO. */
  serverTime: string
}

export const checkAppKeys = {
  root: ['check-app'] as const,
}

/**
 * Проверка доступности бэкенда.
 *
 * retry: false — если сервер лежит, незачем три раза долбиться, нам и нужен
 * ответ «не отвечает». refetchInterval держит статус свежим, staleTime равен
 * интервалу, чтобы переходы между страницами не порождали лишних запросов.
 */
export const checkAppQueryOptions = queryOptions({
  queryKey: checkAppKeys.root,
  queryFn: ({ signal }) => api.get<AppCheck>('/check-app', { signal }),
  retry: false,
  staleTime: 30_000,
  refetchInterval: 30_000,
})
