import { useState } from "react";
import { invoiceApi } from "@api/invoices/invoiceApi";
import { useInvoicesQuery } from "@features/invoices/hooks/useInvoicesQuery";
import { useInvoiceItemsQuery } from "@features/invoices/hooks/useInvoiceItemsQuery";
import { useInvoiceQuery } from "@features/invoices/hooks/useInvoiceQuery";
import { useCreateInvoiceMutation } from "@features/invoices/hooks/useCreateInvoiceMutation";
import { useUpdateInvoiceMutation } from "@features/invoices/hooks/useUpdateInvoiceMutation";
import { useDeleteInvoiceMutation } from "@features/invoices/hooks/useDeleteInvoiceMutation";

export const useInvoices = () => {
    const [selectedInvoice, setSelectedInvoice] = useState(null);  // текущий выбранный инвойс

    const {
        data: invoices = [],
        isLoading: loading,
        error,
    } = useInvoicesQuery(); // список всех инвойсов

    const { data: items = [], } = useInvoiceItemsQuery(selectedInvoice?.id); // позиции для выбранного инвойса

    const selectInvoice = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const { data: selectedInvoiceData, } = useInvoiceQuery(selectedInvoice?.id); // данные выбранного инвойса

    const createInvoiceMutation = useCreateInvoiceMutation(); // cоздание нового инвойса
    const updateInvoiceMutation = useUpdateInvoiceMutation(); // обновление существующего инвойса
    const deleteInvoiceMutation = useDeleteInvoiceMutation({
        onSuccess: (_, id) => {
            if (selectedInvoice?.id === id) {
                setSelectedInvoice(null);
            }
        }
    }); // удаление инвойса

    return {
        invoices,
        selectedInvoice,
        items,
        loading,
        error,

        selectInvoice,
        createInvoice: createInvoiceMutation,

        updateInvoice: updateInvoiceMutation,
        deleteInvoice: deleteInvoiceMutation,
    };
};