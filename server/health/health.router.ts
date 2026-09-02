import { Router } from 'express'
import type { Request, Response } from 'express'

import { VERSION } from '../config.ts'

export const healthRouter = Router()

/**
 * GET /check-app — проверка, что бэкенд жив, и заодно что он про себя знает.
 * Отдаёт snake_case: на фронте интерсептор приведёт ключи к camelCase.
 *
 * Приложение гейтится на этой ручке: пока она не ответила 200,
 * AppGate показывает загрузку или экран ошибки.
 */
healthRouter.get('/check-app', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: VERSION,
    uptime_seconds: Math.round(process.uptime()),
    server_time: new Date().toISOString(),
  })
})
