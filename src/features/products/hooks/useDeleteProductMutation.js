import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@api/products/productApi";

export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => productApi.delete(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products-all"] });
        }
    });
};