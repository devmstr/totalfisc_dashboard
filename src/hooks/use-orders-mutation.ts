import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { toast } from 'sonner'

export interface CreateOrderData {
  orderNumber: string
  date: Date
  expectedDeliveryDate: Date
  supplierId: string
  estimatedAmount: number
  status: 'draft' | 'sent' | 'received' | 'cancelled'
}

export const useOrdersMutation = () => {
  const queryClient = useQueryClient()

  const createOrder = useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await apiClient.post('/Purchases/Orders', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Bon de commande créé avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la création du bon de commande"
      toast.error(message)
    }
  })

  return {
    createOrder
  }
}
