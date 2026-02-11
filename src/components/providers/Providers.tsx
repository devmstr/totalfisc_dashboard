'use client'

import { ThemeProvider } from '@/lib/theme-provider'
import { I18nProvider } from '@/lib/i18n-context'
import { TenantProvider } from '@/lib/tenant-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { toast } from 'sonner'
import type { TenantSwitcherData } from '@/components/layout/types'

export function Providers({ children }: { children: React.ReactNode }) {
    const handleTenantSwitch = async (tenant: TenantSwitcherData) => {
        // Invalidate all queries to refetch data for new tenant
        await queryClient.invalidateQueries()

        console.log('Switching to tenant:', tenant)
        toast.success(`Switched to ${tenant.name}`, {
            description: 'Refreshing data...'
        })

        // Example API call (uncomment when backend is ready):
        // await fetch('/api/tenant/switch', {
        //   method: 'POST',
        //   body: JSON.stringify({ tenantId: tenant.id })
        // })
    }

    const handleAddTenant = async () => {
        // Example: You can add API calls here to create a new tenant
        console.log('Adding new workspace')
        toast.success('Workspace created successfully!')

        // Example API call (uncomment when backend is ready):
        // await fetch('/api/tenant/create', {
        //   method: 'POST',
        //   body: JSON.stringify({ name: 'New Workspace' })
        // })
    }

    return (
        <ThemeProvider defaultTheme="light" storageKey="totalfisc-theme">
            <I18nProvider>
                <TenantProvider
                    onTenantSwitch={handleTenantSwitch}
                    onAddTenant={handleAddTenant}
                >
                    <QueryClientProvider client={queryClient}>
                        {children}
                        <Toaster position="top-right" richColors />
                        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                    </QueryClientProvider>
                </TenantProvider>
            </I18nProvider>
        </ThemeProvider>
    )
}

