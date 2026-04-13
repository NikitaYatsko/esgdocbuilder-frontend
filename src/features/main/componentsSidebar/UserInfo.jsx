import { Box, Avatar, Typography, styled } from "@mui/material";

const UserInfoContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
});

const UserAvatar = styled(Avatar)({
    width: 50,
    height: 50,
    backgroundColor: (theme) => theme.palette.primary.main,
});

const UserName = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    fontWeight: 500,
    color: theme.palette.text.primary,
    transition: theme.transitions.create('color', {
        duration: theme.transitions.duration.standard,
    }),
}));

const UserEmail = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.text.primary,
    transition: theme.transitions.create('color', {
        duration: theme.transitions.duration.standard,
    }),
}));

const getInitials = (user) => {
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

export const UserInfo = ({ user }) => {
    return (
        <UserInfoContainer>
            <UserAvatar src={user?.imageUrl || undefined}>
                {!user?.imageUrl && getInitials(user)}
            </UserAvatar>
            <Box sx={{ flex: 1 }}>
                {user.fullName && (
                    <UserName>
                        {user.fullName}
                    </UserName>
                )}
                <UserEmail>
                    {user.email}
                </UserEmail>
            </Box>
        </UserInfoContainer>
    );
};