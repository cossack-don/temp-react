import express from 'express'
import type { NextFunction, Request, Response } from 'express'

import { HttpError, countPosts, postsRouter } from './posts.ts'

const PORT = Number(process.env.PORT ?? 4000)

/** Откуда фронт ходит на сервер: обычная сборка и микрофронтенд. */
const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:3001']

/** Версия сервиса. В настоящем проекте пришла бы из package.json или сборки. */
const VERSION = '1.0.0'

const app = express()

app.use(express.json())

// CORS вручную, чтобы не тянуть ещё один пакет ради трёх заголовков
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin

  if (typeof origin === 'string' && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // предзапрос браузера
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

/**
 * GET /check-app — проверка, что бэкенд жив, и заодно что он про себя знает.
 * Отдаёт snake_case: на фронте интерсептор приведёт ключи к camelCase.
 */
app.get('/check-app', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: VERSION,
    uptime_seconds: Math.round(process.uptime()),
    posts_count: countPosts(),
    server_time: new Date().toISOString(),
  })
})

app.use('/posts', postsRouter)

// несуществующий путь
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Такого эндпоинта нет' })
})

/**
 * Единый обработчик ошибок. Формат ответа — { message },
 * ровно его читает toApiError на фронте.
 */
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Внутренняя ошибка сервера' })
})

app.listen(PORT, () => {
  console.log(`API слушает http://localhost:${PORT}`)
})
