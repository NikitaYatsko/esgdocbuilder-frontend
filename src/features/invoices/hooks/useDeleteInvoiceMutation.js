import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceApi } from "@api/invoices/invoiceApi";

export const useDeleteInvoiceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await invoiceApi.delete(id);
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoice", id] });
            queryClient.invalidateQueries({ queryKey: ["invoice-items", id] });
        },
        onError: (err) => {
            console.error("Ошибка удаления:", err);
        },
    })
}