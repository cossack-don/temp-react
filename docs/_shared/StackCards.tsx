import type { CSSProperties } from 'react'

import { TOOLS } from './stack.data'
import styles from './StackCards.module.css'

/**
 * Карточки стека для документации.
 *
 * Список описан в ./stack.data.ts. Раньше он жил в модуле home приложения
 * и рисовал его главную; модуль удалён, данные переехали сюда.
 */
export function StackCards() {
  return (
    <div className={styles.grid}>
      {TOOLS.map((tool) => (
        <article
          key={tool.name}
          className={styles.card}
          style={{ '--tone': tool.color } as CSSProperties}
        >
          <span className={styles.mark} aria-hidden="true">
            {tool.mark}
          </span>

          <div className={styles.body}>
            <div className={styles.head}>
              <span className={styles.name}>{tool.name}</span>
              <span className={styles.version}>v{tool.version}</span>
            </div>
            <p className={styles.what}>{tool.what}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
