import { Footer as RsFooter, Stack, Text } from 'rsuite'

import { CONST_VERSION_APP } from '@/constants'

import styles from './Footer.module.css'

/**
 * Подвал приложения. Container.Footer из кита, содержимое — версия сборки.
 * Версия одна на приложение и лежит в src/constants, чтобы не расходиться
 * с тем, что отдаёт бэкенд в /check-app.
 */
export const Footer = () => {
  return (
    <RsFooter className={styles.footer}>
      <Stack className={styles.inner} justifyContent="space-between" wrap spacing={8}>
        <Text muted size="sm">
          temp-react — учебный шаблон
        </Text>
        <Text muted size="sm">
          Версия {CONST_VERSION_APP}
        </Text>
      </Stack>
    </RsFooter>
  )
}
