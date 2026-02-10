import { useTranslation } from 'react-i18next'
import { useI18n } from '../lib/i18n-context'
import { Icons } from '../components/Icons'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { DataTable } from '../components/shared/data-table/data-table'
import { getColumns } from '../components/accounts/columns'
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
import { AccountForm } from '../components/accounts/forms/account-form'
import { useAccountsMutation } from '../hooks/use-accounts-mutation'
import { useAccounts } from '../hooks/use-accounts'
import { useState } from 'react'

export const Accounts = () => {
  const { t } = useTranslation()
  const { language } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null)
  const { deleteAccount } = useAccountsMutation()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const { data: accounts, isLoading } = useAccounts()

  const handleEdit = (account: any) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAccountToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (accountToDelete) {
      await deleteAccount.mutateAsync(accountToDelete)
      setIsDeleteDialogOpen(false)
      setAccountToDelete(null)
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account and remove your data from our servers.
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

      {/* Accounts Table */}
      <Card className="p-4 shadow-sm border-border">
        <DataTable
          columns={getColumns(t, formatCurrency, handleEdit, handleDelete)}
          data={accounts || []}
          searchKey="label"
          isLoading={isLoading}
        />
      </Card>
    </div>
  )
}
