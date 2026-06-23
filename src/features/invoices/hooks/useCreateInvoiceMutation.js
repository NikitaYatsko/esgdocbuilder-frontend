import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceApi } from "@api/invoices/invoiceApi";

export const useCreateInvoiceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (invoiceData) => {
            const payload = {
                invoiceName: invoiceData.invoiceName,
                power: invoiceData.power,
                discountPercent: invoiceData.discountPercent || 0,
                vat_amount: invoiceData.vat_amount || 0,
                sumMarginality: invoiceData.sumMarginality || 0,
                sum: invoiceData.sum || 0,
                items: invoiceData.items || [],
            };
            const response = await invoiceApi.create(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
        onError: (err) => {
            console.error("Ошибка создания:", err);
        },
    });
}