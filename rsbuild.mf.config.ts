import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'

import baseConfig from './rsbuild.config'

/**
 * Конфиг микрофронтенда: приложение выступает remote'ом и отдаёт свои модули
 * хосту через Module Federation 2.0.
 *
 *   npm run dev:mf      → http://localhost:3001 (и remoteEntry.js там же)
 *   npm run build:mf    → dist/ с remoteEntry.js
 *
 * На стороне хоста:
 *   pluginModuleFederation({
 *     name: 'host',
 *     remotes: { temp_r: 'temp_r@http://localhost:3001/mf-manifest.json' },
 *     shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
 *   })
 *
 *   const Dashboard = lazy(() => import('temp_r/Dashboard'))
 */

const PORT = 3001

// Чанки remote'а грузятся хостом с другого origin, поэтому все ссылки
// на ассеты должны быть абсолютными. В проде подставьте реальный адрес
// через PUBLIC_MF_URL.
const ASSET_PREFIX = process.env.PUBLIC_MF_URL ?? `http://localhost:${PORT}`

export default mergeRsbuildConfig(
  baseConfig,
  defineConfig({
    plugins: [
      pluginModuleFederation({
        // имя должно быть валидным JS-идентификатором
        name: 'temp_r',
        filename: 'remoteEntry.js',

        exposes: {
          // панель дашборда не знает про роутер — её можно рендерить где угодно
          './Dashboard': './src/modules/dashboard/index.ts',
          // график целиком: компонент, обёртка над ECharts и палитра
          './Chart': './src/modules/chart/index.ts',
          // http-клиент
          './api': './src/api/core/http.ts',
        },

        shared: {
          // singleton обязателен: два экземпляра React сломают хуки
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
          // общий кэш запросов между хостом и remote'ом
          '@tanstack/react-query': { singleton: true, requiredVersion: false },
          // UI-кит тоже singleton: два экземпляра — это две копии CSS
          // и два независимых контекста CustomProvider (тема и локаль)
          rsuite: { singleton: true, requiredVersion: false },
        },
      }),
    ],

    source: {
      define: {
        'import.meta.env.PUBLIC_APP_MODE': JSON.stringify('mf'),
      },
    },

    html: {
      title: 'temp-r · MF remote',
    },

    server: {
      port: PORT,
      // хост забирает remoteEntry.js кросс-доменно
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },

    dev: {
      assetPrefix: ASSET_PREFIX,
    },

    output: {
      assetPrefix: ASSET_PREFIX,
    },

    tools: {
      rspack: {
        // MF несовместим с вынесением общих чанков
        optimization: {
          splitChunks: false,
        },
      },
    },
  }),
)
