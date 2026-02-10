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
import { useTiersMutation } from "@/hooks/use-tiers-mutation"
import { Icons } from "@/components/Icons"

const tierFormSchema = z.object({
    code: z.string().min(1, "Le code est requis"),
    name: z.string().min(2, "Le nom est requis"),
    type: z.enum(["client", "supplier", "both"]),
    nif: z.string().optional(),
    nis: z.string().optional(),
    rc: z.string().optional(),
    ai: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    address: z.string().optional(),
})

type TierFormValues = z.infer<typeof tierFormSchema>

interface TierFormProps {
    id?: string | null
    initialData?: Partial<TierFormValues>
    onSuccess?: () => void
}

export function TierForm({ id, initialData, onSuccess }: TierFormProps) {
    const { t } = useTranslation()
    const { createTier, updateTier } = useTiersMutation()
    const isEditing = !!id

    const form = useForm<TierFormValues>({
        resolver: zodResolver(tierFormSchema) as any,
        defaultValues: {
            code: initialData?.code ?? "",
            name: initialData?.name ?? "",
            type: initialData?.type ?? "client",
            nif: initialData?.nif ?? "",
            nis: initialData?.nis ?? "",
            rc: initialData?.rc ?? "",
            ai: initialData?.ai ?? "",
            phone: initialData?.phone ?? "",
            email: initialData?.email ?? "",
            address: initialData?.address ?? "",
        },
    })

    const isPending = createTier.isPending || updateTier.isPending

    const onSubmit = async (values: TierFormValues) => {
        try {
            if (isEditing) {
                await updateTier.mutateAsync({ id: id as string, data: values })
            } else {
                await createTier.mutateAsync(values)
            }
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
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("tiers.code")}</FormLabel>
                                <FormControl>
                                    <Input placeholder="CLI-001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("tiers.type")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="client">{t("tiers.client")}</SelectItem>
                                        <SelectItem value="supplier">{t("tiers.supplier")}</SelectItem>
                                        <SelectItem value="both">{t("tiers.both")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("tiers.name")}</FormLabel>
                            <FormControl>
                                <Input placeholder="Nom du tiers" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="nif"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("tiers.nif")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nis"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("tiers.nis")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("tiers.email")}</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@exemple.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("tiers.phone")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("tiers.address")}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
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
