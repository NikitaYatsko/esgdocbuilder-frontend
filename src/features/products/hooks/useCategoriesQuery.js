import { useQuery } from "@tanstack/react-query";
import { productApi } from "@api/products/productApi";


export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ["product-categories"],
        queryFn: async () => {
            const response = await productApi.getCategories();

            const data = response.data;

            return Array.isArray(data)
                ? data
                : data?.content || data?.items || [];
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};