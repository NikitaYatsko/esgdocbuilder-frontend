import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useInvoiceTable } from "@features/invoices/hooks/useInvoiceTable";
import { useInvoices } from "@features/invoices/hooks/useInvoices";
import { useProducts } from "@features/products/hooks/useProducts";
import { useInvoicePdf } from "@features/invoices/hooks/useInvoicePdf";
import { invoiceApi } from "@features/invoices/api/invoiceApi";
import { useCache } from "@features/invoices/hooks/useCache";

export const useInvoicePage = () => {
    const { id } = useParams();
    const { fetchWithCache } = useCache();

    const { fetchInvoiceById, updateInvoice } = useInvoices();
    const { products } = useProducts();
    const { downloadPdf, downloadPdfWithMargin, pdfLoadingNormal, pdfLoadingMargin } = useInvoicePdf();

    const [invoice, setInvoice] = useState(null);
    const [dbItems, setDbItems] = useState([]);
    const [draftItems, setDraftItems] = useState([]);

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState("1");

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const allItems = [...dbItems, ...draftItems];

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);

            const responseData = await fetchWithCache(
                "categories",
                async () => {
                    const res = await invoiceApi.getCategories();
                    return res.data;
                },
                10 * 60 * 1000 
            );

            let categoriesData = [];

            if (Array.isArray(responseData)) {
                categoriesData = responseData;
            } else if (responseData?.content) {
                categoriesData = responseData.content;
            } else if (responseData?.data) {
                categoriesData = responseData.data;
            }

            const formattedCategories = categoriesData.map((cat, index) => ({
                id: cat.id || index + 1,
                name: cat.name || cat.categoryName || cat
            }));

            setCategories(formattedCategories);

        } catch (error) {
            console.error("Ошибка загрузки категорий:", error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item.originalItem);
        setEditModalOpen(true);
    };

    const { columns, rows } = useInvoiceTable(allItems, handleEditItem);

    const filteredProducts = (products || []).filter(
        p => p.category === selectedCategory?.name
    );

    useEffect(() => {
        const load = async () => {
            const data = await fetchInvoiceById(id);
            setInvoice(data);

            const normalized = (data?.items || []).map(i => {
                let productId = i.productId || i.product?.id;

                if (!productId && i.nameProduct) {
                    const found = products.find(p => p.name === i.nameProduct);
                    productId = found?.id || null;
                }

                const product = products.find(p => p.id === productId);

                return {
                    ...i,
                    productId,
                    productCategory: product?.category || null
                };
            });

            setDbItems(normalized);
            setDraftItems([]);
        };

        if (products.length) load();
    }, [id, products]);

    useEffect(() => {
        fetchCategories();
    }, []);

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

        setLoading(true);

        const items = [...dbItems, ...draftItems];
        
        const invalid = items.find(i => !i.productId);

        if (invalid) {
            console.error("Товар без productId:", invalid);
            showError(`Ошибка: товар "${invalid.nameProduct || invalid.productName}" без идентификатора`);
            setLoading(false);
            return;
        }

        const payload = {
            invoiceName: invoice.invoiceName,
            power: invoice.power,
            vat_amount: items.reduce((s, i) => s + ((i.vatMultiplier || 0) * (i.quantity || 0)), 0),
            sumMarginality: items.reduce((s, i) => s + (i.marginality || 0), 0),
            sum: items.reduce((s, i) => s + (i.totalPrice || 0), 0),
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                vatMultiplier: i.vatMultiplier,
                marginality: i.marginality,
                totalPrice: i.totalPrice
            }))
        };

        const result = await updateInvoice(invoice.id, payload);
        setLoading(false);

        if (result.success) {
            const updated = await fetchInvoiceById(invoice.id);
            setInvoice(updated);
            setDbItems(updated.items || []);
            setDraftItems([]);
            setSnackbar({ open: true, message: "Смета сохранена", severity: "success" });
        } else {
            showError(result.error || "Ошибка сохранения");
        }
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

    const totalSum = allItems.reduce((s, i) => s + (i.totalPrice || 0), 0);

    const totalVat = allItems.reduce(
        (s, i) => s + ((i.vatMultiplier || 0) * (i.quantity || 0)),
        0
    );

    const handleUpdateItem = (updatedItemData) => {
        const isDraft = draftItems.some(i => i.tempId === editingItem?.id);

        if (isDraft) {
            setDraftItems(prev => prev.map(i =>
                (i.tempId === editingItem?.id)
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
            setDbItems(prev => prev.map(i =>
                i.id === editingItem?.id
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

        selectedCategory,
        selectedProduct,
        quantity,
        loading,
        pdfLoadingNormal,
        pdfLoadingMargin,
        snackbar,

        setSelectedCategory,
        setSelectedProduct,
        setQuantity,
        setSnackbar,

        editModalOpen,
        editingItem,
        handleEditItem,
        handleUpdateItem,
        setEditModalOpen,

        handleAddItem,
        handleDeleteItem,
        handleSaveAll,
        handlePrint,
        handlePrintWithMargin
    };
};