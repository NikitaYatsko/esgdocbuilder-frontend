import { useEffect, useState, useCallback, useRef } from "react";
import { productApi } from "@features/products/api/productApi";
import { useCache } from "@features/invoices/hooks/useCache";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [unitFilter, setUnitFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [rangeFilters, setRangeFilters] = useState({
        sellPriceMin: '',
        sellPriceMax: '',
        costPriceMin: '',
        costPriceMax: '',
        marginalityMin: '',
        marginalityMax: '',
        vatMin: '',
        vatMax: '',
    });

    const allProductsCache = useRef(null);
    const debounceTimeout = useRef(null);

    const normalizeResponse = (data) => {
        if (!data) return { products: [], pagination: null };

        const products = data?.content || data?.items || data?.products || (Array.isArray(data) ? data : []);
        const pagination = data?.pagination || data?.data?.pagination || (Array.isArray(products) ? { pages: 1, total: products.length } : null);

        return {
            products: Array.isArray(products) ? products : [],
            pagination
        };
    };

    const parseNumber = (value) => {
        if (value === '' || value === null || value === undefined) return null;
        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    };

    const applyNumericFilters = (items) => {
        const {
            sellPriceMin,
            sellPriceMax,
            costPriceMin,
            costPriceMax,
            marginalityMin,
            marginalityMax,
            vatMin,
            vatMax,
        } = rangeFilters;

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

        return items.filter((product) => {
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
    };

    const setFilterRange = useCallback((field, value) => {
        setRangeFilters((prev) => ({ ...prev, [field]: value }));
        setPage(1);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await productApi.getCategories();
            const categoriesData = response.data;
            setCategories(
                Array.isArray(categoriesData)
                    ? categoriesData
                    : categoriesData?.content || categoriesData?.items || []
            );
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setCategories([]);
        }
    };

    const fetchSearchProducts = async (term) => {
        try {
            return await productApi.search(term);
        } catch (err) {
            const status = err.response?.status;
            if (status === 500 || status === 404) {
                const fallback = await getAllProductsCached();
                const filtered = normalizeResponse(fallback).products.filter((product) => {
                    const name = String(product.name || product.title || "").toLowerCase();
                    return name.includes(term.toLowerCase());
                });
                return { data: filtered };
            }
            throw err;
        }
    };

    const getAllProductsCached = useCallback(async () => {
        if (allProductsCache.current) {
            return allProductsCache.current;
        }

        const response = await productApi.getAllProducts();
        allProductsCache.current = response.data;
        const { products: normalizedProducts } = normalizeResponse(response.data);
        setAllProducts(normalizedProducts);
        return response.data;
    }, []);

    const fetchProductsByCategory = async (categoryId) => {
        try {
            return await productApi.getByCategory(categoryId);
        } catch (err) {
            const status = err.response?.status;
            if (status === 500 || status === 404) {
                const fallback = await getAllProductsCached();
                const normalizedCategoryId = Number(categoryId);
                const filtered = normalizeResponse(fallback).products.filter((product) => {
                    const productCategoryId = product.categoryId ?? product.category?.id ?? null;
                    return Number(productCategoryId) === normalizedCategoryId;
                });
                return { data: filtered };
            }
            throw err;
        }
    };

    const fetchProductsByUnit = async (type) => {
        try {
            return await productApi.getByTypeOfUnit(type);
        } catch (err) {
            const status = err.response?.status;
            if (status === 500 || status === 404) {
                const fallback = await getAllProductsCached();
                const normalizedType = String(type).toUpperCase().trim();
                const filtered = normalizeResponse(fallback).products.filter((product) => {
                    const unit = String(product.typeOfUnit?.name || product.typeOfUnit || "").toUpperCase();
                    return unit === normalizedType;
                });
                return { data: filtered };
            }
            throw err;
        }
    };

    const fetchProducts = async (currentPage = 1, term = debouncedSearchTerm) => {
        const trimmedTerm = term?.trim();
        const isSearchActive = trimmedTerm && trimmedTerm.length >= 3;
        const activeCategory = categoryFilter === '' || categoryFilter === null || categoryFilter === undefined
            ? null
            : Number(categoryFilter);
        const activeUnit = unitFilter ? String(unitFilter).toUpperCase().trim() : '';
        const numericFilterActive = Object.values(rangeFilters).some((value) => value !== '');

        const hasAnyFilter = isSearchActive || activeCategory !== null || activeUnit || numericFilterActive;

        try {
            setLoading(true);

            if (hasAnyFilter) {
                // Используем кэш для локальной фильтрации
                const allData = await getAllProductsCached();
                let filteredProducts = normalizeResponse(allData).products;

                // Применяем фильтры в порядке: поиск -> категория -> единица -> диапазоны
                if (isSearchActive) {
                    filteredProducts = filteredProducts.filter((product) => {
                        const name = String(product.name || product.title || "").toLowerCase();
                        return name.includes(trimmedTerm.toLowerCase());
                    });
                }

                if (activeCategory !== null) {
                    filteredProducts = filteredProducts.filter((product) => {
                        const productCategoryId = product.categoryId ?? product.category?.id ?? null;
                        return Number(productCategoryId) === activeCategory;
                    });
                }

                if (activeUnit) {
                    filteredProducts = filteredProducts.filter((product) => {
                        const unit = String(product.typeOfUnit?.name || product.typeOfUnit || "").toUpperCase();
                        return unit === activeUnit;
                    });
                }

                if (numericFilterActive) {
                    filteredProducts = applyNumericFilters(filteredProducts);
                }

                // Для фильтрованных данных - локальная пагинация
                const totalItems = filteredProducts.length;
                const totalPages = Math.ceil(totalItems / limit);
                const startIndex = (currentPage - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

                setProducts(paginatedProducts);
                setPagination({ pages: totalPages, total: totalItems });

            } else {
                // Нет фильтров - используем API пагинацию
                const response = await productApi.getAll({ page: currentPage - 1, limit });
                const { products: normalizedProducts, pagination: normalizedPagination } = normalizeResponse(response.data);
                setProducts(normalizedProducts);
                setPagination(normalizedPagination);
            }

        } catch (err) {
            console.error('Error fetching products:', err);
            setProducts([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchTerm]);

    useEffect(() => {
        fetchProducts(page, debouncedSearchTerm);
    }, [page, debouncedSearchTerm, categoryFilter, unitFilter, limit, rangeFilters]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const nextPage = () => {
        if (pagination && page < pagination.pages) {
            setPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    const searchProducts = useCallback((term) => {
        setSearchTerm(term);
        setPage(1);
    }, []);

    const filterByCategory = useCallback((categoryId) => {
        const normalizedCategoryId = categoryId === '' || categoryId === null || categoryId === undefined
            ? null
            : Number(categoryId);
        setCategoryFilter(Number.isFinite(normalizedCategoryId) ? normalizedCategoryId : null);
        setPage(1);
    }, []);

    const filterByTypeOfUnit = useCallback((type) => {
        const normalizedType = type ? String(type).toUpperCase().trim() : '';
        setUnitFilter(normalizedType);
        setPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setCategoryFilter(null);
        setUnitFilter('');
        setRangeFilters({
            sellPriceMin: '',
            sellPriceMax: '',
            costPriceMin: '',
            costPriceMax: '',
            marginalityMin: '',
            marginalityMax: '',
            vatMin: '',
            vatMax: '',
        });
        setPage(1);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setPage(1);
    }, []);

    const goToPage = (p) => {
        if (p >= 1 && pagination && p <= pagination.pages) {
            setPage(p);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productApi.delete(id);
            allProductsCache.current = null;
            if (products.length === 1 && page > 1) {
                setPage(prev => prev - 1);
            } else {
                await fetchProducts(page, debouncedSearchTerm);
            }
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || "Ошибка удаления товара" 
            };
        }
    };

    const createProduct = async (productData) => {
        try {
            const response = await productApi.create(productData);
            allProductsCache.current = null;
            setPage(1);
            await fetchProducts(1, debouncedSearchTerm);
            return { success: true, data: response.data };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || "Ошибка создания товара" 
            };
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const response = await productApi.update(id, productData);
            allProductsCache.current = null;
            await fetchProducts(page, debouncedSearchTerm);
            return { success: true, data: response.data };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || "Ошибка обновления товара" 
            };
        }
    };

    return {
        products,
        allProducts,
        pagination,
        loading,
        searchTerm,
        categoryFilter,
        unitFilter,
        rangeFilters,
        categories,

        page,
        nextPage,
        prevPage,
        goToPage,

        refetch: fetchProducts,
        getAllProductsCached,
        searchProducts,
        filterByCategory,
        filterByTypeOfUnit,
        setFilterRange,
        clearFilters,
        clearSearch,
        deleteProduct,
        createProduct,
        updateProduct,
    };
};