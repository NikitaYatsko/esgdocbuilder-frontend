import {
    Box,
    Typography,
    TextField,
    Autocomplete,
    Alert,
    Snackbar,
    CircularProgress
} from "@mui/material";

import TableComponent from "@features/auth/components/TableComponent.jsx";
import AddInvoiceButton from "@features/invoices/components/AddInvoiceButton";
import { useInvoicePage } from "@features/invoices/hooks/useInvoicePage.js";

const InvoicePage = () => {
    const {
        invoice,
        columns,
        rows,
        CATEGORIES,
        filteredProducts,

        selectedCategory,
        selectedProduct,
        quantity,
        loading,
        pdfLoading,
        snackbar,

        setSelectedCategory,
        setSelectedProduct,
        setQuantity,
        setSnackbar,

        handleAddItem,
        handleDeleteItem,
        handleSaveAll,
        totalSum,
        totalVat,
        handlePrint
    } = useInvoicePage();

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

                    <AddInvoiceButton
                        onClick={handlePrint}
                        disabled={loading || pdfLoading}
                    >
                        {pdfLoading ? <CircularProgress size={24} /> : "Печать"}
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