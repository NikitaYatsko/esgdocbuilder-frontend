import { useQuery } from "@tanstack/react-query";
import { productApi } from "@api/products/productApi";

export const useSearchProductsQuery = (searchTerm) => {
    return useQuery({
        queryKey: ["products-search", searchTerm],
        queryFn: async () => {
            const response = await productApi.search(searchTerm);
            return response.data;
        },
        enabled: !!searchTerm && searchTerm.trim().length >= 3,
        staleTime: 1 * 60 * 1000,   // 1 минута
        gcTime: 3 * 60 * 1000,
    });
};