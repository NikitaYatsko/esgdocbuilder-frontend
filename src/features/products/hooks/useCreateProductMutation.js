import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@api/products/productApi";

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productApi.create,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products-all"] });
        }
    });
};