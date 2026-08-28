import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import type { LineSeriesOption } from 'echarts/charts'
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

// подключаем только то, что реально используем — остальное не попадёт в бандл
echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

export type EChartsOption = ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption
>

export type EChartsInstance = echarts.ECharts

export { echarts }
