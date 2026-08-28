import { createRoute } from '@tanstack/react-router'

import { BaseLayoutRoute } from '@/app/layouts/base/base-layout.route'
import { HooksPage } from '../Page'

export const hooksRoute = createRoute({
  getParentRoute: () => BaseLayoutRoute,
  path: '/hooks',
  component: HooksPage,
})
