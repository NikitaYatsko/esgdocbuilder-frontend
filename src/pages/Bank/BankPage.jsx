import React, { useMemo } from "react";
import { Box, Typography, styled } from "@mui/material";
import ContentBlock from "@features/auth/components/ContentBlock.jsx";
import { MoneyBlock, BlocksRow } from "@features/transactions/components/MoneyBlock.jsx";
import { useBank } from "@features/transactions/hooks/useBank";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import CreateTransaction from "@features/transactions/components/CreateTransaction.jsx";
import HistoryIcon from "@mui/icons-material/History";

const transactionColumns = [
    { id: 'type', label: 'Тип', align: 'right' },
    { id: 'amount', label: 'Сумма', align: 'right' },
    { id: 'comment', label: 'Комментарий', align: 'right' },
];

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: 16,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
}));

const MainContainer = styled(Box)({
    display: 'flex',
    gap: 24,
    height: '100%',
    width: '1200px',
});

const LeftContent = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
});

const RightContent = styled(Box)({
    minWidth: '320px',
    marginLeft: 24,
    paddingLeft: 24,
});

const BankPage = () => {
    const { accounts, operations, loading, createOperation } = useBank();

    const { cashbox, bank } = useMemo(() => {
        return {
            cashbox: accounts.find(acc => acc.name === "Cashbox"),
            bank: accounts.find(acc => acc.name === "Bank"),
        };
    }, [accounts]);

    if (loading) {
        return <Typography variant="h6">Загрузка...</Typography>;
    }

    return (
        <ContentBlock centered={true}>
            <MainContainer>
                <LeftContent>
                    <Box>
                        <SectionTitle variant="h5">
                            Финансовые счета
                        </SectionTitle>

                        <BlocksRow>
                            <MoneyBlock
                                title="Касса"
                                amount={cashbox?.balance ?? 0}
                            />
                            <MoneyBlock
                                title="Банк"
                                amount={bank?.balance ?? 0}
                            />
                        </BlocksRow>
                    </Box>

                    <Box>
                        <SectionTitle variant="h5">
                            <HistoryIcon color="primary" sx={{ fontSize: 28 }} />
                            История операций
                        </SectionTitle>

                        <TableComponent
                            columns={transactionColumns}
                            rows={operations}
                            showActions={false}
                            tableWidth="100%"
                            tableMinWidth="600px"
                            tableHeight={500}
                        />
                    </Box>
                </LeftContent>

                <RightContent>
                    <CreateTransaction
                        accounts={accounts}
                        onCreate={createOperation}
                    />
                </RightContent>
            </MainContainer>
        </ContentBlock>
    );
};

export default BankPage;