import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceApi } from "@api/invoices/invoiceApi";

export const useUpdateInvoiceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, invoiceData }) => {
            const response = await invoiceApi.update(id, invoiceData);
            return response.data;
        },

        onSuccess: (updatedInvoice, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["invoices"],
            });

            queryClient.invalidateQueries({
                queryKey: ["invoice", variables.id],
            });
        },

        onError: (err) => {
            console.error("Ошибка обновления:", err);
        },
    });
}
