export interface TreeNode {
  name: string
  /** Подпись внизу карточки. Только для групп верхнего уровня. */
  footer?: string
  /** Одна строка о том, зачем эта папка или файл. */
  note?: string
  /** Слой — задаёт цвет метки. */
  layer?: Layer
  children?: TreeNode[]
}

export type Layer = 'app' | 'modules' | 'shared' | 'api' | 'build' | 'server'

export const LAYERS: Record<Layer, { label: string; color: string }> = {
  app: { label: 'app', color: '#8b7cff' },
  modules: { label: 'модули', color: '#5cc8e8' },
  shared: { label: 'общее', color: '#4fc79a' },
  api: { label: 'api', color: '#f0a15b' },
  build: { label: 'сборка', color: '#c77ddb' },
  server: { label: 'сервер', color: '#9ad16b' },
}

/**
 * Мок структуры проекта: дерево описано руками, файловую систему никто
 * не читает и запросов на бэкенд страница не делает.
 * Обновлять при переездах папок — здесь же, в одном месте.
 */
export const PROJECT_TREE: TreeNode[] = [
  {
    name: 'src/app',
    layer: 'app',
    note: 'Слой приложения: то, что существует в единственном экземпляре',
    children: [
      { name: 'bootstrap.tsx', note: 'Провайдеры и createRoot' },
      { name: 'build-mode.ts', note: 'standalone или микрофронтенд' },
      {
        name: 'configs/',
        note: 'Настройка сторонних библиотек',
        children: [
          { name: 'axios-create.ts', note: 'Инстанс axios и baseURL' },
          { name: 'query-client.ts', note: 'QueryClient и его дефолты' },
          { name: 'echarts.ts', note: 'Регистрация модулей ECharts' },
        ],
      },
      {
        name: 'router/',
        note: 'Роутинг описан в коде, без генерации',
        children: [
          { name: '__root.tsx', note: 'Outlet, devtools, 404' },
          { name: 'layouts/base.route.tsx', note: 'Pathless-роут с шапкой' },
          { name: 'layouts/blank.route.tsx', note: 'Pathless-роут без шапки' },
          { name: 'routes.ts', note: 'Единственное место сборки дерева' },
          { name: 'not-found.route.ts', note: 'Неизвестный адрес → редирект на /' },
        ],
      },
      {
        name: 'layouts/',
        note: 'Оболочки страниц',
        children: [
          { name: 'base/BaseLayout.tsx', note: 'Шапка плюс main' },
          { name: 'blank-layout.tsx', note: 'Голая обёртка под встраивание' },
          { name: 'parts/header/', note: 'Header.tsx и его CSS-модуль' },
          { name: 'parts/nav/', note: 'Nav.tsx и конфиг пунктов меню' },
        ],
      },
      {
        name: 'styles/',
        note: 'Токены темы и утилитарные классы',
        children: [
          { name: 'app.css', note: 'Переменные темы и базовая типографика' },
          { name: 'utils/', note: 'flex, margin, padding, grid — генерируются' },
          { name: 'docs-utils/', note: 'Документация к утилитам' },
        ],
      },
      { name: 'components/', note: 'AppGate, Loading, BaseErrors' },
    ],
  },
  {
    name: 'src/modules',
    layer: 'modules',
    note: 'Экраны. У каждого своя структура и свой публичный index.ts',
    children: [
      { name: 'home/', note: 'Главная: обзор инструментов проекта' },
      { name: 'posts/', note: 'Список и карточка поста, данные из API' },
      { name: 'dashboard/', note: 'Селекты, показатели и график ECharts' },
      { name: 'hooks/', note: 'Примеры хуков из react-use' },
      { name: 'architecture/', note: 'Эта страница' },
    ],
    footer: 'Типовой состав модуля: Page.tsx · components/ · router/ · static/ · utils/ · styles/',
  },
  {
    name: 'src/api',
    layer: 'api',
    note: 'Работа с бэкендом',
    children: [
      { name: 'core/setupInterceptors.ts', note: 'ApiError и перехват ошибок' },
      { name: 'adapters/caseAdapter.ts', note: 'camelCase ↔ snake_case' },
      { name: 'adapters/axios.d.ts', note: 'Флаг skipCaseTransform' },
      { name: 'http.ts', note: 'Обёртка api.get / post / put / patch / delete' },
      { name: 'posts.ts', note: 'queryOptions для списка и одного поста' },
    ],
  },
  {
    name: 'src (общее)',
    layer: 'shared',
    note: 'То, чем пользуются несколько модулей',
    children: [
      { name: 'components/base/', note: 'EChart и другие примитивы' },
      { name: 'hooks/', note: 'useColorScheme' },
      { name: 'utils/', note: 'Чистые функции без привязки к экрану' },
      { name: 'constants/', note: 'Общие константы' },
    ],
  },
  {
    name: 'server',
    layer: 'server',
    note: 'Локальный CRUD-API на Express, данные в памяти',
    children: [
      { name: 'index.ts', note: 'CORS, обработчик ошибок, listen' },
      { name: 'posts.ts', note: 'Сиды, валидация, роуты' },
    ],
  },
  {
    name: 'сборка',
    layer: 'build',
    note: 'Конфигурация и скрипты',
    children: [
      { name: 'rsbuild.config.ts', note: 'Обычная сборка, порт 3000' },
      { name: 'rsbuild.mf.config.ts', note: 'Module Federation, порт 3001' },
      { name: 'scripts/css/', note: 'Генераторы утилитарных классов' },
      { name: 'eslint.config.js', note: 'Flat-конфиг ESLint' },
    ],
  },
]
