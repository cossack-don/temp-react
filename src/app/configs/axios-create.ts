import type { AxiosInstance } from 'axios'
import axios from 'axios'

/**
 * По умолчанию бьём в локальный express из server/ — `npm run server`.
 * Другой адрес задаётся в .env через PUBLIC_API_URL
 * (Rsbuild инлайнит в бандл только переменные с префиксом PUBLIC_).
 */
const DEFAULT_BASE_URL = 'http://localhost:4000'
const baseURL = import.meta.env.PUBLIC_API_URL ?? DEFAULT_BASE_URL

export const API: AxiosInstance = axios.create({
  baseURL,
  timeout: 5_000,
  headers: {
    'Content-Type': 'application/json',
  },
})
