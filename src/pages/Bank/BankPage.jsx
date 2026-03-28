import React, { useMemo, useCallback } from "react";
import { Box, Typography, styled } from "@mui/material";
import ContentBlock from "@features/auth/components/ContentBlock.jsx";
import { MoneyBlock, BlocksRow } from "@features/transactions/components/MoneyBlock.jsx";
import { useBank } from "@features/transactions/hooks/useBank";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import CreateTransaction from "@features/transactions/components/CreateTransaction.jsx";
import HistoryIcon from "@mui/icons-material/History";
import PaginationBox from "@features/main/PaginationBox";

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
                            columns={columns}
                            rows={operations}
                            showActions={false}
                            tableWidth="100%"
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
        </ContentBlock>
    );
};

export default BankPage;