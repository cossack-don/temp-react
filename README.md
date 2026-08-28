# temp-r

React 18 + TanStack Router (file-based) + TanStack Query + axios + ECharts + Rsbuild,
всё на TypeScript.

React закреплён на 18.x (`^18.3.1`) осознанно. Ничего из React 19 в коде не
используется — только `createRoot`, `StrictMode`, `useEffect/useRef/useMemo/useState`
и `useSyncExternalStore` (все есть в 18.0+). TanStack Router и Query официально
поддерживают 18: их peerDependencies — `>=18.0.0` и `^18 || ^19`.
Чтобы перейти на 19, достаточно поднять `react`, `react-dom`, `@types/react`,
`@types/react-dom` — правок в коде не потребуется.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
```

Другие скрипты:

```bash
npm run build      # прод-сборка в dist/
npm run preview    # локальный просмотр прод-сборки
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run lint:fix   # eslint . --fix
npm run format     # prettier --write .
```

## Локальный API (server/)

Простой express-сервис без базы: данные живут в массиве в памяти, перезапустили —
вернулись к сидам. Нужен, чтобы фронт было на чём гонять, не завися от внешнего
jsonplaceholder.

```bash
npm run server            # http://localhost:4000, с --watch
npm run typecheck:server  # tsc по server/
```

Запускается без сборки — `node --experimental-strip-types server/index.ts`
снимает типы на лету, поэтому отдельного шага компиляции нет.

| метод | путь | что делает |
|---|---|---|
| `GET` | `/posts?limit=10&q=текст` | список, фильтр по заголовку |
| `GET` | `/posts/:id` | один пост, 404 если нет |
| `POST` | `/posts` | создание, 201 + заголовок `Location` |
| `PUT` | `/posts/:id` | полная замена, `title` и `body` обязательны |
| `PATCH` | `/posts/:id` | частичное обновление |
| `DELETE` | `/posts/:id` | удаление, 204 без тела |
| `GET` | `/check-app` | статус сервиса: версия, аптайм, число постов |

**Сервер отвечает в snake_case** — `user_id`, `created_at`. Это не случайность:
так `caseAdapter` из `src/api/adapters` делает видимую работу, и в компонентах
поля приходят уже как `userId` и `createdAt`.

Ошибки отдаются как `{ "message": "..." }` — ровно этот формат читает
`toApiError`, поэтому `ApiError.message` на фронте содержит текст от сервера.

Чтобы фронт ходил сюда, а не на jsonplaceholder, положите рядом с
`.env.example` файл `.env`:

```
PUBLIC_API_URL=http://localhost:4000
```

CORS открыт для `localhost:3000` и `localhost:3001` — обычная сборка и
микрофронтенд.

## Два конфига Rsbuild

| Файл | Для чего | Скрипты |
|---|---|---|
| `rsbuild.config.ts` | обычная разработка, standalone-приложение, порт 3000 | `dev`, `build`, `preview` |
| `rsbuild.mf.config.ts` | микрофронтенд: remote на Module Federation 2.0, порт 3001 | `dev:mf`, `build:mf`, `preview:mf` |

Второй конфиг импортирует первый и накладывается поверх через `mergeRsbuildConfig`
(объекты сливаются рекурсивно, массивы конкатенируются), поэтому правки в базовом
конфиге автоматически попадают в MF-сборку — дублировать `pluginReact` и плагин
роутера не нужно.

### Как отличить режимы на глаз

Обе сборки поднимают одно и то же приложение, поэтому режим подсвечен явно:

| | `npm run dev` | `npm run dev:mf` |
|---|---|---|
| порт | 3000 | 3001 |
| заголовок вкладки | `temp-r` | `temp-r · MF remote` |
| бейдж в шапке | синий `standalone · :3000` | оранжевый `MF remote · :3001` |
| баннер в консоли | синий `standalone` | оранжевый `MF remote` |
| `remoteEntry.js` | нет | `http://localhost:3001/remoteEntry.js` |

Значение приходит из `source.define` — в базовом конфиге
`import.meta.env.PUBLIC_APP_MODE = 'standalone'`, в MF-конфиге оно перекрывается
на `'mf'`. В коде доступно через `src/app/build-mode.ts`:

```ts
import { IS_MF, APP_MODE_LABEL } from './app/build-mode'
```

Флаг статический, поэтому ветки под неиспользуемый режим вырезаются из бандла
на этапе сборки.

### Что отдаёт remote

