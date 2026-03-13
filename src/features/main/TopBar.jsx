import { AppBar, Toolbar, Box, Typography, styled } from "@mui/material";
import logoUrl from '@styles/img/logo.svg';

const TopBarContainer = styled(AppBar)(({ theme }) => ({
    height: 70,
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    left: 70,
    width: 'calc(100% - 70px)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
    fontSize: 20,
    color: theme.palette.primary.contrastText,
    fontWeight: 500
}));

export const TopBar = ({ logo = logoUrl, title = "DocBuilder" }) => {
    return (
        <TopBarContainer position="fixed">
            <Toolbar sx={{ height: 70, minHeight: '70px !important' }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{ width: 100, height: 90, mb: 1 }}
                />
                <LogoText>
                    {title}
                </LogoText>
            </Toolbar>
        </TopBarContainer>
    );
};