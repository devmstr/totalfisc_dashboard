# OrgSwitcher Architecture

## Component Hierarchy

```
App (layout.tsx)
  └─ Providers.tsx
      ├─ ThemeProvider
      ├─ I18nProvider
      └─ TenantProvider ← NEW
          ├─ onTenantSwitch callback
          └─ onAddTenant callback
              └─ QueryClientProvider
                  └─ App Content
                      └─ Header.tsx
                          └─ OrgSwitcher.tsx ← ENHANCED
                              ├─ DropdownMenu (workspace list)
                              └─ Dialog (add workspace)
```

## State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interaction                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    OrgSwitcher.tsx                          │
│  • Renders dropdown menu                                    │
│  • Handles user clicks                                      │
│  • Opens add workspace dialog                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  tenant-context.tsx                         │
│  ┌───────────────────────────────────────────────────┐     │
│  │         Zustand Store (Persisted)                 │     │
│  │  • activeTenant                                   │     │
│  │  • tenants[]                                      │     │
│  │  • setActiveTenant()                              │     │
│  │  • addTenant()                                    │     │
│  └───────────────────────────────────────────────────┘     │
│                              │                              │
│  ┌───────────────────────────────────────────────────┐     │
│  │         React Context (Callbacks)                 │     │
│  │  • onTenantSwitch()                               │     │
│  │  • onAddTenant()                                  │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Providers.tsx                            │
│  • handleTenantSwitch() → API call, toast                  │
│  • handleAddTenant() → API call, toast                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   localStorage                              │
│  Key: "tenant-storage"                                      │
│  Value: { activeTenant, tenants }                           │
└─────────────────────────────────────────────────────────────┘
```

## Data Types

```typescript
// Core tenant data structure
type TenantSwitcherData = {
  id: string | number
  name: string
  logo?: string           // URL to logo image
  icon?: keyof typeof Icons  // Icon name from Icons component
  plan?: string          // e.g., "Free", "Pro", "Enterprise"
}

// Zustand store state
interface TenantState {
  activeTenant: TenantSwitcherData | null
  tenants: TenantSwitcherData[]
  setActiveTenant: (tenant: TenantSwitcherData) => void
  setTenants: (tenants: TenantSwitcherData[]) => void
  addTenant: (tenant: TenantSwitcherData) => void
}

// Context callbacks
interface TenantContextType {
  onTenantSwitch?: (tenant: TenantSwitcherData) => void | Promise<void>
  onAddTenant?: () => void | Promise<void>
}
```

## Interaction Flow

### Switching Tenant

```
1. User clicks workspace in dropdown
   ↓
2. OrgSwitcher.handleTenantSwitch(team)
   ↓
3. useTenantStore.setActiveTenant(team)
   ↓
4. Zustand updates state + localStorage
   ↓
5. useTenantContext.onTenantSwitch(team)
   ↓
6. Providers.handleTenantSwitch(team)
   ↓
7. API call (optional) + toast notification
   ↓
8. UI updates (active state, re-renders)
```

### Adding Workspace

```
1. User clicks "Add workspace"
   ↓
2. Dialog opens with form
   ↓
3. User fills name and plan
   ↓
4. User clicks "Create Workspace"
   ↓
5. OrgSwitcher.handleAddWorkspace()
   ↓
6. useTenantStore.addTenant(newTenant)
   ↓
7. useTenantStore.setActiveTenant(newTenant)
   ↓
8. Zustand updates state + localStorage
   ↓
9. useTenantContext.onAddTenant()
   ↓
10. Providers.handleAddTenant()
   ↓
11. API call (optional) + toast notification
   ↓
12. Dialog closes, UI updates
```

## Persistence

The tenant state is automatically persisted to localStorage using Zustand's persist middleware:

```typescript
export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      // ... state and actions
    }),
    {
      name: 'tenant-storage'  // localStorage key
    }
  )
)
```

**Storage format:**
```json
{
  "state": {
    "activeTenant": {
      "id": "org1",
      "name": "TotalFisc Demo",
      "plan": "Enterprise",
      "icon": "Building"
    },
    "tenants": [
      { "id": "org1", "name": "TotalFisc Demo", ... },
      { "id": "org2", "name": "My Company SARL", ... }
    ]
  },
  "version": 0
}
```

## Integration Points

### 1. Reading Active Tenant

Any component can access the active tenant:

```typescript
import { useTenantStore } from '@/lib/tenant-context'

function MyComponent() {
  const { activeTenant } = useTenantStore()
  
  return <div>Current: {activeTenant?.name}</div>
}
```

### 2. Backend API Calls

Update callbacks in `Providers.tsx`:

```typescript
const handleTenantSwitch = async (tenant: TenantSwitcherData) => {
  // Call your backend
  await fetch('/api/tenant/switch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: tenant.id })
  })
  
  toast.success(`Switched to ${tenant.name}`)
}
```

### 3. Fetching Tenants from Backend

Update `Header.tsx` to fetch from API:

```typescript
const { data: teams } = useQuery({
  queryKey: ['tenants'],
  queryFn: async () => {
    const res = await fetch('/api/tenant/list')
    return res.json()
  }
})

<OrgSwitcher teams={teams || []} />
```
