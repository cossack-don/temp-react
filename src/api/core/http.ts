// напрямую из модуля: бочка configs экспортирует ещё и router,
// и через него замыкается цикл api → configs → router → routes → api
import { createInstanseAxios } from '@/app/configs/axios-create'
import type { AxiosRequestConfig } from 'axios'
import { setupInterceptors } from './setupInterceptors'
import type { DataClient } from './types'

setupInterceptors(createInstanseAxios)

// единственное приведение во всём слое: его оправдывает интерсептор выше
const client = createInstanseAxios as unknown as DataClient

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    client.get<T>(url, config).then((response) => response),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    client.post<T>(url, body, config).then((response) => response),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    client.put<T>(url, body, config).then((response) => response),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    client.patch<T>(url, body, config).then((response) => response),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    client.delete<T>(url, config).then((response) => response),
}
