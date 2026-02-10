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
import { useOrdersMutation } from "@/hooks/use-orders-mutation"
import { useTiers } from "@/hooks/use-tiers"
import { Icons } from "@/components/Icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const orderFormSchema = z.object({
    orderNumber: z.string().min(1, "Le numéro de commande est requis"),
    date: z.date(),
    expectedDeliveryDate: z.date(),
    supplierId: z.string().min(1, "Le fournisseur est requis"),
    estimatedAmount: z.coerce.number().min(0),
    status: z.enum(['draft', 'sent', 'received', 'cancelled']).default('draft'),
})

type OrderFormValues = z.infer<typeof orderFormSchema>

interface OrderFormProps {
    onSuccess?: () => void
}

export function OrderForm({ onSuccess }: OrderFormProps) {
    const { t } = useTranslation()
    const { createOrder } = useOrdersMutation()
    const { data: suppliers } = useTiers("supplier")

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema) as any,
        defaultValues: {
            orderNumber: "",
            date: new Date(),
            expectedDeliveryDate: new Date(),
            supplierId: "",
            estimatedAmount: 0,
            status: 'draft',
        },
    })

    const onSubmit = async (values: OrderFormValues) => {
        try {
            await createOrder.mutateAsync(values)
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
                        name="orderNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("purchases.order_number") || "Numéro de commande"}</FormLabel>
                                <FormControl>
                                    <Input placeholder="BC-2026-001" {...field} />
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
                        name="expectedDeliveryDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t("purchases.expected_delivery") || "Date de livraison prévue"}</FormLabel>
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
                        name="estimatedAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("purchases.estimated_amount") || "Montant estimé"}</FormLabel>
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
                                        <SelectItem value="received">Reçu</SelectItem>
                                        <SelectItem value="cancelled">Annulé</SelectItem>
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
                        disabled={createOrder.isPending}
                        className="w-full sm:w-auto"
                    >
                        {createOrder.isPending && (
                            <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("common.save")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
