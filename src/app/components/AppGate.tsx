import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { checkAppQueryOptions } from '@/api/check-app'
import { BaseErrors } from './error/BaseErrors'
import { Loading } from './loading/Loading'

interface AppGateProps {
  children: ReactNode
}

/**
 * Ворота приложения: пока не убедились, что бэкенд отвечает, контент не рисуем.
 *
 *   ждём ответа  → Loading
 *   ошибка       → BaseErrors с кнопкой «Повторить»
 *   200          → children
 *
 * Проверка идёт на data, а не на isError. Тот же запрос переспрашивается раз
 * в 30 секунд, и если сервер упадёт позже, статус станет error — но выкидывать
 * из-за этого уже открытое приложение нельзя. Один раз получили ответ —
 * дальше рисуем контент, а про потерю связи скажет индикатор в шапке.
 */
export const AppGate = ({ children }: AppGateProps) => {
  const { data, isPending, error, refetch } = useQuery(checkAppQueryOptions)

  if (data) return <>{children}</>

  if (isPending) return <Loading text="Проверяем связь с сервером" />

  return (
    <BaseErrors
      title="Бэкенд не отвечает"
      message="Приложение не смогло достучаться до API. Поднимите локальный сервер командой npm run server и повторите."
      error={error}
      onRetry={() => void refetch()}
    />
  )
}
