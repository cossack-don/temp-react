import { useState } from 'react'
import { useDebounce } from 'react-use'

import styles from '../Page.module.css'

const CODE = `const [query, setQuery] = useState('')
const [applied, setApplied] = useState('')

// колбэк сработает через 500 мс после
// последнего изменения query
useDebounce(() => setApplied(query), 500, [query])`

/**
 * useDebounce откладывает не значение, а вызов: колбэк выполняется,
 * когда deps перестали меняться на заданное время.
 * Типичное применение — не дёргать поиск на каждое нажатие.
 */
export const DebounceDemo = () => {
  const [query, setQuery] = useState('')
  const [applied, setApplied] = useState('')

  const [isReady] = useDebounce(() => setApplied(query), 500, [query])

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.name}>useDebounce</h2>
        <span className={styles.what}>отложить вызов, пока пользователь печатает</span>
      </div>

      <div className={styles.split}>
        <div className={styles.demo}>
          <input
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Печатайте здесь…"
            aria-label="Строка запроса"
          />

          <div>
            <div className={styles.label}>значение через 500 мс</div>
            <div className={styles.value}>{applied || '—'}</div>
          </div>

          <span className={isReady() === false ? styles.pending : styles.ready}>
            {isReady() === false ? 'ждём паузу…' : 'применено'}
          </span>
        </div>

        <pre className={styles.code}>{CODE}</pre>
      </div>
    </article>
  )
}
