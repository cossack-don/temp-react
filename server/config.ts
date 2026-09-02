/** Порт локального API. Меняется переменной окружения PORT. */
export const PORT = Number(process.env.PORT ?? 4000)

/** Версия сервиса. В настоящем проекте пришла бы из package.json или сборки. */
export const VERSION = '1.0.0'

/** Откуда фронт ходит на сервер: обычная сборка и микрофронтенд. */
export const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:3001']
