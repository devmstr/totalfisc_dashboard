import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export interface PurchaseInvoiceDto {
  id: string
  number: string // Seed uses 'number'
  date: string
  dueDate: string
  supplierId: string
  supplierName?: string
  totalAmount: number // Seed uses 'totalAmount'
  status: 'Draft' | 'Received' | 'Paid' | 'Overdue' | 'Cancelled'
}

export const usePurchaseInvoices = () => {
  return useQuery<PurchaseInvoiceDto[]>({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await apiClient.get('/Purchases/Invoices')
      return response.data
    }
  })
}
