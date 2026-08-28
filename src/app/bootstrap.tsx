import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { APP_MODE, APP_MODE_LABEL } from './build-mode'
import { AppGate } from './components/AppGate'
import { queryClient, router } from '@/app/configs'
import './styles/index.css'

console.info(
  `%c ${APP_MODE_LABEL} %c ${window.location.origin} `,
  `background:${APP_MODE === 'mf' ? '#eb6834' : '#2a78d6'};color:#fff;padding:2px 7px;border-radius:4px 0 0 4px;font-weight:600`,
  'background:#262b36;color:#e6e8ee;padding:2px 7px;border-radius:0 4px 4px 0',
)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Не найден элемент #root')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* пока /check-app не ответил 200 — показываем загрузку или ошибку */}
      <AppGate>
        <RouterProvider router={router} />
      </AppGate>
    </QueryClientProvider>
  </StrictMode>,
)
