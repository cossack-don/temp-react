import { isApiError } from '@/api/core/setupInterceptors'
import styles from './BaseErrors.module.css'

interface BaseErrorsProps {
  title?: string
  message?: string
  /** Ошибка как есть: из неё достаём статус и текст сервера. */
  error?: unknown
  /** Если передан, показываем кнопку повтора. */
  onRetry?: () => void
}

/** Читаемая строка из чего угодно, что прилетело в catch. */
const describe = (error: unknown): string | undefined => {
  if (isApiError(error)) {
    return error.status ? `${error.status} · ${error.message}` : error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return undefined
}

export const BaseErrors = ({
  title = 'Что-то пошло не так',
  message = 'Не удалось получить данные. Попробуйте ещё раз.',
  error,
  onRetry,
}: BaseErrorsProps) => {
  const detail = describe(error)

  return (
    <div className={styles.wrapper} role="alert">
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          !
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>

        {detail ? <p className={styles.hint}>{detail}</p> : null}

        {onRetry ? (
          <button type="button" className={styles.button} onClick={onRetry}>
            Повторить
          </button>
        ) : null}
      </div>
    </div>
  )
}
