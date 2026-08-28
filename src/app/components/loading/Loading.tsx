import styles from './Loading.module.css'

interface LoadingProps {
  /** Что именно ждём. Появляется под спиннером. */
  text?: string
}

export const Loading = ({ text = 'Загрузка' }: LoadingProps) => {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.text}>{text}</span>
    </div>
  )
}
