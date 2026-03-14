import { TextField, styled } from "@mui/material";

export const StyledInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8,
        backgroundColor: theme.palette.background.paper,
        '& fieldset': {
            borderColor: theme.palette.divider,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        '&.Mui-focused': {
            color: theme.palette.primary.main,
        },
    },
    marginBottom: theme.spacing(2),
    width: '100%',
}));