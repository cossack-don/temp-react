import type { Metric, MetricSeries, Server } from '../types'

/** Три метрики = три цвета. Текущий период — сплошная линия, прошлый — пунктир. */
export const METRICS: Metric[] = [
  { id: 'cpu', label: 'CPU', caption: 'Загрузка процессора' },
  { id: 'ram', label: 'RAM', caption: 'Занято оперативной памяти' },
  { id: 'hdd', label: 'HDD', caption: 'Занято на дисках' },
]

/** Типичный уровень загрузки по роли сервера: база греет диск, кеш — память. */
const BASE_BY_ROLE: Record<Server['role'], Record<Metric['id'], number>> = {
  app: { cpu: 46, ram: 58, hdd: 41 },
  db: { cpu: 38, ram: 72, hdd: 78 },
  cache: { cpu: 22, ram: 84, hdd: 18 },
  storage: { cpu: 17, ram: 44, hdd: 88 },
}

function hashString(value: string): number {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

/** mulberry32 — детерминированный ГПСЧ, чтобы данные не «прыгали» на каждый рендер. */
function createRandom(seed: number): () => number {
  let state = seed

  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let result = Math.imul(state ^ (state >>> 15), 1 | state)
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Данные зависят от сервера и от длины периода — и переключение селектов,
 * и смена дат видны на графике. Ничего не запрашивается, всё считается тут.
 */
export function buildDataset(server: Server, points: number): MetricSeries[] {
  const base = BASE_BY_ROLE[server.role]

  return METRICS.map((metric) => {
    const random = createRandom(hashString(`${server.id}:${metric.id}:${points}`))
    const level = base[metric.id]

    // диск заполняется и почти не освобождается — у него заметный тренд вверх
    const drift = metric.id === 'hdd' ? 0.35 : 0.05

    const current = Array.from({ length: points }, (_, day) =>
      clamp(level + day * drift + (random() - 0.5) * 14),
    )

    const previous = current.map((value) =>
      clamp(value * (0.9 + random() * 0.16) - drift * points),
    )

    return { metric, current, previous }
  })
}

/** Загрузка не бывает меньше нуля и больше ста. */
function clamp(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)) * 10) / 10
}

export function average(values: number[]): number {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((total, value) => total + value, 0) / values.length
}

export function peak(values: number[]): number {
  return values.length === 0 ? 0 : Math.max(...values)
}
