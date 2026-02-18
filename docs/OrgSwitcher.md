# Organization Switcher (OrgSwitcher)

## Overview
The `OrgSwitcher` component provides a complete multi-tenant/organization switching solution with persistence, visual feedback, and extensibility.

## Features

### ✅ Completed Features

1. **Tenant Switching**
   - Switch between multiple organizations/workspaces
   - Visual indication of the active workspace
   - Keyboard shortcuts (⌘1, ⌘2, etc.)
   - Smooth transitions with toast notifications

2. **Persistent State**
   - Active tenant is saved to localStorage
   - Survives page refreshes and browser sessions
   - Managed via Zustand store

3. **Add Workspace Dialog**
   - Modal dialog to create new workspaces
   - Form validation (name required)
   - Plan selection (Free, Pro, Enterprise)
   - Automatic activation of newly created workspace

4. **Visual Feedback**
   - Active workspace highlighted in dropdown
   - Logo/icon support for each workspace
   - Plan badge display
   - Responsive design

5. **Extensibility**
   - Callback hooks for tenant switching (`onTenantSwitch`)
   - Callback hooks for adding tenants (`onAddTenant`)
   - Easy integration with backend APIs

## Architecture

### Components

1. **`OrgSwitcher.tsx`** - Main UI component
   - Dropdown menu with workspace list
   - Add workspace dialog
   - Integrates with tenant store

2. **`tenant-context.tsx`** - State management
   - Zustand store for tenant state
   - React context for callbacks
   - Persistence middleware

3. **`Providers.tsx`** - App-level integration
   - Wraps app with `TenantProvider`
   - Defines callback handlers
   - Toast notifications

### Data Flow

```
User clicks workspace
    ↓
OrgSwitcher calls handleTenantSwitch()
    ↓
Updates Zustand store (persisted to localStorage)
    ↓
Calls onTenantSwitch callback (from TenantProvider)
    ↓
Callback can make API calls, update app state, etc.
    ↓
Toast notification shown
```

## Usage

### Basic Usage

The OrgSwitcher is already integrated in the Header component:

```tsx
import { OrgSwitcher } from './OrgSwitcher'

const teams = [
  {
    id: 'org1',
    name: 'TotalFisc Demo',
    plan: 'Enterprise',
    icon: 'Building'
  },
  {
    id: 'org2',
    name: 'My Company SARL',
    plan: 'Pro',
    icon: 'Building'
  }
]

<OrgSwitcher teams={teams} />
```

### With Custom Callbacks

Callbacks are defined in `Providers.tsx`:

```tsx
const handleTenantSwitch = async (tenant: TenantSwitcherData) => {
  console.log('Switching to tenant:', tenant)
  toast.success(`Switched to ${tenant.name}`)
  
  // Add your API call here:
  await fetch('/api/tenant/switch', {
    method: 'POST',
    body: JSON.stringify({ tenantId: tenant.id })
  })
}

const handleAddTenant = async () => {
  console.log('Adding new workspace')
  toast.success('Workspace created successfully!')
  
  // Add your API call here:
  await fetch('/api/tenant/create', {
    method: 'POST',
    body: JSON.stringify({ name: 'New Workspace' })
  })
}

<TenantProvider
  onTenantSwitch={handleTenantSwitch}
  onAddTenant={handleAddTenant}
>
  {children}
</TenantProvider>
```

### Accessing Active Tenant

Use the `useTenantStore` hook anywhere in your app:

```tsx
import { useTenantStore } from '@/lib/tenant-context'

function MyComponent() {
  const { activeTenant } = useTenantStore()
  
  return <div>Current workspace: {activeTenant?.name}</div>
}
```

## Backend Integration

### API Endpoints to Implement

1. **Switch Tenant** - `POST /api/tenant/switch`
   ```json
   {
     "tenantId": "org1"
   }
   ```

2. **Create Tenant** - `POST /api/tenant/create`
   ```json
   {
     "name": "New Company",
     "plan": "Pro"
   }
   ```

3. **List Tenants** - `GET /api/tenant/list`
   ```json
   [
     {
       "id": "org1",
       "name": "TotalFisc Demo",
       "plan": "Enterprise",
       "logo": "https://...",
       "icon": "Building"
     }
   ]
   ```

### Example Integration

Update `Header.tsx` to fetch tenants from API:

```tsx
import { useTenantStore } from '@/lib/tenant-context'
import { useQuery } from '@tanstack/react-query'

export const Header = () => {
  const { setTenants } = useTenantStore()
  
  const { data: teams } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const res = await fetch('/api/tenant/list')
      return res.json()
    },
    onSuccess: (data) => {
      setTenants(data)
    }
  })
  
  return <OrgSwitcher teams={teams || []} />
}
```

## Customization

### Adding Logo Support

Update the teams data to include logo URLs:

```tsx
const teams = [
  {
    id: 'org1',
    name: 'TotalFisc Demo',
    plan: 'Enterprise',
    logo: 'https://example.com/logo.png'
  }
]
```

### Custom Icons

Use any icon from the `Icons` component:

```tsx
const teams = [
  {
    id: 'org1',
    name: 'TotalFisc Demo',
    plan: 'Enterprise',
    icon: 'Building' // or 'Store', 'Factory', etc.
  }
]
```

### Styling

The component uses Tailwind CSS classes and can be customized via:
- `className` props on Button, DropdownMenu, etc.
- CSS variables for colors (defined in `globals.css`)
- Theme context for dark/light mode

## Testing

### Manual Testing Checklist

- [ ] Switch between workspaces
- [ ] Active workspace is highlighted
- [ ] Active workspace persists after refresh
- [ ] Add new workspace dialog opens
- [ ] Form validation works (name required)
- [ ] New workspace is created and activated
- [ ] Toast notifications appear
- [ ] Keyboard shortcuts work (⌘1, ⌘2)
- [ ] Responsive on mobile/desktop

### Automated Testing (TODO)

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgSwitcher } from './OrgSwitcher'

test('switches workspace on click', () => {
  const teams = [
    { id: '1', name: 'Workspace 1', plan: 'Free' },
    { id: '2', name: 'Workspace 2', plan: 'Pro' }
  ]
  
  render(<OrgSwitcher teams={teams} />)
  
  fireEvent.click(screen.getByText('Workspace 2'))
  
  // Assert active workspace changed
})
```

## Future Enhancements

- [ ] Search/filter workspaces
- [ ] Workspace settings/preferences
- [ ] Role-based access control per workspace
- [ ] Workspace invitations
- [ ] Workspace analytics/usage stats
- [ ] Workspace archiving
- [ ] Bulk workspace operations
