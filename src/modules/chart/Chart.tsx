import { useMemo, useState } from 'react'

import { useAppTheme } from '@/app/theme'

import { EChart } from './components/EChart'
import { ChartLegend } from './components/ChartLegend'
import type { ChartProps } from './types'
import { buildChartOption } from './utils/chart-option'

/**
 * График линий. Данные приходят пропсами — модуль не ходит в API сам
 * и ничего не знает про то, откуда взялись числа.
 *
 *   <Chart
 *     series={data.map((row) => ({ id: row.id, label: row.name, values: row.points }))}
 *     labels={data.labels}
 *     unit="%"
 *     label="Загрузка по дням"
 *   />
 *
 * Своё состояние — только скрытые легендой серии: это чисто визуальная
 * настройка, поднимать её наверх незачем.
 */
export function Chart({
  series,
  labels,
  height = 400,
  unit = '',
  max,
  legend = true,
  compareLabels = ['текущий', 'прошлый'],
  label,
}: ChartProps) {
  const [theme] = useAppTheme()
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set<string>())

  const visible = useMemo(
    () => new Set(series.filter((item) => !hidden.has(item.id)).map((item) => item.id)),
    [series, hidden],
  )

  const option = useMemo(
    () => buildChartOption({ series, visible, labels, theme, unit, max, compareLabels }),
    [series, visible, labels, theme, unit, max, compareLabels],
  )

  const toggle = (id: string) => {
    setHidden((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < series.length - 1) {
        // хотя бы одна линия всегда остаётся на графике
        next.add(id)
      }

      return next
    })
  }

  return (
    <>
      {legend ? (
        <ChartLegend
          series={series}
          hidden={hidden}
          onToggle={toggle}
          compareLabels={compareLabels}
        />
      ) : null}

      <EChart option={option} height={height} label={label} />
    </>
  )
}
