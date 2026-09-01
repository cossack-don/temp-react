export const MONTHS = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
]

export interface Product {
  id: string
  label: string
}

/** Пять продуктов = пять цветов. Факт — сплошная линия, план — пунктир. */
export const PRODUCTS: Product[] = [
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'retail', label: 'Разовые продажи' },
  { id: 'services', label: 'Услуги' },
  { id: 'partners', label: 'Партнёрка' },
  { id: 'education', label: 'Обучение' },
]

export interface ProductSeries {
  product: Product
  fact: number[]
  plan: number[]
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

/** Данные зависят от выбранного города — переключение селектов видно на графике. */
export function buildDataset(cityId: string): ProductSeries[] {
  return PRODUCTS.map((product, index) => {
    const random = createRandom(hashString(`${cityId}:${product.id}`))
    const base = 40 + random() * 60 + index * 8

    const plan = MONTHS.map((_, month) =>
      round(base * (1 + month * 0.035) * (0.96 + random() * 0.08)),
    )

    const fact = plan.map((value) => round(value * (0.82 + random() * 0.36)))

    return { product, fact, plan }
  })
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}
