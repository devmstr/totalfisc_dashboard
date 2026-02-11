'use client'

import { ThemeProvider } from '@/lib/theme-provider'
import { I18nProvider } from '@/lib/i18n-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="light" storageKey="totalfisc-theme">
            <I18nProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <Toaster position="top-right" richColors />
                    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </QueryClientProvider>
            </I18nProvider>
        </ThemeProvider>
    )
}
