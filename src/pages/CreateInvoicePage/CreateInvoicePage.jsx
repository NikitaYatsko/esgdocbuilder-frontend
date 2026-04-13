import { Box, Snackbar, Alert, Typography } from "@mui/material";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import InvoiceSearchBar from "@features/invoices/components/InvoiceSearchBar";
import InvoiceModal from "@features/invoices/components/InvoiceModal.jsx";
import AddInvoiceButton from "@features/invoices/components/AddInvoiceButton";
import { useState } from "react";
import { useInvoices } from "@features/invoices/hooks/useInvoices.js";
import { StyledBox, StyledPaper } from "@features/invoices/components/styled/StyledComponents";
import { CenteredContainer } from "@/layouts/CenteredContainer.jsx";
import { useNavigate } from "react-router-dom";

const CreateInvoicePage = () => {

    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [modalLoading, setModalLoading] = useState(false);
    const navigate = useNavigate();

    const {
        invoices,
        deleteInvoice,
        createInvoice,
    } = useInvoices();

    const handleAddInvoice = () => {
        setModalMode('create');
        setOpenModal(true);
    };


    const handleSave = async (data) => {
        setModalLoading(true);

        const result = await createInvoice({
            invoiceName: data.invoiceName,
            power: data.power,
            vat_amount: 0,
            sumMarginality: 0,
            sum: 0,
            items: []
        });

        setModalLoading(false);

        if (result.success) {
            setSnackbar({
                open: true,
                message: "Смета успешно создана",
                severity: "success"
            });
            setOpenModal(false);
        } else {
            setSnackbar({
                open: true,
                message: result.error || "Ошибка при создании",
                severity: "error"
            });
        }
    };

    const handleDeleteInvoice = async (row) => {
        const result = await deleteInvoice(row.id);

        if (result.success) {
            setSnackbar({
                open: true,
                message: "Смета успешно удалена",
                severity: "success"
            });
        } else {
            setSnackbar({
                open: true,
                message: result.error || "Ошибка при удалении",
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

    const invoiceColumns = [
        { id: "id", label: "ID", align: 'center' },
        { id: "invoiceName", label: "Название", align: 'center' },
        { id: "power", label: "Мощность", align: 'center' },
        { id: "sumMarginality", label: "Маржинальность", align: 'center' },
        { id: "sum", label: "Сумма", align: 'center' },
        { id: "actions", label: "Действия", align: 'right', }
    ];

    const invoiceRows = invoices.map((inv) => ({
        ...inv,
        actions: ""
    }));

    return (

        <CenteredContainer width={1200}><StyledBox>
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
                <TableComponent
                    columns={invoiceColumns}
                    rows={invoiceRows}
                    showActions={true}
                    actionsColumn="actions"
                    onEdit={(row) => {
                        navigate(`/invoices/${row.id}`);
                    }}
                    onDelete={handleDeleteInvoice}
                    tableWidth="100%"
                    tableMinWidth="600px"
                />
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
        </CenteredContainer>

    );
};

export default CreateInvoicePage;