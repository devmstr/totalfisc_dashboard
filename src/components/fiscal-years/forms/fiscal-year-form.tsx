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
import { useFiscalYearsMutation } from "@/hooks/use-fiscal-years-mutation"
import { Icons } from "@/components/Icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const fiscalYearFormSchema = z.object({
    yearNumber: z.coerce.number().min(2000).max(2100),
    startDate: z.date(),
    endDate: z.date(),
    status: z.enum(["Open", "Locked", "Closed"]).default("Open"),
})

type FiscalYearFormValues = z.infer<typeof fiscalYearFormSchema>

interface FiscalYearFormProps {
    id?: string
    initialData?: Partial<FiscalYearFormValues>
    onSuccess?: () => void
}

export function FiscalYearForm({ id, initialData, onSuccess }: FiscalYearFormProps) {
    const { t } = useTranslation()
    const { createFiscalYear, updateFiscalYear } = useFiscalYearsMutation()

    const form = useForm<FiscalYearFormValues>({
        resolver: zodResolver(fiscalYearFormSchema) as any,
        defaultValues: {
            yearNumber: initialData?.yearNumber ?? new Date().getFullYear(),
            startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(new Date().getFullYear(), 0, 1),
            endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(new Date().getFullYear(), 11, 31),
            status: (initialData?.status as any) ?? "Open",
        },
    })

    const onSubmit = async (values: FiscalYearFormValues) => {
        try {
            if (id) {
                await updateFiscalYear.mutateAsync({ id, data: values })
            } else {
                await createFiscalYear.mutateAsync(values)
            }
            form.reset()
            onSuccess?.()
        } catch (error) {
            // Handled by hook
        }
    }

    const isPending = createFiscalYear.isPending || updateFiscalYear.isPending

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="yearNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("fiscal_years.year")}</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t("fiscal_years.start_date")}</FormLabel>
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
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t("fiscal_years.end_date")}</FormLabel>
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

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("fiscal_years.status")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Open">{t("fiscal_years.status_open")}</SelectItem>
                                    <SelectItem value="Locked">Verrouillé</SelectItem>
                                    <SelectItem value="Closed">{t("fiscal_years.status_closed")}</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
