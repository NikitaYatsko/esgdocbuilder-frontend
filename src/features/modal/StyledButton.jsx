import { Button, styled } from "@mui/material";

export const StyledButton = styled(Button)(({ theme, variant = 'contained' }) => ({
    borderRadius: 8,
    textTransform: 'none',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 500,
    ...(variant === 'contained' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.white,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
    ...(variant === 'outlined' && {
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: 'transparent',
        },
    }),
}));