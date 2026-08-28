import { useEffect, useRef } from 'react'

import { echarts } from '../../app/configs/echarts'
import type { EChartsInstance, EChartsOption } from '../../app/configs/echarts'

interface EChartProps {
  option: EChartsOption
  height?: number
  /** Текстовое описание графика для скринридеров. */
  label: string
}

export function EChart({ option, height = 400, label }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsInstance | null>(null)

  // инициализация один раз на жизнь компонента
  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const chart = echarts.init(container, undefined, { renderer: 'canvas' })
    chartRef.current = chart

    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  // notMerge: true — количество серий меняется при переключении легенды
  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true })
  }, [option])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label}
      style={{ width: '100%', height }}
    />
  )
}
