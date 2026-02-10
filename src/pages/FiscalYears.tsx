import { useTranslation } from 'react-i18next'
import { Icons } from '../components/Icons'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { DataTable } from '../components/shared/data-table/data-table'
import {
  getColumns,
  type FiscalYearEntry
} from '../components/fiscal-years/columns'
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
import { FiscalYearForm } from '../components/fiscal-years/forms/fiscal-year-form'
import { useFiscalYearsMutation } from '../hooks/use-fiscal-years-mutation'
import { useFiscalYears } from '../hooks/use-fiscal-years'
import { useState } from 'react'

export const FiscalYears = () => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingYear, setEditingYear] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [yearToDelete, setYearToDelete] = useState<string | null>(null)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [yearToClose, setYearToClose] = useState<string | null>(null)
  const { deleteFiscalYear, updateFiscalYear } = useFiscalYearsMutation()
  const { data: fiscalYears, isLoading } = useFiscalYears()

  const handleEdit = (year: any) => {
    setEditingYear(year)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setYearToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (yearToDelete) {
      await deleteFiscalYear.mutateAsync(yearToDelete)
      setIsDeleteDialogOpen(false)
      setYearToDelete(null)
    }
  }

  const handleCloseYear = (id: string) => {
    setYearToClose(id)
    setIsCloseDialogOpen(true)
  }

  const confirmClose = async () => {
    if (yearToClose) {
      await updateFiscalYear.mutateAsync({
        id: yearToClose,
        data: { status: 'Closed' } as any
      })
      setIsCloseDialogOpen(false)
      setYearToClose(null)
    }
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('fiscal_years.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('fiscal_years.subtitle')}
          </p>
        </div>
        <Button
          className="bg-primary text-white hover:bg-primary/90 shadow-md"
          onClick={() => setIsDialogOpen(true)}
        >
          <Icons.Plus className="w-4 h-4 me-2" />
          {t('fiscal_years.new_year')}
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingYear(null)
        }}
      >
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>
              {editingYear ? t('fiscal_years.edit_year') || 'Modifier l\'exercice' : t('fiscal_years.new_year')}
            </DialogTitle>
            <DialogDescription>
              {editingYear
                ? "Modifiez les informations de l'exercice fiscal."
                : "Créez un nouvel exercice fiscal pour votre comptabilité."}
            </DialogDescription>
          </DialogHeader>
          <FiscalYearForm
            id={editingYear?.id?.toString()}
            initialData={editingYear}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the fiscal year and remove your data from our servers.
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

      <AlertDialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clôturer l'exercice ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir clôturer cet exercice ? Cette action est irréversible et vous ne pourrez plus ajouter ou modifier d'écritures.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="bg-amber-600 text-white hover:bg-amber-700">
              Clôturer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fiscal Years Table */}
      <Card className="p-4 shadow-sm border-border">
        <DataTable
          columns={getColumns(t, handleEdit, handleDelete, handleCloseYear)}
          data={fiscalYears || []}
          isLoading={isLoading}
        />
      </Card>
    </div >
  )
}
