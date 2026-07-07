import { useCallback } from 'react';
import { useCreateProductMutation } from '@features/products/hooks/useCreateProductMutation';
import { useUpdateProductMutation } from '@features/products/hooks/useUpdateProductMutation';
import { useDeleteProductMutation } from '@features/products/hooks/useDeleteProductMutation';

export const useProductMutations = () => {
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const createProduct = useCallback(async (data) => {
    try {
      const response = await createMutation.mutateAsync(data);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Ошибка создания' };
    }
  }, [createMutation]);

  const updateProduct = useCallback(async (id, data) => {
    try {
      const response = await updateMutation.mutateAsync({ id, data });
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Ошибка обновления' };
    }
  }, [updateMutation]);

  const deleteProduct = useCallback(async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Ошибка удаления' };
    }
  }, [deleteMutation]);

  return { createProduct, updateProduct, deleteProduct };
};