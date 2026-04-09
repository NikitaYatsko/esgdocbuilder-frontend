import ContentBlock from "@features/auth/components/ContentBlock.jsx";
import { Box, Snackbar, Alert, Typography } from "@mui/material";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import InvoiceSearchBar from "@features/invoices/components/InvoiceSearchBar";
import InvoiceSelector from "@features/invoices/components/InvoiceSelector";
import InvoiceActions from "@features/invoices/components/InvoiceActions";
import InvoiceEmptyState from "@features/invoices/components/InvoiceEmptyState";
import InvoiceModal from "@features/invoices/components/InvoiceModal.jsx";
import AddInvoiceButton from "@features/invoices/components/AddInvoiceButton";
import { useState } from "react";
import { useInvoices } from "@features/invoices/hooks/useInvoices.js";
import { useInvoiceTable } from "@features/invoices/hooks/useInvoiceTable";
import { StyledBox, StyledPaper } from "@features/invoices/components/styled/StyledComponents";

const CreateInvoicePage = () => {

    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [modalLoading, setModalLoading] = useState(false);

    const {
        invoices,
        selectedInvoice,
        items,
        selectInvoice,
        deleteInvoice,
        createInvoice,
        addItem,
    } = useInvoices();

    const { columns, rows } = useInvoiceTable(items);

    const handleDeleteInvoice = async () => {
        if (!selectedInvoice) return;
        const result = await deleteInvoice(selectedInvoice.id);
        if (result.success) {
            setSnackbar({
                open: true,
                message: "Смета успешно удалена",
                severity: "success"
            });
        } else {
            setSnackbar({
                open: true,
                message: result.error || "Ошибка при удалении сметы",
                severity: "error"
            });
        }
    };

    const handleAddInvoice = () => {
        setModalMode('create');
        setOpenModal(true);
    };

    const handleAddItem = () => {
        if (!selectedInvoice) {
            setSnackbar({
                open: true,
                message: "Сначала выберите или создайте смету",
                severity: "warning"
            });
            return;
        }
        setModalMode('addItem');
        setOpenModal(true);
    };

    const handleSave = async (data) => {
        setModalLoading(true);

        let result;
        if (modalMode === 'create') {
            result = await createInvoice({ 
                invoiceName: data.invoiceName,
                power: data.power
            });
        } else {
            const itemPayload = {
                productId: data.productId,
                quantity: data.quantity,
                unitPrice: data.price,
                vatMultiplier: data.vat,
                totalPrice: data.total
            };
            result = await addItem(selectedInvoice.id, itemPayload);
        }

        setModalLoading(false);

        if (result.success) {
            setSnackbar({
                open: true,
                message: modalMode === 'create' ? "Смета успешно создана" : "Товар успешно добавлен",
                severity: "success"
            });
            setOpenModal(false);
        } else {
            setSnackbar({
                open: true,
                message: result.error || "Ошибка при сохранении",
                severity: "error"
            });
        }
    };

    const handleSearch = (searchTerm) => {
        console.log('Поиск смет:', searchTerm);
    };

    const handleFilter = () => {
        console.log('Открыть фильтр смет');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <ContentBlock centered={true}>
            <StyledBox>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Сметы
                    </Typography>
                    <AddInvoiceButton onClick={handleAddInvoice}>
                        Создать смету
                    </AddInvoiceButton>
                </Box>

                <InvoiceSearchBar onSearch={handleSearch} onFilter={handleFilter} />

                <StyledPaper>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <InvoiceSelector
                            invoices={invoices}
                            selectedInvoice={selectedInvoice}
                            onSelectInvoice={selectInvoice}
                        />

                        {selectedInvoice && (
                            <InvoiceActions
                                onAddItem={handleAddItem}
                                onDeleteInvoice={handleDeleteInvoice}
                            />
                        )}
                    </Box>

                    <Box>
                        {selectedInvoice ? (
                            rows.length > 0 ? (
                                <TableComponent
                                    columns={columns}
                                    rows={rows}
                                    onRowClick={() => {}}
                                    showActions={true}
                                    onEdit={() => {}}
                                    onDelete={() => {}}
                                    tableWidth="1200px"
                                    tableMinWidth="600px"
                                />
                            ) : (
                                <InvoiceEmptyState hasSelectedInvoice={true} />
                            )
                        ) : (
                            <InvoiceEmptyState hasSelectedInvoice={false} />
                        )}
                    </Box>
                </StyledPaper>

                <InvoiceModal
                    open={openModal}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    loading={modalLoading}
                    mode={modalMode}
                />

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: '8px' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </StyledBox>
        </ContentBlock>
    );
};

export default CreateInvoicePage;