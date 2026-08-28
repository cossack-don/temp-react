import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'

import { caseAdapter } from '../adapters'

/**
 * Единая ошибка приложения: из неё удобно читать status и тело ответа
 * в errorComponent роутера и в onError мутаций.
 */
export class ApiError extends Error {
  readonly status?: number
  readonly data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Сужает unknown до ApiError — нужно в errorComponent и onError, где тип всегда unknown. */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/** Флаг skipCaseTransform: отключён ли разбор для исходящих данных. */
const skipsRequest = (config: AxiosRequestConfig): boolean =>
  config.skipCaseTransform === true || config.skipCaseTransform === 'request'

/** Флаг skipCaseTransform: отключён ли разбор для входящих данных. */
const skipsResponse = (config?: AxiosRequestConfig): boolean =>
  config?.skipCaseTransform === true || config?.skipCaseTransform === 'response'

/** Достаёт message из тела ответа, не веря, что оно вообще объект. */
function extractServerMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return undefined
  }

  // после проверки `in` TypeScript знает про поле message, приведение не нужно
  const { message } = data

  return typeof message === 'string' && message.length > 0 ? message : undefined
}

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status
  const raw = error.response?.data
  const data = skipsResponse(error.config) ? raw : caseAdapter.toClient(raw)

  const serverMessage = extractServerMessage(data)

  if (serverMessage) {
    return new ApiError(serverMessage, status, data)
  }

  if (error.code === 'ECONNABORTED') {
    return new ApiError('Превышено время ожидания ответа сервера', status, data)
  }

  if (!error.response) {
    return new ApiError('Сеть недоступна или сервер не отвечает', status, data)
  }

  return new ApiError(`Ошибка ${status}: ${error.message}`, status, data)
}

/**
 * Навешивает интерсепторы на переданный инстанс.
 * Возвращает функцию отписки — пригодится в тестах и при hot reload,
 * чтобы интерсепторы не навешивались по второму разу.
 */
export const setupInterceptors = (instance: AxiosInstance): (() => void) => {
  const requestId = instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (skipsRequest(config)) {
        return config
      }

      // тело запроса: camelCase → snake_case
      if (config.data !== undefined) {
        config.data = caseAdapter.toServer(config.data)
      }

      // query-параметры тоже: ?page_size=20, а не ?pageSize=20
      if (config.params !== undefined) {
        config.params = caseAdapter.toServer(config.params)
      }

      return config
    },
  )

  const responseId = instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      // ответ сервера: snake_case → camelCase
      if (!skipsResponse(response.config)) {
        response.data = caseAdapter.toClient(response.data)
      }

      return response
    },
    (error: unknown): Promise<never> => {
      // отмену запроса (AbortSignal от TanStack Query) пробрасываем как есть,
      // иначе Query посчитает её обычной ошибкой
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }

      if (axios.isAxiosError(error)) {
        return Promise.reject(toApiError(error))
      }

      return Promise.reject(error)
    },
  )

  return () => {
    instance.interceptors.request.eject(requestId)
    instance.interceptors.response.eject(responseId)
  }
}
