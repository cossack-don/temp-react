import type { EChartsOption } from '../echarts'
import { getChrome, getSeriesColors } from '../styles/theme'
import type { BuildOptionParams } from '../types'

interface TooltipItem {
  seriesId?: string
  seriesName?: string
  value?: number
  color?: string
  axisValueLabel?: string
}

/** Собирает опцию ECharts. Чистая функция: те же аргументы — тот же результат. */
export function buildChartOption({
  series,
  visible,
  labels,
  theme,
  unit,
  max,
  compareLabels,
}: BuildOptionParams): EChartsOption {
  const ink = getChrome(theme)
  const colors = getSeriesColors(theme)

  const shown = series.filter((item) => visible.has(item.id))
  const colorOf = (id: string) =>
    colors[series.findIndex((item) => item.id === id) % colors.length] ?? colors[0]!

  return {
    backgroundColor: 'transparent',
    animationDuration: 320,
    grid: { left: 4, right: 16, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: ink.surface,
      borderColor: ink.border,
      borderWidth: 1,
      padding: [10, 12],
      textStyle: { color: ink.textPrimary, fontSize: 12 },
      // перекрестие: вертикаль по точке и горизонталь по значению,
      // на каждой оси — подпись с текущим значением
      axisPointer: {
        type: 'cross',
        crossStyle: { color: ink.pointer, width: 1, type: 'dashed' },
        lineStyle: { color: ink.pointer, width: 1 },
        label: {
          backgroundColor: ink.surface,
          borderColor: ink.border,
          borderWidth: 1,
          color: ink.textPrimary,
          fontSize: 11,
          padding: [4, 7],
          precision: 1,
        },
      },
      formatter: (raw: unknown) =>
        renderTooltip(raw as TooltipItem[], ink.textSecondary, unit, compareLabels),
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: ink.axis } },
      axisTick: { show: false },
      axisLabel: { color: ink.muted, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: ink.muted, fontSize: 11, formatter: `{value}${unit}` },
      splitLine: { lineStyle: { color: ink.grid, width: 1 } },
    },
    series: shown.flatMap((item) => {
      const color = colorOf(item.id)

      const main = {
        id: `main:${item.id}`,
        name: item.label,
        type: 'line' as const,
        data: item.values,
        showSymbol: false,
        symbolSize: 8,
        lineStyle: { width: 2, color },
        itemStyle: { color },
        emphasis: { focus: 'series' as const },
        z: 3,
      }

      if (!item.compare) {
        return [main]
      }

      // ряд сравнения — тот же цвет, пунктир
      return [
        main,
        {
          id: `compare:${item.id}`,
          name: `${item.label} · ${compareLabels[1]}`,
          type: 'line' as const,
          data: item.compare,
          showSymbol: false,
          symbolSize: 8,
          lineStyle: { width: 2, color, type: 'dashed' as const },
          itemStyle: { color },
          emphasis: { focus: 'series' as const },
          z: 2,
        },
      ]
    }),
  }
}

function renderTooltip(
  items: TooltipItem[],
  mutedColor: string,
  unit: string,
  compareLabels: [string, string],
): string {
  if (items.length === 0) {
    return ''
  }

  const grouped = new Map<
    string,
    { name: string; color: string; main?: number; compare?: number }
  >()

  let hasCompare = false

  for (const item of items) {
    const [kind, id] = (item.seriesId ?? '').split(':')

    if (!id) {
      continue
    }

    const entry = grouped.get(id) ?? {
      name: (item.seriesName ?? '').replace(` · ${compareLabels[1]}`, ''),
      color: item.color ?? mutedColor,
    }

    if (kind === 'main') {
      entry.main = item.value
    } else {
      entry.compare = item.value
      hasCompare = true
    }

    grouped.set(id, entry)
  }

  const format = (value?: number) =>
    value === undefined ? '—' : `${value.toFixed(1)}${unit}`

  const rows = [...grouped.values()]
    .map(
      (entry) => `
        <tr>
          <td style="padding:2px 10px 2px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${entry.color};margin-right:6px"></span>${entry.name}
          </td>
          <td style="padding:2px 0 2px 8px;text-align:right;font-variant-numeric:tabular-nums">${format(entry.main)}</td>
          ${hasCompare ? `<td style="padding:2px 0 2px 12px;text-align:right;font-variant-numeric:tabular-nums;color:${mutedColor}">${format(entry.compare)}</td>` : ''}
        </tr>`,
    )
    .join('')

  return `
    <div style="font-weight:600;margin-bottom:6px">${items[0]?.axisValueLabel ?? ''}</div>
    <table style="border-collapse:collapse;font-size:12px">
      <tr style="color:${mutedColor}">
        <th style="text-align:left;font-weight:400;padding-bottom:4px"></th>
        <th style="text-align:right;font-weight:400;padding:0 0 4px 8px">${compareLabels[0]}</th>
        ${hasCompare ? `<th style="text-align:right;font-weight:400;padding:0 0 4px 12px">${compareLabels[1]}</th>` : ''}
      </tr>
      ${rows}
    </table>`
}
