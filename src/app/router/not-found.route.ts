import { createRoute, redirect } from '@tanstack/react-router'

import { rootRoute } from './__root'

/**
 * Ловушка для неизвестных адресов: всё, что не совпало ни с одним роутом,
 * уводится на главную.
 *
 * path: '$' — splat, совпадает с любым остатком пути. У splat самый низкий
 * приоритет при сопоставлении, поэтому статические и параметрические роуты
 * разбираются первыми, и этот срабатывает только когда не подошёл никто.
 *
 * Редирект бросается в beforeLoad, то есть до рендера: пользователь не увидит
 * вспышки пустой страницы. replace: true — чтобы кнопка «назад» возвращала
 * туда, откуда пришли, а не на несуществующий адрес по кругу.
 */
export const notFoundRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  beforeLoad: () => {
    throw redirect({ to: '/', replace: true })
  },
})
