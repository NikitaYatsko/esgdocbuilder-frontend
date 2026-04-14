import { useMemo } from "react";

export const useInvoiceTable = (items) => {
    const columns = [
        { id: 'name', label: 'Наименование', align: 'left' },
        { id: 'quantity', label: 'Количество', align: 'center' },
        { id: 'price', label: 'Цена', align: 'right' },
        { id: 'marginality', label: 'Маржинальность', align: 'right' },
        { id: 'vat', label: 'НДС', align: 'center' },
        { id: 'total', label: 'Сумма', align: 'right' },
        { id: "actions", label: "Действия", align: 'right', }
    ];

    const rows = useMemo(() => items.map((item) => ({
        id: item.id,
        name: item.nameProduct,
        quantity: item.quantity,
        price: item.unitPrice || item.price || 0,
        marginality: Math.round(item.marginality || 0),
        vat: Math.round(item.vatMultiplier || item.vat || 0),
        total: Math.round(item.totalPrice || item.total || 0),
        actions: "",
    })), [items]);


    return { columns, rows };
};