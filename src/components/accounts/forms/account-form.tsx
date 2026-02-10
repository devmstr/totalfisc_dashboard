import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAccountsMutation } from "@/hooks/use-accounts-mutation"
import { Icons } from "@/components/Icons"

const accountFormSchema = z.object({
    accountNumber: z.string().min(1, "Le numéro de compte est requis"),
    label: z.string().min(2, "Le libellé est requis"),
    isSummary: z.boolean().default(false),
    isAuxiliary: z.boolean().default(false),
    parentAccountId: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface AccountFormProps {
    id?: string
    initialData?: Partial<AccountFormValues>
    onSuccess?: () => void
}

export function AccountForm({ id, initialData, onSuccess }: AccountFormProps) {
    const { t } = useTranslation()
    const { createAccount, updateAccount } = useAccountsMutation()

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema) as any,
        defaultValues: {
            accountNumber: initialData?.accountNumber ?? "",
            label: initialData?.label ?? "",
            isSummary: initialData?.isSummary ?? false,
            isAuxiliary: initialData?.isAuxiliary ?? false,
            parentAccountId: initialData?.parentAccountId ?? "",
        },
    })

    const onSubmit = async (values: AccountFormValues) => {
        try {
            const payload = {
                ...values,
                parentAccountId: values.parentAccountId || undefined,
            }

            if (id) {
                await updateAccount.mutateAsync({ id, data: payload })
            } else {
                await createAccount.mutateAsync(payload)
            }
            form.reset()
            onSuccess?.()
        } catch (error) {
            // Error handled by hook
        }
    }

    const isPending = createAccount.isPending || updateAccount.isPending

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("accounts.account_number")}</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: 411001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("accounts.label")}</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Client ABC" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="parentAccountId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Compte Parent (Optionnel)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: 411" {...field} />
                            </FormControl>
                            <FormDescription>
                                Laissez vide si c'est un compte racine.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col sm:flex-row gap-6 py-2">
                    <FormField
                        control={form.control}
                        name="isSummary"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Compte Collectif</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isAuxiliary"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Compte Auxiliaire</FormLabel>
                                </div>
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
