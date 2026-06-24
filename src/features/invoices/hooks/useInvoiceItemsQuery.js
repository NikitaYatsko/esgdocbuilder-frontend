import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@api/invoices/invoiceApi";

const getInvoiceItems = async (invoiceId) => {
    const response = await invoiceApi.getItems(invoiceId);
    return response.data;
}

export const useInvoiceItemsQuery = (invoiceId) => {
    return useQuery({
        queryKey: ["invoice-items", invoiceId],
        queryFn: () => getInvoiceItems(invoiceId),

        enabled: !!invoiceId,

        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}