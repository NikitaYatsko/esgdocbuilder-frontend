import { Box, Typography, styled, Alert, Snackbar, Button, Tabs, Tab } from "@mui/material";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { MoneyBlock, BlocksRow } from "@features/transactions/components/MoneyBlock.jsx";
import { useBank } from "@features/transactions/hooks/useBank";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import CreateTransaction from "@features/transactions/components/CreateTransaction.jsx";
import HistoryIcon from "@mui/icons-material/History";
import PaginationBox from "@features/main/PaginationBox";
import { CenteredContainer } from "@/layouts/CenteredContainer.jsx";
import { PieChart } from '@mui/x-charts/PieChart';
import Diagram from "@features/transactions/components/Diagram.jsx";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ru } from 'date-fns/locale';

const transactionColumns = [
    { id: 'type', label: 'Тип', align: 'left' },
    { id: 'category', label: 'Категория', align: 'left' },
    { id: 'amount', label: 'Сумма', align: 'left' },
    {
        id: 'account',
        label: 'Счет',
        align: 'left',
        render: (value) => {
            if (value === "Bank") return "Банк";
            if (value === "Cashbox") return "Касса";
            return value;
        }
    },
    { id: 'comment', label: 'Комментарий', align: 'left' },
    {
    id: "date",
    label: "Дата",
    align: "left",
    render: (value) =>
        value
            ? new Date(value).toLocaleDateString("ru-RU")
            : "",
},
];

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
}));

const MainContainer = styled(Box)({
    display: 'flex',
    height: '100%',
});

const LeftContent = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
});

const RightContent = styled(Box)({
    minWidth: '350px',
    paddingLeft: 24,
});

const BankPage = () => {

    useEffect(() => {
        document.title = 'Банк';
    }, []);

    const {
        accounts,
        operations,
        loading,
        deleteOperation,
        createOperation,
        page,
        pagination,
        nextPage,
        prevPage,
        categories
    } = useBank();

    // ---- date

    const [state, setState] = useState({
        selection: {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    });

    const handleSelect = (ranges) => {
        setState({
            selection: ranges.selection,
        });
        console.log('Выбранный период:', {
            start: ranges.selection.startDate,
            end: ranges.selection.endDate,
        });
    };

    const [activeTab, setActiveTab] = useState(0); // 0 - создание, 1 - диаграмма, 2 - календарь

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // --------

    const { cashbox, bank } = useMemo(() => {
        let cashbox = null;
        let bank = null;

        for (const acc of accounts) {
            if (acc.name === "Cashbox") cashbox = acc;
            if (acc.name === "Bank") bank = acc;
        }
        return { cashbox, bank };
    }, [accounts]);

    const columns = useMemo(() => transactionColumns, []);

    const handleCreate = useCallback((data) => {
        return createOperation(data);
    }, [createOperation]);


    const moneyData = [
        {
            title: "Касса",
            amount: cashbox?.balance ?? 0,
        },
        {
            title: "Банк",
            amount: bank?.balance ?? 0,
        },
        {
            title: "Общее",
            amount: (bank?.balance ?? 0) + (cashbox?.balance ?? 0),
        },
    ];
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleRowDelete = async (row) => {
        if (window.confirm("Удалить операцию?")) {
            const result = await deleteOperation(row.id);

            if (result.success) {
                setSnackbar({
                    open: true,
                    message: "Операция успешно удалена",
                    severity: "success"
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.error || "Ошибка при удалении операции",
                    severity: "error"
                });
            }
        }
    };

    return (
        <CenteredContainer width={1400}>
            <MainContainer>
                <LeftContent>
                    <Box>
                        <SectionTitle variant="h5">
                            Финансовые счета
                        </SectionTitle>

                        <BlocksRow>
                            {moneyData.map((item) => (
                                <MoneyBlock
                                    key={item.title}
                                    title={item.title}
                                    amount={item.amount}
                                />
                            ))}
                        </BlocksRow>
                    </Box>
                    <Box>
                        <SectionTitle variant="h5">
                            <HistoryIcon color="primary" sx={{ fontSize: 28 }} />
                            История операций
                        </SectionTitle>
                        <TableComponent
                            columns={columns}
                            rows={operations}
                            showActions={true}
                            tableMinWidth="600px"
                            tableHeight={500}
                            isRowClickable={true}
                            onRowClick={handleRowDelete}
                        />

                        <PaginationBox
                            page={page}
                            totalPages={pagination?.pages}
                            onNext={nextPage}
                            onPrev={prevPage}
                        />
                    </Box>
                </LeftContent>

                <RightContent>
                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                        <Tab label="Создать" />
                        <Tab label="Диаграмма" />
                        <Tab label="Календарь" />
                    </Tabs>

                    {activeTab === 0 && (
                        <CreateTransaction
                            accounts={accounts}
                            categories={categories}
                            onCreate={handleCreate}
                        />
                    )}
                    {activeTab === 1 && (
                        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Diagram operations={operations} categories={categories} />
                        </Box>
                    )}
                    {activeTab === 2 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <DateRangePicker
                                ranges={[state.selection]}
                                onChange={handleSelect}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={1}
                                direction="vertical"
                                locale={ru}
                            />
                        </Box>
                    )}
                </RightContent>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </MainContainer>

        </CenteredContainer>
    );
};

export default BankPage;