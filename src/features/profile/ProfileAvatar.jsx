import {Box, Avatar, Badge, styled, Typography} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const SmallAvatar = styled(Avatar)(({theme}) => ({
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

const AvatarContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));

const BigAvatar = styled(Avatar)(({theme}) => ({
    width: 150,
    height: 150,
    backgroundColor: theme.palette.primary.main,
    fontSize: 48,
}));

const CameraIcon = styled(PhotoCameraIcon)({
    fontSize: 18,
});

export const ProfileAvatar = ({user, getInitials, onAvatarChange}) => {
    return (
        <AvatarContainer>
            <Badge
                overlap="circular"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                badgeContent={
                    <SmallAvatar onClick={onAvatarChange}>
                        <CameraIcon/>
                    </SmallAvatar>
                }
            >
                <BigAvatar src={user?.imageUrl || undefined}>
                    {!user?.imageUrl && getInitials()}
                </BigAvatar>
            </Badge>


            <Typography variant="body1" color="text.primary">
                {user?.email}
            </Typography>
            <Typography variant="h6" color="text.primary">
                {user?.fullName}
            </Typography>
        </AvatarContainer>
    );
};