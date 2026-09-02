import { api } from '@/api/core/http'
import type { RequestOptions } from '@/api/core/types'
import type { ICheckHealth } from '@/api/services'

export const ServiceChechHealth = {
  getInfo: ({ signal }: RequestOptions = {}) => {
    return api.get<ICheckHealth>('/check-app', { signal })
  },
}
