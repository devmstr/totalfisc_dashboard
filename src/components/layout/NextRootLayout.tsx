'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { DirectionProvider } from '@radix-ui/react-direction'
import { useI18n } from '@/lib/i18n-context'
import { useRouter, usePathname } from 'next/navigation'

export function NextRootLayout({ children }: { children: React.ReactNode }) {
    const { direction } = useI18n()
    const router = useRouter()
    const pathname = usePathname()

    // Map location to activePage ID for Sidebar highlighting
    const getActivePage = (pathname: string) => {
        if (pathname === '/') return 'dashboard'
        // Remove leading slash
        const page = pathname.substring(1)
        // Handle nested routes if necessary (e.g. /journal-entries/1 -> journal-entries)
        const firstSegment = page.split('/')[0]
        return firstSegment || 'dashboard'
    }

    const activePage = getActivePage(pathname || '/')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isScrolled, setIsScrolled] = useState(false)

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 0)
    }

    // Auto-close sidebar on small screens
    useEffect(() => {
        // Set initial state
        setIsSidebarOpen(window.innerWidth >= 1024)

        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false)
            } else {
                setIsSidebarOpen(true)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleNavigate = (page: string) => {
        const to = page === 'dashboard' ? '/' : `/${page}`
        router.push(to)
        if (window.innerWidth < 1024) setIsSidebarOpen(false)
    }

    return (
        <DirectionProvider dir={direction}>
            <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    activePage={activePage}
                    onNavigate={handleNavigate}
                />

                <main
                    className={cn(
                        'h-full flex-1 flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden',
                        isSidebarOpen ? 'lg:ms-64' : 'ms-0'
                    )}
                >
                    <Header
                        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        activePage={activePage}
                        isScrolled={isScrolled}
                    />
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea
                            className="h-full w-full"
                            viewportProps={{ onScroll: handleScroll }}
                        >
                            {children}
                        </ScrollArea>
                    </div>
                </main>
            </div>
        </DirectionProvider>
    )
}
