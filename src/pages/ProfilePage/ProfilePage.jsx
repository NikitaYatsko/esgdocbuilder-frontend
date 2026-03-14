import { Box, Container, Typography, Paper, Grid, Divider, useTheme, styled  } from "@mui/material";
import { useAuth } from "@contexts/AuthContext";
import { Sidebar } from "@features/main/Sidebar";
import { TopBar } from "@features/main/TopBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { ProfileAvatar } from '@features/profile/ProfileAvatar';
import { InfoCard } from '@features/profile/InfoCard';
import { ProfileActions } from '@features/profile/ProfileActions';
import { EditProfileModal } from '@features/profile/EditProfileModal';
import { mockData } from '@features/profile/MockData';

const PageContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)({
    flexGrow: 1,
    marginLeft: '70px',
    marginTop: '70px',
    width: 'calc(100% - 70px)',
    height: 'calc(100vh - 70px)',
    overflow: 'auto',
    padding: 24, 
});

const CenteredContainer = styled(Container)({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
});

const ProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 8, 
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
}));

export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleEditProfile = () => {
        console.log('Редактирование профиля');
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    const handleSaveProfile = (updatedData) => {
        console.log('Сохраненные данные:', updatedData);
        
        if (updateUser) {
            updateUser(updatedData);
        }
        
    };

    const handleAvatarChange = () => {
        console.log('Смена аватарки');
    };

    const getInitials = () => {
        if (user?.fullName) {
            return user.fullName
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.charAt(0).toUpperCase() || '?';
    };

    return (
         <PageContainer>
            <Sidebar />
            <TopBar />
            <MainContent component="main">
                <CenteredContainer maxWidth="lg">
                    <ProfilePaper elevation={0}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <ProfileAvatar 
                                    user={user}
                                    getInitials={getInitials}
                                    onAvatarChange={handleAvatarChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 8 }}>
                                <SectionTitle variant="h6" gutterBottom>
                                    Дополнительная информация
                                </SectionTitle>

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

                                <StyledDivider />

                                <ProfileActions 
                                    onEdit={handleEditProfile}
                                    onLogout={handleLogout}
                                />
                            </Grid>
                        </Grid>
                    </ProfilePaper>
                </CenteredContainer>
            </MainContent>

            <EditProfileModal
                open={isEditModalOpen}
                onClose={handleCloseModal}
                user={user}
                onSave={handleSaveProfile}
            />

        </PageContainer>
    );
};