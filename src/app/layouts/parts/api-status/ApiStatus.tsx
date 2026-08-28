import { useQuery } from '@tanstack/react-query'

import { checkAppQueryOptions } from '@/api/check-app'
import styles from './ApiStatus.module.css'

/**
 * Индикатор доступности бэкенда в шапке.
 *
 * Пример обычного useQuery: без loader'а роута, потому что шапка живёт вне
 * дерева страниц, и блокировать переход ради статуса не нужно.
 * Опрос раз в 30 секунд задан в самом checkAppQueryOptions.
 */
export const ApiStatus = () => {
  const { data, isPending, isError } = useQuery(checkAppQueryOptions)

  if (isPending) {
    return (
      <span className={`${styles.status} ${styles.loading}`}>
        <span className={styles.dot} />
        проверяем API
      </span>
    )
  }

  if (isError) {
    return (
      <span
        className={`${styles.status} ${styles.offline}`}
        title="npm run server — поднять локальный бэкенд"
      >
        <span className={styles.dot} />
        API не отвечает
      </span>
    )
  }

  return (
    <span
      className={`${styles.status} ${styles.online}`}
      title={`Версия ${data.version} · постов ${data.postsCount} · аптайм ${data.uptimeSeconds} с`}
    >
      <span className={styles.dot} />
      API v{data.version}
    </span>
  )
}
