import { useEffect, useState, useCallback } from "react";
import { invoiceApi } from "@api/invoices/invoiceApi";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useInvoicesQuery } from "@features/invoices/hooks/useInvoicesQuery";
import { useInvoiceItemsQuery } from "@features/invoices/hooks/useInvoiceItemsQuery";
import { useInvoiceQuery } from "@features/invoices/hooks/useInvoiceQuery";

export const useInvoices = () => {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const queryClient = useQueryClient();

    const {
        data: invoices = [],
        isLoading: loading,
        error,
        refetch,
    } = useInvoicesQuery();

    const { data: items = [], } = useInvoiceItemsQuery(selectedInvoice?.id);

    const refetchInvoice = useCallback(async (id) => {
        await queryClient.invalidateQueries({
            queryKey: ["invoice", id],
        });
    }, [queryClient]);

    const selectInvoice = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const { data: selectedInvoiceData, } = useInvoiceQuery(selectedInvoice?.id);

    const createInvoice = async (invoiceData) => {
        try {
            const payload = {
                invoiceName: invoiceData.invoiceName,
                power: invoiceData.power,
                discountPercent: invoiceData.discountPercent || 0,
                vat_amount: invoiceData.vat_amount || 0,
                sumMarginality: invoiceData.sumMarginality || 0,
                sum: invoiceData.sum || 0,
                items: invoiceData.items || []
            };
            const response = await invoiceApi.create(payload);
            await refetch();
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Ошибка создания:", err);
            return {
                success: false,
                error: err.response?.data?.message || "Ошибка создания сметы"
            };
        }
    };

    const updateInvoice = async (id, invoiceData) => {
        try {
            const response = await invoiceApi.update(id, invoiceData);
            await refetch();
            if (selectedInvoice?.id === id) {
                setSelectedInvoice(response.data);
            }
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Ошибка обновления:", err);
            return {
                success: false,
                error: err.response?.data?.message || "Ошибка обновления сметы"
            };
        }
    };

    const deleteInvoice = async (id) => {
        try {
            await invoiceApi.delete(id);
            if (selectedInvoice?.id === id) {
                setSelectedInvoice(null);
            }
            await refetch();
            return { success: true };
        } catch (err) {
            console.error("Ошибка удаления:", err);
            return {
                success: false,
                error: err.response?.data?.message || "Ошибка удаления сметы"
            };
        }
    };

    const addItem = async (invoiceId, itemData) => {
        try {
            const response = await invoiceApi.addItem(invoiceId, itemData);

            queryClient.invalidateQueries({
                queryKey: ["invoice-items", invoiceId],
            });

            return { success: true, data: response.data };
        } catch (err) {
            console.error("Ошибка добавления позиции:", err);
            return {
                success: false,
                error: err.response?.data?.message || "Ошибка добавления товара"
            };
        }
    };

    const updateItem = async (invoiceId, itemId, itemData) => {
        try {
            const response = await invoiceApi.updateItem(invoiceId, itemId, itemData);

            queryClient.invalidateQueries({
                queryKey: ["invoice-items", invoiceId],
            });

            return { success: true, data: response.data };
        } catch (err) {
            console.error("Ошибка обновления позиции:", err);
            return {
                success: false,
                error: err.response?.data?.message || "Ошибка обновления товара"
            };
        }
    };

    const deleteItem = async (invoiceId, itemId) => {
        try {
            await invoiceApi.deleteItem(invoiceId, itemId);

            queryClient.invalidateQueries({
                queryKey: ["invoice-items", invoiceId],
            });

            return { success: true };
        } catch (err) {
            console.error("Ошибка удаления позиции:", err);
            return {
                success: false,
                error: err.response?.data?.message || "Ошибка удаления товара"
            };
        }
    };

    return {
        invoices,
        selectedInvoice,
        items,
        loading,
        error,

        selectInvoice,
        createInvoice,

        updateInvoice,
        deleteInvoice,
        addItem,
        updateItem,
        deleteItem,
        refetchInvoice,
    };
};