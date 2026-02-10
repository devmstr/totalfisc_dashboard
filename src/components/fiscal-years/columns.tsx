import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Icons } from '../Icons'
import { DataTableColumnHeader } from '../shared/data-table/data-table-column-header'

export type FiscalYearEntry = {
  id: string
  yearNumber: number
  startDate: string
  endDate: string
  status: string
}

export const getColumns = (
  t: any,
  onEdit: (entry: FiscalYearEntry) => void,
  onDelete: (id: string) => void,
  onCloseYear: (id: string) => void
): ColumnDef<FiscalYearEntry>[] => [
    {
      accessorKey: 'yearNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('fiscal_years.year')} />
      ),
      meta: {
        title: t('fiscal_years.year')
      },
      cell: ({ row }) => (
        <div className="font-bold text-lg ltr:font-poppins rtl:font-somar">
          {row.getValue('yearNumber')}
        </div>
      )
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('fiscal_years.start_date')}
        />
      ),
      meta: {
        title: t('fiscal_years.start_date')
      },
      cell: ({ row }) => (
        <div>{new Date(row.getValue('startDate')).toLocaleDateString()}</div>
      )
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('fiscal_years.end_date')}
        />
      ),
      meta: {
        title: t('fiscal_years.end_date')
      },
      cell: ({ row }) => (
        <div>{new Date(row.getValue('endDate')).toLocaleDateString()}</div>
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('fiscal_years.status')}
          className="justify-center"
        />
      ),
      meta: {
        title: t('fiscal_years.status')
      },
      cell: ({ row }) => {
        const status = (row.getValue('status') as string).toLowerCase()
        return (
          <div className="flex justify-center">
            <Badge
              variant={status === 'open' ? 'default' : 'secondary'}
              className={status === 'open' ? 'bg-primary' : 'bg-secondary'}
            >
              {t(`fiscal_years.status_${status}`) || status}
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
      cell: ({ row }) => {
        const isClosed = row.original.status.toLowerCase() !== 'open'
        return (
          <div className="flex items-center justify-center gap-2">
            {!isClosed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(row.original)}
              >
                <Icons.Edit className="w-4 h-4 text-primary" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!isClosed) {
                  onCloseYear?.(row.original.id)
                }
              }}
            >
              {!isClosed ? (
                <>
                  <Icons.Lock className="w-4 h-4 me-2" />
                  {t('fiscal_years.close_year')}
                </>
              ) : (
                <>
                  <Icons.Eye className="w-4 h-4 me-2" />
                  {t('fiscal_years.view_archive')}
                </>
              )}
            </Button>
            {!isClosed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(row.original.id)}
              >
                <Icons.Trash className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        )
      }
    }
  ]
