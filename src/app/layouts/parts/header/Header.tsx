import { Link } from '@tanstack/react-router'

import { APP_MODE, APP_MODE_LABEL } from '../../../build-mode'
import { ApiStatus } from '../api-status'
import { Nav } from '../nav'
import styles from './Header.module.css'

/**
 * Шапка приложения: знак, название, метка режима сборки и навигация.
 * Разметку и стили меню держит Nav — шапка только ставит его на место.
 *
 * Шапка липкая и полупрозрачная с размытием, поэтому контент под ней
 * виден, но не мешает читать навигацию.
 */
export const Header = () => {
  const isMf = APP_MODE === 'mf'

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            t
          </span>

          <Link to="/" className={styles.logo}>
            temp-react
          </Link>

          <span
            className={`${styles.badge} ${isMf ? styles.badgeMf : styles.badgeStandalone}`}
            title={`Собрано конфигом ${APP_MODE}`}
          >
            {APP_MODE_LABEL} · :{window.location.port || '80'}
          </span>
        </div>

        <div className={styles.right}>
          <ApiStatus />
          <Nav />
        </div>
      </div>
    </header>
  )
}
