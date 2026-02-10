import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { toast } from 'sonner'

export interface CreatePurchaseInvoiceData {
  invoiceNumber: string
  date: Date
  dueDate: Date
  supplierId: string
  amountHT: number
  vatAmount: number
  amountTTC: number
}

export const usePurchasesMutation = () => {
  const queryClient = useQueryClient()

  const createInvoice = useMutation({
    mutationFn: async (data: CreatePurchaseInvoiceData) => {
      const response = await apiClient.post('/Purchases/Invoices', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      toast.success('Facture d\'achat créée avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la création de la facture"
      toast.error(message)
    }
  })

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePurchaseInvoiceData> }) => {
      const response = await apiClient.put(`/Purchases/Invoices/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      toast.success('Facture d\'achat mise à jour avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la mise à jour de la facture"
      toast.error(message)
    }
  })

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/Purchases/Invoices/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      toast.success('Facture d\'achat supprimée avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la suppression de la facture"
      toast.error(message)
    }
  })

  return {
    createInvoice,
    updateInvoice,
    deleteInvoice
  }
}
