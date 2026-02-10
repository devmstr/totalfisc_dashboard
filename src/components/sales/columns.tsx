import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/Icons'
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header'

export type SaleInvoice = {
  id: string
  number: string
  date: string
  clientName?: string
  totalAmount: number
  status: string
}

export const getColumns = (
  t: any,
  formatCurrency: (amount: number) => string,
  getStatusColor: (status: string) => string,
  onEdit: (invoice: SaleInvoice) => void,
  onDelete: (id: string) => void
): ColumnDef<SaleInvoice>[] => [
    {
      accessorKey: 'number',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('sales.invoice_number')}
        />
      ),
      meta: {
        title: t('sales.invoice_number')
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('number')}</div>
      )
    },
    {
      accessorKey: 'clientName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('sales.client')} />
      ),
      meta: {
        title: t('sales.client')
      },
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue('clientName')}>
          {row.getValue('clientName') || t('common.unknown')}
        </div>
      )
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('sales.date')} />
      ),
      meta: {
        title: t('sales.date')
      },
      cell: ({ row }) => (
        <div className="text-muted-foreground">{new Date(row.getValue('date')).toLocaleDateString()}</div>
      )
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('sales.amount_ttc')}
          className="justify-end"
        />
      ),
      meta: {
        title: t('sales.amount_ttc')
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
          title={t('sales.status')}
          className="justify-center"
        />
      ),
      meta: {
        title: t('sales.status')
      },
      cell: ({ row }) => {
        const status = (row.getValue('status') as string).toLowerCase()
        return (
          <div className="flex justify-center">
            <Badge variant="default" className={getStatusColor(status)}>
              {t(`sales.${status}`) || status}
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
