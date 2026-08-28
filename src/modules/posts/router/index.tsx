import { createRoute } from '@tanstack/react-router'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

import { BaseLayoutRoute } from '@/app/layouts/base/base-layout.route'
import { postQueryOptions, postsQueryOptions } from '@/api/posts'
import { PostCard, PostsList } from '../components'
import styles from '../Page.module.css'

interface PostsSearch {
  q: string
}

/** Список постов. Фильтр живёт в URL: /posts?q=текст */
export const postsRoute = createRoute({
  getParentRoute: () => BaseLayoutRoute,
  path: '/posts',
  validateSearch: (search: Record<string, unknown>): PostsSearch => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  // данные кладём в кэш query ещё до рендера компонента
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQueryOptions),
  pendingComponent: () => <p className={styles.state}>Загружаем посты…</p>,
  errorComponent: ({ error }) => <p className={styles.error}>{error.message}</p>,
  component: function PostsRouteComponent() {
    // данные уже в кэше после loader — suspense не «моргает»
    const { data: posts } = useSuspenseQuery(postsQueryOptions)
    const { q } = postsRoute.useSearch()
    const navigate = postsRoute.useNavigate()

    const needle = q.trim().toLowerCase()
    const filtered = needle
      ? posts.filter((post) => post.title.toLowerCase().includes(needle))
      : posts

    return (
      <PostsList
        posts={filtered}
        total={posts.length}
        query={q}
        onQueryChange={(value) => void navigate({ search: { q: value }, replace: true })}
      />
    )
  },
})

/** Один пост. Здесь намеренно обычный useQuery — видно ручную обработку состояний. */
export const postRoute = createRoute({
  getParentRoute: () => BaseLayoutRoute,
  path: '/posts/$postId',
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postQueryOptions(Number(params.postId))),
  errorComponent: ({ error }) => <p className={styles.error}>{error.message}</p>,
  component: function PostRouteComponent() {
    const { postId } = postRoute.useParams()
    const { data, isPending, isError, error, isFetching } = useQuery(
      postQueryOptions(Number(postId)),
    )

    if (isPending) {
      return <p className={styles.state}>Загружаем пост…</p>
    }

    if (isError) {
      return <p className={styles.error}>{error.message}</p>
    }

    return <PostCard post={data} isFetching={isFetching} />
  },
})