```
./Dashboard   src/features/dashboard/dashboard-panel.tsx   панель дашборда без роутера
./EChart      src/components/e-chart.tsx                   обёртка над ECharts
./api         src/api/index.ts                             axios-клиент и queryOptions
```

`DashboardPanel` специально не знает про TanStack Router: в контролируемом режиме
выбор приходит пропсами (`value` / `onChange`), без них панель держит состояние
внутри. Роут `/dashboard` — тонкая обёртка, которая связывает панель с
search-параметрами; хост может рендерить её как есть.

### Подключение на стороне хоста

```ts
pluginModuleFederation({
  name: 'host',
  remotes: {
    temp_r: 'temp_r@http://localhost:3001/mf-manifest.json',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

```tsx
const Dashboard = lazy(() => import('temp_r/Dashboard'))
```

### Почему в MF-конфиге именно такие настройки

- `dev.assetPrefix` и `output.assetPrefix` — абсолютный URL. Чанки remote'а грузит
  хост со своего origin, и без абсолютных ссылок он будет искать их у себя.
  В проде адрес подставляется через `PUBLIC_MF_URL`.
- `server.headers` с `Access-Control-Allow-Origin` — иначе браузер не отдаст хосту
  `remoteEntry.js` кросс-доменно.
- `optimization.splitChunks: false` — Module Federation несовместим с выносом
  общих чанков.
- `shared` с `singleton: true` для React и react-dom — два экземпляра React
  ломают хуки. `@tanstack/react-query` в singleton, чтобы кэш запросов был общий.
- **Асинхронная граница в точке входа.** `src/main.tsx` содержит только
  `void import('./app/bootstrap')`, а вся инициализация живёт в `bootstrap.tsx`.
  Без этого remote падает с `RUNTIME-006: Invalid loadShareSync function call`:
  entry тянет react синхронно, когда share scope ещё не готов. Динамический
  импорт откладывает код приложения на отдельный чанк, который грузится уже
  после инициализации shared.

## Линтер и форматирование

ESLint 10 на flat-конфиге (`eslint.config.js`):

- `@eslint/js` recommended + `typescript-eslint` recommended (без type-aware правил —
  линт остаётся быстрым);
- `eslint-plugin-react-hooks` — `rules-of-hooks` и `exhaustive-deps`;
- `eslint-plugin-react-refresh` — предупреждает, когда из файла компонента торчит
  лишний экспорт и ломается Fast Refresh (для `src/routes/**` выключено: там
  экспорт `Route` — это норма);
- `@tanstack/eslint-plugin-query` — `exhaustive-deps` для `queryKey`, `stable-query-client`
  и остальное;
- `eslint-config-prettier` последним — гасит правила, конфликтующие с Prettier.

Prettier настроен в `.prettierrc.json`: без точек с запятой, одинарные кавычки,
запятые в конце, ширина 90. `src/routeTree.gen.ts` исключён из обоих инструментов.

## CSS Modules

Включены и настроены в `rsbuild.config.ts`. Модулем считается любой файл
`*.module.css` — остальной CSS остаётся глобальным.

```tsx
import styles from './Header.module.css'

<header className={styles.header}>
```

Настройки в `output.cssModules`:

- `exportLocalsConvention: 'camelCase'` — `.field-label` в CSS доступен как
  `styles.fieldLabel`. Именно `camelCase`, а не `camelCaseOnly`: исходное имя
  тоже остаётся, поэтому `styles['field-label']` не сломается;
- `localIdentName` — в dev `[path][name]__[local]-[hash]`, в devtools сразу
  видно, из какого файла класс; в проде короткое `[local]-[hash]`.

`@rsbuild/plugin-typed-css-modules` кладёт рядом с каждым модулем файл
`*.module.css.d.ts` с реальными именами классов. Без него `styles.headr`
молча вернул бы `undefined`, с ним — ошибка компиляции. Файлы генерируются
при `dev` и `build`, в git не коммитятся.

Рабочий пример — `src/app/layouts/parts/header/`: `Header.tsx` + `Header.module.css`.

Для микрофронтенда это не косметика: у хоста и remote'а классы живут на одной
странице, и обычный `.header` из двух приложений схлопнется в один. Хеш в имени
модульного класса эту коллизию снимает.

## CSS-утилиты (src/app/styles)

Файлы не пишутся руками — их генерируют скрипты из `scripts/css/`
(чистый Node, без зависимостей). Общая часть вынесена в `_shared.mjs`,
поэтому генераторы не расходятся между собой.

```bash
npm run styles:flex      # src/app/styles/utils/flex.css     215 классов
npm run styles:margin    # src/app/styles/utils/margin.css   720 классов
npm run styles:padding   # src/app/styles/utils/padding.css  330 классов
npm run styles:grid      # src/app/styles/utils/grid.css     180 классов
```

Два флага, одинаковые для обоих:

```bash
-- --prefix con-      # .con-flex, .con-m-4, отрицательные → -con-mt-4
-- --step 2           # шаг шкалы: m-4 станет 8px вместо 16px
-- --prefix con- --step 2
```

Шкала в пикселях: **число в классе × шаг**. По умолчанию шаг 4px, то есть
`m-4` = 16px, `gap-2.5` = 10px, `*-px` = 1px, `*-0` = 0.

Префикс — не косметика: в режиме микрофронтенда стили хоста и remote'а живут на
одной странице, и голый `.flex` почти наверняка с чем-нибудь столкнётся.

Подключение — в `src/app/styles/index.css`:

```css
/* src/app/styles/index.css */
@import './utils/flex.css';
@import './utils/margin.css';
@import './utils/padding.css';
@import './utils/grid.css';
```

Документация — `src/app/styles/docs-utils/`: `flex.md`, `margin.md`, `padding.md`, `grid.md`.

`gap-*` живёт в `flex.css` — свойство общее для флекса и грида, дублировать
правила смысла нет. У `styles:grid` нет флага `--step`: пиксельной шкалы
у grid-классов не бывает.

Адаптивных вариантов генераторы не делают — в конце каждого файла лежит пример,
как обернуть нужный набор в media-запрос вручную.

## Справочники по Tailwind

В `docs/tailwind/` лежит выжимка из документации Tailwind v4 — на случай, если
стили будут переезжать на утилитарные классы. Сам Tailwind в зависимости не добавлен.

- `padding.md` — шкала отступов, все префиксы включая логические, примеры, грабли
- `margin.md` — то же для внешних отступов плюс `space-*`, отрицательные margin, схлопывание
- `flex-grid.md` — flex, grid, выравнивание, `gap`, subgrid и разбор типовых раскладок

## Структура

```
rsbuild.config.ts     Rsbuild + pluginReact + tanstackRouter (rspack-плагин)
src/main.tsx          асинхронная граница: void import('./app/bootstrap')
src/app/bootstrap.tsx точка входа: QueryClientProvider + RouterProvider
src/app/router/       createRouter, контекст роутера, Register-аугментация
  routeTree.gen.ts    генерируется плагином, в git не коммитится
