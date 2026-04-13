import { useEffect, useState, useCallback } from "react";
import { invoiceApi } from "@features/invoices/api/invoiceApi";

export const useInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInvoices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await invoiceApi.getAll();
            const data = response.data;
            
            if (Array.isArray(data)) {
                setInvoices(data);
            } 
            else if (data && typeof data === 'object') {
                if (data.content && Array.isArray(data.content)) {
                    setInvoices(data.content);
                } 
                else if (data.items && Array.isArray(data.items)) {
                    setInvoices(data.items);
                }
                else if (data.data && Array.isArray(data.data)) {
                    setInvoices(data.data);
                }
                else {
                    setInvoices([]);
                }
            }
            else {
                setInvoices([]);
            }
            
        } catch (err) {
            console.error("Ошибка загрузки смет:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

const fetchItems = useCallback(async (invoiceId) => {
    try {
        setLoading(true);
        const response = await invoiceApi.getItems(invoiceId);
        
        console.log('Ответ от API /items:', response.data);
        
        let itemsData = [];
        if (Array.isArray(response.data)) {
            itemsData = response.data;
        } else if (response.data?.items && Array.isArray(response.data.items)) {
            itemsData = response.data.items;
        } else if (response.data?.content && Array.isArray(response.data.content)) {
            itemsData = response.data.content;
        }
        
        console.log('Извлечённые itemsData:', itemsData);
        
        setItems(itemsData);
        return itemsData;
    } catch (err) {
        console.error(`Ошибка загрузки позиций для сметы ${invoiceId}:`, err);
        setError(err);
        return [];
    } finally {
        setLoading(false);
    }
}, []);

    const selectInvoice = async (invoice) => {
        setSelectedInvoice(invoice);
        if (invoice) {
            const itemsData = await fetchItems(invoice.id);
            setItems(itemsData);
        } else {
            setItems([]);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

const createInvoice = async (invoiceData) => {
    try {
        const payload = {
            invoiceName: invoiceData.invoiceName,
            power: invoiceData.power,
            vat_amount: invoiceData.vat_amount || 0,
            sumMarginality: invoiceData.sumMarginality || 0,
            sum: invoiceData.sum || 0,
            items: invoiceData.items || []
        };
        const response = await invoiceApi.create(payload);
        await fetchInvoices();
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
            await fetchInvoices();
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
                setItems([]);
            }
            await fetchInvoices();
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
            if (selectedInvoice?.id === invoiceId) {
                await fetchItems(invoiceId);
            }
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
            if (selectedInvoice?.id === invoiceId) {
                await fetchItems(invoiceId);
            }
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
            if (selectedInvoice?.id === invoiceId) {
                await fetchItems(invoiceId);
            }
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
        fetchInvoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        addItem,
        updateItem,
        deleteItem,
    };
};