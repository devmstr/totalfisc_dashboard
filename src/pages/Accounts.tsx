import { useTranslation } from 'react-i18next'
import { useI18n } from '../lib/i18n-context'
import { Icons } from '../components/Icons'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { DataTable } from '../components/shared/data-table/data-table'
import { getColumns, type AccountEntry } from '../components/accounts/columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AccountForm } from '../components/accounts/forms/account-form'
import { useAccountsMutation } from '../hooks/use-accounts-mutation'
import { useState } from 'react'

export const Accounts = () => {
  const { t } = useTranslation()
  const { language } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const { deleteAccount } = useAccountsMutation()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Mock data for demonstration
  const accounts: AccountEntry[] = [
    {
      id: 1,
      accountNumber: '101',
      label: 'Capital social',
      class: 1,
      type: 'equity',
      balance: 1000000
    },
    {
      id: 2,
      accountNumber: '411',
      label: 'Clients',
      class: 4,
      type: 'asset',
      balance: 150000
    },
    {
      id: 3,
      accountNumber: '401',
      label: 'Fournisseurs',
      class: 4,
      type: 'liability',
      balance: 80000
    },
    {
      id: 4,
      accountNumber: '512',
      label: 'Banque',
      class: 5,
      type: 'asset',
      balance: 50000
    },
    {
      id: 5,
      accountNumber: '600',
      label: 'Achats de marchandises',
      class: 6,
      type: 'expense',
      balance: 300000
    },
    {
      id: 6,
      accountNumber: '700',
      label: 'Ventes de marchandises',
      class: 7,
      type: 'revenue',
      balance: 500000
    }
  ]

  const handleEdit = (account: any) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      await deleteAccount.mutateAsync(id.toString())
    }
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('accounts.title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('accounts.subtitle')}</p>
        </div>
        <Button
          className="bg-primary text-white hover:bg-primary/90 shadow-md"
          onClick={() => setIsDialogOpen(true)}
        >
          <Icons.Plus className="w-4 h-4 me-2" />
          {t('accounts.new_account')}
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingAccount(null)
        }}
      >
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? t('accounts.edit_account') || 'Modifier le compte' : t('accounts.new_account')}
            </DialogTitle>
            <DialogDescription>
              {editingAccount
                ? "Modifiez les informations du compte."
                : "Ajoutez un nouveau compte au plan comptable."}
            </DialogDescription>
          </DialogHeader>
          <AccountForm
            id={editingAccount?.id?.toString()}
            initialData={editingAccount}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Accounts Table */}
      <Card className="p-4 shadow-sm border-border">
        <DataTable
          columns={getColumns(t, formatCurrency, handleEdit, handleDelete)}
          data={accounts}
          searchKey="label"
        />
      </Card>
    </div>
  )
}
