import { useMemo, useState } from 'react'

import { EChart } from '../../../components/base/EChart'
import styles from '../Dashboard.module.css'
import { buildChartOption } from '../utils/chart-option'
import { PRODUCTS, buildDataset, sum } from '../static/data'
import { REGIONS, resolveSelection } from '../static/geo'
import { SERIES_COLORS } from '../styles/theme'

export interface DashboardSelection {
  region?: string
  country?: string
  city?: string
}

export interface DashboardPanelProps {
  /** Управляемый режим: значение приходит снаружи, например из search-параметров. */
  value?: DashboardSelection
  /** Если не передан, панель держит выбор во внутреннем состоянии. */
  onChange?: (next: DashboardSelection) => void
}

const numberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

/**
 * Самодостаточная панель дашборда: три связанных селекта, показатели и график.
 * Не знает про роутер — поэтому её можно отдать по Module Federation.
 */
export const DashboardPanel = ({ value, onChange }: DashboardPanelProps) => {
  const [internal, setInternal] = useState<DashboardSelection>({})
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set<string>())

  const current = value ?? internal

  const update = (next: DashboardSelection) => {
    if (onChange) {
      onChange(next)
    } else {
      setInternal(next)
    }
  }

  // каскад: город обязан принадлежать стране, страна — региону
  const selection = resolveSelection(current.region, current.country, current.city)

  const dataset = useMemo(() => buildDataset(selection.city.id), [selection.city.id])

  const visible = useMemo(
    () => new Set(PRODUCTS.filter((product) => !hidden.has(product.id)).map((p) => p.id)),
    [hidden],
  )

  const option = useMemo(() => buildChartOption({ dataset, visible }), [dataset, visible])

  const shown = dataset.filter((item) => visible.has(item.product.id))
  const factTotal = sum(shown.flatMap((item) => item.fact))
  const planTotal = sum(shown.flatMap((item) => item.plan))
  const completion = planTotal === 0 ? 0 : (factTotal / planTotal) * 100
  const isAbovePlan = completion >= 100

  const toggleProduct = (productId: string) => {
    setHidden((currentHidden) => {
      const next = new Set(currentHidden)

      if (next.has(productId)) {
        next.delete(productId)
      } else if (next.size < PRODUCTS.length - 1) {
        // хотя бы одна серия всегда остаётся на графике
        next.add(productId)
      }

      return next
    })
  }

  return (
    <div className={styles.panel}>
      <header className={styles.head}>
        <h1 className={styles.title}>Дашборд продаж</h1>
        <p className={styles.place}>
          {selection.region.label} · {selection.country.label} · {selection.city.label}
        </p>
      </header>

      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>Регион</span>
          <select
            className={styles.select}
            value={selection.region.id}
            onChange={(event) => update({ region: event.target.value })}
          >
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {region.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Страна</span>
          <select
            className={styles.select}
            value={selection.country.id}
            onChange={(event) =>
              update({ region: selection.region.id, country: event.target.value })
            }
          >
            {selection.region.countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Город</span>
          <select
            className={styles.select}
            value={selection.city.id}
            onChange={(event) =>
              update({
                region: selection.region.id,
                country: selection.country.id,
                city: event.target.value,
              })
            }
          >
            {selection.country.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.tiles}>
        <div className={styles.tile}>
          <span className={styles.tileLabel}>Факт за год, млн ₽</span>
          <span className={styles.tileValue}>{numberFormat.format(factTotal)}</span>
        </div>
        <div className={styles.tile}>
          <span className={styles.tileLabel}>План за год, млн ₽</span>
          <span className={styles.tileValue}>{numberFormat.format(planTotal)}</span>
        </div>
        <div className={styles.tile}>
          <span className={styles.tileLabel}>Выполнение плана</span>
          <span
            className={`${styles.tileValue} ${isAbovePlan ? styles.above : styles.below}`}
          >
            {isAbovePlan ? '+' : '−'}
            {Math.abs(completion - 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <section className={styles.chartCard}>
        <div className={styles.legend}>
          {PRODUCTS.map((product, index) => {
            const isHidden = hidden.has(product.id)

            return (
              <button
                key={product.id}
                type="button"
                className={`${styles.legendItem} ${isHidden ? styles.legendItemOff : ''}`}
                aria-pressed={!isHidden}
                onClick={() => toggleProduct(product.id)}
              >
                <span
                  className={styles.swatch}
                  style={{
                    background: isHidden ? 'transparent' : SERIES_COLORS[index],
                    borderColor: SERIES_COLORS[index],
                  }}
                />
                {product.label}
              </button>
            )
          })}

          <span className={styles.legendKey}>
            <span className={`${styles.line} ${styles.lineSolid}`} /> факт
            <span className={`${styles.line} ${styles.lineDashed}`} /> план
          </span>
        </div>

        <EChart
          option={option}
          height={400}
          label={`Выручка по месяцам, ${selection.city.label}: факт и план по пяти продуктам`}
        />

        <p className={styles.hint}>
          Выручка по месяцам, млн ₽. Сплошная линия — факт, пунктир того же цвета — план.
          Клик по продукту в легенде убирает его пару линий с графика.
        </p>
      </section>
    </div>
  )
}
