import { useQuery } from '@tanstack/react-query'
import { ServiceChechHealth } from '@/api/services'

export const keyQueryCheckHealth = 'check-health' as const

export const useQueryCheckHealth = () => {
  return useQuery({
    queryKey: [keyQueryCheckHealth],
    queryFn: ({ signal }) => ServiceChechHealth.getInfo({ signal }),
  })
}
