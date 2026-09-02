import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { AppGate } from './components/AppGate'
import { logApp } from '@/app/utils'
import { initTheme } from './theme'
import { queryClient, router, UiKitProvider } from '@/app/configs'

// порядок важен
import 'rsuite/dist/rsuite-no-reset.min.css' // стили ui-kit внешнего
import './styles/index.css' // мои стили приложения

logApp() // лог и мод фронта - app

// тему ставим до первого рендера, иначе первый кадр будет чужой
initTheme()

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Не найден элемент #root')

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UiKitProvider>
        <AppGate>
          <RouterProvider router={router} />
        </AppGate>
      </UiKitProvider>
    </QueryClientProvider>
  </StrictMode>,
)
