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
import { getColumns } from '../components/purchases/columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PurchaseForm } from '../components/purchases/forms/purchase-form'
import { OrderForm } from '../components/purchases/forms/order-form'
import { usePurchasesMutation } from '../hooks/use-purchases-mutation'
import { useState } from 'react'

export const Purchases = () => {
  const { t } = useTranslation()
  const { language } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<any>(null)
  const { deleteInvoice } = usePurchasesMutation()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Mock data
  const invoices = [
    {
      id: 1,
      invoiceNumber: 'FACH-2026-001',
      date: '2026-02-01',
      dueDate: '2026-03-01',
      supplier: t('mock_data.suppliers.fournisseur_alpha'),
      amountHT: 15000.0,
      vat: 2850.0,
      amountTTC: 17850.0,
      status: 'paid'
    },
    {
      id: 2,
      invoiceNumber: 'FACH-2026-002',
      date: '2026-02-03',
      dueDate: '2026-03-03',
      supplier: t('mock_data.suppliers.societe_beta'),
      amountHT: 8500.0,
      vat: 1615.0,
      amountTTC: 10115.0,
      status: 'unpaid'
    },
    {
      id: 3,
      invoiceNumber: 'FACH-2026-003',
      date: '2026-02-05',
      dueDate: '2026-03-05',
      supplier: t('mock_data.suppliers.entreprise_gamma'),
      amountHT: 3200.0,
      vat: 608.0,
      amountTTC: 3808.0,
      status: 'partial'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500'
      case 'unpaid':
        return 'bg-amber-500 text-white'
      case 'partial':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleEdit = (invoice: any) => {
    setEditingPurchase(invoice)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      await deleteInvoice.mutateAsync(id.toString())
    }
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('purchases.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('purchases.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={() => setIsOrderDialogOpen(true)}
          >
            <Icons.FileText className="w-4 h-4 me-2" />
            {t('purchases.new_order')}
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90 shadow-md"
            onClick={() => setIsDialogOpen(true)}
          >
            <Icons.Plus className="w-4 h-4 me-2" />
            {t('purchases.new_invoice')}
          </Button>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingPurchase(null)
        }}
      >
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>
              {editingPurchase ? t('purchases.edit_invoice') || 'Modifier la facture' : t('purchases.new_invoice')}
            </DialogTitle>
            <DialogDescription>
              {editingPurchase
                ? "Modifiez les informations de la facture d'achat."
                : "Enregistrez une nouvelle facture d'achat."}
            </DialogDescription>
          </DialogHeader>
          <PurchaseForm
            id={editingPurchase?.id?.toString()}
            initialData={editingPurchase}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>{t('purchases.new_order') || 'Nouveau bon de commande'}</DialogTitle>
            <DialogDescription>
              Créez un nouveau bon de commande pour un fournisseur.
            </DialogDescription>
          </DialogHeader>
          <OrderForm onSuccess={() => setIsOrderDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('purchases.total_purchases')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(31773)}
              >
                {formatCurrency(31773)}
              </p>
            </div>
            <Icons.ListOrdered className="h-8 w-8 text-primary opacity-50 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('purchases.paid')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(17850)}
              >
                {formatCurrency(17850)}
              </p>
            </div>
            <Icons.Plus className="h-8 w-8 text-emerald-500 opacity-50 bg-emerald-100 rounded-full p-1 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('purchases.unpaid')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(10115)}
              >
                {formatCurrency(10115)}
              </p>
            </div>
            <Icons.Banknote className="h-8 w-8 text-amber-500 opacity-50 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('purchases.partial')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(3808)}
              >
                {formatCurrency(3808)}
              </p>
            </div>
            <Icons.ChevronDown className="h-8 w-8 text-blue-500 opacity-50 shrink-0" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 shadow-sm border-border">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-50">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('purchases.status')}
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.status')}</SelectItem>
                <SelectItem value="paid">{t('purchases.paid')}</SelectItem>
                <SelectItem value="unpaid">{t('purchases.unpaid')}</SelectItem>
                <SelectItem value="partial">
                  {t('purchases.partial')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-50">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('purchases.supplier')}
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('purchases.supplier')}</SelectItem>
                <SelectItem value="sup1">
                  {t('mock_data.suppliers.fournisseur_alpha')}
                </SelectItem>
                <SelectItem value="sup2">
                  {t('mock_data.suppliers.societe_beta')}
                </SelectItem>
                <SelectItem value="sup3">
                  {t('mock_data.suppliers.entreprise_gamma')}
                </SelectItem>
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

      {/* Invoices Table */}
      <Card className="p-4 shadow-sm border-border">
        <DataTable
          columns={getColumns(t, formatCurrency, getStatusColor, handleEdit, handleDelete)}
          data={invoices}
          searchKey="invoiceNumber"
        />
      </Card>
    </div>
  )
}
