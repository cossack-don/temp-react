import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * Отключает преобразование регистра ключей для одного запроса.
     *
     *   true         — не трогать ни тело/параметры запроса, ни ответ
     *   'request'    — не трогать только то, что уходит на сервер
     *   'response'   — не трогать только то, что приходит с сервера
     *
     * Нужно там, где ключи — это данные, а не имена полей: словари,
     * произвольные пользовательские мапы, чужие форматы вроде GeoJSON,
     * а также при работе с legacy-ручками, которые ждут camelCase.
     *
     *   api.get('/settings', { skipCaseTransform: true })
     *   api.post('/legacy', body, { skipCaseTransform: 'request' })
     */
    skipCaseTransform?: boolean | 'request' | 'response'
  }
}
