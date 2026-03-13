import { IconButton, styled } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const StyledBurgerButton = styled(IconButton)(({ theme }) => ({
    width: 48,
    height: 48,
    color: theme.palette.common.white,
    outline: 'none',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:focus': {
        outline: 'none',
    },
    '&:focus-visible': {
        outline: 'none',
    },
}));

export const BurgerButton = ({ onClick }) => {
    return (
        <StyledBurgerButton aria-label="menu" onClick={onClick}>
            <MenuIcon sx={{ fontSize: 32 }} />
        </StyledBurgerButton>
    );
};