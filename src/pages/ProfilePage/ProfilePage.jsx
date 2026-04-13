import {Typography, Paper, Grid, Divider, useTheme, styled,} from "@mui/material";
import {useAuth} from "@contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {useState, useRef} from "react";
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {authApi} from "@features/auth/api/authApi";
import {ProfileAvatar} from '@features/profile/ProfileAvatar';
import {InfoCard} from '@features/profile/InfoCard';
import {ProfileActions} from '@features/profile/ProfileActions';
import {EditProfileModal} from '@features/profile/EditProfileModal';
import {CenteredContainer} from "@/layouts/CenteredContainer.jsx";


const ProfilePaper = styled(Paper)(({theme}) => ({
    padding: theme.spacing(4),
    borderRadius: 8,
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    width: '100%'
}));

const SectionTitle = styled(Typography)(({theme}) => ({
    marginBottom: theme.spacing(3),
}));

const StyledDivider = styled(Divider)(({theme}) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
}));

export const ProfilePage = () => {
    const {user, logout, updateUser} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    const handleSaveProfile = async (updatedData) => {
        setIsLoading(true);
        try {
            const response = await authApi.updateProfile(updatedData);

            if (updateUser && response.data) {
                const fullName = `${updatedData.firstName} ${updatedData.lastName}`.trim();
                updateUser({
                    ...response.data,
                    firstName: updatedData.firstName,
                    lastName: updatedData.lastName,
                    fullName: fullName,
                    phone: updatedData.phone,
                });
            }

            setIsEditModalOpen(false);

        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fileInputRef = useRef(null);

    const handleAvatarChange = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            console.log("[avatar] Selected file:", file);

            const response = await authApi.uploadAvatar(file);

            console.log("[avatar] Response:", response.data);

            updateUser(response.data);

        } catch (error) {
            console.error("[avatar] Upload error:", error);
        }
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

    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.fullName || user?.email;

    const infoItems = [
        {
            icon: PhoneIcon,
            label: "Телефон",
            value: user.phone,
        },
        {
            icon: CalendarTodayIcon,
            label: "Дата регистрации",
            value: user.createdAt,
        },
        {
            icon: AccessTimeIcon,
            label: "Обязанности",
            value: user.roles?.[0]?.name,
        },
    ];

    return (


        <CenteredContainer fullHeight={true} width={1200}>
            <ProfilePaper elevation={0}>
                <Grid container spacing={4}>
                    <Grid size={{xs: 12, md: 4}}>
                        <ProfileAvatar
                            user={{...user, fullName: displayName}}
                            getInitials={getInitials}
                            onAvatarChange={handleAvatarChange}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{display: 'none'}}
                            onChange={handleFileSelect}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 8}}>
                        <SectionTitle variant="h6" gutterBottom>
                            Дополнительная информация
                        </SectionTitle>
                            <Grid container spacing={3}>
                                <Grid size={{xs: 12, md: 6}}>
                                    {infoItems.map((item, index) => (
                                        <InfoCard
                                            key={index}
                                            icon={item.icon}
                                            label={item.label}
                                            value={item.value}
                                        />
                                    ))}
                                </Grid>
                            </Grid>

                        <StyledDivider/>

                        <ProfileActions
                            onEdit={handleEditProfile}
                            onLogout={handleLogout}
                        />
                    </Grid>
                </Grid>
            </ProfilePaper>


            <EditProfileModal
                open={isEditModalOpen}
                onClose={handleCloseModal}
                user={user}
                onSave={handleSaveProfile}
            />
        </CenteredContainer>


    );
};