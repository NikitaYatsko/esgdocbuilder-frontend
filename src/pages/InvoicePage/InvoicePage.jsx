import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Autocomplete,
    Alert,
    Snackbar
} from "@mui/material";

import TableComponent from "@features/auth/components/TableComponent.jsx";
import AddInvoiceButton from "@features/invoices/components/AddInvoiceButton";
import { useInvoiceTable } from "@features/invoices/hooks/useInvoiceTable";
import { useInvoices } from "@features/invoices/hooks/useInvoices";
import { useProducts } from "@features/products/hooks/useProducts";

const CATEGORIES = [
    { id: 1, name: "Панели" },
    { id: 2, name: "Инверторы" },
    { id: 3, name: "Система крепления" },
    { id: 4, name: "Солнечный кабель" },
    { id: 5, name: "Кабель-каналы" },
    { id: 6, name: "Щитовая IP65 DC" },
    { id: 7, name: "Щитовая IP65 AC" },
    { id: 8, name: "Кабеля и провода" },
    { id: 9, name: "Учет и измерение" },
    { id: 10, name: "Монтаж / Пусконаладка / Доставка" },
    { id: 11, name: "Пакеты документов" },
    { id: 12, name: "Спецтехника" },
    { id: 13, name: "Подстанционные работы" },
    { id: 14, name: "Трасса / Опоры / Земляные работы" },
    { id: 15, name: "Щитовые работы и замена" }
];

const InvoicePage = () => {
    const { id } = useParams();

    const { fetchInvoiceById, updateInvoice } = useInvoices();
    const { products } = useProducts();

    const [invoice, setInvoice] = useState(null);
    const [dbItems, setDbItems] = useState([]);
    const [draftItems, setDraftItems] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [quantity, setQuantity] = useState("1");

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const allItems = [...dbItems, ...draftItems];
    const { columns, rows } = useInvoiceTable(allItems);

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

                return {
                    ...i,
                    productId
                };
            });

            setDbItems(normalized);
            setDraftItems([]);
        };

        if (products.length) {
            load();
        }
    }, [id, fetchInvoiceById, products]);

    const handleAddItem = () => {
        const qty = Number(quantity);

        if (!selectedProduct) {
            return setSnackbar({
                open: true,
                message: "Выберите товар",
                severity: "warning"
            });
        }

        if (!qty || qty <= 0) {
            return setSnackbar({
                open: true,
                message: "Некорректное количество",
                severity: "warning"
            });
        }

        if (!selectedProduct.id) {
            return setSnackbar({
                open: true,
                message: "Ошибка: у товара нет ID",
                severity: "error"
            });
        }

        const item = {
            tempId: Date.now(),
            productId: selectedProduct.id,
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
            setSnackbar({
                open: true,
                message: "Ошибка: товар без идентификатора",
                severity: "error"
            });
            setLoading(false);
            return;
        }

        const totalSum = items.reduce((s, i) => s + (i.totalPrice || 0), 0);
        const totalMarginality = items.reduce((s, i) => s + (i.marginality || 0), 0);
        const vatAmount = items.reduce((s, i) => s + ((i.vatMultiplier || 0) * (i.quantity || 0)), 0);

        const payload = {
            invoiceName: invoice.invoiceName,
            power: invoice.power,
            vat_amount: vatAmount,
            sumMarginality: totalMarginality,
            sum: totalSum,
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

            const normalized = (updated?.items || []).map(i => {
                let productId = i.productId || i.product?.id;
                if (!productId && i.nameProduct) {
                    const found = products.find(p => p.name === i.nameProduct);
                    productId = found?.id || null;
                }
                return { ...i, productId };
            });

            setInvoice(updated);
            setDbItems(normalized);
            setDraftItems([]);

            setSnackbar({
                open: true,
                message: "Смета сохранена",
                severity: "success"
            });
        } else {
            setSnackbar({
                open: true,
                message: result.error || "Ошибка сохранения",
                severity: "error"
            });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h4">
                    Смета #{invoice?.id}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <AddInvoiceButton onClick={handleSaveAll} disabled={loading}>
                        {loading ? "Сохранение..." : "Сохранить"}
                    </AddInvoiceButton>
                    <AddInvoiceButton onClick={() => {}} disabled={loading}>
                        Печать
                    </AddInvoiceButton>
                </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Autocomplete
                    options={CATEGORIES}
                    getOptionLabel={(o) => o.name}
                    value={selectedCategory}
                    onChange={(_, v) => {
                        setSelectedCategory(v);
                        setSelectedProduct(null);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Категория" />
                    )}
                    sx={{ width: 250 }}
                />

                <Autocomplete
                    options={filteredProducts}
                    getOptionLabel={(o) => o.name}
                    value={selectedProduct}
                    onChange={(_, v) => setSelectedProduct(v)}
                    disabled={!selectedCategory}
                    renderInput={(params) => (
                        <TextField {...params} label="Товар" />
                    )}
                    sx={{ width: 300 }}
                />

                <TextField
                    label="Количество"
                    value={quantity}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                            setQuantity("");
                            return;
                        }
                        if (/^\d*\.?\d*$/.test(val)) {
                            setQuantity(val);
                        }
                    }}
                    onBlur={() => {
                        if (!quantity || Number(quantity) <= 0) {
                            setQuantity("1");
                        }
                    }}
                    sx={{ width: 120 }}
                />

                <AddInvoiceButton onClick={handleAddItem}>
                    Добавить
                </AddInvoiceButton>
            </Box>

            <Box sx={{ mt: 3 }}>
                <TableComponent
                    columns={columns}
                    rows={rows}
                    showActions={true}
                    actionsColumn="actions"
                    onDelete={handleDeleteItem}
                    tableWidth="100%"
                    tableMinWidth="600px"
                />
            </Box>
        </Box>
    );
};

export default InvoicePage;