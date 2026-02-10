import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export interface Tier {
  id: string
  code: string
  name: string
  type: 'client' | 'supplier' | 'both'
}

export const useTiers = (type?: 'client' | 'supplier' | 'both') => {
  return useQuery<Tier[]>({
    queryKey: ['tiers', type],
    queryFn: async () => {
      const response = await apiClient.get('/Tiers', {
        params: { type }
      })
      return response.data
    }
  })
}
