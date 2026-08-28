import type { CSSProperties } from 'react'

import { TOOLS } from './static'
import styles from './Page.module.css'

export const HomePage = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Что под капотом</h1>
        <p className={styles.subtitle}>
          Десять инструментов, на которых собран проект: сборка, роутинг, данные, графики
          и микрофронтенд. Ниже — что каждый из них здесь делает.
        </p>
      </section>

      <section className={styles.grid}>
        {TOOLS.map((tool) => (
          <article
            key={tool.name}
            className={styles.card}
            // акцент карточки приходит из данных, а не из десяти правил в CSS
            style={{ '--tone': tool.color } as CSSProperties}
          >
            <span className={styles.mark} aria-hidden="true">
              {tool.mark}
            </span>

            <span className={styles.version}>v{tool.version}</span>

            <div className={styles.body}>
              <h2 className={styles.name}>{tool.name}</h2>
              <p className={styles.what}>{tool.what}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
