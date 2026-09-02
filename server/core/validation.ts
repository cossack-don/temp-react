import { HttpError } from './http-error.ts'

/**
 * Проверки тела запроса — общие, без привязки к конкретной сущности.
 * Сейчас ни одна ручка их не зовёт: единственный эндпоинт /check-app
 * ничего не принимает. Останутся заготовкой под следующий роут.
 */

/**
 * Непустая строка. required решает, падать ли на отсутствующем поле:
 * PUT требует все поля, PATCH — только те, что пришли.
 */
export const asString = (
  value: unknown,
  field: string,
  required: boolean,
): string | undefined => {
  if (value === undefined) {
    if (required) {
      throw new HttpError(400, `Поле "${field}" обязательно`)
    }
    return undefined
  }

  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `Поле "${field}" должно быть непустой строкой`)
  }

  return value
}

/** Целое число или ошибка 400. */
export const asInteger = (value: unknown, field: string): number | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new HttpError(400, `Поле "${field}" должно быть целым числом`)
  }

  return value
}

/** Тело запроса должно быть объектом, иначе разбирать нечего. */
export const asObject = (body: unknown): Record<string, unknown> => {
  if (typeof body !== 'object' || body === null) {
    throw new HttpError(400, 'Ожидался JSON-объект')
  }

  return body as Record<string, unknown>
}
