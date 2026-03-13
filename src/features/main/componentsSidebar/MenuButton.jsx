import { Button, styled } from "@mui/material";

const StyledMenuButton = styled(Button)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    borderRadius: 0,
    padding: '12px 16px',
    backgroundColor: theme.palette.background.paper,
    textTransform: 'none',
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 400,
    transition: theme.transitions.create(['background-color', 'color'], {
        duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:focus': {
        outline: 'none',
    },
    '&:focus-visible': {
        outline: 'none',
    },
}));

export const MenuButton = ({ onClick, icon, children }) => {
    return (
        <StyledMenuButton
            onClick={onClick}
            startIcon={icon}
            fullWidth
        >
            {children}
        </StyledMenuButton>
    );
};