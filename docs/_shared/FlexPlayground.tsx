import { useState } from 'react'
import { Box } from './Demo'
import styles from './Demo.module.css'

const DIRECTION = ['cost-flex-row', 'cost-flex-col', 'cost-flex-row-reverse'] as const
const JUSTIFY = [
  'cost-justify-start',
  'cost-justify-center',
  'cost-justify-end',
  'cost-justify-between',
  'cost-justify-around',
  'cost-justify-evenly',
] as const
const ALIGN = [
  'cost-items-start',
  'cost-items-center',
  'cost-items-end',
  'cost-items-stretch',
] as const

/**
 * Живой пример: три селекта собирают строку классов из настоящего
 * src/app/styles/utils/flex.css. Никаких копий классов внутри компонента —
 * если перегенерировать CSS с другим префиксом, здесь надо будет
 * поправить только эти три массива.
 */
export function FlexPlayground() {
  const [direction, setDirection] = useState<string>(DIRECTION[0])
  const [justify, setJustify] = useState<string>(JUSTIFY[1])
  const [align, setAlign] = useState<string>(ALIGN[1])

  const className = `cost-flex ${direction} ${justify} ${align} cost-gap-4`

  return (
    <div className={styles.wrap}>
      <span className={styles.title}>
        Живой пример — классы применяются по-настоящему
      </span>

      <div className={styles.stage}>
        <div className={className} style={{ minHeight: 160 }}>
          <Box>1</Box>
          <Box alt>2</Box>
          <Box>3</Box>
        </div>
      </div>

      <div className={styles.controls}>
        <label className={styles.control}>
          направление
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            {DIRECTION.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.control}>
          главная ось
          <select value={justify} onChange={(e) => setJustify(e.target.value)}>
            {JUSTIFY.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.control}>
          поперечная ось
          <select value={align} onChange={(e) => setAlign(e.target.value)}>
            {ALIGN.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <pre className={styles.code}>{`<div class="${className}">`}</pre>
    </div>
  )
}
