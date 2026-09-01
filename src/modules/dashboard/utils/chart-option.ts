import type { EChartsOption } from '../../../app/configs/echarts'
import type { ProductSeries } from '../static/data'
import { MONTHS } from '../static/data'
import { CHROME, SERIES_COLORS } from '../styles/theme'

interface TooltipItem {
  seriesId?: string
  seriesName?: string
  value?: number
  color?: string
  axisValueLabel?: string
}

interface BuildOptionParams {
  dataset: ProductSeries[]
  /** id продуктов, включённых в легенде */
  visible: ReadonlySet<string>
}

export function buildChartOption({ dataset, visible }: BuildOptionParams): EChartsOption {
  const ink = CHROME
  const colors = SERIES_COLORS

  const shown = dataset.filter((item) => visible.has(item.product.id))
  const colorOf = (productId: string) =>
    colors[dataset.findIndex((item) => item.product.id === productId)] ?? colors[0]!

  return {
    backgroundColor: 'transparent',
    animationDuration: 320,
    grid: {
      left: 4,
      // справа место под подписи линий: самая длинная — «Разовые продажи»
      right: 150,
      top: 16,
      bottom: 8,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: ink.surface,
      borderColor: ink.border,
      borderWidth: 1,
      padding: [10, 12],
      textStyle: { color: ink.textPrimary, fontSize: 12 },
      // перекрестие: вертикаль по месяцу и горизонталь по значению,
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
          // один знак после запятой на оси значений; на оси месяцев не влияет
          precision: 1,
        },
      },
      formatter: (raw: unknown) => renderTooltip(raw as TooltipItem[], ink.textSecondary),
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: MONTHS,
      axisLine: { lineStyle: { color: ink.axis } },
      axisTick: { show: false },
      axisLabel: { color: ink.muted, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: ink.muted, fontSize: 11, formatter: '{value}' },
      splitLine: { lineStyle: { color: ink.grid, width: 1 } },
    },
    series: shown.flatMap((item) => {
      const color = colorOf(item.product.id)

      return [
        // факт — сплошная линия + подпись у правого края (прямая маркировка)
        {
          id: `fact:${item.product.id}`,
          name: item.product.label,
          type: 'line' as const,
          data: item.fact,
          showSymbol: false,
          symbolSize: 8,
          lineStyle: { width: 2, color },
          itemStyle: { color },
          emphasis: { focus: 'series' as const },
          endLabel: {
            show: true,
            formatter: item.product.label,
            color: ink.textSecondary,
            fontSize: 11,
            distance: 8,
          },
          z: 3,
        },
        // план — тот же цвет, пунктир
        {
          id: `plan:${item.product.id}`,
          name: `${item.product.label} · план`,
          type: 'line' as const,
          data: item.plan,
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

function renderTooltip(items: TooltipItem[], mutedColor: string): string {
  if (items.length === 0) {
    return ''
  }

  const grouped = new Map<
    string,
    { name: string; color: string; fact?: number; plan?: number }
  >()

  for (const item of items) {
    const [kind, productId] = (item.seriesId ?? '').split(':')

    if (!productId) {
      continue
    }

    const entry = grouped.get(productId) ?? {
      name: (item.seriesName ?? '').replace(' · план', ''),
      color: item.color ?? mutedColor,
    }

    if (kind === 'fact') {
      entry.fact = item.value
    } else {
      entry.plan = item.value
    }

    grouped.set(productId, entry)
  }

  const rows = [...grouped.values()]
    .map(
      (entry) => `
        <tr>
          <td style="padding:2px 10px 2px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${entry.color};margin-right:6px"></span>${entry.name}
          </td>
          <td style="padding:2px 0 2px 8px;text-align:right;font-variant-numeric:tabular-nums">${format(entry.fact)}</td>
          <td style="padding:2px 0 2px 12px;text-align:right;font-variant-numeric:tabular-nums;color:${mutedColor}">${format(entry.plan)}</td>
        </tr>`,
    )
    .join('')

  return `
    <div style="font-weight:600;margin-bottom:6px">${items[0]?.axisValueLabel ?? ''}</div>
    <table style="border-collapse:collapse;font-size:12px">
      <tr style="color:${mutedColor}">
        <th style="text-align:left;font-weight:400;padding-bottom:4px"></th>
        <th style="text-align:right;font-weight:400;padding:0 0 4px 8px">факт</th>
        <th style="text-align:right;font-weight:400;padding:0 0 4px 12px">план</th>
      </tr>
      ${rows}
    </table>`
}

function format(value?: number): string {
  return value === undefined ? '—' : value.toFixed(1)
}
