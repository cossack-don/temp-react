import { Link } from '@tanstack/react-router'
import { Header as RsHeader, Navbar, Stack, Tag } from 'rsuite'

import { APP_MODE, APP_MODE_LABEL, IS_MF } from '@/build-mode'
import { ProfileMenu } from './ui/profile'
import { ThemeSwitch } from './ui/theme-switcher'
import styles from './Header.module.css'

/**
 * Шапка приложения на Container.Header + Navbar из кита.
 *
 * Справа: переключатель темы и кружок профиля.
 * Пунктов меню нет — в приложении одна страница, и ссылка на неё же
 * из шапки только мешала.
 *
 * Липкость и полупрозрачность — своим CSS-модулем: у Navbar такого режима
 * нет, а без него контент уезжает под шапку без предупреждения.
 * Цвет метки режима сборки тоже свой: у Tag фиксированная палитра,
 * а нам нужны токены --mode-standalone / --mode-mf.
 */
export const Header = () => {
  return (
    <RsHeader className={styles.header}>
      <Navbar appearance="subtle" className={styles.navbar}>
        <Navbar.Brand as={Link} to="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            t
          </span>
          temp-react
        </Navbar.Brand>

        <Tag
          size="sm"
          className={IS_MF ? styles.tagMf : styles.tagStandalone}
          title={`Собрано конфигом ${APP_MODE}`}
        >
          {APP_MODE_LABEL} · :{window.location.port || '80'}
        </Tag>

        <Stack className={styles.right} spacing={12}>
          <ThemeSwitch />
          <ProfileMenu />
        </Stack>
      </Navbar>
    </RsHeader>
  )
}
