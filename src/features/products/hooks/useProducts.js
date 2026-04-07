import { useEffect, useState, useCallback } from "react";
import { productApi } from "@features/products/api/productApi";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async (currentPage = page) => {
        try {
            setLoading(true);

            const response = await productApi.getAll({
                page: currentPage - 1,
                limit
            });

            const data = response.data;

            setProducts(data.content || data.items || []);
            setPagination(data.pagination);

        } catch (err) {
            console.error("Ошибка загрузки продуктов:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchProducts(page);
    }, [page, fetchProducts]);

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

    const goToPage = (p) => {
        if (p >= 1 && pagination && p <= pagination.pages) {
            setPage(p);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productApi.delete(id);
            if (products.length === 1 && page > 1) {
                setPage(prev => prev - 1);
            } else {
                fetchProducts(page);
            }
            return { success: true };
        } catch (err) {
            console.error("Ошибка удаления:", err);
            return { 
                success: false, 
                error: err.response?.data?.message || "Ошибка удаления товара" 
            };
        }
    };

    const createProduct = async (productData) => {
        try {
            const response = await productApi.create(productData);
            setPage(1);
            await fetchProducts(1);
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Ошибка создания:", err);
            return { 
                success: false, 
                error: err.response?.data?.message || "Ошибка создания товара" 
            };
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const response = await productApi.update(id, productData);
            fetchProducts(page);
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Ошибка обновления:", err);
            return { 
                success: false, 
                error: err.response?.data?.message || "Ошибка обновления товара" 
            };
        }
    };

    return {
        products,
        pagination,
        loading,
        error,

        page,
        nextPage,
        prevPage,
        goToPage,

        refetch: fetchProducts,
        deleteProduct,
        createProduct,
        updateProduct,
    };
};