import { Avatar, Dropdown } from 'rsuite'

import styles from './ProfileMenu.module.css'

const USER_NAME = 'Владимир Пупкин'

/** Инициалы для аватара: «Владимир Пупкин» → «ВП». */
const initials = USER_NAME.split(' ')
  .map((part) => part[0] ?? '')
  .join('')
  .toUpperCase()

/**
 * Кружок профиля в правом углу шапки. Клик раскрывает меню.
 *
 * renderToggle подменяет штатную кнопку Dropdown на Avatar — так кружок
 * остаётся кружком, но сохраняет всю обвязку кита: доступность, закрытие
 * по Escape и клику снаружи, позиционирование.
 */
export const ProfileMenu = () => {
  return (
    <Dropdown
      placement="bottomEnd"
      menuStyle={{ minWidth: 190 }}
      renderToggle={(props, ref) => (
        <Avatar
          {...props}
          ref={ref}
          circle
          size="sm"
          bordered
          className={styles.avatar}
          role="button"
          tabIndex={0}
          aria-label="Меню профиля"
        >
          {initials}
        </Avatar>
      )}
    >
      <Dropdown.Item panel className={styles.panel}>
        <div className={styles.name}>{USER_NAME}</div>
      </Dropdown.Item>

      <Dropdown.Separator />

      <Dropdown.Item eventKey="logout">Выйти</Dropdown.Item>
    </Dropdown>
  )
}
