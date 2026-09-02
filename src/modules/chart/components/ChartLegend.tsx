import { Button, Stack } from 'rsuite'

import { useAppTheme } from '@/app/theme'

import { getSeriesColors } from '../styles/theme'
import type { ChartLegendProps } from '../types'
import styles from './ChartLegend.module.css'

/**
 * Легенда графика: кнопки-переключатели серий.
 * Кнопки из кита, цветной маркер и образцы линий свои.
 */
export function ChartLegend({
  series,
  hidden,
  onToggle,
  compareLabels,
}: ChartLegendProps) {
  const [theme] = useAppTheme()
  const colors = getSeriesColors(theme)

  const hasCompare = series.some((item) => item.compare)

  return (
    <Stack wrap spacing={8}>
      {series.map((item, index) => {
        const isHidden = hidden.has(item.id)
        const color = colors[index % colors.length]

        return (
          <Button
            key={item.id}
            size="xs"
            appearance={isHidden ? 'ghost' : 'default'}
            aria-pressed={!isHidden}
            onClick={() => onToggle(item.id)}
          >
            <span
              className={styles.swatch}
              style={{
                background: isHidden ? 'transparent' : color,
                borderColor: color,
              }}
            />
            {item.label}
          </Button>
        )
      })}

      {hasCompare ? (
        <Stack spacing={6} className={styles.key}>
          <span className={`${styles.line} ${styles.lineSolid}`} /> {compareLabels[0]}
          <span className={`${styles.line} ${styles.lineDashed}`} /> {compareLabels[1]}
        </Stack>
      ) : null}
    </Stack>
  )
}
