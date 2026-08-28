import type { LinkProps } from '@tanstack/react-router'

export interface NavItem {
  label: string
  /** Пропсы <Link>: to, search, params, activeOptions — всё типобезопасно. */
  link: LinkProps
}

/** Пункты верхней навигации BaseLayout. Порядок = порядок в шапке. */
export const MAIN_NAV: NavItem[] = [
  {
    label: 'Главная',
    link: { to: '/', activeOptions: { exact: true } },
  },
  {
    label: 'Посты',
    link: { to: '/posts', search: { q: '' } },
  },
  {
    label: 'Дашборд',
    link: { to: '/dashboard' },
  },
  {
    label: 'Хуки',
    link: { to: '/hooks' },
  },
  {
    label: 'Архитектура',
    link: { to: '/architecture' },
  },
]
