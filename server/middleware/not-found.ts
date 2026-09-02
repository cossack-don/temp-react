import type { Request, Response } from 'express'

/** Ставится последним: сюда попадает всё, что не совпало ни с одним роутом. */
export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Такого эндпоинта нет' })
}
