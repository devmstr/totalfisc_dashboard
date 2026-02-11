'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  useState,
  useEffect,
  useSyncExternalStore,
  useLayoutEffect
} from 'react'
import { DirectionProvider } from '@radix-ui/react-direction'
import { useI18n } from '@/lib/i18n-context'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-store'

const emptySubscribe = () => () => {}

export function NextRootLayout({ children }: { children: React.ReactNode }) {
  const { direction } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Hydration-safe detection of client-side readiness
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  useEffect(() => {
    if (isMounted && !isAuthenticated && pathname !== '/login') {
      router.push('/login')
    }
    if (isMounted && isAuthenticated && pathname === '/login') {
      router.push('/')
    }
  }, [isAuthenticated, pathname, router, isMounted])

  // Map location to activePage ID for Sidebar highlighting
  const getActivePage = (pathname: string | null) => {
    if (!pathname || pathname === '/') return 'dashboard'
    const page = pathname.substring(1)
    const firstSegment = page.split('/')[0]
    return firstSegment || 'dashboard'
  }

  const activePage = getActivePage(pathname)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0)
  }

  useLayoutEffect(() => {
    if (!isMounted) return

    const updateSidebar = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    updateSidebar()
    window.addEventListener('resize', updateSidebar)
    return () => window.removeEventListener('resize', updateSidebar)
  }, [isMounted])

  const handleNavigate = (page: string) => {
    const to = page === 'dashboard' ? '/' : `/${page}`
    router.push(to)
    if (window.innerWidth < 1024) setIsSidebarOpen(false)
  }

  // Hydration check
  if (!isMounted) return null

  // Special case for login page
  if (pathname === '/login') {
    return <DirectionProvider dir={direction}>{children}</DirectionProvider>
  }

  // Prevent flash of protected content while redirecting
  if (!isAuthenticated) return null

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
