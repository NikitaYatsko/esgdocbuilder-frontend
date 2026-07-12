import { Box, Snackbar, Alert, Typography } from "@mui/material";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import InvoiceSearchBar from "@features/invoices/components/InvoiceSearchBar";
import InvoiceModal from "@features/invoices/components/InvoiceModal.jsx";
import AddInvoiceButton from "@features/invoices/components/AddInvoiceButton";
import { useState, useEffect } from "react";
import { useInvoices } from "@features/invoices/hooks/useInvoices.js";
import { StyledBox, StyledPaper } from "@features/invoices/components/styled/StyledComponents";
import { CenteredContainer } from "@/layouts/CenteredContainer.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";

const CreateInvoicePage = () => {

    useEffect(() => {
        document.title = 'Cметы';
    }, []);

    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const {
        invoices,
        deleteInvoice,
        createInvoice,
    } = useInvoices();

    const { user } = useAuth();
    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;

    const filteredInvoices = invoices.filter(invoice => 
        invoice.invoiceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddInvoice = () => {
        setModalMode('create');
        setOpenModal(true);
    };


    const handleSave = async (data) => {
        try {
            await createInvoice.mutateAsync({
                invoiceName: data.invoiceName,
                power: data.power,
                discountPercent: data.discountPercent || 0,
                vat_amount: 0,
                sumMarginality: 0,
                sum: 0,
                items: [],
            });

            setSnackbar({
                open: true,
                message: "Смета успешно создана",
                severity: "success",
            });

            setOpenModal(false);

        }
        catch (err) {

            setSnackbar({
                open: true,
                message: err.response?.data?.message ?? "Ошибка создания",
                severity: "error"
            });

        }
    };

    const handleDeleteInvoice = async (row) => {
        try {
            await deleteInvoice.mutateAsync(row.id);

            setSnackbar({
                open: true,
                message: "Смета успешно удалена",
                severity: "success"
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message ?? "Ошибка при удалении",
                severity: "error"
            });
        }
    };

    const handleSearch = (searchTerm) => {
         setSearchTerm(searchTerm);
    };

    const handleFilter = () => {
        // Логика открытия фильтра смет (если нужна)
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const invoiceColumns = [
        { id: "id", label: "ID", align: 'left' },
        { id: "invoiceName", label: "Название", align: 'left' },
        { id: "power", label: "Мощность", align: 'left' },
        ...(isAdmin ? [{ id: "sumMarginality", label: "Маржинальность", align: 'left' }] : []),
        { id: "sum", label: "Сумма", align: 'left' },
        { id: "actions", label: "Действия", align: 'right', }
    ];

    const invoiceRows = filteredInvoices.map((inv) => ({
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
                loading={createInvoice.isPending}
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