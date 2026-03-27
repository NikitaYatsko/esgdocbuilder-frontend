import { Box, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import AddButton from "../../products/components/AddButton";

const HeaderContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '24px',
    color: theme.palette.text.primary,
}));

const PageHeader = ({ title, onAdd }) => {
    return (
        <HeaderContainer>
            <PageTitle variant="h5" component="h1">
                {title}
            </PageTitle>
            <AddButton onClick={onAdd} />
        </HeaderContainer>
    );
};

export default PageHeader;