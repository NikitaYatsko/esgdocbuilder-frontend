import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@api/products/productApi";

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) =>
            productApi.update(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products-all"] });
            queryClient.invalidateQueries({ queryKey: ["products-search"] });
        }
    });
};