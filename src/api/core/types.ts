import type { AxiosRequestConfig } from 'axios'

/**
 * Каким инстанс стал после интерсепторов.
 *
 * Интерсептор ответа возвращает не AxiosResponse, а сразу тело — типы
 * axios об этом знать не могут, они описывают инстанс до всякой настройки.
 * Здесь эта правда записана один раз, поэтому ниже не нужно ни `.data`,
 * ни приведений в каждом методе.
 */

export interface DataClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>
  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
}

/**
 * Общие опции запроса для слоя services.
 *
 * Сюда кладём то, что нужно любому методу независимо от ручки. Пока это
 * только signal: его отдаёт TanStack Query в queryFn, чтобы отменить
 * запрос при уходе со страницы.
 *
 * Сознательно свой тип, а не QueryFunctionContext из @tanstack/react-query:
 * services знают про транспорт и не должны знать про библиотеку состояния.
 * Слой queries выше знает про обе стороны и просто прокидывает signal.
 */
export interface RequestOptions {
  signal?: AbortSignal
}
