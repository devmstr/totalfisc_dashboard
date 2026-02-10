import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { toast } from 'sonner'

export interface CreateQuoteData {
  quoteNumber: string
  date: Date
  expiryDate: Date
  clientId: string
  estimatedAmountHT: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
}

export const useQuotesMutation = () => {
  const queryClient = useQueryClient()

  const createQuote = useMutation({
    mutationFn: async (data: CreateQuoteData) => {
      const response = await apiClient.post('/Sales/Quotes', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      toast.success('Devis créé avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la création du devis"
      toast.error(message)
    }
  })

  return {
    createQuote
  }
}
