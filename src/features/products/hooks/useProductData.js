import { useMemo, useCallback } from 'react';
import { useProductsQuery } from '@features/products/hooks/useProductsQuery';
import { useAllProductsQuery } from '@features/products/hooks/useAllProductsQuery';
import { useSearchProductsQuery } from '@features/products/hooks/useSearchProductsQuery';
import { useDebounce } from '@features/products/hooks/useDebounce';
import { normalizeResponse, parseNumber } from '@features/products/hooks/productUtils';

const DEFAULT_LIMIT = 20;

export const useProductData = ({
  page,
  limit = DEFAULT_LIMIT,
  searchTerm,
  categoryFilter,
  unitFilter,
  rangeFilters,
}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Флаги фильтров
  const isSearchActive = useMemo(() => {
    const trimmed = debouncedSearchTerm?.trim();
    return !!trimmed && trimmed.length >= 3;
  }, [debouncedSearchTerm]);

  const numericCategory = useMemo(() => {
    if (categoryFilter == null) return null;
    const val = Number(categoryFilter);
    return Number.isFinite(val) ? val : null;
  }, [categoryFilter]);

  const activeUnit = useMemo(() => {
    return unitFilter ? String(unitFilter).toUpperCase().trim() : '';
  }, [unitFilter]);

  const numericFilterActive = useMemo(() => {
    return Object.values(rangeFilters).some(v => v !== '');
  }, [rangeFilters]);

  const hasFilters = useMemo(() => {
    return isSearchActive || numericCategory !== null || activeUnit || numericFilterActive;
  }, [isSearchActive, numericCategory, activeUnit, numericFilterActive]);

  // Запросы
  const productsQuery = useProductsQuery(page, limit, { enabled: !hasFilters });
  const allProductsQuery = useAllProductsQuery({ enabled: hasFilters && !isSearchActive });
  const searchProductsQuery = useSearchProductsQuery(debouncedSearchTerm, { enabled: isSearchActive });

  // Применение числовых фильтров
  const applyNumericFilters = useCallback((items) => {
    const { sellPriceMin, sellPriceMax, costPriceMin, costPriceMax, marginalityMin, marginalityMax, vatMin, vatMax } = rangeFilters;
    const minMax = {
      sellPriceMin: parseNumber(sellPriceMin),
      sellPriceMax: parseNumber(sellPriceMax),
      costPriceMin: parseNumber(costPriceMin),
      costPriceMax: parseNumber(costPriceMax),
      marginalityMin: parseNumber(marginalityMin),
      marginalityMax: parseNumber(marginalityMax),
      vatMin: parseNumber(vatMin),
      vatMax: parseNumber(vatMax),
    };

    return items.filter(product => {
      const sellPrice = parseNumber(product.sellPrice);
      const costPrice = parseNumber(product.costPrice);
      const marginality = parseNumber(product.marginality);
      const vat = parseNumber(product.vat);

      if (minMax.sellPriceMin !== null && (sellPrice === null || sellPrice < minMax.sellPriceMin)) return false;
      if (minMax.sellPriceMax !== null && (sellPrice === null || sellPrice > minMax.sellPriceMax)) return false;
      if (minMax.costPriceMin !== null && (costPrice === null || costPrice < minMax.costPriceMin)) return false;
      if (minMax.costPriceMax !== null && (costPrice === null || costPrice > minMax.costPriceMax)) return false;
      if (minMax.marginalityMin !== null && (marginality === null || marginality < minMax.marginalityMin)) return false;
      if (minMax.marginalityMax !== null && (marginality === null || marginality > minMax.marginalityMax)) return false;
      if (minMax.vatMin !== null && (vat === null || vat < minMax.vatMin)) return false;
      if (minMax.vatMax !== null && (vat === null || vat > minMax.vatMax)) return false;
      return true;
    });
  }, [rangeFilters]);

  // Активный запрос
  const activeQuery = useMemo(() => {
    if (hasFilters) return isSearchActive ? searchProductsQuery : allProductsQuery;
    return productsQuery;
  }, [hasFilters, isSearchActive, searchProductsQuery, allProductsQuery, productsQuery]);

  // Обработка и фильтрация
  const filteredData = useMemo(() => {
    const { data, isLoading, isFetching, error, refetch } = activeQuery;

    if (error) {
      return { products: [], pagination: null, allProducts: [], loading: false, refetch, error };
    }
    if (!data) {
      return { products: [], pagination: null, allProducts: [], loading: isLoading || isFetching, refetch, error: null };
    }

    const normalized = normalizeResponse(data);
    let filtered = normalized.products.filter(p => !p.deleted);

    if (numericCategory !== null) {
      filtered = filtered.filter(product => {
        const productCategoryId = product.categoryId ?? product.category?.id ?? null;
        return Number(productCategoryId) === numericCategory;
      });
    }
    if (activeUnit) {
      filtered = filtered.filter(product => {
        const unit = String(product.typeOfUnit?.name || product.typeOfUnit || "").toUpperCase();
        return unit === activeUnit;
      });
    }
    if (numericFilterActive) {
      filtered = applyNumericFilters(filtered);
    }

    return {
      products: filtered,
      pagination: normalized.pagination,
      allProducts: filtered,
      loading: isLoading || isFetching,
      refetch,
      error: null,
    };
  }, [activeQuery, numericCategory, activeUnit, numericFilterActive, applyNumericFilters]);

  // Пагинация (локальная или серверная)
  const paginatedResult = useMemo(() => {
    const { products, pagination, allProducts, loading, refetch, error } = filteredData;

    if (loading || error) {
      return { products: [], pagination: null, allProducts: [], loading, refetch, error };
    }

    if (!hasFilters) {
      return { products, pagination, allProducts, loading, refetch, error };
    }

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginated = products.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      pagination: { pages: totalPages, total: totalItems },
      allProducts,
      loading,
      refetch,
      error,
    };
  }, [filteredData, hasFilters, page, limit]);

  return {
    products: paginatedResult.products,
    allProducts: paginatedResult.allProducts,
    pagination: paginatedResult.pagination,
    loading: paginatedResult.loading,
    error: paginatedResult.error,
    refetch: paginatedResult.refetch,
    hasFilters,
    isSearchActive,
  };
};