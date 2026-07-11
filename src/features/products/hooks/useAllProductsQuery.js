import { useQuery } from "@tanstack/react-query";
import { productApi } from "@api/products/productApi";

export const useAllProductsQuery = () => {
    return useQuery({
        queryKey: ["products-all"],
        queryFn: async () => {
            const response = await productApi.getAllProducts();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};