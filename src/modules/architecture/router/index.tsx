import { createRoute } from '@tanstack/react-router'

import { BaseLayoutRoute } from '@/app/layouts/base/base-layout.route'
import { ArchitecturePage } from '../Page'

export const architectureRoute = createRoute({
  getParentRoute: () => BaseLayoutRoute,
  path: '/architecture',
  component: ArchitecturePage,
})
