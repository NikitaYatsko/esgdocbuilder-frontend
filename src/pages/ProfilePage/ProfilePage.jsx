import { Box, Container, Typography, Paper, Grid, Divider, useTheme } from "@mui/material";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Sidebar } from "@features/main/Sidebar";
import { TopBar } from "@features/main/TopBar";
import { useNavigate } from "react-router-dom";
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { ProfileAvatar } from '@features/profile/ProfileAvatar';
import { InfoCard } from '@features/profile/InfoCard';
import { ProfileActions } from '@features/profile/ProfileActions';
import { mockData } from '@features/profile/MockData';

export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleEditProfile = () => {
        console.log('Редактирование профиля');
    };

    const handleAvatarChange = () => {
        console.log('Смена аватарки');
    };

    const getInitials = () => {
        if (user?.name) {
            return user.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.charAt(0).toUpperCase() || '?';
    };

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            bgcolor: theme.palette.background.default,
        }}>
            <Sidebar />
            <TopBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: '70px',
                    marginTop: '70px',
                    width: 'calc(100% - 70px)',
                    height: 'calc(100vh - 70px)',
                    overflow: 'auto',
                    p: 3,
                }}
            >
                <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            width: '100%',
                        }}
                    >
                        <Grid container spacing={4}>
                            {/* Левая колонка - Аватар */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <ProfileAvatar 
                                    user={user}
                                    getInitials={getInitials}
                                    onAvatarChange={handleAvatarChange}
                                />
                            </Grid>

                            {/* Правая колонка - Информация */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Дополнительная информация
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <InfoCard
                                            icon={PhoneIcon}
                                            label="Телефон"
                                            value={mockData.phone}
                                        />
                                        <InfoCard
                                            icon={CalendarTodayIcon}
                                            label="Дата регистрации"
                                            value={mockData.registrationDate}
                                        />
                                        <InfoCard
                                            icon={AccessTimeIcon}
                                            label="Последняя активность"
                                            value={mockData.lastActive}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 4 }} />

                                <ProfileActions 
                                    onEdit={handleEditProfile}
                                    onLogout={handleLogout}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};