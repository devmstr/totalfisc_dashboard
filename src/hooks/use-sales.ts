import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export interface SaleInvoiceDto {
  id: string
  number: string
  date: string
  dueDate: string
  clientId: string
  clientName?: string
  totalAmount: number
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'
}

export const useSalesInvoices = () => {
  return useQuery<SaleInvoiceDto[]>({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await apiClient.get('/Sales/Invoices')
      return response.data
    }
  })
}
