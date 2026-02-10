import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePurchasesMutation } from "@/hooks/use-purchases-mutation"
import { useTiers } from "@/hooks/use-tiers"
import { Icons } from "@/components/Icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const purchaseFormSchema = z.object({
    invoiceNumber: z.string().min(1, "Le numéro de facture est requis"),
    date: z.date(),
    dueDate: z.date(),
    supplierId: z.string().min(1, "Le fournisseur est requis"),
    amountHT: z.coerce.number().min(0),
    vatAmount: z.coerce.number().min(0),
    amountTTC: z.coerce.number().min(0),
})

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>

interface PurchaseFormProps {
    id?: string
    initialData?: Partial<PurchaseFormValues>
    onSuccess?: () => void
}

export function PurchaseForm({ id, initialData, onSuccess }: PurchaseFormProps) {
    const { t } = useTranslation()
    const { createInvoice, updateInvoice } = usePurchasesMutation()
    const { data: suppliers } = useTiers("supplier")

    const form = useForm<PurchaseFormValues>({
        resolver: zodResolver(purchaseFormSchema) as any,
        defaultValues: {
            invoiceNumber: initialData?.invoiceNumber ?? "",
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : new Date(),
            supplierId: initialData?.supplierId ?? "",
            amountHT: initialData?.amountHT ?? 0,
            vatAmount: initialData?.vatAmount ?? 0,
            amountTTC: initialData?.amountTTC ?? 0,
        },
    })

    const onSubmit = async (values: PurchaseFormValues) => {
        try {
            if (id) {
                await updateInvoice.mutateAsync({ id, data: values })
            } else {
                await createInvoice.mutateAsync(values)
            }
            form.reset()
            onSuccess?.()
        } catch (error) {
            // Handled by hook
        }
    }

    const isPending = createInvoice.isPending || updateInvoice.isPending

    // Auto-calculate TTC

    const calculateTTC = () => {
        const ht = form.getValues("amountHT")
        const vat = form.getValues("vatAmount")
        const ttc = Number(ht) + Number(vat)
        form.setValue("amountTTC", ttc)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("purchases.invoice_number")}</FormLabel>
                                <FormControl>
                                    <Input placeholder="FACH-2026-001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("purchases.supplier")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un fournisseur" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {suppliers?.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} ({s.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t("purchases.date")}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Choisir une date</span>
                                                )}
                                                <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t("purchases.due_date")}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Choisir une date</span>
                                                )}
                                                <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                    <FormField
                        control={form.control}
                        name="amountHT"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("purchases.amount_ht")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            calculateTTC()
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="vatAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("purchases.vat")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            calculateTTC()
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amountTTC"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("purchases.amount_ttc")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} readOnly className="bg-muted" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        {isPending && (
                            <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("common.save")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
