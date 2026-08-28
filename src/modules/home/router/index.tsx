import { createRoute } from '@tanstack/react-router'

import { BaseLayoutRoute } from '@/app/layouts/base/base-layout.route'
import { HomePage } from '../Page'

/** Главная: '/' внутри лейаута с навигацией. */
export const homeRoute = createRoute({
  getParentRoute: () => BaseLayoutRoute,
  path: '/',
  component: HomePage,
})
