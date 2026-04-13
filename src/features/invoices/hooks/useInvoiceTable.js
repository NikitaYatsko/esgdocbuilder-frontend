import { useMemo } from "react";

export const useInvoiceTable = (items) => {
    const columns = [
        { id: 'name', label: 'Наименование', align: 'left' },
        { id: 'quantity', label: 'Количество', align: 'center' },
        { id: 'price', label: 'Цена', align: 'right' },
        { id: 'marginality', label: 'Маржинальность', align: 'right' },
        { id: 'vat', label: 'НДС', align: 'center' },
        { id: 'total', label: 'Сумма', align: 'right' },
    ];

    const rows = useMemo(() => items.map((item) => ({
        id: item.id,
        name: item.nameProduct || item.productName || item.product?.name || "Товар",
        quantity: item.quantity,
        price: `${item.unitPrice || item.price}`,
        marginality: `${Math.round(item.marginality || 0)}`,
        vat: `${item.vatMultiplier || item.vat || 20}`,
        total: `${Math.round(item.totalPrice || item.total)}`,
    })), [items]);

    return { columns, rows };
};