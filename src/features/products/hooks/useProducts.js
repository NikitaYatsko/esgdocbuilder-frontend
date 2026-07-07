import { useState, useCallback, useEffect } from 'react';
import { useProductFilters } from './useProductFilters';
import { useProductData } from './useProductData';
import { useProductMutations } from './useProductMutations';
import { useCategoriesQuery } from './useCategoriesQuery';

export const useProducts = () => {
  // Фильтры
  const filters = useProductFilters();
  const {
    searchTerm,
    categoryFilter,
    unitFilter,
    rangeFilters,
    searchProducts,
    filterByCategory,
    filterByTypeOfUnit,
    setFilterRange,
    clearFilters,
    clearSearch,
  } = filters;

  // Пагинация
  const [page, setPage] = useState(1);

  // Данные
  const {
    products,
    allProducts,
    pagination,
    loading,
    error,
    refetch,
    hasFilters,
  } = useProductData({
    page,
    limit: 20,
    searchTerm,
    categoryFilter,
    unitFilter,
    rangeFilters,
  });

  useEffect(() => {
    if (pagination && page > pagination.pages) {
      setPage(1);
    }
  }, [pagination, page]);

  // Мутации
  const { createProduct, updateProduct, deleteProduct } = useProductMutations();

  // Категории
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoriesQuery();

  // Обработчики пагинации
  const nextPage = useCallback(() => {
    if (pagination && page < pagination.pages) setPage(p => p + 1);
  }, [pagination, page]);
  const prevPage = useCallback(() => {
    if (page > 1) setPage(p => p - 1);
  }, [page]);
  const goToPage = useCallback((p) => {
    if (p >= 1 && pagination && p <= pagination.pages) setPage(p);
  }, [pagination]);

  // Обёртки мутаций с коррекцией страницы
  const createProductWithReset = useCallback(async (data) => {
    const result = await createProduct(data);
    if (result.success) setPage(1);
    return result;
  }, [createProduct]);

  const deleteProductWithReset = useCallback(async (id) => {
    const result = await deleteProduct(id);
    if (result.success && products.length === 1 && page > 1) {
      setPage(p => p - 1);
    }
    return result;
  }, [deleteProduct, products.length, page]);

  return {
    // Данные
    products,
    allProducts,
    pagination,
    loading,
    error,
    categories,
    categoriesLoading,
    categoriesError,

    // Состояния фильтров (для UI)
    searchTerm,
    categoryFilter,
    unitFilter,
    rangeFilters,

    // Пагинация
    page,
    nextPage,
    prevPage,
    goToPage,

    // Действия
    refetch,
    searchProducts,
    filterByCategory,
    filterByTypeOfUnit,
    setFilterRange,
    clearFilters,
    clearSearch,

    // Мутации
    createProduct: createProductWithReset,
    updateProduct,
    deleteProduct: deleteProductWithReset,

    // Дополнительно
    hasFilters,
    getAllProductsCached: useCallback(() => allProducts || [], [allProducts]),
  };
};