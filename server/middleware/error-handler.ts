import type { NextFunction, Request, Response } from 'express'

import { HttpError } from '../core/http-error.ts'

/**
 * Единый обработчик ошибок. Формат ответа — { message },
 * ровно его читает toApiError на фронте.
 *
 * Четыре аргумента обязательны: по их числу Express отличает
 * обработчик ошибок от обычной middleware. Отсюда и _next,
 * который тут не нужен.
 */
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Внутренняя ошибка сервера' })
}
