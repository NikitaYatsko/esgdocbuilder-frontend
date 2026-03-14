import { Box, styled, Drawer, Divider, useTheme } from "@mui/material";
import { useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "@contexts/ThemeContext";

import { BurgerButton } from './componentsSidebar/BurgerButton';
import { UserInfo } from './componentsSidebar/UserInfo';
import { MenuButton } from './componentsSidebar/MenuButton';
import { ThemeToggle } from './componentsSidebar/ThemeToggle';
import { 
    ProfileIcon, 
    ProductIcon, 
    InvoiceIcon, 
    BankIcon 
} from '@styles/icon/Icon';

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 70,
    backgroundColor: theme.palette.primary.main,
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

const MenuContent = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.standard,
    }),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.divider,
    width: '100%',
    transition: theme.transitions.create('border-color', {
        duration: theme.transitions.duration.standard,
    }),
}));

const StyledDrawerPaper = styled('div')({
    width: 345,
    backgroundColor: 'background.paper',
    backgroundImage: 'none',
    overflowX: 'hidden',
});

export const Sidebar = ({ onMenuClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { mode, togle } = useThemeContext();
    const theme = useTheme();

    const handleBurgerClick = () => {
        setIsMenuOpen(!isMenuOpen);
        if (onMenuClick) {
            onMenuClick();
        }
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        handleCloseMenu(); 
    };

    const handleProductClick = () => {
        console.log('Переход на Товар');
        handleCloseMenu();
    };

    const handleInvoiceClick = () => {
        console.log('Переход на Создание фактуры');
        handleCloseMenu();
    };

    const handleBankClick = () => {
        navigate("/BankPage")
        handleCloseMenu();
    };

    const handleThemeToggle = () => {
        togle();
    };

    return (
        <>
            <SidebarContainer sx={{ backgroundColor: theme.palette.background.paper}}>
                <BurgerButton onClick={handleBurgerClick} />
            </SidebarContainer>

            <Drawer
                anchor="left"
                open={isMenuOpen}
                onClose={handleCloseMenu}
                PaperComponent={StyledDrawerPaper}
                SlideProps={{
                    timeout: 300,
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }}
            >
                <MenuContent>
                    {user && (
                        <>
                            <UserInfo user={user} />
                            <StyledDivider/>
                            
                            <MenuButton
                                onClick={handleProfileClick}
                                icon={<ProfileIcon />}
                            >
                                Мой профиль
                            </MenuButton>
                            
                            <MenuButton
                                onClick={handleProductClick}
                                icon={<ProductIcon />}
                            >
                                Товар
                            </MenuButton>
                            
                            <MenuButton
                                onClick={handleInvoiceClick}
                                icon={<InvoiceIcon />}
                            >
                                Создания фактуры
                            </MenuButton>
                            
                            <MenuButton
                                onClick={handleBankClick}
                                icon={<BankIcon />}
                            >
                                Банк
                            </MenuButton>
                            
                            <StyledDivider/>
                            
                            <ThemeToggle mode={mode} onToggle={handleThemeToggle} />
                        </>
                    )}
                </MenuContent>
            </Drawer>
        </>
    );
};