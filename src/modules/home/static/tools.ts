export interface Tool {
  /** Короткая монограмма для плашки */
  mark: string
  name: string
  version: string
  what: string
  /** Акцент карточки. Все проверены на контраст к фону карточки: не ниже 4.9:1 */
  color: string
}

/** Что стоит в проекте. Версии — мажоры из package.json. */
export const TOOLS: Tool[] = [
  {
    mark: 'R',
    name: 'React',
    version: '18',
    what: 'UI. Ровно 18-я ветка, ничего из 19 API не используется',
    color: '#5cc8e8',
  },
  {
    mark: 'TS',
    name: 'TypeScript',
    version: '5',
    what: 'strict, verbatimModuleSyntax, алиас @/* на src',
    color: '#7aa7f0',
  },
  {
    mark: 'Rs',
    name: 'Rsbuild',
    version: '2',
    what: 'Сборка на Rspack. Два конфига: обычный и микрофронтенд',
    color: '#f5836b',
  },
  {
    mark: '/',
    name: 'TanStack Router',
    version: '1',
    what: 'Роуты в коде, типобезопасные params и search',
    color: '#f0a15b',
  },
  {
    mark: 'Q',
    name: 'TanStack Query',
    version: '5',
    what: 'Серверное состояние. Данные грузит loader роута',
    color: '#ee6e6e',
  },
  {
    mark: 'ax',
    name: 'axios',
    version: '1',
    what: 'Интерсепторы: ApiError и camelCase ↔ snake_case',
    color: '#a79bff',
  },
  {
    mark: 'E',
    name: 'ECharts',
    version: '6',
    what: 'Графики. Подключён по частям, лишнее в бандл не идёт',
    color: '#4fc79a',
  },
  {
    mark: 'MF',
    name: 'Module Federation',
    version: '2',
    what: 'Приложение умеет быть remote и отдавать модули хосту',
    color: '#c77ddb',
  },
  {
    mark: 'ES',
    name: 'ESLint + Prettier',
    version: '10',
    what: 'Flat-конфиг, правила hooks и TanStack Query',
    color: '#8b7cff',
  },
  {
    mark: 'ex',
    name: 'Express',
    version: '5',
    what: 'Локальный CRUD-API без базы, запускается без сборки',
    color: '#9ad16b',
  },
]
