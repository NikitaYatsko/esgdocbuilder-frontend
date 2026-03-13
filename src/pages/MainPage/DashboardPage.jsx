import { Button, Typography, Container, Box, CircularProgress, AppBar, Toolbar, IconButton, useTheme } from "@mui/material";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../features/main/Sidebar";
import { TopBar } from "../../features/main/TopBar"
import { WelcomeContent } from "../../features/main/WelcomeContent";

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
            <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: theme.palette.background.default,
        }}>
            <Sidebar onMenuClick={handleMenuClick} />
            <TopBar />
            <WelcomeContent user={user} onLogout={handleLogout} />
        </Box>
    );
};