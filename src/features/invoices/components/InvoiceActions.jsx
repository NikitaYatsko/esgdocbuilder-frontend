import { Box } from "@mui/material";
import { StyledButton } from "./styled/StyledComponents";

const InvoiceActions = ({ onAddItem, onDeleteInvoice }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton
                variant="contained"
                onClick={onAddItem}
            >
                Добавить товар
            </StyledButton>
            <StyledButton
                variant="outlined"
                color="error"
                onClick={onDeleteInvoice}
            >
                Удалить смету
            </StyledButton>
        </Box>
    );
};

export default InvoiceActions;