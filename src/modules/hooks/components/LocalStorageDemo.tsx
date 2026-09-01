import { useLocalStorage } from 'react-use'

import styles from '../Page.module.css'

const CODE = `const [density, setDensity, remove] =
  useLocalStorage<'compact' | 'cozy'>('density', 'cozy')

// значение сразу попадает в localStorage,
// после перезагрузки вернётся то же самое
setDensity('compact')

// убрать ключ и вернуться к начальному значению
remove()`

type Density = 'compact' | 'cozy'

/**
 * useLocalStorage — useState, который переживает перезагрузку.
 * Годится для настроек интерфейса: плотность списка, свёрнутые блоки, черновики.
 */
export const LocalStorageDemo = () => {
  const [density, setDensity, remove] = useLocalStorage<Density>('demo:density', 'cozy')

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.name}>useLocalStorage</h2>
        <span className={styles.what}>состояние, которое переживает перезагрузку</span>
      </div>

      <div className={styles.split}>
        <div className={styles.demo}>
          <div>
            <div className={styles.label}>сохранённое значение</div>
            <div className={styles.value}>{density ?? '—'}</div>
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.button}
              onClick={() => setDensity('cozy')}
            >
              cozy
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setDensity('compact')}
            >
              compact
            </button>
            <button type="button" className={styles.button} onClick={remove}>
              сбросить
            </button>
          </div>

          <span className={styles.label}>Обновите страницу — значение останется.</span>
        </div>

        <pre className={styles.code}>{CODE}</pre>
      </div>
    </article>
  )
}
