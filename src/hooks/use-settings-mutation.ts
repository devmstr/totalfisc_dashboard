import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { toast } from 'sonner'

export interface CompanySettingsData {
  companyName: string
  address: string
  phone: string
  email: string
  nif: string
  nis: string
  rc: string
  ai: string
}

export const useSettingsMutation = () => {
  const queryClient = useQueryClient()

  const updateCompanySettings = useMutation({
    mutationFn: async (data: CompanySettingsData) => {
      const response = await apiClient.post('/Settings/Company', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Paramètres enregistrés avec succès')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Échec de l\'enregistrement'
      toast.error(message)
    }
  })

  return {
    updateCompanySettings
  }
}
