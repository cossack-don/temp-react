import { Link } from '@tanstack/react-router'

import type { Post } from '@/api/posts'
import styles from '../Page.module.css'

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'long',
  timeStyle: 'short',
})

interface PostCardProps {
  post: Post
  isFetching: boolean
}

/** Карточка одного поста. */
export const PostCard = ({ post, isFetching }: PostCardProps) => {
  return (
    <div className={styles.page}>
      <Link to="/posts" search={{ q: '' }} className={styles.back}>
        ← ко всем постам
      </Link>

      <article className={styles.post}>
        <h1 className={styles.postTitle}>{post.title}</h1>

        <p className={styles.meta}>
          <span>id {post.id}</span>
          <span>·</span>
          <span>автор {post.userId}</span>
          {post.createdAt ? (
            <>
              <span>·</span>
              <span>{dateFormat.format(new Date(post.createdAt))}</span>
            </>
          ) : null}
          {isFetching ? (
            <>
              <span>·</span>
              <span>обновляем…</span>
            </>
          ) : null}
        </p>

        <p className={styles.postBody}>{post.body}</p>
      </article>
    </div>
  )
}