src/lib/query-client  единый QueryClient (staleTime, retry и т.д.)
src/api/http.ts       axios-инстанс, интерсепторы, ApiError, хелпер api.get/post/...
src/api/posts.ts      queryOptions для списка и одного поста
src/api/index.ts      реэкспорт (import { api, postsQueryOptions } from '@/api')
src/app/layouts/      два лейаута и всё, что к ним относится
  main-layout.tsx     шапка, навигация, метка режима сборки
  blank-layout.tsx    голая обёртка без шапки
  nav.ts              конфиг пунктов меню
  layouts.css         стили шапки, навигации, бейджа и .blank
src/routes/           файловый роутинг
  __root.tsx          только <Outlet /> + обе панели devtools + 404
  _main.tsx           pathless-роут → MainLayout
  _main/index.tsx     /
  _main/posts/index.tsx     /posts — loader + useSuspenseQuery + ?q=
  _main/posts/$postId.tsx   /posts/$postId — loader + useQuery
  _main/dashboard.tsx       /dashboard — три связанных селекта + график
  _blank.tsx          pathless-роут → BlankLayout
  _blank/embed/dashboard.tsx  /embed/dashboard — дашборд без шапки
src/components/e-chart.tsx   React-обёртка над ECharts (ResizeObserver + dispose)
src/lib/echarts.ts           tree-shaken регистрация модулей ECharts
src/features/dashboard/      данные, каскад геофильтра, палитра, сборка option
```

## Лейауты

Два лейаута лежат в `src/app/layouts/` вместе со своей навигацией и своим CSS —
общий `styles.css` про шапку больше ничего не знает.

| Лейаут | Где применяется | Что рисует |
|---|---|---|
| `MainLayout` | всё в `src/routes/_main/` | шапка, логотип, бейдж режима, верхнее меню |
| `BlankLayout` | всё в `src/routes/_blank/` | только контент, без шапки |

Подключены через **pathless-роуты**: сегменты `_main` и `_blank` не попадают в URL,
лейаут выбирается тем, в какой папке лежит файл страницы. Адреса от этого не
изменились — `/`, `/posts`, `/dashboard` те же, что и были.

Чтобы страница поехала на другом лейауте, достаточно переложить файл между
`_main/` и `_blank/`. Пункты меню правятся в одном месте — `src/app/layouts/nav.ts`,
пропсы `<Link>` там типизированы, так что несуществующий путь не проедет.

`/embed/dashboard` — практический пример второго лейаута: тот же дашборд, но без
обвязки приложения. Ровно это видит хост, когда подключает `./Dashboard` через
Module Federation.

## Как это связано

- `@tanstack/router-plugin/rspack` сканирует `src/routes` и генерирует `src/routeTree.gen.ts`
  при `dev`/`build`. Файл появится после первого запуска — до этого TS будет ругаться
  на импорт в `main.tsx`, это нормально.
- `QueryClient` прокинут в контекст роутера через `createRootRouteWithContext`,
  поэтому `loader` роута может делать `context.queryClient.ensureQueryData(...)`
  и данные оказываются в кэше до рендера компонента.
- `defaultPreload: 'intent'` предзагружает роут при наведении на `<Link>`.
- `autoCodeSplitting: true` разбивает роуты на отдельные чанки автоматически.

## HTTP-слой (axios)

`src/api/http.ts`:

- инстанс с `baseURL` из `PUBLIC_API_URL` (см. `.env.example`) и таймаутом 15 с;
- request-интерсептор подставляет `Authorization: Bearer <token>` — токен кладётся
  через `setAuthToken(token)`;
- response-интерсептор превращает любую ошибку в `ApiError { message, status, data }`,
  а отмену запроса пробрасывает как есть, чтобы TanStack Query корректно
  обработал `AbortSignal`;
- `api.get<T>() / post / put / patch / delete` возвращают сразу тело ответа.

Запрос в `queryOptions` выглядит так:

```ts
export const postsQueryOptions = queryOptions({
  queryKey: postsKeys.all,
  queryFn: ({ signal }) => api.get<Post[]>('/posts', { params: { _limit: 24 }, signal }),
})
```

`signal` из TanStack Query передаётся в axios — при уходе со страницы запрос отменяется.

Мутация:

```ts
const { mutate } = useMutation({
  mutationFn: createPost,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: postsKeys.all }),
})
```

## Дашборд (/dashboard)

**Три связанных селекта.** Регион → Страна → Город. Значения лежат в search-параметрах
URL, а `resolveSelection` в `features/dashboard/geo.ts` чинит каскад: если город не
принадлежит выбранной стране, берётся первый доступный. Поэтому смена региона
автоматически подтягивает первую страну и первый город, а невалидного состояния
в URL не бывает — ссылку `?region=asia&country=kz&city=almaty` можно переслать.

**График: 5 сплошных + 5 пунктирных линий.** Пять продуктов = пять цветов;
сплошная линия — факт, пунктир того же цвета — план. То есть цвет кодирует
сущность, а начертание — сценарий (это честнее, чем 10 отдельных цветов:
человек различает максимум 8 категориальных оттенков).

Палитра прогнана через валидатор на разделимость при дальтонизме — худшая соседняя
пара ΔE 9.1 в светлой теме и 8.4 в тёмной при пороге 8. В светлой теме три цвета
не добирают 3:1 контраста к фону, поэтому у сплошных линий включены подписи
у правого края (`endLabel`) — идентичность не держится на одном цвете.

Прочее на странице: три KPI-плитки (факт, план, выполнение), кликабельная легенда
(скрывает пару линий продукта, минимум одна серия всегда остаётся), тултип
с общей вертикальной линией и таблицей факт/план, и переключение светлой и тёмной
темы вслед за системной через `useColorScheme`.

ECharts подключается по частям — `LineChart`, `GridComponent`, `TooltipComponent`,
`CanvasRenderer` — остальное в бандл не попадает.

## Devtools

- TanStack Router Devtools — кнопка внизу слева
- TanStack Query Devtools — кнопка внизу справа

Оба монтируются в `src/routes/__root.tsx` и попадают только в dev-сборку
(Rsbuild вырезает их по `process.env.NODE_ENV`).

## Алиас путей

`@/*` → `./src/*` (настроено в `tsconfig.json`, Rsbuild подхватывает `paths` сам).
