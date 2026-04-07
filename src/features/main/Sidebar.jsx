import {Box, styled, Drawer, Divider, useTheme} from "@mui/material";
import {useState} from "react";
import {useAuth} from "@contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {useThemeContext} from "@contexts/ThemeContext";

import {BurgerButton} from './componentsSidebar/BurgerButton';
import {UserInfo} from './componentsSidebar/UserInfo';
import {MenuButton} from './componentsSidebar/MenuButton';
import {ThemeToggle} from './componentsSidebar/ThemeToggle';

import {
    ProfileIcon,
    ProductIcon,
    InvoiceIcon,
    BankIcon,
} from '@styles/icon/Icon';

import PeopleIcon from '@mui/icons-material/People';


const SidebarContainer = styled(Box)(({theme}) => ({
    width: 70,
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    zIndex: 1200,
    backgroundColor: theme.palette.background.paper
}));

const MenuContent = styled(Box)(({theme}) => ({
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column'
}));

const StyledDivider = styled(Divider)(({theme}) => ({
    borderColor: theme.palette.divider,
    width: '100%'
    
}));


export const Sidebar = ({onMenuClick}) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {user} = useAuth();
    const navigate = useNavigate();
    const {mode, togle} = useThemeContext();
    const theme = useTheme();

    const isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;


    const handleBurgerClick = () => {
        setIsMenuOpen(prev => !prev);
        onMenuClick?.();
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };


    const menuItems = [
        {
            label: "Мой профиль",
            icon: <ProfileIcon />,
            action: () => navigate('/profile')
        },
        {
            label: "Товар",
            icon: <ProductIcon/>,
            action: () => navigate("/products")
        },
        {
            label: "Создание фактуры",
            icon: <InvoiceIcon/>,
            action: () => navigate("/invoice")
        },
        {
            label: "Банк",
            icon: <BankIcon/>,
            action: () => navigate('/bank')
        }
    ];

    if (isAdmin) {
        menuItems.push({
            label: "Список сотрудников",
            icon: <PeopleIcon/>, 
            action: () => navigate('/users')
        });
    }

    const handleMenuClick = (action) => {
        action();
        handleCloseMenu();
    };


    return (
        <>
            <SidebarContainer>
                <BurgerButton onClick={handleBurgerClick}/>
            </SidebarContainer>

            <Drawer
                anchor="left"
                open={isMenuOpen}
                onClose={handleCloseMenu}
                PaperProps={{
                    sx: {
                        width: 345,
                        overflowX: 'hidden'
                    }
                }}
                SlideProps={{timeout: 300}}
                BackdropProps={{
                    sx: {backgroundColor: 'rgba(0,0,0,0.5)'}
                }}
            >
                <MenuContent>
                    {user && (
                        <>
                            <UserInfo user={user}/>

                            <StyledDivider/>

                            {menuItems.map((item, index) => (
                                <MenuButton
                                    key={index}
                                    icon={item.icon}
                                    onClick={() => handleMenuClick(item.action)}
                                >
                                    {item.label}
                                </MenuButton>
                            ))}

                            <StyledDivider/>

                            <ThemeToggle
                                mode={mode}
                                onToggle={togle}
                            />
                        </>
                    )}
                </MenuContent>
            </Drawer>
        </>
    );
};