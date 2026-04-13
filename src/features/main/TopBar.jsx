import {AppBar, Toolbar, Typography, styled} from "@mui/material";

const TopBarContainer = styled(AppBar)(({theme}) => ({
    height: 70,
    width: 'calc(100% - 70px)',
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
}));

const LogoText = styled(Typography)(({theme}) => ({
    fontSize: 20,
    color: theme.palette.text.primary,
    fontWeight: 500
}));

const StyledToolbar = styled(Toolbar)({


});


export const TopBar = ({title = "DocBuilder"}) => {
    return (
        <TopBarContainer>
            <StyledToolbar>
                <LogoText>
                    {title}
                </LogoText>
            </StyledToolbar>
        </TopBarContainer>
    );
};