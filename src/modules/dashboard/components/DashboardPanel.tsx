import { useMemo, useState } from 'react'
import { DateRangePicker, Heading, Panel, SelectPicker, Stack, Stat, Text } from 'rsuite'

import { Col, Row } from '@/components/grid'
import { Chart } from '@/modules/chart'
import type { ChartSeries } from '@/modules/chart'

import { DATA_CENTERS, resolveSelection } from '../static/infra'
import { METRICS, average, buildDataset, peak } from '../static/metrics'
import { PERIOD_RANGES, defaultPeriod, periodPoints } from '../static/period'
import type { DashboardPanelProps, DashboardSelection, PeriodRange } from '../types'

/** SelectPicker ждёт { label, value } — инфраструктуру храним в своём формате. */
const toOptions = (items: { id: string; label: string }[]) =>
  items.map((item) => ({ label: item.label, value: item.id }))

/**
 * Самодостаточная панель мониторинга: каскад ДЦ → кластер → сервер,
 * период, три показателя и график загрузки CPU / RAM / HDD.
 * Не знает про роутер — поэтому её можно отдать по Module Federation.
 *
 * Раскладка на сетке в 12 колонок (@/components/grid), контролы и карточки —
 * RSuite. Своего CSS осталось немного: цветные маркеры легенды, у кита
 * такого компонента нет.
 */
export const DashboardPanel = ({ value, onChange }: DashboardPanelProps) => {
  const [internal, setInternal] = useState<DashboardSelection>({})
  const [period, setPeriod] = useState<PeriodRange>(defaultPeriod)

  const current = value ?? internal

  const update = (next: DashboardSelection) => {
    if (onChange) {
      onChange(next)
    } else {
      setInternal(next)
    }
  }

  // каскад: сервер обязан принадлежать кластеру, кластер — дата-центру
  const selection = resolveSelection(current.dataCenter, current.cluster, current.server)

  const { labels, stepLabel } = useMemo(() => periodPoints(period), [period])

  const dataset = useMemo(
    () => buildDataset(selection.server, labels.length),
    [selection.server, labels.length],
  )

  // приведение к форме, которую ждёт модуль графика.
  // Ровно то же место, где данные из API легли бы вместо мока.
  const chartSeries = useMemo<ChartSeries[]>(
    () =>
      dataset.map((item) => ({
        id: item.metric.id,
        label: item.metric.label,
        values: item.current,
        compare: item.previous,
      })),
    [dataset],
  )

  return (
    <Stack direction="column" alignItems="stretch" spacing={20}>
      <Stack justifyContent="space-between" alignItems="flex-end" wrap spacing={12}>
        <Heading level={1}>Загрузка серверов</Heading>
        <Text muted>
          {selection.dataCenter.label} · {selection.cluster.label} ·{' '}
          {selection.server.label}
        </Text>
      </Stack>

      {/* каскад: по четыре колонки из двенадцати, на телефоне — во всю ширину */}
      <Row gutter={16}>
        <Col span={{ xs: 12, md: 4 }}>
          <SelectPicker
            block
            cleanable={false}
            label="Дата-центр"
            data={toOptions(DATA_CENTERS)}
            value={selection.dataCenter.id}
            onChange={(next) => update({ dataCenter: next ?? undefined })}
          />
        </Col>

        <Col span={{ xs: 12, md: 4 }}>
          <SelectPicker
            block
            cleanable={false}
            label="Кластер"
            data={toOptions(selection.dataCenter.clusters)}
            value={selection.cluster.id}
            onChange={(next) =>
              update({ dataCenter: selection.dataCenter.id, cluster: next ?? undefined })
            }
          />
        </Col>

        <Col span={{ xs: 12, md: 4 }}>
          <SelectPicker
            block
            cleanable={false}
            label="Сервер"
            data={toOptions(selection.cluster.servers)}
            value={selection.server.id}
            onChange={(next) =>
              update({
                dataCenter: selection.dataCenter.id,
                cluster: selection.cluster.id,
                server: next ?? undefined,
              })
            }
          />
        </Col>
      </Row>

      {/* период: календарь с часами и быстрыми вариантами внутри,
          рядом подпись о том, с каким шагом легли точки */}
      <Stack wrap spacing={12} alignItems="center">
        <DateRangePicker
          cleanable={false}
          label="Период"
          // время в формате включает панель выбора часов и минут,
          // и оно же показывается в самом поле
          format="dd.MM.yy HH:mm"
          character=" – "
          style={{ width: 390 }}
          ranges={PERIOD_RANGES}
          value={period}
          onChange={(next) => {
            if (next?.[0] && next[1]) {
              setPeriod([next[0], next[1]])
            }
          }}
        />

        <Text muted size="sm">
          {labels.length} точек · шаг {stepLabel}
        </Text>
      </Stack>

      {/* показатели: по одному на метрику, четыре колонки из двенадцати */}
      <Row gutter={16}>
        {METRICS.map((metric) => {
          const series = dataset.find((item) => item.metric.id === metric.id)
          const now = average(series?.current ?? [])
          const before = average(series?.previous ?? [])
          const delta = now - before
          const isUp = delta >= 0

          return (
            <Col key={metric.id} span={{ xs: 12, md: 4 }}>
              <Stat bordered>
                <Stat.Label>
                  {metric.label} · {metric.caption}
                </Stat.Label>
                <Stat.Value>
                  {now.toFixed(1)}
                  <Stat.ValueUnit>%</Stat.ValueUnit>
                </Stat.Value>
                <Stat.Trend indicator={isUp ? 'up' : 'down'}>
                  {isUp ? '+' : '−'}
                  {Math.abs(delta).toFixed(1)} п.п. · пик {peak(series?.current ?? [])}%
                </Stat.Trend>
              </Stat>
            </Col>
          )
        })}
      </Row>

      {/* график занимает все двенадцать колонок */}
      <Row>
        <Col span={12}>
          <Panel bordered>
            <Chart
              series={chartSeries}
              labels={labels}
              unit="%"
              max={100}
              compareLabels={['период', 'прошлый']}
              label={`Загрузка ${selection.server.label}: CPU, RAM и HDD, текущий и прошлый период`}
            />

            <Text muted size="sm">
              Загрузка в процентах. Шаг по оси подбирается под длину периода: минуты за
              час, часы за сутки, дни за неделю и дольше. Сплошная линия — выбранный
              период, пунктир того же цвета — предыдущий такой же длины. Клик по метрике в
              легенде убирает её пару линий с графика.
            </Text>
          </Panel>
        </Col>
      </Row>
    </Stack>
  )
}
