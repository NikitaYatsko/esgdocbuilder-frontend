import {
    Box,
    Typography,
    TextField,
    Autocomplete,
    Alert,
    Snackbar,
    CircularProgress
} from "@mui/material";
import { useEffect } from "react";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import AddInvoiceButton from "@features/invoices/components/AddInvoiceButton";
import InvoiceModal from "@features/invoices/components/InvoiceModal.jsx";
import { useInvoicePage } from "@features/invoices/hooks/useInvoicePage.js";
import { useAuth } from "@contexts/AuthContext";

const InvoicePage = () => {
    const {
        invoice,
        columns,
        rows,
        CATEGORIES,
        filteredProducts,
        allProducts,

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

        handleAddItem,
        handleDeleteItem,
        handleSaveAll,
        totalSum,
        totalVat,
        discountAmount,
        handlePrint,
        handlePrintWithMargin,

        editModalOpen,
        editingItem,
        handleEditItem,
        handleUpdateItem,
        setEditModalOpen
    } = useInvoicePage();

    useEffect(() => {
        if (invoice?.invoiceName) {
            document.title = invoice.invoiceName;
        }
    }, [invoice]);

    const { user } = useAuth();
    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;

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

            <InvoiceModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleUpdateItem}
                loading={updateInvoice.isPending}
                mode="editItem"
                initialData={editingItem}
                categories={CATEGORIES}
                // products={allProducts}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="h4">
                        Смета :{invoice?.invoiceName}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>

                    <TextField
                        label="Скидка %"
                        type="number"
                        value={localDiscount}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);

                            if (val === "") {
                                setLocalDiscount("");
                                return;
                            }

                            setLocalDiscount(Math.min(Math.max(val, 0), 20));
                        }}
                        InputProps={{
                            inputProps: { min: 0, max: 20 }
                        }}
                    />

                    <AddInvoiceButton onClick={handleSaveAll} disabled={updateInvoice.isPending}>
                        {updateInvoice.isPending ? "Сохранение..." : "Сохранить"}
                    </AddInvoiceButton>

                    <AddInvoiceButton
                        onClick={handlePrint}
                        disabled={loadingPdf}
                    >
                        {loadingPdf ? <CircularProgress size={24} /> : "Печать"}
                    </AddInvoiceButton>

                    {isAdmin && (
                        <AddInvoiceButton
                            onClick={handlePrintWithMargin}
                            disabled={loadingPdfWithMargin}
                        >
                            {loadingPdfWithMargin ? <CircularProgress size={24} /> : "Печать с маржой"}
                        </AddInvoiceButton>
                    )}
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
                    onChange={(e) => setQuantity(e.target.value)}
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
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    tableWidth="100%"
                    tableMinWidth="600px"
                />
            </Box>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ minWidth: 300 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="h6">Сумма НДС:</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {totalVat.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="h6">Скидка:</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {discountAmount.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">Общая сумма:</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {totalSum.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default InvoicePage;