import { useQuery } from "@tanstack/react-query";
import {transactionsApi} from '@api/transactions/transactions.api';

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ["bank-categories"],
        queryFn: async () => {
            const response = await transactionsApi.getCategories();
            return response.data;
            if (Array.isArray(data)) return data;

            return [];
        },

        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}