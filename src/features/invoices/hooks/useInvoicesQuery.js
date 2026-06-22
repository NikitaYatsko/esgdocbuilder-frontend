import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@api/invoices/invoiceApi";


const getInvoices = async () => {
    const response = await invoiceApi.getAllInvoices();
    return response.data;
}

export const useInvoicesQuery = () => {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: getInvoices,

        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}