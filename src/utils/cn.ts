/**
 * Значение, которое можно передать в cn.
 * false/null/undefined разрешены специально — под запись
 * `условие && styles.active`, которая иначе не типизируется.
 */
type ClassValue = string | false | null | undefined

/**
 * Склеивает классы, выбрасывая пустые.
 *
 * Нужна из-за CSS Modules: имя класса приходит из объекта styles,
 * и почти всегда его надо соединить с ещё одним — а часть классов
 * условные. Без утилиты это каждый раз шаблонная строка с тернарником,
 * которая при пустой ветке оставляет лишний пробел в атрибуте.
 *
 * Отдельной зависимости (clsx, classnames) ради трёх строк не берём.
 *
 * @example
 * cn(styles.status, styles.online)
 * // 'status_a1b2 online_c3d4'
 *
 * @example
 * cn(styles.item, isHidden && styles.itemOff)
 * // isHidden === false → 'item_a1b2', без хвостового пробела
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
