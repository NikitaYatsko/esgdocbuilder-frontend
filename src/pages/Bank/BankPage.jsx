import React, {useMemo, useCallback} from "react";
import {Box, Typography, styled} from "@mui/material";
import {MoneyBlock, BlocksRow} from "@features/transactions/components/MoneyBlock.jsx";
import {useBank} from "@features/transactions/hooks/useBank";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import CreateTransaction from "@features/transactions/components/CreateTransaction.jsx";
import HistoryIcon from "@mui/icons-material/History";
import PaginationBox from "@features/main/PaginationBox";

const transactionColumns = [
    {id: 'type', label: 'Тип', align: 'right'},
    {id: 'amount', label: 'Сумма', align: 'right'},
    {
        id: 'account',
        label: 'Счет',
        align: 'right',
        render: (value) => {
            if (value === "Bank") return "Банк";
            if (value === "Cashbox") return "Касса";
            return value;
        }
    },
    {id: 'comment', label: 'Комментарий', align: 'right'},
    {
        id: 'date',
        label: 'Дата',
        align: 'right',
        render: (value) =>
            value ? new Date(value).toLocaleString() : ''
    },
];

const SectionTitle = styled(Typography)(({theme}) => ({
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
}));

const MainContainer = styled(Box)({
    display: 'flex',
    gap: 24,
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
    marginLeft: 24,
    paddingLeft: 24,
});

const BankPage = () => {
    const {
        accounts,
        operations,
        loading,
        createOperation,
        page,
        pagination,
        nextPage,
        prevPage
    } = useBank();

    const {cashbox, bank} = useMemo(() => {
        let cashbox = null;
        let bank = null;

        for (const acc of accounts) {
            if (acc.name === "Cashbox") cashbox = acc;
            if (acc.name === "Bank") bank = acc;
        }
        return {cashbox, bank};
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

    return (
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
                            <HistoryIcon color="primary" sx={{fontSize: 28}}/>
                            История операций
                        </SectionTitle>
                        {console.log(operations[0])}
                        <TableComponent
                            columns={columns}
                            rows={operations}
                            showActions={false}
                            tableMinWidth="600px"
                            tableHeight={500}
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
                    <CreateTransaction
                        accounts={accounts}
                        onCreate={handleCreate}
                    />
                </RightContent>
            </MainContainer>
    );
};

export default BankPage;