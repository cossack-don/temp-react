// напрямую из модуля: бочка configs экспортирует ещё и router,
// и через него замыкается цикл api → configs → router → routes → api
import { API } from '@/app/configs/axios-create'
import type { AxiosRequestConfig } from 'axios'
import { setupInterceptors } from './core/setupInterceptors'

setupInterceptors(API)

/**
 * Тонкая типизированная обёртка: возвращает сразу тело ответа,
 * чтобы queryFn писался в одну строку.
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    API.get<T>(url, config).then((response) => response.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    API.post<T>(url, body, config).then((response) => response.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    API.put<T>(url, body, config).then((response) => response.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    API.patch<T>(url, body, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    API.delete<T>(url, config).then((response) => response.data),
}
