import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { toast } from 'sonner'

export interface CreateSaleInvoiceData {
  invoiceNumber: string
  date: Date
  dueDate: Date
  clientId: string
  amountHT: number
  vatAmount: number
  amountTTC: number
}

export const useSalesMutation = () => {
  const queryClient = useQueryClient()

  const createInvoice = useMutation({
    mutationFn: async (data: CreateSaleInvoiceData) => {
      const response = await apiClient.post('/Sales/Invoices', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      toast.success('Facture de vente créée avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la création de la facture"
      toast.error(message)
    }
  })

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateSaleInvoiceData> }) => {
      const response = await apiClient.put(`/Sales/Invoices/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      toast.success('Facture de vente mise à jour avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la mise à jour de la facture"
      toast.error(message)
    }
  })

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/Sales/Invoices/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      toast.success('Facture de vente supprimée avec succès')
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
