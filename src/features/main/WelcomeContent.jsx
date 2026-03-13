import { Container, Box, Typography, Button, styled } from "@mui/material";

const ContentWrapper = styled(Box)({
    marginLeft: 70,
    marginTop: 70,
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const WelcomeText = styled(Typography)(({ theme }) => ({
    fontSize: 48,
    fontWeight: 500,
    marginBottom: 32,
    color: theme.palette.text.primary,
    textAlign: 'center',
}));

const LogoutButton = styled(Button)({
    width: 242,
    height: 50,
    fontSize: '1rem',
    display: 'block',
    margin: '0 auto',
    '&:focus': {
        outline: 'none',
    },
    '&:focus-visible': {
        outline: 'none',
    },
    '&.Mui-focusVisible': {
        outline: 'none',
    },
    '&:focus:not(:focus-visible)': {
        outline: 'none',
    },
});

export const WelcomeContent = ({ user, onLogout }) => {
    return (
        <ContentWrapper>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center' }}>
                    <WelcomeText>
                        Добро пожаловать!
                    </WelcomeText>

                    {user && (
                        <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ color: '#212121' }}>
                                <strong>Email:</strong> {user.email}
                            </Typography>
                            {user.fullName && (
                                <Typography variant="body2" sx={{ color: '#212121' }}>
                                    <strong>Имя:</strong> {user.fullName}
                                </Typography>
                            )}
                        </Box>
                    )}

                    <LogoutButton
                        variant="contained"
                        color="primary"
                        onClick={onLogout}
                    >
                        Выйти
                    </LogoutButton>
                </Box>
            </Container>
        </ContentWrapper>
    );
};