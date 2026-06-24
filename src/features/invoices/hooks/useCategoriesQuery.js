import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@api/invoices/invoiceApi";

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await invoiceApi.getCategories();
            return response.data;
            if (Array.isArray(data)) return data;

            return [];
        },

        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}