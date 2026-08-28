import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

/**
 * Адаптер регистра ключей — граница между форматом сервера и форматом фронта.
 *
 * Сервер говорит в snake_case, приложение — в camelCase. Адаптер переводит
 * данные в обе стороны, поэтому в коде приложения snake_case не встречается
 * вообще, а бэкенд не знает про camelCase.
 *
 * Сама конвертация — camelcase-keys и snakecase-keys. Здесь только настройка
 * и защита от того, что в них лучше не отдавать.
 *
 * Подключается в интерсепторах: src/api/core/setupInterceptors.ts
 */

/**
 * Ключи, которые нельзя трогать ни в одну сторону.
 * Сюда попадают поля, где имя — это данные, а не название свойства.
 *
 * Принимает строки и регулярные выражения:
 *   ['access_token', /^utm_/]
 */
const PRESERVED_KEYS: Array<string | RegExp> = []

/**
 * Ветки, в которые не нужно спускаться при разборе ответа.
 * Путь в точечной нотации, без индексов массива: 'meta.rawPayload'.
 * Всё, что внутри такой ветки, остаётся как пришло.
 */
const STOP_PATHS: string[] = []

/** То, что вообще имеет смысл конвертировать. */
type Convertible = Record<string, unknown> | readonly unknown[]

/**
 * Литеральные объекты и массивы — да. FormData, Blob, File, ArrayBuffer,
 * URLSearchParams, стримы и экземпляры классов — нет: у них ключи не данные,
 * а внутреннее устройство.
 *
 * Вложенные Date, Map, Set, Blob и типизированные массивы отсекает уже сам
 * map-obj внутри библиотек, здесь важен верхний уровень: тело запроса
 * целиком может быть FormData.
 */
const isConvertible = (value: unknown): value is Convertible => {
  if (Array.isArray(value)) {
    return true
  }

  if (typeof value !== 'object' || value === null) {
    return false
  }

  const proto: unknown = Object.getPrototypeOf(value)

  return proto === Object.prototype || proto === null
}

/**
 * Формат сервера → формат приложения: snake_case → camelCase.
 * deep: true обязателен — по умолчанию camelcase-keys обрабатывает только
 * верхний уровень и не заходит во вложенные объекты и массивы.
 */
export const keysToCamel = (value: unknown): unknown => {
  if (!isConvertible(value)) {
    return value
  }

  return camelcaseKeys(value as Record<string, unknown>, {
    deep: true,
    exclude: PRESERVED_KEYS,
    stopPaths: STOP_PATHS,
  })
}

/**
 * Формат приложения → формат сервера: camelCase → snake_case.
 * Применяется и к телу запроса, и к query-параметрам.
 * У snakecase-keys deep включён по умолчанию, но указан явно —
 * чтобы поведение не зависело от смены дефолта в мажорной версии.
 */
export const keysToSnake = (value: unknown): unknown => {
  if (!isConvertible(value)) {
    return value
  }

  return snakecaseKeys(value as Record<string, unknown>, {
    deep: true,
    exclude: PRESERVED_KEYS,
  })
}

/**
 * Адаптер целиком. Названия по направлению, а не по регистру: на месте
 * вызова важно, куда едут данные, а не как это называется в snake/camel.
 */
export const caseAdapter = {
  /** Наружу, на сервер: camelCase → snake_case */
  toServer: keysToSnake,
  /** Внутрь, в приложение: snake_case → camelCase */
  toClient: keysToCamel,
} as const
