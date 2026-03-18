import { useEffect, useState } from "react";
import { authApi } from "@features/auth/api/authApi";

export const useBank = () => {
    const [accounts, setAccounts] = useState([]);
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBankData = async () => {
        try {
            setLoading(true);
            const [accountsRes, operationsRes] = await Promise.all([
                authApi.getBalance(),
                authApi.getOperations()
            ]);

            setAccounts(accountsRes.data);

            const formattedOperations = operationsRes.data.map((op, index) => ({
                id: index,
                type: op.type === "INCOME" ? "Доход" : "Расход",
                amount: op.amount,
                comment: op.comment,
                account: op.accountName,
                date: op.createdAt,
            }));

            setOperations(formattedOperations);

        } catch (e) {
            console.error("Bank error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankData();
    }, []);

    const createOperation = async (newOp) => {
        try {
            const payload = {
                type: newOp.type === "Доход" ? "INCOME" : "EXPENSE",
                amount: parseFloat(newOp.amount),
                accountName: newOp.account,
                comment: newOp.comment,
            };

            await authApi.postOperation(payload);
            await fetchBankData();

        } catch (e) {
            console.error("Ошибка создания операции:", e);
        }
    };

    return { accounts, operations, loading, createOperation };
};