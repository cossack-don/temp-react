/**
 * Ошибка с кодом ответа. Её ловит обработчик в middleware/error-handler.ts
 * и превращает в { message } с нужным статусом.
 */
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}
