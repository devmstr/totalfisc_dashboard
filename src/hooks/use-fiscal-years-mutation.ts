import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { toast } from 'sonner'

export interface CreateFiscalYearData {
  yearNumber: number
  startDate: Date
  endDate: Date
  status: 'Open' | 'Locked' | 'Closed'
}

export const useFiscalYearsMutation = () => {
  const queryClient = useQueryClient()

  const createFiscalYear = useMutation({
    mutationFn: async (data: CreateFiscalYearData) => {
      const response = await apiClient.post('/FiscalYears', {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString()
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiscal-years'] })
      toast.success('Exercice créé avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la création de l'exercice"
      toast.error(message)
    }
  })

  const updateFiscalYear = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateFiscalYearData> }) => {
      const response = await apiClient.put(`/FiscalYears/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiscal-years'] })
      toast.success('Exercice mis à jour avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la mise à jour de l'exercice"
      toast.error(message)
    }
  })

  const deleteFiscalYear = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/FiscalYears/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiscal-years'] })
      toast.success('Exercice supprimé avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Échec de la suppression de l'exercice"
      toast.error(message)
    }
  })

  return {
    createFiscalYear,
    updateFiscalYear,
    deleteFiscalYear
  }
}
