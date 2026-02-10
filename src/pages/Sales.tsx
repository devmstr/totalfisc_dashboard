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
import { getColumns } from '../components/sales/columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SaleForm } from '../components/sales/forms/sale-form'
import { QuoteForm } from '../components/sales/forms/quote-form'
import { useSalesMutation } from '../hooks/use-sales-mutation'
import { useState } from 'react'

export const Sales = () => {
  const { t } = useTranslation()
  const { language } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<any>(null)
  const { deleteInvoice } = useSalesMutation()

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
      invoiceNumber: 'FAC-2026-001',
      date: '2026-02-01',
      dueDate: '2026-03-01',
      client: t('mock_data.clients.client_abc'),
      amountHT: 10000.0,
      vat: 1900.0,
      amountTTC: 11900.0,
      status: 'paid'
    },
    {
      id: 2,
      invoiceNumber: 'FAC-2026-002',
      date: '2026-02-03',
      dueDate: '2026-03-03',
      client: t('mock_data.clients.entreprise_xyz'),
      amountHT: 25000.0,
      vat: 4750.0,
      amountTTC: 29750.0,
      status: 'unpaid'
    },
    {
      id: 3,
      invoiceNumber: 'FAC-2026-003',
      date: '2026-02-05',
      dueDate: '2026-01-15',
      client: t('mock_data.clients.societe_def'),
      amountHT: 5000.0,
      vat: 950.0,
      amountTTC: 5950.0,
      status: 'overdue'
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
      case 'overdue':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleEdit = (invoice: any) => {
    setEditingSale(invoice)
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
            {t('sales.title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('sales.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={() => setIsQuoteDialogOpen(true)}
          >
            <Icons.FileText className="w-4 h-4 me-2" />
            {t('sales.new_quote')}
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90 shadow-md"
            onClick={() => setIsDialogOpen(true)}
          >
            <Icons.Plus className="w-4 h-4 me-2" />
            {t('sales.new_invoice')}
          </Button>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingSale(null)
        }}
      >
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>
              {editingSale ? t('sales.edit_invoice') || 'Modifier la facture' : t('sales.new_invoice')}
            </DialogTitle>
            <DialogDescription>
              {editingSale
                ? "Modifiez les informations de la facture de vente."
                : "Enregistrez une nouvelle facture de vente."}
            </DialogDescription>
          </DialogHeader>
          <SaleForm
            id={editingSale?.id?.toString()}
            initialData={editingSale}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>{t('sales.new_quote')}</DialogTitle>
            <DialogDescription>
              Créez un nouveau devis pour un client.
            </DialogDescription>
          </DialogHeader>
          <QuoteForm onSuccess={() => setIsQuoteDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('sales.total_sales')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(125545)}
              >
                {formatCurrency(125545)}
              </p>
            </div>
            <Icons.ShoppingCart className="h-8 w-8 text-primary opacity-50 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('sales.paid')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(11900)}
              >
                {formatCurrency(11900)}
              </p>
            </div>
            <Icons.Plus className="h-8 w-8 text-emerald-500 opacity-50 bg-emerald-100 rounded-full p-1 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('sales.unpaid')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(29750)}
              >
                {formatCurrency(29750)}
              </p>
            </div>
            <Icons.Banknote className="h-8 w-8 text-amber-500 opacity-50 shrink-0" />
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {t('sales.overdue')}
              </p>
              <p
                className="text-2xl font-bold mt-1 ltr:font-poppins rtl:font-somar truncate"
                title={formatCurrency(5950)}
              >
                {formatCurrency(5950)}
              </p>
            </div>
            <Icons.ChevronDown className="h-8 w-8 text-red-500 opacity-50 shrink-0" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 shadow-sm border-border">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-50">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('sales.status')}
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.status')}</SelectItem>
                <SelectItem value="paid">{t('sales.paid')}</SelectItem>
                <SelectItem value="unpaid">{t('sales.unpaid')}</SelectItem>
                <SelectItem value="partial">{t('sales.partial')}</SelectItem>
                <SelectItem value="overdue">{t('sales.overdue')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-50">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('sales.client')}
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sales.client')}</SelectItem>
                <SelectItem value="cli1">
                  {t('mock_data.clients.client_abc')}
                </SelectItem>
                <SelectItem value="cli2">
                  {t('mock_data.clients.entreprise_xyz')}
                </SelectItem>
                <SelectItem value="cli3">
                  {t('mock_data.clients.societe_def')}
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
