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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsMutation } from "@/hooks/use-settings-mutation"
import { Icons } from "@/components/Icons"

const companySettingsSchema = z.object({
    companyName: z.string().min(2, "Le nom est requis"),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    nif: z.string().optional(),
    nis: z.string().optional(),
    rc: z.string().optional(),
    ai: z.string().optional(),
})

type CompanySettingsValues = z.infer<typeof companySettingsSchema>

interface CompanySettingsFormProps {
    initialData?: Partial<CompanySettingsValues>
}

export function CompanySettingsForm({ initialData }: CompanySettingsFormProps) {
    const { t } = useTranslation()
    const { updateCompanySettings } = useSettingsMutation()

    const form = useForm<CompanySettingsValues>({
        resolver: zodResolver(companySettingsSchema) as any,
        defaultValues: {
            companyName: initialData?.companyName ?? "",
            address: initialData?.address ?? "",
            phone: initialData?.phone ?? "",
            email: initialData?.email ?? "",
            nif: initialData?.nif ?? "",
            nis: initialData?.nis ?? "",
            rc: initialData?.rc ?? "",
            ai: initialData?.ai ?? "",
        },
    })

    const onSubmit = async (values: CompanySettingsValues) => {
        try {
            await updateCompanySettings.mutateAsync({
                companyName: values.companyName,
                address: values.address || "",
                phone: values.phone || "",
                email: values.email || "",
                nif: values.nif || "",
                nis: values.nis || "",
                rc: values.rc || "",
                ai: values.ai || "",
            })
        } catch (error) {
            // Handled by hook
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-wrap gap-4">
                    <Card className="flex-1 basis-full lg:basis-[calc(50%-0.5rem)] border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>{t("settings.general_info")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.company_name")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.address")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel>{t("settings.phone")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.email")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="flex-1 basis-full lg:basis-[calc(50%-0.5rem)] border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>{t("settings.tax_info")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="nif"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.nif")}</FormLabel>
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
                                        <FormLabel>{t("settings.nis")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.rc")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ai"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.ai")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={updateCompanySettings.isPending}>
                        {updateCompanySettings.isPending && (
                            <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("common.save")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
