import type { PeriodPoints, PeriodRange } from '../types'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const startOfDay = (date: Date): Date => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const endOfDay = (date: Date): Date => {
  const copy = new Date(date)
  copy.setHours(23, 59, 59, 999)
  return copy
}

const lastMs = (span: number): PeriodRange => {
  const to = new Date()
  return [new Date(to.getTime() - span), to]
}

/**
 * Быстрые варианты внутри календаря.
 *
 * placement: 'left' ставит их отдельной колонкой слева от сетки дней —
 * так они видны сразу при открытии, а не спрятаны узкой полоской внизу.
 * closeOverlay закрывает поповер сразу после клика: выбор однозначный,
 * дожимать «Применить» незачем.
 */
export const PERIOD_RANGES = [
  {
    label: 'Последний час',
    value: () => lastMs(HOUR),
    placement: 'left' as const,
    closeOverlay: true,
  },
  {
    label: 'Последние 24 часа',
    value: () => lastMs(DAY),
    placement: 'left' as const,
    closeOverlay: true,
  },
  {
    label: 'Сегодня',
    value: () => [startOfDay(new Date()), new Date()] as PeriodRange,
    placement: 'left' as const,
    closeOverlay: true,
  },
  {
    label: 'Вчера',
    value: () => {
      const yesterday = new Date(Date.now() - DAY)
      return [startOfDay(yesterday), endOfDay(yesterday)] as PeriodRange
    },
    placement: 'left' as const,
    closeOverlay: true,
  },
  {
    label: 'Последние 7 дней',
    value: () => lastMs(7 * DAY),
    placement: 'left' as const,
    closeOverlay: true,
  },
  {
    label: 'Последние 30 дней',
    value: () => lastMs(30 * DAY),
    placement: 'left' as const,
    closeOverlay: true,
  },
]

/** Период по умолчанию — последние сутки. */
export function defaultPeriod(): PeriodRange {
  return lastMs(DAY)
}

/** Больше 60 точек на линии всё равно не читается. */
const MAX_POINTS = 60

/**
 * Лестница шагов. Берём первый, при котором точек станет не больше MAX_POINTS,
 * — так и час, и год ложатся на один и тот же график без ручных настроек.
 */
const STEPS = [5 * MINUTE, 15 * MINUTE, HOUR, 3 * HOUR, 6 * HOUR, 12 * HOUR, DAY, 7 * DAY]

const timeLabel = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dayLabel = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })
/** Точки графика. Шаг подбирается под длину периода. */
export function periodPoints([from, to]: PeriodRange): PeriodPoints {
  const span = Math.max(MINUTE, to.getTime() - from.getTime())
  const step = STEPS.find((item) => span / item <= MAX_POINTS) ?? STEPS[STEPS.length - 1]!
  const points = Math.max(2, Math.min(MAX_POINTS, Math.round(span / step) + 1))

  // внутри суток подписываем время, на больших периодах — даты
  const format = step < DAY ? timeLabel : dayLabel

  const labels = Array.from({ length: points }, (_, index) =>
    format.format(new Date(from.getTime() + index * step)),
  )

  return { labels, stepLabel: formatStep(step) }
}

function formatStep(step: number): string {
  if (step < HOUR) {
    return `${step / MINUTE} мин`
  }

  if (step < DAY) {
    const hours = step / HOUR
    return `${hours} ${plural(hours, 'час', 'часа', 'часов')}`
  }

  const days = step / DAY
  return `${days} ${plural(days, 'день', 'дня', 'дней')}`
}

/** Русские числительные: 1 час, 3 часа, 5 часов. */
function plural(value: number, one: string, few: string, many: string): string {
  const mod100 = value % 100

  if (mod100 >= 11 && mod100 <= 14) {
    return many
  }

  const mod10 = value % 10

  if (mod10 === 1) {
    return one
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return few
  }

  return many
}
