import type { NextFunction, Request, Response } from 'express'

import { ALLOWED_ORIGINS } from '../config.ts'

/**
 * CORS вручную, чтобы не тянуть ещё один пакет ради трёх заголовков.
 * Origin эхо-ответом, а не звёздочкой: со звёздочкой браузер не пустит
 * запрос с credentials, если он когда-нибудь понадобится.
 */
export const cors = (req: Request, res: Response, next: NextFunction) => {
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
}
