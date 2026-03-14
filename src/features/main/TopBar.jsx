import {AppBar, Toolbar, Typography, styled} from "@mui/material";

const TopBarContainer = styled(AppBar)(({theme}) => ({
    height: 70,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    left: 70,
    width: 'calc(100% - 70px)',
}));

const LogoText = styled(Typography)(({theme}) => ({
    fontSize: 20,
    color: theme.palette.text.primary,
    fontWeight: 500
}));

const StyledToolbar = styled(Toolbar)({
    height: 70,
    minHeight: '70px !important',
});


export const TopBar = ({title = "ESG DocBuilder"}) => {
    return (
        <TopBarContainer position="fixed">
            <StyledToolbar>
                <LogoText>
                    {title}
                </LogoText>
            </StyledToolbar>
        </TopBarContainer>
    );
};