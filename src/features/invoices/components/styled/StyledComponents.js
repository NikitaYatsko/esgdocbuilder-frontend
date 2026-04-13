import { Button, Paper, Select, Box } from "@mui/material";
import styled from "@emotion/styled";

export const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    display: 'block',
    marginLeft: '50px',
    padding: '24px',
}));

export const StyledButton = styled(Button)(({ theme, color = 'primary' }) => ({
    height: 40,
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: 'none',
    ...(color === 'primary' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.white,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: 'none',
        },
    }),
    ...(color === 'error' && {
        backgroundColor: 'transparent',
        color: theme.palette.error.main,
        border: `1px solid ${theme.palette.error.main}`,
        '&:hover': {
            backgroundColor: theme.palette.error.main + '15',
            borderColor: theme.palette.error.dark,
        },
    }),
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

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: '24px',
    borderRadius: '12px',
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.paper,
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.primary,
    },
    '& .MuiSelect-select': {
        color: theme.palette.text.primary,
    }
}));