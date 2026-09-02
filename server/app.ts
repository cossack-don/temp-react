import express from 'express'
import type { Express } from 'express'

import { healthRouter } from './health/health.router.ts'
import { cors, errorHandler, notFound } from './middleware/index.ts'

/**
 * Собирает приложение, но не слушает порт — этим занимается index.ts.
 * Разделение нужно, чтобы приложение можно было поднять в тесте
 * без занятого порта и без ожидания listen.
 *
 * Порядок важен: сначала парсеры и CORS, потом роуты, потом 404,
 * и только в самом конце обработчик ошибок — Express выбирает его
 * по числу аргументов и только среди того, что зарегистрировано ниже.
 */
export function createApp(): Express {
  const app = express()

  app.use(express.json())
  app.use(cors)

  app.use(healthRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
