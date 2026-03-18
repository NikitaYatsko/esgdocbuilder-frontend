import { Box, Typography, styled } from "@mui/material";
import ContentBlock from "@features/auth/components/ContentBlock.jsx";
import { MoneyBlock, BlocksRow } from "@features/auth/components/MoneyBlock.jsx";
import { useBank } from "@features/auth/hooks/useBank";
import TableComponent from "@features/auth/components/TableComponent.jsx";
import CreateTransaction from "@features/auth/components/CreateTransaction.jsx";

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
    width: '320px',
    marginLeft: 24,
    flexShrink: 0,
});


const BankPage = () => {
    const { accounts, operations, loading } = useBank();

    if (loading) {
        return <Typography variant="h6">Загрузка...</Typography>;
    }

    const cashbox = accounts.find(acc => acc.name === "Cashbox");
    const bank = accounts.find(acc => acc.name === "Bank");

    return (
        <ContentBlock>
            <MainContainer>
                <LeftContent>
                    <Box>
                        <SectionTitle variant="h5">Финансовые счета</SectionTitle>
                        <BlocksRow>
                            <MoneyBlock title="Касса" amount={cashbox?.balance || 0} />
                            <MoneyBlock title="Банк" amount={bank?.balance || 0} />
                        </BlocksRow>
                    </Box>

                    <Box>
                        <SectionTitle variant="h5">История операций</SectionTitle>
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
                    <CreateTransaction accounts={accounts} />
                </RightContent>
            </MainContainer>
        </ContentBlock>
    );
};

export default BankPage;