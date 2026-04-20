import {Box, styled, Drawer, Divider, useTheme, Typography, Link, Stack} from "@mui/material";
import {useState} from "react";
import {useAuth} from "@contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {useThemeContext} from "@contexts/ThemeContext";
import LogoutIcon from '@mui/icons-material/Logout';
import {BurgerButton} from './componentsSidebar/BurgerButton';
import {UserInfo} from './componentsSidebar/UserInfo';
import {MenuButton} from './componentsSidebar/MenuButton';
import {ThemeToggle} from './componentsSidebar/ThemeToggle';
import SettingsIcon from '@mui/icons-material/Settings';

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
    zIndex: 1200, // важно
    display: 'flex',
    gap: "20px",
    flexDirection: 'column',
    padding: "10px 0 30px 0",
    alignItems: 'center',

    backgroundColor: theme.palette.background.paper,
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

const ContactInformation = styled(Box)(() => ({
    padding: "20px 40px",
    textAlign: "center",


}))

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
            icon: <ProfileIcon/>,
            action: () => navigate('/profile')
        },
        {
            label: "Создание фактуры",
            icon: <InvoiceIcon/>,
            action: () => navigate("/invoice")
        },

    ];

    if (isAdmin) {
        menuItems.push({
            label: "Список сотрудников",
            icon: <PeopleIcon/>,
            action: () => navigate('/users')
        });

        menuItems.push({
            label: "Настройки",
            icon: <SettingsIcon/>,
            action: () => navigate('/settings')
        });

        menuItems.push({
            label: "Банк",
            icon: <BankIcon/>,
            action: () => navigate('/bank')
        })
        menuItems.push({
            label: "Товар",
            icon: <ProductIcon/>,
            action: () => navigate("/products")
        },)
    }

    const handleMenuClick = (action) => {
        action();
        handleCloseMenu();
    };
    const {logout} = useAuth();

    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <SidebarContainer>
                <BurgerButton onClick={handleBurgerClick}/>
                <LogoutIcon onClick={handleLogout} sx={{cursor: "pointer"}}></LogoutIcon>
            </SidebarContainer>

            <Drawer
                anchor="left"
                open={isMenuOpen}
                onClose={handleCloseMenu}
                PaperProps={{
                    sx: {
                        width: 300,
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

                            <Stack flexDirection="column" justifyContent="space-between" height={"100%"}>
                                <ThemeToggle
                                    mode={mode}
                                    onToggle={togle}
                                />
                                <ContactInformation>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{fontSize: '12px'}}>
                                            Проблемы с работой приложения?
                                        </Typography>


                                        <Link
                                            href="https://t.me/outlinedinguilt"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            @outlinedinguilt
                                        </Link>
                                    </Box>

                                </ContactInformation>
                            </Stack>
                        </>
                    )}
                </MenuContent>
            </Drawer>
        </>
    );
};