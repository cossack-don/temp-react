import { Link } from '@tanstack/react-router'

import { MAIN_NAV } from './nav.config'
import styles from './Nav.module.css'

/**
 * Верхняя навигация. Пункты описаны в nav.config.ts, разметка и стили — здесь.
 * Компонент самодостаточный: его можно поставить не только в шапку.
 */
export const Nav = () => {
  return (
    <nav className={styles.nav}>
      {MAIN_NAV.map((item) => (
        <Link
          key={item.label}
          {...item.link}
          className={styles.link}
          // активная ссылка получает второй класс из того же модуля
          activeProps={{ className: `${styles.link} ${styles.linkActive}` }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
