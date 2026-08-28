import { DebounceDemo, LocalStorageDemo, MediaDemo } from './components'
import styles from './Page.module.css'

/** Страница /hooks: три хука из react-use, каждый с живым примером и кодом. */
export const HooksPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Хуки из react-use</h1>
      <p className={styles.intro}>
        Три штуки, которые в проекте реально пригождаются. Слева — работающий пример,
        справа — как это пишется.
      </p>

      <div className={styles.list}>
        <DebounceDemo />
        <LocalStorageDemo />
        <MediaDemo />
      </div>
    </div>
  )
}
