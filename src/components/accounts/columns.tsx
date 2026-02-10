import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Icons } from '../Icons'
import { DataTableColumnHeader } from '../shared/data-table/data-table-column-header'

export type AccountEntry = {
  id: string
  accountNumber: string
  label: string
  class: string | number
  type?: string
  balance?: number
}

const getTypeFromClass = (cls: string | number) => {
  const c = Number(cls)
  if (c >= 1 && c <= 5) return 'balance_sheet'
  if (c >= 6 && c <= 7) return 'income_statement'
  return 'other'
}

export const getColumns = (
  t: any,
  formatCurrency: (amount: number) => string,
  onEdit: (account: AccountEntry) => void,
  onDelete: (id: string) => void
): ColumnDef<AccountEntry>[] => [
    {
      accessorKey: 'accountNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('accounts.account_number')}
        />
      ),
      meta: {
        title: t('accounts.account_number')
      },
      cell: ({ row }) => (
        <div className="font-medium font-mono">
          {row.getValue('accountNumber')}
        </div>
      )
    },
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('accounts.label')} />
      ),
      meta: {
        title: t('accounts.label')
      },
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate" title={row.getValue('label')}>
          {row.getValue('label')}
        </div>
      )
    },
    {
      accessorKey: 'class',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('accounts.class')} />
      ),
      meta: {
        title: t('accounts.class')
      },
      cell: ({ row }) => (
        <div className="font-medium">
          {t('accounts.class_prefix')} {row.getValue('class')}
        </div>
      )
    },
    {
      id: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('accounts.type')} />
      ),
      meta: {
        title: t('accounts.type')
      },
      cell: ({ row }) => {
        const type = getTypeFromClass(row.getValue('class'))
        return <Badge variant="outline">{t(`accounts.types.${type}`) || type}</Badge>
      }
    },
    {
      accessorKey: 'balance',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('accounts.balance')}
          className="justify-end"
        />
      ),
      meta: {
        title: t('accounts.balance')
      },
      cell: ({ row }) => (
        <div className="text-end font-bold ltr:font-poppins rtl:font-somar">
          {formatCurrency(row.original.balance || 0)}
        </div>
      )
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
