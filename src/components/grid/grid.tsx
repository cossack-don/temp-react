import { Col as RsCol } from 'rsuite'

import type { ColProps as RsColProps } from 'rsuite'

// Row и Grid ничего не пересчитывают — отдаём их как есть,
// чтобы не терять типы и prop `as`
export { Grid, Row } from 'rsuite'
export type { GridProps, RowProps } from 'rsuite'

/**
 * Сетка проекта — 12 колонок.
 *
 * У RSuite сетка на 24 колонки, и число это зашито в сгенерированные классы
 * (.rs-col-xs-1 … .rs-col-xs-24) — переменной, которой её можно было бы
 * переключить, в пакете нет. Поэтому обёртка: наружу отдаём 12 колонок,
 * внутрь передаём то же число, умноженное на 2. Деления без остатка нет
 * ни в одном случае — 12 ложится на 24 ровно.
 *
 * Всё остальное (gutter, отзывчивые значения, offset/push/pull) достаётся
 * от RSuite как есть.
 *
 * @example
 * <Row gutter={16}>
 *   <Col span={4}>треть</Col>
 *   <Col span={{ xs: 12, md: 8 }}>на телефоне вся ширина, на десктопе две трети</Col>
 * </Row>
 */
export const COLUMNS = 12

const RSUITE_COLUMNS = 24
const SCALE = RSUITE_COLUMNS / COLUMNS

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
type Responsive<T> = Partial<Record<Breakpoint, T>>

type SpanValue = number | 'auto'

const scaleOne = <T extends SpanValue>(value: T): T =>
  (typeof value === 'number' ? value * SCALE : value) as T

function scale<T extends SpanValue>(
  value: T | Responsive<T> | undefined,
): T | Responsive<T> | undefined {
  if (value === undefined || typeof value === 'number' || value === 'auto') {
    return value === undefined ? undefined : scaleOne(value as T)
  }

  // объект брейкпоинтов: масштабируем каждое значение
  const entries = Object.entries(value) as [Breakpoint, T][]

  return Object.fromEntries(
    entries.map(([breakpoint, item]) => [breakpoint, scaleOne(item)]),
  ) as Responsive<T>
}

export interface ColProps extends Omit<RsColProps, 'span' | 'offset' | 'push' | 'pull'> {
  /** Ширина в колонках: 1…12. 'auto' — по содержимому. */
  span?: SpanValue | Responsive<SpanValue>
  /** Отступ слева в колонках. */
  offset?: number | Responsive<number>
  push?: number | Responsive<number>
  pull?: number | Responsive<number>
}

export function Col({ span, offset, push, pull, ...rest }: ColProps) {
  return (
    <RsCol
      {...rest}
      span={scale(span)}
      offset={scale(offset)}
      push={scale(push)}
      pull={scale(pull)}
    />
  )
}
