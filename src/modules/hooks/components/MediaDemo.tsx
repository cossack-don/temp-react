import { useMedia } from 'react-use'

import styles from '../Page.module.css'

const CODE = `const isDark = useMedia('(prefers-color-scheme: dark)')
const isWide = useMedia('(min-width: 48rem)')

// подписка на matchMedia уже внутри:
// меняете тему в системе или ширину окна —
// компонент перерисовывается сам`

/**
 * useMedia — media-запрос как булево значение с подпиской.
 * Заменяет наш самописный useColorScheme из src/hooks: там ровно то же самое,
 * только руками через useSyncExternalStore.
 */
export const MediaDemo = () => {
  const isDark = useMedia('(prefers-color-scheme: dark)')
  const isWide = useMedia('(min-width: 48rem)')
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)')

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.name}>useMedia</h2>
        <span className={styles.what}>media-запрос как значение, с подпиской</span>
      </div>

      <div className={styles.split}>
        <div className={styles.demo}>
          <div>
            <div className={styles.label}>тёмная тема в системе</div>
            <div className={styles.value}>{isDark ? 'да' : 'нет'}</div>
          </div>

          <div>
            <div className={styles.label}>окно шире 768px</div>
            <div className={styles.value}>{isWide ? 'да' : 'нет'}</div>
          </div>

          <div>
            <div className={styles.label}>анимации отключены</div>
            <div className={styles.value}>{reduceMotion ? 'да' : 'нет'}</div>
          </div>

          <span className={styles.label}>
            Потяните окно за край — значения обновятся.
          </span>
        </div>

        <pre className={styles.code}>{CODE}</pre>
      </div>
    </article>
  )
}
