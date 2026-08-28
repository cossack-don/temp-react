import { Router } from 'express'
import type { Request, Response } from 'express'

/**
 * Пост в том виде, в каком его отдаёт сервер: snake_case.
 * Фронт получит camelCase — за это отвечает caseAdapter в интерсепторах.
 */
export interface Post {
  id: number
  user_id: number
  title: string
  body: string
  created_at: string
  updated_at: string
}

// ------------------------------------------------------------ хранилище
// Обычный массив в памяти. Перезапустили сервер — данные вернулись к сидам.

const now = () => new Date().toISOString()

let nextId = 1

/** Сиды: короткие заметки про стек самого проекта. */
const SEED: Array<[title: string, body: string, userId: number]> = [
  ['Rsbuild вместо webpack', 'Сборка на Rspack: холодный старт быстрее, конфиг короче. Два файла — обычный и для микрофронтенда.', 1],
  ['Роуты описаны в коде', 'Ушли с файлового роутинга: лейауты в app/router, страницы в своих модулях. Дерево собирается в одном месте.', 1],
  ['Pathless-лейауты', 'Сегменты base и blank есть в дереве, но не появляются в адресе. Главная остаётся на слэше.', 1],
  ['Loader кладёт данные в кэш', 'ensureQueryData отрабатывает до рендера, поэтому suspense не моргает пустым состоянием.', 2],
  ['useSuspenseQuery против useQuery', 'В списке первый — данные уже в кэше. В карточке второй, чтобы были видны ручные состояния.', 2],
  ['Интерсепторы axios', 'Любая ошибка сворачивается в ApiError со статусом и телом. Отмена запроса пробрасывается как есть.', 2],
  ['snake_case на границе', 'Сервер говорит в snake_case, приложение в camelCase. Переводом занимается адаптер в интерсепторах.', 3],
  ['FormData не трогаем', 'Конвертер обходит только литеральные объекты и массивы. Blob, File и стримы уходят нетронутыми.', 3],
  ['skipCaseTransform', 'Флаг отключает преобразование для одной ручки: целиком, только на отправку или только на приём.', 3],
  ['ECharts по частям', 'Регистрируем LineChart, Grid, Tooltip и CanvasRenderer. Остальное в бандл не попадает.', 4],
  ['Палитра под дальтонизм', 'Пять цветов серий проверены валидатором: худшая соседняя пара 9.1 при пороге 8.', 4],
  ['Пунктир вместо десяти цветов', 'Цвет кодирует продукт, начертание — факт или план. Различимых оттенков всё равно не больше восьми.', 4],
  ['CSS Modules', 'Классы уникализируются при сборке. В микрофронтенде .header хоста и remote больше не схлопываются.', 5],
  ['Типы для модулей', 'Плагин кладёт рядом .module.css.d.ts, поэтому опечатка в styles.headr падает на компиляции.', 5],
  ['Утилиты генерируются', 'flex, margin, padding и grid собирает скрипт. Префикс и шаг шкалы — флаги командной строки.', 5],
  ['Module Federation', 'Приложение умеет быть remote: отдаёт панель дашборда, обёртку над графиком и http-клиент.', 6],
  ['Асинхронная граница', 'Точка входа только импортирует bootstrap. Без этого shared-зависимости не успевают инициализироваться.', 6],
  ['Express без базы', 'Данные живут в массиве в памяти. Перезапустили сервер — вернулись к сидам.', 7],
  ['Ошибки одного формата', 'Сервер отдаёт { message }, ровно его читает toApiError. Текст долетает до errorComponent.', 7],
  ['React закреплён на 18', 'Ничего из 19 API не используется, поэтому переход на любую сторону — вопрос четырёх версий в package.json.', 7],
]

const posts: Post[] = SEED.map(([title, body, user_id]) => ({
  id: nextId++,
  user_id,
  title,
  body,
  created_at: now(),
  updated_at: now(),
}))

/** Сколько постов сейчас в памяти. Нужно для /check-app. */
export const countPosts = (): number => posts.length

// ------------------------------------------------------------- валидация

interface PostInput {
  user_id: number
  title: string
  body: string
}

/** Ошибка с кодом ответа. Её ловит обработчик в index.ts. */
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

const asString = (value: unknown, field: string, required: boolean): string | undefined => {
  if (value === undefined) {
    if (required) {
      throw new HttpError(400, `Поле "${field}" обязательно`)
    }
    return undefined
  }

  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `Поле "${field}" должно быть непустой строкой`)
  }

  return value
}

