import { APP_MODE_LABEL, IS_MF } from '@/build-mode'

export const logApp = () => {
  console.info(
    `%c ${APP_MODE_LABEL} %c ${window.location.origin} `,
    `background:${IS_MF ? '#eb6834' : '#2a78d6'};color:#fff;padding:2px 7px;border-radius:4px 0 0 4px;font-weight:600`,
    'background:#262b36;color:#e6e8ee;padding:2px 7px;border-radius:0 4px 4px 0',
  )
}
