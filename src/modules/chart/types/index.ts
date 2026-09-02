import type { AppTheme } from '@/app/theme'

import type { EChartsOption } from '../echarts'

/**
 * Типы модуля графика.
 *
 * Здесь всё, что пересекает границы файлов: контракт данных, пропсы
 * компонентов, параметры сборщика опции. Файл без единого импорта из
 * самого модуля — поэтому цикла он создать не может, в отличие от
 * обычных барелей.
 */

/**
 * Одна линия на графике.
 *
 * Модуль ничего не знает про то, откуда взялись числа: их одинаково
 * даёт и мок, и ответ API. Задача вызывающего — привести свои данные
 * к этой форме.
 */
export interface ChartSeries {
  /** Уникальный ключ. Используется для легенды и id серий в ECharts. */
  id: string
  /** Подпись в легенде и в тултипе. */
  label: string
  /** Значения по оси X. Длина должна совпадать с labels. */
  values: number[]
  /**
   * Необязательный второй ряд тем же цветом, но пунктиром:
   * прошлый период, план, прогноз — что угодно для сравнения.
   */
  compare?: number[]
}

export interface ChartProps {
  /** Линии. Порядок задаёт цвета: первая серия — первый цвет палитры. */
  series: ChartSeries[]
  /** Подписи оси X. Длина задаёт число точек. */
  labels: string[]
  /** Высота области графика в пикселях. */
  height?: number
  /** Единица измерения на оси Y и в тултипе. */
  unit?: string
  /** Верхняя граница оси Y. Без неё ECharts подбирает сам. */
  max?: number
  /** Показывать легенду с переключением серий. */
  legend?: boolean
  /** Заголовки колонок в тултипе: [основной ряд, ряд сравнения]. */
  compareLabels?: [string, string]
  /** Описание графика для скринридеров. */
  label: string
}

/** Оси, сетка, подписи и подложка тултипа — своё значение на каждую тему. */
export interface Chrome {
  surface: string
  textPrimary: string
  textSecondary: string
  muted: string
  grid: string
  axis: string
  /** линии перекрестия под курсором — заметнее осей, но не спорят с сериями */
  pointer: string
  border: string
}

export interface ChartLegendProps {
  series: ChartSeries[]
  hidden: ReadonlySet<string>
  onToggle: (id: string) => void
  /** Подписи образцов линий. Второй появляется, только если есть ряд сравнения. */
  compareLabels: [string, string]
}

export interface EChartProps {
  /** Готовая опция ECharts. */
  option: EChartsOption
  height?: number
  /** Текстовое описание графика для скринридеров. */
  label: string
}

export interface BuildOptionParams {
  series: ChartSeries[]
  /** id серий, включённых в легенде */
  visible: ReadonlySet<string>
  labels: string[]
  theme: AppTheme
  unit: string
  max?: number
  compareLabels: [string, string]
}
