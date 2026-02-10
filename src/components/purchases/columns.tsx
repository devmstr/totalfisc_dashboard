import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/Icons'
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header'

export type PurchaseInvoice = {
  id: string
  number: string
  date: string
  dueDate: string
  supplierName?: string
  totalAmount: number
  status: string
}

export const getColumns = (
  t: any,
  formatCurrency: (amount: number) => string,
  getStatusColor: (status: string) => string,
  onEdit: (invoice: PurchaseInvoice) => void,
  onDelete: (id: string) => void
): ColumnDef<PurchaseInvoice>[] => [
    {
      accessorKey: 'number',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('purchases.invoice_number')}
        />
      ),
      meta: {
        title: t('purchases.invoice_number')
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('number')}</div>
      )
    },
    {
      accessorKey: 'supplierName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('purchases.supplier')} />
      ),
      meta: {
        title: t('purchases.supplier')
      },
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue('supplierName')}>
          {row.getValue('supplierName') || t('common.unknown')}
        </div>
      )
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('purchases.date')} />
      ),
      meta: {
        title: t('purchases.date')
      },
      cell: ({ row }) => (
        <div className="text-muted-foreground">{new Date(row.getValue('date')).toLocaleDateString()}</div>
      )
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('purchases.due_date')} />
      ),
      meta: {
        title: t('purchases.due_date')
      },
      cell: ({ row }) => (
        <div className="text-muted-foreground">{new Date(row.getValue('dueDate')).toLocaleDateString()}</div>
      )
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('purchases.amount_ttc')}
          className="justify-end"
        />
      ),
      meta: {
        title: t('purchases.amount_ttc')
      },
      cell: ({ row }) => (
        <div className="text-end font-bold ltr:font-poppins rtl:font-somar">
          {formatCurrency(row.getValue('totalAmount'))}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('purchases.status')}
          className="justify-center"
        />
      ),
      meta: {
        title: t('purchases.status')
      },
      cell: ({ row }) => {
        const status = (row.getValue('status') as string).toLowerCase()
        return (
          <div className="flex justify-center">
            <Badge variant="default" className={getStatusColor(status)}>
              {t(`purchases.${status}`) || status}
            </Badge>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('common.actions')}
          className="justify-center"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(row.original)}
          >
            <Icons.Edit className="w-4 h-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(row.original.id)}
          >
            <Icons.Trash className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      )
    }
  ]
