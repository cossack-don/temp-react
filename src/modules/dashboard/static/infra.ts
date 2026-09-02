import type { DataCenter, Selection } from '../types'

/** Мок инфраструктуры: ДЦ → кластер → сервер. */
export const DATA_CENTERS: DataCenter[] = [
  {
    id: 'dc-msk',
    label: 'Москва, М9',
    clusters: [
      {
        id: 'prod-web',
        label: 'prod-web',
        servers: [
          { id: 'web-01', label: 'web-01', role: 'app' },
          { id: 'web-02', label: 'web-02', role: 'app' },
          { id: 'web-03', label: 'web-03', role: 'app' },
        ],
      },
      {
        id: 'prod-db',
        label: 'prod-db',
        servers: [
          { id: 'pg-01', label: 'pg-01 (master)', role: 'db' },
          { id: 'pg-02', label: 'pg-02 (replica)', role: 'db' },
        ],
      },
    ],
  },
  {
    id: 'dc-spb',
    label: 'Санкт-Петербург, Цветочная',
    clusters: [
      {
        id: 'cache',
        label: 'cache',
        servers: [
          { id: 'redis-01', label: 'redis-01', role: 'cache' },
          { id: 'redis-02', label: 'redis-02', role: 'cache' },
        ],
      },
      {
        id: 'storage',
        label: 'storage',
        servers: [
          { id: 's3-01', label: 's3-01', role: 'storage' },
          { id: 's3-02', label: 's3-02', role: 'storage' },
          { id: 's3-03', label: 's3-03', role: 'storage' },
        ],
      },
    ],
  },
  {
    id: 'dc-ams',
    label: 'Амстердам, AMS-2',
    clusters: [
      {
        id: 'stage',
        label: 'stage',
        servers: [
          { id: 'stage-01', label: 'stage-01', role: 'app' },
          { id: 'stage-02', label: 'stage-02', role: 'db' },
        ],
      },
    ],
  },
]

/**
 * Каскад: значение уровня принимается только если оно принадлежит
 * выбранному родителю, иначе берётся первое доступное.
 * Так невалидного состояния в URL просто не существует.
 */
export function resolveSelection(
  dataCenterId?: string,
  clusterId?: string,
  serverId?: string,
): Selection {
  const dataCenter =
    DATA_CENTERS.find((item) => item.id === dataCenterId) ?? DATA_CENTERS[0]!
  const cluster =
    dataCenter.clusters.find((item) => item.id === clusterId) ?? dataCenter.clusters[0]!
  const server =
    cluster.servers.find((item) => item.id === serverId) ?? cluster.servers[0]!

  return { dataCenter, cluster, server }
}
