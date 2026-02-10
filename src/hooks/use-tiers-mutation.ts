import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { toast } from 'sonner'

export interface CreateTierData {
  code: string
  name: string
  type: 'client' | 'supplier' | 'both'
  nif?: string
  nis?: string
  rc?: string
  ai?: string
  phone?: string
  email?: string
  address?: string
}

export const useTiersMutation = () => {
  const queryClient = useQueryClient()

  const createTier = useMutation({
    mutationFn: async (data: CreateTierData) => {
      const response = await apiClient.post('/Tiers', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] })
      toast.success('Tiers créé avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Échec de la création du tiers'
      toast.error(message)
    }
  })

  const updateTier = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateTierData> }) => {
      const response = await apiClient.put(`/Tiers/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] })
      toast.success('Tiers mis à jour avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Échec de la mise à jour du tiers'
      toast.error(message)
    }
  })

  const deleteTier = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/Tiers/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] })
      toast.success('Tiers supprimé avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Échec de la suppression du tiers'
      toast.error(message)
    }
  })

  return {
    createTier,
    updateTier,
    deleteTier
  }
}
