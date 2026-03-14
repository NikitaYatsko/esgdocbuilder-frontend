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

const CenteredBox = styled(Box)({
    textAlign: 'center',
});

const UserInfoBox = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4), 
    padding: theme.spacing(2),       
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius, 
}));

const EmailText = styled(Typography)({
    color: '#212121',
    variant: 'body2', 
});

const NameText = styled(Typography)({
    color: '#212121',
    variant: 'body2',
});

export const WelcomeContent = ({ user, onLogout }) => {
    return (
        <ContentWrapper>
            <Container maxWidth="md">
                <CenteredBox>
                    <WelcomeText>
                        Добро пожаловать!
                    </WelcomeText>

                    {user && (
                        <UserInfoBox>
                            <EmailText variant="body2">
                                <strong>Email:</strong> {user.email}
                            </EmailText>
                            {user.fullName && (
                                <NameText variant="body2">
                                    <strong>Имя:</strong> {user.fullName}
                                </NameText>
                            )}
                        </UserInfoBox>
                    )}

                    <LogoutButton
                        variant="contained"
                        color="primary"
                        onClick={onLogout}
                    >
                        Выйти
                    </LogoutButton>
                </CenteredBox>
            </Container>
        </ContentWrapper>
    );
};