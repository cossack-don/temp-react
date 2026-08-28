import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/app/router/__root'
// компонент импортируется напрямую, а не через бочку layouts —
// иначе получается цикл: бочка → роут → бочка
import { BaseLayout } from './BaseLayout'

/**
 * Pathless-роут: у него есть id, но нет path, поэтому сегмент 'base'
 * в адресе не появляется и главная остаётся на '/'.
 * Всё, что подключено к нему, рендерится внутри BaseLayout.
 */
export const BaseLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'base',
  component: BaseLayout,
})
