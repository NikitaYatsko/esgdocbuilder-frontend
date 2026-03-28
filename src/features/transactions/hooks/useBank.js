import { useEffect, useState } from "react";
import { authApi } from "@features/auth/api/authApi";

export const useBank = () => {
    const [accounts, setAccounts] = useState([]);
    const [operations, setOperations] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    const [loading, setLoading] = useState(true);

    const fetchBankData = async (currentPage = page) => {
        try {
            setLoading(true);

            const [accountsRes, operationsRes] = await Promise.all([
                authApi.getBalance(),
                authApi.getOperations({
                    params: {
                        page: currentPage - 1,
                        limit: limit
                    }
                })
            ]);

            setAccounts(accountsRes.data);

            const data = operationsRes.data;


            setPagination(data.pagination);

            const formattedOperations = data.content
                .map((op, index) => ({
                    id: op.id || index, 
                    type: op.type === "INCOME" ? "Доход" : "Расход",
                    amount: op.amount,
                    comment: op.comment,
                    account: op.accountName,
                    date: op.createdAt,
                }))

            setOperations(formattedOperations);

        } catch (e) {
            console.error("Bank error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankData(page);
    }, [page]);

    const createOperation = async (newOp) => {
        try {
            const payload = {
                type: newOp.type === "Доход" ? "INCOME" : "EXPENSE",
                amount: parseFloat(newOp.amount),
                accountName: newOp.account,
                comment: newOp.comment,
            };

            await authApi.postOperation(payload);
            await fetchBankData(page);

        } catch (e) {
            console.error("Ошибка создания операции:", e);
        }
    };

    const nextPage = () => {
        if (pagination && page < pagination.pages) {
            setPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    const goToPage = (p) => {
        if (p >= 1 && pagination && p <= pagination.pages) {
            setPage(p);
        }
    };
    

    return {
        accounts,
        operations,
        pagination,
        loading,

        page,
        nextPage,
        prevPage,
        goToPage,

        createOperation
    };
};