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
import { useQuotesMutation } from "@/hooks/use-quotes-mutation"
import { useTiers } from "@/hooks/use-tiers"
import { Icons } from "@/components/Icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const quoteFormSchema = z.object({
    quoteNumber: z.string().min(1, "Le numéro de devis est requis"),
    date: z.date(),
    expiryDate: z.date(),
    clientId: z.string().min(1, "Le client est requis"),
    estimatedAmountHT: z.coerce.number().min(0),
    status: z.enum(['draft', 'sent', 'accepted', 'rejected']).default('draft'),
})

type QuoteFormValues = z.infer<typeof quoteFormSchema>

interface QuoteFormProps {
    onSuccess?: () => void
}

export function QuoteForm({ onSuccess }: QuoteFormProps) {
    const { t } = useTranslation()
    const { createQuote } = useQuotesMutation()
    const { data: clients } = useTiers("client")

    const form = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteFormSchema) as any,
        defaultValues: {
            quoteNumber: "",
            date: new Date(),
            expiryDate: new Date(),
            clientId: "",
            estimatedAmountHT: 0,
            status: 'draft',
        },
    })

    const onSubmit = async (values: QuoteFormValues) => {
        try {
            await createQuote.mutateAsync(values)
            form.reset()
            onSuccess?.()
        } catch (error) {
            // Handled by hook
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quoteNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("sales.quote_number") || "Numéro de devis"}</FormLabel>
                                <FormControl>
                                    <Input placeholder="DV-2026-001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("sales.client")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un client" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients?.map((cl) => (
                                            <SelectItem key={cl.id} value={cl.id}>
                                                {cl.name} ({cl.code})
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
                                <FormLabel>{t("sales.date")}</FormLabel>
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
                        name="expiryDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t("sales.expiry_date") || "Date d'expiration"}</FormLabel>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="estimatedAmountHT"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("sales.estimated_amount_ht") || "Montant estimé HT"}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("common.status")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">{t("transactions.draft")}</SelectItem>
                                        <SelectItem value="sent">Envoyé</SelectItem>
                                        <SelectItem value="accepted">Accepté</SelectItem>
                                        <SelectItem value="rejected">Refusé</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={createQuote.isPending}
                        className="w-full sm:w-auto"
                    >
                        {createQuote.isPending && (
                            <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("common.save")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
