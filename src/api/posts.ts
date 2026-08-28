import { queryOptions } from '@tanstack/react-query'

import { api } from './http'

export interface Post {
  id: number
  userId: number
  title: string
  body: string
  /**
   * Локальный express отдаёт created_at / updated_at, интерсептор приводит
   * их к camelCase. У jsonplaceholder этих полей нет — отсюда необязательность.
   */
  createdAt?: string
  updatedAt?: string
}

export type CreatePostInput = Pick<Post, 'title' | 'body' | 'userId'>

export const postsKeys = {
  all: ['posts'] as const,
  detail: (postId: number) => ['posts', postId] as const,
}

export const postsQueryOptions = queryOptions({
  queryKey: postsKeys.all,
  // размер страницы задаёт сервер: DEFAULT_LIMIT в server/posts.ts
  queryFn: ({ signal }) => api.get<Post[]>('/posts', { signal }),
})

export const postQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: postsKeys.detail(postId),
    queryFn: ({ signal }) => api.get<Post>(`/posts/${postId}`, { signal }),
  })

/** Заготовка под useMutation. */
export const createPost = (input: CreatePostInput) => api.post<Post>('/posts', input)
