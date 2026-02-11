import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { type TenantSwitcherData } from './types'
import { Icons } from '../Icons'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { useTenantStore, useTenantContext } from '@/lib/tenant-context'

type OrgSwitcherProps = {
  teams: TenantSwitcherData[]
}

export function OrgSwitcher({ teams }: OrgSwitcherProps) {
  const { activeTenant, setActiveTenant, setTenants, addTenant } =
    useTenantStore()
  const { onTenantSwitch, onAddTenant } = useTenantContext()
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newWorkspace, setNewWorkspace] = React.useState({
    name: '',
    plan: 'Free'
  })

  // Initialize tenants in store
  React.useEffect(() => {
    if (teams?.length) {
      setTenants(teams)
    }
  }, [teams, setTenants])

  // Use active tenant from store or fallback to first team
  const activeTeam = activeTenant || teams?.[0]

  if (!activeTeam) return null

  const ActiveIcon = activeTeam.icon
    ? Icons[activeTeam.icon]
    : Icons['Building']

  const activeName = activeTeam.name?.trim() || 'Workspace'
  const activePlan = activeTeam.plan?.trim() || 'Free'

  const handleTenantSwitch = async (team: TenantSwitcherData) => {
    setActiveTenant(team)
    if (onTenantSwitch) {
      await onTenantSwitch(team)
    }
  }

  const handleAddWorkspace = async () => {
    if (!newWorkspace.name.trim()) return

    const newTenant: TenantSwitcherData = {
      id: `org-${Date.now()}`,
      name: newWorkspace.name,
      plan: newWorkspace.plan,
      icon: 'Building'
    }

    addTenant(newTenant)
    setActiveTenant(newTenant)

    if (onAddTenant) {
      await onAddTenant()
    }

    // Reset form and close dialog
    setNewWorkspace({ name: '', plan: 'Free' })
    setIsAddDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            variant={'ghost'}
            className="w-full justify-start gap-2 px-2 py-1 text-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            <div
              className={cn(
                'flex aspect-square size-8.5 items-center justify-center overflow-hidden rounded-lg shrink-0',
                activeTeam.logo
                  ? 'bg-transparent'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              {activeTeam.logo ? (
                <img
                  src={activeTeam.logo}
                  alt={activeName}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <ActiveIcon className="relative size-5.5" />
              )}
            </div>

            <div className="grid flex-1 text-start text-sm leading-tight overflow-hidden">
              <span className="truncate font-semibold">{activeName}</span>
              <span className="truncate text-xs opacity-70">{activePlan}</span>
            </div>

            <ChevronsUpDown className="ms-auto size-4 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 rounded-lg"
          align="start"
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Workspaces
          </DropdownMenuLabel>

          {teams.map((team, index) => {
            const TeamIcon = team.icon ? Icons[team.icon] : Icons['Building']
            const teamName = team.name?.trim() || 'Workspace'
            const teamPlan = team.plan?.trim() || 'Free'
            const isActive = activeTeam.id === team.id

            return (
              <DropdownMenuItem
                key={`${team.id ?? teamName}-${index}`}
                onClick={() => handleTenantSwitch(team)}
                className={cn(
                  'gap-2 p-2',
                  isActive && 'bg-accent text-accent-foreground'
                )}
              >
                <div
                  className={cn(
                    'flex size-6 items-center justify-center overflow-hidden rounded-md border shrink-0',
                    team.logo ? 'bg-transparent' : 'bg-muted'
                  )}
                >
                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={teamName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <TeamIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {teamName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {teamPlan}
                  </span>
                </div>

                <DropdownMenuShortcut>⌘ {index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="gap-2 p-2 focus:bg-sidebar-accent"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <div className="flex size-6 items-center justify-center rounded-md border bg-background shrink-0">
              <Plus className="size-4 text-muted-foreground" />
            </div>
            <div className="font-medium text-muted-foreground text-sm">
              Add workspace
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Workspace Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to manage a different organization or
              company.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="My Company SARL"
                value={newWorkspace.name}
                onChange={(e) =>
                  setNewWorkspace({ ...newWorkspace, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workspace-plan">Plan</Label>
              <select
                id="workspace-plan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newWorkspace.plan}
                onChange={(e) =>
                  setNewWorkspace({ ...newWorkspace, plan: e.target.value })
                }
              >
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddWorkspace}
              disabled={!newWorkspace.name.trim()}
            >
              Create Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
