import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { productApi } from "@api/products/productApi";

export const useProductsQuery = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ["products", page, limit],
        queryFn: async () => {
            const response = await productApi.getAll({ page: page - 1, limit });
            return response.data;
        },
        staleTime: 2 * 60 * 1000,   // 2 минуты
        gcTime: 5 * 60 * 1000,      // 5 минут
        placeholderData: keepPreviousData     // для плавной пагинации
    });
};