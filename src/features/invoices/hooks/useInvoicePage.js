import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useInvoiceTable } from "@features/invoices/hooks/useInvoiceTable";
import { useInvoices } from "@features/invoices/hooks/useInvoices";
import { useProducts } from "@features/products/hooks/useProducts";
import { useInvoicePdf } from "@features/invoices/hooks/useInvoicePdf";
import { invoiceApi } from "@api/invoices/invoiceApi";
import { useInvoiceQuery } from "@features/invoices/hooks/useInvoiceQuery";
import { useCategoriesQuery } from "@features/invoices/hooks/useCategoriesQuery";

export const useInvoicePage = () => {
    const { id } = useParams();

    const { updateInvoice } = useInvoices();
    const { products, allProducts, getAllProductsCached } = useProducts();
    const { downloadPdf, downloadPdfWithMargin, loadingPdf, loadingPdfWithMargin } = useInvoicePdf();

    const { data: invoiceData, isLoading: invoiceLoading, refetch: refetchInvoice } = useInvoiceQuery(id);

    const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategoriesQuery();

    const [invoice, setInvoice] = useState(null);
    const [dbItems, setDbItems] = useState([]);
    const [draftItems, setDraftItems] = useState([]);
    const [localDiscount, setLocalDiscount] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState("1");

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const categories = Array.isArray(categoriesData)
        ? categoriesData.map(cat => ({
            id: cat.id || cat._id,
            name: cat.name || cat.categoryName || "Без названия"
        }))
        : [];

    const allItems = [...dbItems, ...draftItems];
    const discountPercent = localDiscount || 0;
    const discountMultiplier = (100 - discountPercent) / 100;

    const baseSum = allItems.reduce((s, i) => s + (i.totalPrice || 0), 0);
    const totalSum = baseSum * discountMultiplier;

    const discountAmount = baseSum - totalSum;

    const getVatSettings = () => {
        const saved = localStorage.getItem("vat_settings");
        if (saved) {
            return JSON.parse(saved);
        }
        return { vatPercent: 20, vatDivisor: 120 };
    };

    const totalVat = totalSum * getVatSettings().vatPercent / getVatSettings().vatDivisor;

    const handleEditItem = (item) => {
        setEditingItem(item.originalItem);
        setEditModalOpen(true);
    };

    const sortedItems = useMemo(() => {
        return [...allItems].sort((a, b) => b.totalPrice - a.totalPrice);
    }, [allItems]);

    const { columns, rows } = useInvoiceTable(sortedItems, handleEditItem);

    const getCategoryId = (category) => {
        if (category === null || category === undefined) return null;
        if (typeof category === 'number') return category;
        if (typeof category === 'string' && category.trim() !== '') return null;
        const value = category.id ?? category._id ?? category.categoryId ?? category.value;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const getCategoryName = (category) => {
        if (!category) return "";
        if (typeof category === 'string') return category.trim();
        return String(category.name ?? category.categoryName ?? "").trim();
    };

    const getProductCategoryId = (product) => {
        if (!product) return null;
        const value = product.categoryId ?? product.category?.id ?? product.category?._id ?? null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const getProductCategoryName = (product) => {
        if (!product) return "";
        if (typeof product.category === 'string') return product.category.trim();
        return String(product.category?.name ?? product.category?.categoryName ?? "").trim();
    };

    const productSource = allProducts.length ? allProducts : products || [];

    const filteredProducts = productSource.filter((product) => {
        if (!selectedCategory) return false;

        const selectedCategoryId = getCategoryId(selectedCategory);
        const selectedCategoryName = getCategoryName(selectedCategory);
        const productCategoryId = getProductCategoryId(product);
        const productCategoryName = getProductCategoryName(product);

        if (selectedCategoryId !== null && productCategoryId !== null) {
            return selectedCategoryId === productCategoryId;
        }

        if (selectedCategoryName && productCategoryName) {
            return selectedCategoryName.toLowerCase() === productCategoryName.toLowerCase();
        }

        return false;
    });

    useEffect(() => {
        if (invoiceData) {
            setInvoice(invoiceData);

            const normalized = (invoiceData?.items || []).map(i => {
                let productId = i.productId || i.product?.id;

                if (!productId && i.nameProduct) {
                    const found = allProducts.find(p => p.name === i.nameProduct) || products.find(p => p.name === i.nameProduct);
                    productId = found?.id || null;
                }

                const product = allProducts.find(p => p.id === productId) || products.find(p => p.id === productId);

                return {
                    ...i,
                    productId,
                    productCategory: product?.category || null
                };
            });

            setDbItems(normalized);
            setDraftItems([]);
        }
    }, [invoiceData, allProducts, products]);

    useEffect(() => {
        const loadProducts = async () => {
            if (!allProducts.length) {
                await getAllProductsCached();
            }
        };
        loadProducts();
    }, [allProducts.length, getAllProductsCached]);

    useEffect(() => {
        if (invoiceData) {
            setLocalDiscount(invoiceData.discountPercent || 0);
        }
    }, [invoiceData]);

    const showError = (message, severity = "error") =>
        setSnackbar({ open: true, message, severity });

    const handleAddItem = () => {
        const qty = Number(quantity);

        if (!selectedProduct) return showError("Выберите товар", "warning");
        if (!qty || qty <= 0) return showError("Некорректное количество", "warning");

        const item = {
            tempId: Date.now(),
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            nameProduct: selectedProduct.name,
            quantity: qty,
            unitPrice: selectedProduct.sellPrice || 0,
            vatMultiplier: selectedProduct.vat || 0,
            marginality: (selectedProduct.marginality || 0) * qty,
            totalPrice: (selectedProduct.sellPrice || 0) * qty,
            isNew: true
        };

        setDraftItems(prev => [...prev, item]);
        setSelectedProduct(null);
        setQuantity("1");
    };

    const handleDeleteItem = (row) => {
        const isDraft = draftItems.some(
            i => i.tempId === row.id || i.tempId === row.tempId
        );

        if (isDraft) {
            setDraftItems(prev =>
                prev.filter(i => i.tempId !== row.id && i.tempId !== row.tempId)
            );
        } else {
            setDbItems(prev => prev.filter(i => i.id !== row.id));
        }
    };

    const handleSaveAll = async () => {
        if (!invoice) return;

        const items = [...dbItems, ...draftItems];

        const invalid = items.find(i => !i.productId);

        if (invalid) {
            showError(`Ошибка: товар без ID`);
            return;
        }

        const payloadBaseSum = items.reduce((s, i) => s + (i.totalPrice || 0), 0);
        const payloadBaseMarginality = items.reduce((s, i) => s + (i.marginality || 0), 0);
        const costSum = payloadBaseSum - payloadBaseMarginality;
        const sum = payloadBaseSum * discountMultiplier;
        const sumMarginality = sum - costSum;

        const payload = {
            invoiceName: invoice.invoiceName,
            power: invoice.power,
            discountPercent: localDiscount,
            vat_amount: totalVat,
            sumMarginality: sumMarginality,
            sum: sum,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                vatMultiplier: i.vatMultiplier,
                marginality: i.marginality,
                totalPrice: i.totalPrice
            }))
        };

        await updateInvoice.mutateAsync({
            id: invoice.id,
            invoiceData: payload
        });


        setDbItems(items);
        setDraftItems([]);
        await refetchInvoice();
        setSnackbar({ open: true, message: "Смета успешно сохранена", severity: "success" });
    };

    const normalizeItemsForPrint = (items) => {
        return items.map(item => {
            if (item.productId) return item;

            if (item.id && !item.productId) {
                return { ...item, productId: item.id };
            }

            if (item.originalItem?.productId) {
                return { ...item, productId: item.originalItem.productId };
            }

            if (item.product?.id) {
                return { ...item, productId: item.product.id };
            }

            return item;
        });
    };

    const handlePrint = async () => {
        if (!invoice?.id) return showError("ID сметы не найден");

        const itemsToPrint = normalizeItemsForPrint([...dbItems, ...draftItems]);

        const missingProductId = itemsToPrint.find(i => !i.productId);

        if (missingProductId) {
            console.error("Товар без productId для печати:", missingProductId);
            return showError(`Товар "${missingProductId.nameProduct || missingProductId.productName || 'без названия'}" не имеет ID товара. Сохраните смету перед печатью.`);
        }

        const result = await downloadPdf(invoice.id, invoice.invoiceName);

        if (!result.success) {
            showError(result.error);
        } else {
            setSnackbar({ open: true, message: "PDF сформирован", severity: "success" });
        }
    };

    const handlePrintWithMargin = async () => {
        if (!invoice?.id) return showError("ID сметы не найден");

        const itemsToPrint = normalizeItemsForPrint([...dbItems, ...draftItems]);

        const missingProductId = itemsToPrint.find(i => !i.productId);

        if (missingProductId) {
            console.error("Товар без productId для печати с маржой:", missingProductId);
            return showError(`Товар "${missingProductId.nameProduct || missingProductId.productName || 'без названия'}" не имеет ID товара. Сохраните смету перед печатью.`);
        }

        const result = await downloadPdfWithMargin(invoice.id, invoice.invoiceName);

        if (!result.success) {
            showError(result.error);
        } else {
            setSnackbar({ open: true, message: "PDF с маржой сформирован", severity: "success" });
        }
    };

    const handleUpdateItem = (updatedItemData) => {
        const editingTempId = editingItem?.tempId ?? editingItem?.id;
        const isDraft = draftItems.some(i => String(i.tempId) === String(editingTempId));

        if (isDraft) {
            setDraftItems(prev => prev.map(i =>
                String(i.tempId) === String(editingTempId)
                    ? {
                        ...i,
                        productId: updatedItemData.productId,
                        productName: updatedItemData.productName,
                        nameProduct: updatedItemData.productName,
                        quantity: updatedItemData.quantity,
                        unitPrice: updatedItemData.price,
                        vatMultiplier: updatedItemData.vatPerUnit,
                        marginality: updatedItemData.marginality,
                        totalPrice: updatedItemData.total
                    }
                    : i
            ));
        } else {
            const editingId = editingItem?.id ?? editingItem?.productId;
            setDbItems(prev => prev.map(i =>
                String(i.id) === String(editingId)
                    ? {
                        ...i,
                        productId: updatedItemData.productId,
                        productName: updatedItemData.productName,
                        nameProduct: updatedItemData.productName,
                        quantity: updatedItemData.quantity,
                        unitPrice: updatedItemData.price,
                        vatMultiplier: updatedItemData.vatPerUnit,
                        marginality: updatedItemData.marginality,
                        totalPrice: updatedItemData.total
                    }
                    : i
            ));
        }

        setEditModalOpen(false);
        setEditingItem(null);

        setSnackbar({
            open: true,
            message: "Товар обновлен",
            severity: "success"
        });
    };

    return {
        invoice,
        columns,
        rows,
        CATEGORIES: categories,
        categoriesLoading,
        filteredProducts,

        totalSum,
        totalVat,
        discountAmount,

        selectedCategory,
        selectedProduct,
        quantity,
        loadingPdf,
        loadingPdfWithMargin,
        snackbar,
        updateInvoice,
        localDiscount,

        setSelectedCategory,
        setSelectedProduct,
        setQuantity,
        setSnackbar,
        setLocalDiscount,

        editModalOpen,
        editingItem,
        handleEditItem,
        handleUpdateItem,
        setEditModalOpen,

        handleAddItem,
        handleDeleteItem,
        handleSaveAll,
        handlePrint,
        handlePrintWithMargin,
    };
};