const readInput = (body: unknown, required: boolean): Partial<PostInput> => {
  if (typeof body !== 'object' || body === null) {
    throw new HttpError(400, 'Ожидался JSON-объект')
  }

  const source = body as Record<string, unknown>

  const userId = source.user_id
  if (userId !== undefined && (typeof userId !== 'number' || !Number.isInteger(userId))) {
    throw new HttpError(400, 'Поле "user_id" должно быть целым числом')
  }

  return {
    user_id: userId as number | undefined,
    title: asString(source.title, 'title', required),
    body: asString(source.body, 'body', required),
  }
}

/** В типах Express 5 параметр может быть массивом, поэтому принимаем unknown. */
const findIndex = (raw: unknown): number => {
  const id = Number(raw)

  if (!Number.isInteger(id)) {
    throw new HttpError(400, 'id должен быть числом')
  }

  const index = posts.findIndex((post) => post.id === id)

  if (index === -1) {
    throw new HttpError(404, `Пост ${id} не найден`)
  }

  return index
}

// ---------------------------------------------------------------- роуты

export const postsRouter = Router()

/** Сколько записей отдаём, если клиент не попросил иначе. */
const DEFAULT_LIMIT = 10

/** Потолок: даже с ?limit=10000 больше сотни не отдадим. */
const MAX_LIMIT = 100

/** Разбирает limit из query. Мусор и отрицательные значения игнорируются. */
const readLimit = (raw: unknown): number => {
  if (typeof raw !== 'string') {
    return DEFAULT_LIMIT
  }

  const parsed = Number(raw)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT
  }

  return Math.min(parsed, MAX_LIMIT)
}

/**
 * GET /posts?limit=10&q=текст
 *
 * Без параметров отдаёт DEFAULT_LIMIT записей — размер страницы решает сервер,
 * а не каждый клиент отдельно. Сколько всего подходит под фильтр,
 * видно в заголовке X-Total-Count.
 */
postsRouter.get('/', (req: Request, res: Response) => {
  const { q } = req.query
  // _limit — наследие jsonplaceholder, поддерживаем оба варианта
  const limit = readLimit(req.query.limit ?? req.query._limit)

  let result = posts

  if (typeof q === 'string' && q.trim() !== '') {
    const needle = q.trim().toLowerCase()
    result = result.filter((post) => post.title.toLowerCase().includes(needle))
  }

  res.setHeader('X-Total-Count', String(result.length))
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')

  res.json(result.slice(0, limit))
})

/** GET /posts/:id */
postsRouter.get('/:id', (req: Request, res: Response) => {
  res.json(posts[findIndex(req.params.id)])
})

/** POST /posts — создание, 201 + Location */
postsRouter.post('/', (req: Request, res: Response) => {
  const input = readInput(req.body, true)

  const post: Post = {
    id: nextId++,
    user_id: input.user_id ?? 1,
    title: input.title as string,
    body: input.body as string,
    created_at: now(),
    updated_at: now(),
  }

  posts.push(post)

  res.status(201).location(`/posts/${post.id}`).json(post)
})

/** PUT /posts/:id — полная замена, поля обязательны */
postsRouter.put('/:id', (req: Request, res: Response) => {
  const index = findIndex(req.params.id)
  const input = readInput(req.body, true)
  const current = posts[index] as Post

  const updated: Post = {
    ...current,
    user_id: input.user_id ?? current.user_id,
    title: input.title as string,
    body: input.body as string,
    updated_at: now(),
  }

  posts[index] = updated

  res.json(updated)
})

/** PATCH /posts/:id — частичное обновление */
postsRouter.patch('/:id', (req: Request, res: Response) => {
  const index = findIndex(req.params.id)
  const input = readInput(req.body, false)
  const current = posts[index] as Post

  const updated: Post = {
    ...current,
    ...(input.user_id !== undefined && { user_id: input.user_id }),
    ...(input.title !== undefined && { title: input.title }),
    ...(input.body !== undefined && { body: input.body }),
    updated_at: now(),
  }

  posts[index] = updated

  res.json(updated)
})

/** DELETE /posts/:id — 204 без тела */
postsRouter.delete('/:id', (req: Request, res: Response) => {
  posts.splice(findIndex(req.params.id), 1)
  res.status(204).end()
})
