import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInvoices } from "@features/invoices/hooks/useInvoices";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import { Box, Typography, Stack, Button } from "@mui/material";
import { useInvoiceTable } from "@features/invoices/hooks/useInvoiceTable";
import AddInvoiceButton from "@features/invoices/components/AddInvoiceButton";
import InvoiceModal from "@features/invoices/components/InvoiceModal.jsx";

const InvoicePage = () => {
    const { id } = useParams();

    const { fetchInvoiceById, addItem } = useInvoices();

    const [invoice, setInvoice] = useState(null);
    const [items, setItems] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const { columns, rows } = useInvoiceTable(items);

    useEffect(() => {
        const load = async () => {
            const data = await fetchInvoiceById(id);
            setInvoice(data);
            setItems(data?.items || []);
        };

        load();
    }, [id]);

    const handleEditItem = (row) => {
    const fullItem = items.find(item => item.id === row.id);

    setEditingItem(fullItem);
    setModalMode("editItem");
    setOpenModal(true);
};

    const handleSave = async (data) => {
        if (!invoice) return;

        setModalLoading(true);

        const payload = {
            productId: data.productId,
            quantity: data.quantity,
            unitPrice: data.price,
            vatMultiplier: data.vatTotal,
            marginality: data.marginality,
            totalPrice: data.total
        };

        const result = await addItem(invoice.id, payload);

        setModalLoading(false);

        if (result.success) {
            setOpenModal(false);

            const updated = await fetchInvoiceById(invoice.id);
            setInvoice(updated);
            setItems(updated?.items || []);
        } else {
            console.error(result.error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>

                <Typography variant="h4">
                    Смета #{invoice?.id}
                </Typography>

                <Stack direction="row" spacing={2}>

                    <AddInvoiceButton onClick={() => setOpenModal(true)}>
                        Добавить товар
                    </AddInvoiceButton>

                    <AddInvoiceButton onClick={() => console.log("print")}>
                        Печать
                    </AddInvoiceButton>

                </Stack>

            </Box>

            <Typography sx={{ mb: 3 }}>
                Название: {invoice?.invoiceName}
            </Typography>

            <TableComponent
                columns={columns}
                rows={rows}
                showActions={true}
                actionsColumn="actions"
                onEdit={handleEditItem}
                onDelete={(row) => console.log("delete item", row)}
                tableWidth="100%"
                tableMinWidth="600px"
            />
            <InvoiceModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSave={handleSave}
                loading={modalLoading}
                mode="addItem"
            />

        </Box>
    );
};

export default InvoicePage;