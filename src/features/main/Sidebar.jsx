import { Box, IconButton, styled } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 70,
    backgroundColor: '#2786FF',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    zIndex: 1200,
}));

const BurgerButton = styled(IconButton)({
    width: 48,
    height: 48,
    color: '#FFFFFF',
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
});

export const Sidebar = ({ onMenuClick }) => {
    return (
        <SidebarContainer>
            <BurgerButton aria-label="menu" onClick={onMenuClick}>
                <MenuIcon sx={{ fontSize: 32 }} />
            </BurgerButton>
        </SidebarContainer>
    );
};