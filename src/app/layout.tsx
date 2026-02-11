import type { Metadata } from 'next'
import { Providers } from '@/components/providers/Providers'
import { NextRootLayout } from '@/components/layout/NextRootLayout'

import '@/globals.css'

export const metadata: Metadata = {
    title: 'TOTALFisc Dashboard',
    description: 'Accounting and Fiscal Compliance for Algeria',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <NextRootLayout>{children}</NextRootLayout>
                </Providers>
            </body>
        </html>
    )
}
