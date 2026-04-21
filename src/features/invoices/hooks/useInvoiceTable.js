import { useMemo } from "react";

export const useInvoiceTable = (items) => {
    const columns = [
        { id: 'name', label: 'Наименование', align: 'left' },
        { id: 'quantity', label: 'Количество', align: 'left' },
        { id: 'price', label: 'Цена', align: 'left' },
        { id: 'marginality', label: 'Маржинальность', align: 'left' },
        { id: 'vat', label: 'НДС', align: 'left' },
        { id: 'total', label: 'Сумма', align: 'left' },
        { id: "actions", label: "Действия", align: 'center', }
    ];

    const rows = useMemo(() => items.map((item) => {
        const vatPerUnit = item.vatMultiplier || item.vat || 0;
        const totalVat = vatPerUnit * (item.quantity || 0);
        
        return {
            id: item.id || item.tempId,
            name: item.nameProduct,
            quantity: item.quantity,
            price: item.unitPrice || item.price || 0,
            marginality: Math.round(item.marginality || 0),
            vat: Math.round(totalVat), 
            total: Math.round(item.totalPrice || item.total || 0),
            actions: "",
            originalItem: {
                ...item,
                productId: item.productId  
            }
        };
    }), [items]);

    return { columns, rows };
};