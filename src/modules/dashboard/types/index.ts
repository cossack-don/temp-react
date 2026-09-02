/**
 * Типы модуля дашборда.
 *
 * Файл без единого импорта из самого модуля — поэтому цикла он создать
 * не может, в отличие от обычных барелей.
 */

// ─── Инфраструктура: ДЦ → кластер → сервер ───────────────────────────────────

export interface Server {
  id: string
  label: string
  /** Роль сервера — от неё зависит характер нагрузки в моке. */
  role: 'app' | 'db' | 'cache' | 'storage'
}

export interface Cluster {
  id: string
  label: string
  servers: Server[]
}

export interface DataCenter {
  id: string
  label: string
  clusters: Cluster[]
}

/** Разрешённый каскад: все три уровня согласованы между собой. */
export interface Selection {
  dataCenter: DataCenter
  cluster: Cluster
  server: Server
}

// ─── Метрики ─────────────────────────────────────────────────────────────────

export interface Metric {
  id: 'cpu' | 'ram' | 'hdd'
  label: string
  /** Подпись для карточки — что именно измеряем. */
  caption: string
}

export interface MetricSeries {
  metric: Metric
  /** Значения в процентах по дням выбранного периода. */
  current: number[]
  /** Тот же по длине предыдущий период — для сравнения. */
  previous: number[]
}

// ─── Период ──────────────────────────────────────────────────────────────────

export type PeriodRange = [Date, Date]

export interface PeriodPoints {
  /** Подписи оси X. */
  labels: string[]
  /** Человекочитаемый шаг — «5 минут», «1 час», «1 день». */
  stepLabel: string
}

// ─── Панель ──────────────────────────────────────────────────────────────────

/** Выбор пользователя в «сыром» виде: только идентификаторы, как в URL. */
export interface DashboardSelection {
  dataCenter?: string
  cluster?: string
  server?: string
}

export interface DashboardPanelProps {
  /** Управляемый режим: значение приходит снаружи, например из search-параметров. */
  value?: DashboardSelection
  /** Если не передан, панель держит выбор во внутреннем состоянии. */
  onChange?: (next: DashboardSelection) => void
}
