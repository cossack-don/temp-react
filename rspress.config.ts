import path from 'node:path'
import { defineConfig } from '@rspress/core'

/**
 * Конфиг сайта документации.
 * Отдельный от приложения: свой dev-сервер, свой бандл.
 * Доки НЕ попадают в бандл приложения — это важно, потому что приложение
 * ещё и раздаётся как remote по Module Federation.
 *
 *   npm run docs:dev      → http://localhost:3100
 *   npm run docs:build    → docs_build/
 *   npm run docs:preview
 */
export default defineConfig({
  // корень с .md / .mdx
  root: 'docs',
  outDir: 'docs_build',

  lang: 'ru',
  title: 'temp-react',
  description: 'Документация проекта: стек, структура, CSS-утилиты',

  // всё, что начинается с "_", не превращается в страницу.
  // _shared/ — компоненты и стили для .mdx, а не маршруты.
  route: {
    exclude: ['**/_shared/**'],
  },

  // глобальный CSS сайта доков: сюда подключены сгенерированные утилиты,
  // чтобы живые примеры в .mdx выглядели так же, как в приложении.
  globalStyles: path.join(__dirname, 'docs/_shared/global.css'),

  builderConfig: {
    resolve: {
      alias: {
        // можно импортировать реальные компоненты приложения в .mdx
        '@': path.join(__dirname, 'src'),
      },
    },
    server: {
      port: 3100,
    },
  },

  // язык интерфейса. У Rspress 2 русская локаль встроена:
  // «Оглавление», «Предыдущая страница», «Поиск» и прочее переводить не нужно.
  themeConfig: {
    lastUpdated: true,
    enableScrollToTop: true,
    footer: {
      message: 'temp-react — учебный шаблон. Rsbuild · TanStack · ECharts',
    },
  },
})
