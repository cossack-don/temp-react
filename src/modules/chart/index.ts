/**
 * Модуль графика — всё, что связано с ECharts, живёт здесь: регистрация
 * нужных частей библиотеки, обёртка над инстансом, палитра, сборка опции
 * и готовый компонент.
 *
 * Наружу — сам Chart и типы данных, которые он ждёт. Плюс низкоуровневый
 * EChart для случаев, когда опцию хочется собрать самому.
 */
export { Chart } from './Chart'
export type { ChartProps, ChartSeries, Chrome } from './types'

export { EChart } from './components/EChart'
export { echarts } from './echarts'
export type { EChartsInstance, EChartsOption } from './echarts'

export { getChrome, getSeriesColors } from './styles/theme'
