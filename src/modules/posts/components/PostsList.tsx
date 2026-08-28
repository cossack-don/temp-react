import { Link } from '@tanstack/react-router'

import type { Post } from '@/api/posts'
import styles from '../Page.module.css'

interface PostsListProps {
  posts: Post[]
  query: string
  onQueryChange: (value: string) => void
  total: number
}

/** Список постов с фильтром по заголовку. Данные приходят пропсами. */
export const PostsList = ({ posts, query, onQueryChange, total }: PostsListProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h1 className={styles.title}>Посты</h1>
        <span className={styles.count}>
          {posts.length} из {total}
        </span>
      </div>

      <input
        className={styles.search}
        type="search"
        placeholder="Фильтр по заголовку…"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        aria-label="Фильтр по заголовку"
      />

      {posts.length === 0 ? (
        <p className={styles.empty}>Ничего не нашлось. Попробуйте другой запрос.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to="/posts/$postId"
                params={{ postId: String(post.id) }}
                className={styles.row}
              >
                <span className={styles.id}>{post.id}</span>

                <span className={styles.rowBody}>
                  <span className={styles.rowTitle}>{post.title}</span>
                  <span className={styles.rowText}>{post.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
