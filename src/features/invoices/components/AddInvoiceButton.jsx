import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Add } from '@mui/icons-material';

const StyledAddButton = styled(Button)(({ theme }) => ({
    height: 40,
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: 'none',
    },
    '&:focus': { 
        outline: 'none' 
    },
    '&:focus-visible': { 
        outline: 'none' 
    },
    '&:disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
    }
}));

const AddInvoiceButton = ({ onClick, children = 'Добавить смету', disabled = false }) => {
    return (
        <StyledAddButton
            variant="contained"
            startIcon={<Add />}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </StyledAddButton>
    );
};

export default AddInvoiceButton;