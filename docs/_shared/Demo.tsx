import type { ReactNode } from 'react'
import styles from './Demo.module.css'

interface DemoProps {
  /** подпись над песочницей */
  title?: string
  /** разметка, которую показываем текстом под песочницей */
  code?: string
  children: ReactNode
}

/**
 * Песочница для .mdx-страниц: сверху живой результат, снизу — разметка.
 * Обычный React-компонент, ничего специфичного для Rspress в нём нет.
 */
export function Demo({ title, code, children }: DemoProps) {
  return (
    <div className={styles.wrap}>
      {title ? <span className={styles.title}>{title}</span> : null}
      <div className={styles.stage}>{children}</div>
      {code ? <pre className={styles.code}>{code.trim()}</pre> : null}
    </div>
  )
}

/** цветной прямоугольник — чтобы в примерах было видно, куда что уехало */
export function Box({ children, alt }: { children: ReactNode; alt?: boolean }) {
  return <div className={`${styles.box} ${alt ? styles.boxAlt : ''}`}>{children}</div>
}
