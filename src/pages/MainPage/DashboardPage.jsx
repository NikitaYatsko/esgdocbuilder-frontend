import { Button, Typography, Container, Box, CircularProgress, AppBar, Toolbar, IconButton, useTheme, styled } from "@mui/material";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../features/main/Sidebar";
import { TopBar } from "../../features/main/TopBar"
import { WelcomeContent } from "../../features/main/WelcomeContent";

const LoadingContainer = styled(Container)({
    marginTop: 32, 
    display: 'flex',
    justifyContent: 'center',
});

const DashboardWrapper = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

export const DashboardPage = () => {
    const { logout, user, loading } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme()

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleMenuClick = () => {
        console.log('Menu clicked');
    };

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    return (
        <DashboardWrapper>
            <Sidebar onMenuClick={handleMenuClick} />
            <TopBar />
            <WelcomeContent user={user} onLogout={handleLogout} />
        </DashboardWrapper>
    );
};