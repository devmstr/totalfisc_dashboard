import * as React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type TenantSwitcherData } from '@/components/layout/types'

interface TenantState {
    activeTenant: TenantSwitcherData | null
    tenants: TenantSwitcherData[]
    setActiveTenant: (tenant: TenantSwitcherData) => void
    setTenants: (tenants: TenantSwitcherData[]) => void
    addTenant: (tenant: TenantSwitcherData) => void
}

export const useTenantStore = create<TenantState>()(
    persist(
        (set) => ({
            activeTenant: null,
            tenants: [],
            setActiveTenant: (tenant) => set({ activeTenant: tenant }),
            setTenants: (tenants) =>
                set((state) => ({
                    tenants,
                    activeTenant: state.activeTenant || tenants[0] || null
                })),
            addTenant: (tenant) =>
                set((state) => ({
                    tenants: [...state.tenants, tenant]
                }))
        }),
        {
            name: 'tenant-storage'
        }
    )
)

// Context for tenant-related callbacks and actions
interface TenantContextType {
    onTenantSwitch?: (tenant: TenantSwitcherData) => void | Promise<void>
    onAddTenant?: () => void | Promise<void>
}

const TenantContext = React.createContext<TenantContextType>({})

export const useTenantContext = () => React.useContext(TenantContext)

interface TenantProviderProps {
    children: React.ReactNode
    onTenantSwitch?: (tenant: TenantSwitcherData) => void | Promise<void>
    onAddTenant?: () => void | Promise<void>
}

export const TenantProvider = ({
    children,
    onTenantSwitch,
    onAddTenant
}: TenantProviderProps) => {
    return (
        <TenantContext.Provider value={{ onTenantSwitch, onAddTenant }}>
            {children}
        </TenantContext.Provider>
    )
}
