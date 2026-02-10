import { useTranslation } from 'react-i18next'
import { useI18n } from '../lib/i18n-context'
import { Icons } from '../components/Icons'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import { DataTable } from '../components/shared/data-table/data-table'
import { getColumns } from '../components/tiers/columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TierForm } from '../components/tiers/forms/tier-form'
import { useTiersMutation } from '../hooks/use-tiers-mutation'
import { useState } from 'react'

import { useTiers } from '../hooks/use-tiers'

export const Tiers = () => {
  const { t } = useTranslation()
  const { language } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [initialType, setInitialType] = useState<'client' | 'supplier'>('client')
  const [editingTier, setEditingTier] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tierToDelete, setTierToDelete] = useState<any>(null)
  const { deleteTier } = useTiersMutation()

  // Fetch all tiers
  const { data: tiers, isLoading } = useTiers()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Calculate stats
  const clientsCount = tiers?.filter(t => t.type === 'client').length || 0
  const suppliersCount = tiers?.filter(t => t.type === 'supplier').length || 0
  const totalBalance = tiers?.reduce((acc, curr) => acc + (curr.balance || 0), 0) || 0

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'client':
        return 'bg-blue-500'
      case 'supplier':
        return 'bg-purple-500'
      case 'both':
        return 'bg-emerald-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleEdit = (tier: any) => {
    setEditingTier(tier)
    setInitialType(tier.type === 'supplier' ? 'supplier' : 'client')
    setIsDialogOpen(true)
  }

  const handleDelete = (tier: any) => {
    setTierToDelete(tier)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (tierToDelete) {
      await deleteTier.mutateAsync(tierToDelete.id)
      setIsDeleteDialogOpen(false)
      setTierToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('tiers.title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('tiers.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={() => {
              setInitialType('supplier')
              setIsDialogOpen(true)
            }}
          >
            <Icons.Users className="w-4 h-4 me-2" />
            {t('tiers.new_supplier')}
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90 shadow-md"
            onClick={() => {
              setInitialType('client')
              setIsDialogOpen(true)
            }}
          >
            <Icons.Plus className="w-4 h-4 me-2" />
            {t('tiers.new_client')}
          </Button>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingTier(null)
        }}
      >
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>
              {editingTier
                ? t('tiers.edit_tier') || 'Modifier le tiers'
                : (initialType === 'client' ? t('tiers.new_client') : t('tiers.new_supplier'))}
            </DialogTitle>
            <DialogDescription>
              {editingTier
                ? "Modifiez les informations du tiers."
                : (initialType === 'client'
                  ? "Ajoutez un nouveau client à votre base de données."
                  : "Ajoutez un nouveau fournisseur à votre base de données.")}
            </DialogDescription>
          </DialogHeader>
          <TierForm
            id={editingTier?.id?.toString()}
            initialData={editingTier || { type: initialType === 'client' ? 'client' : 'supplier' }}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {tierToDelete?.name} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('tiers.total_clients')}
              </p>
              <p className="text-2xl font-bold mt-1 truncate">{clientsCount}</p>
            </div>
            <Icons.Users className="h-8 w-8 text-blue-500 opacity-50 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('tiers.total_suppliers')}
              </p>
              <p className="text-2xl font-bold mt-1 truncate">{suppliersCount}</p>
            </div>
            <Icons.ListOrdered className="h-8 w-8 text-purple-500 opacity-50 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('tiers.balance')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(totalBalance)}
              >
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <Icons.Banknote className="h-8 w-8 text-emerald-500 opacity-50 shrink-0" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 shadow-sm border-border">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-50">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('tiers.type')}
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('tiers.type')}</SelectItem>
                <SelectItem value="client">{t('tiers.client')}</SelectItem>
                <SelectItem value="supplier">{t('tiers.supplier')}</SelectItem>
                <SelectItem value="both">{t('tiers.both')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-50"></div>

          <div className="flex-none">
            <Button variant="outline">
              <Icons.FileText className="w-4 h-4 me-2" />
              {t('common.export')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Third Parties Table */}
      <Card className="p-4 shadow-sm border-border">
        <DataTable
          columns={getColumns(t, formatCurrency, getTypeColor, handleEdit, handleDelete)}
          data={tiers || []}
          searchKey="name"
          isLoading={isLoading}
        />
      </Card>
    </div>
  )
}
