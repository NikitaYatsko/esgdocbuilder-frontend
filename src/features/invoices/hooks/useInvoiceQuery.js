import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@api/invoices/invoiceApi";


const getInvoiceById = async (id) => {
    const response = await invoiceApi.getById(id);
    return response.data;
}

export const useInvoiceQuery = (id) => {
    return useQuery({
        queryKey: ["invoice", id],
        queryFn: () => getInvoiceById(id),

        enabled: !!id,
        
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}