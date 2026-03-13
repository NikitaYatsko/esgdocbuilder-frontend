import { Box, Avatar, Badge, styled, Typography } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 32,
    height: 32,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    cursor: 'pointer',
    border: `2px solid ${theme.palette.background.paper}`,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

export const ProfileAvatar = ({ user, getInitials, onAvatarChange }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mb: 2,
        }}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                    <SmallAvatar onClick={onAvatarChange}>
                        <PhotoCameraIcon sx={{ fontSize: 18 }} />
                    </SmallAvatar>
                }
            >
                <Avatar
                    sx={{
                        width: 150,
                        height: 150,
                        bgcolor: 'primary.main',
                        fontSize: 48,
                    }}
                >
                    {getInitials()}
                </Avatar>
            </Badge>

            {user?.name && (
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                    {user.name}
                </Typography>
            )}

            <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
                {user?.email}
            </Typography>
        </Box>
    );
};